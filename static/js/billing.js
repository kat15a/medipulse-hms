/**
 * MediPulse HMS - Billing & Invoice Controller
 */

let billingList = [];
let patientsList = [];

document.addEventListener('DOMContentLoaded', async () => {
  const title = document.getElementById('pageHeadingTitle');
  const subtitle = document.getElementById('pageHeadingSubtitle');
  if (title) title.textContent = 'Billing & Accounts Ledger';
  if (subtitle) subtitle.textContent = 'Generate patient invoices, track consultations, pharmacy fees & receipts';

  await loadData();

  const search = document.getElementById('billSearch');
  const filter = document.getElementById('billStatusFilter');

  if (search) search.addEventListener('input', renderBillingTable);
  if (filter) filter.addEventListener('change', renderBillingTable);

  const form = document.getElementById('billForm');
  if (form) form.addEventListener('submit', handleSaveBill);

  // Auto calculate total
  const inputs = document.querySelectorAll('.bill-calc');
  inputs.forEach(inp => inp.addEventListener('input', calculateBillTotal));
});

async function loadData() {
  try {
    patientsList = await apiRequest('/api/patients');
    billingList = await apiRequest('/api/billing');

    updateSummaryCards();
    renderBillingTable();
  } catch (err) {
    showToast('Failed to load billing records.', 'error');
  }
}

function updateSummaryCards() {
  const collected = billingList.filter(b => b.status === 'PAID').reduce((sum, b) => sum + Number(b.total), 0);
  const pending = billingList.filter(b => b.status === 'PENDING').reduce((sum, b) => sum + Number(b.total), 0);

  document.getElementById('billTotalCollected').textContent = `₹${collected.toLocaleString('en-IN')}`;
  document.getElementById('billTotalPending').textContent = `₹${pending.toLocaleString('en-IN')}`;
  document.getElementById('billTotalInvoices').textContent = billingList.length;
}

function renderBillingTable() {
  const tbody = document.getElementById('billingTableBody');
  const search = document.getElementById('billSearch')?.value.toLowerCase() || '';
  const status = document.getElementById('billStatusFilter')?.value || '';

  if (!tbody) return;

  const filtered = billingList.filter(b => {
    const matchesSearch = b.patientName.toLowerCase().includes(search) || b.invoiceNo.toLowerCase().includes(search);
    const matchesStatus = status === '' || b.status === status;
    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No invoices found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(b => `
    <tr>
      <td class="fw-bold text-muted">${b.invoiceNo}</td>
      <td class="fw-bold">${b.patientName}</td>
      <td>${b.date}</td>
      <td>₹${b.consultationFee}</td>
      <td>₹${Number(b.medicineFee || 0) + Number(b.labFee || 0)}</td>
      <td class="fw-extrabold text-primary">₹${b.total}</td>
      <td>
        <span class="badge-status ${b.status === 'PAID' ? 'badge-success' : 'badge-pending'}">${b.status}</span>
      </td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary rounded-3" onclick="viewInvoiceModal('${b.id}')"><i class="bi bi-file-earmark-text me-1"></i> View Invoice</button>
      </td>
    </tr>
  `).join('');
}

function openGenerateBillModal() {
  const pSelect = document.getElementById('billPatient');
  if (pSelect) {
    pSelect.innerHTML = patientsList.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }
  calculateBillTotal();
}

function calculateBillTotal() {
  const cFee = Number(document.getElementById('billConsultFee')?.value || 0);
  const lFee = Number(document.getElementById('billLabFee')?.value || 0);
  const mFee = Number(document.getElementById('billMedFee')?.value || 0);
  const tax = Number(document.getElementById('billTax')?.value || 0);

  const grandTotal = cFee + lFee + mFee + tax;
  const display = document.getElementById('billTotalCalculated');
  if (display) display.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
}

async function handleSaveBill(e) {
  e.preventDefault();

  const patientName = document.getElementById('billPatient').value;
  const status = document.getElementById('billPayStatus').value;
  const consultationFee = Number(document.getElementById('billConsultFee').value || 0);
  const labFee = Number(document.getElementById('billLabFee').value || 0);
  const medicineFee = Number(document.getElementById('billMedFee').value || 0);
  const tax = Number(document.getElementById('billTax').value || 0);
  const paymentMethod = document.getElementById('billPayMethod').value;
  const total = consultationFee + labFee + medicineFee + tax;

  const payload = { patientName, status, consultationFee, labFee, medicineFee, tax, total, paymentMethod };

  try {
    await apiRequest('/api/billing', 'POST', payload);
    showToast('Invoice generated successfully!', 'success');

    const modalEl = document.getElementById('billModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    await loadData();
  } catch (err) {
    showToast('Failed to generate invoice.', 'error');
  }
}

function viewInvoiceModal(id) {
  const b = billingList.find(x => String(x.id) === String(id));
  if (!b) return;

  const content = document.getElementById('invoiceModalContent');
  content.innerHTML = `
    <div class="p-3 border rounded-3 bg-white text-dark">
      <div class="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
        <div>
          <h3 class="fw-extrabold text-primary m-0"><i class="bi bi-hospital me-2"></i>MediPulse Hospital</h3>
          <div class="text-muted small">Tax ID: #TAX-9988-MP | HIPAA Certified</div>
        </div>
        <div class="text-end">
          <h4 class="fw-bold text-dark m-0">INVOICE</h4>
          <div class="fw-bold text-primary">${b.invoiceNo}</div>
          <div class="small text-muted">Date: ${b.date}</div>
        </div>
      </div>

      <div class="row mb-4 p-3 bg-light rounded-3">
        <div class="col-6">
          <div class="text-muted extra-small uppercase fw-bold">Billed To</div>
          <div class="fw-bold fs-6">${b.patientName}</div>
        </div>
        <div class="col-6 text-end">
          <div class="text-muted extra-small uppercase fw-bold">Payment Status</div>
          <span class="badge ${b.status === 'PAID' ? 'bg-success' : 'bg-warning text-dark'} px-3 py-1 fs-6">${b.status}</span>
        </div>
      </div>

      <table class="table table-bordered align-middle mb-4">
        <thead class="table-light">
          <tr>
            <th>Line Item Description</th>
            <th class="text-end">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Physician Consultation Fee</td><td class="text-end">₹${b.consultationFee}</td></tr>
          <tr><td>Laboratory Diagnostic Tests</td><td class="text-end">₹${b.labFee || 0}</td></tr>
          <tr><td>Pharmacy Medicines & Supplies</td><td class="text-end">₹${b.medicineFee || 0}</td></tr>
          <tr><td>Service Tax & Facilities Charge</td><td class="text-end">₹${b.tax || 0}</td></tr>
        </tbody>
        <tfoot>
          <tr class="table-light fw-extrabold fs-5">
            <td class="text-end">Grand Total Due:</td>
            <td class="text-end text-primary">₹${b.total}</td>
          </tr>
        </tfoot>
      </table>

      <div class="d-flex justify-content-between align-items-center pt-3 border-top">
        <div class="text-muted small">
          Payment Method: <span class="fw-bold text-dark">${b.paymentMethod || 'Credit Card'}</span>
        </div>
        <div class="text-end text-muted extra-small">
          Thank you for choosing MediPulse Hospital.
        </div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('viewInvoiceModal'));
  modal.show();
}
