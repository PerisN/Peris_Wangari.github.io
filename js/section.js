document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav a");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          const link = document.querySelector(`nav a[href="#${id}"]`);
  
          if (entry.isIntersecting) {
            navLinks.forEach((link) => link.classList.remove("active"));
            if (link) {
              link.classList.add("active");
              console.log(`Activated: ${id}`);
            }
          }
        });
      },
      {
        threshold: 0.3,
      }
    );
  
    sections.forEach((section) => observer.observe(section));
  });
  