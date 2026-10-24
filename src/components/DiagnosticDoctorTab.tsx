import React, { useState } from 'react';
import { Beneficiary, FailureDiagnostic, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { KNOWLEDGE_BASE_DIAGNOSTICS } from '../data/mockData';
import { StatusChip } from './StatusChip';
import { 
  Stethoscope, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  PhoneCall, 
  ArrowRight,
  ShieldCheck,
  Building,
  HelpCircle,
  Smartphone,
  AlertOctagon
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
      {/* Header Banner - Restrained Navy & Emerald */}
      <div className="bg-[#111C2E] text-white p-6 rounded-2xl border border-[#1F2F4A] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#1A2840] rounded-xl border border-[#2D3E5D] shrink-0">
              <Stethoscope className="w-6 h-6 text-[#A6F4C5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-white tracking-tight">
                  {t.tabDiagnostic}
                </h2>
                <span className="bg-[#C5A267]/20 text-[#C5A267] text-xs font-semibold px-2 py-0.5 rounded-sm border border-[#C5A267]/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C5A267]" /> Civic Diagnostic Rules
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#98A2B3] mt-1 max-w-2xl leading-relaxed">
                Pinpoint why a social benefit payment was withheld, returned unpaid, or rejected by DBT gateways, and generate a clear action plan.
              </p>
            </div>
          </div>

          <div className="text-right hidden lg:block bg-[#1A2840] px-4 py-2.5 rounded-xl border border-[#2D3E5D] text-xs">
            <div className="text-[#98A2B3]">Target Beneficiary</div>
            <div className="font-bold text-white">{beneficiary.name}</div>
            <div className="text-[#C5A267] font-mono-code text-[11px]">{beneficiary.pensionId}</div>
          </div>
        </div>
      </div>

      {/* Interactive Symptom Input Box */}
      <div className="bg-white p-6 rounded-2xl border border-[#D0D5DD] shadow-xs space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#475467] flex items-center gap-1.5 mb-2.5">
            <HelpCircle className="w-4 h-4 text-[#087F68]" />
            Select Observed Disbursal Failure Symptom:
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
                      ? 'bg-[#E7F4EF] border-[#087F68] ring-1 ring-[#087F68] text-[#111C2E]'
                      : 'bg-white border-[#D0D5DD] hover:border-[#98A2B3] text-[#475467]'
                  }`}
                >
                  <div className="font-bold text-xs md:text-sm text-[#111C2E] mb-1 font-heading">
                    {preset.title}
                  </div>
                  <p className="text-xs text-[#475467] line-clamp-2 leading-relaxed">
                    {preset.symptom}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Symptom Box */}
        <div>
          <label className="text-xs font-bold text-[#475467] block mb-1.5">
            Or enter exact remarks from your bank SMS, DBT portal, or notice:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="e.g. Bank SMS says DBT failed with error code AB-01 or NPCI deactivated..."
              className="flex-1 bg-white border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-xs text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
            />
            <button
              onClick={handleRunDiagnosis}
              disabled={loading}
              className="bg-[#087F68] hover:bg-[#066553] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-xs flex items-center gap-2 shrink-0 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#A6F4C5]" />
                  <span>Diagnosing...</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-4 h-4 text-[#A6F4C5]" />
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
          <div className="bg-white rounded-2xl border border-[#D0D5DD] shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#D0D5DD] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <StatusChip 
                    variant={diagnosticResult.severity === 'CRITICAL' ? 'high-risk' : 'attention'} 
                    label={`${diagnosticResult.severity} ROOT CAUSE`}
                  />
                  <span className="text-xs text-[#475467] font-mono-code font-bold">
                    CODE: {diagnosticResult.errorCode}
                  </span>
                </div>

                <div className="text-xs text-[#087F68] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> SEVA SUTRA Protocol Validated
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-[#111C2E] mt-3 font-heading">
                {diagnosticResult.title}
              </h3>

              <p className="text-xs md:text-sm text-[#344054] mt-2 font-medium leading-relaxed">
                {diagnosticResult.summary}
              </p>
            </div>

            {/* Root Cause Details */}
            <div className="p-6 bg-[#F8F9FA] border-b border-[#D0D5DD]">
              <h4 className="text-xs font-bold text-[#475467] uppercase tracking-wider mb-2">
                Civic & Banking Technical Explanation
              </h4>
              <div className="bg-white p-4 rounded-xl border border-[#D0D5DD] text-xs text-[#172033] leading-relaxed">
                {diagnosticResult.rootCause}
              </div>
            </div>

            {/* Action Steps Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-[#111C2E] font-heading flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#087F68]" />
                  {t.actionStepsTitle}
                </h4>
                <span className="text-xs text-[#475467]">
                  Execute in indicated sequence
                </span>
              </div>

              <div className="space-y-3">
                {diagnosticResult.actionSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-xl border border-[#D0D5DD] bg-white hover:border-[#087F68]/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-[#111C2E] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h5 className="text-sm font-bold text-[#111C2E] font-heading">
                          {step.title}
                        </h5>
                      </div>

                      {step.isDigitalSelfService ? (
                        <StatusChip variant="completed" label="Doorstep / Mobile Service" />
                      ) : (
                        <StatusChip variant="attention" label="In-Person Office Visit" />
                      )}
                    </div>

                    <p className="text-xs text-[#475467] ml-8.5 leading-relaxed">
                      {step.detail}
                    </p>

                    {step.officeToVisit && (
                      <div className="ml-8.5 mt-2 text-xs font-semibold text-[#087F68]">
                        Designated Location: <span className="text-[#111C2E] font-normal">{step.officeToVisit}</span>
                      </div>
                    )}

                    {step.documentsRequired?.length > 0 && (
                      <div className="ml-8.5 mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#475467]">Required Documents:</span>
                        {step.documentsRequired.map((doc, dIdx) => (
                          <span
                            key={dIdx}
                            className="text-[10px] bg-[#F2F4F7] border border-[#D0D5DD] text-[#172033] px-2 py-0.5 rounded-sm font-medium"
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
            <div className="mx-6 mb-6 p-4 rounded-xl bg-[#E7F4EF] border border-[#A6F4C5] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#087F68] text-white flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4.5 h-4.5 text-[#A6F4C5]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#087F68]">
                    Cannot travel to bank branch? Book Doorstep Postman Assistance
                  </div>
                  <div className="text-[11px] text-[#475467]">
                    India Post Payments Bank postmen can seed Aadhaar DBT & generate Jeevan Pramaan at your doorstep.
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold bg-white text-[#087F68] px-3 py-1.5 rounded-md border border-[#A6F4C5] shrink-0 font-mono-code">
                Toll-Free: 155299
              </div>
            </div>
          </div>

          {/* Generated Official Grievance Petition Card */}
          <div className="bg-white rounded-2xl border border-[#D0D5DD] shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-[#111C2E] font-heading flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-[#087F68]" />
                  Auto-Generated Formal Representation
                </h4>
                <p className="text-xs text-[#475467]">
                  Ready-to-print petition formatted as per Public Grievances guidelines
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyGrievance}
                  className="bg-white hover:bg-[#F4F6F8] text-[#172033] border border-[#D0D5DD] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedGrievance ? <Check className="w-3.5 h-3.5 text-[#087F68]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGrievance ? 'Copied' : t.copyGrievance}</span>
                </button>

                <button
                  onClick={handlePrintGrievance}
                  className="bg-white hover:bg-[#F4F6F8] text-[#172033] border border-[#D0D5DD] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
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
            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#D0D5DD] text-xs space-y-2.5">
              <div className="text-[11px] text-[#475467]">
                ADDRESSED TO: <span className="text-[#111C2E] font-bold">{diagnosticResult.officialGrievanceDraft.authorityAddressed}</span>
              </div>
              <div className="text-[11px] text-[#475467]">
                SUBJECT: <span className="text-[#111C2E] font-bold">{diagnosticResult.officialGrievanceDraft.subject}</span>
              </div>
              <div className="pt-2 border-t border-[#D0D5DD] whitespace-pre-wrap text-[#172033] leading-relaxed text-xs">
                {diagnosticResult.officialGrievanceDraft.bodyText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
