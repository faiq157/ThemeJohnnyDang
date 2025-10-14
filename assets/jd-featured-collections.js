/**
 * Johnny Dang Featured Collections - Enhanced Lightning Effects
 */

document.addEventListener('DOMContentLoaded', function() {
  initFeaturedCollectionsEffects();
});

function initFeaturedCollectionsEffects() {
  const cards = document.querySelectorAll('.jd-featured-collections__card');
  
  cards.forEach(card => {
    // Create cursor-following light effect
    let lightEffect = null;
    
    card.addEventListener('mouseenter', function() {
      this.style.setProperty('--lightning-intensity', '1');
      
      // Initialize mouse position for gradient
      this.style.setProperty('--mouse-x', '50%');
      this.style.setProperty('--mouse-y', '50%');
      
      // Create cursor-following light effect
      lightEffect = createCursorLightEffect(this);
      
      // Add random lightning sparkles
      createLightningSparkles(this);
    });
    
    card.addEventListener('mousemove', function(e) {
      if (lightEffect) {
        updateCursorLightPosition(e, this, lightEffect);
      }
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.setProperty('--lightning-intensity', '0');
      
      // Remove cursor light effect
      if (lightEffect && lightEffect.parentNode) {
        lightEffect.parentNode.removeChild(lightEffect);
        lightEffect = null;
      }
    });
    
    // Add click effect - but don't interfere with links
    card.addEventListener('click', function(e) {
      console.log('Featured collections card clicked');
      const link = this.querySelector('.jd-featured-collections__card-link');
      if (link) {
        console.log('Featured collections link found, href:', link.href);
        
        // If the link is empty or invalid, prevent navigation
        if (!link.href || link.href === '#' || link.href.includes('undefined') || link.href === '') {
          e.preventDefault();
          console.log('Invalid featured collections link, preventing navigation');
          return false;
        }
        
        // Prevent default to handle navigation ourselves
        e.preventDefault();
        e.stopPropagation();
        
        // Force navigation
        console.log('Navigating to featured collection:', link.href);
        window.location.href = link.href;
        return false;
      }
      
      console.log('No link found on featured collections card');
      // Create ripple effect only if no link exists
      createRippleEffect(e, this);
    });
  });
  
  console.log('Featured Collections effects initialized');
  
  // Test function to verify cards are working
  setTimeout(() => {
    const cards = document.querySelectorAll('.jd-featured-collections__card');
    cards.forEach((card, index) => {
      const link = card.querySelector('.jd-featured-collections__card-link');
      if (link) {
        const linkType = link.dataset.linkType || 'unknown';
        console.log(`Card ${index + 1}: Link found (${linkType}): ${link.href}`);
      } else {
        console.log(`Card ${index + 1}: No link found`);
      }
    });
  }, 1000);
}

function createCursorLightEffect(card) {
  const lightEffect = document.createElement('div');
  lightEffect.className = 'cursor-light-effect';
  lightEffect.style.cssText = `
    position: absolute;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, 
      rgba(114, 47, 7, 0.2) 0%, 
      rgba(114, 47, 7, 0.1) 30%, 
      rgba(114, 47, 7, 0.05) 60%, 
      transparent 100%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.1s ease-out;
    mix-blend-mode: overlay;
  `;
  
  card.appendChild(lightEffect);
  return lightEffect;
}

function updateCursorLightPosition(event, card, lightEffect) {
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Update CSS custom properties for gradient positioning
  const xPercent = (x / rect.width) * 100;
  const yPercent = (y / rect.height) * 100;
  
  card.style.setProperty('--mouse-x', xPercent + '%');
  card.style.setProperty('--mouse-y', yPercent + '%');
  
  // Keep the existing light effect for additional visual enhancement
  lightEffect.style.left = x + 'px';
  lightEffect.style.top = y + 'px';
  lightEffect.style.transform = 'translate(-50%, -50%)';
}

function createLightningSparkles(card) {
  const sparkleCount = 3;
  
  for (let i = 0; i < sparkleCount; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'lightning-sparkle';
      sparkle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #ffffff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: sparkle 0.6s ease-out forwards;
      `;
      
      card.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 600);
    }, i * 100);
  }
}

function createRippleEffect(event, card) {
  const ripple = document.createElement('div');
  const rect = card.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 5;
    animation: ripple 0.6s ease-out forwards;
  `;
  
  card.appendChild(ripple);
  
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes sparkle {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0);
    }
  }
  
  @keyframes ripple {
    0% {
      opacity: 1;
      transform: scale(0);
    }
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
  
  .jd-featured-collections__card {
    --lightning-intensity: 0;
    position: relative;
    overflow: hidden;
  }
  
  .jd-featured-collections__card:hover {
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 20px rgba(255, 255, 255, calc(0.1 * var(--lightning-intensity)));
  }
  
  .cursor-light-effect {
    position: absolute;
    pointer-events: none;
    z-index: 1;
    mix-blend-mode: overlay;
    transition: all 0.1s ease-out;
  }
`;
document.head.appendChild(style);