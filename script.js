/* ===== Service Slider Data ===== */
const serviceData = [
  { icon: "fa-plug",              title: "House Wiring",           desc: "Safe and reliable electrical wiring for homes with clean finishing and proper support." },
  { icon: "fa-hammer",            title: "Welding Work",           desc: "Strong welding support for repair work, frames and small utility metal jobs." },
  { icon: "fa-house",             title: "Home Decor",             desc: "Simple and practical decor support to make your home look better and feel more organized." },
  { icon: "fa-laptop-code",       title: "Web Developer & Designer", desc: "Modern website design and development for business, personal brand and portfolio needs." },
  { icon: "fa-screwdriver-wrench", title: "Repair & Maintenance",  desc: "Quick repair and maintenance support to solve issues on time and keep things working properly." }
];

/* ===== DOM References ===== */
const showcase    = document.getElementById("serviceShowcase");
const serviceCount = document.getElementById("serviceCount");
const serviceIcon  = document.getElementById("serviceIcon");
const serviceTitle = document.getElementById("serviceTitle");
const serviceDesc  = document.getElementById("serviceDesc");
const serviceDots  = document.getElementById("serviceDots");

let currentIndex = 0;
let autoSlide;

/* ===== Build Dots ===== */
function buildDots() {
  serviceData.forEach(function(_, index) {
    var dot = document.createElement("button");
    dot.className = "service-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", "Show service " + (index + 1));
    dot.addEventListener("click", function() {
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
  serviceDesc.textContent  = item.desc;

  document.querySelectorAll(".service-dot").forEach(function(dot, i) {
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
  var navLinks  = document.getElementById("navLinks");
  var overlay   = document.getElementById("navOverlay");

  if (!hamburger) return;

  hamburger.addEventListener("click", function() {
    navLinks.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", function() {
    navLinks.classList.remove("open");
    overlay.classList.remove("show");
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", function() {
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
