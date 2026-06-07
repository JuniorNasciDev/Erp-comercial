(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.body.classList.add("hub--cursor");
  document.addEventListener(
    "pointermove",
    (e) => {
      document.body.style.setProperty("--mx", `${e.clientX}px`);
      document.body.style.setProperty("--my", `${e.clientY}px`);
    },
    { passive: true }
  );
})();
