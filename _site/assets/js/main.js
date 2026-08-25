(function () {
  // ---- Icons ----
  if (window.lucide) lucide.createIcons();

  // ---- Entrance reveals ----
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));

  function revealAll() {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  if (reduce) {
    revealAll();
  } else {
    var check = function () {
      var h = window.innerHeight || document.documentElement.clientHeight;
      reveals.forEach(function (el) {
        if (!el.classList.contains('in') && el.getBoundingClientRect().top < h * 0.92) {
          el.classList.add('in');
        }
      });
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
    setTimeout(check, 200);
    setTimeout(revealAll, 2500);
  }
})();
