/**
 * MediPulse HMS - Patient Management Controller
 */

let patientsList = [];

document.addEventListener('DOMContentLoaded', async () => {
  const title = document.getElementById('pageHeadingTitle');
  const subtitle = document.getElementById('pageHeadingSubtitle');
  if (title) title.textContent = 'Patient Directory';
  if (subtitle) subtitle.textContent = 'Manage patient health profiles, registration & medical background';

  await loadPatients();

  // Search and Filter Listeners
  const searchInput = document.getElementById('patientSearchInput');
  const genderFilter = document.getElementById('genderFilter');

  if (searchInput) searchInput.addEventListener('input', renderPatientsTable);
  if (genderFilter) genderFilter.addEventListener('change', renderPatientsTable);

  // Form Submit
  const form = document.getElementById('patientForm');
  if (form) form.addEventListener('submit', handleSavePatient);
});

async function loadPatients() {
  try {
    patientsList = await apiRequest('/api/patients');
    renderPatientsTable();
  } catch (err) {
    showToast('Failed to fetch patient records.', 'error');
  }
}

function renderPatientsTable() {
  const tbody = document.getElementById('patientsTableBody');
  const search = document.getElementById('patientSearchInput')?.value.toLowerCase() || '';
  const gender = document.getElementById('genderFilter')?.value || '';

  if (!tbody) return;

  const filtered = patientsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search) ||
                          p.email.toLowerCase().includes(search) ||
                          p.phone.includes(search);
    const matchesGender = gender === '' || p.gender === gender;
    return matchesSearch && matchesGender;
  });

  document.getElementById('patientCountBadge').textContent = `${filtered.length} Patients`;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No patient records found matching your criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td class="fw-bold text-muted">#PAT-${String(p.id).padStart(4, '0')}</td>
      <td>
        <div class="fw-bold">${p.name}</div>
        <div class="text-muted extra-small">${p.address || 'No address logged'}</div>
      </td>
      <td>${p.age} Yrs / <span class="badge bg-secondary-subtle">${p.gender}</span></td>
      <td><i class="bi bi-telephone text-primary me-1"></i>${p.phone}</td>
      <td><i class="bi bi-envelope text-muted me-1"></i>${p.email}</td>
      <td><span class="badge bg-danger-subtle text-danger fw-bold">${p.bloodGroup || 'N/A'}</span></td>
      <td class="text-end">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-info" onclick="viewPatient('${p.id}')" title="View Details"><i class="bi bi-eye-fill"></i></button>
          <button class="btn btn-outline-primary" onclick="openEditPatientModal('${p.id}')" title="Edit Patient"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-outline-danger" onclick="deletePatient('${p.id}')" title="Delete Record"><i class="bi bi-trash-fill"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddPatientModal() {
  document.getElementById('patientModalTitle').innerHTML = '<i class="bi bi-person-plus me-2 text-primary"></i>Add New Patient';
  document.getElementById('patientId').value = '';
  document.getElementById('pName').value = '';
  document.getElementById('pAge').value = '';
  document.getElementById('pGender').value = 'Male';
  document.getElementById('pPhone').value = '';
  document.getElementById('pEmail').value = '';
  document.getElementById('pBlood').value = 'O+';
  document.getElementById('pAddress').value = '';
  document.getElementById('pHistory').value = '';
}

function openEditPatientModal(id) {
  const p = patientsList.find(x => String(x.id) === String(id));
  if (!p) return;

  document.getElementById('patientModalTitle').innerHTML = '<i class="bi bi-pencil me-2 text-primary"></i>Edit Patient Record';
  document.getElementById('patientId').value = p.id;
  document.getElementById('pName').value = p.name;
  document.getElementById('pAge').value = p.age;
  document.getElementById('pGender').value = p.gender;
  document.getElementById('pPhone').value = p.phone;
  document.getElementById('pEmail').value = p.email;
  document.getElementById('pBlood').value = p.bloodGroup || 'O+';
  document.getElementById('pAddress').value = p.address || '';
  document.getElementById('pHistory').value = p.medicalHistory || '';

  const modalEl = document.getElementById('patientModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

async function handleSavePatient(e) {
  e.preventDefault();

  const id = document.getElementById('patientId').value;
  const name = document.getElementById('pName').value.trim();
  const age = document.getElementById('pAge').value;
  const gender = document.getElementById('pGender').value;
  const phone = document.getElementById('pPhone').value.trim();
  const email = document.getElementById('pEmail').value.trim();
  const bloodGroup = document.getElementById('pBlood').value;
  const address = document.getElementById('pAddress').value.trim();
  const medicalHistory = document.getElementById('pHistory').value.trim();

  if (!name || !age || !phone || !email) {
    showToast('Please fill all required fields marked with *', 'warning');
    return;
  }

  const payload = { name, age: parseInt(age), gender, phone, email, bloodGroup, address, medicalHistory };

  try {
    if (id) {
      await apiRequest(`/api/patients/${id}`, 'PUT', payload);
      showToast('Patient record updated successfully!', 'success');
    } else {
      await apiRequest('/api/patients', 'POST', payload);
      showToast('New patient added successfully!', 'success');
    }

    const modalEl = document.getElementById('patientModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    await loadPatients();
  } catch (err) {
    showToast('Failed to save patient record.', 'error');
  }
}

function viewPatient(id) {
  const p = patientsList.find(x => String(x.id) === String(id));
  if (!p) return;

  const modalBody = document.getElementById('viewPatientModalBody');
  modalBody.innerHTML = `
    <div class="text-center mb-4">
      <div class="user-avatar mx-auto mb-2" style="width: 64px; height: 64px; font-size: 1.5rem; background: #2563eb; color: #fff;">
        ${p.name.charAt(0).toUpperCase()}
      </div>
      <h4 class="fw-bold mb-1">${p.name}</h4>
      <span class="badge bg-primary-subtle text-primary fw-semibold px-3 py-1">Patient ID: #PAT-${String(p.id).padStart(4, '0')}</span>
    </div>

    <div class="row g-3">
      <div class="col-6"><span class="text-muted small">Age / Gender:</span> <div class="fw-bold">${p.age} Yrs / ${p.gender}</div></div>
      <div class="col-6"><span class="text-muted small">Blood Group:</span> <div class="fw-bold text-danger">${p.bloodGroup || 'N/A'}</div></div>
      <div class="col-6"><span class="text-muted small">Phone:</span> <div class="fw-bold">${p.phone}</div></div>
      <div class="col-6"><span class="text-muted small">Email:</span> <div class="fw-bold">${p.email}</div></div>
      <div class="col-12"><span class="text-muted small">Address:</span> <div class="fw-semibold">${p.address || 'None provided'}</div></div>
      <div class="col-12">
        <span class="text-muted small">Medical History & Notes:</span>
        <div class="p-3 bg-light rounded-3 mt-1 small">${p.medicalHistory || 'No prior medical conditions recorded.'}</div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('viewPatientModal'));
  modal.show();
}

async function deletePatient(id) {
  try {
    await apiRequest(`/api/patients/${id}`, 'DELETE');
    showToast('Patient record deleted.', 'info');
    await loadPatients();
  } catch (err) {
    showToast('Failed to delete patient.', 'error');
  }
}
