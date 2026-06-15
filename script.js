/* ===========================================================
   Vertex Nirmaan — shared interactions
   =========================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ---------- Hero carousel ---------- */
  var carousel = document.querySelector(".carousel");
  if (carousel) {
    var slides = carousel.querySelectorAll(".slide");
    var dotsWrap = carousel.querySelector(".carousel__dots");
    var current = 0;
    var timer = null;

    // build dots
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      if (i === 0) b.classList.add("active");
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", function () { go(i); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll("button");

    function go(i) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = (i + slides.length) % slides.length;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
      restart();
    }
    function next() { go(current + 1); }
    function prev() { go(current - 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, 6000); }

    var nextBtn = carousel.querySelector(".carousel__arrow.next");
    var prevBtn = carousel.querySelector(".carousel__arrow.prev");
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    // touch / swipe
    var startX = 0;
    carousel.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (dx < -50) next();
      if (dx > 50) prev();
    });

    restart();
  }

  /* ---------- Enquiry modal ---------- */
  var modal = document.getElementById("enquiry-modal");
  if (modal) {
    var openers = document.querySelectorAll("[data-open-enquiry]");
    var closeEls = modal.querySelectorAll("[data-close-modal]");
    var form = modal.querySelector(".form");
    var success = modal.querySelector(".form__success");

    function openModal(e) { if (e) e.preventDefault(); modal.classList.add("open"); document.body.style.overflow = "hidden"; }
    function closeModal() {
      modal.classList.remove("open"); document.body.style.overflow = "";
      if (form && success) { form.style.display = ""; success.classList.remove("show"); form.reset(); }
    }
    openers.forEach(function (o) { o.addEventListener("click", openModal); });
    closeEls.forEach(function (c) { c.addEventListener("click", closeModal); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        form.style.display = "none";
        if (success) success.classList.add("show");
      });
    }
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + "s";
      obs.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Active nav link by current page ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
