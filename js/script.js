document.getElementById('year').textContent = new Date().getFullYear();

const clientsTrack = document.getElementById('clientsTrack');
if (clientsTrack) {
  clientsTrack.innerHTML += clientsTrack.innerHTML;
}

const header = document.getElementById('header');
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 6px 20px rgba(0,0,0,0.15)' : 'none';
});

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form) form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = 'Enviando...';
  status.removeAttribute('data-state');

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    });

    if (response.ok) {
      status.textContent = '¡Gracias! Recibimos tu solicitud, te contactaremos a la brevedad.';
      status.dataset.state = 'success';
      form.reset();
    } else {
      throw new Error('error');
    }
  } catch {
    status.textContent = 'No pudimos enviar el formulario. Escríbenos directo a contacto@alejandroguzmand.com';
    status.dataset.state = 'error';
  }
});
