document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  const confirmation = document.getElementById('confirmation');
  const newBtn = document.getElementById('newReservation');

  if (!form) return;

  // Set _next dynamically from current URL
  const formNext = document.getElementById('formNext');
  if (formNext) {
    formNext.value = window.location.origin + '/reservation.html?success=true';
  }

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
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = getText('reservation_sending');

    const data = {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      guests: document.getElementById('guests').value,
      notes: document.getElementById('notes').value.trim(),
      service: document.getElementById('service')?.value || 'lunch'
    };

    let fsOk = false;
    let mailOk = false;

    try {
      if (fbDb) {
        await fbDb.collection('reservations').add({
          ...data,
          status: 'nouvelle',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        fsOk = true;
      }
    } catch (err) { console.error('Erreur enregistrement réservation:', err); }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) mailOk = true;
    } catch (err) { console.error('Erreur envoi email:', err); }

    if (fsOk || mailOk) {
      form.style.display = 'none';
      confirmation.classList.add('show');
    } else {
      alert('Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });

  if (newBtn) {
    newBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      confirmation.classList.remove('show');
    });
  }

});
