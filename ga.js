// Google Analytics (G-N839GB0VHF) — подключается на главной и в тесте.
// Кроме стандартных визитов шлёт события кликов: test_click, whatsapp_click, telegram_click, instagram_click, threads_click.
// placement — где кнопка: header / hero / test / contact (главная), test_result (экран результата теста).
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-N839GB0VHF');

// Откуда пришёл посетитель — тест прикладывает это к результату (кабинет, письмо).
// Запоминаем последний внешний заход: метки utm_* в ссылке или чужой сайт в referrer.
// Переходы внутри сайта (главная → тест) и повторные прямые заходы источник не перезаписывают.
(function () {
  var q = new URLSearchParams(location.search), ref = '';
  try { if (document.referrer && new URL(document.referrer).hostname.replace(/^www\./, '') !== location.hostname.replace(/^www\./, '')) ref = document.referrer; } catch (e) {}
  try {
    if (!q.get('utm_source') && !ref && localStorage.getItem('src')) return;
    localStorage.setItem('src', JSON.stringify({ utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '',
      utm_campaign: q.get('utm_campaign') || '', referrer: ref }));
  } catch (e) {} // хранилище недоступно (приватный режим) — источник просто не запишется
})();

var GA_LINKS = { 'wa.me': 'whatsapp', 't.me': 'telegram', 'instagram.com': 'instagram', 'threads.com': 'threads' };
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  var host = a.hostname.replace(/^www\./, '');
  var name = GA_LINKS[host] || (host === location.hostname.replace(/^www\./, '') && a.pathname === '/test/' ? 'test' : '');
  if (!name) return;
  var box = a.closest('header, section, footer');
  var placement = box ? (box.id || box.className.split(' ')[0] || box.tagName.toLowerCase())
    : (location.pathname.indexOf('/test/') === 0 ? 'test_result' : 'other');
  gtag('event', name + '_click', { placement: placement });
});
