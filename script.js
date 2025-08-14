const portfolioItems = [
    { src: 'brutalism (2).jpg', title: 'porsche 911 turbo s' },
    { src: 'brutalism (26).jpg', title: 'porsche 911 turbo s' },
    { src: 'DSC_5573.jpg', title: 'kawasaki ninja zx10r' },
    { src: 'DSC_5575.jpg', title: 'kawasaki ninja zx10r' },
    { src: 'DSC_5576.jpg', title: 'kawasaki ninja zx10r' },
    { src: 'DSC_5581.jpg', title: 'kawasaki ninja zx14r' },
    { src: 'DSC_5586.jpg', title: 'kawasaki ninja zx14r' },
    { src: 'DSC_5589.jpg', title: 'kawasaki ninja zx14r' },
    { src: 'DSC_5590.jpg', title: 'kawasaki ninja zx10r' },
    { src: 'IMG_1304.jpg', title: 'ford mustang' },
    { src: 'IMG_3034.jpg', title: 'bmw z4' },
    { src: 'IMG_4854.jpg', title: 'bmw m4' },
    { src: 'IMG_6154 (1).jpg', title: 'lamborghini aventador' },
    { src: 'IMG_7460.jpg', title: 'mercedese glc43 amg' },
    { src: 'IMG_7662.jpg', title: 'porsche 911 turbo' }
];

let currentIndex = 0;
const portfolioModal = document.getElementById('portfolioModal');
const storyImage = document.getElementById('storyImage');
const storyTitle = document.getElementById('storyTitle');
const viewPortfolioBtn = document.getElementById('viewPortfolioBtn');
const closePortfolio = document.getElementById('closePortfolio');

function showStory(index) {
    const item = portfolioItems[index];
    storyTitle.textContent = item.title;
    storyImage.classList.remove('show');
    setTimeout(() => {
        storyImage.src = item.src;
        storyImage.classList.add('show');
    }, 50);
}

viewPortfolioBtn.onclick = () => {
    portfolioModal.style.display = 'flex';
    currentIndex = 0;
    showStory(currentIndex);
};

closePortfolio.onclick = () => {
    portfolioModal.style.display = 'none';
};

portfolioModal.addEventListener('click', (e) => {
    if (e.target === portfolioModal) {
        portfolioModal.style.display = 'none';
    }
});

document.addEventListener('keydown', (e) => {
    if (portfolioModal.style.display === 'flex') {
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % portfolioItems.length;
            showStory(currentIndex);
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
            showStory(currentIndex);
        }
    }
});

// Booking modal
const bookServiceBtn = document.getElementById('bookServiceBtn');
const bookServiceModal = document.getElementById('bookServiceModal');
const closeBookService = document.getElementById('closeBookService');
const bookingForm = document.getElementById('bookingForm');
const confirmationMessage = document.getElementById('confirmationMessage');

bookServiceBtn.onclick = () => {
    bookServiceModal.style.display = 'flex';
};
closeBookService.onclick = () => {
    bookServiceModal.style.display = 'none';
};
bookingForm.onsubmit = (e) => {
    e.preventDefault();
    bookingForm.style.display = 'none';
    confirmationMessage.style.display = 'block';
};
