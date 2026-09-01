(function () {
  "use strict";

  // Mobile nav toggle
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
      var expanded = mainNav.classList.contains("open");
      navToggle.setAttribute("aria-expanded", String(expanded));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Highlight the nav link for the section currently in view.
  // Deliberately a plain scroll-position check rather than a narrow-band
  // IntersectionObserver: percentage rootMargins proved unreliable with
  // instant/rapid scrolls (jumps could skip the band entirely), whereas
  // reading getBoundingClientRect on scroll is synchronous and predictable.
  var sections = Array.prototype.slice.call(document.querySelectorAll("main [id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a[href^='#']"));

  if (sections.length && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (link) {
      byId[link.getAttribute("href").slice(1)] = link;
    });

    var headerOffset = 100;
    var ticking = false;

    function updateActiveLink() {
      var probeY = window.scrollY + headerOffset;
      var currentId = null;

      sections.forEach(function (section) {
        var top = section.getBoundingClientRect().top + window.scrollY;
        if (probeY >= top) currentId = section.id;
      });

      navLinks.forEach(function (l) { l.classList.remove("active"); });
      if (currentId && byId[currentId]) byId[currentId].classList.add("active");
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          updateActiveLink();
          ticking = false;
        });
      },
      { passive: true }
    );

    updateActiveLink();
  }

  // Subtle reveal-on-scroll for elements marked .reveal
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
