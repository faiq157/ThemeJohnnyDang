// Custom Product Form Functionality

document.addEventListener('DOMContentLoaded', function() {
  const customProduct = document.querySelector('.custom-product');
  if (!customProduct) return;

  // Quantity controls
  const quantityInput = customProduct.querySelector('.quantity-input');
  const quantityMinus = customProduct.querySelector('.quantity-minus');
  const quantityPlus = customProduct.querySelector('.quantity-plus');

  if (quantityMinus && quantityPlus && quantityInput) {
    quantityMinus.addEventListener('click', function() {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    quantityPlus.addEventListener('click', function() {
      const currentValue = parseInt(quantityInput.value);
      quantityInput.value = currentValue + 1;
    });
  }

  // Thumbnail gallery
  const mainImage = customProduct.querySelector('.custom-product__main-image img');
  const thumbnails = customProduct.querySelectorAll('.custom-product__thumbnail img');

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      if (mainImage) {
        mainImage.src = this.src.replace('_100x100', '_500x500');
        mainImage.alt = this.alt;
      }
    });
  });

  // Form submission
  const form = customProduct.querySelector('.custom-product__form-content');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(form);
      const productData = {
        id: formData.get('id'),
        quantity: formData.get('quantity'),
        properties: {}
      };

      // Collect custom properties
      const goldColor = form.querySelector('input[name="properties[Gold Color]"]:checked');
      const size = form.querySelector('input[name="properties[Size]"]:checked');
      const goldType = form.querySelector('input[name="properties[Gold Type]"]:checked');

      if (goldColor) productData.properties['Gold Color'] = goldColor.value;
      if (size) productData.properties['Size'] = size.value;
      if (goldType) productData.properties['Gold Type'] = goldType.value;

      // Add to cart
      addToCart(productData);
    });
  }

  // Smooth scroll for CTA button
  const ctaButton = customProduct.querySelector('.custom-product__cta');
  if (ctaButton && ctaButton.getAttribute('href') === '#custom-form') {
    ctaButton.addEventListener('click', function(e) {
      e.preventDefault();
      const formElement = customProduct.querySelector('#custom-form');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  // Add to cart function
  function addToCart(productData) {
    const addToCartButton = customProduct.querySelector('.custom-product__add-to-cart');
    const originalText = addToCartButton.textContent;
    
    // Show loading state
    addToCartButton.textContent = 'Adding...';
    addToCartButton.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
      // Success
      addToCartButton.textContent = 'Added to Cart!';
      addToCartButton.style.background = '#28a745';
      
      // Trigger cart update event
      document.dispatchEvent(new CustomEvent('cart:updated'));
      
      // Reset button after 2 seconds
      setTimeout(() => {
        addToCartButton.textContent = originalText;
        addToCartButton.disabled = false;
        addToCartButton.style.background = '';
      }, 2000);
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      addToCartButton.textContent = 'Error - Try Again';
      addToCartButton.style.background = '#dc3545';
      
      // Reset button after 2 seconds
      setTimeout(() => {
        addToCartButton.textContent = originalText;
        addToCartButton.disabled = false;
        addToCartButton.style.background = '';
      }, 2000);
    });
  }

  // Form validation
  function validateForm() {
    const requiredFields = customProduct.querySelectorAll('input[type="radio"]:required');
    let isValid = true;

    requiredFields.forEach(field => {
      const groupName = field.name;
      const groupChecked = customProduct.querySelector(`input[name="${groupName}"]:checked`);
      if (!groupChecked) {
        isValid = false;
        // Add error styling
        const group = customProduct.querySelector(`[data-group="${groupName}"]`);
        if (group) {
          group.classList.add('error');
        }
      }
    });

    return isValid;
  }

  // Real-time form validation
  const radioInputs = customProduct.querySelectorAll('input[type="radio"]');
  radioInputs.forEach(input => {
    input.addEventListener('change', function() {
      // Remove error styling from group
      const group = customProduct.querySelector(`[data-group="${this.name}"]`);
      if (group) {
        group.classList.remove('error');
      }
    });
  });

  // Color swatch hover effects
  const colorSwatches = customProduct.querySelectorAll('.color-swatch__label');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
    });
    
    swatch.addEventListener('mouseleave', function() {
      if (!this.previousElementSibling.checked) {
        this.style.transform = 'scale(1)';
      }
    });
  });

  // Size option hover effects
  const sizeOptions = customProduct.querySelectorAll('.size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('mouseenter', function() {
      if (!this.previousElementSibling.checked) {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.4)';
      }
    });
    
    option.addEventListener('mouseleave', function() {
      if (!this.previousElementSibling.checked) {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    });
  });

  // Gold type option hover effects
  const goldTypeOptions = customProduct.querySelectorAll('.gold-type-option');
  goldTypeOptions.forEach(option => {
    option.addEventListener('mouseenter', function() {
      if (!this.previousElementSibling.checked) {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.4)';
      }
    });
    
    option.addEventListener('mouseleave', function() {
      if (!this.previousElementSibling.checked) {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    });
  });

  // Initialize form with default selections
  const firstRadioInEachGroup = customProduct.querySelectorAll('input[type="radio"]');
  const groups = new Set();
  
  firstRadioInEachGroup.forEach(radio => {
    if (!groups.has(radio.name)) {
      groups.add(radio.name);
      if (!customProduct.querySelector(`input[name="${radio.name}"]:checked`)) {
        radio.checked = true;
      }
    }
  });
});