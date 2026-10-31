(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const header = document.getElementById("siteHeader");
  const progressBar = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const spotlight = document.getElementById("spotlight");

  const navLinks = Array.from(document.querySelectorAll(".desktop-nav a[data-nav]"));
  const navSections = navLinks
    .map((link) => {
      const target = document.querySelector(link.getAttribute("href"));
      return target ? { link, section: target } : null;
    })
    .filter(Boolean);

  const setActiveNav = () => {
    const marker = window.scrollY + 170;
    let activeLink = null;

    navSections.forEach(({ link, section }) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (sectionTop <= marker) {
        activeLink = link;
      }
    });

    const nearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 10;

    if (nearBottom && navSections.length) {
      activeLink = navSections[navSections.length - 1].link;
    }

    navLinks.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateScrollState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollRange =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollRange > 0 ? (scrollTop / scrollRange) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    if (header) {
      header.classList.toggle("is-scrolled", scrollTop > 8);
    }

    if (backToTop) {
      backToTop.classList.toggle("is-visible", scrollTop > 620);
    }

    setActiveNav();
  };

  let scrollTicking = false;

  const requestScrollUpdate = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      updateScrollState();
      scrollTicking = false;
    });
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  updateScrollState();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });
    });
  }

  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const mobileLinks = Array.from(document.querySelectorAll(".mobile-link"));
  const desktopQuery = window.matchMedia("(min-width: 981px)");
  let menuOpen = false;

  const setMenuState = (open, restoreFocus = true) => {
    if (!menuToggle || !mobileNav) return;
    menuOpen = open;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.classList.toggle("is-open", open);
    mobileNav.inert = !open;
    document.body.classList.toggle("nav-open", open);

    if (open) {
      window.setTimeout(() => {
        if (mobileLinks[0] && menuOpen) {
          mobileLinks[0].focus({ preventScroll: true });
        }
      }, 120);
    } else if (restoreFocus && document.activeElement !== menuToggle) {
      const focusWasInMenu =
        mobileNav.contains(document.activeElement) ||
        document.activeElement === menuToggle;
      if (focusWasInMenu) {
        menuToggle.focus({ preventScroll: true });
      }
    }
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      setMenuState(!menuOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMenuState(false);
      });
    });

    const headerBrand = document.querySelector(".site-header .brand");
    if (headerBrand) {
      headerBrand.addEventListener("click", () => {
        if (menuOpen) setMenuState(false);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (!menuOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setMenuState(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = [
        menuToggle,
        ...mobileNav.querySelectorAll("a[href], button:not([disabled])")
      ].filter((el) => el && el.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const handleDesktopChange = (event) => {
      if (event.matches && menuOpen) {
        setMenuState(false, false);
      }
    };

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleDesktopChange);
    }
  }

  const portrait = document.querySelector(".portrait-img");

  if (portrait) {
    const markPortraitMissing = () => {
      portrait.classList.add("is-missing");
      portrait.setAttribute("aria-hidden", "true");
    };

    portrait.addEventListener("error", markPortraitMissing);

    if (portrait.complete && portrait.naturalWidth === 0) {
      markPortraitMissing();
    }
  }

  const copyButton = document.getElementById("copyEmail");
  const copyStatus = document.getElementById("copyStatus");
  let copyTimer;

  const showCopyStatus = (message) => {
    if (!copyStatus) return;
    copyStatus.textContent = message;
    window.clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 2800);
  };

  const fallbackCopy = (text) => {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-1000px";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(field);
    return copied;
  };

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const email = copyButton.dataset.email || "naveenyuva47@gmail.com";

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          showCopyStatus("Email copied to clipboard.");
          return;
        }

        if (fallbackCopy(email)) {
          showCopyStatus("Email copied to clipboard.");
        } else {
          showCopyStatus("Copy failed. Please select the email manually.");
        }
      } catch (error) {
        if (fallbackCopy(email)) {
          showCopyStatus("Email copied to clipboard.");
        } else {
          showCopyStatus("Copy failed. Please select the email manually.");
        }
      }

      copyButton.focus({ preventScroll: true });
    });
  }

  if (spotlight) {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (finePointer.matches && !prefersReducedMotion.matches) {
      let targetX = window.innerWidth * 0.72;
      let targetY = window.innerHeight * 0.28;
      let currentX = targetX;
      let currentY = targetY;
      let pointerVisible = false;
      let spotlightFrame = null;

      const animateSpotlight = () => {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

        if (
          Math.abs(targetX - currentX) > 0.2 ||
          Math.abs(targetY - currentY) > 0.2
        ) {
          spotlightFrame = window.requestAnimationFrame(animateSpotlight);
        } else {
          spotlightFrame = null;
        }
      };

      document.addEventListener(
        "pointermove",
        (event) => {
          targetX = event.clientX;
          targetY = event.clientY;

          if (!pointerVisible) {
            pointerVisible = true;
            document.body.classList.add("has-pointer");
          }

          if (!spotlightFrame) {
            spotlightFrame = window.requestAnimationFrame(animateSpotlight);
          }
        },
        { passive: true }
      );

      document.addEventListener("mouseleave", () => {
        pointerVisible = false;
        document.body.classList.remove("has-pointer");
      });
    }
  }

  const typedText = document.getElementById("typedText");
  const phrases = [
    "building full-stack web applications",
    "working with Flask and Django",
    "designing clean SQL databases",
    "learning AWS cloud fundamentals"
  ];

  if (typedText) {
    if (prefersReducedMotion.matches) {
      typedText.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = phrases[0].length;
      let deleting = false;
      let typingTimer;

      const typeTick = () => {
        const phrase = phrases[phraseIndex];

        if (!deleting) {
          charIndex += 1;
          typedText.textContent = phrase.slice(0, charIndex);

          if (charIndex >= phrase.length) {
            deleting = true;
            typingTimer = window.setTimeout(typeTick, 2300);
            return;
          }

          typingTimer = window.setTimeout(typeTick, 52 + Math.random() * 34);
          return;
        }

        charIndex -= 1;
        typedText.textContent = phrase.slice(0, Math.max(0, charIndex));

        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typingTimer = window.setTimeout(typeTick, 360);
          return;
        }

        typingTimer = window.setTimeout(typeTick, 26);
      };

      typingTimer = window.setTimeout(() => {
        deleting = true;
        typeTick();
      }, 2800);

      window.addEventListener("pagehide", () => {
        window.clearTimeout(typingTimer);
      });
    }
  }

  const revealElements = Array.from(document.querySelectorAll(".reveal"));

  document.querySelectorAll("[data-stagger]").forEach((group) => {
    Array.from(group.children)
      .filter((child) => child.classList.contains("reveal"))
      .forEach((child, index) => {
        child.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 70}ms`);
      });
  });

  if (
    !("IntersectionObserver" in window) ||
    prefersReducedMotion.matches
  ) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -7% 0px"
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  window.addEventListener("load", updateScrollState);
})();
