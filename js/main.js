// Got It Maid in the Valley: site interactions
// Designed by Promontory Web Designs

(function () {
  'use strict';

  // iOS Safari only applies :active (button press feedback) when a touch listener exists
  document.addEventListener('touchstart', function () {}, { passive: true });

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Header shadow once the page scrolls
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Highlight the nav link for the section in view (same-page links only)
  var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var link = linkFor[entry.target.id];
        if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'location'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  var io = null;
  var show = function (el) {
    if (io) io.unobserve(el);
    if (!el.classList.contains('reveal') || el.classList.contains('is-visible')) return;
    el.classList.add('is-visible');
    // Once faded in, drop the reveal styles so they stop overriding the element's own
    // hover transform and transition
    el.addEventListener('transitionend', function done(e) {
      if (e.target !== el || e.propertyName !== 'opacity') return;
      el.removeEventListener('transitionend', done);
      el.classList.remove('reveal', 'is-visible');
      el.style.transitionDelay = '';
    });
  };
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) show(entry.target);
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(show);
  }
  // Jumping to a section via a link: reveal everything straight away, so the section is
  // already showing when the scroll lands instead of fading in late
  document.addEventListener('click', function (e) {
    if (e.target.closest('a[href^="#"]')) items.forEach(show);
  });

  // Service cards (desktop, three across): the cards share grid rows so their top blocks line up,
  // which also made all three stretch when one was expanded. The CSS lets each card size itself
  // while any card is open; --rows carries the shared row heights so the top blocks stay aligned.
  var cardGrid = document.querySelector('.card-grid');
  var firstCard = cardGrid && cardGrid.querySelector('.service-card');
  if (firstCard) {
    var syncRows = function () {
      cardGrid.classList.add('is-measuring'); // back to shared rows while we measure
      var gap = parseFloat(getComputedStyle(firstCard).rowGap) || 0;
      var tops = Array.prototype.map.call(firstCard.children, function (el) {
        return el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).marginTop) || 0);
      });
      cardGrid.classList.remove('is-measuring');
      var rows = [];
      for (var i = 0; i < tops.length - 1; i++) {
        rows.push('minmax(' + Math.max(0, tops[i + 1] - tops[i] - gap).toFixed(2) + 'px, auto)');
      }
      cardGrid.style.setProperty('--rows', rows.join(' '));
    };
    syncRows();
    window.addEventListener('resize', syncRows);
    window.addEventListener('load', syncRows);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncRows);
  }

  // Contact form: the message hint follows the "What can we help with?" choice,
  // and a message becomes required for questions and other requests.
  var service = document.getElementById('service');
  var message = document.getElementById('message');
  var messageLabel = document.getElementById('message-label');
  if (service && message && messageLabel) {
    var hints = {
      'Get a quote for my home': ['Tell us about your home', "How many bedrooms and bathrooms, what needs the most attention, and how often you'd like cleaning.", false],
      'Add-ons or a special request': ['What would you like done?', 'For example inside the fridge, freezer or oven, or anything else not on our list.', true],
      'I have a question': ['Your question', "Ask away! We'll get back to you as soon as we can.", true],
      'Something else': ['How can we help?', "Tell us what you need and we'll let you know if it's something we can do.", true]
    };
    var fallback = [messageLabel.textContent, message.placeholder, false];
    service.addEventListener('change', function () {
      var h = hints[service.value] || fallback;
      messageLabel.textContent = h[0];
      message.placeholder = h[1];
      message.required = h[2];
    });
  }
})();
