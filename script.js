// Local Web Co — shared behaviour

document.addEventListener('DOMContentLoaded', () => {
  const blueprint = document.querySelector('.blueprint-box');
  if (blueprint && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => blueprint.classList.add('animate'));
  }

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
  // Replace WEBHOOK_URL below with your own "Catch Hook" trigger URL from Zapier.
  // In Zapier: Create Zap -> Trigger: Webhooks by Zapier -> Catch Hook -> copy the
  // custom webhook URL it gives you -> paste it in place of WEBHOOK_URL below.
  // Action: Google Sheets -> Create Spreadsheet Row -> Pipeline Tracker -> "Website Inquiries" tab.
  const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/REPLACE_WITH_YOUR_ID/REPLACE/';

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      const button = form.querySelector('button[type="submit"]');
      const data = {
        firstName: form.firstName.value.trim(),
        email: form.email.value.trim(),
        contactDetails: form.contactDetails.value.trim(),
        message: form.message.value.trim(),
        submittedAt: new Date().toISOString()
      };

      button.disabled = true;
      button.textContent = 'Sending…';

      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        status.textContent = "Thanks — we've got your details and will be in touch soon.";
        status.className = 'form-status show ok';
        form.reset();
      } catch (err) {
        status.textContent = 'Something went wrong sending that — please email hello@local-web-co.com directly.';
        status.className = 'form-status show err';
      } finally {
        button.disabled = false;
        button.textContent = 'Send message';
      }
    });
  }
});
