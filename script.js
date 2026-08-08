// Local Web Co - shared behaviour

// ---- Cloudflare Web Analytics ----
// Injected here so it loads on every page from one place.
// Cookieless, so no consent banner required under UK GDPR/PECR.
(function () {
  var s = document.createElement('script');
  s.type = 'module';
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', '{"token": "942e2e34c23b4a109f01320a4255dbe9"}');
  document.head.appendChild(s);
})();

document.addEventListener('DOMContentLoaded', () => {
  // Blueprint draw-in (only present on pages that use it)
  const blueprint = document.querySelector('.blueprint-box');
  if (blueprint && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => blueprint.classList.add('animate'));
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => nav.classList.remove('open'))
    );
  }

  // ---- Contact form submission ----
  // Replace WEBHOOK_URL with the Catch Hook URL from Zapier:
  // Create Zap -> Trigger: Webhooks by Zapier -> Catch Hook -> copy URL here.
  // Action: Google Sheets -> Create Spreadsheet Row -> Pipeline Tracker -> "Website Inquiries" tab.
  const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/REPLACE_WITH_YOUR_ID/REPLACE/';

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      const button = form.querySelector('button[type="submit"]');

      // Basic validation before sending
      if (!form.firstName.value.trim() || !form.email.value.trim() || !form.message.value.trim()) {
        status.textContent = 'Please fill in your name, email, and message.';
        status.className = 'form-status show err';
        return;
      }

      const data = {
        firstName: form.firstName.value.trim(),
        email: form.email.value.trim(),
        contactDetails: form.contactDetails.value.trim(),
        message: form.message.value.trim(),
        submittedAt: new Date().toISOString()
      };

      button.disabled = true;
      button.textContent = 'Sending...';

      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        status.textContent = "Thanks - we've got your details and will be in touch soon.";
        status.className = 'form-status show ok';
        form.reset();
      } catch (err) {
        status.textContent = 'Something went wrong sending that - please email hello@local-web-co.com directly.';
        status.className = 'form-status show err';
      } finally {
        button.disabled = false;
        button.textContent = 'Send message';
      }
    });
  }
});
