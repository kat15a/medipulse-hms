/**
 * MediPulse HMS - Login Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to dashboard
  if (API_CONFIG.getToken()) {
    window.location.href = '/resources/templates/dashboard.html';
    return;
  }

  // Check query params for session expiry message
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('expired')) {
    showToast('Your session has expired. Please log in again.', 'warning');
  }

  // Password toggle
  const toggleBtn = document.getElementById('togglePasswordBtn');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('passwordEyeIcon');

  if (toggleBtn && passwordInput && eyeIcon) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      eyeIcon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
    });
  }

  // Login Form Submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      
      // Bootstrap validation state
      let isValid = true;
      if (!usernameInput.value.trim()) {
        usernameInput.classList.add('is-invalid');
        isValid = false;
      } else {
        usernameInput.classList.remove('is-invalid');
      }

      if (!passwordInput.value.trim()) {
        passwordInput.classList.add('is-invalid');
        isValid = false;
      } else {
        passwordInput.classList.remove('is-invalid');
      }

      if (!isValid) return;

      const submitBtn = document.getElementById('loginSubmitBtn');
      const spinner = document.getElementById('loginSpinner');

      // Loading state
      submitBtn.disabled = true;
      spinner.classList.remove('d-none');

      try {
        const payload = {
          username: usernameInput.value.trim(),
          email: usernameInput.value.trim(),
          password: passwordInput.value
        };

        const response = await apiRequest('/api/users/login', 'POST', payload);

        showToast(`Welcome back, ${response.fullName || response.username}!`, 'success');

        setTimeout(() => {
          window.location.href = '/resources/templates/dashboard.html';
        }, 600);

      } catch (err) {
        showToast(err.message || 'Login failed. Please check credentials.', 'error');
      } finally {
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
      }
    });
  }
});

function fillDemo(email) {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  if (usernameInput && passwordInput) {
    usernameInput.value = email;
    passwordInput.value = 'password123';
    showToast(`Demo account auto-filled (${email})`, 'info');
  }
}

function handleResetPassword() {
  const emailInput = document.getElementById('resetEmail');
  if (!emailInput.value.trim()) {
    showToast('Please enter a valid email address.', 'warning');
    return;
  }
  showToast(`Password reset link sent to ${emailInput.value.trim()}!`, 'success');
  const modalEl = document.getElementById('forgotPasswordModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}
