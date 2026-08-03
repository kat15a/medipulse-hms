/**
 * MediPulse HMS - Appointment Controller
 */

let appointmentsList = [];
let patientsList = [];
let doctorsList = [];

document.addEventListener('DOMContentLoaded', async () => {
  const title = document.getElementById('pageHeadingTitle');
  const subtitle = document.getElementById('pageHeadingSubtitle');
  if (title) title.textContent = 'Appointments & Queue';
  if (subtitle) subtitle.textContent = 'Schedule patient consultations, track doctor availability & status';

  await loadAllData();

  const search = document.getElementById('appointmentSearch');
  const filter = document.getElementById('statusFilter');

  if (search) search.addEventListener('input', renderAppointmentsTable);
  if (filter) filter.addEventListener('change', renderAppointmentsTable);

  const form = document.getElementById('appointmentForm');
  if (form) form.addEventListener('submit', handleSaveAppointment);

  // Auto populate department when doctor changes
  const docSelect = document.getElementById('appDoctorSelect');
  if (docSelect) {
    docSelect.addEventListener('change', (e) => {
      const doc = doctorsList.find(d => d.name === e.target.value);
      if (doc) {
        document.getElementById('appDepartment').value = doc.specialization;
      }
    });
  }
});

async function loadAllData() {
  try {
    patientsList = await apiRequest('/api/patients');
    doctorsList = await apiRequest('/api/doctors');
    appointmentsList = await apiRequest('/api/appointments');

    populateDropdowns();
    renderAppointmentsTable();
  } catch (err) {
    showToast('Failed to load appointments data.', 'error');
  }
}

function populateDropdowns() {
  const pSelect = document.getElementById('appPatientSelect');
  const dSelect = document.getElementById('appDoctorSelect');

  if (pSelect) {
    pSelect.innerHTML = patientsList.map(p => `<option value="${p.name}">${p.name} (#PAT-${p.id})</option>`).join('');
  }

  if (dSelect) {
    dSelect.innerHTML = doctorsList.map(d => `<option value="${d.name}" data-spec="${d.specialization}">${d.name} (${d.specialization})</option>`).join('');
    if (doctorsList.length > 0) {
      document.getElementById('appDepartment').value = doctorsList[0].specialization;
    }
  }
}

function renderAppointmentsTable() {
  const tbody = document.getElementById('appointmentsTableBody');
  const search = document.getElementById('appointmentSearch')?.value.toLowerCase() || '';
  const status = document.getElementById('statusFilter')?.value || '';

  if (!tbody) return;

  const filtered = appointmentsList.filter(a => {
    const matchesSearch = a.patientName.toLowerCase().includes(search) ||
                          a.doctorName.toLowerCase().includes(search) ||
                          (a.reason && a.reason.toLowerCase().includes(search));
    const matchesStatus = status === '' || a.status === status;
    return matchesSearch && matchesStatus;
  });

  document.getElementById('appointmentCountBadge').textContent = `${filtered.length} Scheduled`;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No appointments found matching your filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => `
    <tr>
      <td class="fw-bold text-muted">#APT-${a.id}</td>
      <td class="fw-bold">${a.patientName}</td>
      <td>${a.doctorName}</td>
      <td>
        <div class="fw-semibold">${a.date}</div>
        <div class="text-muted extra-small"><i class="bi bi-clock me-1"></i>${a.time}</div>
      </td>
      <td><span class="badge bg-secondary-subtle fw-semibold">${a.department || 'General'}</span></td>
      <td class="small text-muted" style="max-width: 200px;">${a.reason || 'General checkup'}</td>
      <td><span class="badge-status ${getStatusBadgeClass(a.status)}">${a.status}</span></td>
      <td class="text-end">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="openEditAppointmentModal('${a.id}')" title="Edit Status"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-outline-danger" onclick="deleteAppointment('${a.id}')" title="Cancel / Delete"><i class="bi bi-trash-fill"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openScheduleModal() {
  document.getElementById('appointmentModalTitle').innerHTML = '<i class="bi bi-calendar-plus text-primary me-2"></i>Schedule Appointment';
  document.getElementById('appointmentId').value = '';
  document.getElementById('appDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('appReason').value = '';
  document.getElementById('appStatus').value = 'Scheduled';
}

function openEditAppointmentModal(id) {
  const a = appointmentsList.find(x => String(x.id) === String(id));
  if (!a) return;

  document.getElementById('appointmentModalTitle').innerHTML = '<i class="bi bi-pencil text-primary me-2"></i>Update Appointment';
  document.getElementById('appointmentId').value = a.id;
  document.getElementById('appPatientSelect').value = a.patientName;
  document.getElementById('appDoctorSelect').value = a.doctorName;
  document.getElementById('appDate').value = a.date;
  document.getElementById('appTime').value = a.time || '10:30 AM';
  document.getElementById('appDepartment').value = a.department || 'Cardiology';
  document.getElementById('appStatus').value = a.status;
  document.getElementById('appReason').value = a.reason || '';

  const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
  modal.show();
}

async function handleSaveAppointment(e) {
  e.preventDefault();

  const id = document.getElementById('appointmentId').value;
  const patientName = document.getElementById('appPatientSelect').value;
  const doctorName = document.getElementById('appDoctorSelect').value;
  const date = document.getElementById('appDate').value;
  const time = document.getElementById('appTime').value;
  const department = document.getElementById('appDepartment').value;
  const status = document.getElementById('appStatus').value;
  const reason = document.getElementById('appReason').value.trim();

  if (!patientName || !doctorName || !date) {
    showToast('Please fill all required fields.', 'warning');
    return;
  }

  const payload = { patientName, doctorName, date, time, department, status, reason };

  try {
    if (id) {
      await apiRequest(`/api/appointments/${id}`, 'PUT', payload);
      showToast('Appointment updated successfully!', 'success');
    } else {
      await apiRequest('/api/appointments', 'POST', payload);
      showToast('Appointment scheduled successfully!', 'success');
    }

    const modalEl = document.getElementById('appointmentModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    await loadAllData();
  } catch (err) {
    showToast('Failed to save appointment.', 'error');
  }
}

async function deleteAppointment(id) {
  try {
    await apiRequest(`/api/appointments/${id}`, 'DELETE');
    showToast('Appointment cancelled.', 'info');
    await loadAllData();
  } catch (err) {
    showToast('Failed to cancel appointment.', 'error');
  }
}
