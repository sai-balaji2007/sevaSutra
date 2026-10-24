import React, { useState } from 'react';
import { Beneficiary, FailureDiagnostic, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { KNOWLEDGE_BASE_DIAGNOSTICS } from '../data/mockData';
import { 
  Stethoscope, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  PhoneCall, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  Building,
  HelpCircle,
  Smartphone
} from 'lucide-react';

interface DiagnosticDoctorTabProps {
  beneficiary: Beneficiary;
  language: Language;
  onNavigateToGrievance: (text?: string) => void;
  onSpeak: (text: string) => void;
}

export const DiagnosticDoctorTab: React.FC<DiagnosticDoctorTabProps> = ({
  beneficiary,
  language,
  onNavigateToGrievance,
  onSpeak,
}) => {
  const t = TRANSLATIONS[language];

  // Presets of common Indian civic failure symptoms
  const symptomPresets = [
    {
      id: 'NPCI_UNSEEDED',
      title: 'Aadhaar Not Seeded in NPCI / DBT Failure AB-01',
      symptom: 'Payment stopped after bank merger or account dormancy. Bank says Aadhaar is linked, but government portal says "Rejected by DBT".'
    },
    {
      id: 'DLC_EXPIRED',
      title: 'Digital Life Certificate (Jeevan Pramaan) Expired',
      symptom: 'Annual 12-month life proof overdue. Kiosk fingerprint failed due to faint or worn-out fingerprints.'
    },
    {
      id: 'PFMS_NAME_MISMATCH',
      title: 'Name Spelling Mismatch Between Aadhaar & Passbook',
      symptom: 'PFMS rejected the payment mandate due to minor spelling discrepancy in beneficiary name.'
    }
  ];

  const [selectedSymptom, setSelectedSymptom] = useState<string>(
    !beneficiary.npciAadhaarSeeded 
      ? symptomPresets[0].symptom 
      : (beneficiary.jeevanPramaanValidUntil < new Date().toISOString().split('T')[0])
        ? symptomPresets[1].symptom
        : symptomPresets[0].symptom
  );

  const [customSymptom, setCustomSymptom] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<FailureDiagnostic | null>(() => {
    // Initial diagnosis based on beneficiary status
    if (!beneficiary.npciAadhaarSeeded) return KNOWLEDGE_BASE_DIAGNOSTICS.NPCI_UNSEEDED;
    if (beneficiary.jeevanPramaanValidUntil < new Date().toISOString().split('T')[0]) return KNOWLEDGE_BASE_DIAGNOSTICS.DLC_EXPIRED;
    return KNOWLEDGE_BASE_DIAGNOSTICS.NPCI_UNSEEDED;
  });

  const [copiedGrievance, setCopiedGrievance] = useState<boolean>(false);

  const handleRunDiagnosis = async () => {
    setLoading(true);
    const symptomToDiagnose = customSymptom.trim() || selectedSymptom;
    onSpeak('Analyzing payment records and government portal logs with SEVA SUTRA diagnostic engine.');

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beneficiary,
          symptom: symptomToDiagnose,
          preferredLanguage: language
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.diagnosis) {
          setDiagnosticResult(data.diagnosis);
          onSpeak(`Diagnosis complete: ${data.diagnosis.title}. Follow the ${data.diagnosis.actionSteps?.length || 3} action steps shown.`);
        }
      } else {
        // Fallback to local heuristic
        setDiagnosticResult(KNOWLEDGE_BASE_DIAGNOSTICS.NPCI_UNSEEDED);
      }
    } catch (err) {
      console.warn('Diagnosis error, using heuristic:', err);
      setDiagnosticResult(KNOWLEDGE_BASE_DIAGNOSTICS.NPCI_UNSEEDED);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyGrievance = () => {
    if (!diagnosticResult) return;
    const fullText = `SUBJECT: ${diagnosticResult.officialGrievanceDraft.subject}\nTO: ${diagnosticResult.officialGrievanceDraft.authorityAddressed}\n\n${diagnosticResult.officialGrievanceDraft.bodyText}`;
    navigator.clipboard.writeText(fullText);
    setCopiedGrievance(true);
    setTimeout(() => setCopiedGrievance(false), 2500);
    onSpeak('Official grievance letter copied to clipboard');
  };

  const handlePrintGrievance = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#087F68] to-[#055C4B] text-white p-6 rounded-3xl shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs ring-1 ring-white/20">
              <Stethoscope className="w-8 h-8 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-heading">
                  {t.tabDiagnostic}
                </h2>
                <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> AI-Assisted Civic Engine
                </span>
              </div>
              <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
                Pinpoint why a pension was withheld, returned unpaid, or rejected by DBT, and receive a guaranteed remediation blueprint.
              </p>
            </div>
          </div>

          <div className="text-right hidden lg:block bg-black/10 px-4 py-2 rounded-xl text-xs">
            <div className="text-emerald-200 font-medium">Beneficiary Target</div>
            <div className="font-bold">{beneficiary.name}</div>
            <div className="text-white/80 font-mono-code">{beneficiary.pensionId}</div>
          </div>
        </div>
      </div>

      {/* Interactive Symptom Input Box */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2DAC7] shadow-xs space-y-4">
        <div>
          <label className="text-sm font-bold text-[#101B2D] flex items-center gap-1.5 mb-2">
            <HelpCircle className="w-4 h-4 text-[#087F68]" />
            Select what happened to the payment or describe the problem:
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {symptomPresets.map((preset) => {
              const isSelected = selectedSymptom === preset.symptom && !customSymptom;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedSymptom(preset.symptom);
                    setCustomSymptom('');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F5E9] border-[#087F68] ring-2 ring-[#087F68]/20 text-[#101B2D]'
                      : 'bg-[#FAF8F5] border-[#E8E1D3] hover:border-[#D5CBB8] text-[#4A5568]'
                  }`}
                >
                  <div className="font-bold text-xs md:text-sm text-[#101B2D] mb-1">
                    {preset.title}
                  </div>
                  <p className="text-xs text-[#5A6A80] line-clamp-2">
                    {preset.symptom}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Symptom Box */}
        <div>
          <label className="text-xs font-semibold text-[#5A6A80] block mb-1">
            Or type / paste specific remarks from your bank or Sachivalayam notice:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="e.g. Bank SMS says DBT failed with error code AB-01 or NPCI deactivated..."
              className="flex-1 bg-[#FAF8F5] border border-[#D5CBB8] rounded-xl px-4 py-2.5 text-sm text-[#101B2D] focus:outline-none focus:ring-2 focus:ring-[#087F68] focus:bg-white"
            />
            <button
              onClick={handleRunDiagnosis}
              disabled={loading}
              className="bg-[#087F68] hover:bg-[#066553] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 shrink-0 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
                  <span>Diagnosing...</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-4 h-4 text-emerald-200" />
                  <span>{t.runDiagnostic}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Diagnosis Results Section */}
      {diagnosticResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Diagnosis Card */}
          <div className="bg-white rounded-3xl border border-[#E2DAC7] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#E2DAC7] bg-[#FAF8F5]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    diagnosticResult.severity === 'CRITICAL'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {diagnosticResult.severity} ISSUE
                  </span>
                  <span className="text-xs text-[#5A6A80] font-mono-code font-bold">
                    CODE: {diagnosticResult.errorCode}
                  </span>
                </div>

                <div className="text-xs text-[#087F68] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> SEVA SUTRA Remediation Protocol
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-[#101B2D] mt-3 font-heading">
                {diagnosticResult.title}
              </h3>

              <p className="text-base text-[#2D3748] mt-2 font-medium">
                {diagnosticResult.summary}
              </p>
            </div>

            {/* Root Cause Details */}
            <div className="p-6 bg-white border-b border-[#E2DAC7]">
              <h4 className="text-xs font-bold text-[#5A6A80] uppercase tracking-wider mb-2">
                Why Did This Happen? (Civic & Technical Root Cause)
              </h4>
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E1D3] text-sm text-[#101B2D] leading-relaxed">
                {diagnosticResult.rootCause}
              </div>
            </div>

            {/* Action Steps Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-[#101B2D] font-heading flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#087F68]" />
                  {t.actionStepsTitle}
                </h4>
                <span className="text-xs text-[#5A6A80]">
                  Follow in sequential order
                </span>
              </div>

              <div className="space-y-4">
                {diagnosticResult.actionSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-2xl border border-[#E2DAC7] bg-[#FDFBF7] hover:border-[#087F68]/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[#087F68] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h5 className="text-base font-bold text-[#101B2D]">
                          {step.title}
                        </h5>
                      </div>

                      {step.isDigitalSelfService ? (
                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" /> Doorstep / Mobile Action
                        </span>
                      ) : (
                        <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Building className="w-3.5 h-3.5" /> In-Person Office Visit
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#4A5568] ml-9 leading-relaxed">
                      {step.detail}
                    </p>

                    {step.officeToVisit && (
                      <div className="ml-9 mt-2 text-xs font-semibold text-[#087F68]">
                        Where to go: <span className="text-[#101B2D] font-normal">{step.officeToVisit}</span>
                      </div>
                    )}

                    {step.documentsRequired?.length > 0 && (
                      <div className="ml-9 mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#5A6A80]">Documents to carry:</span>
                        {step.documentsRequired.map((doc, dIdx) => (
                          <span
                            key={dIdx}
                            className="text-[11px] bg-white border border-[#D5CBB8] text-[#101B2D] px-2 py-0.5 rounded-md font-medium"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Fast Assistance Callout: Doorstep Postman */}
            <div className="mx-6 mb-6 p-4 rounded-2xl bg-[#E8F5E9] border border-[#087F68]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#087F68] text-white flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#087F68]">
                    Cannot travel to the bank? Request Doorstep Postman Visit
                  </div>
                  <div className="text-xs text-[#2E7D32]">
                    India Post Payments Bank postmen can seed Aadhaar DBT & generate Jeevan Pramaan at your home.
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold bg-white text-[#087F68] px-3 py-1.5 rounded-lg border border-[#087F68]/30 shrink-0">
                Toll-Free: 155299
              </div>
            </div>
          </div>

          {/* Generated Official Grievance Petition Card */}
          <div className="bg-white rounded-3xl border border-[#E2DAC7] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-[#101B2D] font-heading flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#087F68]" />
                  Auto-Generated Official Grievance Petition
                </h4>
                <p className="text-xs text-[#5A6A80]">
                  Ready-to-print representation addressed to the competent authority
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyGrievance}
                  className="bg-[#FAF8F5] hover:bg-[#EAE2D2] text-[#101B2D] border border-[#D5CBB8] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedGrievance ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedGrievance ? 'Copied!' : t.copyGrievance}</span>
                </button>

                <button
                  onClick={handlePrintGrievance}
                  className="bg-[#FAF8F5] hover:bg-[#EAE2D2] text-[#101B2D] border border-[#D5CBB8] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => onNavigateToGrievance(diagnosticResult.officialGrievanceDraft.bodyText)}
                  className="bg-[#087F68] hover:bg-[#066553] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>File in Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Letter Preview Frame */}
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8E1D3] font-sans text-sm space-y-3">
              <div className="text-xs font-semibold text-[#5A6A80]">
                ADDRESSED TO: <span className="text-[#101B2D] font-bold">{diagnosticResult.officialGrievanceDraft.authorityAddressed}</span>
              </div>
              <div className="text-xs font-semibold text-[#5A6A80]">
                SUBJECT: <span className="text-[#101B2D] font-bold">{diagnosticResult.officialGrievanceDraft.subject}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E1D3] whitespace-pre-wrap text-[#2D3748] leading-relaxed text-xs md:text-sm">
                {diagnosticResult.officialGrievanceDraft.bodyText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
