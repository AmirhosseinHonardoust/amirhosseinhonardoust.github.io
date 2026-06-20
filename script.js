/* =========================================================
   Amir Honardoust — portfolio interactions
   Vanilla JS, no dependencies. Everything degrades
   gracefully and respects prefers-reduced-motion.
   ========================================================= */
(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  const themeToggle = document.querySelector(".theme-toggle");
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (storedTheme) {
    root.setAttribute("data-theme", storedTheme);
  } else if (prefersDark) {
    root.setAttribute("data-theme", "dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = (root.getAttribute("data-theme") || "light") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  /* ---------- Footer year ---------- */
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("#nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll progress bar + header elevation ---------- */
  const progress = document.querySelector(".scroll-progress");
  const header = document.querySelector(".site-header");

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.transform = `scaleX(${pct / 100})`;
    if (header) header.classList.toggle("is-scrolled", scrollTop > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Scroll-spy active nav ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
  const linkFor = (id) => navLinks.find((a) => a.getAttribute("href") === `#${id}`);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("is-active"));
            const link = linkFor(entry.target.id);
            if (link) link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Project filtering ---------- */
  const filterBar = document.querySelector(".project-filters");
  const projectGrid = document.querySelector(".project-grid");

  if (filterBar && projectGrid) {
    const cards = Array.from(projectGrid.querySelectorAll(".project-card[data-categories]"));
    const buttons = Array.from(filterBar.querySelectorAll(".filter-chip"));

    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;

      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const cats = (card.dataset.categories || "").split(" ");
        const show = filter === "all" || cats.includes(filter);
        card.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------- Signature: self-typing hero terminal ---------- */
  const typeTarget = document.querySelector("[data-typed]");
  if (typeTarget) {
    const lines = [
      "amir.profile = {",
      "  role: \"Data Scientist\",",
      "  focus: [",
      "    \"risk modeling\",",
      "    \"RAG systems\",",
      "    \"synthetic data\",",
      "    \"recommenders\"",
      "  ],",
      "  output: \"decisions\"",
      "}"
    ];
    const fullText = lines.join("\n");

    if (reduceMotion) {
      typeTarget.textContent = fullText;
    } else {
      typeTarget.textContent = "";
      typeTarget.classList.add("is-typing");
      let i = 0;
      const tick = () => {
        if (i <= fullText.length) {
          typeTarget.textContent = fullText.slice(0, i);
          // vary speed slightly: pause at newlines for a natural cadence
          const ch = fullText[i - 1];
          i++;
          setTimeout(tick, ch === "\n" ? 90 : 18 + Math.random() * 22);
        } else {
          typeTarget.classList.remove("is-typing");
          typeTarget.classList.add("is-done");
        }
      };
      // small delay so it starts after first paint
      setTimeout(tick, 450);
    }
  }
})();
