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

// 검색 아이콘을 눌렀을 때 모바일 검색창을 열고, 검색 결과로 이동하는 함수
function initSearchInteraction() {
  const searchButton = document.querySelector(".search-button");
  const desktopInput = document.querySelector(".search-box input");
  const mobilePanel = document.querySelector(".mobile-search-panel");
  const mobileForm = document.querySelector(".mobile-search-form");
  const mobileInput = document.querySelector(".mobile-search-input");
  const mobileMessage = document.querySelector(".mobile-search-message");

  if (!searchButton) return;

  const isMobile = () => window.innerWidth <= 768;

  const closeSearch = () => {
    document.body.classList.remove("is-mobile-search-open");
    searchButton.setAttribute("aria-expanded", "false");
  };

  const openSearch = () => {
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    document.body.classList.remove("is-mobile-menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "모바일 메뉴 열기");
    }
    document.body.classList.add("is-mobile-search-open");
    searchButton.setAttribute("aria-expanded", "true");
    setTimeout(() => mobileInput && mobileInput.focus(), 120);
  };

  const findSearchTargets = () =>
    Array.from(
      document.querySelectorAll(".food-card, .meal-card, .recommend-item")
    );

  const clearHighlight = () => {
    document
      .querySelectorAll(".search-highlight")
      .forEach((item) => item.classList.remove("search-highlight"));
  };

  const runSearch = (keyword) => {
    const query = keyword.trim().toLowerCase();
    clearHighlight();

    if (!query) {
      if (mobileMessage) mobileMessage.textContent = "검색어를 입력해주세요.";
      return;
    }

    const target = findSearchTargets().find((item) =>
      item.innerText.toLowerCase().includes(query)
    );

    if (!target) {
      if (mobileMessage) mobileMessage.textContent = `"${keyword}" 검색 결과가 없습니다.`;
      return;
    }

    if (mobileMessage) mobileMessage.textContent = `"${keyword}" 결과로 이동합니다.`;
    closeSearch();
    target.classList.add("search-highlight");
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      target.classList.remove("search-highlight");
    }, 1800);
  };

  searchButton.addEventListener("click", () => {
    if (isMobile()) {
      if (document.body.classList.contains("is-mobile-search-open")) {
        closeSearch();
      } else {
        openSearch();
      }
      return;
    }

    runSearch(desktopInput ? desktopInput.value : "");
  });

  if (desktopInput) {
    desktopInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        runSearch(desktopInput.value);
      }
    });
  }

  if (mobileForm) {
    mobileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      runSearch(mobileInput ? mobileInput.value : "");
    });
  }

  window.addEventListener("resize", () => {
    if (!isMobile()) closeSearch();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSearch();
  });
}

// 모바일 헤더 메뉴를 열고 닫는 함수
function initMobileMenu() {
  const toggleButton = document.querySelector(".mobile-menu-toggle");
  const menuPanel = document.querySelector(".mobile-menu-panel");
  if (!toggleButton || !menuPanel) return;

  const closeMenu = () => {
    document.body.classList.remove("is-mobile-menu-open");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-label", "모바일 메뉴 열기");
  };

  const openMenu = () => {
    document.body.classList.remove("is-mobile-search-open");
    const searchButton = document.querySelector(".search-button");
    if (searchButton) searchButton.setAttribute("aria-expanded", "false");
    document.body.classList.add("is-mobile-menu-open");
    toggleButton.setAttribute("aria-expanded", "true");
    toggleButton.setAttribute("aria-label", "모바일 메뉴 닫기");
  };

  toggleButton.addEventListener("click", () => {
    if (document.body.classList.contains("is-mobile-menu-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

// 페이지 로드 후 모든 기능을 실행하는 함수
function initPageInteractions() {
  initMainVisualSwiper();
  initMealSwiper();
  initMdTabs();
  initScrollReveal();
  initScrollTopButton();
  initSearchInteraction();
  initMobileMenu();
}

document.addEventListener("DOMContentLoaded", initPageInteractions);
