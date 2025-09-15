// Bubble Filters JavaScript - Enhanced for Shopify Facets
document.addEventListener('DOMContentLoaded', function() {
  // Initialize bubble filters
  initBubbleFilters();
});

function initBubbleFilters() {
  // Add bubble styling to facet labels
  addBubbleStyling();
  
  // Add click handlers for bubble-style interaction
  addBubbleClickHandlers();
  
  // Update active states on page load
  updateActiveStates();
}

function addBubbleStyling() {
  // Add active class to checked facet labels
  const facetLabels = document.querySelectorAll('.bubble-filters .facets__label');
  facetLabels.forEach(label => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      label.classList.add('active');
    }
  });
}

function addBubbleClickHandlers() {
  // Add click handlers to facet labels for bubble-style interaction
  const facetLabels = document.querySelectorAll('.bubble-filters .facets__label');
  facetLabels.forEach(label => {
    label.addEventListener('click', function(e) {
      // Prevent default behavior if clicking on the label itself
      if (e.target === label) {
        e.preventDefault();
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      }
    });
    
    // Update styling when checkbox changes
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
      });
    }
  });
  
  // Add enhanced price range input handling
  addPriceRangeHandlers();
}

function addPriceRangeHandlers() {
  const priceInputs = document.querySelectorAll('.bubble-filters .facets__price .field__input');
  
  priceInputs.forEach(input => {
    // Add focus/blur styling
    input.addEventListener('focus', function() {
      this.closest('.field').classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.closest('.field').classList.remove('focused');
    });
    
    // Add input validation and formatting
    input.addEventListener('input', function() {
      // Remove non-numeric characters except decimal point
      let value = this.value.replace(/[^0-9.]/g, '');
      
      // Ensure only one decimal point
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      
      this.value = value;
      
      // Auto-submit form when both inputs have values
      const allPriceInputs = document.querySelectorAll('.bubble-filters .facets__price .field__input');
      const hasValues = Array.from(allPriceInputs).every(input => input.value.trim() !== '');
      
      if (hasValues) {
        // Add a small delay to allow user to finish typing
        clearTimeout(window.priceFilterTimeout);
        window.priceFilterTimeout = setTimeout(() => {
          const form = this.closest('form');
          if (form) {
            form.submit();
          }
        }, 1000);
      }
    });
    
    // Add enter key submission
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const form = this.closest('form');
        if (form) {
          form.submit();
        }
      }
    });
  });
}

function updateActiveStates() {
  // Update visual states of filter bubbles based on URL parameters
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search);
  
  // Update facet filter states
  const facetLabels = document.querySelectorAll('.bubble-filters .facets__label');
  facetLabels.forEach(label => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox) {
      const paramName = checkbox.name;
      const paramValue = checkbox.value;
      
      // Check if this filter is active in URL
      const isActive = params.getAll(paramName).includes(paramValue);
      checkbox.checked = isActive;
      
      if (isActive) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    }
  });
}

// Enhanced form submission for better UX
document.addEventListener('DOMContentLoaded', function() {
  const facetForm = document.querySelector('.bubble-filters form');
  if (facetForm) {
    // Add loading state on form submission
    facetForm.addEventListener('submit', function() {
      const submitButton = this.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = 'Filtering...';
        submitButton.disabled = true;
      }
    });
  }
});

// Add smooth transitions for better UX
function addSmoothTransitions() {
  const style = document.createElement('style');
  style.textContent = `
    .bubble-filters .facets__label {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .bubble-filters .facets__label:hover {
      transform: translateY(-2px);
    }
    
    .bubble-filters .facets__label.active {
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(style);
}

// Initialize smooth transitions
document.addEventListener('DOMContentLoaded', addSmoothTransitions);