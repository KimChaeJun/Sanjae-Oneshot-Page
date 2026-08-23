const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress span");
const menuButton = document.querySelector("[data-menu-button]");
const menuButtonLabel = menuButton?.querySelector(".sr-only");
const menu = document.querySelector("[data-menu]");
const year = document.querySelector("[data-year]");
const mobileFlowViewport = window.matchMedia("(max-width: 700px)");
const flowItems = [...document.querySelectorAll(".flow-item")];

const updateScrollUi = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  header?.classList.toggle("scrolled", scrollTop > 16);
  if (progress) progress.style.width = `${percentage}%`;
};

const setMenuOpen = (isOpen) => {
  menuButton?.setAttribute("aria-expanded", String(isOpen));
  menu?.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  if (menuButtonLabel) menuButtonLabel.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
};

const closeMenu = () => setMenuOpen(false);

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const setFlowPreviewOpen = (item, isOpen) => {
  item.classList.toggle("is-preview-open", isOpen);
  item.setAttribute("aria-expanded", String(isOpen));
  item.querySelector(".flow-preview")?.setAttribute("aria-hidden", String(!isOpen));
};

const closeFlowPreviews = (exceptItem) => {
  flowItems.forEach((item) => {
    if (item !== exceptItem) setFlowPreviewOpen(item, false);
  });
};

flowItems.forEach((item) => {
  setFlowPreviewOpen(item, false);

  item.addEventListener("click", () => {
    if (!mobileFlowViewport.matches) return;

    const shouldOpen = !item.classList.contains("is-preview-open");
    closeFlowPreviews(item);
    setFlowPreviewOpen(item, shouldOpen);
  });

  item.addEventListener("keydown", (event) => {
    if (!mobileFlowViewport.matches || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    item.click();
  });
});

const syncFlowPreviewMode = () => {
  if (!mobileFlowViewport.matches) closeFlowPreviews();
};

mobileFlowViewport.addEventListener?.("change", syncFlowPreviewMode);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -42px" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

if (year) year.textContent = new Date().getFullYear();
window.addEventListener("scroll", updateScrollUi, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 700) closeMenu();
  syncFlowPreviewMode();
  updateScrollUi();
});
updateScrollUi();
