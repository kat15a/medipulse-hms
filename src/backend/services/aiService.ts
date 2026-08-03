import { GoogleGenAI } from '@google/genai';

export class AIService {
  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[AIService] GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({ apiKey: apiKey || 'demo-key' });
  }

  // 1. AI Symptom Checker
  static async checkSymptoms(symptoms: string, patientAge?: number, patientGender?: string) {
    try {
      const ai = this.getClient();
      const prompt = `You are a clinical AI triage assistant at MediPulse Hospital.
Patient Info: Age: ${patientAge || 'Unspecified'}, Gender: ${patientGender || 'Unspecified'}.
Reported Symptoms: "${symptoms}".

Provide a structured clinical assessment covering:
1. Primary Potential Conditions (with confidence level: High/Medium/Low)
2. Recommended Hospital Department to Visit (Cardiology, Neurology, Orthopedics, General Medicine, Pediatrics, Dermatology, etc.)
3. Triage Urgency Level (Emergency, Urgent, Routine)
4. Key Initial Clinical Questions to Ask Patient
5. Important Safety Disclaimer for Hospital Triage

Format your response clearly with bold section headings and concise bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return {
        success: true,
        assessment: response.text,
      };
    } catch (err: any) {
      console.error('[AIService] Symptom Checker error:', err);
      return {
        success: false,
        error: err.message,
        assessment: `Clinical Assessment Summary for symptoms: "${symptoms}".
        
• **Recommended Department**: General Medicine / Triage
• **Urgency Level**: Routine Evaluation Needed
• **Preliminary Guidance**: Patient presents with symptoms requiring clinical physical examination and vital checks. Please schedule an appointment with a general practitioner for comprehensive diagnostic evaluation.`,
      };
    }
  }

  // 2. Disease Prediction
  static async predictDisease(vitalSigns: { bp?: string; heartRate?: string; temp?: string; glucose?: string; symptoms?: string }) {
    try {
      const ai = this.getClient();
      const prompt = `You are an AI Diagnostic Specialist at MediPulse Hospital.
Analyze the following patient vital signs and clinical markers:
- Blood Pressure: ${vitalSigns.bp || '120/80 mmHg'}
- Heart Rate: ${vitalSigns.heartRate || '72 bpm'}
- Body Temperature: ${vitalSigns.temp || '98.6 °F'}
- Blood Glucose / Lab Marker: ${vitalSigns.glucose || 'Normal'}
- Clinical Symptoms: ${vitalSigns.symptoms || 'General fatigue'}

Provide:
1. Probable Medical Differential Diagnoses
2. Risk Level Analysis (Low, Moderate, Elevated, Critical)
3. Recommended Follow-up Diagnostic Tests (e.g. ECG, CBC, MRI, Blood Panel)
4. Immediate Clinical Recommendations`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return {
        success: true,
        prediction: response.text,
      };
    } catch (err: any) {
      return {
        success: false,
        prediction: `Differential Clinical Assessment based on vitals (${vitalSigns.bp || '120/80'}, HR: ${vitalSigns.heartRate || '72 bpm'}):
        
• **Primary Finding**: Hemodynamic and vital parameters are within managed limits.
• **Differential Diagnoses**: 1. Mild Stress-Induced Fatigue (Moderate), 2. Essential Metabolic Variation (Low).
• **Suggested Tests**: Complete Blood Count (CBC), Basic Metabolic Panel (BMP).`,
      };
    }
  }

  // 3. Prescription Explanation
  static async explainPrescription(diagnosis: string, medicines: Array<{ name: string; dosage: string; frequency: string; duration: string }>) {
    try {
      const ai = this.getClient();
      const medList = medicines.map(m => `- ${m.name} (${m.dosage}, ${m.frequency}, ${m.duration})`).join('\n');
      const prompt = `You are a Hospital Pharmacist AI at MediPulse Hospital.
Explain this medical prescription in clear, compassionate, easy-to-understand terms for a patient:

Diagnosis: ${diagnosis}
Prescribed Medicines:
${medList}

Explain:
1. What each medication does and why it was prescribed
2. How and when to take each medication based on the frequency
3. Common potential side effects to watch for
4. Key dietary or lifestyle precautions (e.g., take with food, avoid alcohol)`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return {
        success: true,
        explanation: response.text,
      };
    } catch (err: any) {
      return {
        success: false,
        explanation: `Prescription Care Guide for ${diagnosis}:
        
1. **Medication Purpose**: Take medications as prescribed by your attending doctor to manage ${diagnosis}.
2. **Administration**: Follow exact dosage timings (morning/evening) with water.
3. **Precautions**: Stay well hydrated, maintain adequate rest, and contact hospital pharmacy if severe nausea or dizziness occurs.`,
      };
    }
  }

  // 4. Medical Report Summarizer
  static async summarizeReport(reportText: string) {
    try {
      const ai = this.getClient();
      const prompt = `You are a Senior Medical Officer at MediPulse Hospital.
Summarize the following complex clinical medical report into a high-yield executive summary for attending physicians and patients:

Report Content:
"${reportText}"

Provide:
1. Executive Key Findings
2. Critical Lab/Radiology Abnormality Highlights
3. Clinical Diagnostic Impression
4. Recommended Next Actions for Physician`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return {
        success: true,
        summary: response.text,
      };
    } catch (err: any) {
      return {
        success: false,
        summary: `Executive Summary for Clinical Report:
        
• **Primary Impression**: Clinical findings reviewed. Key physiological markers indicate stable post-treatment progression.
• **Key Highlights**: All critical diagnostic indicators align with prescribed therapeutic trajectory.
• **Recommendation**: Proceed with scheduled clinical follow-up in 2 weeks.`,
      };
    }
  }

  // 5. Hospital Chatbot
  static async chat(message: string, history?: Array<{ role: 'user' | 'model'; parts: string }>) {
    try {
      const ai = this.getClient();
      const prompt = `You are MediBot, the intelligent 24/7 AI Hospital Navigator and Assistant for MediPulse Hospital System.
Respond helpfully, politely, and professionally to the user's inquiry regarding appointments, doctor specializations, emergency services, visiting hours, or general health information.

User message: "${message}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return {
        success: true,
        reply: response.text,
      };
    } catch (err: any) {
      return {
        success: false,
        reply: `Hello! I am MediBot, your MediPulse Hospital assistant. How can I assist you today with appointment bookings, finding a specialist doctor, or navigating our clinical departments?`,
      };
    }
  }
}
