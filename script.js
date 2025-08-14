
// Fetch portfolio.json, group by car, then run viewer
async function fetchPortfolio() {
  const path = window.PORTFOLIO_JSON || 'portfolio.json';
  try {
    const res = await fetch(path, {cache: 'no-store'});
    if (!res.ok) throw new Error('Could not load portfolio.json (status ' + res.status + ')');
    const list = await res.json();
    // group by car preserving order
    const groups = [];
    const map = new Map();
    for (const item of list) {
      const car = item.car || 'Untitled';
      if (!map.has(car)) {
        const obj = { car, images: [], alt: item.alt || (car + ' photoshoot by Xtreme Xhaust') };
        map.set(car, obj);
        groups.push(obj);
      }
      map.get(car).images.push(item.file);
    }
    return groups;
  } catch (err) {
    console.error(err);
    return [];
  }
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Missing file: ' + src));
    img.src = src;
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const portfolioData = await fetchPortfolio();

  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  document.querySelectorAll('.mobile-nav-link').forEach(a => a.addEventListener('click', () => { mobileMenu.classList.remove('active'); document.body.style.overflow = 'auto'; }));
  mobileMenuBtn?.addEventListener('click', () => { mobileMenu.classList.add('active'); document.body.style.overflow = 'hidden'; });
  closeMobileMenu?.addEventListener('click', () => { mobileMenu.classList.remove('active'); document.body.style.overflow = 'auto'; });

  // Booking modal
  const bookingModal = document.getElementById('bookingModal');
  const bookBtns = [document.getElementById('bookServiceBtn')];
  const closeBooking = document.getElementById('closeBooking');
  const bookingForm = document.getElementById('bookingForm');
  const confirmationModal = document.getElementById('confirmationModal');
  const closeConfirmation = document.getElementById('closeConfirmation');
  const confirmationOkay = document.getElementById('confirmationOkay');

  function openModal(el) { el.classList.add('show'); el.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeModal(el) { el.classList.remove('show'); el.setAttribute('aria-hidden', 'true'); document.body.style.overflow = 'auto'; }

  bookBtns.forEach(b => b?.addEventListener('click', () => openModal(bookingModal)));
  closeBooking?.addEventListener('click', () => closeModal(bookingModal));
  closeConfirmation?.addEventListener('click', () => closeModal(confirmationModal));
  confirmationOkay?.addEventListener('click', () => closeModal(confirmationModal));

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!bookingForm.checkValidity()) { bookingForm.reportValidity(); return; }
    closeModal(bookingModal);
    openModal(confirmationModal);
    bookingForm.reset();
  });

  // Portfolio viewer
  const portfolioStory = document.getElementById('portfolioStory');
  const storyContainer = document.querySelector('.story-container');
  const storyPrev = document.getElementById('storyPrev');
  const storyNext = document.getElementById('storyNext');
  const storyProgress = document.getElementById('storyProgress');
  const closeStory = document.getElementById('closeStory');
  const viewPortfolioBtn = document.getElementById('viewPortfolioBtn');
  const viewPortfolioBtn2 = document.getElementById('viewPortfolioBtn2');

  let carIndex = 0, imgIndex = 0;
  let autoTimer = null, progressTimer = null;
  let titleEl = null, imgEl = null;

  function createProgress(count) {
    storyProgress.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const bar = document.createElement('div');
      bar.className = 'story-progress-bar' + (i < imgIndex ? ' completed' : (i === imgIndex ? ' active' : ''));
      const fill = document.createElement('div');
      bar.appendChild(fill);
      storyProgress.appendChild(bar);
    }
  }

  function startProgress() {
    clearInterval(progressTimer);
    const bars = document.querySelectorAll('.story-progress-bar');
    if (!bars.length) return;
    const fill = bars[imgIndex].querySelector('div');
    let w = 0;
    const duration = 5000, interval = 50, inc = (interval / duration) * 100;
    progressTimer = setInterval(() => {
      w += inc; fill.style.width = w + '%';
      if (w >= 100) { clearInterval(progressTimer); progressTimer = null; }
    }, interval);
  }

  function resetAuto() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(nextImage, 5000);
  }

  async function loadImage() {
    const car = portfolioData[carIndex];
    if (!car) { closePortfolio(); return; }

    if (titleEl) { titleEl.remove(); titleEl = null; }
    if (imgEl) { imgEl.remove(); imgEl = null; }

    createProgress(car.images.length);

    titleEl = document.createElement('div');
    titleEl.className = 'story-title';
    titleEl.textContent = car.car;
    titleEl.style.opacity = '1';
    storyContainer.appendChild(titleEl);

    const src = car.images[imgIndex];
    try {
      await preloadImage(src);
    } catch (err) {
      console.error(err.message);
      titleEl.textContent = 'Missing file: ' + src;
      setTimeout(nextImage, 1200);
      return;
    }

    imgEl = document.createElement('img');
    imgEl.className = 'story-image';
    imgEl.src = src;
    imgEl.alt = car.alt || car.car;
    imgEl.style.opacity = '0';
    storyContainer.appendChild(imgEl);

    setTimeout(() => {
      if (titleEl) titleEl.style.opacity = '0';
      if (imgEl) imgEl.style.opacity = '1';
    }, 1000);

    resetAuto();
    startProgress();
  }

  function nextImage() {
    const car = portfolioData[carIndex];
    if (imgIndex < car.images.length - 1) {
      imgIndex++; loadImage();
    } else if (carIndex < portfolioData.length - 1) {
      carIndex++; imgIndex = 0; loadImage();
    } else closePortfolio();
  }
  function prevImage() {
    if (imgIndex > 0) { imgIndex--; loadImage(); }
    else if (carIndex > 0) { carIndex--; imgIndex = portfolioData[carIndex].images.length - 1; loadImage(); }
  }

  function openPortfolio(start = 0) {
    if (!portfolioData.length) {
      alert('No portfolio images found. Make sure portfolio.json and images are in the same folder as index.html');
      return;
    }
    carIndex = start; imgIndex = 0; portfolioStory.style.display = 'block'; document.body.style.overflow = 'hidden'; loadImage();
  }
  function closePortfolio() {
    clearTimeout(autoTimer); clearInterval(progressTimer); autoTimer = null; progressTimer = null;
    portfolioStory.style.display = 'none'; document.body.style.overflow = 'auto';
    if (titleEl) { titleEl.remove(); titleEl = null; }
    if (imgEl) { imgEl.remove(); imgEl = null; }
  }

  storyNext?.addEventListener('click', nextImage);
  storyPrev?.addEventListener('click', prevImage);
  closeStory?.addEventListener('click', closePortfolio);
  viewPortfolioBtn?.addEventListener('click', () => openPortfolio(0));
  viewPortfolioBtn2?.addEventListener('click', () => openPortfolio(0));

  document.addEventListener('keydown', (e) => {
    if (portfolioStory.style.display === 'block') {
      if (e.key === 'ArrowRight' || e.key === ' ') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'Escape') closePortfolio();
    }
  });

  let startX = 0, endX = 0;
  document.addEventListener('touchstart', (e) => {
    if (portfolioStory.style.display === 'block') {
      startX = e.changedTouches[0].screenX;
      clearTimeout(autoTimer); clearInterval(progressTimer);
    }
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (portfolioStory.style.display === 'block') {
      endX = e.changedTouches[0].screenX;
      if (endX < startX - 50) nextImage();
      else if (endX > startX + 50) prevImage();
      else { resetAuto(); startProgress(); }
    }
  }, { passive: true });

  // Safe area update
  function updateSafeArea() { document.documentElement.style.setProperty('--safe-area', getComputedStyle(document.documentElement).getPropertyValue('safe-area-inset-top') || '0px'); }
  window.addEventListener('resize', updateSafeArea);
  updateSafeArea();
});
