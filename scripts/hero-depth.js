// Hero depth response: at most ±8° pitch and ±10° yaw, pointer-fine only.
// External file (not inline) so the Content-Security-Policy can stay
// `script-src 'self'` with no hash or 'unsafe-inline'.
(function () {
  var frame = document.querySelector("[data-ball-tilt]");
  var hero = document.querySelector("[data-hero]");
  if (!frame || !hero) return;

  var finePointer = window.matchMedia("(pointer: fine)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reducedMotion.matches) return;

  var queued = false;
  var x = 0;
  var y = 0;

  function apply() {
    queued = false;
    frame.style.setProperty("--rx", (-y * 16).toFixed(2) + "deg");
    frame.style.setProperty("--ry", (x * 20).toFixed(2) + "deg");
  }

  hero.addEventListener(
    "pointermove",
    function (event) {
      var rect = hero.getBoundingClientRect();
      x = (event.clientX - rect.left) / rect.width - 0.5;
      y = (event.clientY - rect.top) / rect.height - 0.5;
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(apply);
      }
    },
    { passive: true }
  );

  hero.addEventListener("pointerleave", function () {
    frame.style.removeProperty("--rx");
    frame.style.removeProperty("--ry");
  });
})();
