/* Dulcey Lead Services — scripts.js */
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('.burger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ---------- Lead modal ---------- */
  var modal = document.querySelector('.modal');
  window.openLeadModal = function () {
    if (modal) modal.classList.add('open');
  };
  function closeModal() { if (modal) modal.classList.remove('open'); }
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    var closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }
  document.querySelectorAll('.js-open-lead').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (modal) { e.preventDefault(); window.openLeadModal(); }
    });
  });

  /* ---------- Lead form (success state) ---------- */
  document.querySelectorAll('.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (new FormData(form).get('name') || '').toString().split(' ')[0];
      var success = form.parentElement.querySelector('.form-success');
      if (success) {
        var nameSlot = success.querySelector('[data-name]');
        if (nameSlot) nameSlot.textContent = name;
        form.style.display = 'none';
        success.classList.add('show');
      }
    });
  });

  /* ---------- Expertise accordion ---------- */
  var accItems = document.querySelectorAll('.acc__item');
  accItems.forEach(function (item) {
    var head = item.querySelector('.acc__head');
    if (!head) return;
    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      accItems.forEach(function (it) { it.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });
  if (accItems.length && location.hash) {
    var target = document.querySelector('.acc__item' + location.hash.replace('#', '#'));
    var hashItem = document.getElementById(location.hash.slice(1));
    if (hashItem && hashItem.classList.contains('acc__item')) {
      accItems.forEach(function (it) { it.classList.remove('open'); });
      hashItem.classList.add('open');
    }
  }

  /* ---------- GSAP animations ---------- */
  function initFx() {
    if (!(window.gsap && window.ScrollTrigger)) return setTimeout(initFx, 40);
    var g = window.gsap;
    g.registerPlugin(window.ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var hero = document.querySelectorAll('[data-hero]');
    if (hero.length) g.fromTo(hero, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      g.fromTo(el, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: parseFloat(el.dataset.reveal) || 0, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    document.querySelectorAll('[data-stagger]').forEach(function (el) {
      g.fromTo(el.children, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    });
    document.querySelectorAll('[data-line]').forEach(function (el) {
      g.fromTo(el, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var amt = Math.abs(parseFloat(el.dataset.parallax) || 14);
      g.fromTo(el, { yPercent: amt / 2 }, { yPercent: -amt / 2, ease: 'none', force3D: true, scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.4 } });
    });
    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
  }
  initFx();
})();
