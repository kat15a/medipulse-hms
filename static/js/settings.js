/**
 * MediPulse HMS - Settings Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('pageHeadingTitle');
  const subtitle = document.getElementById('pageHeadingSubtitle');
  if (title) title.textContent = 'System & User Settings';
  if (subtitle) subtitle.textContent = 'Configure theme preferences, Spring Boot REST endpoint & alert rules';

  const savedTheme = localStorage.getItem('medipulse_theme') || 'light';
  updateThemeButtons(savedTheme);

  const apiInput = document.getElementById('apiBaseInput');
  if (apiInput) {
    const saved = localStorage.getItem('medipulse_api_base');
    apiInput.value = (saved && !saved.includes('localhost:8080')) ? saved : (window.location.origin || '');
  }
});

function setThemePreference(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem('medipulse_theme', theme);
  updateThemeButtons(theme);
  showToast(`Switched to ${theme} theme mode!`, 'info');
}

function updateThemeButtons(theme) {
  const lightBtn = document.getElementById('themeLightBtn');
  const darkBtn = document.getElementById('themeDarkBtn');

  if (lightBtn && darkBtn) {
    lightBtn.classList.toggle('active', theme === 'light');
    darkBtn.classList.toggle('active', theme === 'dark');
  }
}

function saveApiConfig() {
  const input = document.getElementById('apiBaseInput');
  if (input && input.value.trim()) {
    localStorage.setItem('medipulse_api_base', input.value.trim());
    showToast(`Spring Boot API URL updated to ${input.value.trim()}`, 'success');
  }
}
