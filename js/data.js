const FB_CONFIG = {
  apiKey: "AIzaSyXXXXXXXXXX",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxx"
};

let fbApp, fbDb;

try {
  fbApp = firebase.initializeApp(FB_CONFIG, "site");
  fbDb = firebase.firestore(fbApp);
} catch {}

async function fromFirestore(collection) {
  if (!fbDb) return null;
  try {
    const snap = await fbDb.collection(collection).orderBy('id').get();
    return snap.docs.map(d => d.data());
  } catch { return null; }
}

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}

let settingsCache = null;

async function getSettings() {
  if (settingsCache) return settingsCache;
  if (fbDb) {
    try {
      const doc = await fbDb.collection('settings').doc('restaurant').get();
      if (doc.exists) { settingsCache = doc.data(); return settingsCache; }
    } catch {}
  }
  settingsCache = await fetchJSON('data/settings.json');
  return settingsCache;
}

async function loadMenu() {
  let data = await fromFirestore('menu');
  if (!data) {
    const json = await fetchJSON('data/menu.json');
    data = json?.items || [];
  }
  if (!data.length) return;
  document.querySelectorAll('.menu-section').forEach(section => {
    const id = section.id;
    const container = section.querySelector('.menu-grid');
    if (!container) return;
    const items = data.filter(i => i.category === id);
    if (items.length) {
      container.innerHTML = items.map(item => `
        <div class="menu-item">
          <div class="menu-item-img" style="background: #e8d5b8;"></div>
          <div class="menu-item-info">
            <h3>${item.name}</h3>
            <div class="price">${item.price}</div>
            <p>${item.description}</p>
          </div>
        </div>
      `).join('');
    }
  });
}

async function loadReviews() {
  let data = await fromFirestore('reviews');
  if (!data) {
    data = await fetchJSON('data/reviews.json') || [];
  }
  if (!data.length) return;
  const container = document.querySelector('.reviews-grid');
  if (!container) return;
  const ratingEl = document.querySelector('.big-rating');
  if (ratingEl) {
    const s = await getSettings();
    if (s) ratingEl.textContent = s.rating.toString().replace('.', ',');
  }
  container.innerHTML = data.map((r, i) => `
    <div class="review-card fade-in">
      <div class="stars">${'★'.repeat(Math.floor(r.stars))}${r.stars % 1 ? '½' : ''}${'☆'.repeat(5 - Math.ceil(r.stars))}</div>
      <blockquote>"${r.text}"</blockquote>
      <div class="author">${r.author}</div>
      <div class="source" data-i18n="avis_google">Google</div>
    </div>
  `).join('');
}

async function loadGallery() {
  let data = await fromFirestore('gallery');
  if (!data) {
    data = await fetchJSON('data/gallery.json') || [];
  }
  if (!data.length) return;
  const container = document.querySelector('.gallery-grid');
  if (!container) return;
  container.innerHTML = data.map(item => `
    <div class="gallery-item${item.wide ? ' wide' : ''}${item.tall ? ' tall' : ''}" data-src="${item.src}">
      <img src="${item.thumb}" alt="${item.alt}" loading="lazy">
      <div class="overlay">${item.label}</div>
    </div>
  `).join('');
}

async function loadSettings() {
  const data = await getSettings();
  if (!data) return;
  document.querySelectorAll('[data-setting]').forEach(el => {
    const key = el.dataset.setting;
    if (data[key]) {
      if (el.tagName === 'A' && el.href?.startsWith('tel:')) {
        el.href = `tel:${data.phoneRaw}`;
      }
      el.textContent = data[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.menu-section')) loadMenu();
  if (document.querySelector('.reviews-grid')) loadReviews();
  if (document.querySelector('.gallery-grid')) loadGallery();
  if (document.querySelector('[data-setting]')) loadSettings();
});
