import React from 'react';
import { Beneficiary, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Landmark, 
  Fingerprint, 
  CreditCard, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  FileCheck2,
  Stethoscope,
  Building2,
  HelpCircle
} from 'lucide-react';

interface StatusTrackerTabProps {
  beneficiary: Beneficiary;
  language: Language;
  onNavigateToDiagnostic: () => void;
  onSpeak: (text: string) => void;
}

export const StatusTrackerTab: React.FC<StatusTrackerTabProps> = ({
  beneficiary,
  language,
  onNavigateToDiagnostic,
  onSpeak,
}) => {
  const t = TRANSLATIONS[language];

  // Check if there is an active failure
  const hasFailedStage = beneficiary.timeline.some(step => step.status === 'failed');
  const recentPayment = beneficiary.paymentHistory[0];
  const isPaymentBlocked = recentPayment && (recentPayment.status === 'FAILED' || recentPayment.status === 'ON_HOLD');

  const daysUntilDLC = Math.ceil(
    (new Date(beneficiary.jeevanPramaanValidUntil).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  return (
    <div className="space-y-6">
      {/* High Priority Critical Alert Banner if payment is blocked */}
      {isPaymentBlocked && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-amber-950 font-heading">
                    {language === 'te' 
                      ? 'హెచ్చరిక: మీ నెలవారీ పింఛను చెల్లింపు నిలిచిపోయింది'
                      : language === 'hi' 
                        ? 'चेतावनी: आपकी मासिक पेंशन का भुगतान रुक गया है' 
                        : 'Alert: Your Monthly Pension Disbursal is Blocked'}
                  </h3>
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-300">
                    {recentPayment?.status}
                  </span>
                </div>
                <p className="text-sm text-amber-900 mt-1 font-medium">
                  {recentPayment?.failureReason || 'Government treasury released payment, but processing failed at payment bridge.'}
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  Affecting: {recentPayment?.month} (₹{recentPayment?.amount.toLocaleString('en-IN')})
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onSpeak('Opening Payment Delay Doctor to analyze the exact cause and generate your remedy plan');
                onNavigateToDiagnostic();
              }}
              className="bg-[#087F68] hover:bg-[#066553] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer ring-2 ring-[#087F68]/20"
            >
              <Stethoscope className="w-5 h-5 text-emerald-200" />
              <span>{t.diagnoseButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Amount */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2DAC7] shadow-xs hover:border-[#087F68]/40 transition-colors">
          <div className="flex items-center justify-between text-[#5A6A80] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.monthlyPension}</span>
            <Building2 className="w-4 h-4 text-[#087F68]" />
          </div>
          <div className="text-3xl font-extrabold text-[#101B2D] font-heading">
            ₹{beneficiary.monthlyAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-[#5A6A80] mt-1 font-medium">
            Disbursal: 1st of every month via DBT
          </p>
        </div>

        {/* NPCI Aadhaar Seeding */}
        <div className={`p-5 rounded-2xl border shadow-xs transition-colors ${
          beneficiary.npciAadhaarSeeded 
            ? 'bg-white border-[#E2DAC7]' 
            : 'bg-red-50/70 border-red-300'
        }`}>
          <div className="flex items-center justify-between text-[#5A6A80] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.aadhaarLinked}</span>
            <Fingerprint className={`w-4 h-4 ${beneficiary.npciAadhaarSeeded ? 'text-[#087F68]' : 'text-red-600'}`} />
          </div>
          <div className="flex items-center gap-2">
            {beneficiary.npciAadhaarSeeded ? (
              <span className="inline-flex items-center gap-1.5 text-base font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t.seeded}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-base font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded-lg">
                <XCircle className="w-4 h-4 text-red-600" /> {t.notSeeded}
              </span>
            )}
          </div>
          <p className="text-xs text-[#5A6A80] mt-2">
            Aadhaar: **** **** {beneficiary.aadhaarLastFour}
          </p>
        </div>

        {/* Jeevan Pramaan / Digital Life Certificate */}
        <div className={`p-5 rounded-2xl border shadow-xs transition-colors ${
          daysUntilDLC < 0 
            ? 'bg-red-50/70 border-red-300' 
            : daysUntilDLC < 30 
              ? 'bg-amber-50/70 border-amber-300' 
              : 'bg-white border-[#E2DAC7]'
        }`}>
          <div className="flex items-center justify-between text-[#5A6A80] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.jeevanPramaan}</span>
            <FileCheck2 className="w-4 h-4 text-[#087F68]" />
          </div>
          <div className="flex items-center gap-2">
            {daysUntilDLC < 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-lg">
                <AlertTriangle className="w-4 h-4" /> {t.expired}
              </span>
            ) : (
              <span className="text-sm font-bold text-[#101B2D]">
                {t.validUntil} {new Date(beneficiary.jeevanPramaanValidUntil).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className={`text-xs mt-2 font-medium ${daysUntilDLC < 0 ? 'text-red-700 font-bold' : 'text-[#5A6A80]'}`}>
            {daysUntilDLC < 0 
              ? `Expired ${Math.abs(daysUntilDLC)} days ago` 
              : `${daysUntilDLC} days remaining`}
          </p>
        </div>

        {/* Disbursal Bank Details */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2DAC7] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6A80] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Designated Bank</span>
            <Landmark className="w-4 h-4 text-[#087F68]" />
          </div>
          <div className="text-base font-bold text-[#101B2D] truncate">
            {beneficiary.bankName}
          </div>
          <p className="text-xs text-[#5A6A80] mt-1 font-mono-code">
            Acct: •••• {beneficiary.accountLastFour} ({beneficiary.ifscCode})
          </p>
        </div>
      </div>

      {/* 5-Stage Visual Workflow Pipeline */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2DAC7] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#101B2D] font-heading">
              {t.currentStage}
            </h2>
            <p className="text-xs text-[#5A6A80]">
              From initial sanction to bank credit — transparent tracking of every civic checkpoint
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EAE2D2] text-[#5A6A80]">
            Scheme: {beneficiary.scheme}
          </span>
        </div>

        {/* Pipeline Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-6">
          {beneficiary.timeline.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isFailed = step.status === 'failed';
            const isPending = step.status === 'pending';
            const isInProgress = step.status === 'in_progress';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border relative flex flex-col justify-between transition-all ${
                  isFailed
                    ? 'bg-red-50 border-red-400 ring-2 ring-red-400/20'
                    : isCompleted
                      ? 'bg-[#F4F9F6] border-[#B7E4D3]'
                      : isInProgress
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-[#FAF8F5] border-[#E8E1D3] opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#5A6A80]">Step {idx + 1}</span>
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-[#087F68]" />}
                    {isFailed && <XCircle className="w-5 h-5 text-red-600 animate-pulse" />}
                    {isInProgress && <Clock className="w-5 h-5 text-amber-600 animate-spin" />}
                    {isPending && <Clock className="w-4 h-4 text-gray-400" />}
                  </div>

                  <h3 className="text-sm font-bold text-[#101B2D] leading-snug">
                    {step.stage.replace('_', ' ')}
                  </h3>

                  <p className="text-xs text-[#4A5568] mt-2 line-clamp-3">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-black/5 text-[11px] text-[#5A6A80] font-mono-code">
                  {step.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disbursement Transaction History Ledger */}
      <div className="bg-white rounded-2xl border border-[#E2DAC7] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2DAC7] flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#101B2D] font-heading">
              {t.paymentHistory}
            </h2>
            <p className="text-xs text-[#5A6A80]">
              Direct Benefit Transfer (DBT) monthly statement
            </p>
          </div>
          <div className="text-xs text-[#5A6A80] bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E8E1D3]">
            Verified with PFMS & Treasury Gateway
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E2DAC7] text-xs font-bold text-[#5A6A80] uppercase tracking-wider">
                <th className="py-3.5 px-6">Month</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date & UTR / Ref</th>
                <th className="py-3.5 px-6">Bank Remark</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DAC7]">
              {beneficiary.paymentHistory.map((record) => (
                <tr key={record.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#101B2D]">
                    {record.month}
                  </td>
                  <td className="py-4 px-6 font-extrabold text-[#101B2D]">
                    ₹{record.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-6">
                    {record.status === 'CREDITED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Credited
                      </span>
                    )}
                    {record.status === 'FAILED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Returned Unpaid
                      </span>
                    )}
                    {record.status === 'ON_HOLD' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> On Hold (DLC)
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-xs text-[#5A6A80] font-mono-code">
                    {record.dateDisbursed || '—'}
                    {record.utrNumber && <div className="text-[11px] text-[#087F68]">UTR: {record.utrNumber}</div>}
                  </td>
                  <td className="py-4 px-6 text-xs text-[#4A5568] max-w-xs">
                    {record.failureReason ? (
                      <span className="text-red-700 font-medium">{record.failureReason}</span>
                    ) : (
                      <span className="text-emerald-700">Processed successfully via NPCI APBS</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {record.status !== 'CREDITED' ? (
                      <button
                        onClick={onNavigateToDiagnostic}
                        className="text-xs font-bold text-[#087F68] hover:text-[#066553] hover:underline inline-flex items-center gap-1"
                      >
                        Fix Delay <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-xs text-[#5A6A80]">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
