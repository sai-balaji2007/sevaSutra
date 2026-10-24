import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google Gemini if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('[SevaSutra] Gemini client init note:', err);
  }
}

// Heuristic fallback diagnostics for civil pension failure modes
const FALLBACK_DIAGNOSES: Record<string, any> = {
  NPCI_UNSEEDED: {
    errorCode: 'NPCI_UNSEEDED',
    title: 'Aadhaar Not Seeded in NPCI Payment Bridge (DBT Error AB-01)',
    severity: 'CRITICAL',
    summary: 'Direct Benefit Transfer (DBT) returned with status code AB-01. Although Aadhaar is verified for your account KYC, it is not active on the NPCI central payment bridge.',
    symptomEncountered: 'Pension sanctioned and released by treasury, but returned unpaid with bank remark "Aadhaar unmapped in APBS".',
    rootCause: 'Bank branch merger, periodic inactive status, or multiple bank accounts causing the NPCI routing mandate to lapse.',
    actionSteps: [
      {
        stepNumber: 1,
        title: 'Submit NPCI DBT Seeding Mandate Form at your Bank Branch',
        detail: 'Visit your home branch with your Passbook and Aadhaar copy. Request the Aadhaar Seeding / NPCI Mapper Consent Form (Annexure-I).',
        officeToVisit: 'Bank Home Branch or India Post Payments Bank',
        documentsRequired: ['Aadhaar Card Copy', 'Bank Passbook Original & Copy'],
        isDigitalSelfService: false
      },
      {
        stepNumber: 2,
        title: 'Doorstep IPPB Postman Linkage (Fastest & Zero Hassle)',
        detail: 'Call your local Postman (Toll-free 155299). India Post Payments Bank postmen can seed Aadhaar for DBT right at your doorstep in under 5 minutes.',
        officeToVisit: 'Doorstep Service by Postman',
        documentsRequired: ['Aadhaar Card', 'Biometric / Face Scan'],
        isDigitalSelfService: true
      },
      {
        stepNumber: 3,
        title: 'Track Status on UIDAI Resident Portal',
        detail: 'Visit resident.uidai.gov.in/bank-mapper 48 hours later to confirm the active green checkmark.',
        documentsRequired: ['Aadhaar OTP'],
        isDigitalSelfService: true
      }
    ],
    officialGrievanceDraft: {
      subject: 'Urgent Seeding of Aadhaar on NPCI Mapper for Pension Payment Release',
      authorityAddressed: 'The Branch Manager & Lead District Manager (LDM)',
      bodyText: `Respected Sir/Madam,\n\nI am an elderly pensioner whose DBT pension has been withheld due to code AB-01 (NPCI Mapper Inactive). Kindly seed my bank account into the NPCI mapper immediately to enable DBT pension credits.\n\nThank you.`
    }
  },
  DLC_EXPIRED: {
    errorCode: 'DLC_EXPIRED',
    title: 'Digital Life Certificate (Jeevan Pramaan) Expired / Overdue',
    severity: 'WARNING',
    summary: 'The annual life certificate deadline has passed. The treasury automatically holds disbursements until fresh life proof is recorded.',
    symptomEncountered: 'Status: "Withheld pending Annual Verification / Jeevan Pramaan submission".',
    rootCause: 'All pensioners must certify their life proof once every 12 months. Worn fingerprints among manual laborers or elderly citizens often lead to kiosk failures.',
    actionSteps: [
      {
        stepNumber: 1,
        title: 'Use Smartphone Face Authentication (No Device Needed)',
        detail: 'Download "Jeevan Pramaan Face App" and "AadhaarFaceRD" on an Android phone. Blink into the front camera for 30 seconds from home.',
        documentsRequired: ['Aadhaar Number', 'Pension PPO/Sanction ID'],
        isDigitalSelfService: true
      },
      {
        stepNumber: 2,
        title: 'Request Doorstep Postman Biometric Visit',
        detail: 'Call your local post office for doorstep biometric verification via the India Post micro-ATM.',
        officeToVisit: 'Doorstep by Postman',
        documentsRequired: ['Aadhaar Card', 'PPO Copy'],
        isDigitalSelfService: true
      }
    ],
    officialGrievanceDraft: {
      subject: 'Intimation of Life Certificate Submission for Release of Arrears',
      authorityAddressed: 'District Social Welfare & Treasury Officer',
      bodyText: `Respected Authority,\n\nI have submitted my Digital Life Certificate via Face Authentication. Kindly update the treasury portal and release my accrued pension payments without delay.\n\nThank you.`
    }
  }
};

// API: AI-Powered / Heuristic Pension Delay Diagnosis
app.post('/api/diagnose', async (req, res) => {
  try {
    const { beneficiary, symptom, preferredLanguage } = req.body;

    if (!beneficiary) {
      return res.status(400).json({ error: 'Beneficiary data is required' });
    }

    // Try Gemini if available
    if (aiClient) {
      try {
        const prompt = `You are the lead civic-fintech diagnostic engine for SEVA SUTRA, helping Indian pensioners (elderly and people with disabilities) understand why their social security / NSAP pension payment was delayed or rejected.
Beneficiary Information:
Name: ${beneficiary.name}
Pension ID: ${beneficiary.pensionId}
Scheme: ${beneficiary.schemeTitle || beneficiary.scheme}
State: ${beneficiary.state}, District: ${beneficiary.district}
Bank: ${beneficiary.bankName} (Acct: ...${beneficiary.accountLastFour})
NPCI Aadhaar Seeded: ${beneficiary.npciAadhaarSeeded ? 'Yes' : 'No'}
Life Certificate Valid Until: ${beneficiary.jeevanPramaanValidUntil}
Recent Payment Failures: ${JSON.stringify(beneficiary.paymentHistory?.filter((p: any) => p.status !== 'CREDITED') || [])}
Reported Symptom: ${symptom || 'Recent monthly pension payment stopped or not received in bank account'}
Language Requested: ${preferredLanguage === 'te' ? 'Telugu' : preferredLanguage === 'hi' ? 'Hindi' : 'English'}

Provide a structured JSON output with the exact keys:
{
  "errorCode": "Short code e.g. NPCI_UNSEEDED or DLC_EXPIRED or PFMS_MISMATCH",
  "title": "Clear concise diagnosis title",
  "severity": "CRITICAL" | "WARNING" | "RESOLVABLE",
  "summary": "2 sentences explaining what happened in empathetic, accessible language",
  "symptomEncountered": "Description of the exact error sign",
  "rootCause": "Clear explanation of the civic/technical root cause",
  "actionSteps": [
    {
      "stepNumber": 1,
      "title": "Clear action title",
      "detail": "Step by step guidance including where to go or how to do it from home",
      "officeToVisit": "Specific office or Doorstep Postman or Bank",
      "documentsRequired": ["Aadhaar", "Passbook"],
      "isDigitalSelfService": true or false
    }
  ],
  "officialGrievanceDraft": {
    "subject": "Formal petition subject",
    "authorityAddressed": "Official title addressed",
    "bodyText": "Ready-to-submit official grievance letter"
  }
}
Respond strictly with valid JSON only, without markdown fences.`;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 4000)
        );

        const response: any = await Promise.race([
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          }),
          timeoutPromise
        ]);

        const rawText = response.text?.trim() || '';
        const cleaned = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ diagnosis: parsed, source: 'gemini' });
      } catch (geminiError) {
        console.warn('[SevaSutra] Gemini generation fallback triggered:', geminiError);
      }
    }

    // Heuristic Fallback
    if (!beneficiary.npciAadhaarSeeded) {
      return res.json({ diagnosis: FALLBACK_DIAGNOSES.NPCI_UNSEEDED, source: 'heuristic' });
    }
    const today = new Date().toISOString().split('T')[0];
    if (beneficiary.jeevanPramaanValidUntil && beneficiary.jeevanPramaanValidUntil < today) {
      return res.json({ diagnosis: FALLBACK_DIAGNOSES.DLC_EXPIRED, source: 'heuristic' });
    }

    return res.json({ diagnosis: FALLBACK_DIAGNOSES.NPCI_UNSEEDED, source: 'heuristic' });
  } catch (error: any) {
    console.error('[SevaSutra] Diagnose route error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// API: Voice & Conversational Assistant (Krupa Voice Desk)
app.post('/api/voice-query', async (req, res) => {
  try {
    const { question, language, beneficiaryName, scheme } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (aiClient) {
      try {
        const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
        const prompt = `You are Krupa, the empathetic and gentle voice assistant for SEVA SUTRA, a civic-fintech service in India.
The user is an elderly person, widow, or person with disabilities, or their caregiver.
Beneficiary context: Name: ${beneficiaryName || 'Beneficiary'}, Scheme: ${scheme || 'Social Pension'}.
User Question: "${question}"
Target Language: ${langName}

Respond in 2-3 short, spoken-style, comforting, and crystal-clear sentences.
Avoid jargon. If mentioning Aadhaar, explain that the postman can come to the home if they cannot walk.
Output your reply in ${langName} script.`;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 4000)
        );

        const response: any = await Promise.race([
          aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          }),
          timeoutPromise
        ]);

        return res.json({
          reply: response.text?.trim(),
          source: 'gemini'
        });
      } catch (err) {
        console.warn('[SevaSutra] Gemini voice fallback:', err);
      }
    }

    // High quality offline fallback responses
    const lang = language || 'en';
    let reply = "Your pension is currently scheduled for direct bank transfer. If you haven't received it, check your Aadhaar link or call Elderline at 14567.";
    if (lang === 'te') {
      reply = "మీ పింఛను డీబీటీ ద్వారా నేరుగా బ్యాంక్ ఖాతాకు జమ అవుతుంది. ఆలస్యమైతే మీ పోస్ట్‌మ్యాన్ సహాయంతో డోర్‌స్టెప్ ఆధార్ సీడింగ్ చేయించుకోవచ్చు. సహాయం కోసం 14567 నంబర్‌కు కాల్ చేయండి.";
    } else if (lang === 'hi') {
      reply = "आपकी पेंशन सीधे आपके बैंक खाते में भेजी जाती है। यदि कोई समस्या है, तो आप डाकिया को घर बुलाकर आधार लिंकिंग करवा सकते हैं या हेल्पलाइन 14567 पर संपर्क करें।";
    }

    return res.json({ reply, source: 'heuristic' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Production static file serving or Vite development middleware
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SevaSutra] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SevaSutra] Failed to start server:', err);
});
