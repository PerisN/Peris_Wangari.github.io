// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create our own simplified version of the valueAtPercentage function
  function valueAtPercentage({ from, to, percentage }) {
    return from + (to - from) * percentage;
  }
  
  // Get all the project cards and container
  const cardsContainer = document.querySelector('#projects .cards');
  const cards = document.querySelectorAll('#projects .card');
  
  // Set container properties based on cards count
  cardsContainer.style.setProperty('--cards-count', cards.length);
  cardsContainer.style.position = 'relative';
  
  // Set initial card heights and positions
  function initializeCards() {
    // First we need to make sure all cards are visible to get their proper height
    cards.forEach(card => {
      card.style.position = 'relative';
      card.style.visibility = 'visible';
      card.style.opacity = '1';
    });
    
    // Get the base height of a card
    const baseCardHeight = cards[0].clientHeight;
    cardsContainer.style.setProperty('--card-height', `${baseCardHeight}px`);
    
    // Now set up each card with proper padding and initial state
    Array.from(cards).forEach((card, index) => {
      // Calculate padding top (space between cards)
      const offsetTop = 20 + index * 20;
      card.style.paddingTop = `${offsetTop}px`;
      
      // Set initial card styles
      const cardInner = card.querySelector('.card__inner');
      card.style.position = 'relative';
      card.style.zIndex = cards.length - index;
      
      // Don't setup scroll effects for the last card
      if (index === cards.length - 1) {
        return;
      }
      
      // Calculate the scale factor for this card when the next card is visible
      const toScale = 1 - (cards.length - 1 - index) * 0.1;
    });
    
    // Calculate total container height needed
    let totalHeight = 0;
    cards.forEach((card, index) => {
      const offsetTop = 20 + index * 20;
      totalHeight += card.clientHeight + offsetTop;
    });
    
    // Set container height to accommodate all cards
    cardsContainer.style.height = `${totalHeight}px`;
  }
  
  // Handle scroll effects
  function setupScrollEffects() {
    // For each card except the last one
    Array.from(cards).forEach((card, index) => {
      if (index === cards.length - 1) return;
      
      const nextCard = cards[index + 1];
      const cardInner = card.querySelector('.card__inner');
      const offsetTop = 20 + index * 20;
      
      // Calculate scale factor
      const toScale = 1 - (cards.length - 1 - index) * 0.1;
      
      // Watch for scroll position
      window.addEventListener('scroll', () => {
        // Calculate the visibility percentage of the next card
        const nextCardRect = nextCard.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // How much of the next card is visible in the viewport
        let visibilityPercentage = 0;
        
        if (nextCardRect.top < windowHeight && nextCardRect.bottom > 0) {
          // Card is partially visible
          const visibleHeight = Math.min(nextCardRect.bottom, windowHeight) - 
                               Math.max(nextCardRect.top, 0);
          visibilityPercentage = Math.min(1, visibleHeight / nextCardRect.height);
        } else if (nextCardRect.bottom <= 0) {
          // Card has scrolled past the top
          visibilityPercentage = 1;
        }
        
        // Apply scale transformation based on visibility
        cardInner.style.transform = `scale(${valueAtPercentage({
          from: 1,
          to: toScale,
          percentage: visibilityPercentage
        })})`;
        
        // Apply brightness filter
        cardInner.style.filter = `brightness(${valueAtPercentage({
          from: 1,
          to: 0.85,
          percentage: visibilityPercentage
        })})`;
      });
    });
  }
  
  // Add hover effects
  function setupHoverEffects() {
    cards.forEach(card => {
      const cardInner = card.querySelector('.card__inner');
      let originalTransform, originalFilter;
      
      card.addEventListener('mouseenter', () => {
        // Store original values
        originalTransform = cardInner.style.transform;
        originalFilter = cardInner.style.filter;
        
        // Apply hover effects
        card.style.zIndex = 100;
        cardInner.style.transform = 'scale(1.02)';
        cardInner.style.filter = 'brightness(1.05)';
      });
      
      card.addEventListener('mouseleave', () => {
        // Restore original values
        card.style.zIndex = cards.length - Array.from(cards).indexOf(card);
        cardInner.style.transform = originalTransform;
        cardInner.style.filter = originalFilter;
      });
    });
  }
  
  // Handle window resize
  function handleResize() {
    initializeCards();
  }
  
  // Initialize everything
  function init() {
    initializeCards();
    setupScrollEffects();
    setupHoverEffects();
    
    // Re-initialize on window resize
    window.addEventListener('resize', handleResize);
  }
  
  // Start everything
  init();
});