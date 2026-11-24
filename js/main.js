/* ==========================================================================
   PORTFOLIO INTERACTIONS
   No build step, no dependencies — plain JS so it stays easy to read
   and modify. Each block below is independent; delete what you don't need.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------- Theme toggle --------------------------- */
  var themeToggle = document.getElementById("themeToggle");
  var THEME_KEY = "portfolio-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function currentSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
  } catch (e) {
    /* localStorage unavailable — fall back to system theme, no persistence */
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var effective = root.getAttribute("data-theme") || currentSystemTheme();
      var next = effective === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* ignore — theme just won't persist across visits */
      }
    });
  }

  /* --------------------------- Mobile nav --------------------------- */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.style.display === "flex";
      mobileNav.style.display = isOpen ? "none" : "flex";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.style.display = "none";
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --------------------------- Footer year --------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------------------------- Scroll reveal --------------------------- */
  var revealTargets = document.querySelectorAll("[data-reveal]");

  if (revealTargets.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      revealTargets.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* --------------------------- Active nav link --------------------------- */
  var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  var sections = Array.prototype.map.call(navLinks, function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = "#" + entry.target.id;
          var matchingLinks = document.querySelectorAll('.main-nav a[href="' + id + '"]');
          matchingLinks.forEach(function (link) {
            link.classList.toggle("is-active", entry.isIntersecting);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* --------------------------- Hero photo tilt --------------------------- */
  /* Subtle, cursor-driven tilt on the hero photo — purely decorative,
     skipped entirely if reduced motion is requested or on touch devices
     (no meaningful pointermove there). */
  var heroPhoto = document.getElementById("heroPhoto");
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (heroPhoto && !prefersReducedMotion && canHover) {
    var maxTilt = 8; // degrees
    var current = { x: 0, y: 0 };
    var target = { x: 0, y: 0 };
    var raf = null;

    function onMove(e) {
      var rect = heroPhoto.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      target.x = -py * maxTilt;
      target.y = px * maxTilt;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onLeave() {
      target.x = 0;
      target.y = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function tick() {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      heroPhoto.style.transform =
        "perspective(900px) rotateX(" + current.x.toFixed(2) + "deg) rotateY(" + current.y.toFixed(2) + "deg)";

      if (Math.abs(target.x - current.x) > 0.05 || Math.abs(target.y - current.y) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    heroPhoto.addEventListener("pointermove", onMove);
    heroPhoto.addEventListener("pointerleave", onLeave);
  }

  /* --------------------------- Hero wordmark tilt --------------------------- */
  /* Same cursor-driven tilt as the hero photo, applied to the "Portfolio"
     wordmark banner — skipped under reduced motion or on touch devices. */
  var heroWordmark = document.getElementById("heroWordmark");

  if (heroWordmark && !prefersReducedMotion && canHover) {
    var wordmarkMaxTilt = 6; // degrees
    var wmCurrent = { x: 0, y: 0 };
    var wmTarget = { x: 0, y: 0 };
    var wmRaf = null;

    function onWordmarkMove(e) {
      var rect = heroWordmark.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      wmTarget.x = -py * wordmarkMaxTilt;
      wmTarget.y = px * wordmarkMaxTilt;
      if (!wmRaf) wmRaf = requestAnimationFrame(wmTick);
    }

    function onWordmarkLeave() {
      wmTarget.x = 0;
      wmTarget.y = 0;
      if (!wmRaf) wmRaf = requestAnimationFrame(wmTick);
    }

    function wmTick() {
      wmCurrent.x += (wmTarget.x - wmCurrent.x) * 0.12;
      wmCurrent.y += (wmTarget.y - wmCurrent.y) * 0.12;
      heroWordmark.style.transform =
        "perspective(1200px) rotateX(" + wmCurrent.x.toFixed(2) + "deg) rotateY(" + wmCurrent.y.toFixed(2) + "deg)";

      if (Math.abs(wmTarget.x - wmCurrent.x) > 0.05 || Math.abs(wmTarget.y - wmCurrent.y) > 0.05) {
        wmRaf = requestAnimationFrame(wmTick);
      } else {
        wmRaf = null;
      }
    }

    heroWordmark.addEventListener("pointermove", onWordmarkMove);
    heroWordmark.addEventListener("pointerleave", onWordmarkLeave);
  }

  /* ----------------------- Figma prototype (click to load) ------------------ */
  /* The embed is only inserted once someone asks for it, so Figma's player
     isn't fetched on every page view. */
  /* Only the embed variant carries data-proto-src; the same visual component is
     can also be a plain outbound link, which must keep its default navigation. */
  var protoLaunch = document.querySelector(".proto-launch[data-proto-src]");

  if (protoLaunch) {
    protoLaunch.addEventListener("click", function () {
      var src = protoLaunch.getAttribute("data-proto-src");
      if (!src) return;

      var frame = document.createElement("iframe");
      frame.src = src;
      frame.title = "Interactive Figma prototype of the Running App";
      frame.setAttribute("allowfullscreen", "");
      frame.setAttribute("loading", "lazy");

      protoLaunch.parentNode.replaceChild(frame, protoLaunch);
    });
  }

  /* --------------------------- Scroll progress bar --------------------------- */
  var scrollProgress = document.getElementById("scrollProgress");

  if (scrollProgress) {
    var updateProgress = function () {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      scrollProgress.style.width = pct + "%";
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }
})();
