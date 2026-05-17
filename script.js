const root = document.documentElement;
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const year = document.querySelector("#year");

const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (storedTheme) {
  root.setAttribute("data-theme", storedTheme);
} else if (prefersDark) {
  root.setAttribute("data-theme", "dark");
}

if (year) {
  year.textContent = new Date().getFullYear();
}

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

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}
