// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    
    // Update theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
}

// Set initial theme based on user preference (default to dark)
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

    // Smooth scroll for CTA buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', () => {
            console.log('CTA clicked - Ready to start job search!');
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

    document.querySelectorAll('.feature-card, .work-type-card, .scam-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});