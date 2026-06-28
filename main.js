document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch and inject the header and modal wrapper
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const placeholder = document.getElementById('nav-placeholder');
            if (placeholder) {
                placeholder.outerHTML = data;
            }
            
            // Initialize navigation logic once header exists
            setupNavigation();
            
            // If on Ishtar, apply the special hide-on-scroll behavior
            if (document.body.classList.contains('ishtar-page')) {
                setupIshtarNavBehavior();
            }
        })
        .catch(error => console.error('Error loading the header:', error));

    // 2. If we are on the Home Page, inject the grid directly
    if (document.body.classList.contains('home-page')) {
        fetch('projects-grid.html')
            .then(response => response.text())
            .then(data => {
                const homeGrid = document.getElementById('home-grid-container');
                if (homeGrid) {
                    homeGrid.innerHTML = data;
                }
            })
            .catch(error => console.error('Error loading home grid:', error));
    }
});

function setupNavigation() {
    const projectsLink = document.getElementById('nav-projects-link');
    const logoLink = document.querySelector('.logo');
    const isHomePage = document.body.classList.contains('home-page');
    let isModalGridLoaded = false;

    if (logoLink && isHomePage) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault(); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (projectsLink) {
        projectsLink.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            if (isHomePage) {
                const section = document.getElementById('projects-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            } else {
                const modal = document.getElementById('projects-modal');
                const modalGridContainer = document.getElementById('modal-grid-container');
                
                if (!modal || !modalGridContainer) return;

                if (!isModalGridLoaded) {
                    fetch('projects-grid.html')
                        .then(response => response.text())
                        .then(data => {
                            modalGridContainer.innerHTML = data;
                            isModalGridLoaded = true;
                            modal.classList.toggle('is-open');
                            document.body.classList.toggle('modal-open');
                        });
                } else {
                    modal.classList.toggle('is-open');
                    document.body.classList.toggle('modal-open');
                }
            }
        });
    }
}

// Ishtar specific hide/show header logic
function setupIshtarNavBehavior() {
    const header = document.querySelector('header.global-header');
    if (!header) return;

    // Hide it immediately from the get-go
    header.classList.add('nav-hidden');

    window.addEventListener('scroll', () => {
        // Keep it hidden on scroll unless the modal is open
        if (!document.body.classList.contains('modal-open')) {
            header.classList.add('nav-hidden');
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('modal-open')) return;
        
        // Show only when hovering near the top (e.g., top 80px)
        if (e.clientY <= 80) {
            header.classList.remove('nav-hidden');
        } 
        // Hide if the mouse leaves the header area
        else if (!header.contains(e.target)) {
            header.classList.add('nav-hidden');
        }
    });

    // Hide header when the cursor leaves the browser viewport
    document.addEventListener('mouseleave', () => {
        if (!document.body.classList.contains('modal-open')) {
            header.classList.add('nav-hidden');
        }
    });
}

// Detect when the projects section reaches the top of the viewport (Homepage)
window.addEventListener('scroll', () => {
    if (document.body.classList.contains('home-page')) {
        const projectsSection = document.getElementById('projects-section');
        if (projectsSection) {
            const sectionTop = projectsSection.getBoundingClientRect().top;
            if (sectionTop <= 0) {
                document.body.classList.add('nav-solid');
            } else {
                document.body.classList.remove('nav-solid');
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".gallery-slider img");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    let currentIndex = 0;

    if (!slides.length) return;

    function showSlide(index) {
        slides[currentIndex].classList.remove("active");
        currentIndex = (index + slides.length) % slides.length;
        slides[currentIndex].classList.add("active");
    }

    prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
    nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));

    // Optional: Allow keyboard arrow keys to turn pages
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") showSlide(currentIndex - 1);
        if (e.key === "ArrowRight") showSlide(currentIndex + 1);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".gallery-slider");
    const slides = document.querySelectorAll(".gallery-slider img");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const dotsContainer = document.querySelector(".carousel-dots");
    let currentIndex = 0;

    if (!slides.length) return;

    // 1. Generate dot elements inside the DOM dynamically
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement("div");
            dot.classList.add("carousel-dot");
            if (index === 0) dot.classList.add("active");
            dotsContainer.appendChild(dot);
        });
    }
    const dots = document.querySelectorAll(".carousel-dot");

    function updateDots(index) {
        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[index]) dots[index].classList.add("active");
    }

    // 2. Desktop Transition Engine
    function showSlide(index) {
        slides[currentIndex].classList.remove("active");
        currentIndex = (index + slides.length) % slides.length;
        slides[currentIndex].classList.add("active");
        updateDots(currentIndex);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
        nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));
    }

    document.addEventListener("keydown", (e) => {
        if (window.innerWidth > 900) {
            if (e.key === "ArrowLeft") showSlide(currentIndex - 1);
            if (e.key === "ArrowRight") showSlide(currentIndex + 1);
        }
    });

    // 3. Mobile Swipe Intersection Tracking Observer
    if (slider) {
        slider.addEventListener("scroll", () => {
            if (window.innerWidth <= 900) {
                const width = slider.clientWidth;
                // Detects exactly which item is currently intersecting center view frame
                const newIndex = Math.round(slider.scrollLeft / width);
                if (newIndex !== currentIndex && newIndex < slides.length) {
                    currentIndex = newIndex;
                    updateDots(currentIndex);
                }
            }
        });
    }
});

const gallery = document.querySelector('.gallery-slider');
const images = Array.from(document.querySelectorAll('.gallery-slider img'));

// Find the currently active image, default to 0 if none found
let currentIndex = images.findIndex(img => img.classList.contains('active'));
if (currentIndex === -1) currentIndex = 0;

// 1. Create and inject the custom cursor element
const cursorArrow = document.createElement('div');
cursorArrow.id = 'cursor-arrow';
document.body.appendChild(cursorArrow); 

// 2. Show/Hide on hover
gallery.addEventListener('mouseenter', () => {
    cursorArrow.classList.add('visible');
});

gallery.addEventListener('mouseleave', () => {
    cursorArrow.classList.remove('visible');
});

// 3. Track mouse movement and flip arrow
gallery.addEventListener('mousemove', (e) => {
    cursorArrow.style.left = `${e.clientX}px`;
    cursorArrow.style.top = `${e.clientY}px`;

    const rect = gallery.getBoundingClientRect();
    const isRightSide = (e.clientX - rect.left) > (rect.width / 2);

    cursorArrow.textContent = isRightSide ? '→' : '←';
});

// 4. Handle Clicks (Functional Logic)
gallery.addEventListener('click', (e) => {
    if (images.length === 0) return;

    const rect = gallery.getBoundingClientRect();
    const isRightSide = (e.clientX - rect.left) > (rect.width / 2);

    // Remove active class from current image
    images[currentIndex].classList.remove('active');

    // Calculate the new index
    if (isRightSide) {
        currentIndex = (currentIndex + 1) % images.length; // Loop forward
    } else {
        currentIndex = (currentIndex - 1 + images.length) % images.length; // Loop backward
    }

    // Add active class to the new image
    images[currentIndex].classList.add('active');
});