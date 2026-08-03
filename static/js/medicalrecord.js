/**
 * MediPulse HMS - Medical Records Controller
 */

let recordsList = [];
let patientsList = [];
let doctorsList = [];

document.addEventListener('DOMContentLoaded', async () => {
  const title = document.getElementById('pageHeadingTitle');
  const subtitle = document.getElementById('pageHeadingSubtitle');
  if (title) title.textContent = 'Medical Health Records (EHR)';
  if (subtitle) subtitle.textContent = 'Electronic medical history, diagnostic reports & physician progress notes';

  await loadData();

  const search = document.getElementById('recordSearch');
  if (search) search.addEventListener('input', renderRecordsTable);

  const form = document.getElementById('recordForm');
  if (form) form.addEventListener('submit', handleSaveRecord);
});

async function loadData() {
  try {
    patientsList = await apiRequest('/api/patients');
    doctorsList = await apiRequest('/api/doctors');
    recordsList = await apiRequest('/api/medical-records');

    renderRecordsTable();
  } catch (err) {
    showToast('Failed to load medical records.', 'error');
  }
}

function renderRecordsTable() {
  const tbody = document.getElementById('recordsTableBody');
  const search = document.getElementById('recordSearch')?.value.toLowerCase() || '';

  if (!tbody) return;

  const filtered = recordsList.filter(r => {
    return r.patientName.toLowerCase().includes(search) ||
           r.doctorName.toLowerCase().includes(search) ||
           r.diagnosis.toLowerCase().includes(search);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No medical records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(r => `
    <tr>
      <td class="fw-bold text-muted">#EHR-${r.id}</td>
      <td class="fw-bold">${r.patientName}</td>
      <td>${r.doctorName}</td>
      <td>${r.date}</td>
      <td><span class="badge bg-primary-subtle text-primary">${r.diagnosis}</span></td>
      <td><span class="small fw-semibold text-muted">${r.bloodPressure || '120/80'} | ${r.heartRate || '72'} bpm</span></td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-info rounded-3" onclick="viewRecordModal('${r.id}')"><i class="bi bi-eye-fill me-1"></i> View Details</button>
      </td>
    </tr>
  `).join('');
}

function openCreateRecordModal() {
  const pSelect = document.getElementById('recPatient');
  const dSelect = document.getElementById('recDoctor');

  if (pSelect) pSelect.innerHTML = patientsList.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  if (dSelect) dSelect.innerHTML = doctorsList.map(d => `<option value="${d.name}">${d.name}</option>`).join('');

  document.getElementById('recDiagnosis').value = '';
  document.getElementById('recBP').value = '120/80';
  document.getElementById('recHR').value = '72';
  document.getElementById('recTemp').value = '98.6';
  document.getElementById('recTreatment').value = '';
  document.getElementById('recNotes').value = '';
}

async function handleSaveRecord(e) {
  e.preventDefault();

  const patientName = document.getElementById('recPatient').value;
  const doctorName = document.getElementById('recDoctor').value;
  const diagnosis = document.getElementById('recDiagnosis').value.trim();
  const bloodPressure = document.getElementById('recBP').value.trim();
  const heartRate = document.getElementById('recHR').value.trim();
  const temperature = document.getElementById('recTemp').value.trim();
  const treatment = document.getElementById('recTreatment').value.trim();
  const notes = document.getElementById('recNotes').value.trim();

  if (!diagnosis) {
    showToast('Please enter a clinical diagnosis.', 'warning');
    return;
  }

  const payload = { patientName, doctorName, diagnosis, bloodPressure, heartRate, temperature, treatment, notes };

  try {
    await apiRequest('/api/medical-records', 'POST', payload);
    showToast('Medical record created!', 'success');

    const modalEl = document.getElementById('recordModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    await loadData();
  } catch (err) {
    showToast('Failed to save record.', 'error');
  }
}

function viewRecordModal(id) {
  const r = recordsList.find(x => String(x.id) === String(id));
  if (!r) return;

  const content = document.getElementById('viewRecordModalBody');
  content.innerHTML = `
    <div class="row g-3">
      <div class="col-md-6"><span class="text-muted small">Patient Name:</span> <div class="fw-bold fs-6">${r.patientName}</div></div>
      <div class="col-md-6"><span class="text-muted small">Attending Doctor:</span> <div class="fw-bold fs-6">${r.doctorName}</div></div>
      <div class="col-md-6"><span class="text-muted small">Record ID & Date:</span> <div class="fw-semibold">#EHR-${r.id} (${r.date})</div></div>
      <div class="col-md-6"><span class="text-muted small">Diagnosis:</span> <div class="fw-bold text-primary">${r.diagnosis}</div></div>
      
      <div class="col-12 mt-3">
        <div class="p-3 bg-light rounded-3 d-flex justify-content-around text-center">
          <div><div class="text-muted extra-small">Blood Pressure</div><div class="fw-bold text-dark">${r.bloodPressure || '120/80'}</div></div>
          <div><div class="text-muted extra-small">Heart Rate</div><div class="fw-bold text-dark">${r.heartRate || '72'} bpm</div></div>
          <div><div class="text-muted extra-small">Body Temp</div><div class="fw-bold text-dark">${r.temperature || '98.6'} °F</div></div>
        </div>
      </div>

      <div class="col-12"><span class="text-muted small">Treatment Plan:</span> <div class="p-3 bg-light rounded-3 mt-1 small">${r.treatment || 'Standard observation and monitoring.'}</div></div>
      <div class="col-12"><span class="text-muted small">Progress Notes:</span> <div class="p-3 bg-light rounded-3 mt-1 small">${r.notes || 'Patient in stable condition.'}</div></div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('viewRecordModal'));
  modal.show();
}
