/* ============================================================
   GRUPO ISTACORP – script.js
   ============================================================ */

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbarScroll();
  initBackToTop();
  initContactForm();
  welcomeAlert();
});

/* ============================================================
   1. DARK / LIGHT MODE TOGGLE
   ============================================================ */
function initTheme() {
  const toggle   = document.getElementById('themeToggle');
  const icon     = document.getElementById('themeIcon');
  const htmlEl   = document.documentElement;

  // Persist preference
  const saved = localStorage.getItem('istacorp-theme') || 'dark';
  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('istacorp-theme', next);
    });
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (icon) {
      icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
  }
}

/* ============================================================
   2. NAVBAR – shrink on scroll
   ============================================================ */
function initNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   3. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   4. WELCOME ALERT
   ============================================================ */
function welcomeAlert() {
  // Show only once per session
  if (sessionStorage.getItem('istacorp-welcomed')) return;
  sessionStorage.setItem('istacorp-welcomed', '1');

  // Slight delay so page renders first
  setTimeout(() => {
    const hora = new Date().getHours();
    let saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';
    alert(`👋 ${saludo}! Bienvenido a Grupo Istacorp.\n\n🔧 Repuestos para camiones de alta calidad en Panamá.\n📧 Contáctenos: ventas@istacorp.com\n\n¡Estamos aquí para ayudarle!`);
  }, 800);
}

/* ============================================================
   5. CONTACT FORM – validation & mailto submit
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre  = document.getElementById('nombre')?.value.trim()  || '';
    const email   = document.getElementById('email')?.value.trim()   || '';
    const privacy = document.getElementById('privacyCheck')?.checked;

    // Basic validation
    if (!nombre) {
      alertCustom('⚠️ Por favor, ingresa tu nombre completo.');
      return;
    }

    if (!isValidEmail(email)) {
      alertCustom('⚠️ Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (!privacy) {
      alertCustom('⚠️ Debes aceptar las Políticas de Privacidad para continuar.');
      return;
    }

    // Build mailto link and open
    const repuesto  = form.querySelector('input[placeholder*="Pistones"]')?.value.trim() || 'No especificado';
    const descripcion = form.querySelector('textarea')?.value.trim() || '';
    const empresa   = form.querySelectorAll('input[type="text"]')[1]?.value.trim() || 'No especificado';
    const telefono  = form.querySelector('input[type="tel"]')?.value.trim() || 'No especificado';

    const subject = encodeURIComponent(`Solicitud de Cotización – ${nombre}`);
    const body    = encodeURIComponent(
      `Nombre: ${nombre}\nEmpresa: ${empresa}\nEmail: ${email}\nTeléfono: ${telefono}\n\nRepuesto/Parte: ${repuesto}\n\nDescripción:\n${descripcion}\n\n---\nEnviado desde: www.istacorp.com`
    );

    window.location.href = `mailto:ventas@istacorp.com?subject=${subject}&body=${body}`;

    // Success feedback
    setTimeout(() => {
      alertCustom('✅ ¡Solicitud enviada! Le responderemos en menos de 2 horas.\n\nNos pondremos en contacto con usted a: ' + email);
      form.reset();
    }, 500);
  });
}

/* ============================================================
   6. NEWS – Expandable Articles
   ============================================================ */
function expandArticle(btn) {
  const article = btn.closest('article');
  if (!article) return;
  const full = article.querySelector('.article-full');
  if (!full) return;

  const isHidden = full.classList.contains('d-none');

  if (isHidden) {
    full.classList.remove('d-none');
    btn.innerHTML = 'Cerrar artículo <i class="bi bi-arrow-up ms-2"></i>';
  } else {
    full.classList.add('d-none');
    if (btn.classList.contains('btn-news-read')) {
      btn.innerHTML = 'Leer artículo completo <i class="bi bi-arrow-down ms-2"></i>';
    } else {
      btn.innerHTML = 'Leer más <i class="bi bi-arrow-right ms-1"></i>';
    }
  }
}

/* ============================================================
   7. NEWSLETTER SUBSCRIBE
   ============================================================ */
function subscribeNewsletter() {
  const inputs = document.querySelectorAll('.sidebar-card input[type="email"]');
  let emailInput = null;
  inputs.forEach(input => {
    if (input.closest('.sidebar-card')?.querySelector('.btn-sidebar-subscribe')) {
      emailInput = input;
    }
  });

  const email = emailInput?.value.trim() || '';

  if (!email || !isValidEmail(email)) {
    alertCustom('⚠️ Por favor, ingresa un correo válido para suscribirte al boletín.');
    return;
  }

  alertCustom(`✅ ¡Suscripción exitosa!\n\nRecibirás nuestro boletín técnico en: ${email}\n\n¡Gracias por ser parte de la comunidad Istacorp!`);
  if (emailInput) emailInput.value = '';
}

/* ============================================================
   8. SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    // Skip Bootstrap modal triggers
    if (anchor.hasAttribute('data-bs-toggle')) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = document.getElementById('mainNavbar')?.offsetHeight || 76;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top, behavior: 'smooth' });

    // Close mobile navbar if open
    const navbarCollapse = document.getElementById('navMenu');
    if (navbarCollapse?.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      bsCollapse?.hide();
    }
  });
});

/* ============================================================
   9. INTERSECTION OBSERVER – fade-in cards on scroll
   ============================================================ */
const fadeTargets = document.querySelectorAll('.cat-card, .step-card, .advantage-card, .news-card, .iframe-card');

const observerOpts = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

fadeTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s, background-color 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease`;
  fadeObserver.observe(el);
});

/* ============================================================
   10. UTILITY HELPERS
   ============================================================ */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function alertCustom(msg) {
  // Use native alert (simple & reliable cross-browser)
  alert(msg);
}

/* ============================================================
   11. ACTIVE NAV LINK – highlight based on scroll position
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

if (sections.length && navLinks.length) {
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => activeSectionObserver.observe(section));
}
