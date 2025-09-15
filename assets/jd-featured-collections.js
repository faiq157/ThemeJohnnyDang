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
    
    // Add click effect
    card.addEventListener('click', function(e) {
      if (this.querySelector('.jd-featured-collections__card-link')) {
        return; // Let the link handle the click
      }
      
      // Create ripple effect
      createRippleEffect(e, this);
    });
  });
  
  console.log('Featured Collections effects initialized');
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