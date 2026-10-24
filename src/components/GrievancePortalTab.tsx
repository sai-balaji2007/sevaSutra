import React, { useState } from 'react';
import { Beneficiary, GrievancePetition, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  FileText, 
  Send, 
  Clock, 
  CheckCircle2, 
  Printer, 
  AlertCircle, 
  Building2, 
  Scale, 
  Copy, 
  Check,
  ShieldAlert
} from 'lucide-react';

interface GrievancePortalTabProps {
  beneficiary: Beneficiary;
  language: Language;
  initialText?: string;
  onSpeak: (text: string) => void;
}

export const GrievancePortalTab: React.FC<GrievancePortalTabProps> = ({
  beneficiary,
  language,
  initialText = '',
  onSpeak,
}) => {
  const t = TRANSLATIONS[language];

  const [petitions, setPetitions] = useState<GrievancePetition[]>([
    {
      id: 'GRV-01',
      trackingNumber: 'CPGRAMS/2026/AP/90214',
      dateCreated: '2026-10-18',
      beneficiaryName: beneficiary.name,
      pensionId: beneficiary.pensionId,
      authority: 'District Collector & Magistrate / DRDA Office',
      issueCategory: 'Delayed Pension Disbursal & NPCI DBT Error AB-01',
      status: 'UNDER_REVIEW',
      expectedTurnaroundDays: 7,
      content: `To the District Collector & Magistrate,

Sub: Request for immediate rectification of Aadhaar DBT Seeding and release of held pension.
Ref: Pension ID ${beneficiary.pensionId}.

I am ${beneficiary.name}, age ${beneficiary.age}, residing in ${beneficiary.district}. My social security pension for September and October 2026 was blocked by the DBT gateway due to an unmapped Aadhaar mandate following a bank branch merger. 

I request your urgent intervention to direct the Lead District Bank Manager and Welfare Officer to process my grievance within the citizen charter timeline.

Yours sincerely,
${beneficiary.name}`
    }
  ]);

  const [authority, setAuthority] = useState('Lead District Bank Manager (LDM)');
  const [issueCategory, setIssueCategory] = useState('Aadhaar Seeding / NPCI Mapper Error');
  const [petitionText, setPetitionText] = useState(
    initialText ||
    `Respected Authority,\n\nI am ${beneficiary.name}, holding Pension ID ${beneficiary.pensionId} under ${beneficiary.schemeTitle}.\nMy monthly pension of ₹${beneficiary.monthlyAmount} has been delayed / returned unpaid.\n\nKindly resolve the technical error on the DBT portal and release the held dues to my bank account ending in ${beneficiary.accountLastFour} at ${beneficiary.bankName}.\n\nThanking you,\nYours sincerely,\n${beneficiary.name}`
  );

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  const handleSubmitPetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petitionText.trim()) return;

    const newTracking = `SS-GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPetition: GrievancePetition = {
      id: `GRV-${Date.now()}`,
      trackingNumber: newTracking,
      dateCreated: new Date().toISOString().split('T')[0],
      beneficiaryName: beneficiary.name,
      pensionId: beneficiary.pensionId,
      authority,
      issueCategory,
      status: 'SUBMITTED',
      expectedTurnaroundDays: 5,
      content: petitionText
    };

    setPetitions([newPetition, ...petitions]);
    setSubmissionSuccess(newTracking);
    onSpeak(`Grievance petition successfully submitted with tracking number ${newTracking}. Government turnaround is 5 working days.`);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
    onSpeak('Petition text copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2DAC7] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#087F68] text-white flex items-center justify-center shrink-0 shadow-md">
              <Scale className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-[#101B2D] font-heading">
                  {t.tabGrievance}
                </h2>
                <span className="bg-[#E8F5E9] text-[#087F68] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#087F68]/20">
                  Citizen Charter 7-Day Guarantee
                </span>
              </div>
              <p className="text-sm text-[#4A5568] mt-1 max-w-2xl">
                Generate and submit legally structured representations to District Collectors, Bank Ombudsmen, or Municipal Commissioners with real-time tracking tokens.
              </p>
            </div>
          </div>
        </div>
      </div>

      {submissionSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-5 rounded-2xl text-emerald-950 text-sm space-y-1 animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-base text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Petition Submitted to Civic Authority!
          </div>
          <div>Your official grievance tracking number is: <strong className="font-mono-code text-base text-[#087F68]">{submissionSuccess}</strong></div>
          <div className="text-xs text-emerald-800">
            Under the Public Grievance Redressal Act, the authority must acknowledge and provide action status within 5-7 working days.
          </div>
        </div>
      )}

      {/* Petition Creation Form */}
      <div className="bg-white rounded-3xl border border-[#E2DAC7] p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#101B2D] font-heading flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#087F68]" />
          Draft & Submit New Grievance Petition
        </h3>

        <form onSubmit={handleSubmitPetition} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5A6A80] mb-1">
                Authority to Address *
              </label>
              <select
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CBB8] rounded-xl px-3.5 py-2.5 text-[#101B2D] font-medium focus:outline-none focus:ring-2 focus:ring-[#087F68]"
              >
                <option value="Lead District Bank Manager (LDM)">Lead District Bank Manager (LDM) — For DBT/NPCI Errors</option>
                <option value="District Collector & Magistrate / DRDA">District Collector & Magistrate / DRDA Office</option>
                <option value="Mandal Parishad Development Officer (MPDO)">Mandal Parishad Development Officer (MPDO) / Municipality</option>
                <option value="Banking Ombudsman (RBI)">Banking Ombudsman (RBI) — For Unresolved Bank Delay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A6A80] mb-1">
                Issue Category *
              </label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CBB8] rounded-xl px-3.5 py-2.5 text-[#101B2D] font-medium focus:outline-none focus:ring-2 focus:ring-[#087F68]"
              >
                <option value="Aadhaar Seeding / NPCI Mapper Error">Aadhaar Seeding / NPCI Mapper Error (AB-01)</option>
                <option value="Life Certificate Biometric Kiosk Failure">Life Certificate Biometric Kiosk Failure</option>
                <option value="Name Spelling Discrepancy on PFMS">Name Spelling Discrepancy on PFMS</option>
                <option value="Unexplained Stoppage of Monthly Pension">Unexplained Stoppage of Monthly Pension</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5A6A80] mb-1">
              Petition Body Text *
            </label>
            <textarea
              rows={6}
              value={petitionText}
              onChange={(e) => setPetitionText(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D5CBB8] rounded-xl p-4 text-[#101B2D] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#087F68] leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-[#5A6A80]">
              Auto-filled with details for: <strong>{beneficiary.name}</strong> ({beneficiary.pensionId})
            </div>

            <button
              type="submit"
              className="bg-[#087F68] hover:bg-[#066553] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit Formal Representation</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Petitions & Tracking History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#101B2D] font-heading flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#087F68]" />
          My Filed Petitions & Live Tracking
        </h3>

        <div className="space-y-3">
          {petitions.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-2xl border border-[#E2DAC7] p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E1D3]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-sm text-[#087F68]">
                      {pet.trackingNumber}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      pet.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : pet.status === 'UNDER_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {pet.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-[#5A6A80] mt-0.5">
                    Addressed to: <strong>{pet.authority}</strong> • Category: {pet.issueCategory}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => handleCopy(pet.content, pet.id)}
                    className="p-1.5 rounded-lg border border-[#D5CBB8] hover:bg-[#FAF8F5] text-[#101B2D] flex items-center gap-1"
                  >
                    {copiedId === pet.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === pet.id ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg border border-[#D5CBB8] hover:bg-[#FAF8F5] text-[#101B2D] flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E1D3] text-xs text-[#2D3748] whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                {pet.content}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5A6A80]">
                <span>Filed on: {pet.dateCreated}</span>
                <span>Expected Resolution: <strong>{pet.expectedTurnaroundDays} business days</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
