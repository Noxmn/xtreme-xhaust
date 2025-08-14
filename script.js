// ===== Portfolio Data (use your filenames) =====
const portfolioData = [
  { car: "Porsche 911 Turbo S", images: ["brutalism (2).jpg", "brutalism (26).jpg"], alt: "Porsche 911 Turbo S photoshoot by Xtreme Xhaust" },
  { car: "Kawasaki Ninja ZX10R", images: ["DSC_5573.jpg", "DSC_5575.jpg", "DSC_5576.jpg", "DSC_5590.jpg"], alt: "Kawasaki Ninja ZX10R photoshoot by Xtreme Xhaust" },
  { car: "Kawasaki Ninja ZX14R", images: ["DSC_5581.jpg", "DSC_5586.jpg", "DSC_5589.jpg"], alt: "Kawasaki Ninja ZX14R photoshoot by Xtreme Xhaust" },
  { car: "Ford Mustang", images: ["IMG_1304.jpg"], alt: "Ford Mustang photoshoot by Xtreme Xhaust" },
  { car: "BMW Z4", images: ["IMG_3034.jpg"], alt: "BMW Z4 photoshoot by Xtreme Xhaust" },
  { car: "BMW M4", images: ["IMG_4854.jpg"], alt: "BMW M4 photoshoot by Xtreme Xhaust" },
  { car: "Lamborghini Aventador", images: ["IMG_4854.jpg"], alt: "Lamborghini Aventador photoshoot by Xtreme Xhaust" },
  { car: "Mercedes GLC43 AMG", images: ["IMG_7460.jpg"], alt: "Mercedes GLC43 AMG photoshoot by Xtreme Xhaust" },
  { car: "Porsche 911 Turbo", images: ["IMG_7662.jpg"], alt: "Porsche 911 Turbo photoshoot by Xtreme Xhaust" }
];

// ===== Mobile Menu =====
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenu = document.getElementById('close-mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

mobileMenuBtn?.addEventListener('click', () => {
  mobileMenu.classList.add('active');
  document.body.style.overflow = 'hidden';
});
closeMobileMenu?.addEventListener('click', () => {
  mobileMenu.classList.remove('active');
  document.body.style.overflow = 'auto';
});
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
});

// ===== Portfolio Story Viewer =====
document.addEventListener('DOMContentLoaded', () => {
  const viewPortfolioBtn = document.getElementById('view-portfolio-btn');
  const portfolioStory = document.getElementById('portfolio-story');
  const storyContainer = document.querySelector('.story-container');
  const closeStory = document.querySelector('.close-story');
  const storyPrev = document.getElementById('story-prev');
  const storyNext = document.getElementById('story-next');
  const storyProgressContainer = document.getElementById('story-progress-container');

  let currentCarIndex = 0;
  let currentImageIndex = 0;
  let autoAdvanceTimer;
  let progressInterval;
  let currentTitleElement = null;
  let currentImageElement = null;

  viewPortfolioBtn?.addEventListener('click', () => {
    loadCarStory(0);
  });

  function loadCarStory(carIndex){
    if (carIndex >= portfolioData.length || carIndex < 0){
      closeStoryViewer();
      return;
    }
    currentCarIndex = carIndex;
    currentImageIndex = 0;
    portfolioStory.style.display = 'block';
    document.body.style.overflow = 'hidden';
    loadStoryImage();
  }

  function loadStoryImage(){
    const carData = portfolioData[currentCarIndex];

    // Clear existing
    if (currentTitleElement) storyContainer.removeChild(currentTitleElement);
    if (currentImageElement) storyContainer.removeChild(currentImageElement);

    // Progress bars
    createProgressBars(carData.images.length);

    // Title
    currentTitleElement = document.createElement('div');
    currentTitleElement.className = 'story-title';
    currentTitleElement.textContent = carData.car;
    currentTitleElement.style.opacity = '1';
    storyContainer.appendChild(currentTitleElement);

    // Image (hidden initially)
    currentImageElement = document.createElement('img');
    currentImageElement.src = carData.images[currentImageIndex];
    currentImageElement.alt = carData.alt;
    currentImageElement.loading = 'lazy';
    currentImageElement.className = 'story-image';
    currentImageElement.style.opacity = '0';
    storyContainer.appendChild(currentImageElement);

    // Fade sequence
    setTimeout(() => {
      currentTitleElement.style.opacity = '0';
      currentImageElement.style.opacity = '1';
    }, 1200);

    resetAutoAdvanceTimer();
    startProgressBar(currentImageIndex);
  }

  function createProgressBars(count){
    storyProgressContainer.innerHTML = '';
    for (let i = 0; i < count; i++){
      const bar = document.createElement('div');
      bar.className = 'story-progress-bar';
      if (i < currentImageIndex) bar.classList.add('completed'); else if (i === currentImageIndex) bar.classList.add('active');
      const fill = document.createElement('div');
      bar.appendChild(fill);
      storyProgressContainer.appendChild(bar);
    }
  }

  function startProgressBar(index){
    clearInterval(progressInterval);
    const bars = document.querySelectorAll('.story-progress-bar');
    if (!bars.length) return;
    const current = bars[index];
    const fill = current.querySelector('div');

    let width = 0;
    const duration = 5000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    progressInterval = setInterval(() => {
      width += increment;
      fill.style.width = width + '%';
      if (width >= 100) clearInterval(progressInterval);
    }, interval);
  }

  function resetAutoAdvanceTimer(){
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = setTimeout(nextImage, 5000);
  }

  function nextImage(){
    const carData = portfolioData[currentCarIndex];
    if (currentImageIndex < carData.images.length - 1){
      currentImageIndex++;
      loadStoryImage();
    }else if (currentCarIndex < portfolioData.length - 1){
      currentCarIndex++;
      currentImageIndex = 0;
      loadCarStory(currentCarIndex);
    }else{
      closeStoryViewer();
    }
  }

  function prevImage(){
    if (currentImageIndex > 0){
      currentImageIndex--;
      loadStoryImage();
    }else if (currentCarIndex > 0){
      currentCarIndex--;
      currentImageIndex = portfolioData[currentCarIndex].images.length - 1;
      loadCarStory(currentCarIndex);
    }
  }

  function closeStoryViewer(){
    clearTimeout(autoAdvanceTimer);
    clearInterval(progressInterval);
    portfolioStory.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (currentTitleElement){ storyContainer.removeChild(currentTitleElement); currentTitleElement = null; }
    if (currentImageElement){ storyContainer.removeChild(currentImageElement); currentImageElement = null; }
  }

  // Events
  storyNext?.addEventListener('click', nextImage);
  storyPrev?.addEventListener('click', prevImage);
  closeStory?.addEventListener('click', closeStoryViewer);

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (portfolioStory.style.display === 'block'){
      if (e.key === 'ArrowRight' || e.key === ' '){ nextImage(); }
      else if (e.key === 'ArrowLeft'){ prevImage(); }
      else if (e.key === 'Escape'){ closeStoryViewer(); }
    }
  });

  // Touch swipe
  let touchStartX = 0;
  let touchEndX = 0;
  document.addEventListener('touchstart', (e) => {
    if (portfolioStory.style.display === 'block'){
      touchStartX = e.changedTouches[0].screenX;
      clearTimeout(autoAdvanceTimer);
      clearInterval(progressInterval);
    }
  }, { passive:true });
  document.addEventListener('touchend', (e) => {
    if (portfolioStory.style.display === 'block'){
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) nextImage();
      else if (touchEndX > touchStartX + 50) prevImage();
      else{
        resetAutoAdvanceTimer();
        startProgressBar(currentImageIndex);
      }
    }
  }, { passive:true });
});

// ===== Booking Modal (animated) =====
document.addEventListener('DOMContentLoaded', () => {
  const bookingModal = document.getElementById('booking-modal');
  const confirmationModal = document.getElementById('confirmation-modal');
  const openBtn = document.getElementById('book-now-btn');
  const bookingForm = document.getElementById('booking-form');
  const closeBtns = document.querySelectorAll('.close-modal');
  const closeConfirmation = document.getElementById('close-confirmation');

  function openModal(modal){
    modal.classList.add('open');
    // allow CSS transition to apply
    requestAnimationFrame(() => modal.classList.add('show'));
    document.body.style.overflow = 'hidden';
  }
  function hideModal(modal){
    modal.classList.remove('show');
    setTimeout(() => {
      modal.classList.remove('open');
      document.body.style.overflow = 'auto';
    }, 280);
  }

  openBtn?.addEventListener('click', () => openModal(bookingModal));

  closeBtns.forEach(btn => btn.addEventListener('click', () => {
    hideModal(bookingModal);
    hideModal(confirmationModal);
  }));

  window.addEventListener('click', (e) => {
    if (e.target === bookingModal) hideModal(bookingModal);
    if (e.target === confirmationModal) hideModal(confirmationModal);
  });

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    hideModal(bookingModal);
    setTimeout(() => {
      openModal(confirmationModal);
      bookingForm.reset();
    }, 300);
  });

  closeConfirmation?.addEventListener('click', () => hideModal(confirmationModal));
});

// ===== Safe area for notched devices =====
function updateSafeArea(){ document.documentElement.style.setProperty('--safe-area', env(safe-area-inset-top, 0px)); }
window.addEventListener('resize', updateSafeArea);
updateSafeArea();
