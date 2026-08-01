(function () {
  if (!document.querySelector('.menu-section')) return;

  const CART_KEY = 'facealamer-cart';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }

  const WHATSAPP = (getText('whatsapp_phone') || '+2290146075817').replace(/[^\d]/g, '');

  const fmt = n => n.toLocaleString('fr-FR') + ' FCFA';

  function save() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function count() {
    return cart.reduce((s, it) => s + it.qty, 0);
  }

  function total() {
    return cart.reduce((s, it) => s + (Number(it.priceNumber) || 0) * it.qty, 0);
  }

  // ====== DOM ======
  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'cart-float';
  fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span class="cart-count"></span>';

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';

  const drawer = document.createElement('div');
  drawer.className = 'cart-drawer';
  drawer.innerHTML =
    '<div class="cart-head"><h3></h3><button type="button" class="cart-close" aria-label="close">&times;</button></div>' +
    '<div class="cart-items"></div>' +
    '<div class="cart-foot">' +
    '  <div class="cart-total-row"><span></span><strong></strong></div>' +
    '  <button type="button" class="btn btn-primary btn-cart-checkout"></button>' +
    '</div>';

  const checkout = document.createElement('div');
  checkout.className = 'checkout-overlay';
  checkout.innerHTML =
    '<div class="checkout-modal">' +
    '  <button type="button" class="checkout-close" aria-label="close">&times;</button>' +
    '  <h3></h3>' +
    '  <form class="checkout-form" novalidate>' +
    '    <label class="c-field"><span></span><input type="text" name="name" required></label>' +
    '    <label class="c-field"><span></span><input type="tel" name="phone" required></label>' +
    '    <div class="c-field"><span class="mode-label"></span>' +
    '      <div class="mode-select">' +
    '        <label><input type="radio" name="mode" value="emporte" checked><span class="mode-pill"></span></label>' +
    '        <label><input type="radio" name="mode" value="livraison"><span class="mode-pill"></span></label>' +
    '      </div>' +
    '    </div>' +
    '    <label class="c-field addr-field"><span></span><input type="text" name="address"></label>' +
    '    <label class="c-field"><span></span><textarea name="note" rows="2"></textarea></label>' +
    '    <button type="submit" class="btn btn-primary btn-checkout-submit"></button>' +
    '  </form>' +
    '  <div class="checkout-success"><div class="success-icon">&#10003;</div><h4></h4><p></p></div>' +
    '</div>';

  document.body.appendChild(fab);
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  document.body.appendChild(checkout);

  const itemsEl = drawer.querySelector('.cart-items');
  const footEl = drawer.querySelector('.cart-foot');
  const totalLabel = drawer.querySelector('.cart-total-row span');
  const totalValue = drawer.querySelector('.cart-total-row strong');
  const checkoutBtn = drawer.querySelector('.btn-cart-checkout');
  const countEl = fab.querySelector('.cart-count');

  // ====== Labels (i18n) ======
  function setLabels() {
    fab.setAttribute('aria-label', getText('cart_title'));
    drawer.querySelector('.cart-head h3').textContent = getText('cart_title');
    totalLabel.textContent = getText('cart_total') + ' :';
    checkoutBtn.textContent = getText('cart_checkout');
    checkout.querySelector('h3').textContent = getText('checkout_title');
    const form = checkout.querySelector('.checkout-form');
    const fields = form.querySelectorAll('.c-field > span');
    fields[0].textContent = getText('checkout_name');
    fields[1].textContent = getText('checkout_phone');
    fields[2].textContent = getText('checkout_mode');
    fields[3].textContent = getText('checkout_address');
    fields[4].textContent = getText('checkout_note');
    const pills = form.querySelectorAll('.mode-pill');
    pills[0].textContent = getText('checkout_pickup');
    pills[1].textContent = getText('checkout_delivery');
    form.querySelector('.btn-checkout-submit').textContent = getText('checkout_submit');
    checkout.querySelector('.checkout-success h4').textContent = getText('checkout_success_title');
    checkout.querySelector('.checkout-success p').textContent = getText('checkout_success_text');
  }

  // ====== Render ======
  function renderItems() {
    itemsEl.innerHTML = '';
    footEl.style.display = 'none';
    if (!cart.length) {
      itemsEl.innerHTML = `<div class="cart-empty">${getText('cart_empty')}</div>`;
      countEl.textContent = '0';
      return;
    }
    cart.forEach((it, i) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      const line = (Number(it.priceNumber) || 0) * it.qty;
      row.innerHTML =
        `<div class="ci-name"><strong>${esc(it.name)}</strong>${it.price ? `<span>${it.price}</span>` : ''}</div>` +
        '<div class="ci-qty">' +
        `<button type="button" data-act="minus" data-i="${i}">&minus;</button>` +
        `<span>${it.qty}</span>` +
        `<button type="button" data-act="plus" data-i="${i}">+</button>` +
        '</div>' +
        `<div class="ci-total">${it.priceNumber ? fmt(line) : '—'}</div>` +
        `<button type="button" class="ci-remove" data-act="remove" data-i="${i}">&times;</button>`;
      itemsEl.appendChild(row);
    });
    footEl.style.display = 'block';
    countEl.textContent = count();
    totalValue.textContent = fmt(total());
  }

  function openDrawer() {
    setLabels();
    renderItems();
    drawer.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  function addItem(name, price, priceNumber) {
    const existing = cart.find(it => it.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, price, priceNumber: Number(priceNumber) || 0, qty: 1 });
    save();
    renderItems();
  }

  // ====== Checkout ======
  function openCheckout() {
    if (!cart.length) return;
    checkout.classList.add('show');
    overlay.classList.add('show');
    const form = checkout.querySelector('.checkout-form');
    form.reset();
    form.style.display = '';
    checkout.querySelector('.checkout-success').style.display = 'none';
    checkout.querySelector('.addr-field').classList.add('hidden');
    const modeEls = form.querySelectorAll('input[name="mode"]');
    modeEls[0].checked = true;
  }

  function closeCheckout() {
    checkout.classList.remove('show');
    overlay.classList.remove('show');
  }

  async function submitOrder(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.btn-checkout-submit');
    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = getText('checkout_sending');

    const name = form.name.value.trim();
    const phoneVal = form.phone.value.trim();
    const mode = form.mode.value;
    const address = form.address.value.trim();
    const note = form.note.value.trim();

    const order = {
      name, phone: phoneVal, mode, address, note,
      items: cart.map(it => ({ name: it.name, price: it.price, priceNumber: it.priceNumber, qty: it.qty })),
      total: total(),
      status: 'nouvelle',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    let fsOk = false;
    try {
      if (fbDb) {
        await fbDb.collection('commandes').add(order);
        fsOk = true;
      }
    } catch (err) { console.error('Erreur enregistrement commande:', err); }

    const lines = cart.map(it => `- ${it.qty} × ${it.name}${it.price ? ' (' + it.price + ')' : ''}`);
    let msg = getText('order_msg') + '\n' + lines.join('\n') +
      '\n' + getText('cart_total') + ' : ' + fmt(total()) +
      '\n' + getText('checkout_name') + ' : ' + name +
      '\n' + getText('checkout_phone') + ' : ' + phoneVal +
      '\n' + getText('checkout_mode') + ' : ' + (mode === 'livraison' ? getText('checkout_delivery') : getText('checkout_pickup'));
    if (address) msg += '\n' + getText('checkout_address') + ' : ' + address;
    if (note) msg += '\n' + getText('checkout_note') + ' : ' + note;
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank');

    if (fsOk) {
      form.style.display = 'none';
      const success = checkout.querySelector('.checkout-success');
      success.style.display = 'block';
      cart = [];
      save();
    } else {
      alert('Une erreur est survenue. Votre commande a été transmise par WhatsApp, vous pouvez aussi nous appeler directement.');
    }
    submitBtn.disabled = false;
    submitBtn.textContent = original;
  }

  // ====== Events ======
  fab.addEventListener('click', openDrawer);
  overlay.addEventListener('click', () => { closeDrawer(); closeCheckout(); });
  drawer.querySelector('.cart-close').addEventListener('click', closeDrawer);
  checkout.querySelector('.checkout-close').addEventListener('click', closeCheckout);

  itemsEl.addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const i = +btn.dataset.i;
    const act = btn.dataset.act;
    if (act === 'plus') cart[i].qty += 1;
    else if (act === 'minus') { cart[i].qty -= 1; if (cart[i].qty <= 0) cart.splice(i, 1); }
    else if (act === 'remove') cart.splice(i, 1);
    save();
    renderItems();
  });

  checkoutBtn.addEventListener('click', openCheckout);

  checkout.querySelector('.checkout-form').addEventListener('submit', submitOrder);

  checkout.querySelectorAll('input[name="mode"]').forEach(r => {
    r.addEventListener('change', () => {
      checkout.querySelector('.addr-field').classList.toggle('hidden', r.value !== 'livraison');
    });
  });

  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-add-cart');
    if (!btn) return;
    addItem(btn.dataset.name, btn.dataset.price, btn.dataset.pricenum);
  });

  window.addEventListener('load', () => {
    setLabels();
    renderItems();
  });
})();
