(function () {
  document.addEventListener(
    "click",
    (e) => {
      const ico = e.target.closest(".ico[data-interactive]");
      if (!ico) return;
      ico.classList.remove("is-tap");
      window.requestAnimationFrame(() => {
        ico.classList.add("is-tap");
        window.setTimeout(() => ico.classList.remove("is-tap"), 260);
      });
    },
    true
  );
})();
