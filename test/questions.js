/* ============================================================================
   Банк вопросов теста уровня. Контент правится ЗДЕСЬ, отдельно от движка.
   ----------------------------------------------------------------------------
   Оси (axis): grammar | register | calque | listening | vocab
   Сложность (level): starter (A1–A2) | easy (A2–B1) | core (B1–B2) | hard (B2–C1)
   answer — индекс правильного варианта в options (с нуля).
   goals — для каких целей вопрос подходит. НЕТ поля goals = подходит всем.
           Цели: interview | team | exam | general
   langs — на каком языке интерфейса показывать вопрос. НЕТ поля = на всех.
           Кальки с русского — ["ru","en"], кальки с иврита — ["he"].
   hint — перевод ФОРМУЛИРОВКИ вопроса (не вариантов!) по кнопке «Не понимаю
          вопрос»: { ru, he }. Есть у starter и easy вопросов. В английском
          интерфейсе подсказки нет — вопрос и так на английском.
   Тексты интерфейса и результатов — объекты { ru, en, he }.
   Сами вопросы и варианты — на английском, одинаковые для всех языков.
   Проверка после правок: node test/check.js
   ========================================================================== */

window.QUIZ_DATA = {

  /* --- БЛОК A: контекст. Не оценивается. ---------------------------------
     ctx_level задаёт СТАРТОВУЮ сложность адаптивного теста (движок дальше
     подстраивает вверх/вниз). Остальное — данные для преподавателя. */
  context: [
    {
      id: "ctx_level",
      key: "level",
      prompt: { ru: "Как вы сами оцениваете свой английский?",
                en: "How would you rate your English?",
                he: "איך אתם מעריכים את האנגלית שלכם?" },
      options: [
        { value: "a1a2", label: { ru: "Начинающий — знаю базовые слова и фразы (A1–A2)",
                                  en: "Beginner — I know basic words and phrases (A1–A2)",
                                  he: "מתחילים — מכירים מילים ומשפטים בסיסיים (A1–A2)" } },
        { value: "a2b1", label: { ru: "Ниже среднего — простые разговоры даются (A2–B1)",
                                  en: "Pre-intermediate — simple conversations are OK (A2–B1)",
                                  he: "מתחת לבינוני — שיחות פשוטות מצליחות (A2–B1)" } },
        { value: "b1b2", label: { ru: "Средний — говорю свободнее, но с ошибками (B1–B2)",
                                  en: "Intermediate — I speak more freely, but with mistakes (B1–B2)",
                                  he: "בינוני — מדברים די חופשי, אבל עם טעויות (B1–B2)" } },
        { value: "b2c1", label: { ru: "Продвинутый — чувствую себя уверенно (B2–C1)",
                                  en: "Advanced — I feel confident (B2–C1)",
                                  he: "מתקדמים — מרגישים בטוחים (B2–C1)" } }
      ]
    },
    {
      id: "ctx_goal",
      key: "goal",
      prompt: { ru: "С чего начнём — зачем вам английский сейчас?",
                en: "Let’s start here — why do you need English right now?",
                he: "נתחיל מהעיקר — בשביל מה אתם צריכים אנגלית עכשיו?" },
      options: [
        { value: "interview", label: { ru: "Пройти собеседование на английском",
                                       en: "To pass a job interview in English",
                                       he: "לעבור ראיון עבודה באנגלית" } },
        { value: "team", label: { ru: "Уверенно работать в команде: созвоны, стендапы, переписка",
                                  en: "To work confidently in a team: calls, stand-ups, messages",
                                  he: "לעבוד בביטחון בצוות: שיחות, ישיבות, התכתבות" } },
        { value: "exam", label: { ru: "Сдать экзамен (IELTS / TOEFL и подобные)",
                                  en: "To pass an exam (IELTS / TOEFL or similar)",
                                  he: "לעבור בחינה (IELTS / TOEFL וכדומה)" } },
        { value: "general", label: { ru: "Просто свободно говорить, без конкретной цели",
                                     en: "Just to speak freely, no specific goal",
                                     he: "פשוט לדבר בחופשיות, בלי מטרה מסוימת" } }
      ]
    },
    {
      id: "ctx_situation",
      key: "situation",
      prompt: { ru: "А что сейчас происходит в жизни?",
                en: "And what’s going on in your life right now?",
                he: "ומה קורה עכשיו בחיים?" },
      options: [
        { value: "job_search", label: { ru: "Ищу работу, готовлюсь к интервью",
                                        en: "Looking for a job, preparing for interviews",
                                        he: "מחפשים עבודה, מתכוננים לראיונות" } },
        { value: "working_hard", label: { ru: "Уже работаю, но на английском тяжело",
                                          en: "Already working, but English is hard",
                                          he: "כבר עובדים, אבל באנגלית קשה" } },
        { value: "deadline", label: { ru: "Впереди дедлайн — экзамен, оффер, переезд",
                                      en: "A deadline is coming — an exam, a job offer, a move",
                                      he: "יש דדליין — בחינה, הצעת עבודה, מעבר" } },
        { value: "self", label: { ru: "Учу спокойно, для себя",
                                  en: "Learning at my own pace, for myself",
                                  he: "לומדים בנחת, בשביל עצמנו" } }
      ]
    },
    {
      id: "ctx_selfweak",
      key: "self_weak",
      prompt: { ru: "Как вам кажется — что даётся тяжелее всего?",
                en: "What feels hardest for you?",
                he: "מה לדעתכם הכי קשה?" },
      options: [
        { value: "speaking", label: { ru: "Говорить: слова знаю, а фраза не собирается",
                                      en: "Speaking: I know the words, but the sentence won’t come together",
                                      he: "לדבר: מכירים את המילים, אבל המשפט לא מתחבר" } },
        { value: "listening", label: { ru: "Понимать быструю речь на слух",
                                       en: "Understanding fast speech",
                                       he: "להבין דיבור מהיר" } },
        { value: "grammar", label: { ru: "Грамматика: путаюсь во временах и конструкциях",
                                     en: "Grammar: I mix up tenses and structures",
                                     he: "דקדוק: מתבלבלים בזמנים ובמבנים" } },
        { value: "writing", label: { ru: "Письмо: письма, сообщения, эссе",
                                     en: "Writing: emails, messages, essays",
                                     he: "כתיבה: מיילים, הודעות, חיבורים" } }
      ]
    }
  ],

  /* --- БЛОК B: диагностика. Движок выбирает 12 с адаптацией под цель. ------ */
  diagnostic: [

    /* ---------- STARTER (A1–A2), нейтрально ---------- */
    { id: "gr_s1", axis: "grammar", level: "starter",
      prompt: "Choose the correct option: “She ___ a teacher.”",
      hint: { ru: "Выберите правильный вариант: «She ___ a teacher» (Она ___ учитель).",
              he: "בחרו את האפשרות הנכונה: «She ___ a teacher» (היא ___ מורה)." },
      options: ["am", "is", "are", "be"], answer: 1 },
    { id: "gr_s2", axis: "grammar", level: "starter",
      prompt: "Choose the correct option: “I ___ like coffee.”",
      hint: { ru: "Выберите правильный вариант: «I ___ like coffee» (Я ___ люблю кофе).",
              he: "בחרו את האפשרות הנכונה: «I ___ like coffee» (אני ___ אוהב/ת קפה)." },
      options: ["not", "don’t", "doesn’t", "no"], answer: 1 },
    { id: "vc_s1", axis: "vocab", level: "starter",
      prompt: "Choose the correct word: “___ is your name?”",
      hint: { ru: "Выберите слово: «___ is your name?» (Как вас зовут?)",
              he: "בחרו את המילה: «___ is your name?» (איך קוראים לך?)" },
      options: ["Who", "What", "How", "Where"], answer: 1 },
    { id: "vc_s2", axis: "vocab", level: "starter",
      prompt: "Choose the correct preposition: “I go to work ___ bus.”",
      hint: { ru: "Выберите предлог: «I go to work ___ bus» (Я езжу на работу ___ автобусе).",
              he: "בחרו את מילת היחס: «I go to work ___ bus» (אני נוסע/ת לעבודה ___ אוטובוס)." },
      options: ["on", "in", "by", "with"], answer: 2 },
    { id: "rg_s1", axis: "register", level: "starter",
      prompt: "You want to ask a stranger for help. The polite option:",
      hint: { ru: "Вы хотите вежливо попросить помощь у незнакомца. Какой вариант вежливый?",
              he: "אתם רוצים לבקש עזרה בנימוס מאדם זר. איזו אפשרות מנומסת?" },
      options: ["“Give me help.”", "“Help me now.”", "“Excuse me, could you help me?”", "“I need help you.”"], answer: 2 },
    { id: "rg_s2", axis: "register", level: "starter",
      prompt: "You meet someone new. What do you say?",
      hint: { ru: "Вы знакомитесь с новым человеком. Что сказать?",
              he: "אתם פוגשים אדם חדש. מה אומרים?" },
      options: ["“Nice to meet you.”", "“Give me your name.”", "“What you want?”", "“Go away.”"], answer: 0 },
    { id: "ls_s1", axis: "listening", level: "starter", audio: "audio/listen_starter.mp3",
      prompt: "Where is the speaker from?",
      hint: { ru: "Откуда говорящий?", he: "מאיפה הדובר/ת?" },
      options: ["Italy", "Spain", "France", "Germany"], answer: 1,
      transcript: "Hi, my name is Anna. I’m from Spain, and I live in Madrid." },

    /* ---------- GRAMMAR ---------- */
    { id: "gr_e1", axis: "grammar", level: "easy",
      prompt: "Choose the correct option: “I ___ here since 2021.”",
      hint: { ru: "Выберите вариант: «I ___ here since 2021» (Я работаю здесь с 2021 года).",
              he: "בחרו אפשרות: «I ___ here since 2021» (אני עובד/ת כאן מאז 2021)." },
      options: ["work", "worked", "have worked", "am working"], answer: 2 },
    { id: "gr_e2", axis: "grammar", level: "easy",
      prompt: "Choose the correct option: “If I ___ time tomorrow, I’ll call you.”",
      hint: { ru: "Выберите вариант: «If I ___ time tomorrow…» (Если у меня будет время завтра, я позвоню).",
              he: "בחרו אפשרות: «If I ___ time tomorrow…» (אם יהיה לי זמן מחר, אתקשר)." },
      options: ["will have", "have", "had", "would have"], answer: 1 },
    { id: "gr_c1", axis: "grammar", level: "core",
      prompt: "Choose the correct option: “By the time it started, she ___ the work.”",
      options: ["finished", "has finished", "had finished", "was finishing"], answer: 2 },
    { id: "gr_c2", axis: "grammar", level: "core",
      prompt: "Choose the correct option: “I wish I ___ more confident when I speak.”",
      options: ["am", "was", "were", "would be"], answer: 2 },
    { id: "gr_h1", axis: "grammar", level: "hard",
      prompt: "Choose the correct option: “___ harder, he would have passed.”",
      options: ["If he studies", "Had he studied", "Has he studied", "Would he study"], answer: 1 },
    { id: "gr_h2", axis: "grammar", level: "hard",
      prompt: "Choose the correct option: “It’s high time we ___ this properly.”",
      options: ["address", "addressed", "will address", "have addressed"], answer: 1 },

    /* ---------- CALQUE: кальки с русского (интерфейс RU и EN) ---------- */
    { id: "cq_s1", axis: "calque", level: "starter", langs: ["ru", "en"],
      prompt: "Which sentence is correct?",
      hint: { ru: "Какое предложение верное? (о возрасте — «мне 25 лет»)" },
      options: ["“I have 25 years.”", "“I am 25 years old.”"], answer: 1 },
    { id: "cq_s2", axis: "calque", level: "starter", langs: ["ru", "en"],
      prompt: "Which sentence is correct?",
      hint: { ru: "Какое предложение верное? («я согласен»)" },
      options: ["“I am agree with you.”", "“I agree with you.”"], answer: 1 },
    { id: "cq_e2", axis: "calque", level: "easy", langs: ["ru", "en"],
      prompt: "Which sentence is correct?",
      hint: { ru: "Какое предложение верное? («мне это очень нравится»)" },
      options: ["“I very like it.”", "“I like it very much.”"], answer: 1 },
    { id: "cq_e3", axis: "calque", level: "easy", langs: ["ru", "en"],
      prompt: "Which sentence is correct?",
      hint: { ru: "Какое предложение верное? («я интересуюсь музыкой»)" },
      options: ["“I am interesting in music.”", "“I am interested in music.”"], answer: 1 },
    { id: "cq_e1", axis: "calque", level: "core", langs: ["ru", "en"],
      prompt: "Which sentence sounds natural to a native speaker?",
      options: ["“I feel myself good today.”", "“I feel good today.”"], answer: 1 },
    { id: "cq_c1", axis: "calque", level: "core", langs: ["ru", "en"],
      prompt: "Which one is correct English (not a direct translation)?",
      options: ["“I have a possibility to come.”", "“I have the opportunity to come.”", "“I have possibility for come.”"], answer: 1 },
    { id: "cq_c2", axis: "calque", level: "core", langs: ["ru", "en"],
      prompt: "Choose the natural question:",
      options: ["“How do you call this in English?”", "“What do you call this in English?”"], answer: 1 },
    { id: "cq_h1", axis: "calque", level: "hard", langs: ["ru", "en"],
      prompt: "Which sentence sounds native?",
      options: ["“Please, make attention to this.”", "“Please pay attention to this.”"], answer: 1 },
    { id: "cq_h2", axis: "calque", level: "hard", langs: ["ru", "en"],
      prompt: "Pick the version a native speaker would actually say:",
      options: ["“I live here already 3 years and I very like it.”", "“I’ve lived here for 3 years and I really like it.”"], answer: 1 },

    /* ---------- CALQUE: кальки с иврита (интерфейс HE) ----------
       Типичные дословные переводы: нет связки «быть» в настоящем (אח שלי רופא),
       «очень» перед глаголом (מאוד אוהב), סגור את האור, מחכה ל־, עשה טעות,
       תן לי לראות, הסביר לי, לא הצלחתי ל־, «уже N лет» в настоящем времени. */
    { id: "hcq_s1", axis: "calque", level: "starter", langs: ["he"],
      prompt: "Which sentence is correct?",
      hint: { he: "איזה משפט נכון? («אח שלי רופא»)" },
      options: ["“My brother doctor.”", "“My brother is a doctor.”"], answer: 1 },
    { id: "hcq_s2", axis: "calque", level: "starter", langs: ["he"],
      prompt: "Which sentence is correct?",
      hint: { he: "איזה משפט נכון? («אני מאוד אוהב/ת פיצה»)" },
      options: ["“I very like pizza.”", "“I like pizza very much.”"], answer: 1 },
    { id: "hcq_e1", axis: "calque", level: "easy", langs: ["he"],
      prompt: "Which sentence is correct?",
      hint: { he: "איזה משפט נכון? («תסגור את האור, בבקשה»)" },
      options: ["“Close the light, please.”", "“Turn off the light, please.”"], answer: 1 },
    { id: "hcq_e2", axis: "calque", level: "easy", langs: ["he"],
      prompt: "Which sentence is correct?",
      hint: { he: "איזה משפט נכון? («אני מחכה לך»)" },
      options: ["“I’m waiting to you.”", "“I’m waiting for you.”"], answer: 1 },
    { id: "hcq_c1", axis: "calque", level: "core", langs: ["he"],
      prompt: "Which sentence sounds natural to a native speaker?",
      options: ["“He did a big mistake.”", "“He made a big mistake.”"], answer: 1 },
    { id: "hcq_c2", axis: "calque", level: "core", langs: ["he"],
      prompt: "Which one is correct English (not a direct translation)?",
      options: ["“Give me to see the photo.”", "“Let me see the photo.”", "“Give me see the photo.”"], answer: 1 },
    { id: "hcq_c3", axis: "calque", level: "core", langs: ["he"],
      prompt: "Choose the natural sentence:",
      options: ["“He explained me the rules.”", "“He explained the rules to me.”"], answer: 1 },
    { id: "hcq_h1", axis: "calque", level: "hard", langs: ["he"],
      prompt: "Which sentence sounds native?",
      options: ["“I didn’t succeed to finish the report.”", "“I didn’t manage to finish the report.”"], answer: 1 },
    { id: "hcq_h2", axis: "calque", level: "hard", langs: ["he"],
      prompt: "Pick the version a native speaker would actually say:",
      options: ["“I live in Tel Aviv already five years and it’s depend on the job if I stay.”", "“I’ve lived in Tel Aviv for five years, and whether I stay depends on the job.”"], answer: 1 },

    /* ---------- REGISTER: простые (A2–B1) ---------- */
    { id: "rg_e2", axis: "register", level: "easy",
      prompt: "A colleague helps you with a task. The natural reply:",
      hint: { ru: "Коллега помог вам с задачей. Естественный ответ:",
              he: "עמית/ה עזר/ה לכם במשימה. תגובה טבעית:" },
      options: [
        "“Thanks a lot!”",
        "“It is your duty.”",
        "“Nothing.”",
        "“You must help me.”"
      ], answer: 0 },
    { id: "rg_e3", axis: "register", level: "easy",
      prompt: "You ask your manager for a day off. The most polite option:",
      hint: { ru: "Вы просите у руководителя выходной. Самый вежливый вариант:",
              he: "אתם מבקשים מהמנהל/ת יום חופש. האפשרות הכי מנומסת:" },
      options: [
        "“I want a day off.”",
        "“Give me a day off.”",
        "“Could I take a day off on Friday?”",
        "“I take a day off on Friday.”"
      ], answer: 2 },

    /* ---------- REGISTER: универсальные (B1–B2) ---------- */
    { id: "rg_e1", axis: "register", level: "core",
      prompt: "Someone suggests an idea you disagree with. The most polite reply:",
      options: [
        "“No, that’s wrong.”",
        "“I see your point, but I’m not sure that would work.”",
        "“You are mistaken.”",
        "“That makes no sense.”"
      ], answer: 1 },
    { id: "rg_c1", axis: "register", level: "core",
      prompt: "You need someone to send you a file. The most natural, polite way:",
      options: [
        "“Send me the file.”",
        "“I want the file now.”",
        "“Could you send me the file when you get a chance?”",
        "“You must send the file.”"
      ], answer: 2 },

    /* ---------- REGISTER: работа/интервью ---------- */
    { id: "rg_c2", axis: "register", level: "core", goals: ["interview", "team"],
      prompt: "You must tell a client something can’t be done on time. The best option:",
      options: [
        "“We can’t do it.”",
        "“It is impossible.”",
        "“Unfortunately that won’t be possible on this timeline — but here’s what we can do.”",
        "“No, it will not work.”"
      ], answer: 2 },
    { id: "rg_h1", axis: "register", level: "hard", goals: ["interview", "team"],
      prompt: "You want to push back on a tight deadline without sounding rigid:",
      options: [
        "“The deadline is impossible.”",
        "“I’m afraid the timeline may be tight — could we move it by a couple of days?”",
        "“I won’t make this deadline.”",
        "“The deadline is too short.”"
      ], answer: 1 },

    /* ---------- REGISTER: повседневный ---------- */
    { id: "rg_gen1", axis: "register", level: "core", goals: ["general"],
      prompt: "A friend asks you to help them move on Saturday, but you’re busy. A friendly way to say no:",
      options: [
        "“No, I can’t.”",
        "“I’d love to, but I’m tied up on Saturday — maybe another time?”",
        "“It is impossible for me.”",
        "“I don’t want to help.”"
      ], answer: 1 },
    { id: "rg_gen2", axis: "register", level: "core", goals: ["general"],
      prompt: "You didn’t hear what someone said at a noisy party. The most natural:",
      options: [
        "“Repeat please.”",
        "“What?”",
        "“Sorry, I didn’t catch that — could you say it again?”",
        "“Say again your words.”"
      ], answer: 2 },

    { id: "rg_gen3", axis: "register", level: "hard", goals: ["general"],
      prompt: "Your neighbour’s music is too loud late at night. The most tactful way to ask:",
      options: [
        "“Turn it down.”",
        "“Your music is too loud.”",
        "“Sorry to bother you — would you mind turning it down a little? I’ve got an early start.”",
        "“Stop the noise, please.”"
      ], answer: 2 },

    /* ---------- REGISTER: экзамен ---------- */
    { id: "rg_exam1", axis: "register", level: "core", goals: ["exam"],
      prompt: "In a formal essay, which phrase is most appropriate?",
      options: [
        "“Lots of people think that…”",
        "“It is widely believed that…”",
        "“Everybody knows that…”",
        "“I guess that…”"
      ], answer: 1 },

    /* ---------- VOCAB: универсальные ---------- */
    { id: "vc_e1", axis: "vocab", level: "easy",
      prompt: "Choose the correct preposition: “I’m responsible ___ the project.”",
      hint: { ru: "Выберите предлог: «I’m responsible ___ the project» (Я отвечаю ___ проект).",
              he: "בחרו את מילת היחס: «I’m responsible ___ the project» (אני אחראי/ת ___ הפרויקט)." },
      options: ["of", "for", "to", "on"], answer: 1 },
    { id: "vc_gen1", axis: "vocab", level: "easy", goals: ["general"],
      prompt: "Choose the natural verb: “I need to ___ a decision by Friday.”",
      hint: { ru: "Выберите глагол: «I need to ___ a decision» (мне нужно принять решение).",
              he: "בחרו את הפועל: «I need to ___ a decision» (אני צריך/ה לקבל החלטה)." },
      options: ["do", "make", "take", "give"], answer: 1 },
    { id: "vc_c2", axis: "vocab", level: "core",
      prompt: "Choose the natural collocation: “We need to ___ this issue before the deadline.”",
      options: ["decide", "solute", "resolve", "make"], answer: 2 },

    /* ---------- VOCAB: работа/интервью ---------- */
    { id: "vc_c1", axis: "vocab", level: "core", goals: ["interview", "team"],
      prompt: "“Tell me about yourself.” The strongest opening in an interview:",
      options: [
        "“I was born in 1990 in…”",
        "“I’m a specialist with five years of experience in…”",
        "“My biography is quite long, so…”",
        "“I don’t know what to say about myself.”"
      ], answer: 1 },
    { id: "vc_h1", axis: "vocab", level: "hard", goals: ["interview", "team"],
      prompt: "“The project is behind schedule — we need to ___.” Choose the idiom:",
      options: ["catch on", "catch up", "catch out", "keep on"], answer: 1 },
    { id: "vc_h2", axis: "vocab", level: "hard", goals: ["interview", "team"],
      prompt: "In a meeting: “Let’s ___ and look at the bigger picture.” Choose the phrase:",
      options: ["step on it", "take a step back", "back off", "step down"], answer: 1 },

    /* ---------- VOCAB: повседневный ---------- */
    { id: "vc_gen2", axis: "vocab", level: "core", goals: ["general"],
      prompt: "Choose the phrasal verb: “I can’t ___ what this word means.”",
      options: ["work out", "work on", "work up", "work in"], answer: 0 },

    { id: "vc_gen3", axis: "vocab", level: "hard", goals: ["general"],
      prompt: "“I’m exhausted — I’m not really ___ going out tonight.” Choose the phrase:",
      options: ["up for", "up to", "out of", "down with"], answer: 0 },

    /* ---------- VOCAB: экзамен ---------- */
    { id: "vc_exam1", axis: "vocab", level: "core", goals: ["exam"],
      prompt: "Choose the linking word for a formal text: “___, the evidence was inconclusive.”",
      options: ["But", "However", "So", "Also"], answer: 1 },
    { id: "vc_exam2", axis: "vocab", level: "hard", goals: ["exam"],
      prompt: "Choose the academic collocation: “The study aims to ___ the hypothesis.”",
      options: ["prove", "test", "check", "control"], answer: 1 },

    /* ---------- LISTENING (аудио, скипаемые) ---------- */
    { id: "ls_e1", axis: "listening", level: "easy", audio: "audio/listen_easy.mp3",
      prompt: "What time does the speaker suggest meeting?",
      hint: { ru: "Во сколько говорящий предлагает встретиться?",
              he: "באיזו שעה הדובר/ת מציע/ה להיפגש?" },
      options: ["9:00", "10:30", "2:00 in the afternoon", "First thing tomorrow"], answer: 2,
      transcript: "Hey, could we meet at two in the afternoon? The morning’s completely packed for me." },
    { id: "ls_c1", axis: "listening", level: "core", audio: "audio/listen_core.mp3",
      prompt: "What is the speaker waiting for?",
      options: ["Design approval", "A delivery", "A phone call back", "A refund"], answer: 0,
      transcript: "I’ve finished my part, but I’m stuck — I’m still waiting for the design to be signed off before I can keep going." },
    { id: "ls_h1", axis: "listening", level: "hard", audio: "audio/listen_hard.mp3",
      prompt: "What does the speaker want changed?",
      options: [
        "A lower price",
        "Updates weekly instead of monthly",
        "To cancel everything",
        "A different person in charge"
      ], answer: 1,
      transcript: "Honestly, the work itself is great. The one thing I’d change — right now we get an update once a month, and that’s just too slow. Could we make it weekly?" }
  ],

  /* --- БЛОК C: can-do самооценка. Движок берёт 3 под цель. ----------------
     Шкала: 0 = «совсем нет» … 3 = «уверенно да». */
  cando: [
    { id: "cd_intro", goals: ["interview"],
      text: { ru: "Я могу рассказать о себе на интервью без подготовки.",
              en: "I can talk about myself in an interview without preparation.",
              he: "אני יכול/ה לספר על עצמי בראיון בלי הכנה." } },
    { id: "cd_curveball", goals: ["interview"],
      text: { ru: "Я могу справиться с неожиданным вопросом на собеседовании.",
              en: "I can handle an unexpected question in a job interview.",
              he: "אני יכול/ה להתמודד עם שאלה לא צפויה בראיון עבודה." } },
    { id: "cd_disagree", goals: ["team", "general"],
      text: { ru: "Я могу не согласиться и не прозвучать грубо.",
              en: "I can disagree without sounding rude.",
              he: "אני יכול/ה לא להסכים בלי להישמע גס/ה." } },
    { id: "cd_present", goals: ["team", "general"],
      text: { ru: "Я могу презентовать свою работу на английском.",
              en: "I can present my work in English.",
              he: "אני יכול/ה להציג את העבודה שלי באנגלית." } },
    { id: "cd_fastspeech", goals: ["team", "general", "interview"],
      text: { ru: "Я могу понимать быструю речь и не просить повторить.",
              en: "I can follow fast speech without asking people to repeat.",
              he: "אני יכול/ה להבין דיבור מהיר בלי לבקש לחזור." } },
    { id: "cd_essay", goals: ["exam"],
      text: { ru: "Я могу написать структурированное эссе за 40 минут.",
              en: "I can write a structured essay in 40 minutes.",
              he: "אני יכול/ה לכתוב חיבור מסודר ב־40 דקות." } },
    { id: "cd_examspeak", goals: ["exam"],
      text: { ru: "Я могу говорить на заданную тему 2 минуты без пауз.",
              en: "I can speak on a given topic for 2 minutes without pauses.",
              he: "אני יכול/ה לדבר על נושא נתון 2 דקות בלי הפסקות." } },
    { id: "cd_smalltalk", goals: ["general", "team"],
      text: { ru: "Я могу поддержать small talk до начала встречи.",
              en: "I can keep up small talk before a meeting starts.",
              he: "אני יכול/ה לנהל small talk לפני שפגישה מתחילה." } },
    { id: "cd_travel", goals: ["general"],
      text: { ru: "Я могу свободно объясниться в поездке — отель, кафе, дорога.",
              en: "I can get by easily when travelling — hotel, café, directions.",
              he: "אני מסתדר/ת בקלות בטיול — מלון, בית קפה, דרכים." } }
  ],

  /* --- Тексты вердиктов и рекомендаций по осям (правятся здесь). ---------- */
  axisMeta: {
    grammar: {
      label: { ru: "Грамматика", en: "Grammar", he: "דקדוק" },
      weak: { ru: "Грамматика пока подводит: времена и условные собираются наугад — и именно это тормозит речь.",
              en: "Grammar is holding you back: tenses and conditionals are hit-and-miss — and that’s exactly what slows your speech down.",
              he: "הדקדוק עדיין מכשיל: זמנים ומשפטי תנאי נבנים באקראי — וזה בדיוק מה שמאט את הדיבור." },
      medium: { ru: "База рабочая, но в сложных временах и условных ещё есть плавающие ошибки.",
                en: "The basics work, but complex tenses and conditionals still have occasional errors.",
                he: "הבסיס עובד, אבל בזמנים מורכבים ובמשפטי תנאי עדיין יש טעויות מדי פעם." },
      strong: { ru: "Грамматика крепкая — база не мешает вам говорить.",
                en: "Your grammar is solid — the basics don’t get in your way.",
                he: "הדקדוק חזק — הבסיס לא מפריע לכם לדבר." },
      fix: { ru: "Точечно закрыть времена и условные. Это 3–4 занятия, а не курс с нуля.",
             en: "Close the gaps in tenses and conditionals. That’s 3–4 lessons, not a course from scratch.",
             he: "לסגור נקודתית את הזמנים ומשפטי התנאי. זה 3–4 שיעורים, לא קורס מאפס." }
    },
    register: {
      label: { ru: "Вежливость и тон", en: "Politeness and tone", he: "נימוס וטון" },
      weak: { ru: "С тоном сложнее всего: по привычке выбираете прямые формы, которые звучат резче, чем вы хотите.",
              en: "Tone is the hardest part: out of habit you pick direct forms that sound harsher than you mean.",
              he: "הטון הכי קשה: מתוך הרגל בוחרים צורות ישירות שנשמעות חריפות יותר ממה שהתכוונתם." },
      medium: { ru: "В целом звучите уместно, но в тонких моментах — отказ, несогласие, плохие новости — не хватает мягкости.",
                en: "Mostly you sound appropriate, but in delicate moments — saying no, disagreeing, bad news — you lack softness.",
                he: "בדרך כלל אתם נשמעים מתאים, אבל ברגעים עדינים — סירוב, אי־הסכמה, חדשות רעות — חסרה רכות." },
      strong: { ru: "Тон под контролем — звучите вежливо и естественно.",
                en: "Your tone is under control — you sound polite and natural.",
                he: "הטון בשליטה — אתם נשמעים מנומסים וטבעיים." },
      fix: { ru: "Набор фраз для смягчения: как отказать, не согласиться, сообщить неприятное. Отрабатывается быстро и заметно.",
             en: "A set of softening phrases: how to say no, disagree, deliver bad news. Quick to practise, with visible results.",
             he: "סט ביטויים לריכוך: איך לסרב, לא להסכים, למסור חדשות לא נעימות. מתרגלים מהר, והתוצאה מורגשת." }
    },
    calque: {
      label: { ru: "Естественность речи", en: "Natural phrasing", he: "טבעיות הדיבור" },
      weak: { ru: "Много калек с русского: фразы грамотные, но выдают неносителя («feel myself», «make attention»).",
              en: "Lots of direct translations from your native language: the sentences give you away as a non-native speaker (“feel myself”, “make attention”).",
              he: "הרבה תרגום מילולי מעברית: המשפטים מסגירים דובר/ת לא ילידי/ת («close the light», «did a mistake»)." },
      medium: { ru: "Речь в основном естественная, но пара устойчивых калек ещё проскакивает.",
                en: "Your speech is mostly natural, but a couple of habitual direct translations still slip in.",
                he: "הדיבור ברובו טבעי, אבל עדיין חומקים כמה תרגומים מילוליים קבועים." },
      strong: { ru: "Речь звучит по-английски, без русских конструкций.",
                en: "You sound English, without structures borrowed from your native language.",
                he: "הדיבור נשמע אנגלי, בלי מבנים מעברית." },
      fix: { ru: "Разобрать ваш личный список калек и заменить на то, как говорят на самом деле. Сразу поднимает восприятие уровня.",
             en: "Go through your personal list of direct translations and replace them with what people actually say. It instantly raises how your level is perceived.",
             he: "לעבור על הרשימה האישית שלכם של תרגומים מילוליים ולהחליף אותם במה שבאמת אומרים. זה מיד משפר את הרושם מהרמה שלכם." }
    },
    listening: {
      label: { ru: "Понимание на слух", en: "Listening", he: "הבנת הנשמע" },
      weak: { ru: "Быструю живую речь ловите с трудом — отсюда «теряю нить и переспрашиваю».",
              en: "Fast, real-life speech is hard to catch — hence “I lose the thread and ask again”.",
              he: "קשה לתפוס דיבור חי ומהיר — ומכאן «מאבדים את החוט ומבקשים לחזור»." },
      medium: { ru: "Основное понимаете, но на быстром темпе и в деталях часть смысла ускользает.",
                en: "You get the main idea, but at a fast pace some details slip away.",
                he: "את העיקר מבינים, אבל בקצב מהיר חלק מהפרטים בורחים." },
      strong: { ru: "Живую речь на слух держите уверенно.",
                en: "You follow real-life speech with confidence.",
                he: "אתם מבינים דיבור חי בביטחון." },
      unchecked: { ru: "Этот блок вы пропустили — на слух пока не проверили. Разберём голосом на бесплатном разборе.",
                   en: "You skipped this part, so listening hasn’t been checked yet. We’ll check it by voice in the free session.",
                   he: "דילגתם על החלק הזה — הבנת הנשמע עוד לא נבדקה. נבדוק אותה בשיחה הקולית החינמית." },
      fix: { ru: "Тренировка на реальной речи (не учебные диалоги) плюс разбор того, что именно ускользает.",
             en: "Practice with real speech (not textbook dialogues) plus a look at what exactly slips away.",
             he: "תרגול עם דיבור אמיתי (לא דיאלוגים מספר הלימוד) וניתוח של מה בדיוק בורח." }
    },
    vocab: {
      label: { ru: "Словарный запас", en: "Vocabulary", he: "אוצר מילים" },
      weak: { ru: "Живых, устойчивых выражений пока не хватает — приходится подбирать слова на ходу.",
              en: "You lack natural, set expressions — you have to search for words on the fly.",
              he: "חסרים ביטויים חיים וקבועים — צריך לחפש מילים תוך כדי דיבור." },
      medium: { ru: "Рабочий словарь есть, но идиоматичных выражений и точных сочетаний мало.",
                en: "You have a working vocabulary, but few idioms and precise collocations.",
                he: "יש אוצר מילים לעבודה, אבל מעט ביטויים אידיומטיים וצירופים מדויקים." },
      strong: { ru: "Словарь и сочетания на месте.",
                en: "Your vocabulary and collocations are in place.",
                he: "אוצר המילים והצירופים במקום." },
      fix: { ru: "Собрать активный словарь под вашу цель — конкретные фразы, а не списки слов.",
             en: "Build an active vocabulary for your goal — specific phrases, not word lists.",
             he: "לבנות אוצר מילים פעיל לפי המטרה שלכם — ביטויים קונקרטיים, לא רשימות מילים." }
    }
  },

  /* --- Что скажу в конце, под цель (человечно, от первого лица). ---------- */
  goalCTA: {
    interview: { ru: "К собеседованию вы ближе, чем кажется — мешают буквально пара вещей из профиля выше. Давайте разберём их голосом за 20 минут, бесплатно, и я покажу, что чинить первым.",
                 en: "You’re closer to the interview than you think — just a couple of things from the profile above are in the way. Let’s go through them by voice in 20 minutes, for free, and I’ll show you what to fix first.",
                 he: "אתם קרובים לראיון יותר ממה שנדמה — מפריעים רק כמה דברים מהפרופיל למעלה. בואו נעבור עליהם בשיחה קולית של 20 דקות, בחינם, ואראה לכם במה לטפל קודם." },
    team:      { ru: "На созвонах вас тормозит не «всё сразу», а конкретные места. За 20 минут разбора соберём план — чтобы перестать терять нить и звучать резче, чем хочется.",
                 en: "On calls you’re held back not by “everything at once”, but by specific things. In a 20-minute session we’ll make a plan — so you stop losing the thread and sounding harsher than you want.",
                 he: "בשיחות עבודה לא מעכב אתכם «הכול ביחד», אלא דברים מסוימים. בשיחה של 20 דקות נבנה תוכנית — כדי להפסיק לאבד את החוט ולהישמע חריפים יותר ממה שרציתם." },
    exam:      { ru: "С экзаменом важно не распыляться. За 20 минут бесплатного разбора решим, куда бить, чтобы добрать баллы быстрее.",
                 en: "With an exam it’s important not to spread yourself thin. In a free 20-minute session we’ll decide where to focus to gain points faster.",
                 he: "בבחינה חשוב לא להתפזר. בשיחה חינמית של 20 דקות נחליט על מה להתמקד כדי להשיג נקודות מהר יותר." },
    general:   { ru: "Говорить мешает не «весь английский», а 2–3 конкретные вещи. Покажу маршрут на бесплатном разборе — 20 минут голосом.",
                 en: "What’s stopping you from speaking isn’t “all of English”, but 2–3 specific things. I’ll show you the route in a free 20-minute voice session.",
                 he: "מה שמפריע לדבר זה לא «כל האנגלית», אלא 2–3 דברים מסוימים. אראה לכם את הדרך בשיחה קולית חינמית של 20 דקות." }
  }
};
