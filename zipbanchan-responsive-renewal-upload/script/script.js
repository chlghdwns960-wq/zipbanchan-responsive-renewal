// 메인 비주얼 Swiper를 초기화하는 함수
function initMainVisualSwiper() {
  const fractionCurrent = document.querySelector(".mv-fraction .current");
  const fractionTotal = document.querySelector(".mv-fraction .total");

  if (!document.querySelector(".mainVisualSwiper") || typeof Swiper === "undefined") return;

  new Swiper(".mainVisualSwiper", {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      prevEl: ".mv-prev",
      nextEl: ".mv-next",
    },
    on: {
      init: function () {
        if (fractionTotal) fractionTotal.textContent = 5;
        if (fractionCurrent) fractionCurrent.textContent = this.realIndex + 1;
      },
      slideChange: function () {
        if (fractionCurrent) fractionCurrent.textContent = this.realIndex + 1;
      },
    },
  });
}

// 식단/상품 카드 Swiper를 초기화하는 함수
function initMealSwiper() {
  if (!document.querySelector(".mealSwiper") || typeof Swiper === "undefined") return;

  new Swiper(".mealSwiper", {
    loop: true,
    speed: 800,
    spaceBetween: 16,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    navigation: {
      prevEl: ".meal-prev",
      nextEl: ".meal-next",
    },
    observer: true,
    observeParents: true,
    updateOnWindowResize: true,
    slidesPerView: 2,
    slidesPerGroup: 1,
    breakpoints: {
      769: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
    },
  });
}


// 전달받은 요소에 스크롤 등장 클래스를 붙이고 관찰하는 함수
function observeRevealItems(targets) {
  if (!targets || !targets.length) return;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  targets.forEach((target) => {
    target.classList.add("reveal-item");
    observer.observe(target);
  });
}

// MD 추천반찬 탭 클릭 시 HTML에 준비된 상품 패널만 보여주는 함수
function initMdTabs() {
  const buttons = document.querySelectorAll(".md-filter-button");
  const panels = document.querySelectorAll(".md-tab-panel");

  if (!buttons.length || !panels.length) return;

  buttons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      button.classList.contains("md-filter-button--active") ? "true" : "false"
    );

    button.addEventListener("click", function () {
      const targetTab = this.dataset.mdTab;

      buttons.forEach((item) => {
        item.classList.remove("md-filter-button--active");
        item.setAttribute("aria-pressed", "false");
      });

      this.classList.add("md-filter-button--active");
      this.setAttribute("aria-pressed", "true");

      panels.forEach((panel) => {
        const isActivePanel = panel.dataset.mdPanel === targetTab;
        panel.classList.toggle("md-tab-panel--active", isActivePanel);
        panel.setAttribute("aria-hidden", isActivePanel ? "false" : "true");

        if (isActivePanel) {
          panel.classList.add("md-tab-changing");
          setTimeout(() => {
            panel.classList.remove("md-tab-changing");
            observeRevealItems(panel.querySelectorAll(".food-card"));
          }, 160);
        }
      });
    });
  });
}

// 페이지 주요 레이아웃 요소에 스크롤 등장 효과를 연결하는 함수
function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    ".content-box, .food-card, .box5-header, .md-filter-list, .site-footer"
  );

  observeRevealItems(revealTargets);
}

// 맨 위로 이동 버튼을 제어하는 함수
function initScrollTopButton() {
  const topButton = document.querySelector(".scroll-top-button");
  if (!topButton) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      topButton.classList.add("is-visible");
    } else {
      topButton.classList.remove("is-visible");
    }
  });

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// 페이지 로드 후 모든 기능을 실행하는 함수
function initPageInteractions() {
  initMainVisualSwiper();
  initMealSwiper();
  initMdTabs();
  initScrollReveal();
  initScrollTopButton();
}

document.addEventListener("DOMContentLoaded", initPageInteractions);
