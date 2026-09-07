(function () {
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  var error = document.getElementById('formError');

  var SUBMISSION_URL = window.CONTACT_API_URL || 'https://inbound-inquiries.provenant.net/contact';

  if (form) {
    form.addEventListener('submit', async function(e) {
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

      var turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value;
      if (!turnstileToken) {
        error.textContent = 'Please complete the security check.';
        error.classList.add('show');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      var payload = {
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        org: form.org.value.trim(),
        role: form.role ? form.role.value.trim() : '',
        country: form.country ? form.country.value : '',
        email: form.email.value.trim(),
        message: form.message.value.trim(),
        turnstileToken: turnstileToken,
      };

      try {
        var res = await fetch(SUBMISSION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          form.style.display = 'none';
          success.classList.add('show');
          if (window.lucide) lucide.createIcons();
        } else {
          var errData = await res.json().catch(function() { return {}; });
          throw new Error(errData.error || 'Submission failed');
        }
      } catch (err) {
        error.textContent = 'Failed to send message. Please email info@provenant.net directly.';
        error.classList.add('show');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
    form.querySelectorAll('input, textarea, select').forEach(function(f) {
      f.addEventListener('input', function() {
        this.style.borderColor = '';
        error.classList.remove('show');
      });
    });
  }
})();
