(() => {
  'use strict';

  const WA_NUMBER = '17745861279';

  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sticky header shadow */
  const header = document.getElementById('siteHeader');
  const floatActions = document.getElementById('floatActions');
  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    header.classList.toggle('is-scrolled', scrolled);
    floatActions.classList.toggle('is-visible', window.scrollY > 480);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenu = () => {
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* Before / After tabs */
  const tabs = document.querySelectorAll('.ba-tab');
  const sliders = document.querySelectorAll('.ba-slider');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      sliders.forEach(s => s.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.getElementById(tab.dataset.target).classList.add('is-active');
    });
  });

  /* Before / After drag sliders */
  sliders.forEach(slider => {
    const beforePane = slider.querySelector('.ba-before');
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;

    const setPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.min(96, Math.max(4, pct));
      beforePane.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = `${pct}%`;
    };

    const start = () => { dragging = true; slider.style.userSelect = 'none'; };
    const stop = () => { dragging = false; slider.style.userSelect = ''; };
    const move = (clientX) => { if (dragging) setPosition(clientX); };

    handle.addEventListener('mousedown', start);
    window.addEventListener('mouseup', stop);
    window.addEventListener('mousemove', (e) => move(e.clientX));

    handle.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchend', stop);
    window.addEventListener('touchmove', (e) => {
      if (dragging && e.touches[0]) move(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('click', (e) => {
      if (e.target.closest('.ba-handle')) return;
      setPosition(e.clientX);
    });
  });

  /* Quote form -> Text or WhatsApp deep link, depending on which button was pressed */
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = quoteForm.querySelector('#qName').value.trim();
      const service = quoteForm.querySelector('input[name="service"]:checked').value;
      const size = quoteForm.querySelector('input[name="size"]:checked').value;
      const frequency = quoteForm.querySelector('input[name="frequency"]:checked').value;
      const pets = quoteForm.querySelector('input[name="pets"]:checked').value;
      const channel = (e.submitter && e.submitter.dataset.channel) || 'sms';

      const message = `Hi Aurora's! My name is ${name}. I'm interested in ${service} for a ${size} home. Frequency: ${frequency}. Pets: ${pets}. Could you send me a quote?`;
      const encoded = encodeURIComponent(message);

      if (channel === 'whatsapp') {
        window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank', 'noopener');
      } else {
        window.location.href = `sms:+${WA_NUMBER}?&body=${encoded}`;
      }
    });
  }
})();
