// ===== Sidenav active-link tracking =====
const sideLinks = document.querySelectorAll(".side-link");
const sections = Array.from(sideLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateActiveLink() {
  const scrollPos = window.scrollY + window.innerHeight * 0.35;
  let currentIndex = 0;
  sections.forEach((section, i) => {
    if (section.offsetTop <= scrollPos) currentIndex = i;
  });
  sideLinks.forEach((link, i) => link.classList.toggle("active", i === currentIndex));
}
window.addEventListener("scroll", updateActiveLink);
updateActiveLink();

// ===== Mobile menu =====
const navBurger = document.getElementById("navBurger");
const mobileMenu = document.getElementById("mobileMenu");
navBurger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("in"), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ===== Animated counters =====
const counters = document.querySelectorAll(".stat-num[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach((c) => counterObserver.observe(c));

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===== Ember particles =====
const emberField = document.getElementById("emberField");
function spawnEmber() {
  const ember = document.createElement("div");
  ember.className = "ember";
  const size = 2 + Math.random() * 4;
  const left = Math.random() * 100;
  const duration = 6 + Math.random() * 7;
  const delay = Math.random() * 2;
  const drift = (Math.random() - 0.5) * 120;

  ember.style.width = `${size}px`;
  ember.style.height = `${size}px`;
  ember.style.left = `${left}%`;
  ember.style.setProperty("--drift", `${drift}px`);
  ember.style.animationDuration = `${duration}s`;
  ember.style.animationDelay = `${delay}s`;

  emberField.appendChild(ember);
  setTimeout(() => ember.remove(), (duration + delay) * 1000);
}

for (let i = 0; i < 18; i++) {
  setTimeout(() => spawnEmber(), i * 300);
}
setInterval(spawnEmber, 500);

// ===== Timeline draw-in =====
const timelineEl = document.querySelector(".timeline");
if (timelineEl) {
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  timelineObserver.observe(timelineEl);
}

// ===== Timeline dots settle animation per-item =====
const timelineItems = document.querySelectorAll(".timeline-item");
const timelineItemObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        timelineItemObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
timelineItems.forEach((item) => timelineItemObserver.observe(item));

// ===== Feature card cursor-follow glow =====
document.querySelectorAll(".feature-card").forEach((card) => {
  const glow = card.querySelector(".feature-glow");
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (glow) {
      glow.style.left = `${x - 110}px`;
      glow.style.top = `${y - 110}px`;
      glow.style.right = "auto";
    }
    const rotateX = ((y - rect.height / 2) / rect.height) * -6;
    const rotateY = ((x - rect.width / 2) / rect.width) * 6;
    card.style.transform = `translateY(-6px) scale(1.01) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ===== Cursor ember spark trail (desktop only, throttled) =====
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let lastSpark = 0;
  window.addEventListener("mousemove", (e) => {
    const now = performance.now();
    if (now - lastSpark < 45) return;
    lastSpark = now;
    const spark = document.createElement("div");
    spark.className = "cursor-spark";
    spark.style.left = `${e.clientX - 2}px`;
    spark.style.top = `${e.clientY - 2}px`;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
  });
}

// ===== Smooth anchor scroll offset for fixed navbar =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const id = this.getAttribute("href");
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  });
});
