// Global variables
let appsData = [];
let categoriesData = [];
let currentPage = 1;
const appsPerPage = 6;
let currentFilter = 'all';
let isLoading = false;

// DOM elements
const loadingScreen = document.getElementById('loading-screen');
const searchBtn = document.getElementById('search-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchClose = document.getElementById('search-close');
const searchResults = document.getElementById('search-results');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const tutorialBtn = document.getElementById('tutorial-btn');
const tutorialModal = document.getElementById('tutorial-modal');
const modalClose = document.getElementById('modal-close');
const appDetailModal = document.getElementById('app-detail-modal');
const appDetailClose = document.getElementById('app-detail-close');
const appDetailContent = document.getElementById('app-detail-content');
const appsGrid = document.getElementById('apps-grid');
const educationGrid = document.getElementById('education-grid');
const loadMoreBtn = document.getElementById('load-more-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Simulate loading time for better UX
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);

        // Load data
        await loadData();
        
        // Initialize components
        initializeNavigation();
        initializeSearch();
        initializeModals();
        initializeFilters();
        initializeStats();
        
        // Render content
        renderApps();
        renderEducationApps();
        
        // Initialize intersection observer for animations
        initializeIntersectionObserver();
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Load data from JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        const data = await response.json();
        appsData = data.apps || generateSampleData();
        categoriesData = data.categories || generateSampleCategories();
        
        // Update filter tabs based on categories
        updateFilterTabs();
        
    } catch (error) {
        console.error('Error loading data:', error);
        appsData = generateSampleData();
        categoriesData = generateSampleCategories();
        updateFilterTabs();
    }
}

// Generate sample categories if not available
function generateSampleCategories() {
    return [
        { id: 1, name: "apps", displayName: "Apps", icon: "📱", active: true },
        { id: 2, name: "games", displayName: "Games", icon: "🎮", active: true },
        { id: 3, name: "education", displayName: "Education", icon: "📚", active: true },
        { id: 4, name: "tools", displayName: "Tools", icon: "🛠️", active: true }
    ];
}

// Update filter tabs based on categories
function updateFilterTabs() {
    const filterTabs = document.querySelector('.filter-tabs');
    if (!filterTabs) return;
    
    const activeCategories = categoriesData.filter(cat => cat.active);
    
    filterTabs.innerHTML = `
        <button class="filter-tab active" data-filter="all">All</button>
        ${activeCategories.map(category => 
            `<button class="filter-tab" data-filter="${category.name}">${category.displayName}</button>`
        ).join('')}
    `;
    
    // Re-initialize filter event listeners
    initializeFilters();
}

// Generate sample data if JSON file is not available
function generateSampleData() {
    return [
        {
            id: 1,
            name: "WhatsApp Plus",
            version: "17.25.0",
            category: "apps",
            description: "Enhanced WhatsApp with additional features like custom themes, privacy options, and extended file sharing capabilities.",
            features: ["Custom Themes", "Enhanced Privacy", "Extended File Sharing", "No Ads"],
            icon: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
            image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
            downloadUrl: "https://drive.google.com/file/d/example1",
            rating: 4.5,
            downloads: "10M+",
            size: "25MB",
            updated: "2024-01-15",
            seo: {
                title: "WhatsApp Plus - Enhanced Messaging Experience",
                description: "Download WhatsApp Plus with custom themes and privacy features",
                keywords: "whatsapp plus, messaging, privacy",
                slug: "whatsapp-plus-enhanced"
            }
        },
        {
            id: 2,
            name: "Duolingo Plus",
            version: "5.92.4",
            category: "education",
            description: "Learn languages for free with Duolingo Plus. Premium features unlocked including offline lessons, no ads, and unlimited hearts.",
            features: ["Premium Unlocked", "Offline Lessons", "No Ads", "Unlimited Hearts"],
            icon: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
            image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
            downloadUrl: "https://drive.google.com/file/d/example2",
            rating: 4.7,
            downloads: "15M+",
            size: "75MB",
            updated: "2024-01-26",
            seo: {
                title: "Duolingo Plus - Premium Language Learning",
                description: "Learn languages with premium features unlocked",
                keywords: "duolingo, language learning, education",
                slug: "duolingo-plus-premium"
            }
        }
    ];
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (menuToggle && navMenu) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
                
                // Update active navigation link
                updateActiveNavLink(this.getAttribute('href'));
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', throttle(updateNavOnScroll, 100));
}

function updateActiveNavLink(targetHref) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`a[href="${targetHref}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top - headerHeight;
        const sectionBottom = rect.bottom - headerHeight;
        
        if (sectionTop <= 100 && sectionBottom >= 100) {
            updateActiveNavLink(`#${section.id}`);
        }
    });
}

// Search functionality
function initializeSearch() {
    if (searchBtn && searchOverlay && searchInput && searchClose) {
        searchBtn.addEventListener('click', function() {
            searchOverlay.style.display = 'block';
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        });

        searchClose.addEventListener('click', function() {
            searchOverlay.style.display = 'none';
            searchInput.value = '';
            searchResults.innerHTML = '';
        });

        searchInput.addEventListener('input', debounce(performSearch, 300));

        // Close search on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.style.display === 'block') {
                searchClose.click();
            }
        });
    }
}

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }

    const filteredApps = appsData.filter(app => 
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query) ||
        (app.features && app.features.some(feature => feature.toLowerCase().includes(query))) ||
        (app.seo && app.seo.keywords && app.seo.keywords.toLowerCase().includes(query))
    );

    renderSearchResults(filteredApps);
}

function renderSearchResults(apps) {
    if (apps.length === 0) {
        searchResults.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                <p>No apps found matching your search.</p>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = apps.slice(0, 5).map(app => `
        <div class="search-result-item" onclick="openAppDetail(${app.id})">
            <img src="${app.icon}" alt="${app.name}" class="search-result-icon" loading="lazy">
            <div class="search-result-info">
                <h4>${app.name}</h4>
                <p>${app.description.substring(0, 60)}...</p>
            </div>
        </div>
    `).join('');
}

// Modal functionality
function initializeModals() {
    // Tutorial modal
    if (tutorialBtn && tutorialModal && modalClose) {
        tutorialBtn.addEventListener('click', function() {
            tutorialModal.style.display = 'block';
        });

        modalClose.addEventListener('click', function() {
            tutorialModal.style.display = 'none';
        });
    }

    // App detail modal
    if (appDetailClose) {
        appDetailClose.addEventListener('click', function() {
            appDetailModal.style.display = 'none';
        });
    }

    // Close modals on outside click
    window.addEventListener('click', function(e) {
        if (e.target === tutorialModal) {
            tutorialModal.style.display = 'none';
        }
        if (e.target === appDetailModal) {
            appDetailModal.style.display = 'none';
        }
        if (e.target === searchOverlay) {
            searchOverlay.style.display = 'none';
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });
}

// Filter functionality
function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update current filter
            currentFilter = this.getAttribute('data-filter');
            currentPage = 1;
            
            // Re-render apps
            renderApps();
        });
    });
}

// Stats counter animation
function initializeStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    
                    if (target >= 1000000) {
                        stat.textContent = (current / 1000000).toFixed(1) + 'M';
                    } else if (target >= 1000) {
                        stat.textContent = (current / 1000).toFixed(0) + 'K';
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                    
                    requestAnimationFrame(updateCounter);
                }
            };
            
            updateCounter();
        });
    };

    // Trigger animation when stats section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Apps rendering
function renderApps() {
    if (!appsGrid) return;
    
    const filteredApps = getFilteredApps();
    const appsToShow = filteredApps.slice(0, currentPage * appsPerPage);
    
    appsGrid.innerHTML = appsToShow.map(app => createAppCard(app)).join('');
    
    // Update load more button
    if (loadMoreBtn) {
        const totalPages = Math.ceil(filteredApps.length / appsPerPage);
        if (currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
        
        // Add load more functionality
        loadMoreBtn.onclick = function() {
            if (!isLoading && currentPage < totalPages) {
                isLoading = true;
                currentPage++;
                
                // Show loading state
                this.innerHTML = `
                    <span>Loading...</span>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="animate-spin">
                        <circle cx="12" cy="12" r="10" stroke-dasharray="8 4"></circle>
                    </svg>
                `;
                
                setTimeout(() => {
                    renderApps();
                    isLoading = false;
                    this.innerHTML = `
                        <span>Load More</span>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    `;
                }, 500);
            }
        };
    }
}

function renderEducationApps() {
    if (!educationGrid) return;
    
    const educationApps = appsData.filter(app => app.category === 'education').slice(0, 6);
    educationGrid.innerHTML = educationApps.map(app => createAppCard(app)).join('');
}

function getFilteredApps() {
    if (currentFilter === 'all') {
        return appsData;
    }
    return appsData.filter(app => app.category === currentFilter);
}

function createAppCard(app) {
    const stars = createStarRating(app.rating);
    
    return `
        <div class="app-card fade-in" data-app-id="${app.id}">
            <img src="${app.image}" alt="${app.name}" class="app-image" loading="lazy">
            <div class="app-content">
                <div class="app-header">
                    <img src="${app.icon}" alt="${app.name}" class="app-icon" loading="lazy">
                    <div class="app-info">
                        <h3>${app.name}</h3>
                        <div class="app-version">v${app.version}</div>
                    </div>
                </div>
                
                <p class="app-description">${app.description}</p>
                
                <div class="app-features">
                    ${app.features ? app.features.slice(0, 3).map(feature => `<span class="feature-tag">${feature}</span>`).join('') : ''}
                </div>
                
                <div class="app-stats">
                    <div class="app-rating">
                        ${stars}
                        <span>${app.rating}</span>
                    </div>
                    <div class="app-downloads">${app.downloads}</div>
                    <div class="app-size">${app.size}</div>
                </div>
                
                <div class="app-actions">
                    <a href="${app.downloadUrl}" target="_blank" class="btn-download" onclick="trackDownload('${app.name}')">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
                        </svg>
                        <span>Download</span>
                    </a>
                    <button class="btn-details" onclick="openAppDetail(${app.id})">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                        </svg>
                        <span>Details</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '<span class="star">☆</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star" style="opacity: 0.3;">☆</span>';
    }
    
    return stars;
}

// App detail modal
function openAppDetail(appId) {
    const app = appsData.find(a => a.id === appId);
    if (!app || !appDetailContent) return;
    
    appDetailContent.innerHTML = `
        <div class="app-detail-left">
            <div class="app-detail-header">
                <img src="${app.icon}" alt="${app.name}" class="app-detail-icon" loading="lazy">
                <div>
                    <h2 class="app-detail-title">${app.name}</h2>
                    <div class="app-detail-meta">
                        <div>Version: ${app.version}</div>
                        <div>Category: ${getCategoryDisplayName(app.category)}</div>
                        <div>Updated: ${app.updated}</div>
                    </div>
                </div>
            </div>
            
            <div class="app-detail-description">
                <p>${app.longDescription || app.description}</p>
            </div>
            
            <div class="app-detail-features">
                <h4>Features</h4>
                <div class="feature-list">
                    ${app.features ? app.features.map(feature => `
                        <div class="feature-list-item">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                            <span>${feature}</span>
                        </div>
                    `).join('') : '<p>No features listed.</p>'}
                </div>
            </div>
            
            <div class="app-detail-actions">
                <a href="${app.downloadUrl}" target="_blank" class="btn-download" onclick="trackDownload('${app.name}')">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
                    </svg>
                    <span>Download Now</span>
                </a>
            </div>
        </div>
        
        <div class="app-detail-right">
            <img src="${app.image}" alt="${app.name}" class="app-detail-image" loading="lazy">
            
            <div class="app-detail-stats">
                <div class="stat-item">
                    <div class="stat-value">${app.rating}</div>
                    <div class="stat-name">Rating</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${app.downloads}</div>
                    <div class="stat-name">Downloads</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${app.size}</div>
                    <div class="stat-name">Size</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${getCategoryDisplayName(app.category)}</div>
                    <div class="stat-name">Category</div>
                </div>
            </div>
        </div>
    `;
    
    appDetailModal.style.display = 'block';
    
    // Close search overlay if open
    if (searchOverlay && searchOverlay.style.display === 'block') {
        searchOverlay.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
}

function getCategoryDisplayName(categoryName) {
    const category = categoriesData.find(cat => cat.name === categoryName);
    return category ? category.displayName : categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
}

// Intersection Observer for animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.app-card, .stat-card, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function trackDownload(appName) {
    // Analytics tracking (replace with your analytics code)
    console.log(`Download tracked: ${appName}`);
    
    // You can add Google Analytics or other tracking here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'engagement',
            'event_label': appName
        });
    }
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for search
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Service Worker Registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Performance optimization: Lazy load images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Make functions globally accessible
window.openAppDetail = openAppDetail;
window.scrollToSection = scrollToSection;
window.trackDownload = trackDownload;