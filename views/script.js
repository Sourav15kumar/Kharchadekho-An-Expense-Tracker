

  // review slide 

  let currentSlide = 0;
const slides = document.querySelectorAll('.review-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

setInterval(() => {
  let next = (currentSlide + 1) % slides.length;
  showSlide(next);
}, 5000);

// end review
  
  