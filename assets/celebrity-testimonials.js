// Celebrity Testimonials Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  const carouselTracks = document.querySelectorAll('.testimonials-track');
  
  carouselTracks.forEach(track => {
    const prevBtn = track.closest('.testimonials-carousel').querySelector('.carousel-btn-prev');
    const nextBtn = track.closest('.testimonials-carousel').querySelector('.carousel-btn-next');
    const items = track.querySelectorAll('.testimonial-item');
    
    if (!prevBtn || !nextBtn || items.length === 0) return;
    
    let currentIndex = 0;
    const itemsPerView = getItemsPerView();
    
    function getItemsPerView() {
      const width = window.innerWidth;
      if (width <= 320) return 2; // Extra small mobile: 2 items
      if (width <= 480) return 2; // Mobile: 2 items
      if (width <= 749) return 2; // Tablet: 2 items
      return 3; // Desktop: 3 items
    }
    
    function updateCarousel() {
      const width = window.innerWidth;
      let gap = 16; // Default gap
      
      if (width <= 320) {
        gap = 12; // 0.8rem gap for extra small mobile
      } else if (width <= 480) {
        gap = 16; // 1rem gap for mobile
      } else if (width <= 749) {
        gap = 24; // 1.5rem gap for tablet
      }
      
      const itemWidth = items[0].offsetWidth + gap;
      const translateX = -currentIndex * itemWidth;
      track.style.transform = `translateX(${translateX}px)`;
      
      // Update button states
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      nextBtn.style.opacity = currentIndex >= items.length - itemsPerView ? '0.5' : '1';
      
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= items.length - itemsPerView;
    }
    
    function goToPrev() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }
    
    function goToNext() {
      if (currentIndex < items.length - itemsPerView) {
        currentIndex++;
        updateCarousel();
      }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);
    
    // Handle window resize
    window.addEventListener('resize', function() {
      const newItemsPerView = getItemsPerView();
      if (newItemsPerView !== itemsPerView) {
        currentIndex = Math.min(currentIndex, items.length - newItemsPerView);
        updateCarousel();
      }
    });
    
    // Initialize carousel
    updateCarousel();
    
    // Manual navigation only - no auto-play
  });
});