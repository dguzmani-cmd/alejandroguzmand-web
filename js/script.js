document.getElementById('year').textContent = new Date().getFullYear();

const clientsTrack = document.getElementById('clientsTrack');
if (clientsTrack) {
  clientsTrack.innerHTML += clientsTrack.innerHTML;
}

const gallerySlideshow = document.getElementById('gallerySlideshow');
if (gallerySlideshow) {
  const slides = gallerySlideshow.querySelectorAll('.gallery__slide');
  const dots = gallerySlideshow.querySelectorAll('.gallery__dot');
  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('gallery__slide--active');
    dots[current].classList.remove('gallery__dot--active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('gallery__slide--active');
    dots[current].classList.add('gallery__dot--active');
  }

  function startTimer() {
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  document.getElementById('galleryPrev').addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  document.getElementById('galleryNext').addEventListener('click', () => { goTo(current + 1); resetTimer(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));

  gallerySlideshow.addEventListener('mouseenter', () => clearInterval(timer));
  gallerySlideshow.addEventListener('mouseleave', startTimer);

  startTimer();
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
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form),
    });

    const data = await response.json();
    if (data.success) {
      fetch('https://script.google.com/macros/s/AKfycbxuwtLBiO7NQO5vrK4fZKykC1rksbsTv5u8TxSqi5L5UKGbe5ej8XkjSSG2uIx9M9ts/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          nombre: form.nombre.value,
          email: form.email.value,
          telefono: form.telefono.value,
          empresa: form.empresa.value,
          mensaje: form.mensaje.value,
        }).toString(),
      });
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
