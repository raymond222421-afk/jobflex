// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    
    // Update theme toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(button => {
        button.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
}

// Handle search and redirect to categories page
function handleSearch() {
    const searchQuery = document.getElementById('searchInput')?.value || '';
    const locationQuery = document.getElementById('locationInput')?.value || '';
    
    // Redirect to categories page with search parameters
    window.location.href = `categories.html?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`;
}

// Set initial theme and initialize components
document.addEventListener('DOMContentLoaded', () => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    document.querySelectorAll('.theme-toggle').forEach(button => {
        button.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    });

    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    let isMenuOpen = false;

    mobileMenuToggle?.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen.toString());
    });

    // Modal functionality
    const loginButton = document.querySelector('button.login');
    const signupButton = document.querySelector('button.signup');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Open modals
    loginButton?.addEventListener('click', () => {
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    signupButton?.addEventListener('click', () => {
        signupModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target === signupModal) {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Search navigation
    const searchNav = document.querySelector('.search-nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) { // Show after 100px scroll
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                searchNav?.classList.remove('visible');
            } else {
                // Scrolling up
                searchNav?.classList.add('visible');
            }
        } else {
            searchNav?.classList.remove('visible');
        }
        
        lastScrollTop = scrollTop;
    });

    // Connect CTA buttons to wizard
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'wizard.html';
        });
    });

    // Add hover effects for work type cards
    document.querySelectorAll('.work-type-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.work-type-card').forEach(c => {
                c.style.borderColor = 'transparent';
            });
            card.style.borderColor = '#FF6B35';
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .work-type-card, .scam-card, .category-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});