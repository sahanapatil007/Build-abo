(function () {
  const HOST = "https://buildabo.in/";

  const PREV_ICON =
    '<svg width="21" height="10" viewBox="0 0 21 10" fill="none"><path d="M0.23 4.31 4.33.23a1 1 0 0 1 1.11 1.11L2.68 4.08H19.3a.78.78 0 0 1 0 1.57H2.68l2.75 2.74a1 1 0 0 1-1.1 1.11L.23 5.42a1 1 0 0 1 0-1.11Z" fill="currentColor"/></svg>';
  const NEXT_ICON =
    '<svg width="21" height="10" viewBox="0 0 21 10" fill="none"><path d="M19.94 4.15 15.82.22a1 1 0 0 0-1.11 1.07l2.76 2.64H.79a.79.79 0 0 0 0 1.51h16.69l-2.76 2.64a1 1 0 0 0 1.11 1.07l4.12-3.93a1 1 0 0 0 0-1.07Z" fill="currentColor"/></svg>';
  const GRID_ICON =
    '<svg width="22" height="22" viewBox="0 0 30 31" fill="none"><path d="M0 6.7v6.7h13.4V0H0v6.7m16.6 0v6.7H30V0H16.6v6.7M0 24.25v6.7h13.4v-13.4H0v6.7m16.6 0v6.7H30v-13.4H16.6v6.7" fill="currentColor" fill-rule="evenodd"/></svg>';

  const PROJECTS = [
    {
      id: "nithin-residence",
      title: "Nithin Residence",
      category: "residential",
      tags: "Residential",
      location: "Tavarekere",
      area: "1,200 sq.ft",
      year: "2026",
      about: [
        "Designed as a statement of luxury, this penthouse combines sophisticated interiors, expansive living spaces, panoramic views, and bespoke finishes. Every room reflects exceptional craftsmanship, creating a refined living experience tailored to modern lifestyles.",
      ],
      images: ["assets/nithin-residence.jpg"],
      featured: true,
      inPortfolio: true,
    },
    {
      id: "karthik-residence",
      title: "Karthik Residence",
      category: "residential",
      tags: "Residential",
      location: "Hoskote",
      area: "6,200 sq.ft",
      year: "2025",
      about: [
        "Blending contemporary architecture with natural surroundings, this farmhouse offers spacious living areas, open landscapes, and carefully selected materials that create a peaceful retreat. The design emphasizes comfort, sustainability, and a seamless connection between indoor and outdoor spaces.",
      ],
      images: ["assets/karthik-residence.jpg"],
      featured: true,
      inPortfolio: true,
    },
    {
      id: "praveen-patil-residence",
      title: "Praveen Patil Residence",
      category: "residential",
      tags: "Residential",
      location: "KR Puram",
      area: "6,200 sq.ft",
      year: "2025",
      about: [
        "Designed as a statement of luxury, this penthouse combines sophisticated interiors, expansive living spaces, panoramic views, and bespoke finishes. Every room reflects exceptional craftsmanship, creating a refined living experience tailored to modern lifestyles.",
      ],
      images: ["assets/praveen-patil-residence.jpg"],
      featured: true,
      inPortfolio: true,
    },
    {
      id: "priyanka-residence",
      title: "Priyanka Residence",
      category: "interior",
      tags: "Interior",
      location: "Chandapura",
      area: "320 sq.ft",
      year: "2023",
      about: [
        "Designed for efficiency and style, this modular kitchen features premium cabinetry, quartz countertops, integrated appliances, and intelligent storage solutions. The layout was optimized to enhance workflow while maintaining a sleek and contemporary appearance suitable for everyday living.",
      ],
      images: ["assets/priyanka-residence.jpg"],
      featured: true,
      inPortfolio: true,
    },
    {
      id: "soft-minimal-residence",
      title: "Soft Minimal Residence",
      category: "interior",
      tags: "Interior, Apartment",
      location: "Koramangala",
      area: "2,100 sqft",
      year: "2025",
      about: [
        "This Koramangala apartment asked for less furniture and more built-in calm. We redesigned the plan around storage, a long kitchen run, and a living room that can take both work and guests.",
        "Colour stays close to plaster and timber. Details are quiet on purpose — shadow gaps, flush doors, and lighting that does not announce itself — so the rooms stay easy over time.",
      ],
      images: ["assets/about-hero-2.webp", "assets/hero-2.webp", "assets/about-portrait-tall.webp"],
      featured: false,
      inPortfolio: true,
    },
    {
      id: "vinay-residence",
      title: "Vinay Residence",
      category: "commercial",
      tags: "Commercial",
      location: "Kamakshipalya",
      area: "5,400 sq.ft",
      year: "2023",
      about: [
        "This corporate office was designed to promote productivity, collaboration, and employee well-being. The workspace incorporates modern design principles, ergonomic layouts, premium finishes, and carefully planned lighting to create an inspiring professional environment.",
      ],
      images: ["assets/vinay-residence.jpg"],
      featured: true,
      inPortfolio: true,
    },
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function query(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function findProject(id) {
    return PROJECTS.find((project) => project.id === id) || null;
  }

  function categoryLabel(project) {
    return project.category.charAt(0).toUpperCase() + project.category.slice(1);
  }

  function projectUrl(id) {
    return "project.html?id=" + encodeURIComponent(id);
  }

  function portfolioList() {
    return PROJECTS.filter((project) => project.inPortfolio);
  }

  function featuredList() {
    return PROJECTS.filter((project) => project.featured);
  }

  function neighbors(list, id) {
    const index = list.findIndex((item) => item.id === id);
    if (index < 0 || list.length < 2) return { prev: null, next: null };
    return {
      prev: list[(index - 1 + list.length) % list.length],
      next: list[(index + 1) % list.length],
    };
  }

  function projectCard(project) {
    const image = project.images[0];
    return (
      '<a href="' +
      escapeHtml(projectUrl(project.id)) +
      '" class="portfolio-card" data-category="' +
      escapeHtml(project.category) +
      '">' +
      '<div class="portfolio-card-media"><img src="' +
      escapeHtml(image) +
      '" alt="' +
      escapeHtml(project.title) +
      " in " +
      escapeHtml(project.location) +
      ' by buildabo" /></div>' +
      '<div class="portfolio-card-body">' +
      "<span>" +
      escapeHtml(categoryLabel(project)) +
      "</span>" +
      "<h2>" +
      escapeHtml(project.title) +
      "</h2>" +
      "<p>" +
      escapeHtml(project.location) +
      " · " +
      escapeHtml(project.area) +
      "</p>" +
      "<em>View project</em>" +
      "</div></a>"
    );
  }

  function setMeta(selector, value, attr) {
    const el = document.querySelector(selector);
    if (!el || value == null) return;
    if (attr) el.setAttribute(attr, value);
    else el.textContent = value;
  }

  function setCanonical(path) {
    const url = HOST + path.replace(/^\//, "");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
    setMeta('meta[property="og:url"]', url, "content");
  }

  function renderPortfolio(grid) {
    grid.innerHTML = portfolioList()
      .map(function (project) {
        return projectCard(project);
      })
      .join("");
  }

  function renderFeatured(wrap) {
    wrap.innerHTML = featuredList()
      .map(function (project) {
        return (
          '<article class="swiper-slide"><a href="' +
          escapeHtml(projectUrl(project.id)) +
          '" class="project-card">' +
          '<img src="' +
          escapeHtml(project.images[0]) +
          '" alt="' +
          escapeHtml(project.title) +
          " in " +
          escapeHtml(project.location) +
          '" />' +
          '<div class="project-card-copy"><span>' +
          escapeHtml(categoryLabel(project)) +
          "</span><h3>" +
          escapeHtml(project.title) +
          "</h3><p>" +
          escapeHtml(project.location) +
          "</p></div></a></article>"
        );
      })
      .join("");
  }

  function renderProjectPage() {
    const project = findProject(query("id"));
    if (!project) {
      window.location.replace("portfolio.html");
      return;
    }

    const list = portfolioList();
    const pair = neighbors(list, project.id);
    const summary = project.about[0] || "";

    document.title = project.title + " | buildabo — " + project.location + ", Bangalore";
    setMeta('meta[name="description"]', summary, "content");
    setMeta('meta[property="og:title"]', project.title + " | buildabo", "content");
    setMeta('meta[property="og:description"]', summary, "content");
    setMeta('meta[property="og:image"]', HOST + project.images[0], "content");
    setCanonical("project.html?id=" + encodeURIComponent(project.id));

    const crumb = document.querySelector("[data-project-crumb]");
    if (crumb) {
      crumb.innerHTML =
        '<a href="portfolio.html">Portfolio</a><span>/</span><span>' + escapeHtml(project.title) + "</span>";
    }

    setMeta("[data-project-title]", project.title);

    const about = document.querySelector("[data-project-about]");
    if (about) {
      about.innerHTML = project.about
        .map(function (para) {
          return "<p>" + escapeHtml(para) + "</p>";
        })
        .join("");
    }

    const meta = document.querySelector("[data-project-meta]");
    if (meta) {
      meta.innerHTML =
        "<li><strong>Tags:</strong> " +
        escapeHtml(project.tags) +
        "</li>" +
        "<li><strong>Company:</strong> buildabo</li>" +
        "<li><strong>Location:</strong> " +
        escapeHtml(project.location) +
        ", Bengaluru</li>" +
        "<li><strong>Total size:</strong> " +
        escapeHtml(project.area) +
        "</li>" +
        "<li><strong>Year:</strong> " +
        escapeHtml(project.year) +
        "</li>";
    }

    const gallery = document.querySelector("[data-project-gallery]");
    if (gallery) {
      gallery.innerHTML = project.images
        .map(function (src, index) {
          const suffix = index ? " — view " + (index + 1) : "";
          return (
            '<img src="' +
            escapeHtml(src) +
            '" alt="' +
            escapeHtml(project.title) +
            " in " +
            escapeHtml(project.location) +
            " by buildabo" +
            suffix +
            '" />'
          );
        })
        .join("");
    }

    const nav = document.querySelector("[data-project-nav]");
    if (nav) {
      const prevHref = pair.prev ? projectUrl(pair.prev.id) : "";
      const nextHref = pair.next ? projectUrl(pair.next.id) : "";
      nav.innerHTML =
        (pair.prev
          ? '<a href="' + escapeHtml(prevHref) + '">' + PREV_ICON + "Previous project</a>"
          : "<span></span>") +
        '<a href="portfolio.html" aria-label="Back to portfolio">' +
        GRID_ICON +
        "</a>" +
        (pair.next
          ? '<a href="' + escapeHtml(nextHref) + '">Next project' + NEXT_ICON + "</a>"
          : "<span></span>");
    }
  }

  function init() {
    if (document.body.hasAttribute("data-project-page")) {
      renderProjectPage();
      return;
    }

    const portfolio = document.querySelector(".portfolio-grid");
    if (portfolio) renderPortfolio(portfolio);

    const featured = document.querySelector(".project-swiper .swiper-wrapper");
    if (featured) renderFeatured(featured);
  }

  window.BUILDABO = {
    PROJECTS: PROJECTS,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
