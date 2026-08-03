/**
 * MediPulse HMS - Auth Guard & Dynamic Navigation Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');
  const user = API_CONFIG.getUser();
  const token = API_CONFIG.getToken();

  // 1. Auth Protection Check
  if (!isAuthPage && !token) {
    window.location.href = '/resources/templates/login.html';
    return;
  }

  // 2. Initialize Saved Theme
  const savedTheme = localStorage.getItem('medipulse_theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // 3. Render Navigation Sidebar & Navbar if on app page
  if (!isAuthPage && user) {
    renderAppHeaderAndSidebar(user);
  }
});

function renderAppHeaderAndSidebar(user) {
  const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';

  // Render Sidebar
  const sidebarContainer = document.getElementById('appSidebar');
  if (sidebarContainer) {
    const role = user.role || 'ADMIN';

    // Role-based visible menu items
    const menuConfig = [
      { id: 'dashboard.html', label: 'Dashboard', icon: 'bi-grid-1x2-fill', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
      { id: 'patients.html', label: 'Patients', icon: 'bi-people-fill', roles: ['ADMIN', 'DOCTOR'] },
      { id: 'doctors.html', label: 'Doctors', icon: 'bi-person-badge-fill', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
      { id: 'appointments.html', label: 'Appointments', icon: 'bi-calendar2-check-fill', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
      { id: 'prescriptions.html', label: 'Prescriptions', icon: 'bi-capsule-pill', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
      { id: 'billing.html', label: 'Billing & Payments', icon: 'bi-receipt-cutoff', roles: ['ADMIN', 'PATIENT'] },
      { id: 'medical-records.html', label: 'Medical Records', icon: 'bi-journal-medical', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
      { id: 'ai.html', label: 'AI Health Assistant', icon: 'bi-stars', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] }
    ];

    const systemConfig = [
      { id: 'profile.html', label: 'My Profile', icon: 'bi-person-circle', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
      { id: 'settings.html', label: 'Settings', icon: 'bi-gear-fill', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] }
    ];

    sidebarContainer.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-brand-icon">
          <i class="bi bi-hospital"></i>
        </div>
        <h2 class="sidebar-brand-title">Medi<span>Pulse</span></h2>
      </div>

      <div class="sidebar-menu">
        <div class="sidebar-section-label">Main Menu</div>
        ${menuConfig
          .filter(item => item.roles.includes(role))
          .map(item => `
            <a href="/resources/templates/${item.id}" class="sidebar-link ${currentPath === item.id ? 'active' : ''}">
              <i class="bi ${item.icon}"></i>
              <span>${item.label}</span>
            </a>
          `).join('')}

        <div class="sidebar-section-label mt-3">Account & System</div>
        ${systemConfig
          .filter(item => item.roles.includes(role))
          .map(item => `
            <a href="/resources/templates/${item.id}" class="sidebar-link ${currentPath === item.id ? 'active' : ''}">
              <i class="bi ${item.icon}"></i>
              <span>${item.label}</span>
            </a>
          `).join('')}
      </div>

      <div class="sidebar-footer">
        <div class="user-badge">
          <div class="user-avatar">${(user.fullName || user.username || 'U').charAt(0).toUpperCase()}</div>
          <div class="user-info">
            <div class="user-name">${user.fullName || user.username || 'User'}</div>
            <span class="user-role-badge role-${(user.role || 'admin').toLowerCase()}">${user.role || 'ADMIN'}</span>
          </div>
          <button class="btn btn-sm text-danger p-0 ms-1" onclick="handleLogout(event)" title="Logout">
            <i class="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </div>
    `;
  }

  // Render Navbar
  const headerContainer = document.getElementById('appHeader');
  if (headerContainer) {
    headerContainer.innerHTML = `
      <div class="header-left">
        <button class="mobile-toggle" onclick="toggleSidebar()">
          <i class="bi bi-list"></i>
        </button>
        <div class="page-title-wrap">
          <h1 id="pageHeadingTitle">MediPulse HMS</h1>
          <p id="pageHeadingSubtitle">Healthcare Management System</p>
        </div>
      </div>

      <div class="header-right">
        <!-- Quick AI Shortcut Button -->
        <a href="/resources/templates/ai.html" class="btn btn-sm btn-outline-primary rounded-pill d-none d-md-flex align-items-center gap-2 font-medium">
          <i class="bi bi-magic text-primary"></i>
          <span>AI Health Tools</span>
        </a>

        <!-- Dark Mode Toggle Button -->
        <button class="icon-btn" onclick="toggleDarkMode()" id="themeToggleBtn" title="Toggle Dark/Light Mode">
          <i class="bi bi-moon-stars-fill"></i>
        </button>

        <!-- Notification Bell -->
        <div class="dropdown">
          <button class="icon-btn" data-bs-toggle="dropdown" aria-expanded="false" title="Notifications">
            <i class="bi bi-bell-fill"></i>
            <span class="badge-dot"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 p-2" style="width: 320px; border-radius: 12px;">
            <li class="dropdown-header font-bold text-dark dark:text-light fs-6">Notifications</li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a class="dropdown-item py-2 rounded d-flex gap-2 align-items-start" href="#">
                <i class="bi bi-calendar-event text-primary fs-5 mt-1"></i>
                <div>
                  <div class="fw-semibold fs-7">New Appointment Booked</div>
                  <div class="text-muted small">Eleanor Vance with Dr. Arthur</div>
                  <div class="text-muted extra-small">10 minutes ago</div>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item py-2 rounded d-flex gap-2 align-items-start" href="#">
                <i class="bi bi-file-earmark-medical text-success fs-5 mt-1"></i>
                <div>
                  <div class="fw-semibold fs-7">Lab Results Uploaded</div>
                  <div class="text-muted small">Blood CBC Test for Robert S.</div>
                  <div class="text-muted extra-small">1 hour ago</div>
                </div>
              </a>
            </li>
          </ul>
        </div>

        <!-- User Profile Dropdown -->
        <div class="dropdown">
          <button class="btn p-0 d-flex align-items-center gap-2 border-0" data-bs-toggle="dropdown">
            <div class="user-avatar" style="width:36px; height:36px;">
              ${(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
            </div>
            <i class="bi bi-chevron-down text-muted small"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 p-2" style="border-radius: 12px;">
            <li class="px-3 py-2 border-bottom">
              <div class="fw-bold">${user.fullName || user.username}</div>
              <div class="text-muted small">${user.email || 'user@medipulse.com'}</div>
            </li>
            <li><a class="dropdown-item rounded my-1" href="/resources/templates/profile.html"><i class="bi bi-person me-2"></i>My Profile</a></li>
            <li><a class="dropdown-item rounded my-1" href="/resources/templates/settings.html"><i class="bi bi-gear me-2"></i>Settings</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item rounded text-danger" href="javascript:void(0)" onclick="handleLogout(event)"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
          </ul>
        </div>
      </div>
    `;
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) {
    sidebar.classList.toggle('show');
  }
}

function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', newTheme);
  localStorage.setItem('medipulse_theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun-fill text-warning"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
  }
}

function handleLogout(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }

  API_CONFIG.clearSession();

  if (window.FirebaseService && window.FirebaseService.auth) {
    try {
      window.FirebaseService.auth.signOut();
    } catch (err) {
      console.warn('Firebase signOut notice:', err);
    }
  }

  if (typeof showToast === 'function') {
    showToast('Logged out successfully', 'info');
  }

  setTimeout(() => {
    window.location.href = '/resources/templates/login.html';
  }, 250);
}

window.handleLogout = handleLogout;
window.toggleSidebar = toggleSidebar;
window.toggleDarkMode = toggleDarkMode;
