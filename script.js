/* ============================================================
   ELEGANT TIME PIECES — JavaScript
   Animations, scroll reveals, navbar, parallax, micro-interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADING SCREEN ---------- */
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      animateHero();
    }, 1800);
  });

  // Fallback: hide loader after 4s even if load event was missed
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      animateHero();
    }
  }, 4000);

  /* ---------- HERO ANIMATIONS ---------- */
  function animateHero() {
    const eyebrow = document.querySelector('.hero-eyebrow');
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const btn = document.querySelector('.btn-hero');
    const titleEm = document.querySelector('.hero-title em');

    const steps = [
      { el: eyebrow, delay: 200 },
      { el: title, delay: 500 },
      { el: subtitle, delay: 900 },
      { el: btn, delay: 1200 }
    ];

    steps.forEach(({ el, delay }) => {
      if (!el) return;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)';
      }, delay);
    });

    // Underline reveal on "em"
    if (titleEm) {
      setTimeout(() => {
        const underline = titleEm.querySelector('::after') || titleEm;
        titleEm.style.setProperty('--underline-scale', '1');
        // Use class-based animation since pseudo-element can't be styled directly
        titleEm.classList.add('revealed');
      }, 1600);
    }
  }

  // Add CSS for .revealed
  const style = document.createElement('style');
  style.textContent = `
    .hero-title em.revealed::after {
      transform: scaleX(1) !important;
      transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s;
    }
  `;
  document.head.appendChild(style);


  /* ---------- NAVBAR SCROLL BEHAVIOR ---------- */
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });


  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach((link, i) => {
      link.style.transitionDelay = `${0.1 + i * 0.08}s`;
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }


  /* ---------- SMOOTH SCROLL FOR NAV LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });


  /* ---------- SCROLL REVEAL ---------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ---------- PARALLAX EFFECT (About Section) ---------- */
  const aboutBgImg = document.querySelector('.about-bg img');

  if (aboutBgImg) {
    window.addEventListener('scroll', () => {
      const section = document.querySelector('.about');
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      if (rect.top < windowH && rect.bottom > 0) {
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const translate = (progress - 0.5) * 80;
        aboutBgImg.style.transform = `translateY(${translate}px)`;
      }
    });
  }


  /* ---------- COUNTER ANIMATION (About Stats) ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const raw = el.getAttribute('data-target');
    const suffix = el.getAttribute('data-suffix') || '';
    const target = parseInt(raw);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }


  /* ---------- BUTTON RIPPLE EFFECT ---------- */
  document.querySelectorAll('.btn-shop').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(177,18,38,0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-effect 0.6s ease-out forwards;
        pointer-events: none;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple-effect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);


  /* ---------- WATCH CARD TILT EFFECT ---------- */
  const cards = document.querySelectorAll('.watch-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = y * -8;
      const tiltY = x * 8;

      card.style.transform = `translateY(-12px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
    });
  });


  /* ---------- CURSOR GLOW (Desktop only) ---------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(177,18,38,0.07) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });
  }

});
