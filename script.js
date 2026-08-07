const slides = Array.from(document.querySelectorAll(".slide"));
const dotsWrap = document.querySelector(".slider-dots");
const prevButton = document.querySelector(".slider-button.prev");
const nextButton = document.querySelector(".slider-button.next");
const toast = document.querySelector(".toast");
const tabLinks = Array.from(document.querySelectorAll(".section-tabs a"));
const sections = tabLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

let currentSlide = 0;
let toastTimer;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentSlide);
  });

  document.querySelectorAll(".slider-dots button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentSlide);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
}

if (dotsWrap && slides.length) {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `${index + 1}번 사진 보기`);
    dot.addEventListener("click", () => showSlide(index));
    dotsWrap.appendChild(dot);
  });

  prevButton.addEventListener("click", () => showSlide(currentSlide - 1));
  nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
  showSlide(0);
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copy);
    const text = target?.textContent.trim();

    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast("복사되었습니다");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      showToast("복사되었습니다");
    }
  });
});

function syncActiveTab() {
  const current =
    sections.findLast((section) => section.getBoundingClientRect().top <= 92) || sections[0];

  tabLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

window.addEventListener("scroll", syncActiveTab, { passive: true });
syncActiveTab();
