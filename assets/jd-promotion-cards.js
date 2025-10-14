/**
 * Johnny Dang Promotion Cards - Navigation Debug
 */

document.addEventListener('DOMContentLoaded', function() {
  initPromotionCardsNavigation();
});

function initPromotionCardsNavigation() {
  const cards = document.querySelectorAll('.jd-promotion-card');
  
  cards.forEach(card => {
    const link = card.querySelector('.jd-promotion-card__link');
    const isCustomCard = card.classList.contains('jd-promotion-card--custom');
    
    if (link) {
      console.log(`Promotion card link found (${isCustomCard ? 'CUSTOM' : 'OTHER'}):`, link.href);
      
      // Add click event to debug
      card.addEventListener('click', function(e) {
        console.log(`Card clicked (${isCustomCard ? 'CUSTOM' : 'OTHER'}), link href:`, link.href);
        
        // If the link is empty or invalid, prevent navigation
        if (!link.href || link.href === '#' || link.href.includes('undefined') || link.href === '') {
          e.preventDefault();
          console.log('Invalid link, preventing navigation');
          return false;
        }
        
        // Let the link handle the navigation
        console.log('Navigating to:', link.href);
        window.location.href = link.href;
      });
    } else {
      console.log(`No link found on promotion card (${isCustomCard ? 'CUSTOM' : 'OTHER'})`);
    }
  });
  
  console.log('Promotion Cards navigation initialized');
}
