/* ============================================================================
   Движок теста: адаптивная маршрутизация, счёт по осям, сборка результата.
   Чистая логика без DOM — чтобы её можно было прогнать тестами в Node.
   ========================================================================== */
(function (root) {
  "use strict";

  // 4 уровня сложности: starter=A1–A2, easy=A2–B1, core=B1–B2, hard=B2–C1
  var DIFF = ["starter", "easy", "core", "hard"];
  var WEIGHT = { starter: 1, easy: 2, core: 3, hard: 4 };
  var LEVEL_IDX = { starter: 0, easy: 1, core: 2, hard: 3 };
  var AXES = ["basics", "grammar", "register", "calque", "listening", "vocab"];
  var DIAGNOSTIC_COUNT = 12; // сколько диагностических айтемов показываем
  var BLOCK = 2;             // сложность пересматривается после каждых BLOCK ответов
  var BAND = ["A2", "B1", "B2", "C1"]; // уровень по ступени: starter..hard

  // самооценка уровня -> стартовый пул сложности
  var LEVEL_START = { a1a2: "starter", a2b1: "easy", b1b2: "core", b2c1: "hard" };

  function clampDiff(i) { return Math.max(0, Math.min(DIFF.length - 1, i)); }
  function up(d) { return DIFF[clampDiff(DIFF.indexOf(d) + 1)]; }
  function down(d) { return DIFF[clampDiff(DIFF.indexOf(d) - 1)]; }

  function createSession(data) {
    return {
      data: data,
      lang: "ru",             // язык интерфейса: ru | en | he (фильтр вопросов по langs)
      level: null, goal: null, situation: null, self_weak: null,
      difficulty: "core",     // текущий пул; уточняется setStartDifficulty
      asked: [],              // id уже показанных диагностических
      basics: [],             // ответы блока базовой грамматики (в том же виде, что answers); на band не влияют
      answers: [],            // {id, axis, level, correct(bool|null), skipped, chosen}
      speaking: [],           // {id, prompt, status: recorded|skipped, key, failed} — голосовые ответы
      block: [],              // результаты текущего блока (BLOCK ответов) для маршрутизации
      axisCount: {},          // axis -> сколько раз спросили (для баланса осей)
      cando: []               // {id, text, score, scoreLabel}
    };
  }

  // выставить стартовую сложность по самооценке уровня (вызвать перед диагностикой)
  function setStartDifficulty(session) {
    session.difficulty = LEVEL_START[session.level] || "core";
    return session.difficulty;
  }

  // порядок предпочтения сложности: текущий пул, затем ближайшие по дистанции
  function diffPreference(d) {
    var i = DIFF.indexOf(d);
    return DIFF.slice().sort(function (a, b) {
      var da = Math.abs(DIFF.indexOf(a) - i);
      var db = Math.abs(DIFF.indexOf(b) - i);
      if (da !== db) return da - db;
      return DIFF.indexOf(a) - DIFF.indexOf(b);
    });
  }

  // подходит ли вопрос выбранной цели (нет goals = подходит всем)
  function matchesGoal(q, goal) {
    return !q.goals || !goal || q.goals.indexOf(goal) !== -1;
  }

  // подходит ли вопрос языку интерфейса (нет langs = подходит всем)
  function matchesLang(q, lang) {
    return !q.langs || q.langs.indexOf(lang) !== -1;
  }

  // текст { ru, en, he } -> строка; для таблицы преподавателя всегда русский
  function ruText(x) { return x && typeof x === "object" ? x.ru : x; }

  // выбрать следующий диагностический айтем
  function selectNext(session) {
    var asked = {};
    session.asked.forEach(function (id) { asked[id] = true; });
    var avail = session.data.diagnostic.filter(function (q) { return !asked[q.id] && matchesLang(q, session.lang); });
    var goalPool = avail.filter(function (q) { return matchesGoal(q, session.goal); });
    if (goalPool.length) avail = goalPool;
    if (avail.length === 0) return null;

    // сузить до текущего пула сложности; если пуст — ближайший непустой
    var pool = [];
    var pref = diffPreference(session.difficulty);
    for (var i = 0; i < pref.length; i++) {
      pool = avail.filter(function (q) { return q.level === pref[i]; });
      if (pool.length) break;
    }
    if (!pool.length) pool = avail;

    // из пула — ось, которую спрашивали реже всего (баланс охвата)
    pool.sort(function (a, b) {
      var ca = session.axisCount[a.axis] || 0;
      var cb = session.axisCount[b.axis] || 0;
      if (ca !== cb) return ca - cb;
      return a.id < b.id ? -1 : 1;
    });
    return pool[0];
  }

  // записать ответ (chosen = индекс варианта; skipped=true для пропуска listening)
  function recordAnswer(session, q, chosen, skipped) {
    var correct = skipped ? null : (chosen === q.answer);
    session.answers.push({ id: q.id, axis: q.axis, level: q.level, correct: correct, skipped: !!skipped, chosen: skipped ? null : chosen });
    session.asked.push(q.id);
    session.axisCount[q.axis] = (session.axisCount[q.axis] || 0) + 1;
    session.block.push({ correct: correct, skipped: !!skipped });

    if (session.block.length >= BLOCK) {
      routeDifficulty(session);
      session.block = [];
    }
  }

  // адаптация сложности по итогам блока: всё верно — выше, всё неверно — ниже, иначе на месте
  // (пропуски listening нейтральны). Блок из 2: от starter до hard — за 6 ответов, ещё 6 — на подтверждение.
  function routeDifficulty(session) {
    var attempted = session.block.filter(function (b) { return !b.skipped; });
    if (attempted.length === 0) return;
    var correct = attempted.filter(function (b) { return b.correct; }).length;
    var ratio = correct / attempted.length;
    if (ratio >= 0.8) session.difficulty = up(session.difficulty);
    else if (ratio <= 0.34) session.difficulty = down(session.difficulty);
  }

  // ответ в блоке базовой грамматики: без адаптации сложности и без счёта в 12 диагностических
  function recordBasic(session, q, chosen) {
    session.basics.push({ id: q.id, axis: q.axis, level: q.level, correct: chosen === q.answer, skipped: false, chosen: chosen });
  }

  // с какого вопроса устной части начать: уровень по тесту B1 и выше — со второго
  function speakingStart(session) {
    return ["B1", "B2", "C1"].indexOf(computeBand(session)) !== -1 ? 1 : 0;
  }

  function isDiagnosticDone(session) {
    return session.answers.length >= DIAGNOSTIC_COUNT;
  }

  // выбрать 3 can-do под цель (добираем нейтральными, если не хватило)
  function pickCando(data, goal) {
    var primary = data.cando.filter(function (c) { return c.goals.indexOf(goal) !== -1; });
    var rest = data.cando.filter(function (c) { return c.goals.indexOf(goal) === -1; });
    return primary.concat(rest).slice(0, 3);
  }

  // итоговый CEFR-уровень: самая трудная ступень, где человек ответил минимум на 2 вопроса
  // и верно на 60% и больше. Не справился даже со starter — A1.
  // (Раньше брали среднюю сложность верных ответов — верные лёгкие вопросы тянули уровень вниз.)
  function computeBand(session) {
    var best = -1;
    DIFF.forEach(function (d, i) {
      var att = session.answers.filter(function (a) { return !a.skipped && a.level === d; });
      var ok = att.filter(function (a) { return a.correct; }).length;
      if (att.length >= 2 && ok / att.length >= 0.6) best = i;
    });
    return best < 0 ? "A1" : BAND[best];
  }

  function axisStatus(pct, axis) {
    // база должна быть без ошибок: одна ошибка из 7 — уже «средне»
    if (axis === "basics") return pct === 1 ? "strong" : pct >= 0.7 ? "medium" : "weak";
    if (pct >= 0.75) return "strong";
    if (pct >= 0.5) return "medium";
    return "weak";
  }

  var SELF_TO_AXIS = { grammar: "grammar", listening: "listening", speaking: "register", writing: "vocab" };

  function computeResults(session) {
    var per = {};
    AXES.forEach(function (a) { per[a] = { correctW: 0, totalW: 0, attempted: 0 }; });

    var sumCorrect = 0, sumTotal = 0;
    session.basics.concat(session.answers).forEach(function (ans) {
      if (ans.skipped) return;
      var w = WEIGHT[ans.level];
      per[ans.axis].totalW += w;
      per[ans.axis].attempted += 1;
      if (ans.correct) per[ans.axis].correctW += w;
      sumTotal += w;
      if (ans.correct) sumCorrect += w;
    });

    var overallRatio = sumTotal ? sumCorrect / sumTotal : 0;
    var band = computeBand(session);

    var axisResults = AXES.map(function (a) {
      var d = per[a];
      var pct = d.attempted ? d.correctW / d.totalW : null;
      return {
        axis: a,
        attempted: d.attempted,
        pct: pct,
        status: d.attempted ? axisStatus(pct, a) : "unchecked"
      };
    });

    var checked = axisResults.filter(function (r) { return r.status !== "unchecked"; });
    var weakest = checked.slice().sort(function (a, b) { return a.pct - b.pct; })[0] || null;

    var priorities = checked
      .filter(function (r) { return r.status !== "strong"; })
      .sort(function (a, b) { return a.pct - b.pct; })
      .slice(0, 3)
      .map(function (r) { return r.axis; });

    var delta = null;
    if (session.self_weak) {
      var selfAxis = SELF_TO_AXIS[session.self_weak] || null;
      var factWeak = weakest ? weakest.axis : null;
      if (selfAxis && factWeak) {
        delta = { selfAxis: selfAxis, factAxis: factWeak, match: selfAxis === factWeak };
      }
    }

    return {
      band: band,
      overallRatio: overallRatio,
      axes: axisResults,
      weakest: weakest,
      priorities: priorities,
      delta: delta,
      level: session.level,
      goal: session.goal,
      situation: session.situation,
      self_weak: session.self_weak
    };
  }

  // плоская строка для Google Sheets (лист Leads)
  function buildPayload(session, results, contact) {
    var axisPct = {};
    results.axes.forEach(function (r) {
      axisPct[r.axis] = r.pct == null ? "" : Math.round(r.pct * 100);
    });
    return {
      timestamp: new Date().toISOString(),
      name: contact.name || "",
      contact_type: contact.type || "",
      contact_value: contact.value || "",
      level_self: session.level || "",
      goal: session.goal || "",
      situation: session.situation || "",
      self_weak: session.self_weak || "",
      band: results.band,
      overall_pct: Math.round(results.overallRatio * 100),
      weakest_axis: results.weakest ? results.weakest.axis : "",
      priorities: results.priorities.join("|"),
      basics_pct: axisPct.basics,
      grammar_pct: axisPct.grammar,
      register_pct: axisPct.register,
      calque_pct: axisPct.calque,
      listening_pct: axisPct.listening,
      vocab_pct: axisPct.vocab,
      cando: session.cando.map(function (c) { return c.id + ":" + c.score; }).join("|"),
      answers: session.basics.concat(session.answers).map(function (a) {
        return a.id + ":" + (a.skipped ? "skip" : (a.correct ? "1" : "0"));
      }).join("|"),
      utm_source: contact.utm_source || "",
      utm_medium: contact.utm_medium || "",
      utm_campaign: contact.utm_campaign || "",
      referrer: contact.referrer || "",
      user_agent: contact.user_agent || "",
      test_lang: session.lang || "",
      speaking: session.speaking.map(function (sp) {
        return sp.id + ":" + (sp.status === "skipped" ? "skip" : sp.key ? "audio" : "fail");
      }).join("|")
    };
  }

  // расшифровка ответов для человекочитаемого листа «Answers»
  function buildDetail(session, data) {
    var byId = {};
    data.basics.concat(data.diagnostic).forEach(function (q) { byId[q.id] = q; });
    var rows = [];
    session.basics.concat(session.answers).forEach(function (a) {
      var q = byId[a.id];
      if (!q) return;
      var axisLabel = (data.axisMeta[a.axis] && ruText(data.axisMeta[a.axis].label)) || a.axis;
      rows.push({
        type: a.axis === "basics" ? "база" : "тест",
        axis: axisLabel,
        level: a.level,
        question: q.prompt,
        answer: a.skipped ? "— пропущено —" : q.options[a.chosen],
        correct: q.options[q.answer],
        result: a.skipped ? "пропущено" : (a.correct ? "верно" : "неверно")
      });
    });
    // устная часть: key — id записи в KV, кабинет показывает плеер
    (session.speaking || []).forEach(function (sp) {
      rows.push({
        type: "устно",
        axis: "",
        level: "",
        question: sp.prompt,
        answer: sp.status === "skipped" ? "— пропущено —" : sp.key ? "запись" : "запись не дошла",
        correct: "",
        result: "",
        audio: sp.key || ""
      });
    });
    (session.cando || []).forEach(function (c) {
      rows.push({
        type: "самооценка",
        axis: "",
        level: "",
        question: c.text,
        answer: c.scoreLabel || String(c.score),
        correct: "",
        result: ""
      });
    });
    return rows;
  }

  var api = {
    WEIGHT: WEIGHT, AXES: AXES, DIFF: DIFF, DIAGNOSTIC_COUNT: DIAGNOSTIC_COUNT,
    createSession: createSession,
    setStartDifficulty: setStartDifficulty,
    selectNext: selectNext,
    recordAnswer: recordAnswer,
    recordBasic: recordBasic,
    speakingStart: speakingStart,
    routeDifficulty: routeDifficulty,
    isDiagnosticDone: isDiagnosticDone,
    pickCando: pickCando,
    computeResults: computeResults,
    computeBand: computeBand,
    buildPayload: buildPayload,
    buildDetail: buildDetail
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.QuizEngine = api;
})(typeof window !== "undefined" ? window : this);
