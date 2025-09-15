/**
 * Header Scroll Effect - Universal Implementation
 * This script adds a background effect to the header when scrolling
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for the page to fully load
  setTimeout(function() {
    initHeaderScrollEffect();
  }, 100);
});

function initHeaderScrollEffect() {
  // Find all possible header elements
  const headerSelectors = [
    '.header-wrapper',
    '.jd-header-wrapper', 
    '.shopify-section-header',
    'sticky-header',
    '.section-header'
  ];
  
  let headerElement = null;
  
  // Try to find the header element
  for (let selector of headerSelectors) {
    headerElement = document.querySelector(selector);
    if (headerElement) {
      console.log('Found header element:', selector);
      break;
    }
  }
  
  if (!headerElement) {
    console.log('No header element found');
    return;
  }
  
  // Add initial styles to ensure header stays sticky and visible
  headerElement.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  headerElement.style.background = 'transparent';
  headerElement.style.position = 'sticky';
  headerElement.style.top = '0';
  headerElement.style.zIndex = '9999';
  
  // Remove any classes that might hide the header and force visibility
  headerElement.classList.remove('shopify-section-header-hidden');
  headerElement.classList.add('shopify-section-header-sticky');
  
  // Force header to stay visible with inline styles
  headerElement.style.top = '0';
  headerElement.style.transform = 'none';
  headerElement.style.opacity = '1';
  headerElement.style.visibility = 'visible';
  
  // Scroll handler
  let ticking = false;
  
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Ensure header stays sticky and visible - force it every scroll
    headerElement.style.position = 'sticky';
    headerElement.style.top = '0';
    headerElement.style.zIndex = '9999';
    headerElement.style.transform = 'none';
    headerElement.style.opacity = '1';
    headerElement.style.visibility = 'visible';
    headerElement.classList.remove('shopify-section-header-hidden');
    headerElement.classList.add('shopify-section-header-sticky');
    
    if (scrollTop > 50) {
      headerElement.classList.add('header-scrolled');
      headerElement.style.background = 'rgba(0, 0, 0, 0.95)';
      headerElement.style.backdropFilter = 'blur(20px)';
      headerElement.style.webkitBackdropFilter = 'blur(20px)';
      headerElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
      headerElement.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    } else {
      headerElement.classList.remove('header-scrolled');
      headerElement.style.background = 'transparent';
      headerElement.style.backdropFilter = 'none';
      headerElement.style.webkitBackdropFilter = 'none';
      headerElement.style.boxShadow = 'none';
      headerElement.style.borderBottom = 'none';
    }
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
      setTimeout(() => { ticking = false; }, 16);
    }
  }
  
  // Add scroll listener
  window.addEventListener('scroll', requestTick, { passive: true });
  
  // Initial call
  handleScroll();
  
  // Watch for any changes to header classes and fix them immediately
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // If hidden class was added, remove it immediately
        if (headerElement.classList.contains('shopify-section-header-hidden')) {
          headerElement.classList.remove('shopify-section-header-hidden');
          headerElement.classList.add('shopify-section-header-sticky');
          headerElement.style.top = '0';
          headerElement.style.transform = 'none';
          headerElement.style.opacity = '1';
          headerElement.style.visibility = 'visible';
        }
      }
    });
  });
  
  observer.observe(headerElement, { attributes: true, attributeFilter: ['class'] });
  
  // Initialize dropdown menu blur effects
  initDropdownBlurEffects();
  
  console.log('Header scroll effect initialized successfully');
}

/**
 * Initialize dropdown menu blur effects
 */
function initDropdownBlurEffects() {
  // Find all dropdown menus
  const dropdownMenus = document.querySelectorAll('.header__submenu, .mega-menu__content, .menu-drawer__submenu');
  
  dropdownMenus.forEach(menu => {
    // Apply blur effect styles
    menu.style.background = 'rgba(0, 0, 0, 0.95)';
    menu.style.backdropFilter = 'blur(20px)';
    menu.style.webkitBackdropFilter = 'blur(20px)';
    menu.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    menu.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    
    // Ensure text is white
    const menuItems = menu.querySelectorAll('*');
    menuItems.forEach(item => {
      item.style.color = '#ffffff';
    });
  });
  
  // Watch for new dropdown menus that might be created dynamically
  const menuObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          const newMenus = node.querySelectorAll ? node.querySelectorAll('.header__submenu, .mega-menu__content, .menu-drawer__submenu') : [];
          newMenus.forEach(menu => {
            menu.style.background = 'rgba(0, 0, 0, 0.95)';
            menu.style.backdropFilter = 'blur(20px)';
            menu.style.webkitBackdropFilter = 'blur(20px)';
            menu.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            menu.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            
            const menuItems = menu.querySelectorAll('*');
            menuItems.forEach(item => {
              item.style.color = '#ffffff';
            });
          });
        }
      });
    });
  });
  
  menuObserver.observe(document.body, { childList: true, subtree: true });
  
  console.log('Dropdown menu blur effects initialized');
  
  // Add test buttons for debugging (remove in production)
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('myshopify.com')) {
    // Header effect test button
    const headerTestButton = document.createElement('button');
    headerTestButton.textContent = 'Test Header';
    headerTestButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 10000; background: red; color: white; border: none; padding: 10px; cursor: pointer; margin-right: 120px;';
    headerTestButton.onclick = function() {
      headerElement.classList.toggle('header-scrolled');
      console.log('Header scrolled class toggled:', headerElement.classList.contains('header-scrolled'));
    };
    document.body.appendChild(headerTestButton);
    
    // Dropdown effect test button
    const dropdownTestButton = document.createElement('button');
    dropdownTestButton.textContent = 'Test Dropdown';
    dropdownTestButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 10000; background: blue; color: white; border: none; padding: 10px; cursor: pointer;';
    dropdownTestButton.onclick = function() {
      initDropdownBlurEffects();
      console.log('Dropdown blur effects reapplied');
    };
    document.body.appendChild(dropdownTestButton);
  }
}