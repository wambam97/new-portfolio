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

