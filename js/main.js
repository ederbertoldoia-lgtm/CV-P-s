(() => {
  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const progress = document.getElementById("scrollProgress");
  const themeToggle = document.getElementById("themeToggle");
  const year = document.getElementById("year");
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const sections = ["#inicio", "#sobre", "#impacto", "#experiencia", "#formacao", "#idiomas", "#projetos", "#contato"]
    .map((href) => document.querySelector(href))
    .filter(Boolean);

  document.body.classList.add("js-ready");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cv-theme", theme);
    themeToggle?.setAttribute(
      "aria-label",
      theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
    );
  };

  applyTheme(document.documentElement.dataset.theme || "dark");
  themeToggle?.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll(".meter span").forEach((bar) => {
          bar.style.width = bar.dataset.width;
        });
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const onScroll = () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) {
      progress.style.width = `${height ? (scrolled / height) * 100 : 0}%`;
    }
    header?.classList.toggle("is-scrolled", scrolled > 24);

    const current = [...sections].reverse().find((section) => scrolled + 120 >= section.offsetTop);
    navLinks.forEach((link) => {
      const active = current && link.getAttribute("href") === `#${current.id}`;
      link.classList.toggle("is-active", Boolean(active));
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      toggle?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      toggle?.setAttribute("aria-label", "Abrir menu");
    });
  });
})();
