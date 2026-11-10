// resize.js: put this once on the page that embeds Capital News Service charts.
// It sets each CNS chart iframe to the height of its chart, so nothing is cut off on phones.
(function () {
  if (window.__cnsEmbedResize) return; window.__cnsEmbedResize = true;
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'cns-embed-height' || typeof d.height !== 'number') return;
    var frames = document.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow === e.source) { frames[i].style.height = (d.height + 4) + 'px'; }
    }
  });
})();
