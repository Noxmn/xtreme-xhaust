
/* ---------- PORTFOLIO DATA (keep original image names) ---------- */
const portfolioData = [
  { car: "Porsche 911 Turbo S", images: ["brutalism (2).jpg","brutalism (26).jpg"], alt: "Porsche 911 Turbo S photoshoot by Xtreme Xhaust" },
  { car: "Kawasaki Ninja ZX10R", images: ["DSC_5573.jpg","DSC_5575.jpg","DSC_5576.jpg","DSC_5590.jpg"], alt: "Kawasaki Ninja ZX10R photoshoot by Xtreme Xhaust" },
  { car: "Kawasaki Ninja ZX14R", images: ["DSC_5581.jpg","DSC_5586.jpg","DSC_5589.jpg"], alt: "Kawasaki Ninja ZX14R photoshoot by Xtreme Xhaust" },
  { car: "Ford Mustang", images: ["IMG_1304.jpg"], alt: "Ford Mustang photoshoot by Xtreme Xhaust" },
  { car: "BMW Z4", images: ["IMG_3034.jpg"], alt: "BMW Z4 photoshoot by Xtreme Xhaust" },
  { car: "BMW M4", images: ["IMG_4854.jpg"], alt: "BMW M4 photoshoot by Xtreme Xhaust" },
  { car: "Lamborghini Aventador", images: ["IMG_4854.jpg"], alt: "Lamborghini Aventador photoshoot by Xtreme Xhaust" },
  { car: "Mercedes GLC43 AMG", images: ["IMG_7460.jpg"], alt: "Mercedes GLC43 AMG photoshoot by Xtreme Xhaust" },
  { car: "Porsche 911 Turbo", images: ["IMG_7662.jpg"], alt: "Porsche 911 Turbo photoshoot by Xtreme Xhaust" }
];

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Navbar mobile menu ---------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', ()=>{ mobileMenu.classList.add('active'); document.body.style.overflow='hidden'; });
  if (closeMobileMenu) closeMobileMenu.addEventListener('click', ()=>{ mobileMenu.classList.remove('active'); document.body.style.overflow='auto'; });
  mobileNavLinks.forEach(l => l.addEventListener('click', ()=>{ mobileMenu.classList.remove('active'); document.body.style.overflow='auto'; }));

  /* ---------- Booking modal ---------- */
  const bookingModal = document.getElementById("bookingModal");
  const bookBtns = [document.getElementById("bookServiceBtn")].filter(Boolean);
  const closeBooking = document.getElementById("closeBooking");
  const bookingForm = document.getElementById("bookingForm");
  const confirmationModal = document.getElementById("confirmationModal");
  const closeConfirmation = document.getElementById("closeConfirmation");
  const confirmationOkay = document.getElementById("confirmationOkay");

  function openModal(el){ el.classList.add("show"); el.setAttribute("aria-hidden","false"); document.body.style.overflow='hidden'; }
  function closeModal(el){ el.classList.remove("show"); el.setAttribute("aria-hidden","true"); document.body.style.overflow='auto'; }

  bookBtns.forEach(btn => btn.addEventListener("click", ()=> openModal(bookingModal)));
  if (closeBooking) closeBooking.addEventListener("click", ()=> closeModal(bookingModal));
  if (closeConfirmation) closeConfirmation.addEventListener("click", ()=> closeModal(confirmationModal));
  if (confirmationOkay) confirmationOkay.addEventListener("click", ()=> closeModal(confirmationModal));

  // Outside click to close
  window.addEventListener('click', (e)=>{
    if(e.target === bookingModal) closeModal(bookingModal);
    if(e.target === confirmationModal) closeModal(confirmationModal);
    if(e.target === document.getElementById('portfolioStory')) closePortfolio();
  });
  // ESC to close
  document.addEventListener('keydown', (e)=>{
    if(e.key==="Escape"){
      if(bookingModal.classList.contains("show")) closeModal(bookingModal);
      if(confirmationModal.classList.contains("show")) closeModal(confirmationModal);
      if(portfolioStory.style.display==='block') closePortfolio();
    }
  });

  // Submit booking form (simulate success)
  if (bookingForm){
    bookingForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      // basic client validation
      const formValid = bookingForm.checkValidity();
      if(!formValid){ bookingForm.reportValidity(); return; }
      closeModal(bookingModal);
      openModal(confirmationModal);
      bookingForm.reset();
    });
  }

  /* ---------- Portfolio Story Viewer ---------- */
  const portfolioStory = document.getElementById('portfolioStory');
  const storyContainer = document.querySelector('.story-container');
  const storyPrev = document.getElementById('storyPrev');
  const storyNext = document.getElementById('storyNext');
  const storyProgress = document.getElementById('storyProgress');
  const closeStory = document.getElementById('closeStory');
  const viewPortfolioBtn = document.getElementById('viewPortfolioBtn');
  const viewPortfolioBtn2 = document.getElementById('viewPortfolioBtn2');

  let currentCarIndex = 0;
  let currentImageIndex = 0;
  let autoAdvanceTimer = null;
  let progressInterval = null;
  let titleEl = null;
  let imgEl = null;

  function openPortfolio(startIndex=0){
    currentCarIndex = startIndex;
    currentImageIndex = 0;
    portfolioStory.style.display = 'block';
    document.body.style.overflow = 'hidden';
    loadStoryImage();
  }
  function closePortfolio(){
    clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null;
    clearInterval(progressInterval); progressInterval = null;
    portfolioStory.style.display = 'none';
    document.body.style.overflow = 'auto';
    if(titleEl){ titleEl.remove(); titleEl=null; }
    if(imgEl){ imgEl.remove(); imgEl=null; }
  }

  function createProgressBars(count){
    storyProgress.innerHTML = '';
    for(let i=0;i<count;i++){
      const bar = document.createElement('div');
      bar.className = 'story-progress-bar' + (i<currentImageIndex ? ' completed' : (i===currentImageIndex ? ' active':''));
      const fill = document.createElement('div');
      bar.appendChild(fill);
      storyProgress.appendChild(bar);
    }
  }

  function startProgressBar(){
    clearInterval(progressInterval);
    const bars = document.querySelectorAll('.story-progress-bar');
    if(!bars.length) return;
    const fill = bars[currentImageIndex].querySelector('div');
    let w = 0;
    const duration = 5000, interval = 50, inc = (interval/duration)*100;
    progressInterval = setInterval(()=>{
      w += inc; fill.style.width = w + '%';
      if(w>=100){ clearInterval(progressInterval); progressInterval=null; }
    }, interval);
  }

  function resetAutoAdvance(){
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = setTimeout(nextImage, 5000);
  }

  function loadStoryImage(){
    const carData = portfolioData[currentCarIndex];
    if(!carData) { closePortfolio(); return; }

    if(titleEl) titleEl.remove();
    if(imgEl) imgEl.remove();

    // progress
    createProgressBars(carData.images.length);

    // title
    titleEl = document.createElement('div');
    titleEl.className = 'story-title';
    titleEl.textContent = carData.car;
    titleEl.style.opacity = '1';
    storyContainer.appendChild(titleEl);

    // image (hidden initially)
    imgEl = document.createElement('img');
    imgEl.className = 'story-image';
    imgEl.alt = carData.alt || carData.car;
    imgEl.src = carData.images[currentImageIndex];
    imgEl.style.opacity = '0';
    storyContainer.appendChild(imgEl);

    // fade sequence
    setTimeout(()=>{
      if(titleEl) titleEl.style.opacity = '0';
      if(imgEl) imgEl.style.opacity = '1';
    }, 1200);

    resetAutoAdvance();
    startProgressBar();
  }

  function nextImage(){
    const carData = portfolioData[currentCarIndex];
    if(currentImageIndex < carData.images.length - 1){
      currentImageIndex++;
      loadStoryImage();
    } else if (currentCarIndex < portfolioData.length - 1){
      currentCarIndex++; currentImageIndex = 0; loadStoryImage();
    } else {
      closePortfolio();
    }
  }
  function prevImage(){
    if(currentImageIndex > 0){
      currentImageIndex--; loadStoryImage();
    } else if (currentCarIndex > 0){
      currentCarIndex--; currentImageIndex = portfolioData[currentCarIndex].images.length - 1; loadStoryImage();
    }
  }

  if(storyNext) storyNext.addEventListener('click', nextImage);
  if(storyPrev) storyPrev.addEventListener('click', prevImage);
  if(closeStory) closeStory.addEventListener('click', closePortfolio);
  if(viewPortfolioBtn) viewPortfolioBtn.addEventListener('click', ()=> openPortfolio(0));
  if(viewPortfolioBtn2) viewPortfolioBtn2.addEventListener('click', ()=> openPortfolio(0));

  // Keyboard
  document.addEventListener('keydown', (e)=>{
    if(portfolioStory.style.display==='block'){
      if(e.key==='ArrowRight' || e.key===' '){ nextImage(); }
      else if(e.key==='ArrowLeft'){ prevImage(); }
    }
  });

  // Touch swipe
  let startX = 0, endX = 0;
  document.addEventListener('touchstart', (e)=>{
    if(portfolioStory.style.display==='block'){
      startX = e.changedTouches[0].screenX;
      clearTimeout(autoAdvanceTimer); clearInterval(progressInterval);
    }
  }, {passive:true});
  document.addEventListener('touchend', (e)=>{
    if(portfolioStory.style.display==='block'){
      endX = e.changedTouches[0].screenX;
      if(endX < startX - 50) nextImage();
      else if(endX > startX + 50) prevImage();
      else { resetAutoAdvance(); startProgressBar(); }
    }
  }, {passive:true});

  /* ---------- Safe area update for notched devices ---------- */
  function updateSafeArea(){
    document.documentElement.style.setProperty('--safe-area', getComputedStyle(document.documentElement).getPropertyValue('safe-area-inset-top') || '0px');
  }
  window.addEventListener('resize', updateSafeArea);
  updateSafeArea();
});
