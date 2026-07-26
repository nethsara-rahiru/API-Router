// app.js - Main Application Framework & Utilities

const App = {
  state: {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    currentRoute: 'dashboard'
  },

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.checkAuth();
  },

  cacheDOM() {
    this.authView = document.getElementById('auth-view');
    this.dashboardLayout = document.getElementById('dashboard-layout');
    this.contentArea = document.getElementById('content-area');
    this.sidebarUsername = document.getElementById('sidebar-username');
    this.sidebarRole = document.getElementById('sidebar-role');
    this.userAvatarText = document.getElementById('user-avatar-text');
    this.navLinks = document.querySelectorAll('.nav-links a');
    this.logoutBtn = document.getElementById('logout-btn');
    
    this.modalOverlay = document.getElementById('modal-overlay');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.getElementById('modal-body');
    this.modalClose = document.getElementById('modal-close');
    this.toastContainer = document.getElementById('toast-container');
  },

  bindEvents() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.closest('[data-route]');
        if (target) {
          const route = target.dataset.route;
          this.navigate(route);
        }
      });
    });

    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => this.logout());
    }

    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeModal());
    }
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) this.closeModal();
      });
    }
  },

  checkAuth() {
    if (this.state.token && this.state.user) {
      this.showDashboard();
    } else {
      this.showAuth();
    }
  },

  login(token, user) {
    this.state.token = token;
    this.state.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.showDashboard();
    this.toast('Signed in successfully', 'success');
  },

  logout() {
    this.state.token = null;
    this.state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.showAuth();
    this.toast('Signed out', 'info');
  },

  showAuth() {
    if (this.dashboardLayout) this.dashboardLayout.style.display = 'none';
    if (this.authView) this.authView.style.display = 'flex';
  },

  showDashboard() {
    if (this.authView) this.authView.style.display = 'none';
    if (this.dashboardLayout) this.dashboardLayout.style.display = 'flex';
    
    if (this.state.user) {
      if (this.sidebarUsername) this.sidebarUsername.textContent = this.state.user.name || 'User';
      if (this.sidebarRole) this.sidebarRole.textContent = this.state.user.role || 'developer';
      if (this.userAvatarText) this.userAvatarText.textContent = (this.state.user.name || 'U').charAt(0).toUpperCase();
    }
    
    this.navigate(this.state.currentRoute || 'dashboard');
  },

  navigate(route) {
    this.state.currentRoute = route;
    
    this.navLinks.forEach(l => {
      if (l.dataset.route === route) l.classList.add('active');
      else l.classList.remove('active');
    });

    this.contentArea.innerHTML = '';
    
    switch (route) {
      case 'dashboard':
        if (window.DashboardView) DashboardView.render(this.contentArea);
        break;
      case 'api-keys':
        if (window.ApiKeysView) ApiKeysView.render(this.contentArea);
        break;
      case 'providers':
        if (window.ProvidersView) ProvidersView.render(this.contentArea);
        break;
      case 'analytics':
        if (window.AnalyticsView) AnalyticsView.render(this.contentArea);
        break;
      case 'routing':
        if (window.RoutingView) RoutingView.render(this.contentArea);
        break;
      case 'docs':
        if (window.DocsView) DocsView.render(this.contentArea);
        break;
      default:
        this.contentArea.innerHTML = '<div class="panel glass"><p>Page not found</p></div>';
    }
  },

  async api(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (this.state.token) {
      headers['Authorization'] = `Bearer ${this.state.token}`;
    }

    try {
      const response = await fetch(`/v1${endpoint}`, { ...options, headers });
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.error || 'API Request Failed');
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  showModal(title, bodyHtml) {
    if (this.modalTitle) this.modalTitle.textContent = title;
    if (this.modalBody) this.modalBody.innerHTML = bodyHtml;
    if (this.modalOverlay) this.modalOverlay.style.display = 'flex';
  },

  closeModal() {
    if (this.modalOverlay) this.modalOverlay.style.display = 'none';
    if (this.modalBody) this.modalBody.innerHTML = '';
  },

  toast(message, type = 'info') {
    if (!this.toastContainer) return;
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    this.toastContainer.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      setTimeout(() => el.remove(), 300);
    }, 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
