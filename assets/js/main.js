/* ═══════════════════════════════════════════════
   ECO-LÍDER 2026 — main.js v2
   Sebastián Restrepo Luna · 3°A
═══════════════════════════════════════════════ */

// ─── 1. NAVBAR ───────────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ─── 2. TYPING EFFECT (slogan principal) ─────────
const slogan   = "Tecnología con corazón verde y liderazgo responsable.";
const target   = document.getElementById('typingText');
let charIndex  = 0;
let isDeleting = false;
let typingDone = false;

function type() {
  if (!target) return;

  if (!isDeleting && charIndex <= slogan.length) {
    target.textContent = slogan.slice(0, charIndex);
    charIndex++;
    if (charIndex > slogan.length) {
      typingDone = true;
      // Pausa larga al terminar, luego no borra (queda fijo)
      return;
    }
    setTimeout(type, 55);
  }
}

// Arranca el typing con pequeño delay para que sea llamativo al cargar
setTimeout(type, 800);

// ─── 3. TECH CANVAS — partículas interactivas ────
(function initCanvas() {
  const canvas = document.getElementById('techCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');

  let W, H, particles, mouse;
  mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  // Tipos de nodos: círculos (tech) y hojas (eco)
  const SYMBOLS = ['○', '□', '◇', '0', '1', '+'];
  const COLORS  = [
    'rgba(116,198,157,ALPHA)',  // verde claro
    'rgba(244,211,94,ALPHA)',   // amarillo
    'rgba(255,255,255,ALPHA)',  // blanco
    'rgba(100,181,246,ALPHA)',  // azul claro
  ];

  function makeParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.6,
      vy:    (Math.random() - 0.5) * 0.6,
      r:     Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.5 + 0.15,
      color,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      useSymbol: Math.random() > 0.75,
      size:  Math.random() * 10 + 8,
    };
  }

  function initParticles() {
    particles = Array.from({ length: 80 }, makeParticle);
  }

  function drawLine(a, b, dist, maxDist) {
    const alpha = (1 - dist / maxDist) * 0.25;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(116,198,157,${alpha})`;
    ctx.lineWidth   = 0.8;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = 130;

    // Líneas entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) drawLine(particles[i], particles[j], dist, maxDist);
      }
    }

    // Líneas desde el mouse
    particles.forEach(p => {
      const dx   = p.x - mouse.x;
      const dy   = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) drawLine(p, mouse, dist, 160);
    });

    // Dibujar partículas
    particles.forEach(p => {
      const alpha = p.color.replace('ALPHA', p.alpha.toFixed(2));
      if (p.useSymbol) {
        ctx.fillStyle = alpha;
        ctx.font      = `${p.size}px 'Share Tech Mono', monospace`;
        ctx.fillText(p.symbol, p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = alpha;
        ctx.fill();
      }
    });
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      // Rebote
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Repulsión suave del mouse
      const dx   = p.x - mouse.x;
      const dy   = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        p.x += (dx / dist) * 1.5;
        p.y += (dy / dist) * 1.5;
      }
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // Mouse interacción
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  // Touch interacción (móvil)
  canvas.addEventListener('touchmove', e => {
    const rect  = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  }, { passive: true });

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  loop();
})();

// ─── 4. INTERSECTION OBSERVER — fade cards ───────
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.card, .quality-card').forEach(el => fadeObs.observe(el));

// ─── 5. SKILL BARS ───────────────────────────────
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animated'));
      }, 200);
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsWrap = document.querySelector('.skills-bar-wrap');
if (skillsWrap) skillObs.observe(skillsWrap);

// ─── 6. BOTÓN APOYO — modal de agradecimiento ────
const btnSupport  = document.getElementById('btnSupport');
const thanksModal = document.getElementById('thanksModal');
const thanksClose = document.getElementById('thanksClose');
const confettiWrap = document.getElementById('thanksConfetti');

const CONFETTI_COLORS = ['#2d6a4f','#74c69d','#f4d35e','#ffffff','#1565c0','#a5d6a7'];

function launchConfetti() {
  if (!confettiWrap) return;
  confettiWrap.innerHTML = '';
  for (let i = 0; i < 38; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top: 0;
      background: ${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
      width: ${Math.random() * 8 + 6}px;
      height: ${Math.random() * 8 + 6}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${Math.random() * 1.5 + 1.2}s;
      animation-delay: ${Math.random() * 0.6}s;
    `;
    confettiWrap.appendChild(el);
  }
}

function openModal() {
  thanksModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  launchConfetti();
}

function closeModal() {
  thanksModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (btnSupport)  btnSupport.addEventListener('click', openModal);
if (thanksClose) thanksClose.addEventListener('click', closeModal);

// Cierra al hacer click en el fondo oscuro
if (thanksModal) {
  thanksModal.addEventListener('click', e => {
    if (e.target === thanksModal) closeModal();
  });
}

// Cierra con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && thanksModal && thanksModal.classList.contains('open')) {
    closeModal();
  }
});

// ─── 7. ACTIVE NAV LINK on scroll ────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => activeObs.observe(s));

// ─── 8. CONSOLE EASTER EGG 🌿 ────────────────────
console.log('%c🌿 Eco-Líder 2026', 'color:#2d6a4f;font-size:22px;font-weight:bold;');
console.log('%cSebastián Restrepo Luna · 3°A\nColegio Benedictino de Santa María, Medellín\nHecho con ❤️ y tecnología Eco-Friendly',
  'color:#40916c;font-size:13px;');
