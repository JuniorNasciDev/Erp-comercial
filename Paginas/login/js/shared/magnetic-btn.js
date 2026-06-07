(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    const strength = 0.12;
    btn.addEventListener(
      "pointermove",
      (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      },
      { passive: true }
    );
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
})();
