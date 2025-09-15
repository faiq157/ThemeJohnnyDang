// Custom Product Information Functionality

document.addEventListener('DOMContentLoaded', function() {
  const customProductInfo = document.querySelector('.custom-product-info');
  if (!customProductInfo) return;

  // Quantity controls
  const quantityInput = customProductInfo.querySelector('.quantity-input');
  const quantityMinus = customProductInfo.querySelector('.quantity-minus');
  const quantityPlus = customProductInfo.querySelector('.quantity-plus');

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
  const mainImage = customProductInfo.querySelector('#main-product-image');
  const thumbnails = customProductInfo.querySelectorAll('.custom-product-info__thumbnail');

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      // Remove active class from all thumbnails
      thumbnails.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked thumbnail
      this.classList.add('active');
      
      // Update main image
      if (mainImage) {
        const thumbnailImg = this.querySelector('img');
        if (thumbnailImg) {
          mainImage.src = thumbnailImg.src.replace('_100x100', '_500x500');
          mainImage.alt = thumbnailImg.alt;
        }
      }
    });
  });

  // Set first thumbnail as active by default
  if (thumbnails.length > 0) {
    thumbnails[0].classList.add('active');
  }

  // Form submission
  const form = customProductInfo.querySelector('.custom-product-info__form');
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

      // Collect custom properties from all radio inputs
      const radioInputs = form.querySelectorAll('input[type="radio"]:checked');
      radioInputs.forEach(input => {
        if (input.name.startsWith('properties[')) {
          const propertyName = input.name.match(/properties\[(.*?)\]/)[1];
          productData.properties[propertyName] = input.value;
        }
      });

      // Add to cart
      addToCart(productData);
    });
  }

  // Add to cart function
  function addToCart(productData) {
    const addToCartButton = customProductInfo.querySelector('.custom-product-info__add-to-cart');
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

  // Color swatch hover effects
  const colorSwatches = customProductInfo.querySelectorAll('.color-swatch__label');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    swatch.addEventListener('mouseleave', function() {
      if (!this.previousElementSibling.checked) {
        this.style.transform = 'scale(1)';
      }
    });
  });

  // Size option hover effects
  const sizeOptions = customProductInfo.querySelectorAll('.size-option');
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
  const goldTypeOptions = customProductInfo.querySelectorAll('.gold-type-option');
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
  const firstRadioInEachGroup = customProductInfo.querySelectorAll('input[type="radio"]');
  const groups = new Set();
  
  firstRadioInEachGroup.forEach(radio => {
    if (!groups.has(radio.name)) {
      groups.add(radio.name);
      if (!customProductInfo.querySelector(`input[name="${radio.name}"]:checked`)) {
        radio.checked = true;
      }
    }
  });

  // Dynamic color swatch generation based on product variants
  generateDynamicColorSwatches();
});

// Function to generate dynamic color swatches based on product data
function generateDynamicColorSwatches() {
  // This function can be extended to dynamically generate color swatches
  // based on the actual product variants from Shopify
  console.log('Dynamic color swatches initialized');
}