// Typing effect
const roles = ['a marketing insight analyst', 'a data-driven strategist', 'a business researcher'];
let roleIndex = 0;
let charIndex = 0;
let erasing = false;
const roleElement = document.getElementById('role');

function typeRole() {
  const current = roles[roleIndex];
  roleElement.textContent = `${current.slice(0, charIndex)}${Date.now() % 600 < 300 ? '|' : ''}`;

  if (!erasing && charIndex <= current.length) {
    charIndex += 1;
  } else if (erasing && charIndex > 0) {
    charIndex -= 1;
  }

  if (charIndex === current.length + 1) {
    erasing = true;
    setTimeout(typeRole, 900);
    return;
  }

  if (charIndex === 0 && erasing) {
    erasing = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeRole, erasing ? 45 : 95);
}

typeRole();

// Canvas particle background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = 0;
let height = 0;
let dpr = 1;
let particleCount = 0;
const particles = [];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function setupCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  particleCount = Math.min(180, Math.floor((width * height) / 9000));
  initParticles();
}

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.35, 0.35),
      vy: rand(-0.35, 0.35),
      r: rand(1, 2.2),
    });
  }
}

function drawFrame() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width * 0.65,
    height * 0.15,
    0,
    width * 0.65,
    height * 0.15,
    Math.max(width, height) * 0.9,
  );
  gradient.addColorStop(0, 'rgba(124, 77, 255, 0.14)');
  gradient.addColorStop(0.6, 'rgba(56, 189, 248, 0.08)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const gradientBottom = ctx.createRadialGradient(
    width * 0.3,
    height * 0.85,
    0,
    width * 0.3,
    height * 0.85,
    Math.max(width, height) * 0.7,
  );
  gradientBottom.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
  gradientBottom.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradientBottom;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(200, 210, 255, 0.85)';
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distSq = dx * dx + dy * dy;
      const threshold = 120 * 120;
      if (distSq < threshold) {
        const opacity = 1 - distSq / threshold;
        ctx.strokeStyle = `rgba(124, 77, 255, ${opacity * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawFrame);
}

setupCanvas();
drawFrame();

window.addEventListener('resize', setupCanvas);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Contact form mailto fallback
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    const mailto = `mailto:dayofraven2050@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;
    window.location.href = mailto;
    alert("Thanks! I'll get back to you.");
  });
}

// Sync header height to CSS variable to avoid overlap on different devices/zoom
(function syncHeaderHeight() {
  const headerEl =
    document.querySelector('.nav') ||
    document.querySelector('header') ||
    document.querySelector('nav');
  if (!headerEl) return;
  const setVar = () => {
    const h = Math.ceil(headerEl.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-h', `${h}px`);
  };
  setVar();
  window.addEventListener('resize', setVar);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(setVar);
    ro.observe(headerEl);
  }
})();

// Hero carousel
const carouselImages = Array.from(document.querySelectorAll('.carousel-image'));
const dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
let carouselIndex = 0;
let carouselTimer = null;

function showSlide(index) {
  carouselImages.forEach((img, i) => {
    img.classList.toggle('active', i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  carouselIndex = index;
}

function nextSlide() {
  const next = (carouselIndex + 1) % carouselImages.length;
  showSlide(next);
}

function startCarousel() {
  if (carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(nextSlide, 5000);
}

if (carouselImages.length > 0) {
  showSlide(0);
  startCarousel();
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startCarousel();
    });
  });
}
