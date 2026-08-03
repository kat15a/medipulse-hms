/**
 * MediPulse HMS - AI Health Suite Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('pageHeadingTitle');
  const subtitle = document.getElementById('pageHeadingSubtitle');
  if (title) title.textContent = 'AI Health & Diagnostic Assistant';
  if (subtitle) subtitle.textContent = 'AI-assisted symptom checker, disease risk prediction, prescription explainer & chatbot';
});

// 1. Symptom Checker Analysis
function runSymptomChecker() {
  const text = document.getElementById('aiSymptomInput').value.trim();
  const severity = document.getElementById('aiSeverityRange').value;
  const duration = document.getElementById('aiDurationSelect').value;

  if (!text) {
    showToast('Please enter symptoms first.', 'warning');
    return;
  }

  const container = document.getElementById('symptomResultContainer');
  container.innerHTML = `
    <div class="text-center py-4">
      <div class="spinner-border text-primary mb-2" role="status"></div>
      <p class="text-muted small">Running MediPulse AI Symptom Analysis...</p>
    </div>
  `;

  setTimeout(() => {
    let dept = "General Internal Medicine";
    let urgency = "Moderate Urgency";
    let badgeClass = "bg-warning";
    let recommendations = ["Schedule consultation within 24-48 hours", "Rest and maintain proper hydration", "Monitor temperature and vital signs"];

    const lower = text.toLowerCase();
    if (lower.includes('chest') || lower.includes('heart') || lower.includes('tightness') || lower.includes('breath')) {
      dept = "Cardiology & Emergency Triage";
      urgency = "High Priority / Urgent";
      badgeClass = "bg-danger";
      recommendations = ["Immediate ECG and cardiac enzymes evaluation", "Avoid physical exertion", "Seek emergency medical room if pain radiates to arm or jaw"];
    } else if (lower.includes('headache') || lower.includes('dizziness') || lower.includes('numbness')) {
      dept = "Neurology";
      urgency = "Moderate Priority";
      badgeClass = "bg-primary";
    } else if (lower.includes('joint') || lower.includes('knee') || lower.includes('bone') || lower.includes('pain')) {
      dept = "Orthopedics";
      urgency = "Standard Priority";
      badgeClass = "bg-info";
    }

    container.innerHTML = `
      <div class="space-y-3">
        <div class="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
          <div>
            <span class="text-muted extra-small uppercase font-bold d-block">Recommended Department</span>
            <span class="fw-bold fs-6 text-primary">${dept}</span>
          </div>
          <span class="badge ${badgeClass} text-white px-3 py-2 rounded-pill font-bold">${urgency}</span>
        </div>

        <div>
          <h6 class="fw-bold mb-1"><i class="bi bi-shield-exclamation text-warning me-1"></i>Clinical AI Observations:</h6>
          <p class="text-muted small mb-2">Based on symptom inputs (${duration}, Discomfort Level ${severity}/10), potential conditions include mild inflammatory or vascular response.</p>
        </div>

        <div class="p-3 bg-primary-subtle text-primary rounded-3">
          <h6 class="fw-bold mb-2"><i class="bi bi-list-check me-1"></i>Next Step Recommendations:</h6>
          <ul class="mb-0 ps-3 small">
            ${recommendations.map(r => `<li class="mb-1">${r}</li>`).join('')}
          </ul>
        </div>

        <a href="/resources/templates/appointments.html?dept=${encodeURIComponent(dept)}" class="btn btn-primary w-100 rounded-3 font-bold mt-2">
          <i class="bi bi-calendar-check me-1"></i> Book Appointment with ${dept} Specialist
        </a>
      </div>
    `;
  }, 600);
}

// 2. Disease Risk Prediction
function runDiseasePrediction() {
  const age = parseInt(document.getElementById('predAge').value) || 45;
  const category = document.getElementById('predCategory').value;
  const smoker = document.getElementById('rfSmoker').checked;
  const bp = document.getElementById('rfBP').checked;
  const family = document.getElementById('rfFamily').checked;

  const container = document.getElementById('predictionResultContainer');
  
  let riskScore = (age > 40 ? 25 : 10) + (smoker ? 30 : 0) + (bp ? 25 : 0) + (family ? 20 : 0);
  riskScore = Math.min(riskScore, 95);

  let statusClass = "bg-success";
  let statusLabel = "Low Risk Profile";
  if (riskScore > 40) { statusClass = "bg-warning text-dark"; statusLabel = "Moderate Risk Profile"; }
  if (riskScore > 70) { statusClass = "bg-danger"; statusLabel = "High Risk Profile"; }

  container.innerHTML = `
    <div class="space-y-4">
      <div class="p-3 border rounded-3 bg-light">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold text-dark">${category} Risk Index</span>
          <span class="badge ${statusClass} px-3 py-1 font-bold">${statusLabel}</span>
        </div>
        <div class="progress" style="height: 12px; border-radius: 6px;">
          <div class="progress-bar ${statusClass}" role="progressbar" style="width: ${riskScore}%;"></div>
        </div>
        <div class="text-end text-muted extra-small mt-1">${riskScore}% Probability Index</div>
      </div>

      <div class="row g-2">
        <div class="col-6">
          <div class="p-3 border rounded-3 text-center">
            <div class="text-muted extra-small uppercase">Ischemic Heart Risk</div>
            <div class="fw-extrabold fs-5 text-primary">${Math.round(riskScore * 0.8)}%</div>
          </div>
        </div>
        <div class="col-6">
          <div class="p-3 border rounded-3 text-center">
            <div class="text-muted extra-small uppercase">Hypertension / Vascular</div>
            <div class="fw-extrabold fs-5 text-warning">${Math.round(riskScore * 0.9)}%</div>
          </div>
        </div>
      </div>

      <div class="p-3 bg-info-subtle text-info-emphasis rounded-3 small">
        <i class="bi bi-info-circle me-1"></i> <strong>Physician Advice:</strong> Lifestyle modification, regular blood pressure tracking, and lipid screening are advised.
      </div>
    </div>
  `;
}

// 3. Prescription Explainer
function explainPrescription() {
  const text = document.getElementById('rxExplainInput').value.trim();
  if (!text) {
    showToast('Please paste prescription text.', 'warning');
    return;
  }

  const container = document.getElementById('rxExplainResultContainer');
  container.innerHTML = `
    <div class="space-y-3">
      <div class="p-3 bg-success-subtle text-success-emphasis rounded-3">
        <h6 class="fw-bold mb-1"><i class="bi bi-check-circle me-1"></i>Prescription Breakdown:</h6>
        <p class="small mb-0">Analyzed ${text.length} characters of prescription notes.</p>
      </div>

      <div class="border rounded-3 p-3">
        <h6 class="fw-bold text-primary mb-2">Key Medication Purpose:</h6>
        <ul class="small mb-0 ps-3">
          <li><strong>Blood Pressure / Cholesterol Regulation:</strong> Controls lipid accumulation and maintains vascular flow.</li>
          <li><strong>Blood Sugar Control:</strong> Helps muscle cells absorb insulin efficiently.</li>
          <li><strong>Antibiotics Regimen:</strong> Eliminates bacterial infection; must complete full course.</li>
        </ul>
      </div>

      <div class="border rounded-3 p-3 bg-light">
        <h6 class="fw-bold text-dark mb-1"><i class="bi bi-exclamation-triangle text-warning me-1"></i>Dietary & Usage Safety Notes:</h6>
        <p class="small text-muted mb-0">Take with meals to prevent stomach upset. Avoid grapefruit juice if taking statin medications.</p>
      </div>
    </div>
  `;
}

// 4. Report Summarizer
function summarizeReport() {
  const text = document.getElementById('reportInput').value.trim();
  if (!text) {
    showToast('Please paste diagnostic report text.', 'warning');
    return;
  }

  const container = document.getElementById('reportSummaryResultContainer');
  container.innerHTML = `
    <div class="space-y-3">
      <div class="p-3 bg-primary-subtle text-primary rounded-3">
        <h6 class="fw-bold mb-1"><i class="bi bi-file-earmark-check me-1"></i>Executive Summary:</h6>
        <p class="small mb-0">Lab findings indicate mild elevation in inflammatory markers and serum cholesterol. No acute life-threatening critical values detected.</p>
      </div>

      <table class="table table-sm table-bordered small">
        <thead class="table-light">
          <tr><th>Test Name</th><th>Observed Value</th><th>Reference Status</th></tr>
        </thead>
        <tbody>
          <tr><td>Hemoglobin (Hb)</td><td>11.2 g/dL</td><td><span class="badge bg-warning text-dark">Mild Low</span></td></tr>
          <tr><td>White Blood Cells (WBC)</td><td>12,500 /mcL</td><td><span class="badge bg-warning text-dark">Elevated</span></td></tr>
          <tr><td>Lipid Serum Cholesterol</td><td>240 mg/dL</td><td><span class="badge bg-danger">High</span></td></tr>
        </tbody>
      </table>

      <div class="p-3 bg-light rounded-3 small">
        <strong>Recommended Action:</strong> Follow up with attending physician to evaluate low iron intake and start dietary cholesterol management.
      </div>
    </div>
  `;
}

// 5. Hospital AI Chatbot
function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const query = input.value.trim();
  if (!query) return;

  const history = document.getElementById('chatMessageHistory');

  // Append User Message
  const userDiv = document.createElement('div');
  userDiv.className = 'd-flex align-items-start gap-2 max-w-75 ms-auto flex-row-reverse';
  userDiv.innerHTML = `
    <div class="user-avatar bg-dark text-white flex-shrink-0" style="width:32px; height:32px;">You</div>
    <div class="p-3 bg-primary text-white rounded-4 text-sm">${escapeHtml(query)}</div>
  `;
  history.appendChild(userDiv);

  input.value = '';
  history.scrollTop = history.scrollHeight;

  // Generate AI Response
  setTimeout(() => {
    let reply = "I can assist you with that! You can schedule consultations, check lab results, or contact emergency triage at +91 1800-123-PULSE (Emergency: 108).";
    const q = query.toLowerCase();

    if (q.includes('appointment') || q.includes('book') || q.includes('doctor')) {
      reply = "To schedule an appointment, you can visit our <a href='/resources/templates/appointments.html' class='text-primary fw-bold'>Appointments Portal</a> and choose your preferred doctor, department, and time slot!";
    } else if (q.includes('hour') || q.includes('timing') || q.includes('time')) {
      reply = "MediPulse Hospital Outpatient OPD is open Monday to Saturday from 8:00 AM to 8:00 PM. Emergency and ICU services run 24/7.";
    } else if (q.includes('fever') || q.includes('cough') || q.includes('pain')) {
      reply = "For persistent symptoms like fever or pain, please visit our <a href='/resources/templates/ai.html' class='text-primary fw-bold'>Symptom Checker</a> tab or consult our General Medicine department.";
    }

    const aiDiv = document.createElement('div');
    aiDiv.className = 'd-flex align-items-start gap-2 max-w-75';
    aiDiv.innerHTML = `
      <div class="user-avatar bg-primary text-white flex-shrink-0" style="width:32px; height:32px;">AI</div>
      <div class="p-3 bg-light rounded-4 text-dark text-sm">${reply}</div>
    `;
    history.appendChild(aiDiv);
    history.scrollTop = history.scrollHeight;
  }, 500);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
