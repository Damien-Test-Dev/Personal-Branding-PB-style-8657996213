(function () {
  const root = document.documentElement;

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme (persisted)
  const themeBtn = document.getElementById("themeBtn");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  function toggleTheme() {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  // Mobile nav
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu on link click
    navMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Copy email
  const copyBtn = document.getElementById("copyEmailBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.getAttribute("data-email");
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.textContent = "Email copié ✓";
        setTimeout(() => (copyBtn.textContent = "Copier mon email"), 1400);
      } catch {
        // Fallback: open mail client
        window.location.href = `mailto:${encodeURIComponent(email)}`;
      }
    });
  }

  // Project filtering
  const chips = Array.from(document.querySelectorAll(".chip"));
  const projects = Array.from(document.querySelectorAll(".project"));

  function setActiveChip(btn) {
    chips.forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
  }

  function applyFilter(filter) {
    projects.forEach((p) => {
      const tags = (p.getAttribute("data-tags") || "").split(/\s+/);
      const show = filter === "all" || tags.includes(filter);
      p.hidden = !show;
    });
  }

  chips.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      setActiveChip(btn);
      applyFilter(filter);
    });
  });

  // Contact form -> mailto
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");
  const emailTarget = "ton.email@domaine.com";

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const subject = String(fd.get("subject") || "").trim();
      const message = String(fd.get("message") || "").trim();

      if (!name || !subject || !message) {
        if (hint) hint.textContent = "Complète les champs : c’est ce qui rend la demande actionnable.";
        return;
      }

      const fullSubject = `[Site] ${subject} — ${name}`;
      const body = `${message}\n\n---\nNom: ${name}\nSource: GitHub Pages`;

      const mailto = `mailto:${encodeURIComponent(emailTarget)}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;

      if (hint) hint.textContent = "Email préparé. Envoie-le — et on avance.";
    });
  }
})();
