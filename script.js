// ===== NAV MENU =====
function toggleMenu(){
  document.getElementById("nav").classList.toggle("open");
}

// ===== SLIDER =====
const services = [
  {
    title: "House Wiring",
    desc: "Safe and reliable wiring for homes"
  },
  {
    title: "Welding Work",
    desc: "Strong welding repair work"
  },
  {
    title: "Electrical Repair",
    desc: "Fast repair service"
  }
];

let index = 0;

function showSlide(){
  document.getElementById("serviceTitle").innerText = services[index].title;
  document.getElementById("serviceDesc").innerText = services[index].desc;
}

function nextSlide(){
  index = (index + 1) % services.length;
  showSlide();
}

function prevSlide(){
  index = (index - 1 + services.length) % services.length;
  showSlide();
}
