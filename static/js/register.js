/**
 * MediPulse HMS - Register Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username');
      const email = document.getElementById('email');
      const role = document.getElementById('role');
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirmPassword');
      const termsCheck = document.getElementById('termsCheck');

      let isValid = true;

      if (!username.value.trim()) { username.classList.add('is-invalid'); isValid = false; }
      else { username.classList.remove('is-invalid'); }

      if (!email.value.trim() || !email.value.includes('@')) { email.classList.add('is-invalid'); isValid = false; }
      else { email.classList.remove('is-invalid'); }

      if (!role.value) { role.classList.add('is-invalid'); isValid = false; }
      else { role.classList.remove('is-invalid'); }

      if (!password.value || password.value.length < 6) { password.classList.add('is-invalid'); isValid = false; }
      else { password.classList.remove('is-invalid'); }

      if (password.value !== confirmPassword.value) { confirmPassword.classList.add('is-invalid'); isValid = false; }
      else { confirmPassword.classList.remove('is-invalid'); }

      if (!termsCheck.checked) { termsCheck.classList.add('is-invalid'); isValid = false; }
      else { termsCheck.classList.remove('is-invalid'); }

      if (!isValid) return;

      const submitBtn = document.getElementById('registerSubmitBtn');
      const spinner = document.getElementById('registerSpinner');

      submitBtn.disabled = true;
      spinner.classList.remove('d-none');

      try {
        const payload = {
          username: username.value.trim(),
          email: email.value.trim(),
          role: role.value,
          password: password.value
        };

        const response = await apiRequest('/api/users/register', 'POST', payload);

        showToast('Registration successful! Please sign in with your credentials.', 'success');

        setTimeout(() => {
          window.location.href = '/resources/templates/login.html';
        }, 1200);

      } catch (err) {
        showToast(err.message || 'Registration failed. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
      }
    });
  }
});
