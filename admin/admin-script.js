// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.data = {
            settings: {},
            categories: [],
            navigation: [],
            apps: [],
            stats: {},
            footer: {}
        };
        this.currentEditingApp = null;
        this.currentEditingMenu = null;
        this.currentEditingCategory = null;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.initializeEventListeners();
        this.checkAuthentication();
    }

    // Authentication
    checkAuthentication() {
        const isAuthenticated = localStorage.getItem('admin_authenticated');
        if (isAuthenticated === 'true') {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        this.updateDashboard();
    }

    login(username, password) {
        // Simple authentication (in production, use proper authentication)
        if (username === 'admin' && password === 'modmaster2024') {
            localStorage.setItem('admin_authenticated', 'true');
            this.showDashboard();
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Invalid credentials!', 'error');
        }
    }

    logout() {
        localStorage.removeItem('admin_authenticated');
        this.showLogin();
        this.showNotification('Logged out successfully!', 'success');
    }

    // Data Management
    async loadData() {
        try {
            const response = await fetch('../data.json');
            if (response.ok) {
                this.data = await response.json();
            } else {
                this.data = this.getDefaultData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            settings: {
                siteName: "MODMASTER",
                siteDescription: "Download Premium Mod APKs for Free",
                primaryColor: "#00f3ff",
                secondaryColor: "#b829ff",
                accentColor: "#39ff14",
                tutorialVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                contactEmail: "ishant150407@gmail.com",
                officialWebsite: "https://ishant.shop",
                blogWebsite: "https://blogs.ishant.shop"
            },
            categories: [
                { id: 1, name: "apps", displayName: "Apps", description: "Mobile applications", icon: "📱", active: true },
                { id: 2, name: "games", displayName: "Games", description: "Mobile games", icon: "🎮", active: true },
                { id: 3, name: "tools", displayName: "Tools", description: "Utility tools", icon: "🛠️", active: true },
                { id: 4, name: "education", displayName: "Education", description: "Educational apps", icon: "📚", active: true }
            ],
            navigation: [
                { name: "Home", href: "#home", active: true },
                { name: "Apps", href: "#apps", active: false },
                { name: "Games", href: "#games", active: false },
                { name: "Education", href: "#education", active: false },
                { name: "Contact", href: "#contact", active: false },
                { name: "About", href: "#about", active: false }
            ],
            apps: [],
            stats: {
                totalApps: 0,
                totalDownloads: 1000000,
                happyUsers: 50000,
                uptime: 99
            },
            footer: {
                copyright: "© 2024 MODMASTER - Created by Ishant Webworks. All rights reserved.",
                quickLinks: [],
                officialLinks: [],
                legalLinks: []
            }
        };
    }

    saveData() {
        // In a real application, this would save to a server
        // For now, we'll simulate saving and provide download functionality
        const dataStr = JSON.stringify(this.data, null, 2);
        localStorage.setItem('modmaster_data', dataStr);
        this.showNotification('Data saved successfully!', 'success');
    }

    // Event Listeners
    initializeEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            this.login(username, password);
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // Apps management
        document.getElementById('add-app-btn').addEventListener('click', () => {
            this.openAppModal();
        });

        document.getElementById('app-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveApp();
        });

        document.getElementById('cancel-app').addEventListener('click', () => {
            this.closeAppModal();
        });

        // Menu management
        document.getElementById('add-menu-item').addEventListener('click', () => {
            this.openMenuModal();
        });

        document.getElementById('menu-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMenuItem();
        });

        document.getElementById('cancel-menu').addEventListener('click', () => {
            this.closeMenuModal();
        });

        // Category management
        document.getElementById('add-category-btn').addEventListener('click', () => {
            this.openCategoryModal();
        });

        document.getElementById('category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });

        document.getElementById('cancel-category').addEventListener('click', () => {
            this.closeCategoryModal();
        });

        // Settings
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Export functionality
        document.getElementById('export-json').addEventListener('click', () => {
            this.exportJSON();
        });

        document.getElementById('export-csv').addEventListener('click', () => {
            this.exportCSV();
        });

        document.getElementById('create-backup').addEventListener('click', () => {
            this.createBackup();
        });

        // Import functionality
        document.getElementById('import-area').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // Drag and drop for import
        const importArea = document.getElementById('import-area');
        importArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            importArea.classList.add('dragover');
        });

        importArea.addEventListener('dragleave', () => {
            importArea.classList.remove('dragover');
        });

        importArea.addEventListener('drop', (e) => {
            e.preventDefault();
            importArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/json') {
                this.importData(file);
            }
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Notification close
        document.getElementById('notification-close').addEventListener('click', () => {
            this.hideNotification();
        });

        // Search and filter
        document.getElementById('search-apps').addEventListener('input', () => {
            this.filterApps();
        });

        document.getElementById('category-filter').addEventListener('change', () => {
            this.filterApps();
        });

        // Color inputs sync
        document.querySelectorAll('.color-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const textInput = e.target.parentNode.querySelector('.color-text');
                textInput.value = e.target.value;
            });
        });

        document.querySelectorAll('.color-text').forEach(input => {
            input.addEventListener('change', (e) => {
                const colorInput = e.target.parentNode.querySelector('.color-input');
                colorInput.value = e.target.value;
            });
        });

        // Auto-generate SEO slug
        document.getElementById('app-name').addEventListener('input', (e) => {
            const slug = this.generateSlug(e.target.value);
            document.getElementById('seo-slug').value = slug;
        });
    }

    // Tab Management
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Load tab-specific data
        switch (tabName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'apps':
                this.updateAppsTable();
                break;
            case 'settings':
                this.loadSettings();
                break;
            case 'menu':
                this.updateMenuList();
                break;
            case 'categories':
                this.updateCategoriesList();
                break;
        }
    }

    // Dashboard
    updateDashboard() {
        const totalApps = this.data.apps.length;
        const featuredApps = this.data.apps.filter(app => app.featured).length;
        const trendingApps = this.data.apps.filter(app => app.trending).length;
        const totalDownloads = this.data.stats.totalDownloads;

        document.getElementById('total-apps').textContent = totalApps;
        document.getElementById('featured-apps').textContent = featuredApps;
        document.getElementById('trending-apps').textContent = trendingApps;
        document.getElementById('total-downloads').textContent = this.formatNumber(totalDownloads);

        this.updateActivity();
    }

    updateActivity() {
        const activities = [
            { text: 'Dashboard accessed', time: 'Just now' },
            { text: `${this.data.apps.length} apps in database`, time: '1 minute ago' },
            { text: 'Settings updated', time: '5 minutes ago' },
            { text: 'New app added', time: '1 hour ago' },
            { text: 'Backup created', time: '2 hours ago' }
        ];

        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    // Apps Management
    updateAppsTable() {
        const tbody = document.getElementById('apps-table-body');
        tbody.innerHTML = this.data.apps.map(app => `
            <tr>
                <td>
                    <img src="${app.icon}" alt="${app.name}" class="app-icon-small" loading="lazy">
                </td>
                <td>${app.name}</td>
                <td>${app.version}</td>
                <td>${this.getCategoryDisplayName(app.category)}</td>
                <td>${app.rating}</td>
                <td>${app.downloads}</td>
                <td>
                    ${app.featured ? '<span class="status-badge status-featured">Featured</span>' : ''}
                    ${app.trending ? '<span class="status-badge status-trending">Trending</span>' : ''}
                    ${!app.featured && !app.trending ? '<span class="status-badge status-normal">Normal</span>' : ''}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="adminPanel.editApp(${app.id})">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-delete" onclick="adminPanel.deleteApp(${app.id})">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Update category filter options
        this.updateCategoryFilterOptions();
    }

    getCategoryDisplayName(categoryName) {
        const category = this.data.categories.find(cat => cat.name === categoryName);
        return category ? category.displayName : categoryName;
    }

    updateCategoryFilterOptions() {
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.innerHTML = `
            <option value="all">All Categories</option>
            ${this.data.categories.filter(cat => cat.active).map(category => 
                `<option value="${category.name}">${category.displayName}</option>`
            ).join('')}
        `;
    }

    filterApps() {
        const searchTerm = document.getElementById('search-apps').value.toLowerCase();
        const categoryFilter = document.getElementById('category-filter').value;
        
        let filteredApps = this.data.apps;
        
        if (searchTerm) {
            filteredApps = filteredApps.filter(app => 
                app.name.toLowerCase().includes(searchTerm) ||
                app.description.toLowerCase().includes(searchTerm)
            );
        }
        
        if (categoryFilter !== 'all') {
            filteredApps = filteredApps.filter(app => app.category === categoryFilter);
        }
        
        const tbody = document.getElementById('apps-table-body');
        tbody.innerHTML = filteredApps.map(app => `
            <tr>
                <td>
                    <img src="${app.icon}" alt="${app.name}" class="app-icon-small" loading="lazy">
                </td>
                <td>${app.name}</td>
                <td>${app.version}</td>
                <td>${this.getCategoryDisplayName(app.category)}</td>
                <td>${app.rating}</td>
                <td>${app.downloads}</td>
                <td>
                    ${app.featured ? '<span class="status-badge status-featured">Featured</span>' : ''}
                    ${app.trending ? '<span class="status-badge status-trending">Trending</span>' : ''}
                    ${!app.featured && !app.trending ? '<span class="status-badge status-normal">Normal</span>' : ''}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="adminPanel.editApp(${app.id})">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-delete" onclick="adminPanel.deleteApp(${app.id})">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    openAppModal(app = null) {
        this.currentEditingApp = app;
        const modal = document.getElementById('app-modal');
        const title = document.getElementById('modal-title');
        const saveText = document.getElementById('save-app-text');
        
        if (app) {
            title.textContent = 'Edit App';
            saveText.textContent = 'Update App';
            this.populateAppForm(app);
        } else {
            title.textContent = 'Add New App';
            saveText.textContent = 'Save App';
            this.clearAppForm();
        }
        
        this.populateAppCategoryOptions();
        modal.style.display = 'block';
    }

    closeAppModal() {
        document.getElementById('app-modal').style.display = 'none';
        this.currentEditingApp = null;
    }

    populateAppCategoryOptions() {
        const categorySelect = document.getElementById('app-category');
        categorySelect.innerHTML = `
            <option value="">Select Category</option>
            ${this.data.categories.filter(cat => cat.active).map(category => 
                `<option value="${category.name}">${category.displayName}</option>`
            ).join('')}
        `;
    }

    populateAppForm(app) {
        document.getElementById('app-name').value = app.name || '';
        document.getElementById('app-version').value = app.version || '';
        document.getElementById('app-category').value = app.category || '';
        document.getElementById('app-rating').value = app.rating || 4.0;
        document.getElementById('app-downloads').value = app.downloads || '';
        document.getElementById('app-size').value = app.size || '';
        document.getElementById('app-description').value = app.description || '';
        document.getElementById('app-long-description').value = app.longDescription || '';
        document.getElementById('app-features').value = app.features ? app.features.join('\n') : '';
        document.getElementById('app-icon').value = app.icon || '';
        document.getElementById('app-image').value = app.image || '';
        document.getElementById('app-download-url').value = app.downloadUrl || '';
        document.getElementById('app-requirements').value = app.requirements || '';
        document.getElementById('app-developer').value = app.developer || '';
        document.getElementById('app-tags').value = app.tags ? app.tags.join(', ') : '';
        document.getElementById('app-featured').checked = app.featured || false;
        document.getElementById('app-trending').checked = app.trending || false;

        // SEO fields
        if (app.seo) {
            document.getElementById('seo-title').value = app.seo.title || '';
            document.getElementById('seo-description').value = app.seo.description || '';
            document.getElementById('seo-keywords').value = app.seo.keywords || '';
            document.getElementById('seo-slug').value = app.seo.slug || '';
        }
    }

    clearAppForm() {
        document.getElementById('app-form').reset();
        document.getElementById('app-rating').value = 4.0;
        // Clear SEO fields
        document.getElementById('seo-title').value = '';
        document.getElementById('seo-description').value = '';
        document.getElementById('seo-keywords').value = '';
        document.getElementById('seo-slug').value = '';
    }

    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    saveApp() {
        const formData = {
            name: document.getElementById('app-name').value,
            version: document.getElementById('app-version').value,
            category: document.getElementById('app-category').value,
            rating: parseFloat(document.getElementById('app-rating').value),
            downloads: document.getElementById('app-downloads').value,
            size: document.getElementById('app-size').value,
            description: document.getElementById('app-description').value,
            longDescription: document.getElementById('app-long-description').value,
            features: document.getElementById('app-features').value.split('\n').filter(f => f.trim()),
            icon: document.getElementById('app-icon').value,
            image: document.getElementById('app-image').value,
            downloadUrl: document.getElementById('app-download-url').value,
            imageUrl: document.getElementById('app-image').value,
            requirements: document.getElementById('app-requirements').value,
            developer: document.getElementById('app-developer').value,
            tags: document.getElementById('app-tags').value.split(',').map(t => t.trim()).filter(t => t),
            featured: document.getElementById('app-featured').checked,
            trending: document.getElementById('app-trending').checked,
            updated: new Date().toISOString().split('T')[0],
            seo: {
                title: document.getElementById('seo-title').value,
                description: document.getElementById('seo-description').value,
                keywords: document.getElementById('seo-keywords').value,
                slug: document.getElementById('seo-slug').value
            }
        };

        if (this.currentEditingApp) {
            // Update existing app
            const index = this.data.apps.findIndex(app => app.id === this.currentEditingApp.id);
            if (index !== -1) {
                this.data.apps[index] = { ...this.currentEditingApp, ...formData };
                this.showNotification('App updated successfully!', 'success');
            }
        } else {
            // Add new app
            const newApp = {
                id: Date.now(),
                ...formData
            };
            this.data.apps.push(newApp);
            this.showNotification('App added successfully!', 'success');
        }

        this.saveData();
        this.updateAppsTable();
        this.closeAppModal();
    }

    editApp(id) {
        const app = this.data.apps.find(a => a.id === id);
        if (app) {
            this.openAppModal(app);
        }
    }

    deleteApp(id) {
        if (confirm('Are you sure you want to delete this app?')) {
            this.data.apps = this.data.apps.filter(app => app.id !== id);
            this.saveData();
            this.updateAppsTable();
            this.showNotification('App deleted successfully!', 'success');
        }
    }

    // Categories Management
    updateCategoriesList() {
        const categoriesList = document.getElementById('categories-list');
        categoriesList.innerHTML = this.data.categories.map((category, index) => `
            <div class="category-item">
                <div class="category-info">
                    <div class="category-icon">${category.icon}</div>
                    <div class="category-details">
                        <h3>${category.displayName}</h3>
                        <p>${category.description}</p>
                        <span class="category-status ${category.active ? 'active' : 'inactive'}">
                            ${category.active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="btn-edit" onclick="adminPanel.editCategory(${index})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteCategory(${index})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    openCategoryModal(category = null, index = null) {
        this.currentEditingCategory = { category, index };
        const modal = document.getElementById('category-modal');
        const title = document.getElementById('category-modal-title');
        const saveText = document.getElementById('save-category-text');
        
        if (category) {
            title.textContent = 'Edit Category';
            saveText.textContent = 'Update Category';
            document.getElementById('category-name').value = category.name;
            document.getElementById('category-display-name').value = category.displayName;
            document.getElementById('category-description').value = category.description;
            document.getElementById('category-icon').value = category.icon;
            document.getElementById('category-seo-title').value = category.seoTitle || '';
            document.getElementById('category-seo-description').value = category.seoDescription || '';
            document.getElementById('category-active').checked = category.active;
        } else {
            title.textContent = 'Add Category';
            saveText.textContent = 'Save Category';
            document.getElementById('category-form').reset();
            document.getElementById('category-active').checked = true;
        }
        
        modal.style.display = 'block';
    }

    closeCategoryModal() {
        document.getElementById('category-modal').style.display = 'none';
        this.currentEditingCategory = null;
    }

    saveCategory() {
        const name = document.getElementById('category-name').value;
        const displayName = document.getElementById('category-display-name').value;
        const description = document.getElementById('category-description').value;
        const icon = document.getElementById('category-icon').value;
        const seoTitle = document.getElementById('category-seo-title').value;
        const seoDescription = document.getElementById('category-seo-description').value;
        const active = document.getElementById('category-active').checked;
        
        const categoryData = { 
            name, 
            displayName, 
            description, 
            icon, 
            seoTitle, 
            seoDescription, 
            active 
        };
        
        if (this.currentEditingCategory && this.currentEditingCategory.category) {
            // Update existing category
            this.data.categories[this.currentEditingCategory.index] = {
                ...this.data.categories[this.currentEditingCategory.index],
                ...categoryData
            };
            this.showNotification('Category updated successfully!', 'success');
        } else {
            // Add new category
            const newCategory = {
                id: Date.now(),
                ...categoryData
            };
            this.data.categories.push(newCategory);
            this.showNotification('Category added successfully!', 'success');
        }
        
        this.saveData();
        this.updateCategoriesList();
        this.closeCategoryModal();
    }

    editCategory(index) {
        const category = this.data.categories[index];
        this.openCategoryModal(category, index);
    }

    deleteCategory(index) {
        const category = this.data.categories[index];
        const appsUsingCategory = this.data.apps.filter(app => app.category === category.name);
        
        if (appsUsingCategory.length > 0) {
            this.showNotification(`Cannot delete category. ${appsUsingCategory.length} apps are using this category.`, 'error');
            return;
        }
        
        if (confirm('Are you sure you want to delete this category?')) {
            this.data.categories.splice(index, 1);
            this.saveData();
            this.updateCategoriesList();
            this.showNotification('Category deleted successfully!', 'success');
        }
    }

    // Settings Management
    loadSettings() {
        const settings = this.data.settings;
        document.getElementById('site-name').value = settings.siteName || '';
        document.getElementById('site-description').value = settings.siteDescription || '';
        document.getElementById('contact-email').value = settings.contactEmail || '';
        document.getElementById('official-website').value = settings.officialWebsite || '';
        document.getElementById('primary-color').value = settings.primaryColor || '#00f3ff';
        document.getElementById('secondary-color').value = settings.secondaryColor || '#b829ff';
        document.getElementById('accent-color').value = settings.accentColor || '#39ff14';
        document.getElementById('tutorial-video').value = settings.tutorialVideoUrl || '';
        
        // Update color text inputs
        document.querySelector('#primary-color').parentNode.querySelector('.color-text').value = settings.primaryColor || '#00f3ff';
        document.querySelector('#secondary-color').parentNode.querySelector('.color-text').value = settings.secondaryColor || '#b829ff';
        document.querySelector('#accent-color').parentNode.querySelector('.color-text').value = settings.accentColor || '#39ff14';
    }

    saveSettings() {
        this.data.settings = {
            ...this.data.settings,
            siteName: document.getElementById('site-name').value,
            siteDescription: document.getElementById('site-description').value,
            contactEmail: document.getElementById('contact-email').value,
            officialWebsite: document.getElementById('official-website').value,
            primaryColor: document.getElementById('primary-color').value,
            secondaryColor: document.getElementById('secondary-color').value,
            accentColor: document.getElementById('accent-color').value,
            tutorialVideoUrl: document.getElementById('tutorial-video').value
        };

        this.saveData();
        this.showNotification('Settings saved successfully!', 'success');
    }

    // Menu Management
    updateMenuList() {
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = this.data.navigation.map((item, index) => `
            <div class="menu-item">
                <div class="menu-info">
                    <h3>${item.name}</h3>
                    <p>${item.href}</p>
                </div>
                <div class="menu-actions">
                    <button class="btn-edit" onclick="adminPanel.editMenuItem(${index})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteMenuItem(${index})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    openMenuModal(item = null, index = null) {
        this.currentEditingMenu = { item, index };
        const modal = document.getElementById('menu-modal');
        const title = document.getElementById('menu-modal-title');
        const saveText = document.getElementById('save-menu-text');
        
        if (item) {
            title.textContent = 'Edit Menu Item';
            saveText.textContent = 'Update Menu Item';
            document.getElementById('menu-name').value = item.name;
            document.getElementById('menu-href').value = item.href;
        } else {
            title.textContent = 'Add Menu Item';
            saveText.textContent = 'Save Menu Item';
            document.getElementById('menu-form').reset();
        }
        
        modal.style.display = 'block';
    }

    closeMenuModal() {
        document.getElementById('menu-modal').style.display = 'none';
        this.currentEditingMenu = null;
    }

    saveMenuItem() {
        const name = document.getElementById('menu-name').value;
        const href = document.getElementById('menu-href').value;
        
        const menuItem = { name, href, active: false };
        
        if (this.currentEditingMenu && this.currentEditingMenu.item) {
            // Update existing menu item
            this.data.navigation[this.currentEditingMenu.index] = {
                ...this.data.navigation[this.currentEditingMenu.index],
                ...menuItem
            };
            this.showNotification('Menu item updated successfully!', 'success');
        } else {
            // Add new menu item
            this.data.navigation.push(menuItem);
            this.showNotification('Menu item added successfully!', 'success');
        }
        
        this.saveData();
        this.updateMenuList();
        this.closeMenuModal();
    }

    editMenuItem(index) {
        const item = this.data.navigation[index];
        this.openMenuModal(item, index);
    }

    deleteMenuItem(index) {
        if (confirm('Are you sure you want to delete this menu item?')) {
            this.data.navigation.splice(index, 1);
            this.saveData();
            this.updateMenuList();
            this.showNotification('Menu item deleted successfully!', 'success');
        }
    }

    // Export/Import Functions
    exportJSON() {
        const dataStr = JSON.stringify(this.data, null, 2);
        this.downloadFile(dataStr, 'modmaster-data.json', 'application/json');
        this.showNotification('JSON data exported successfully!', 'success');
    }

    exportCSV() {
        const csvData = this.convertAppsToCSV();
        this.downloadFile(csvData, 'modmaster-apps.csv', 'text/csv');
        this.showNotification('CSV data exported successfully!', 'success');
    }

    convertAppsToCSV() {
        const headers = ['ID', 'Name', 'Version', 'Category', 'Rating', 'Downloads', 'Size', 'Featured', 'Trending', 'SEO Title', 'SEO Description'];
        const rows = this.data.apps.map(app => [
            app.id,
            app.name,
            app.version,
            app.category,
            app.rating,
            app.downloads,
            app.size,
            app.featured ? 'Yes' : 'No',
            app.trending ? 'Yes' : 'No',
            app.seo?.title || '',
            app.seo?.description || ''
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupData = {
            ...this.data,
            backup: {
                created: new Date().toISOString(),
                version: '1.0.0'
            }
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        this.downloadFile(dataStr, `modmaster-backup-${timestamp}.json`, 'application/json');
        this.showNotification('Backup created successfully!', 'success');
    }

    importData(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (this.validateImportData(importedData)) {
                    this.data = importedData;
                    this.saveData();
                    this.updateDashboard();
                    this.updateAppsTable();
                    this.updateMenuList();
                    this.updateCategoriesList();
                    this.loadSettings();
                    this.showNotification('Data imported successfully!', 'success');
                } else {
                    this.showNotification('Invalid data format!', 'error');
                }
            } catch (error) {
                this.showNotification('Error parsing JSON file!', 'error');
            }
        };
        
        reader.readAsText(file);
    }

    validateImportData(data) {
        return data && 
               typeof data === 'object' &&
               data.settings &&
               Array.isArray(data.navigation) &&
               Array.isArray(data.apps) &&
               Array.isArray(data.categories);
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Utility Functions
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notification-message');
        
        messageEl.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        notification.classList.remove('show');
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();

// Make adminPanel globally accessible for onclick handlers
window.adminPanel = adminPanel;