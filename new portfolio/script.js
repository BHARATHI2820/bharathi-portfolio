/* ============================================================
   ARUNKUMAR K — Portfolio Script
   Particles · Nav · Reveal · Tilt · Typed
   ============================================================ */

/* ── PARTICLE SYSTEM ── */
(function () {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(rand) {
      this.x    = Math.random() * W;
      this.y    = rand ? Math.random() * H : H + 10;
      this.r    = Math.random() * 1.2 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.18;
      this.vy   = -(Math.random() * 0.4 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0,212,255' : '124,58,237';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: 90 }, () => new Particle());
  }
  initParticles();

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Draw faint lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.04 * (1 - d/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── NAV ── */
const nav       = document.getElementById('nav');
const navList   = document.getElementById('nav-list');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.querySelectorAll('.nl');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

function updateActiveNav() {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 110) cur = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${cur}`);
  });
}

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navList.classList.toggle('open');
});
navList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navList.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      window.scrollTo({ top: t.offsetTop - nav.offsetHeight - 8, behavior: 'smooth' });
    }
  });
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -55px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── PROJECT CARD 3D TILT ── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width  / 2;
    const dy = e.clientY - rect.top  - rect.height / 2;
    card.style.transform = `translateY(-6px) rotateX(${-dy/rect.height*7}deg) rotateY(${dx/rect.width*7}deg)`;
    card.style.transition = 'border-color .3s, box-shadow .3s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'border-color .35s, transform .5s cubic-bezier(.4,0,.2,1), box-shadow .35s';
    setTimeout(() => card.style.transition = '', 500);
  });
});

/* ── TYPED EFFECT on hero name ── */
(function () {
  const el = document.querySelector('.hn-first');
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = '';
  el.style.minWidth = '0';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 60);
    }
  }
  setTimeout(type, 400);
})();

/* ── NEON CARD MOUSE GLOW ── */
document.querySelectorAll('.neon-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});

/* ── INIT ── */
updateActiveNav();
