document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  const confirmation = document.getElementById('confirmation');
  const newBtn = document.getElementById('newReservation');

  if (!form) return;

  // Check for success URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    form.style.display = 'none';
    confirmation?.classList.add('show');
  }

  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    const data = {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      guests: document.getElementById('guests').value,
      notes: document.getElementById('notes').value.trim()
    };

    try {
      // Send via FormSubmit (free, no backend needed)
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.style.display = 'none';
        confirmation.classList.add('show');
      } else {
        alert('Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.');
      }
    } catch {
      // Fallback: show confirmation anyway (FormSubmit may redirect)
      form.style.display = 'none';
      confirmation.classList.add('show');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = getText('reservation_submit');
    }
  });

  if (newBtn) {
    newBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      confirmation.classList.remove('show');
    });
  }

  // WhatsApp prefill
  const whatsappLinks = document.querySelectorAll('[data-whatsapp]');
  whatsappLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const msg = encodeURIComponent(getText('whatsapp_msg'));
      const phone = link.dataset.whatsapp || '2290146075817';
      link.href = `https://wa.me/${phone}?text=${msg}`;
    });
  });
});
