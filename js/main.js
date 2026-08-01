document.addEventListener('DOMContentLoaded', () => {

  initI18n();

  // --- Header scroll ---
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = current;
  });

  // --- Mobile menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // --- Language switcher ---
  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.addEventListener('click', () => switchLang(btn.dataset.lang));
  });

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
  const lightboxNext = lightbox?.querySelector('.lightbox-next');
  let currentImageIndex = 0;
  let galleryImages = [];

  function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt = galleryImages[currentImageIndex].alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt = galleryImages[currentImageIndex].alt || '';
  }

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    galleryImages = [];
    document.querySelectorAll('.gallery-item').forEach(el => {
      const img = el.querySelector('img');
      galleryImages.push({ src: el.dataset.src || img?.src, alt: img?.alt || '' });
    });
    const index = Array.from(document.querySelectorAll('.gallery-item')).indexOf(item);
    if (index >= 0) openLightbox(index);
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // --- Intersection Observer for animations ---
  const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (animateElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animateElements.forEach(el => observer.observe(el));
  }

  // --- Menu filters ---
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const menuSections = document.querySelectorAll('.menu-section');
  if (filterBtns.length && menuSections.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        menuSections.forEach(section => {
          if (filter === 'all' || section.id === filter) {
            section.classList.remove('hidden');
          } else {
            section.classList.add('hidden');
          }
        });
      });
    });
  }

  // --- Service selector (lunch/dinner) ---
  const serviceOptions = document.querySelectorAll('.service-option');
  const timeSelect = document.getElementById('time');
  const serviceInput = document.getElementById('service');
  if (serviceOptions.length && timeSelect) {
    const timeSlots = {
      lunch: ['11:00', '12:00', '13:00', '14:00'],
      dinner: ['18:00', '19:00', '20:00', '21:00', '22:00']
    };
    serviceOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        serviceOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const service = opt.dataset.service;
        if (serviceInput) serviceInput.value = service;
        timeSelect.innerHTML = timeSlots[service].map(t =>
          `<option value="${t}">${t}</option>`
        ).join('');
      });
    });
  }

  // --- Smooth anchor scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Service worker (PWA) ---
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
});
