/* Sachverständigenbüro Arne Müller — Dark Cinematic. Vanilla JS, progressive enhancement. */
(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const header = $('#header'), top = $('#top');
  if (header && top && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => header.classList.toggle('scrolled', !e.isIntersecting), { threshold: 0 }).observe(top);
  } else if (header) header.classList.add('scrolled');

  const rev = $$('.reveal, .imgrev');
  const revealAll = /[?&]revealall/.test(location.search);
  if (revealAll) rev.forEach((el) => el.classList.add('in'));
  else if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    rev.forEach((el) => io.observe(el));
  } else rev.forEach((el) => el.classList.add('in'));

  const burger = $('.burger'), menu = $('#mmenu'), mclose = $('.mclose');
  const regions = ['#header', '#main', '.footer'].map((s) => $(s)).filter(Boolean);
  const inertOK = 'inert' in HTMLElement.prototype;
  if (inertOK && menu) menu.inert = true;
  const setMenu = (open) => {
    if (!menu || !burger) return;
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.setAttribute('aria-hidden', String(!open));
    if (inertOK) { menu.inert = !open; regions.forEach((el) => { el.inert = open; }); }
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { const f = menu.querySelector('a,button'); f && f.focus(); } else burger.focus();
  };
  burger && burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  mclose && mclose.addEventListener('click', () => setMenu(false));
  menu && $$('.m-link', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && menu.classList.contains('open')) setMenu(false); });
  menu && menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !menu.classList.contains('open')) return;
    const f = $$('a[href],button', menu).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  $$('.faq-item').forEach((item) => {
    const q = $('.faq-q', item), a = $('.faq-a', item);
    if (!q) return;
    q.addEventListener('click', () => {
      const open = item.classList.contains('open');
      $$('.faq-item.open').forEach((o) => { if (o !== item) { o.classList.remove('open'); $('.faq-q', o).setAttribute('aria-expanded', 'false'); const oa = $('.faq-a', o); if (oa) oa.style.maxHeight = '0px'; } });
      item.classList.toggle('open', !open);
      q.setAttribute('aria-expanded', String(!open));
      if (a) a.style.maxHeight = !open ? a.scrollHeight + 'px' : '0px';
    });
  });

  const form = $('#kontakt-form');
  if (form) {
    const status = $('.form__status', form);
    const setErr = (field, on) => { if (!field) return; field.classList.toggle('err', on); const c = field.querySelector('input,textarea'); if (c) c.setAttribute('aria-invalid', String(on)); };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (form.elements['company'] && form.elements['company'].value) { form.reset(); return; }
      const name = form.elements['name'], email = form.elements['email'], msg = form.elements['anliegen'], consent = form.elements['consent'];
      let ok = true, first = null;
      [name, email, msg].forEach((el) => { const empty = !el.value.trim(); setErr(el.closest('.field'), empty); if (empty) { ok = false; first = first || el; } });
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (email.value.trim() && !emailOk) { setErr(email.closest('.field'), true); ok = false; first = first || email; }
      if (consent && !consent.checked) { ok = false; first = first || consent; consent.setAttribute('aria-invalid', 'true'); }
      else if (consent) consent.removeAttribute('aria-invalid');
      if (!ok) {
        form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
        status && (status.textContent = 'Bitte füllen Sie die markierten Felder aus.');
        first && first.focus && first.focus();
        return;
      }
      const endpoint = form.dataset.endpoint;
      const phone = (form.elements['telefon'] && form.elements['telefon'].value.trim()) || '-';
      if (endpoint) {
        status.textContent = 'Wird gesendet ...';
        fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
          .then((r) => { if (!r.ok) throw new Error(); status.textContent = 'Vielen Dank! Ihre Anfrage ist eingegangen. Wir melden uns kurzfristig.'; form.reset(); })
          .catch(() => { status.textContent = 'Senden fehlgeschlagen. Bitte rufen Sie uns an oder schreiben per WhatsApp.'; });
        return;
      }
      const subject = encodeURIComponent('Anfrage über die Website: ' + name.value.trim());
      const body = encodeURIComponent('Name: ' + name.value.trim() + '\nTelefon: ' + phone + '\nE-Mail: ' + email.value.trim() + '\n\nAnliegen:\n' + msg.value.trim());
      location.href = 'mailto:kontakt@gutachter-mueller.com?subject=' + subject + '&body=' + body;
      status.textContent = 'Falls sich kein E-Mail-Programm öffnet, erreichen Sie uns direkt per WhatsApp oder Telefon.';
    });
    $$('.field input,.field textarea', form).forEach((el) => el.addEventListener('input', () => { el.closest('.field').classList.remove('err'); el.removeAttribute('aria-invalid'); }));
  }

  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
