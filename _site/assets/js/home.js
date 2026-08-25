(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Diagram animation — CSS keyframe triggered by scroll ----
  var flow = document.getElementById('flow');
  if (flow) {
    var diagram = document.getElementById('diagram');

    function startAnimation() {
      flow.classList.remove('run');
      setTimeout(function() {
        flow.classList.add('run');
      }, 200);
    }

    function resetAnimation() {
      flow.classList.remove('run');
    }

    if (diagram) {
      var diagObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            if (!reduce) {
              startAnimation();
            } else {
              flow.classList.add('run');
            }
          } else {
            resetAnimation();
          }
        });
      }, {
        threshold: [0.5],
        rootMargin: '-5% 0px -5% 0px'
      });
      diagObserver.observe(diagram);
    }
  }

  // ---- Video modals ----
  function initModal(btnId, modalId, closeBtnId) {
    var btn = document.getElementById(btnId);
    var modal = document.getElementById(modalId);
    var closeBtn = document.getElementById(closeBtnId);
    if (!btn || !modal) return;

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      var iframe = modal.querySelector('iframe');
      if (iframe) { var src = iframe.src; iframe.src = ''; iframe.src = src; }
    }
    btn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });
  }

  initModal('promoVideoBtn', 'promoModal', 'promoModalClose');
  var promoLink = document.getElementById('promoVideoBtn');
  if (promoLink) promoLink.addEventListener('click', function(e) { e.preventDefault(); });
  initModal('mwcDemoBtn', 'mwcModal', 'mwcModalClose');
})();
