// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPSqJl31B_UhiAKCXWGwd2feDdIfntBl0",
    authDomain: "jobflexx-4d54a.firebaseapp.com",
    projectId: "jobflexx-4d54a",
    storageBucket: "jobflexx-4d54a.appspot.com",
    messagingSenderId: "11771710591",
    appId: "1:11771710591:web:8a52db319560790a71834a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Mobile Menu Functionality
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // Prevent menu from closing when clicking inside
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Modal Management
const modals = {
    init() {
        // Login button
        document.querySelector('.btn-login')?.addEventListener('click', () => {
            this.openModal('loginModal');
        });

        // Signup button
        document.querySelector('.btn-signup')?.addEventListener('click', () => {
            this.openModal('signupModal');
        });

        // Close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });

        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signupForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
    },

    openModal(id) {
        this.closeModals();
        document.getElementById(id).style.display = 'block';
        document.body.style.overflow = 'hidden';
    },

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
    },

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                this.closeModals();
                updateAuthUI(userCredential.user);
            })
            .catch((error) => {
                alert(error.message);
            });
    },

    handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const country = document.getElementById('signupCountry').value;
        const phone = document.getElementById('signupPhone').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Save additional user data to Firestore
                db.collection('users').doc(userCredential.user.uid).set({
                    name,
                    email,
                    country,
                    phone,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    role: 'user'
                });
                
                this.closeModals();
                updateAuthUI(userCredential.user);
            })
            .catch((error) => {
                alert(error.message);
            });
    }
};

// Update authentication UI based on user state
function updateAuthUI(user) {
    const authButtons = document.querySelector('.auth-buttons');
    const mobileAuth = document.querySelector('.mobile-auth');
    
    if (user) {
        authButtons.innerHTML = `
            <div class="user-dropdown">
                <button class="user-profile">${user.email}</button>
                <div class="dropdown-content">
                    <a href="dashboard.html">Dashboard</a>
                    <button class="btn-logout">Logout</button>
                </div>
            </div>
        `;
        
        mobileAuth.innerHTML = `
            <a href="dashboard.html" class="mobile-nav-link">Dashboard</a>
            <button class="btn-logout">Logout</button>
        `;
        
        document.querySelector('.btn-logout').addEventListener('click', () => {
            auth.signOut();
        });
    } else {
        authButtons.innerHTML = `
            <button class="btn-login">Log In</button>
            <button class="btn-signup">Sign Up</button>
        `;
        
        mobileAuth.innerHTML = `
            <button class="btn-login">Log In</button>
            <button class="btn-sign极客Sign Up</button>
        `;
        
        // Reattach event listeners
        document.querySelector('.btn-login').addEventListener('click', () => modals.openModal('loginModal'));
        document.querySelector('.btn-signup').addEventListener('click', () => modals.openModal('signupModal'));
    }
}

// Listen for auth state changes
auth.onAuthStateChanged(updateAuthUI);

// Search Functionality
function searchJobs() {
    const jobSearch = document.getElementById('jobSearch')?.value.trim();
    const locationSearch = document.getElementById('locationSearch')?.value.trim();
    
    if (!jobSearch && !locationSearch) {
        alert('Please enter a job title or location to search.');
        return false;
    }
    
    // Show loading state
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        const originalText = searchBtn.innerHTML;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        searchBtn.disabled = true;
    }
    
    // Prepare search parameters
    const params = new URLSearchParams();
    if (jobSearch) params.append('job', jobSearch);
    if (locationSearch) params.append('location', locationSearch);
    
    // Simulate search delay
    setTimeout(() => {
        window.location.href = 'wizard.html?' + params.toString();
    }, 800);
    
    return false;
}

// Navigation Functionality
function goToWizard(category, event) {
    if (event) {
        // Add click animation
        event.currentTarget.style.transform = 'scale(0.95)';
    }
    
    setTimeout(() => {
        const url = category === 'all' ? 'wizard.html' : `wizard.html?category=${category}`;
        window.location.href = url;
    }, 150);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    modals.init();
    
    // Search input enter key handlers
    const jobSearchInput = document.getElementById('jobSearch');
    const locationSearchInput = document.getElementById('locationSearch');
    
    if (jobSearchInput) {
        jobSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchJobs();
            }
        });
    }
    
    if (locationSearchInput) {
        locationSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchJobs();
            }
        });
    }

    // Featured job cards redirect
    document.querySelectorAll('.job-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = 'wizard.html';
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            header.style.transform = scrollTop > lastScrollTop ? 'translateY(-100%)' : 'translateY(0)';
            lastScrollTop = scrollTop;
        });
    }

    // Window resize handler
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    });

    // Accessibility - Escape key closes mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    });
});