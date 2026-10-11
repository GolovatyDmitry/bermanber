// Google Analytics (G-N839GB0VHF) — подключается на главной и в тесте.
// Кроме стандартных визитов шлёт события кликов: test_click, whatsapp_click, telegram_click, instagram_click, threads_click.
// placement — где кнопка: header / hero / test / contact (главная), test_result (экран результата теста).
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-N839GB0VHF');

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
