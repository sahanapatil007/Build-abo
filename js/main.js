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
    if (document.body.classList.contains("lead-open") || document.body.classList.contains("menu-open")) return;
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
    if (!document.body.classList.contains("lead-open")) lenis.start();
  };
  menuBtns.forEach((btn) => btn.addEventListener("click", openMenu));
  closeBtns.forEach((btn) => btn.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (document.querySelector(".lead-popup.is-open")) return;
    if (mobileMenu && mobileMenu.classList.contains("is-open")) closeMenu();
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

  if (document.querySelector(".hero-swiper")) {
    new Swiper(".hero-swiper", {
      effect: "fade",
      fadeEffect: { crossFade: true },
      loop: true,
      speed: 900,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: ".hero-pagination", type: "progressbar" },
    });
  }

  const reviewSwipers = [];
  const ytWarmup = document.createElement("div");
  ytWarmup.id = "yt-warmup";
  ytWarmup.hidden = true;
  ytWarmup.setAttribute("aria-hidden", "true");
  document.body.appendChild(ytWarmup);
  const ytPlayers = new Map();
  const ytEmbed = (id) =>
    `https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1&autoplay=0&origin=${encodeURIComponent(window.location.origin)}`;
  const ytCommand = (iframe, func) => {
    iframe.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
  };
  const getYtIframe = (id) => {
    if (ytPlayers.has(id)) return ytPlayers.get(id);
    const iframe = document.createElement("iframe");
    iframe.src = ytEmbed(id);
    iframe.title = "YouTube review";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.setAttribute("allowfullscreen", "");
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.dataset.ytReady = "0";
    iframe.addEventListener("load", () => {
      iframe.dataset.ytReady = "1";
    }, { once: true });
    ytWarmup.appendChild(iframe);
    ytPlayers.set(id, iframe);
    return iframe;
  };
  [...new Set(
    [...document.querySelectorAll(".review-video-card[data-yt]")].map((card) => card.dataset.yt).filter(Boolean)
  )].forEach((id) => getYtIframe(id));
  const stopReviewVideos = () => {
    document.querySelectorAll(".review-video-card video").forEach((video) => video.pause());
    document.querySelectorAll(".review-video-card[data-yt]").forEach((card) => {
      card.classList.remove("is-playing", "is-loading");
    });
    ytPlayers.forEach((iframe) => {
      ytCommand(iframe, "pauseVideo");
      ytWarmup.appendChild(iframe);
    });
  };
  const anyReviewPlaying = () =>
    [...document.querySelectorAll(".review-video-card video")].some((v) => !v.paused) ||
    !!document.querySelector(".review-video-card.is-playing iframe");
  document.querySelectorAll(".review-video-swiper, .ig-reel-swiper").forEach((el) => {
    const wrapper = el.querySelector(".swiper-wrapper");
    if (!wrapper) return;
    const originals = [...wrapper.querySelectorAll(".swiper-slide")];
    for (let i = 0; i < 5; i += 1) {
      originals.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        wrapper.appendChild(clone);
      });
    }
    const isIg = el.classList.contains("ig-reel-swiper");
    const swiper = new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: isIg ? 28 : 16,
      loop: true,
      loopAdditionalSlides: 8,
      speed: isIg ? 6500 : 7000,
      grabCursor: true,
      allowTouchMove: true,
      watchOverflow: false,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
      freeMode: {
        enabled: true,
        momentum: false,
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: isIg ? 40 : 24 },
        1025: { slidesPerView: 2, spaceBetween: isIg ? 56 : 40 },
      },
    });
    swiper.autoplay?.start();
    reviewSwipers.push(swiper);
  });
  const pauseReviewCarousels = () => reviewSwipers.forEach((s) => s.autoplay?.stop());
  const resumeReviewCarousels = () => {
    if (!anyReviewPlaying()) reviewSwipers.forEach((s) => s.autoplay?.start());
  };

  document.querySelectorAll(".review-video-card").forEach((card) => {
    const ytId = card.dataset.yt;
    if (ytId) {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        if (card.classList.contains("is-playing") && card.querySelector("iframe")) return;
        stopReviewVideos();
        const frame = card.querySelector(".review-video-frame");
        if (!frame) return;
        const iframe = getYtIframe(ytId);
        iframe.title = card.querySelector(".review-video-who")?.textContent?.trim() || "YouTube review";
        frame.appendChild(iframe);
        card.classList.add("is-playing");
        const playNow = () => {
          ytCommand(iframe, "playVideo");
          card.classList.remove("is-loading");
        };
        if (iframe.dataset.ytReady === "1") {
          playNow();
        } else {
          card.classList.add("is-loading");
          iframe.addEventListener("load", playNow, { once: true });
        }
        window.setTimeout(playNow, 200);
        window.setTimeout(playNow, 700);
        pauseReviewCarousels();
      });
      return;
    }
    const video = card.querySelector("video");
    if (!video) return;
    const toggle = () => {
      if (video.paused) {
        stopReviewVideos();
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    card.addEventListener("click", (e) => {
      e.preventDefault();
      toggle();
    });
    video.addEventListener("play", () => {
      card.classList.add("is-playing");
      pauseReviewCarousels();
    });
    video.addEventListener("pause", () => {
      card.classList.remove("is-playing");
      resumeReviewCarousels();
    });
    video.addEventListener("ended", () => {
      card.classList.remove("is-playing");
      resumeReviewCarousels();
    });
  });

  const teamEl = document.querySelector(".team-swiper");
  if (teamEl) {
    const teamSwiper = new Swiper(teamEl, {
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
  }

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

  document.querySelectorAll(".studio-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".studio-tabs");
      if (!wrap) return;
      wrap.querySelectorAll(".studio-tab").forEach((b) => b.classList.remove("is-active"));
      wrap.querySelectorAll(".studio-tab-panel").forEach((p) => p.classList.remove("is-active"));
      btn.classList.add("is-active");
      wrap.querySelector(btn.dataset.tab)?.classList.add("is-active");
    });
  });

  if (document.querySelector(".project-swiper")) {
    new Swiper(".project-swiper", {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      speed: 700,
      grabCursor: true,
      keyboard: { enabled: true },
      navigation: {
        nextEl: "[data-project-next]",
        prevEl: "[data-project-prev]",
      },
      breakpoints: {
        768: { slidesPerView: 1.15, spaceBetween: 20 },
        1024: { slidesPerView: 2, spaceBetween: 28 },
      },
    });
  }

  if (document.querySelector(".history-swiper")) {
    new Swiper(".history-swiper", {
      slidesPerView: 1.15,
      spaceBetween: 16,
      loop: true,
      speed: 750,
      breakpoints: {
        768: { slidesPerView: 1.7, spaceBetween: 20 },
      },
    });
  }

  document.querySelectorAll("[data-skill]").forEach((el) => {
    const pct = Number(el.dataset.skill);
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => gsap.to(el, { width: pct + "%", duration: 1.6, ease: "power2.out" }),
    });
  });

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
    const btn = item.querySelector(".acc-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      const group = item.closest(".acc-list") || item.parentElement;
      group.querySelectorAll(".acc-item").forEach((i) => i.classList.remove("is-open"));
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

  const filters = document.querySelectorAll(".portfolio-filters [data-filter]");
  if (filters.length) {
    const items = document.querySelectorAll(".portfolio-grid [data-category]");
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        filters.forEach((b) => b.classList.toggle("is-active", b === btn));
        items.forEach((item) => {
          item.hidden = filter !== "all" && item.dataset.category !== filter;
        });
      });
    });
  }

  const leadPopup = document.querySelector(".lead-popup");
  const isAdPage = document.body.classList.contains("ad-page");
  const openLeadPopup = (force) => {
    if (!leadPopup) return;
    if (!force && sessionStorage.getItem("buildabo-lead-dismissed") === "1") return;
    if (mobileMenu && mobileMenu.classList.contains("is-open")) closeMenu();
    stopReviewVideos();
    leadPopup.classList.add("is-open");
    leadPopup.setAttribute("aria-hidden", "false");
    document.body.classList.add("lead-open");
    lenis.stop();
    window.setTimeout(() => leadPopup.querySelector("input, select, textarea")?.focus(), 50);
  };
  const closeLeadPopup = (dismiss) => {
    if (!leadPopup) return;
    leadPopup.classList.remove("is-open");
    leadPopup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lead-open");
    if (!document.body.classList.contains("menu-open")) lenis.start();
    if (dismiss) sessionStorage.setItem("buildabo-lead-dismissed", "1");
  };
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-lead]");
    if (!opener) return;
    e.preventDefault();
    openLeadPopup(true);
  });
  if (leadPopup) {
    leadPopup.querySelectorAll("[data-close-lead]").forEach((el) => {
      el.addEventListener("click", () => closeLeadPopup(true));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && leadPopup.classList.contains("is-open")) closeLeadPopup(true);
    });
    if (!isAdPage && sessionStorage.getItem("buildabo-lead-dismissed") !== "1") {
      window.setTimeout(() => openLeadPopup(false), 10000);
    }
  }

  document.querySelectorAll(".contact-form").forEach((form) => {
    const status = form.querySelector(".contact-form-status");
    const submit = form.querySelector(".contact-submit");
    const isPopup = Boolean(form.closest(".lead-popup"));

    function setStatus(message, isError, asHtml) {
      if (!status) return;
      status.hidden = false;
      status.classList.toggle("is-error", Boolean(isError));
      if (asHtml) status.innerHTML = message;
      else status.textContent = message;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      let phone = String(data.get("phone") || "").trim().replace(/\s+/g, "");
      if (form.querySelector(".lead-card-phone") && phone && !phone.startsWith("+")) {
        phone = "+91" + phone.replace(/^0+/, "");
        data.set("phone", phone);
      }
      const prefix = isPopup
        ? "Popup enquiry from"
        : document.body.classList.contains("ad-page")
          ? "Ad landing enquiry from"
          : "Project enquiry from";
      data.set("form-name", "enquiry");
      data.set("subject", `${prefix} ${name || "the website"}`);
      ["_subject", "_replyto", "_template", "_captcha", "_honey"].forEach((key) => data.delete(key));

      if (submit) submit.disabled = true;
      setStatus("Sending your enquiry…", false);

      const isLocalPreview = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);

      try {
        const body = new URLSearchParams(data).toString();
        const headers = { "Content-Type": "application/x-www-form-urlencoded" };
        let sent = false;
        const parseJsonish = async (res) => {
          const text = await res.text();
          const type = (res.headers.get("content-type") || "").toLowerCase();
          if (type.includes("json")) {
            try {
              return JSON.parse(text);
            } catch (err) {}
          }
          const start = text.indexOf("{");
          const end = text.lastIndexOf("}");
          if (start >= 0 && end > start) {
            try {
              return JSON.parse(text.slice(start, end + 1));
            } catch (err) {}
          }
          return {};
        };
        const isSentFlag = (value, message) => {
          if (value === true || value === 1) return true;
          const flag = String(value || "").trim().toLowerCase();
          if (flag === "true" || flag === "1" || flag === "ok" || flag === "success") return true;
          const msg = String(message || "").toLowerCase();
          return /sent|thank you|successfully/.test(msg) && !/not sent|could not|fail|activat/.test(msg);
        };

        if (!isLocalPreview) {
          try {
            const phpRes = await fetch("send-enquiry.php", { method: "POST", headers, body });
            const type = (phpRes.headers.get("content-type") || "").toLowerCase();
            if (phpRes.ok && type.includes("json")) {
              const result = await parseJsonish(phpRes);
              sent = isSentFlag(result.success, result.message);
            }
          } catch (err) {}
        }

        if (!sent && /netlify/i.test(window.location.hostname)) {
          try {
            const netlifyRes = await fetch("/", { method: "POST", headers, body });
            sent = netlifyRes.ok;
          } catch (err) {}
        }

        if (!sent) {
          try {
            const fsRes = await fetch("https://formsubmit.co/ajax/info@buildabo.in", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({
                name,
                phone,
                email,
                "Project type": String(data.get("interest") || ""),
                Budget: String(data.get("budget") || ""),
                Location: String(data.get("location") || ""),
                message: String(data.get("message") || ""),
                _subject: String(data.get("subject") || `Project enquiry from ${name}`),
                _template: "table",
                _captcha: "false",
              }),
            });
            const fsResult = await parseJsonish(fsRes);
            sent = isSentFlag(fsResult.success, fsResult.message);
          } catch (err) {}
        }

        if (!sent) {
          if (isLocalPreview) {
            setStatus("This local preview cannot send email. On the live website, this form emails info@buildabo.in.", false);
            return;
          }
          throw new Error("Could not send");
        }
        form.reset();
        setStatus("Thanks. Your enquiry has been sent. We’ll reply within 24 hours.", false);
        if (isPopup) {
          sessionStorage.setItem("buildabo-lead-dismissed", "1");
          window.setTimeout(() => closeLeadPopup(true), 1400);
        }
      } catch (err) {
        const waText = encodeURIComponent(
          `Hi buildabo, I'm ${name || "a website visitor"}. ${phone ? "Phone: " + phone + ". " : ""}${email ? "Email: " + email + ". " : ""}I'd like to talk about a project.`
        );
        setStatus(
          "We couldn’t confirm the email just now, but you can still reach us: Email <a href=\"mailto:info@buildabo.in\">info@buildabo.in</a>, WhatsApp <a href=\"https://wa.me/919663635559?text=" +
            waText +
            '">9663635559</a>, or call <a href="tel:+919663635559">9663635559</a>.',
          true,
          true
        );
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  });

  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  ScrollTrigger.refresh();
  window.addEventListener("load", () => {
    lenis.resize();
    ScrollTrigger.refresh();
  });
});
