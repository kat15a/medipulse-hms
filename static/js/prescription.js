/**
 * MediPulse HMS - Prescription Controller
 */

let prescriptionsList = [];
let patientsList = [];
let doctorsList = [];

document.addEventListener('DOMContentLoaded', async () => {
  const title = document.getElementById('pageHeadingTitle');
  const subtitle = document.getElementById('pageHeadingSubtitle');
  if (title) title.textContent = 'Prescription Management';
  if (subtitle) subtitle.textContent = 'Issue digital prescriptions, medicine dosages & printable Rx invoices';

  await loadData();

  const search = document.getElementById('prescriptionSearch');
  if (search) search.addEventListener('input', renderPrescriptionsTable);

  const form = document.getElementById('prescriptionForm');
  if (form) form.addEventListener('submit', handleSavePrescription);
});

async function loadData() {
  try {
    patientsList = await apiRequest('/api/patients');
    doctorsList = await apiRequest('/api/doctors');
    prescriptionsList = await apiRequest('/api/prescriptions');

    renderPrescriptionsTable();
  } catch (err) {
    showToast('Failed to load prescriptions.', 'error');
  }
}

function renderPrescriptionsTable() {
  const tbody = document.getElementById('prescriptionsTableBody');
  const search = document.getElementById('prescriptionSearch')?.value.toLowerCase() || '';

  if (!tbody) return;

  const filtered = prescriptionsList.filter(p => {
    return p.patientName.toLowerCase().includes(search) ||
           p.doctorName.toLowerCase().includes(search) ||
           p.diagnosis.toLowerCase().includes(search);
  });

  document.getElementById('prescriptionCountBadge').textContent = `${filtered.length} Issued`;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No prescriptions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td class="fw-bold text-muted">#RX-${p.id}</td>
      <td class="fw-bold">${p.patientName}</td>
      <td>${p.doctorName}</td>
      <td><span class="badge bg-info-subtle text-info-emphasis fw-semibold">${p.diagnosis}</span></td>
      <td>${p.date}</td>
      <td>
        <div class="small fw-semibold text-dark dark:text-light">
          ${(p.medicines || []).map(m => `${m.name} (${m.dosage})`).join(', ')}
        </div>
      </td>
      <td class="text-end">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="viewRxModal('${p.id}')" title="Printable Rx"><i class="bi bi-printer-fill"></i> View Rx</button>
          <button class="btn btn-outline-danger" onclick="deletePrescription('${p.id}')"><i class="bi bi-trash-fill"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openCreatePrescriptionModal() {
  const pSelect = document.getElementById('rxPatient');
  const dSelect = document.getElementById('rxDoctor');

  if (pSelect) pSelect.innerHTML = patientsList.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  if (dSelect) dSelect.innerHTML = doctorsList.map(d => `<option value="${d.name}">${d.name} (${d.specialization})</option>`).join('');

  document.getElementById('rxDiagnosis').value = '';
  document.getElementById('rxInstructions').value = '';

  const container = document.getElementById('medicineRowsContainer');
  container.innerHTML = '';
  addMedicineRow(); // initial row
}

function addMedicineRow() {
  const container = document.getElementById('medicineRowsContainer');
  const rowId = Date.now();
  const div = document.createElement('div');
  div.className = 'row g-2 align-items-center medicine-row';
  div.id = `med-row-${rowId}`;
  div.innerHTML = `
    <div class="col-4">
      <input type="text" class="form-control form-control-sm med-name" placeholder="Medicine Name (e.g. Paracetamol)" required>
    </div>
    <div class="col-2">
      <input type="text" class="form-control form-control-sm med-dosage" placeholder="500mg" required>
    </div>
    <div class="col-3">
      <select class="form-select form-select-sm med-freq">
        <option value="1-0-1">1-0-1 (Morning & Night)</option>
        <option value="1-1-1">1-1-1 (Thrice Daily)</option>
        <option value="1-0-0">1-0-0 (Morning Only)</option>
        <option value="0-0-1">0-0-1 (Night Only)</option>
      </select>
    </div>
    <div class="col-2">
      <input type="text" class="form-control form-control-sm med-dur" placeholder="5 Days" required>
    </div>
    <div class="col-1 text-end">
      <button type="button" class="btn btn-sm btn-outline-danger border-0" onclick="document.getElementById('med-row-${rowId}').remove()"><i class="bi bi-x-circle-fill"></i></button>
    </div>
  `;
  container.appendChild(div);
}

async function handleSavePrescription(e) {
  e.preventDefault();

  const patientName = document.getElementById('rxPatient').value;
  const doctorName = document.getElementById('rxDoctor').value;
  const diagnosis = document.getElementById('rxDiagnosis').value.trim();
  const instructions = document.getElementById('rxInstructions').value.trim();

  const medRows = document.querySelectorAll('.medicine-row');
  const medicines = [];

  medRows.forEach(row => {
    const name = row.querySelector('.med-name').value.trim();
    const dosage = row.querySelector('.med-dosage').value.trim();
    const frequency = row.querySelector('.med-freq').value;
    const duration = row.querySelector('.med-dur').value.trim();

    if (name && dosage) {
      medicines.push({ name, dosage, frequency, duration });
    }
  });

  if (!diagnosis || medicines.length === 0) {
    showToast('Please enter diagnosis and at least one medicine.', 'warning');
    return;
  }

  const payload = { patientName, doctorName, diagnosis, medicines, instructions };

  try {
    await apiRequest('/api/prescriptions', 'POST', payload);
    showToast('Prescription issued successfully!', 'success');

    const modalEl = document.getElementById('prescriptionModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    await loadData();
  } catch (err) {
    showToast('Failed to issue prescription.', 'error');
  }
}

function viewRxModal(id) {
  const p = prescriptionsList.find(x => String(x.id) === String(id));
  if (!p) return;

  const content = document.getElementById('rxPrintContent');
  content.innerHTML = `
    <div class="p-3 border rounded-3 bg-white text-dark">
      <div class="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
        <div>
          <h3 class="fw-extrabold text-primary m-0"><i class="bi bi-hospital me-2"></i>MediPulse Hospital</h3>
          <div class="text-muted small">100 Healthcare Boulevard, Suite 400</div>
          <div class="text-muted extra-small">Phone: +91 1800-123-PULSE | Emergency: 108</div>
        </div>
        <div class="text-end">
          <span class="fs-2 fw-bold text-primary">Rx</span>
          <div class="fw-bold text-muted small">Rx #: ${p.id}</div>
          <div class="small">Date: ${p.date}</div>
        </div>
      </div>

      <div class="row mb-4 p-3 bg-light rounded-3">
        <div class="col-6">
          <div class="text-muted extra-small uppercase fw-bold">Patient Name</div>
          <div class="fw-bold fs-6">${p.patientName}</div>
        </div>
        <div class="col-6 text-end">
          <div class="text-muted extra-small uppercase fw-bold">Attending Physician</div>
          <div class="fw-bold fs-6">${p.doctorName}</div>
        </div>
      </div>

      <div class="mb-4">
        <div class="fw-bold text-muted small mb-1">Diagnosis:</div>
        <div class="p-2 bg-info-subtle rounded text-info-emphasis fw-semibold">${p.diagnosis}</div>
      </div>

      <table class="table table-bordered align-middle mb-4">
        <thead class="table-light">
          <tr>
            <th>Medicine Name</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${(p.medicines || []).map(m => `
            <tr>
              <td class="fw-bold">${m.name}</td>
              <td>${m.dosage}</td>
              <td><span class="badge bg-primary-subtle text-primary">${m.frequency}</span></td>
              <td>${m.duration}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="mb-4">
        <div class="fw-bold text-muted small mb-1">Dietary & Usage Instructions:</div>
        <div class="p-3 border rounded text-muted small">${p.instructions || 'Follow standard prescribed dosage rules.'}</div>
      </div>

      <div class="d-flex justify-content-between align-items-end pt-4 mt-4 border-top">
        <div class="text-muted extra-small">
          Digitally generated by MediPulse Health Suite.<br>This prescription is HIPAA verified.
        </div>
        <div class="text-center" style="width: 200px;">
          <div class="border-bottom pb-1 fw-bold text-dark font-mono" style="font-family: 'Courier New', monospace;">${p.doctorName}</div>
          <div class="text-muted extra-small">Doctor Signature & Stamp</div>
        </div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('viewPrescriptionModal'));
  modal.show();
}

async function deletePrescription(id) {
  try {
    await apiRequest(`/api/prescriptions/${id}`, 'DELETE');
    showToast('Prescription deleted.', 'info');
    await loadData();
  } catch (err) {
    showToast('Failed to delete prescription.', 'error');
  }
}
