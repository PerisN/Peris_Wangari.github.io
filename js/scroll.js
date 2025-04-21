let currentSectionIndex = 0;
const sections = document.querySelectorAll("section"); 
let isScrolling = false;
let lastScrollTime = Date.now();
const scrollCooldown = 1000; // 1 second cooldown between section jumps

// Get the projects section
const projectsSection = document.getElementById('projects'); // Assuming the section has id="projects"

// Helper to check if an element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= 50 && // Element's top is within 50px of viewport top
    rect.bottom >= window.innerHeight - 50 // Element's bottom is within 50px of viewport bottom
  );
}

// Helper function to determine if we're at the end of the projects section
function isAtEndOfProjectsSection() {
  if (!projectsSection) return false;
  
  const rect = projectsSection.getBoundingClientRect();
  const projectsSectionBottom = projectsSection.scrollHeight;
  const scrolledAmount = Math.abs(rect.top);
  
  // If we've scrolled to within 100px of the bottom of the projects section
  return scrolledAmount >= projectsSectionBottom - window.innerHeight - 100;
}

// Helper function to determine if we're at the beginning of the projects section
function isAtStartOfProjectsSection() {
  if (!projectsSection) return false;
  
  const rect = projectsSection.getBoundingClientRect();
  return rect.top >= -100 && rect.top <= 100;
}

window.addEventListener('wheel', function (event) {
  // If we're in the middle of a smooth scroll or cooldown hasn't elapsed, ignore
  const now = Date.now();
  if (isScrolling || (now - lastScrollTime < scrollCooldown)) return;
  
  // Check if we're currently viewing the projects section
  if (projectsSection && isInViewport(projectsSection)) {
    // Only override normal scrolling if:
    // 1. Scrolling down but not yet at the bottom of projects section, or
    // 2. Scrolling up but not yet at the top of projects section
    if ((event.deltaY > 0 && !isAtEndOfProjectsSection()) || 
        (event.deltaY < 0 && !isAtStartOfProjectsSection())) {
      return; // Let normal scrolling happen within the projects section
    }
  }
  
  // Section-by-section scrolling for other cases
  isScrolling = true;
  lastScrollTime = now;
  
  setTimeout(() => {
    isScrolling = false;
  }, scrollCooldown);
  
  if (event.deltaY > 0) {
    // Scroll Down
    if (currentSectionIndex < sections.length - 1) {
      currentSectionIndex++;
    }
  } else {
    // Scroll Up
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
    }
  }
  
  // Update current visible section for tracking
  for (let i = 0; i < sections.length; i++) {
    if (isInViewport(sections[i])) {
      currentSectionIndex = i;
      break;
    }
  }
  
  // Scroll to the next section
  sections[currentSectionIndex].scrollIntoView({
    behavior: 'smooth',  // Smooth scroll
    block: 'start',      // Align the section to the top of the screen
  });
});

// Update current section index on regular scroll too
window.addEventListener('scroll', function() {
  if (isScrolling) return;
  
  // Debounce the scroll event
  clearTimeout(window.scrollTimeout);
  window.scrollTimeout = setTimeout(() => {
    // Update current visible section
    for (let i = 0; i < sections.length; i++) {
      if (isInViewport(sections[i])) {
        currentSectionIndex = i;
        break;
      }
    }
  }, 100);
});

// Optional: Mobile touch support
let touchStartY = 0;
let touchEndY = 0;
const minSwipeDistance = 50;

document.addEventListener('touchstart', function(event) {
  touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(event) {
  touchEndY = event.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const touchDiff = touchStartY - touchEndY;
  
  // If inside projects section and not at beginning/end, allow natural scroll
  if (projectsSection && isInViewport(projectsSection)) {
    if ((touchDiff > 0 && !isAtEndOfProjectsSection()) || 
        (touchDiff < 0 && !isAtStartOfProjectsSection())) {
      return; // Let normal scrolling happen
    }
  }
  
  // Only trigger for significant swipes and respect cooldown
  const now = Date.now();
  if (Math.abs(touchDiff) < minSwipeDistance || (now - lastScrollTime < scrollCooldown)) return;
  
  isScrolling = true;
  lastScrollTime = now;
  
  setTimeout(() => {
    isScrolling = false;
  }, scrollCooldown);
  
  if (touchDiff > 0) {
    // Swipe Up (scroll down)
    if (currentSectionIndex < sections.length - 1) {
      currentSectionIndex++;
    }
  } else {
    // Swipe Down (scroll up)
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
    }
  }
  
  sections[currentSectionIndex].scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

