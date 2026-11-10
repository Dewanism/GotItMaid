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
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
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
