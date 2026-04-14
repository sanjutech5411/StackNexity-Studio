/* ============================================
   STACKNEXITY STUDIO – SK | MAIN SCRIPT
   ============================================ */

'use strict';

// ── DOM READY ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initRevealAnimations();
  initCounterAnimations();
  initPortfolioFilter();
  initContactForm();
  initScrollTop();
  initNavActiveLinks();
  initSmoothScroll();
});

/* ============================================
   NAVBAR – Scroll effects
   ============================================ */
function initNavbar() {
  const header = document.getElementById('navbar');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================
   NAVBAR – Active link tracking
   ============================================ */
function initNavActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on mobile link click
  mobileMenu.querySelectorAll('.mobile-link, .mobile-cta').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================
   REVEAL ANIMATIONS – IntersectionObserver
   ============================================ */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ============================================
   COUNTER ANIMATIONS
   ============================================ */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* ============================================
   PORTFOLIO FILTER
   ============================================ */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95) translateY(10px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            });
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          setTimeout(() => {
            if (btn.dataset.filter !== filter || card.dataset.category === filter) return;
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('contactSubmit');
  const successMsg = document.getElementById('formSuccess');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      shakeInvalidFields(form);
      return;
    }

    if (!isValidEmail(email)) {
      highlightField(form.email);
      return;
    }

    // Show loading
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'flex';

    // Simulate async submission (replace with actual API call)
    await delay(1800);

    // Show success state
    if (btnText) btnText.style.display = '';
    if (btnLoading) btnLoading.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;

    if (successMsg) {
      successMsg.style.display = 'flex';
      successMsg.style.animation = 'fadeInUp 0.4s ease';
    }

    form.reset();

    // Hide success after 6s
    setTimeout(() => {
      if (successMsg) successMsg.style.display = 'none';
    }, 6000);
  });

  // Real-time validation styling
  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('blur', () => {
      if (field.required && !field.value.trim()) {
        field.style.borderColor = 'rgba(239,68,68,0.5)';
      } else {
        field.style.borderColor = '';
      }
    });

    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeInvalidFields(form) {
  const required = form.querySelectorAll('[required]');
  required.forEach((field) => {
    if (!field.value.trim()) {
      highlightField(field);
    }
  });
}

function highlightField(field) {
  field.style.borderColor = 'rgba(239,68,68,0.6)';
  field.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
  field.style.animation = 'shake 0.4s ease';
  field.focus();
  setTimeout(() => {
    field.style.animation = '';
  }, 400);
}

// Inject shake keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ============================================
   SCROLL TO TOP
   ============================================ */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  const onScroll = () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   CURSOR GLOW (Desktop only)
   ============================================ */
if (window.innerWidth > 900) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

/* ============================================
   SERVICE CARD TILT (subtle 3D)
   ============================================ */
document.querySelectorAll('.service-card, .why-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const tiltX = ((y - cy) / cy) * 3;
    const tiltY = ((cx - x) / cx) * 3;
    card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

/* ============================================
   TYPING EFFECT (Hero tagline)
   ============================================ */
(function initTypingEffect() {
  const badge = document.querySelector('.hero-badge span:last-child');
  if (!badge) return;

  const phrases = [
    'Available for new projects',
    'Mobile · Web · Backend',
    'From idea to launch 🚀',
    'Let\'s build something great',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let timeout;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    badge.textContent = current.substring(0, charIdx);

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === current.length) {
      speed = 2500;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }

    timeout = setTimeout(type, speed);
  }

  // Start after 2s
  setTimeout(type, 2000);
})();

/* ============================================
   PERFORMANCE: Lazy load non-critical animations
   ============================================ */
// Defer floating badge animations til after page load
window.addEventListener('load', () => {
  document.querySelectorAll('.float-badge').forEach((badge, i) => {
    badge.style.opacity = '1';
    badge.style.animationDelay = `${i * -1.2}s`;
  });
});
