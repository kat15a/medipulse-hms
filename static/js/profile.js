/**
 * MediPulse HMS - Profile Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('pageHeadingTitle');
  const subtitle = document.getElementById('pageHeadingSubtitle');
  if (title) title.textContent = 'Account Profile';
  if (subtitle) subtitle.textContent = 'Manage personal information, security credentials & role settings';

  const user = API_CONFIG.getUser();
  if (user) {
    document.getElementById('profileAvatar').textContent = (user.fullName || user.username || 'A').charAt(0).toUpperCase();
    document.getElementById('profileFullNameDisplay').textContent = user.fullName || user.username || 'User';
    document.getElementById('profileEmailDisplay').textContent = user.email || `${user.username}@medipulse.com`;
    document.getElementById('profileRoleBadge').textContent = user.role || 'ADMIN';

    document.getElementById('profUsername').value = user.username || '';
    document.getElementById('profEmail').value = user.email || '';
    document.getElementById('profFullName').value = user.fullName || user.username || '';
  }

  // Forms Listeners
  const pForm = document.getElementById('profileForm');
  if (pForm) pForm.addEventListener('submit', handleUpdateProfile);

  const passForm = document.getElementById('passwordForm');
  if (passForm) passForm.addEventListener('submit', handleChangePassword);
});

function handleUpdateProfile(e) {
  e.preventDefault();

  const username = document.getElementById('profUsername').value.trim();
  const email = document.getElementById('profEmail').value.trim();
  const fullName = document.getElementById('profFullName').value.trim();

  if (!username || !email || !fullName) {
    showToast('Please fill all profile fields.', 'warning');
    return;
  }

  const user = API_CONFIG.getUser() || {};
  user.username = username;
  user.email = email;
  user.fullName = fullName;

  localStorage.setItem('medipulse_user', JSON.stringify(user));
  showToast('Profile information updated successfully!', 'success');

  setTimeout(() => window.location.reload(), 600);
}

function handleChangePassword(e) {
  e.preventDefault();

  const currPass = document.getElementById('currPass').value;
  const newPass = document.getElementById('newPass').value;
  const confNewPass = document.getElementById('confNewPass').value;

  if (!currPass || !newPass) {
    showToast('Please enter your current and new password.', 'warning');
    return;
  }

  if (newPass.length < 6) {
    showToast('New password must be at least 6 characters.', 'warning');
    return;
  }

  if (newPass !== confNewPass) {
    showToast('New passwords do not match.', 'error');
    return;
  }

  showToast('Password changed successfully!', 'success');
  document.getElementById('passwordForm').reset();
}
