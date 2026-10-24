import React, { useState } from 'react';
import { Beneficiary, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  FolderCheck, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Camera, 
  Smartphone, 
  Download, 
  ShieldCheck, 
  FileCheck,
  Eye
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
  const [activeGuide, setActiveGuide] = useState<'FACE_AUTH' | 'POSTMAN_DOORSTEP' | null>(null);
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
      <div className="bg-white p-6 rounded-3xl border border-[#E2DAC7] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#087F68] text-white flex items-center justify-center shrink-0 shadow-md">
              <FolderCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-[#101B2D] font-heading">
                  {t.tabLocker} (Document Rakshak)
                </h2>
                <span className="bg-[#E8F5E9] text-[#087F68] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#087F68]/20">
                  DigiLocker Compliant
                </span>
              </div>
              <p className="text-sm text-[#4A5568] mt-1 max-w-2xl">
                Keep all essential verification records organized, monitor Digital Life Certificate deadlines, and prevent surprise payment freezes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveGuide('FACE_AUTH')}
              className="bg-[#087F68] hover:bg-[#066553] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Face DLC Guide</span>
            </button>
          </div>
        </div>
      </div>

      {uploadSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-400 p-4 rounded-2xl text-emerald-900 text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {/* Interactive Face DLC Guide Popup if opened */}
      {activeGuide === 'FACE_AUTH' && (
        <div className="bg-[#E8F5E9] border-2 border-[#087F68] p-6 rounded-3xl shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#087F68] font-heading flex items-center gap-2">
              <Camera className="w-5 h-5" />
              How to Submit Jeevan Pramaan from Home (Face Auth)
            </h3>
            <button
              onClick={() => setActiveGuide(null)}
              className="text-[#087F68] hover:text-[#066553] font-bold text-sm"
            >
              Close Guide ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-[#B7E4D3] space-y-1">
              <div className="font-bold text-[#101B2D] text-sm">Step 1: Install Official Apps</div>
              <p className="text-[#4A5568]">
                Install <strong>"AadhaarFaceRD"</strong> and <strong>"Jeevan Pramaan"</strong> apps from Google Play Store on any smartphone.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#B7E4D3] space-y-1">
              <div className="font-bold text-[#101B2D] text-sm">Step 2: Enter Pension Info</div>
              <p className="text-[#4A5568]">
                Type Pension ID <strong>{beneficiary.pensionId}</strong>, Aadhaar, and select your bank or district treasury.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#B7E4D3] space-y-1">
              <div className="font-bold text-[#101B2D] text-sm">Step 3: Blink at Front Camera</div>
              <p className="text-[#4A5568]">
                The app will prompt the elder or disabled person to look at the front camera and blink. No fingerprint device needed!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Digital Life Certificate Card */}
        <div className="bg-white rounded-2xl border border-[#E2DAC7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#087F68]" />
                <h3 className="font-bold text-[#101B2D] text-base">Digital Life Certificate</h3>
              </div>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                daysUntilDLC < 0
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : daysUntilDLC < 30
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
              }`}>
                {daysUntilDLC < 0 ? 'OVERDUE' : 'ACTIVE'}
              </span>
            </div>

            <p className="text-xs text-[#5A6A80] mb-3">
              Issued via Jeevan Pramaan UIDAI Face/Iris Gateway.
            </p>

            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E1D3] text-xs space-y-1">
              <div>Expiry Date: <strong>{beneficiary.jeevanPramaanValidUntil}</strong></div>
              <div>Status: <strong>{daysUntilDLC < 0 ? 'Pension suspended until renewal' : 'Valid and recognized'}</strong></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8E1D3] flex items-center justify-between">
            <button
              onClick={() => setActiveGuide('FACE_AUTH')}
              className="text-xs font-bold text-[#087F68] hover:underline"
            >
              Submit Face DLC
            </button>
            <button
              onClick={() => handleSimulateUpload('Digital Life Certificate (DLC)')}
              className="text-xs bg-[#FAF8F5] hover:bg-[#EAE2D2] border border-[#D5CBB8] px-2.5 py-1 rounded-lg font-semibold"
            >
              Upload New
            </button>
          </div>
        </div>

        {/* Aadhaar Card */}
        <div className="bg-white rounded-2xl border border-[#E2DAC7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#087F68]" />
                <h3 className="font-bold text-[#101B2D] text-base">Aadhaar Identity Card</h3>
              </div>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                VERIFIED
              </span>
            </div>

            <p className="text-xs text-[#5A6A80] mb-3">
              UIDAI e-KYC record for social security entitlements.
            </p>

            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E1D3] text-xs space-y-1">
              <div>Number: <strong>•••• •••• {beneficiary.aadhaarLastFour}</strong></div>
              <div>DBT Seeding: <strong className={beneficiary.npciAadhaarSeeded ? 'text-emerald-700' : 'text-red-700'}>
                {beneficiary.npciAadhaarSeeded ? 'Active in NPCI' : 'Not Seeded (AB-01)'}
              </strong></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8E1D3] flex items-center justify-between">
            <span className="text-[11px] text-[#5A6A80]">Linked to {beneficiary.bankName}</span>
            <button
              onClick={() => handleSimulateUpload('Aadhaar Copy')}
              className="text-xs bg-[#FAF8F5] hover:bg-[#EAE2D2] border border-[#D5CBB8] px-2.5 py-1 rounded-lg font-semibold"
            >
              Update Copy
            </button>
          </div>
        </div>

        {/* Bank Passbook */}
        <div className="bg-white rounded-2xl border border-[#E2DAC7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#087F68]" />
                <h3 className="font-bold text-[#101B2D] text-base">Bank Passbook</h3>
              </div>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                VALID
              </span>
            </div>

            <p className="text-xs text-[#5A6A80] mb-3">
              Designated single-holder DBT pension account.
            </p>

            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E1D3] text-xs space-y-1">
              <div>Bank: <strong>{beneficiary.bankName}</strong></div>
              <div>Account: <strong>•••• {beneficiary.accountLastFour}</strong></div>
              <div>IFSC: <strong className="font-mono-code">{beneficiary.ifscCode}</strong></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8E1D3] flex items-center justify-between">
            <span className="text-[11px] text-[#5A6A80]">PFMS Integrated</span>
            <button
              onClick={() => handleSimulateUpload('Bank Passbook Front Page')}
              className="text-xs bg-[#FAF8F5] hover:bg-[#EAE2D2] border border-[#D5CBB8] px-2.5 py-1 rounded-lg font-semibold"
            >
              Upload
            </button>
          </div>
        </div>

        {/* UDID Card (For Persons with Disabilities) */}
        {beneficiary.category === 'Person with Disability' && (
          <div className="bg-white rounded-2xl border border-[#E2DAC7] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#087F68]" />
                  <h3 className="font-bold text-[#101B2D] text-base">UDID Disability Card</h3>
                </div>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {beneficiary.disabilityPercentage}% DISABILITY
                </span>
              </div>

              <p className="text-xs text-[#5A6A80] mb-3">
                Unique Disability ID issued by Ministry of Social Justice.
              </p>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E1D3] text-xs space-y-1">
                <div>Card No: <strong className="font-mono-code">{beneficiary.udidCardNumber || 'TS-24-UDID-99214'}</strong></div>
                <div>Category: <strong>Locomotor / Physical Impairment</strong></div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8E1D3] flex items-center justify-between">
              <span className="text-[11px] text-[#5A6A80]">Permanent Certificate</span>
              <button
                onClick={() => handleSimulateUpload('UDID Card Copy')}
                className="text-xs bg-[#FAF8F5] hover:bg-[#EAE2D2] border border-[#D5CBB8] px-2.5 py-1 rounded-lg font-semibold"
              >
                Upload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
