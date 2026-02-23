/* ═══════════════════════════════════════════════
   ECO-LÍDER 2026 — main.js
   Sebastián Restrepo Luna · 3°A
═══════════════════════════════════════════════ */

// ─── 1. NAVBAR: shrink + mobile toggle ──────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

// Close menu when a link is clicked (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ─── 2. INTERSECTION OBSERVER: fade-in cards ────
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      fadeObserver.unobserve(el);
    }
  });
}, observerOptions);

// Observe proposal cards
document.querySelectorAll('.card').forEach(card => {
  fadeObserver.observe(card);
});

// Observe quality cards
document.querySelectorAll('.quality-card').forEach(card => {
  fadeObserver.observe(card);
});

// ─── 3. SKILL BARS: animate on scroll ───────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        // Small delay so transition is visible
        setTimeout(() => bar.classList.add('animated'), 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsWrap = document.querySelector('.skills-bar-wrap');
if (skillsWrap) skillObserver.observe(skillsWrap);

// ─── 4. SMOOTH ACTIVE NAV LINK on scroll ────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => activeObserver.observe(s));

// ─── 5. YEAR AUTO-UPDATE in footer ──────────────
const yearEls = document.querySelectorAll('.year-auto');
if (yearEls.length) {
  const y = new Date().getFullYear();
  yearEls.forEach(el => el.textContent = y);
}

// ─── 6. CONSOLE EASTER EGG 🌿 ───────────────────
console.log('%c🌿 Eco-Líder 2026', 'color:#2d6a4f; font-size:20px; font-weight:bold;');
console.log('%cHecho con ❤️ y tecnología Eco-Friendly\nSebastián Restrepo Luna · 3°A\nColegio Benedictino de Santa María, Medellín',
  'color:#40916c; font-size:13px;');
