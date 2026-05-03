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
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const successEl = document.getElementById('form-success');
  const btn = form.querySelector('button[type="submit"]');
  
  const originalBtnText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  const formData = new FormData(form);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully';
      successEl.style.display = 'flex';
      form.reset();
      
      setTimeout(() => { 
        successEl.style.display = 'none'; 
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
      }, 5000);
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error. Try Again.';
    btn.disabled = false;
    
    setTimeout(() => {
      btn.innerHTML = originalBtnText;
    }, 3000);
  }
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

// ── CUSTOM CURSOR ANIMATION ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Only init on non-touch devices
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  const smokeContainer = document.createElement('div');
  smokeContainer.className = 'cursor-smoke-container';
  document.body.appendChild(smokeContainer);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let lastX = mouseX;
  let isHovering = false;
  let moveTimer;

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Flip logic based on X direction
    if (mouseX < lastX - 2) {
      cursor.classList.add('flip');
    } else if (mouseX > lastX + 2) {
      cursor.classList.remove('flip');
    }
    lastX = mouseX;

    // Bounce animation class
    cursor.classList.add('moving');
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => cursor.classList.remove('moving'), 150);
  });

  // Render loop using requestAnimationFrame
  function renderCursor() {
    // Easing for smooth follow (0.2)
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

    // Spawn smoke particles when moving
    if (cursor.classList.contains('moving') && Math.random() > 0.6) {
      createSmokeParticle(cursorX, cursorY, cursor.classList.contains('flip'));
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  function createSmokeParticle(x, y, isFlipped) {
    const particle = document.createElement('div');
    particle.className = 'smoke-particle';

    // Offset smoke behind the bus
    const offset = isFlipped ? 18 : -18;
    particle.style.left = (x + offset) + 'px';
    particle.style.top = (y + 8) + 'px';

    // Exhaust on interactive hover (make it slightly more opaque/glowy)
    if (isHovering) {
      particle.style.background = 'rgba(60, 60, 60, 0.8)';
      particle.style.boxShadow = '0 0 6px rgba(60, 60, 60, 0.4)';
    }

    smokeContainer.appendChild(particle);

    // Fade out and move up slightly
    requestAnimationFrame(() => {
      particle.classList.add('fade');
    });

    // Clean up DOM
    setTimeout(() => {
      particle.remove();
    }, 500);
  }

  // Interactive Hover State Detection (Event Delegation)
  document.addEventListener('mouseover', (e) => {
    const interactive = e.target.closest('a, button, input, textarea, select, [onclick], .team-card, .feature-card, .doc-item, .sup-card');
    if (interactive) {
      cursor.classList.add('interactive');
      isHovering = true;
    }
  });

  document.addEventListener('mouseout', (e) => {
    const interactive = e.target.closest('a, button, input, textarea, select, [onclick], .team-card, .feature-card, .doc-item, .sup-card');
    if (interactive) {
      cursor.classList.remove('interactive');
      isHovering = false;
    }
  });
});

// ── MILESTONE DROPDOWN ────────────────────────────────────────────────
const msIcons = ["fa-chalkboard","fa-file-lines","fa-person-chalkboard","fa-chalkboard-user","fa-book","fa-users-rectangle","fa-flag-checkered","fa-graduation-cap","fa-globe","fa-scroll","fa-list-check","fa-book-journal-whills"];
const msLabels = ["Proposal Presentation","Proposal Report","Progress Presentation-1 (50%)","Progress Presentation-2 (90%)","Final Report","Final Report (group)","Final presentation","Viva","Website","Research paper","Check Lists","Logbook"];

function toggleMsDropdown() {
  document.getElementById('msDropdown').classList.toggle('open');
}

// Close when clicking outside
document.addEventListener('click', (e) => {
  const dd = document.getElementById('msDropdown');
  if (dd && !dd.contains(e.target)) dd.classList.remove('open');
});

function selectMilestone(num, optionEl) {
  // Update dropdown label + icon
  const icon = document.querySelector('.ms-selected-icon i');
  const text = document.querySelector('.ms-selected-text');
  if (icon) icon.className = `fas ${msIcons[num - 1]}`;
  if (text) text.textContent = msLabels[num - 1];

  // Update active option highlight
  document.querySelectorAll('.ms-option').forEach((opt, i) => {
    opt.classList.toggle('active', i + 1 === num);
  });

  // Close dropdown
  document.getElementById('msDropdown').classList.remove('open');

  // Switch visible panel
  document.querySelectorAll('.ms-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('ms-panel-' + num);
  if (panel) {
    panel.classList.add('active');
    // Re-animate criteria bars
    setTimeout(() => {
      panel.querySelectorAll('.mc-bar').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = w; }, 50);
      });
    }, 60);
  }

  // Highlight matching summary table row
  document.querySelectorAll('.ms-table tbody tr').forEach((row, i) => {
    row.style.background = (i + 1 === num) ? 'rgba(255,192,0,0.08)' : '';
  });
}

// Animate criteria bars on first scroll into view
const msObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.mc-bar').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = w; }, 100);
      });
      msObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const firstPanel = document.getElementById('ms-panel-1');
if (firstPanel) msObserver.observe(firstPanel);
