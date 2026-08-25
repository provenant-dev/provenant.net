(function () {
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  var error = document.getElementById('formError');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      error.classList.remove('show');
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function(f) {
        if (!f.value.trim()) { f.style.borderColor = '#C0392B'; valid = false; }
        else { f.style.borderColor = ''; }
      });
      if (!valid) {
        error.textContent = 'Please fill in all required fields.';
        error.classList.add('show');
        return;
      }
      form.style.display = 'none';
      success.classList.add('show');
      if (window.lucide) lucide.createIcons();
    });
    form.querySelectorAll('input, textarea, select').forEach(function(f) {
      f.addEventListener('input', function() {
        this.style.borderColor = '';
        error.classList.remove('show');
      });
    });
  }
})();
