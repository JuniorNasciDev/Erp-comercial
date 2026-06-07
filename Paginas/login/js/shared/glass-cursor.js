(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const panel = document.querySelector(".shell .panel");
  if (!panel) return;

  panel.classList.add("panel--cursor-glow");
  const style = document.createElement("style");
  style.textContent = `
    .panel--cursor-glow::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.35s ease;
      background: radial-gradient(
        500px circle at var(--gx, 50%) var(--gy, 50%),
        rgba(255, 255, 255, 0.07) 0%,
        transparent 58%
      );
      z-index: 0;
    }
    .panel--cursor-glow:hover::before { opacity: 1; }
  `;
  document.head.appendChild(style);

  panel.addEventListener(
    "pointermove",
    (e) => {
      const r = panel.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      panel.style.setProperty("--gx", `${x}%`);
      panel.style.setProperty("--gy", `${y}%`);
    },
    { passive: true }
  );
})();
