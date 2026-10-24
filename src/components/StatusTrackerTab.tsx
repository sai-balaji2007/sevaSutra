import React from 'react';
import { Beneficiary, Language, NavPage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { StatusChip } from './StatusChip';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Landmark, 
  Fingerprint, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  FileCheck2,
  Stethoscope,
  Building2,
  AlertOctagon,
  ChevronRight
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

  const recentPayment = beneficiary.paymentHistory[0];
  const isPaymentBlocked = recentPayment && (recentPayment.status === 'FAILED' || recentPayment.status === 'ON_HOLD');

  const daysUntilDLC = Math.ceil(
    (new Date(beneficiary.jeevanPramaanValidUntil).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  return (
    <div className="space-y-6">
      {/* High Priority Critical Alert Banner if payment is blocked */}
      {isPaymentBlocked && (
        <div className="bg-white border-2 border-[#B42332]/40 rounded-2xl p-5 shadow-xs bg-gradient-to-r from-white to-[#FEF3F2]/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-[#FEF3F2] text-[#B42332] rounded-xl border border-[#FECDCA] shrink-0 mt-0.5">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#111C2E] font-heading">
                    {language === 'te' 
                      ? 'హెచ్చరిక: మీ నెలవారీ పింఛను చెల్లింపు నిలిచిపోయింది'
                      : language === 'hi' 
                        ? 'चेतावनी: आपकी मासिक पेंशन का भुगतान रुक गया है' 
                        : 'Action Required: Monthly Pension Disbursal Withheld'}
                  </h3>
                  <StatusChip variant="high-risk" label={recentPayment?.status} />
                </div>
                <p className="text-xs text-[#475467] mt-1 font-medium leading-relaxed max-w-2xl">
                  {recentPayment?.failureReason || 'Government treasury released payment, but processing failed at payment bridge.'}
                </p>
                <div className="text-[11px] text-[#B42332] font-semibold mt-1">
                  Affecting: {recentPayment?.month} • Amount Withheld: ₹{recentPayment?.amount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onSpeak('Opening Payment Delay Doctor to analyze the exact cause and generate your remedy plan');
                onNavigateToDiagnostic();
              }}
              className="bg-[#087F68] hover:bg-[#066553] text-white px-4 py-2.5 rounded-lg font-bold text-xs shadow-xs flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-[#A6F4C5]" />
              <span>{t.diagnoseButton}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Amount */}
        <div className="bg-white p-5 rounded-2xl border border-[#D0D5DD] shadow-xs">
          <div className="flex items-center justify-between text-[#475467] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.monthlyPension}</span>
            <Building2 className="w-4 h-4 text-[#087F68]" />
          </div>
          <div className="text-2xl font-extrabold text-[#111C2E] font-heading">
            ₹{beneficiary.monthlyAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-[#475467] mt-1">
            Schedule: 1st of every month via DBT
          </p>
        </div>

        {/* NPCI Aadhaar Seeding */}
        <div className="bg-white p-5 rounded-2xl border border-[#D0D5DD] shadow-xs">
          <div className="flex items-center justify-between text-[#475467] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.aadhaarLinked}</span>
            <Fingerprint className="w-4 h-4 text-[#087F68]" />
          </div>
          <div className="flex items-center gap-2">
            {beneficiary.npciAadhaarSeeded ? (
              <StatusChip variant="completed" label={t.seeded} source="UIDAI" />
            ) : (
              <StatusChip variant="high-risk" label={t.notSeeded} source="Code AB-01" />
            )}
          </div>
          <p className="text-xs text-[#475467] mt-2 font-mono-code">
            Masked: •••• •••• {beneficiary.aadhaarLastFour}
          </p>
        </div>

        {/* Jeevan Pramaan / Digital Life Certificate */}
        <div className="bg-white p-5 rounded-2xl border border-[#D0D5DD] shadow-xs">
          <div className="flex items-center justify-between text-[#475467] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.jeevanPramaan}</span>
            <FileCheck2 className="w-4 h-4 text-[#087F68]" />
          </div>
          <div className="flex items-center gap-2">
            {daysUntilDLC < 0 ? (
              <StatusChip variant="high-risk" label={t.expired} />
            ) : daysUntilDLC < 30 ? (
              <StatusChip variant="attention" label={t.expiresSoon} />
            ) : (
              <StatusChip variant="completed" label="Valid" />
            )}
          </div>
          <p className="text-xs text-[#475467] mt-2">
            {t.validUntil} {new Date(beneficiary.jeevanPramaanValidUntil).toLocaleDateString()}
          </p>
        </div>

        {/* Disbursal Bank Details */}
        <div className="bg-white p-5 rounded-2xl border border-[#D0D5DD] shadow-xs">
          <div className="flex items-center justify-between text-[#475467] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Designated Bank</span>
            <Landmark className="w-4 h-4 text-[#087F68]" />
          </div>
          <div className="text-sm font-bold text-[#111C2E] truncate font-heading">
            {beneficiary.bankName}
          </div>
          <p className="text-xs text-[#475467] mt-1 font-mono-code truncate">
            Acct: •••• {beneficiary.accountLastFour} ({beneficiary.ifscCode})
          </p>
        </div>
      </div>

      {/* 5-Stage Visual Workflow Pipeline */}
      <div className="bg-white p-6 rounded-2xl border border-[#D0D5DD] shadow-xs">
        <div className="flex items-center justify-between mb-2 pb-3 border-b border-[#F2F4F7]">
          <div>
            <h2 className="text-base font-bold text-[#111C2E] font-heading">
              {t.currentStage}
            </h2>
            <p className="text-xs text-[#475467]">
              End-to-end verification pipeline from civic sanction to banking credit
            </p>
          </div>
          <StatusChip variant="official" label={beneficiary.scheme} source="NSAP" />
        </div>

        {/* Pipeline Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
          {beneficiary.timeline.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isFailed = step.status === 'failed';
            const isPending = step.status === 'pending';
            const isInProgress = step.status === 'in_progress';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isFailed
                    ? 'bg-[#FEF3F2] border-[#FECDCA]'
                    : isCompleted
                      ? 'bg-white border-[#D0D5DD]'
                      : isInProgress
                        ? 'bg-[#FFF4D6] border-[#FEDF89]'
                        : 'bg-[#F9FAFB] border-[#EAECF0] opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#475467] uppercase tracking-wider">
                      Stage 0{idx + 1}
                    </span>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-[#087F68]" />}
                    {isFailed && <AlertOctagon className="w-4 h-4 text-[#B42332]" />}
                    {isInProgress && <Clock className="w-4 h-4 text-[#9A6700] animate-spin" />}
                    {isPending && <Clock className="w-3.5 h-3.5 text-[#98A2B3]" />}
                  </div>

                  <h3 className="text-xs font-bold text-[#111C2E] leading-snug font-heading">
                    {step.stage.replace('_', ' ')}
                  </h3>

                  <p className="text-[11px] text-[#475467] mt-2 line-clamp-3 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#F2F4F7] text-[10px] text-[#667085] font-mono-code">
                  {step.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disbursement Transaction History Ledger */}
      <div className="bg-white rounded-2xl border border-[#D0D5DD] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D0D5DD] flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#111C2E] font-heading">
              {t.paymentHistory}
            </h2>
            <p className="text-xs text-[#475467]">
              Direct Benefit Transfer (DBT) monthly statement ledger
            </p>
          </div>
          <StatusChip variant="official" label="PFMS & APBS Synchronized" source="Treasury" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#D0D5DD] text-[11px] font-bold text-[#475467] uppercase tracking-wider">
                <th className="py-3 px-6">Disbursal Month</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Processing Status</th>
                <th className="py-3 px-6">Date & UTR / Ref</th>
                <th className="py-3 px-6">Gateway Remark</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {beneficiary.paymentHistory.map((record) => (
                <tr key={record.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3.5 px-6 font-bold text-[#111C2E]">
                    {record.month}
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-[#111C2E]">
                    ₹{record.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-6">
                    {record.status === 'CREDITED' && (
                      <StatusChip variant="completed" label="Credited" />
                    )}
                    {record.status === 'FAILED' && (
                      <StatusChip variant="high-risk" label="Returned Unpaid" />
                    )}
                    {record.status === 'ON_HOLD' && (
                      <StatusChip variant="pending" label="On Hold (DLC)" />
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-[11px] text-[#475467] font-mono-code">
                    {record.dateDisbursed || '—'}
                    {record.utrNumber && <div className="text-[10px] text-[#087F68] font-bold">UTR: {record.utrNumber}</div>}
                  </td>
                  <td className="py-3.5 px-6 text-xs text-[#475467] max-w-xs">
                    {record.failureReason ? (
                      <span className="text-[#B42332] font-medium">{record.failureReason}</span>
                    ) : (
                      <span className="text-[#087F68]">Settled via NPCI APBS</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    {record.status !== 'CREDITED' ? (
                      <button
                        onClick={onNavigateToDiagnostic}
                        className="text-xs font-bold text-[#087F68] hover:text-[#066553] inline-flex items-center gap-1 cursor-pointer"
                      >
                        Fix Delay <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-xs text-[#98A2B3]">Settled</span>
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
