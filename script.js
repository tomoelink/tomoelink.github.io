/* ===================================================
   TOMOE LINK — Website JavaScript
   =================================================== */

// ---- Dynamic Year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Navbar Scroll Effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Mobile Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ---- Scroll Animations ----
const fadeElements = document.querySelectorAll(
  '.service-card, .value-card, .client-type, .download-card, .about-text, .about-visual, .contact-info, .contact-form, .section-title, .section-intro'
);

fadeElements.forEach((el, i) => {
  el.classList.add('fade-in');
  if (i % 3 === 1) el.classList.add('fade-in-delay-1');
  if (i % 3 === 2) el.classList.add('fade-in-delay-2');
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeElements.forEach(el => observer.observe(el));

// ---- Active Nav Link on Scroll ----
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(item => {
    item.style.color = '';
    if (item.getAttribute('href') === '#' + current) {
      item.style.color = '#C9A84C';
    }
  });
});

// ---- Contact Form — AJAX to PHP backend ----
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const btnText     = document.getElementById('btnText');
const btnSpinner  = document.getElementById('btnSpinner');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Basic client-side validation
  const name    = contactForm.querySelector('#name').value.trim();
  const email   = contactForm.querySelector('#email').value.trim();
  const message = contactForm.querySelector('#message').value.trim();

  if (!name || !email || !message) {
    showError('Please fill in all required fields.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('Please enter a valid email address.');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline';
  formSuccess.style.display = 'none';
  formError.style.display = 'none';

  // Build URL-encoded form data for Google Apps Script
  const urlParams = new URLSearchParams();
  urlParams.append('name', contactForm.querySelector('#name').value.trim());
  urlParams.append('email', contactForm.querySelector('#email').value.trim());
  urlParams.append('company', (contactForm.querySelector('#company') ? contactForm.querySelector('#company').value.trim() : ''));
  urlParams.append('subject', (contactForm.querySelector('#subject') ? contactForm.querySelector('#subject').value.trim() : 'Website Enquiry'));
  urlParams.append('message', contactForm.querySelector('#message').value.trim());

  // Send via secure Google Apps Script endpoint (email address is never exposed in client code)
  // Using no-cors mode because Google Apps Script does not send CORS headers for cross-origin requests.
  // A completed fetch (even opaque) means the request was received by the server.
  fetch('https://script.google.com/macros/s/AKfycbxzAx9HbmduCMOenxHOfcRhg-8tovuSMTBJPKC-IIz4tfMcgs9Qh3MbesmrwisYUSdDdw/exec', {
    method: 'POST',
    mode: 'no-cors',
    body: urlParams
  })
  .then(() => {
    // no-cors returns an opaque response — any completed fetch means the server received the data
    contactForm.reset();
    showSuccess('Thank you for your enquiry. We will be in touch shortly.');
  })
  .catch(() => {
    showError('A network error occurred. Please try again or contact us directly.');
  })
  .finally(() => {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  });
});

function showSuccess(msg) {
  formSuccess.textContent = msg;
  formSuccess.style.display = 'block';
  formError.style.display = 'none';
  setTimeout(() => { formSuccess.style.display = 'none'; }, 8000);
}

function showError(msg) {
  formError.textContent = msg;
  formError.style.display = 'block';
  formSuccess.style.display = 'none';
}

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
