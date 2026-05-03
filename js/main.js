/* ===========================
   SISURAKSHA – Main JavaScript
   =========================== */

// ── LOADER ──────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
    // Trigger hero animations after loader hides
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 2000);
});

// ── NAVBAR SCROLL ────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ── MOBILE NAV ────────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
});

navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
  });
});

// ── SCROLL REVEAL ─────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Stagger child reveals in grids
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach((el, index) => {
    // Skip hero elements (handled separately)
    if (el.closest('.hero')) return;
    // Add stagger delay based on siblings
    const siblings = el.parentElement.querySelectorAll('.reveal');
    let sibIndex = Array.from(siblings).indexOf(el);
    el.style.transitionDelay = `${sibIndex * 0.08}s`;
    revealObserver.observe(el);
  });
}
initReveal();

// ── COUNTER ANIMATION ─────────────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  const isDecimal = String(target).includes('.');
  const decimals = isDecimal ? 1 : 0;
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = start.toFixed(decimals);
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const target = parseFloat(num.dataset.target);
        animateCounter(num, target, 2000);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// ── PROGRESS BARS ─────────────────────────────────────────────────────
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.prog-fill');
      bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.member-panel').forEach(panel => {
  progressObserver.observe(panel);
});

// ── MEMBER PROGRESS TABS ──────────────────────────────────────────────
function showMember(num) {
  // Update tabs
  document.querySelectorAll('.ptab').forEach((tab) => {
    const isTarget = tab.getAttribute('onclick').includes('(' + num + ')');
    tab.classList.toggle('active', isTarget);
  });
  // Update panels
  document.querySelectorAll('.member-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const panel = document.getElementById('panel-' + num);
  if (panel) {
    panel.classList.add('active');
    // Animate progress bars when panel becomes visible
    setTimeout(() => {
      panel.querySelectorAll('.prog-fill').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = targetWidth; }, 50);
      });
    }, 50);
  }
}

// ── CONTACT FORM ──────────────────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const successEl = document.getElementById('form-success');
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    successEl.style.display = 'flex';
    e.target.reset();
    setTimeout(() => { successEl.style.display = 'none'; }, 5000);
  }, 1500);
}

// ── SMOOTH SCROLL (override for nav links) ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── FEATURE CARD HOVER GLOW ───────────────────────────────────────────
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// ── ARCHITECTURE LAYER HOVER ──────────────────────────────────────────
document.querySelectorAll('.arch-layer').forEach(layer => {
  layer.addEventListener('mouseenter', () => {
    document.querySelectorAll('.arch-layer').forEach(l => l.classList.remove('active-layer'));
    layer.classList.add('active-layer');
  });
});

// ── TEAM CARD – progress button ───────────────────────────────────────
document.querySelectorAll('.member-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const card = link.closest('.team-card');
    const memberId = card.dataset.member;
    if (memberId) {
      // Tab will be shown via onclick attr; just scroll
      setTimeout(() => {
        const progressSection = document.getElementById('progress');
        if (progressSection) {
          const top = progressSection.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 50);
    }
  });
});

// ── TIMELINE REVEAL (stagger) ─────────────────────────────────────────
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = document.querySelectorAll('.timeline-item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 150);
      });
      timelineObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

const timeline = document.querySelector('.timeline');
if (timeline) timelineObserver.observe(timeline);

// ── PAGE INIT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initialize default member panel progress bars (Member 4 - Akther)
  const defaultPanel = document.getElementById('panel-4');
  if (defaultPanel) {
    defaultPanel.querySelectorAll('.prog-fill').forEach(bar => {
      const w = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = w; }, 500);
    });
  }
});
