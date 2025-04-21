document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const skillsDisplay = document.getElementById('skillsDisplay');
  const prevButton = document.getElementById('prevCard');
  const nextButton = document.getElementById('nextCard');
  const pageIndicators = document.getElementById('pageIndicators');
  const filterPills = document.querySelectorAll('.filter-pill');
  
  // Variables to track state
  let currentCategory = 'data-analysis'; // Default category
  let currentIndex = 0;
  let cardsInView = 1; // Default to 1 card in mobile view
  let totalCards = 0;
  let maxIndex = 0;
  
  // Set up responsive behavior
  function updateCardsInView() {
    if (window.innerWidth >= 1200) {
      cardsInView = 3; // Show 3 cards on large screens
    } else if (window.innerWidth >= 768) {
      cardsInView = 2; // Show 2 cards on medium screens
    } else {
      cardsInView = 1; // Show 1 card on small screens
    }
    updateNavigation();
  }
  
  // Initialize page indicators
  function createPageIndicators(total) {
    pageIndicators.innerHTML = '';
    const pages = Math.ceil(total / cardsInView);
    
    for (let i = 0; i < pages; i++) {
      const indicator = document.createElement('span');
      indicator.classList.add('page-indicator');
      if (i === 0) indicator.classList.add('active');
      
      indicator.addEventListener('click', () => {
        currentIndex = i * cardsInView;
        updateCards();
        updateNavigation();
      });
      
      pageIndicators.appendChild(indicator);
    }
  } 
  
  // Get all category names from filter pills
  function getAllCategories() {
    const categories = [];
    filterPills.forEach(pill => {
      categories.push(pill.dataset.filter);
    });
    return categories;
  }
  
  // Get index of current category in the categories array
  function getCurrentCategoryIndex() {
    const categories = getAllCategories();
    return categories.indexOf(currentCategory);
  }
  
  // Check if current category is the first one
  function isFirstCategory() {
    return getCurrentCategoryIndex() === 0;
  }
  
  // Move to specific category
  function moveToCategory(categoryName) {
    // Find the filter pill with this category and click it
    const pill = Array.from(filterPills).find(p => p.dataset.filter === categoryName);
    
    if (pill) {
      // Update active state
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      // Filter cards
      filterCards(categoryName);
    }
  }
  
  // Navigate to next category
  function goToNextCategory() {
    const categories = getAllCategories();
    const currentCatIndex = getCurrentCategoryIndex();
    const nextIndex = (currentCatIndex + 1) % categories.length;
    moveToCategory(categories[nextIndex]);
    currentIndex = 0; // Start at first card of new category
  }
  
  // Navigate to previous category
  function goToPreviousCategory() {
    const categories = getAllCategories();
    const currentCatIndex = getCurrentCategoryIndex();
    const prevIndex = (currentCatIndex - 1 + categories.length) % categories.length;
    moveToCategory(categories[prevIndex]);
    
    // Set index to last page of the category
    const categoryCards = document.querySelectorAll(`.skill-card[data-category="${categories[prevIndex]}"]`);
    totalCards = categoryCards.length;
    maxIndex = Math.max(0, totalCards - cardsInView);
    currentIndex = maxIndex; // Go to last card group of previous category
    updateCards();
    updateNavigation();
  }
  
  // Update navigation buttons and indicators
  function updateNavigation() {
    // Update total cards and max index
    const visibleCards = document.querySelectorAll(`.skill-card[data-category="${currentCategory}"]`);
    totalCards = visibleCards.length;
    maxIndex = Math.max(0, totalCards - cardsInView);
    
    // Enable/disable buttons based on position and category
    const prevButtons = document.querySelectorAll('.prev-button');
    const nextButtons = document.querySelectorAll('.next-button');
    
    prevButtons.forEach(btn => {
      // Disable prev button only if at the first card of the first category
      btn.disabled = currentIndex <= 0 && isFirstCategory();
    });
    
    nextButtons.forEach(btn => {
      // Always enable next button for category cycling
      btn.disabled = false;
    });
    
    // Update page indicators
    const indicators = document.querySelectorAll('.page-indicator');
    const currentPage = Math.floor(currentIndex / cardsInView);
    
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentPage);
    });
  }
  
  // Filter cards by category and update display
  function filterCards(category) {
    currentCategory = category;
    currentIndex = 0; // Reset index when changing categories
    
    // Hide all cards first
    const allCards = document.querySelectorAll('.skill-card');
    allCards.forEach(card => {
      card.style.display = 'none';
    });
    
    // Show only cards from selected category
    const categoryCards = document.querySelectorAll(`.skill-card[data-category="${category}"]`);
    totalCards = categoryCards.length;
    maxIndex = Math.max(0, totalCards - cardsInView);
    
    createPageIndicators(totalCards);
    updateCards();
    updateNavigation();
  }
  
  // Update which cards are visible
  function updateCards() {
    const categoryCards = document.querySelectorAll(`.skill-card[data-category="${currentCategory}"]`);
    
    categoryCards.forEach((card, index) => {
      if (index >= currentIndex && index < currentIndex + cardsInView) {
        card.style.display = 'block';
        card.style.opacity = '1';
        // Add a slight delay for each card for a staggered appearance
        card.style.transition = `opacity 0.3s ease ${(index - currentIndex) * 0.1}s, transform 0.3s ease ${(index - currentIndex) * 0.1}s`;
        card.style.transform = 'translateX(0)';
      } else if (index < currentIndex) {
        card.style.display = 'none';
        card.style.transform = 'translateX(-20px)';
        card.style.opacity = '0';
      } else {
        card.style.display = 'none';
        card.style.transform = 'translateX(20px)';
        card.style.opacity = '0';
      }
    });
  }
  
  // Function to handle previous click
  function handlePrevClick() {
    if (currentIndex > 0) {
      // We can go back within the same category
      currentIndex--;
      updateCards();
      updateNavigation();
    } else if (!isFirstCategory()) {
      // If not the first category and at the first card, go to previous category
      goToPreviousCategory();
    }
    // If it's the first category and first card, do nothing (button should be disabled)
  }
  
  // Function to handle next click
  function handleNextClick() {
    if (currentIndex < maxIndex) {
      // We can go forward within the same category
      currentIndex++;
      updateCards();
      updateNavigation();
    } else {
      // We're at the last card of the category, go to next category
      goToNextCategory();
    }
  }
  
  // Event listeners for navigation buttons
  document.querySelectorAll('.prev-button').forEach(btn => {
    btn.addEventListener('click', handlePrevClick);
  });
  
  document.querySelectorAll('.next-button').forEach(btn => {
    btn.addEventListener('click', handleNextClick);
  });
  
  // Event listeners for filter pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active state
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      // Filter cards
      filterCards(pill.dataset.filter);
    });
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    updateCardsInView();
    createPageIndicators(totalCards);
    updateCards();
  });
  
  // Initialize
  updateCardsInView();
  filterCards('data-analysis'); // Start with data analysis category
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      if (!(currentIndex <= 0 && isFirstCategory())) {
        handlePrevClick();
      }
    } else if (e.key === 'ArrowRight') {
      handleNextClick();
    }
  });
  
  // Add touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  skillsDisplay.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  skillsDisplay.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    const minSwipeDistance = 50;
    if (touchEndX < touchStartX - minSwipeDistance) {
      // Swipe left -> next
      handleNextClick();
    }
    if (touchEndX > touchStartX + minSwipeDistance) {
      // Swipe right -> previous
      if (!(currentIndex <= 0 && isFirstCategory())) {
        handlePrevClick();
      }
    }
  }
});