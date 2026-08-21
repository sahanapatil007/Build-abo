document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);

  const lenis = new Lenis({
    autoRaf: false,
    smoothWheel: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  const resumeScroll = () => {
    lenis.start();
    lenis.resize();
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") resumeScroll();
  });
  window.addEventListener("focus", resumeScroll);
  window.addEventListener("pageshow", resumeScroll);

  const sticky = document.querySelector(".sticky-header");
  lenis.on("scroll", ({ scroll }) => {
    if (!sticky) return;
    sticky.classList.toggle("is-visible", scroll > 80);
  });

  const menuBtns = document.querySelectorAll("[data-open-menu]");
  const closeBtns = document.querySelectorAll("[data-close-menu]");
  const mobileMenu = document.querySelector(".mobile-menu");
  const openMenu = () => {
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    lenis.stop();
  };
  const closeMenu = () => {
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    lenis.start();
  };
  menuBtns.forEach((btn) => btn.addEventListener("click", openMenu));
  closeBtns.forEach((btn) => btn.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) closeMenu();
  });
  mobileMenu.querySelectorAll(".mobile-nav-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const item = btn.closest(".has-children");
      if (!item) return;
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (a.getAttribute("href") && a.getAttribute("href") !== "#") closeMenu();
    });
  });

  const heroSwiper = new Swiper(".hero-swiper", {
    effect: "fade",
    fadeEffect: { crossFade: true },
    loop: true,
    speed: 900,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: ".hero-pagination", type: "progressbar" },
  });

  const teamSwiper = new Swiper(".team-swiper", {
    slidesPerView: 1,
    spaceBetween: 15,
    speed: 750,
    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 15 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      1025: { slidesPerView: 3, spaceBetween: 30 },
    },
  });
  document.querySelectorAll("[data-team-prev]").forEach((el) => el.addEventListener("click", () => teamSwiper.slidePrev()));
  document.querySelectorAll("[data-team-next]").forEach((el) => el.addEventListener("click", () => teamSwiper.slideNext()));

  const testimonialEl = document.querySelector(".testimonial-swiper");
  if (testimonialEl) {
    const originals = [...testimonialEl.querySelectorAll(".swiper-slide")];
    originals.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      testimonialEl.querySelector(".swiper-wrapper").appendChild(clone);
    });
    new Swiper(".testimonial-swiper", {
      slidesPerView: "auto",
      spaceBetween: 28,
      loop: true,
      speed: 8000,
      grabCursor: true,
      allowTouchMove: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      freeMode: {
        enabled: true,
        momentum: false,
      },
    });
  }

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.tab;
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("is-active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));
      btn.classList.add("is-active");
      document.querySelector(id)?.classList.add("is-active");
    });
  });

  document.querySelectorAll(".acc-item").forEach((item) => {
    item.querySelector(".acc-btn").addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".acc-item").forEach((i) => i.classList.remove("is-open"));
      if (!open) item.classList.add("is-open");
    });
  });

  document.querySelectorAll("[data-counter]").forEach((el) => {
    const end = Number(el.dataset.counter);
    const decimals = (String(el.dataset.counter).split(".")[1] || "").length;
    const obj = { val: decimals ? 0 : 1 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: end,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = decimals ? obj.val.toFixed(decimals) : String(Math.floor(obj.val));
          },
        });
      },
    });
  });

  gsap.utils.toArray(".js-fade").forEach((el) => {
    const y = Number(el.dataset.y || 50);
    const delay = Number(el.dataset.delay || 0);
    gsap.from(el, {
      y,
      opacity: 0,
      duration: Number(el.dataset.dur || 0.75),
      delay,
      ease: el.dataset.ease || "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  gsap.utils.toArray(".reveal").forEach((wrap) => {
    const img = wrap.querySelector("img");
    if (!img) return;
    const dir = wrap.dataset.dir || "top";
    const clipFrom =
      dir === "left" ? "inset(0 100% 0 0)" :
      dir === "center" ? "inset(20% 20% 20% 20%)" :
      "inset(100% 0 0 0)";
    gsap.fromTo(
      img,
      { clipPath: clipFrom, scale: 1.12 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: Number(wrap.dataset.dur || 1.2),
        delay: Number(wrap.dataset.delay || 0),
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 85%" },
      }
    );
  });

  const track = document.querySelector(".service-track");
  const stage = document.querySelector(".services-stage");
  if (track && stage) {
    ScrollTrigger.matchMedia({
      "(min-width: 768px)": function () {
        const fromX = () => window.innerWidth;
        const toX = () => -(track.scrollWidth - window.innerWidth * 0.12);
        const tween = gsap.fromTo(track, {
          x: fromX,
        }, {
          x: toX,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => "+=" + Math.max(track.scrollWidth + window.innerWidth, window.innerHeight * 2),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => tween.kill();
      },
      "(max-width: 767px)": function () {
        gsap.set(track, { clearProps: "transform,x" });
        const clones = [...track.children].map((card) => {
          const clone = card.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          clone.dataset.marqueeClone = "true";
          track.appendChild(clone);
          return clone;
        });
        stage.classList.add("is-marquee");
        return () => {
          stage.classList.remove("is-marquee");
          clones.forEach((clone) => clone.remove());
          gsap.set(track, { clearProps: "transform,x" });
        };
      },
    });
  }

  const showcase = document.querySelector(".project-showcase");
  if (showcase) {
    const items = gsap.utils.toArray(".project-item");
    const panels = items.map((item) => item.querySelector(".project-panel")).filter(Boolean);
    gsap.matchMedia().add("(min-width: 1025px)", () => {
      if (panels.length < 2) return;
      const backgrounds = panels.map((panel) => panel.querySelector(".project-background"));
      const contents = panels.map((panel) => panel.querySelector(".project-content"));
      if (!backgrounds.every(Boolean) || !contents.every(Boolean)) return;

      gsap.set(items, { position: "absolute", inset: 0 });
      backgrounds.forEach((bg, index) => {
        gsap.set(bg, { zIndex: index + 1, willChange: "clip-path" });
      });
      gsap.set(backgrounds, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(backgrounds[0], { clipPath: "inset(0% 0 0 0)" });
      gsap.set(contents, { autoAlpha: 0, y: 0 });
      gsap.set(contents[0], { autoAlpha: 1, y: 0 });

      const scene = gsap.timeline({
        scrollTrigger: {
          trigger: showcase,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.35, max: 0.8 },
            delay: 0.08,
            ease: "power2.out",
          },
        },
      });

      panels.forEach((panel, index) => {
        if (index === 0) return;
        const at = index - 1;
        scene
          .to(backgrounds[index], { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "none" }, at)
          .to(contents[index - 1], { autoAlpha: 0, y: -14, duration: 0.12, ease: "none" }, at + 0.42)
          .fromTo(contents[index], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: "none" }, at + 0.56);
      });

      ScrollTrigger.refresh();

      return () => {
        scene.kill();
        gsap.set([items, backgrounds, contents], { clearProps: "all" });
      };
    });
  }

  gsap.utils.toArray(".process-card").forEach((card, i) => {
    gsap.from(card, {
      x: 130,
      opacity: 0,
      duration: 1,
      delay: 0.75 - i * 0.2,
      ease: "power3.out",
      scrollTrigger: { trigger: ".process-cards", start: "top 80%" },
    });
  });

  const newsForm = document.querySelector(".news-form");
  if (newsForm) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsForm.querySelector("input");
      if (!input.value) return;
      input.value = "";
      input.placeholder = "Thanks for subscribing";
    });
  }

  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  ScrollTrigger.refresh();
  window.addEventListener("load", () => {
    lenis.resize();
    ScrollTrigger.refresh();
  });
});
