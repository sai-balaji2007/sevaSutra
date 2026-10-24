import React, { useState } from 'react';
import { Beneficiary, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { StatusChip } from './StatusChip';
import { 
  FolderCheck, 
  FileText, 
  CheckCircle2, 
  Camera, 
  Smartphone, 
  ShieldCheck, 
  FileCheck,
  X
} from 'lucide-react';

interface DocumentRakshakTabProps {
  beneficiary: Beneficiary;
  language: Language;
  onSpeak: (text: string) => void;
}

export const DocumentRakshakTab: React.FC<DocumentRakshakTabProps> = ({
  beneficiary,
  language,
  onSpeak,
}) => {
  const t = TRANSLATIONS[language];
  const [activeGuide, setActiveGuide] = useState<'FACE_AUTH' | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const daysUntilDLC = Math.ceil(
    (new Date(beneficiary.jeevanPramaanValidUntil).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  const handleSimulateUpload = (docName: string) => {
    onSpeak(`Simulating verification and secure upload for ${docName}`);
    setUploadSuccessMessage(`Successfully encrypted and uploaded ${docName} to Government DigiLocker gateway.`);
    setTimeout(() => setUploadSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#D0D5DD] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#087F68] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FolderCheck className="w-6 h-6 text-[#A6F4C5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-[#111C2E] font-heading tracking-tight">
                  {t.tabLocker}
                </h2>
                <StatusChip variant="official" label="DigiLocker Aligned" source="MeitY" />
              </div>
              <p className="text-xs md:text-sm text-[#475467] mt-1 max-w-2xl leading-relaxed">
                Organize all identity documents, monitor Digital Life Certificate deadlines, and eliminate surprise pension holds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveGuide('FACE_AUTH')}
              className="bg-[#087F68] hover:bg-[#066553] text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-transform active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-[#A6F4C5]" />
              <span>Face DLC Mobile Guide</span>
            </button>
          </div>
        </div>
      </div>

      {uploadSuccessMessage && (
        <div className="bg-[#E7F4EF] border border-[#A6F4C5] p-4 rounded-xl text-[#087F68] text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#087F68] shrink-0" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {/* Interactive Face DLC Guide Popup if opened */}
      {activeGuide === 'FACE_AUTH' && (
        <div className="bg-[#E7F4EF] border border-[#A6F4C5] p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#087F68] font-heading flex items-center gap-2">
              <Camera className="w-4.5 h-4.5" />
              How to Submit Jeevan Pramaan from Home (Aadhaar Face Auth)
            </h3>
            <button
              onClick={() => setActiveGuide(null)}
              className="text-[#087F68] hover:text-[#066553] font-bold text-xs p-1 rounded-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-4 rounded-xl border border-[#D0D5DD] space-y-1">
              <div className="font-bold text-[#111C2E] text-xs font-heading">Step 1: Install Official Apps</div>
              <p className="text-[#475467] leading-relaxed">
                Download <strong>"AadhaarFaceRD"</strong> and <strong>"Jeevan Pramaan"</strong> apps from Google Play Store on any Android smartphone.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#D0D5DD] space-y-1">
              <div className="font-bold text-[#111C2E] text-xs font-heading">Step 2: Enter Pension Info</div>
              <p className="text-[#475467] leading-relaxed">
                Enter Pension ID <strong>{beneficiary.pensionId}</strong>, Aadhaar number, and select designated bank.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#D0D5DD] space-y-1">
              <div className="font-bold text-[#111C2E] text-xs font-heading">Step 3: Blink at Front Camera</div>
              <p className="text-[#475467] leading-relaxed">
                Look at the front camera in good daylight and blink twice. The Digital Life Certificate generates instantly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Digital Life Certificate Card */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4.5 h-4.5 text-[#087F68]" />
                <h3 className="font-bold text-[#111C2E] text-sm font-heading">Digital Life Certificate</h3>
              </div>
              <StatusChip 
                variant={daysUntilDLC < 0 ? 'high-risk' : daysUntilDLC < 30 ? 'attention' : 'completed'} 
                label={daysUntilDLC < 0 ? 'Overdue' : daysUntilDLC < 30 ? 'Expiring Soon' : 'Active'}
              />
            </div>

            <p className="text-xs text-[#475467] mb-3 leading-relaxed">
              Jeevan Pramaan annual life authentication certified via UIDAI Face/Iris Gateway.
            </p>

            <div className="bg-[#F8F9FA] p-3 rounded-lg border border-[#EAECF0] text-xs space-y-1">
              <div>Valid Until: <strong className="text-[#111C2E]">{beneficiary.jeevanPramaanValidUntil}</strong></div>
              <div>Timeline: <strong className={daysUntilDLC < 0 ? 'text-[#B42332]' : 'text-[#087F68]'}>
                {daysUntilDLC < 0 ? `Overdue by ${Math.abs(daysUntilDLC)} days` : `${daysUntilDLC} days remaining`}
              </strong></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F2F4F7] flex items-center justify-between">
            <button
              onClick={() => setActiveGuide('FACE_AUTH')}
              className="text-xs font-bold text-[#087F68] hover:underline cursor-pointer"
            >
              Face Auth Guide
            </button>
            <button
              onClick={() => handleSimulateUpload('Digital Life Certificate (DLC)')}
              className="text-xs bg-white hover:bg-[#F4F6F8] border border-[#D0D5DD] px-2.5 py-1 rounded-md font-semibold text-[#172033] cursor-pointer"
            >
              Upload Certificate
            </button>
          </div>
        </div>

        {/* Aadhaar Card */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#087F68]" />
                <h3 className="font-bold text-[#111C2E] text-sm font-heading">Aadhaar Card</h3>
              </div>
              <StatusChip variant="completed" label="UIDAI e-KYC" />
            </div>

            <p className="text-xs text-[#475467] mb-3 leading-relaxed">
              UIDAI national identity record mapped for social security entitlements.
            </p>

            <div className="bg-[#F8F9FA] p-3 rounded-lg border border-[#EAECF0] text-xs space-y-1">
              <div>Masked Number: <strong className="font-mono-code text-[#111C2E]">•••• •••• {beneficiary.aadhaarLastFour}</strong></div>
              <div>DBT APBS Status: <strong className={beneficiary.npciAadhaarSeeded ? 'text-[#087F68]' : 'text-[#B42332]'}>
                {beneficiary.npciAadhaarSeeded ? 'Seeded Active' : 'Not Seeded (AB-01)'}
              </strong></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F2F4F7] flex items-center justify-between">
            <span className="text-[11px] text-[#475467]">Linked to {beneficiary.bankName}</span>
            <button
              onClick={() => handleSimulateUpload('Aadhaar Copy')}
              className="text-xs bg-white hover:bg-[#F4F6F8] border border-[#D0D5DD] px-2.5 py-1 rounded-md font-semibold text-[#172033] cursor-pointer"
            >
              Update Copy
            </button>
          </div>
        </div>

        {/* Bank Passbook */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#087F68]" />
                <h3 className="font-bold text-[#111C2E] text-sm font-heading">Bank Passbook</h3>
              </div>
              <StatusChip variant="completed" label="PFMS Verified" />
            </div>

            <p className="text-xs text-[#475467] mb-3 leading-relaxed">
              Designated single-holder DBT pension account at {beneficiary.bankName}.
            </p>

            <div className="bg-[#F8F9FA] p-3 rounded-lg border border-[#EAECF0] text-xs space-y-1">
              <div>Account: <strong className="font-mono-code text-[#111C2E]">•••• •••• {beneficiary.accountLastFour}</strong></div>
              <div>IFSC: <strong className="font-mono-code text-[#111C2E]">{beneficiary.ifscCode}</strong></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F2F4F7] flex items-center justify-between">
            <span className="text-[11px] text-[#475467]">Verified on PFMS</span>
            <button
              onClick={() => handleSimulateUpload('Bank Passbook Front Page')}
              className="text-xs bg-white hover:bg-[#F4F6F8] border border-[#D0D5DD] px-2.5 py-1 rounded-md font-semibold text-[#172033] cursor-pointer"
            >
              Upload Passbook
            </button>
          </div>
        </div>

        {/* UDID Card (For Persons with Disabilities) */}
        {beneficiary.category === 'Person with Disability' && (
          <div className="bg-white rounded-2xl border border-[#D0D5DD] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-[#087F68]" />
                  <h3 className="font-bold text-[#111C2E] text-sm font-heading">UDID Disability Card</h3>
                </div>
                <StatusChip variant="official" label={`${beneficiary.disabilityPercentage}% Impairment`} source="DEPwD" />
              </div>

              <p className="text-xs text-[#475467] mb-3 leading-relaxed">
                Unique Disability Identity card issued by the Ministry of Social Justice.
              </p>

              <div className="bg-[#F8F9FA] p-3 rounded-lg border border-[#EAECF0] text-xs space-y-1">
                <div>Card No: <strong className="font-mono-code text-[#111C2E]">{beneficiary.udidCardNumber || 'TS-24-UDID-99214'}</strong></div>
                <div>Category: <strong className="text-[#111C2E]">Locomotor Impairment</strong></div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F2F4F7] flex items-center justify-between">
              <span className="text-[11px] text-[#475467]">Permanent Validity</span>
              <button
                onClick={() => handleSimulateUpload('UDID Card Copy')}
                className="text-xs bg-white hover:bg-[#F4F6F8] border border-[#D0D5DD] px-2.5 py-1 rounded-md font-semibold text-[#172033] cursor-pointer"
              >
                Upload UDID
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
