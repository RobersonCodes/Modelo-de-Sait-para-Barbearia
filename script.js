const body = document.body;
const loader = document.getElementById("loader");
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const header = document.getElementById("header");
const revealElements = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const scrollProgress = document.getElementById("scrollProgress");

const bookingServiceButtons = document.querySelectorAll(".booking-service");
const timeCards = document.querySelectorAll(".time-card");
const bookingSelected = document.getElementById("bookingSelected");
const bookingWhatsAppBtn = document.getElementById("bookingWhatsAppBtn");

const contactForm = document.getElementById("contactForm");
const heroParallax = document.getElementById("heroParallax");

const counters = document.querySelectorAll(".counter");

const testimonialCards = document.querySelectorAll(".testimonial-card");
const dots = document.querySelectorAll(".dot");
const prevTestimonial = document.getElementById("prevTestimonial");
const nextTestimonial = document.getElementById("nextTestimonial");

const galleryCards = document.querySelectorAll(".gallery-card");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

const cursorDot = document.getElementById("cursorDot");
const cursorOutline = document.getElementById("cursorOutline");
const magneticButtons = document.querySelectorAll(".magnetic");

let selectedService = "Corte Masculino";
let selectedTime = "";
let currentTestimonial = 0;
let testimonialInterval = null;
let countersStarted = false;

body.classList.add("loading");

window.addEventListener("load", () => {
  setTimeout(() => {
    if (loader) loader.classList.add("hide");
    body.classList.remove("loading");
  }, 850);

  revealOnScroll();
  startAutoSlider();
  updateActiveNav();
  updateScrollProgress();
});

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  document.querySelectorAll(".menu a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  });
}

window.addEventListener("scroll", () => {
  if (header) {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  if (heroParallax) {
    const offset = window.scrollY * 0.22;
    heroParallax.style.transform = `translateY(${offset}px)`;
  }

  revealOnScroll();
  updateActiveNav();
  updateScrollProgress();
});

function updateScrollProgress() {
  if (!scrollProgress) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  scrollProgress.style.width = `${progress}%`;
}

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.88;

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < triggerBottom) {
      element.classList.add("show");
    }
  });

  if (!countersStarted) {
    const heroStats = document.querySelector(".hero-stats");
    if (heroStats) {
      const top = heroStats.getBoundingClientRect().top;
      if (top < triggerBottom) {
        countersStarted = true;
        startCounters();
      }
    }
  }
}

function updateActiveNav() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");

    if (href === `#${currentSection}`) {
      link.classList.add("active");
    }
  });

  if (!currentSection && navLinks.length) {
    navLinks[0].classList.add("active");
  }
}

function startCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const isDecimal = counter.dataset.decimal === "true";
    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      if (isDecimal) {
        counter.textContent = (value / 10).toFixed(1) + "★";
      } else if (target >= 1000) {
        counter.textContent = "+" + Math.floor(value).toLocaleString("pt-BR");
      } else {
        counter.textContent = "+" + Math.floor(value);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        if (isDecimal) {
          counter.textContent = "4.8★";
        } else if (target >= 1000) {
          counter.textContent = "+2.000";
        } else {
          counter.textContent = "+5";
        }
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

function updateBookingText() {
  if (!bookingSelected) return;

  if (selectedTime) {
    bookingSelected.innerHTML = `Serviço selecionado: <strong>${selectedService}</strong> • Horário: <strong>${selectedTime}</strong>`;
  } else {
    bookingSelected.innerHTML = `Serviço selecionado: <strong>${selectedService}</strong>`;
  }
}

function updateBookingWhatsAppLink() {
  if (!bookingWhatsAppBtn) return;

  const safeService = encodeURIComponent(selectedService);
  const safeTime = selectedTime ? encodeURIComponent(selectedTime) : "";

  let message = `Olá! Quero agendar um horário na Barbearia Barbermem.%0A%0AServiço: ${safeService}`;

  if (selectedTime) {
    message += `%0AHorário: ${safeTime}`;
  }

  bookingWhatsAppBtn.href = `https://wa.me/5551985561640?text=${message}`;
}

bookingServiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    bookingServiceButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    selectedService = button.dataset.service || "Corte Masculino";

    updateBookingText();
    updateBookingWhatsAppLink();
  });
});

timeCards.forEach((card) => {
  card.addEventListener("click", () => {
    timeCards.forEach((item) => item.classList.remove("selected-time"));
    card.classList.add("selected-time");

    selectedTime = card.dataset.time || "";

    updateBookingText();
    updateBookingWhatsAppLink();
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const service = document.getElementById("service")?.value;
    const message = document.getElementById("message")?.value.trim();

    let whatsappMessage = "Olá! Quero falar com a Barbearia Barbermem.%0A%0A";

    if (name) whatsappMessage += `Nome: ${encodeURIComponent(name)}%0A`;
    if (phone) whatsappMessage += `Telefone: ${encodeURIComponent(phone)}%0A`;
    if (service) whatsappMessage += `Serviço: ${encodeURIComponent(service)}%0A`;
    if (message) whatsappMessage += `Mensagem: ${encodeURIComponent(message)}%0A`;

    const whatsappURL = `https://wa.me/5551985561640?text=${whatsappMessage}`;
    window.open(whatsappURL, "_blank");
  });
}

function showTestimonial(index) {
  testimonialCards.forEach((card) => card.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  if (!testimonialCards[index] || !dots[index]) return;

  testimonialCards[index].classList.add("active");
  dots[index].classList.add("active");
  currentTestimonial = index;
}

function nextSlide() {
  const nextIndex = (currentTestimonial + 1) % testimonialCards.length;
  showTestimonial(nextIndex);
}

function prevSlide() {
  const prevIndex = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
  showTestimonial(prevIndex);
}

function startAutoSlider() {
  if (!testimonialCards.length) return;

  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(() => {
    nextSlide();
  }, 4200);
}

if (nextTestimonial) {
  nextTestimonial.addEventListener("click", () => {
    nextSlide();
    startAutoSlider();
  });
}

if (prevTestimonial) {
  prevTestimonial.addEventListener("click", () => {
    prevSlide();
    startAutoSlider();
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showTestimonial(index);
    startAutoSlider();
  });
});

galleryCards.forEach((card) => {
  card.addEventListener("click", () => {
    const imageSrc = card.dataset.image;
    if (!imageSrc || !lightbox || !lightboxImage) return;

    lightboxImage.src = imageSrc;
    lightbox.classList.add("show");
    body.classList.add("loading");
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("show");
  body.classList.remove("loading");
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

function initCustomCursor() {
  if (!cursorDot || !cursorOutline || window.innerWidth < 1024) return;

  let outlineX = 0;
  let outlineY = 0;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.14;
    outlineY += (mouseY - outlineY) * 0.14;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateOutline);
  }

  animateOutline();

  const hoverTargets = document.querySelectorAll("a, button, .gallery-card, .time-card, .booking-service");

  hoverTargets.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorOutline.classList.add("hover");
    });

    item.addEventListener("mouseleave", () => {
      cursorOutline.classList.remove("hover");
    });
  });
}

function initMagneticButtons() {
  if (window.innerWidth < 1024 || !magneticButtons.length) return;

  magneticButtons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

updateBookingText();
updateBookingWhatsAppLink();
revealOnScroll();
showTestimonial(0);
initCustomCursor();
initMagneticButtons();
updateScrollProgress();