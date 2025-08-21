"use Strict";

(function () {
  const viewport = document.getElementById("tViewport");
  const slides = Array.from(viewport.querySelectorAll(".testimonial-item"));
  const prev = document.querySelector(".btn--left");
  const next = document.querySelector(".btn--right");

  // find the slide whose center is closest to viewport center
  function getNearestIndex() {
    const vpRect = viewport.getBoundingClientRect();
    const vpCenter = vpRect.left + vpRect.width / 2;
    let nearest = 0;
    let minDist = Infinity;
    slides.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(center - vpCenter);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    return nearest;
  }

  function setActive(i) {
    slides.forEach((s, idx) => s.toggleAttribute("data-active", idx === i));
  }

  function scrollToIndex(i) {
    const target = slides[Math.max(0, Math.min(i, slides.length - 1))];
    target.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    // Update active after the scroll settles
    requestAnimationFrame(() => setActive(i));
  }

  // On load, center the first slide
  window.addEventListener("load", () => {
    scrollToIndex(0);
  });

  // Update active state while scrolling (throttled by rAF)
  let ticking = false;
  viewport.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        setActive(getNearestIndex());
        ticking = false;
      });
      ticking = true;
    }
  });

  // Arrows move to previous/next centered slide
  prev.addEventListener("click", () => {
    const i = getNearestIndex();
    scrollToIndex(i - 1);
  });
  next.addEventListener("click", () => {
    const i = getNearestIndex();
    scrollToIndex(i + 1);
  });

  // Keyboard support when viewport is focused
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev.click();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next.click();
    }
  });
})();
