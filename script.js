/* ===== Service Slider Data ===== */
const serviceData = [
  { icon: "fa-plug", title: "House Wiring", desc: "Safe and reliable electrical wiring for homes with clean finishing and proper support." },
  { icon: "fa-hammer", title: "Welding Work", desc: "Strong welding support for repair work, frames and small utility metal jobs." },
  { icon: "fa-house", title: "Home Decor", desc: "Simple and practical decor support to make your home look better and feel more organized." },
  { icon: "fa-laptop-code", title: "Web Developer & Designer", desc: "Modern website design and development for business, personal brand and portfolio needs." },
  { icon: "fa-plane-departure", title: "Tours & Travels", desc: "Explore amazing destinations with our affordable and reliable tour and travel booking services." }
];

/* ===== DOM References ===== */
const showcase = document.getElementById("serviceShowcase");
const serviceCount = document.getElementById("serviceCount");
const serviceIcon = document.getElementById("serviceIcon");
const serviceTitle = document.getElementById("serviceTitle");
const serviceDesc = document.getElementById("serviceDesc");
const serviceDots = document.getElementById("serviceDots");

let currentIndex = 0;
let autoSlide;

/* ===== Build Dots ===== */
function buildDots() {
  serviceData.forEach(function (_, index) {
    var dot = document.createElement("button");
    dot.className = "service-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", "Show service " + (index + 1));
    dot.addEventListener("click", function () {
      showService(index);
      resetAutoSlide();
    });
    serviceDots.appendChild(dot);
  });
}

/* ===== Show Service ===== */
function showService(index) {
  currentIndex = index;
  var item = serviceData[index];

  showcase.classList.remove("animate");
  void showcase.offsetWidth;          // force reflow
  showcase.classList.add("animate");

  serviceCount.textContent =
    String(index + 1).padStart(2, "0") + " / " +
    String(serviceData.length).padStart(2, "0");

  serviceIcon.className = "fas " + item.icon;
  serviceTitle.textContent = item.title;
  serviceDesc.textContent = item.desc;

  document.querySelectorAll(".service-dot").forEach(function (dot, i) {
    dot.classList.toggle("active", i === index);
  });
}

/* ===== Auto-slide ===== */
function nextService() {
  showService((currentIndex + 1) % serviceData.length);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(nextService, 3000);
}

/* ===== Light Toggle ===== */
function toggleLight() {
  document.body.classList.toggle("light-on");
}

/* ===== Mobile Menu ===== */
function initMobileMenu() {
  var hamburger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");
  var overlay = document.getElementById("navOverlay");

  if (!hamburger) return;

  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", function () {
    navLinks.classList.remove("open");
    overlay.classList.remove("show");
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      overlay.classList.remove("show");
    });
  });
}

/* ===== Init ===== */
buildDots();
showService(0);
autoSlide = setInterval(nextService, 3000);
initMobileMenu();

/* ===== Hero Service → WhatsApp Redirect ===== */
showcase.addEventListener("click", function (e) {
  // Don't redirect if clicking on dots or arrows
  if (e.target.closest(".service-dot") || e.target.closest(".hero-arrow")) return;
  var currentService = serviceData[currentIndex].title;
  var msg = "Hello Khan Electrician, mujhe " + currentService + " service ke baare mein jaanna hai.";
  var url = "https://wa.me/917822886909?text=" + encodeURIComponent(msg);
  window.open(url, "_blank");
});

/* ===== Hero Left/Right Arrow Navigation ===== */
var heroLeft = document.getElementById("heroLeft");
var heroRight = document.getElementById("heroRight");

if (heroLeft) {
  heroLeft.addEventListener("click", function () {
    var prevIndex = (currentIndex - 1 + serviceData.length) % serviceData.length;
    showService(prevIndex);
    resetAutoSlide();
  });
}

if (heroRight) {
  heroRight.addEventListener("click", function () {
    var nextIdx = (currentIndex + 1) % serviceData.length;
    showService(nextIdx);
    resetAutoSlide();
  });
}

/* ===== Touch / Swipe on Hero Showcase ===== */
(function () {
  var startX = 0;
  var isDragging = false;

  showcase.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  showcase.addEventListener("touchend", function (e) {
    if (!isDragging) return;
    isDragging = false;
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        showService((currentIndex + 1) % serviceData.length);
      } else {
        showService((currentIndex - 1 + serviceData.length) % serviceData.length);
      }
      resetAutoSlide();
    }
  }, { passive: true });
})();

/* ===== WhatsApp Widget Logic ===== */
const waButton = document.getElementById("waButton");
const waPopup = document.getElementById("waPopup");
const waClose = document.getElementById("waClose");
const waServiceSelect = document.getElementById("waServiceSelect");
const waSendBtn = document.getElementById("waSendBtn");

if (waButton && waPopup && waClose) {
  waButton.addEventListener("click", function() {
    waPopup.classList.toggle("show");
  });

  waClose.addEventListener("click", function() {
    waPopup.classList.remove("show");
  });

  waSendBtn.addEventListener("click", function() {
    const selectedService = waServiceSelect.value;
    if (!selectedService) {
      alert("Please select a service first.");
      return;
    }

    let msg = "";
    switch(selectedService) {
      case "House Wiring":
        msg = "Hello Khan Electrician, mujhe apne ghar ke liye *House Wiring* (electric fitting / repair) ki service chahiye. Kripya guide karein.";
        break;
      case "Welding Work":
        msg = "Hello Khan Electrician, mujhe *Welding Work* ka kaam karwana hai. Kripya mujhse contact karein.";
        break;
      case "Home Decor":
        msg = "Hello Khan Electrician, mujhe apne ghar ke liye *Home Decor* aur setup ke baare mein service chahiye.";
        break;
      case "Web Developer & Designer":
        msg = "Hello Khan Electrician, mujhe apne business/personal use ke liye ek *Website* banwani hai. Kripya details batayein.";
        break;
      case "Tours & Travels":
        msg = "Hello Khan Electrician, mujhe *Tours & Travels* (booking ya packages) ke baare mein inquiry karni hai.";
        break;
      default:
        msg = "Hello Khan Electrician, mujhe aapse kuch kaam ke silsile mein baat karni hai.";
    }

    const url = "https://wa.me/917822886909?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
    waPopup.classList.remove("show");
  });

  // Automatically show the popup to the customer after 3 seconds of visiting the site
  setTimeout(function() {
    if (!waPopup.classList.contains("show")) {
      waPopup.classList.add("show");
    }
  }, 3000);
}
