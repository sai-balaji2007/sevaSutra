import React, { useState } from 'react';
import { Beneficiary, GrievancePetition, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { StatusChip } from './StatusChip';
import { 
  FileText, 
  Send, 
  Clock, 
  CheckCircle2, 
  Printer, 
  Scale, 
  Copy, 
  Check
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
      <div className="bg-white p-6 rounded-2xl border border-[#D0D5DD] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#087F68] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Scale className="w-6 h-6 text-[#A6F4C5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-[#111C2E] font-heading tracking-tight">
                  {t.tabGrievance}
                </h2>
                <StatusChip variant="official" label="Citizen Charter" source="CP-GRAMS" />
              </div>
              <p className="text-xs md:text-sm text-[#475467] mt-1 max-w-2xl leading-relaxed">
                Generate and submit legally structured representations to District Collectors, Bank Ombudsmen, or Municipal Commissioners with real-time tracking tokens.
              </p>
            </div>
          </div>
        </div>
      </div>

      {submissionSuccess && (
        <div className="bg-[#E7F4EF] border border-[#A6F4C5] p-5 rounded-2xl text-xs space-y-1.5 animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-sm text-[#087F68]">
            <CheckCircle2 className="w-4 h-4 text-[#087F68]" />
            Petition Submitted to Civic Authority
          </div>
          <div className="text-[#172033]">
            Tracking Number: <strong className="font-mono-code text-[#087F68]">{submissionSuccess}</strong>
          </div>
          <div className="text-[#475467]">
            Under the Public Grievance Redressal Act, the authority must acknowledge and provide action status within 5–7 working days.
          </div>
        </div>
      )}

      {/* Petition Creation Form */}
      <div className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#111C2E] font-heading flex items-center gap-2">
          <FileText className="w-4.5 h-4.5 text-[#087F68]" />
          Draft & Submit Formal Representation
        </h3>

        <form onSubmit={handleSubmitPetition} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#344054] mb-1">
                Addressed Civic Authority *
              </label>
              <select
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
              >
                <option value="Lead District Bank Manager (LDM)">Lead District Bank Manager (LDM) — For DBT/NPCI Errors</option>
                <option value="District Collector & Magistrate / DRDA">District Collector & Magistrate / DRDA Office</option>
                <option value="Mandal Parishad Development Officer (MPDO)">Mandal Parishad Development Officer (MPDO) / Municipality</option>
                <option value="Banking Ombudsman (RBI)">Banking Ombudsman (RBI) — For Unresolved Bank Delay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#344054] mb-1">
                Grievance Issue Category *
              </label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
                className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
              >
                <option value="Aadhaar Seeding / NPCI Mapper Error">Aadhaar Seeding / NPCI Mapper Error (AB-01)</option>
                <option value="Life Certificate Biometric Kiosk Failure">Life Certificate Biometric Kiosk Failure</option>
                <option value="Name Spelling Discrepancy on PFMS">Name Spelling Discrepancy on PFMS</option>
                <option value="Unexplained Stoppage of Monthly Pension">Unexplained Stoppage of Monthly Pension</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#344054] mb-1">
              Petition Body Text *
            </label>
            <textarea
              rows={5}
              value={petitionText}
              onChange={(e) => setPetitionText(e.target.value)}
              className="w-full bg-white border border-[#D0D5DD] rounded-lg p-3.5 text-[#172033] text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#087F68] leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F2F4F7]">
            <div className="text-[11px] text-[#475467]">
              Pre-filled with authenticated details for: <strong>{beneficiary.name}</strong> ({beneficiary.pensionId})
            </div>

            <button
              type="submit"
              className="bg-[#087F68] hover:bg-[#066553] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Formal Representation</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Petitions & Tracking History */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[#111C2E] font-heading flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-[#087F68]" />
          My Filed Petitions & Real-Time Tracking
        </h3>

        <div className="space-y-3">
          {petitions.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-2xl border border-[#D0D5DD] p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#F2F4F7]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-xs text-[#087F68]">
                      {pet.trackingNumber}
                    </span>
                    <StatusChip 
                      variant={pet.status === 'RESOLVED' ? 'completed' : 'pending'} 
                      label={pet.status.replace('_', ' ')}
                    />
                  </div>
                  <div className="text-xs text-[#475467] mt-0.5">
                    Authority: <strong>{pet.authority}</strong> • Subject: {pet.issueCategory}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => handleCopy(pet.content, pet.id)}
                    className="p-1.5 rounded-md border border-[#D0D5DD] hover:bg-[#F4F6F8] text-[#172033] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === pet.id ? <Check className="w-3.5 h-3.5 text-[#087F68]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === pet.id ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-md border border-[#D0D5DD] hover:bg-[#F4F6F8] text-[#172033] flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#F8F9FA] p-3 rounded-xl border border-[#EAECF0] text-xs text-[#172033] whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                {pet.content}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#475467]">
                <span>Filed: {pet.dateCreated}</span>
                <span>Turnaround: <strong>{pet.expectedTurnaroundDays} business days</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
