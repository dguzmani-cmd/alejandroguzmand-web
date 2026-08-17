document.getElementById('year').textContent = new Date().getFullYear();

const clientsTrack = document.getElementById('clientsTrack');
if (clientsTrack) {
  clientsTrack.innerHTML += clientsTrack.innerHTML;
}

const galleryTrack = document.getElementById('galleryTrack');
if (galleryTrack) {
  const scrollAmount = 400;
  document.getElementById('galleryPrev').addEventListener('click', () => {
    galleryTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  document.getElementById('galleryNext').addEventListener('click', () => {
    galleryTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  let isDragging = false, startX, scrollLeft;
  galleryTrack.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - galleryTrack.offsetLeft;
    scrollLeft = galleryTrack.scrollLeft;
    galleryTrack.style.scrollBehavior = 'auto';
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
    galleryTrack.style.scrollBehavior = 'smooth';
  });
  galleryTrack.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - galleryTrack.offsetLeft;
    galleryTrack.scrollLeft = scrollLeft - (x - startX);
  });
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

/* Tipo de solicitud: empresa (default) o asesoría personal */
const tipoInputs = form ? form.querySelectorAll('input[name="tipo"]') : [];
const empresaRow = document.getElementById('empresaRow');
const empresaInput = document.getElementById('empresa');
const empresaLabel = empresaRow ? empresaRow.querySelector('label') : null;
const subjectInput = form ? form.querySelector('input[name="subject"]') : null;

function esPersonal() {
  return form && form.tipo && form.tipo.value === 'Asesoría personal';
}

function actualizarTipo() {
  if (!form) return;
  const personal = esPersonal();

  if (empresaRow) {
    empresaRow.hidden = personal;
    empresaInput.required = !personal;
    if (personal) empresaInput.value = '';
  }
  if (empresaLabel) {
    empresaLabel.textContent = personal ? 'Empresa (opcional)' : 'Empresa';
  }
  if (subjectInput) {
    subjectInput.value = personal
      ? 'Nueva solicitud de asesoría personal desde alejandroguzmand.com'
      : 'Nueva solicitud de empresa desde alejandroguzmand.com';
  }
  const mensaje = document.getElementById('mensaje');
  if (mensaje) {
    mensaje.placeholder = personal
      ? 'Ej: necesito ordenar mis deudas y armar un presupuesto familiar.'
      : 'Ej: charla de educación financiera para 200 colaboradores en octubre.';
  }
}

tipoInputs.forEach((input) => input.addEventListener('change', actualizarTipo));

function seleccionarTipo(valor) {
  if (!form || !form.tipo) return;
  const objetivo = valor === 'personal' ? 'Asesoría personal' : 'Empresa';
  form.tipo.value = objetivo;
  actualizarTipo();
}

document.querySelectorAll('[data-tipo]').forEach((link) => {
  link.addEventListener('click', () => seleccionarTipo(link.dataset.tipo));
});

if (form) {
  actualizarTipo();
  if (window.location.hash === '#asesoria-personal') {
    seleccionarTipo('personal');
    window.addEventListener('load', () => {
      document.getElementById('contacto').scrollIntoView();
    });
  }
}

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
          empresa: form.empresa.value || 'Persona natural (asesoría personal)',
          mensaje: form.mensaje.value,
          tipo: form.tipo.value,
        }).toString(),
      });
      status.textContent = '¡Gracias! Recibimos tu solicitud, te contactaremos a la brevedad.';
      status.dataset.state = 'success';
      form.reset();
      actualizarTipo();
    } else {
      throw new Error('error');
    }
  } catch {
    status.textContent = 'No pudimos enviar el formulario. Escríbenos directo a contacto@alejandroguzmand.com';
    status.dataset.state = 'error';
  }
});
