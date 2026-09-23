(() => {
  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const progress = document.getElementById("scrollProgress");
  const photoInput = document.getElementById("photoInput");
  const photo = document.getElementById("profilePhoto");
  const typed = document.getElementById("typedTagline");
  const themeToggle = document.getElementById("themeToggle");
  const themeToggleRail = document.getElementById("themeToggleRail");
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const tagline =
    "O impossível é apenas uma questão de tempo...ou de qual IA você está usando!";

  document.body.classList.add("js-ready");

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cv-theme", theme);
    themeToggle?.setAttribute(
      "aria-label",
      theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
    );
  };

  const toggleTheme = () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  };

  applyTheme(document.documentElement.dataset.theme || "dark");
  themeToggle?.addEventListener("click", toggleTheme);
  themeToggleRail?.addEventListener("click", toggleTheme);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const photoVersion = "4";
  const savedVersion = localStorage.getItem("cv-photo-version");
  const savedPhoto = localStorage.getItem("cv-photo");
  if (savedPhoto && savedVersion === photoVersion) {
    photo.src = savedPhoto;
    document.querySelectorAll(".hero-portrait img, .intro-thumb img").forEach((img) => {
      img.src = savedPhoto;
    });
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const typeText = async (text) => {
    if (!typed) return;
    typed.textContent = "";
    for (const char of text) {
      typed.textContent += char;
      await wait(char === " " ? 18 : 34);
    }
  };

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
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const onScroll = () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) {
      progress.style.width = `${height ? (scrolled / height) * 100 : 0}%`;
    }
    header?.classList.toggle("is-scrolled", scrolled > 24);

    const current = [...sections].reverse().find((section) => scrolled + 140 >= section.offsetTop);
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

  photoInput?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      photo.src = result;
      document.querySelectorAll(".hero-portrait img, .intro-thumb img").forEach((img) => {
        img.src = result;
      });
      try {
        localStorage.setItem("cv-photo", result);
        localStorage.setItem("cv-photo-version", photoVersion);
      } catch {
        /* ignore quota */
      }
    };
    reader.readAsDataURL(file);
  });

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (motionOk) {
    typeText(tagline);
  } else if (typed) {
    typed.textContent = tagline;
    document.querySelector(".cursor")?.remove();
  }
})();
