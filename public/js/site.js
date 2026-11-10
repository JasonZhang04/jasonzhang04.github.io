// Small progressive enhancements. All content is usable if this file never loads.
const root = document.documentElement;
const dark = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = () => (root.getAttribute('data-theme') || (dark.matches ? 'dark' : 'light')) === 'dark';

// Theme toggle.
const toggle = document.querySelector('[data-theme-toggle]');
if (toggle) {
  const label = () => toggle.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  label();
  dark.addEventListener('change', label);
  toggle.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch { /* storage may be unavailable */ }
    label();
  });
}

// Hairline under the nav appears after 8px of scroll.
const nav = document.querySelector('[data-site-nav]');
if (nav) {
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile menu.
const menuButton = document.querySelector('[data-nav-toggle]');
const menu = document.getElementById('site-menu');
if (menuButton && menu) {
  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  };
  menuButton.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setOpen(false); menuButton.focus(); }
  });
}

// One-shot reveals: ECG dividers draw once when they enter the viewport.
const reveals = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    }
  }, { threshold: 0.4 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

// Copy BibTeX, with an inline pixel check for 1.5 seconds.
document.querySelectorAll('[data-copy]').forEach((button) => {
  const label = button.querySelector('[data-copy-label]');
  const idle = label.textContent;
  let timer;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.getAttribute('data-copy'));
      button.classList.add('is-copied');
      label.textContent = 'Copied';
    } catch {
      label.textContent = 'Copy failed: see BibTeX below';
    }
    clearTimeout(timer);
    timer = setTimeout(() => { button.classList.remove('is-copied'); label.textContent = idle; }, 1500);
  });
});

// Photographs open in a native modal dialog. The link still opens the file if this fails.
document.querySelectorAll('[data-photo-dialog]').forEach((link) => {
  const dialog = document.getElementById(link.getAttribute('data-photo-dialog'));
  if (!dialog || typeof dialog.showModal !== 'function') return;
  link.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    dialog.showModal();
  });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
});

// The scene loads after first paint, so it never competes with the page itself.
if (document.querySelector('[data-night-lab]')) {
  const start = () => import('./night-lab.js').catch(() => { /* the static poster remains */ });
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1200 });
  else setTimeout(start, 200);
}

// Links to the coursework list open its disclosure first, so the jump lands on the table.
const coursework = document.getElementById('coursework');
if (coursework && coursework.tagName === 'DETAILS') {
  const openIfTargeted = () => { if (location.hash === '#coursework') coursework.open = true; };
  document.querySelectorAll('a[href="#coursework"]').forEach((a) => a.addEventListener('click', () => { coursework.open = true; }));
  window.addEventListener('hashchange', openIfTargeted);
  openIfTargeted();
}
