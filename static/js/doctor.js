/**
 * MediPulse HMS - Doctor Management Controller
 */

let doctorsList = [];
let currentViewMode = 'cards';

document.addEventListener('DOMContentLoaded', async () => {
  const title = document.getElementById('pageHeadingTitle');
  const subtitle = document.getElementById('pageHeadingSubtitle');
  if (title) title.textContent = 'Doctor Directory & Specialists';
  if (subtitle) subtitle.textContent = 'Manage medical staff, consultation fees, ratings & departments';

  await loadDoctors();

  const searchInput = document.getElementById('doctorSearchInput');
  const specFilter = document.getElementById('specializationFilter');

  if (searchInput) searchInput.addEventListener('input', renderDoctors);
  if (specFilter) specFilter.addEventListener('change', renderDoctors);

  const form = document.getElementById('doctorForm');
  if (form) form.addEventListener('submit', handleSaveDoctor);
});

async function loadDoctors() {
  try {
    doctorsList = await apiRequest('/api/doctors');
    renderDoctors();
  } catch (err) {
    showToast('Failed to fetch doctor records.', 'error');
  }
}

function setViewMode(mode) {
  currentViewMode = mode;
  document.getElementById('btnViewCards').classList.toggle('active', mode === 'cards');
  document.getElementById('btnViewTable').classList.toggle('active', mode === 'table');

  const cardContainer = document.getElementById('doctorsCardContainer');
  const tableContainer = document.getElementById('doctorsTableContainer');

  if (mode === 'cards') {
    cardContainer.classList.remove('d-none');
    tableContainer.classList.add('d-none');
  } else {
    cardContainer.classList.add('d-none');
    tableContainer.classList.remove('d-none');
  }
  renderDoctors();
}

function renderDoctors() {
  const search = document.getElementById('doctorSearchInput')?.value.toLowerCase() || '';
  const spec = document.getElementById('specializationFilter')?.value || '';

  const filtered = doctorsList.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search) || d.specialization.toLowerCase().includes(search);
    const matchesSpec = spec === '' || d.specialization === spec;
    return matchesSearch && matchesSpec;
  });

  if (currentViewMode === 'cards') {
    const container = document.getElementById('doctorsCardContainer');
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="col-12 text-center py-5 text-muted">No doctor records found.</div>`;
      return;
    }

    container.innerHTML = filtered.map(d => `
      <div class="col-md-6 col-lg-4">
        <div class="card-custom h-100 position-relative p-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="user-avatar" style="width: 56px; height: 56px; font-size: 1.3rem; background: linear-gradient(135deg, #10b981, #059669);">
              ${d.name.replace('Dr. ', '').charAt(0).toUpperCase()}
            </div>
            <div>
              <h5 class="fw-bold mb-0">${d.name}</h5>
              <span class="badge bg-primary-subtle text-primary fw-semibold">${d.specialization}</span>
            </div>
          </div>

          <div class="space-y-2 text-muted small mb-4">
            <div class="d-flex justify-content-between"><span class="text-muted">Experience:</span> <span class="fw-bold">${d.experience}</span></div>
            <div class="d-flex justify-content-between"><span class="text-muted">Consultation Fee:</span> <span class="fw-bold text-success">₹${d.fee}</span></div>
            <div class="d-flex justify-content-between"><span class="text-muted">Rating:</span> <span class="fw-bold text-warning"><i class="bi bi-star-fill me-1"></i>${d.rating || 4.9} / 5.0</span></div>
            <div class="d-flex justify-content-between"><span class="text-muted">Phone:</span> <span>${d.phone}</span></div>
            <div class="d-flex justify-content-between"><span class="text-muted">Email:</span> <span>${d.email}</span></div>
          </div>

          <div class="d-flex gap-2 pt-3 border-top mt-auto">
            <a href="/resources/templates/appointments.html?doc=${encodeURIComponent(d.name)}" class="btn btn-sm btn-primary flex-grow-1 rounded-3 fw-semibold">Book Appointment</a>
            <button class="btn btn-sm btn-outline-primary rounded-3" onclick="openEditDoctorModal('${d.id}')"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger rounded-3" onclick="deleteDoctor('${d.id}')"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    const tbody = document.getElementById('doctorsTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No doctors found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(d => `
      <tr>
        <td class="fw-bold">${d.name}</td>
        <td><span class="badge bg-primary-subtle text-primary">${d.specialization}</span></td>
        <td>${d.experience}</td>
        <td class="fw-bold text-success">₹${d.fee}</td>
        <td>${d.phone}</td>
        <td>${d.email}</td>
        <td class="text-end">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary" onclick="openEditDoctorModal('${d.id}')"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger" onclick="deleteDoctor('${d.id}')"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function openAddDoctorModal() {
  document.getElementById('doctorModalTitle').innerHTML = '<i class="bi bi-person-badge text-primary me-2"></i>Add Doctor Profile';
  document.getElementById('doctorId').value = '';
  document.getElementById('dName').value = '';
  document.getElementById('dSpec').value = 'Cardiology';
  document.getElementById('dExp').value = '10 Years';
  document.getElementById('dFee').value = '500';
  document.getElementById('dPhone').value = '';
  document.getElementById('dEmail').value = '';
}

function openEditDoctorModal(id) {
  const d = doctorsList.find(x => String(x.id) === String(id));
  if (!d) return;

  document.getElementById('doctorModalTitle').innerHTML = '<i class="bi bi-pencil text-primary me-2"></i>Edit Doctor Profile';
  document.getElementById('doctorId').value = d.id;
  document.getElementById('dName').value = d.name;
  document.getElementById('dSpec').value = d.specialization;
  document.getElementById('dExp').value = d.experience;
  document.getElementById('dFee').value = d.fee;
  document.getElementById('dPhone').value = d.phone;
  document.getElementById('dEmail').value = d.email;

  const modal = new bootstrap.Modal(document.getElementById('doctorModal'));
  modal.show();
}

async function handleSaveDoctor(e) {
  e.preventDefault();

  const id = document.getElementById('doctorId').value;
  const name = document.getElementById('dName').value.trim();
  const specialization = document.getElementById('dSpec').value;
  const experience = document.getElementById('dExp').value.trim();
  const fee = document.getElementById('dFee').value;
  const phone = document.getElementById('dPhone').value.trim();
  const email = document.getElementById('dEmail').value.trim();

  if (!name || !experience || !fee || !phone || !email) {
    showToast('Please fill all required fields', 'warning');
    return;
  }

  const payload = { name, specialization, experience, fee: Number(fee), phone, email };

  try {
    if (id) {
      await apiRequest(`/api/doctors/${id}`, 'PUT', payload);
      showToast('Doctor profile updated!', 'success');
    } else {
      await apiRequest('/api/doctors', 'POST', payload);
      showToast('Doctor profile created!', 'success');
    }

    const modalEl = document.getElementById('doctorModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    await loadDoctors();
  } catch (err) {
    showToast('Failed to save doctor details.', 'error');
  }
}

async function deleteDoctor(id) {
  try {
    await apiRequest(`/api/doctors/${id}`, 'DELETE');
    showToast('Doctor removed.', 'info');
    await loadDoctors();
  } catch (err) {
    showToast('Failed to delete doctor.', 'error');
  }
}
