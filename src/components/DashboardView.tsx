import React from 'react';
import { Beneficiary, Language, NavPage } from '../types';
import { StatusChip } from './StatusChip';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight, 
  Building2, 
  FileCheck2, 
  Stethoscope, 
  ShieldCheck, 
  PhoneCall, 
  Landmark, 
  Fingerprint, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  beneficiary: Beneficiary;
  language: Language;
  onNavigate: (page: NavPage) => void;
  onSpeak: (text: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  beneficiary,
  language,
  onNavigate,
  onSpeak,
}) => {
  const recentPayment = beneficiary.paymentHistory[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / Greeting */}
      <div className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475467]">
              Beneficiary Oversight Dashboard
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono-code font-bold text-[#087F68] bg-[#E7F4EF] px-2 py-0.5 rounded-sm">
              <ShieldCheck className="w-3.5 h-3.5" /> DBT BHARAT SANCTIONED
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#111C2E] font-heading tracking-tight">
            {beneficiary.name}
          </h2>
          <p className="text-xs md:text-sm text-[#475467] mt-0.5">
            {beneficiary.schemeTitle} • Pension ID: <span className="font-mono-code font-bold text-[#111C2E]">{beneficiary.pensionId}</span> • {beneficiary.district}, {beneficiary.state}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              onSpeak(`Diagnosing payment delay for ${beneficiary.name}`);
              onNavigate('DIAGNOSTIC');
            }}
            className="bg-[#087F68] hover:bg-[#066553] text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 text-[#A6F4C5]" />
            <span>Diagnose Payment Delay</span>
          </button>
          <button
            onClick={() => onNavigate('TRACKER')}
            className="bg-white hover:bg-[#F4F6F8] text-[#172033] border border-[#D0D5DD] px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Full Process Timeline</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#475467]" />
          </button>
        </div>
      </div>

      {/* THE 4 MANDATORY CARDS (Requirement 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Application */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-5 shadow-xs flex flex-col justify-between hover:border-[#087F68]/40 transition-colors">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#E7F4EF] text-[#087F68] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <StatusChip 
                variant="completed" 
                label="Approved" 
                source="Social Welfare"
              />
            </div>

            <h3 className="text-sm font-bold text-[#111C2E] font-heading">
              Application Sanction
            </h3>
            <p className="text-xs text-[#475467] mt-1.5 leading-relaxed">
              Permanent sanction letter issued by the District Social Welfare Office under {beneficiary.scheme}.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F2F4F7] flex items-center justify-between">
            <span className="text-[11px] text-[#475467] font-mono-code">Order: AP-SW-8849</span>
            <button
              onClick={() => onNavigate('TRACKER')}
              className="text-xs font-bold text-[#087F68] hover:text-[#066553] inline-flex items-center gap-1"
            >
              View Sanction <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Verification: Due in 12 days (NOT expired) */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-5 shadow-xs flex flex-col justify-between hover:border-[#C5A267]/60 transition-colors">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFF4D6] text-[#9A6700] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <StatusChip 
                variant="pending" 
                label="Due in 12 days" 
              />
            </div>

            <h3 className="text-sm font-bold text-[#111C2E] font-heading">
              Physical Verification
            </h3>
            <p className="text-xs text-[#475467] mt-1.5 leading-relaxed">
              Bi-monthly Sachivalayam welfare audit scheduled for 05-Nov-2026. This cycle remains active and has not expired.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F2F4F7] flex items-center justify-between">
            <span className="text-[11px] text-[#475467]">Cycle: Ward 12</span>
            <button
              onClick={() => onNavigate('LOCKER')}
              className="text-xs font-bold text-[#087F68] hover:text-[#066553] inline-flex items-center gap-1"
            >
              Verify Checklist <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Documents: Approaching expiry */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-5 shadow-xs flex flex-col justify-between hover:border-[#C5A267]/60 transition-colors">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFFAEB] text-[#B54708] flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <StatusChip 
                variant="attention" 
                label="Approaching Expiry" 
              />
            </div>

            <h3 className="text-sm font-bold text-[#111C2E] font-heading">
              Digital Life Certificate
            </h3>
            <p className="text-xs text-[#475467] mt-1.5 leading-relaxed">
              Jeevan Pramaan certificate is valid until 30-Nov-2026. Annual renewal window is now open via mobile Face Auth.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F2F4F7] flex items-center justify-between">
            <span className="text-[11px] text-[#475467]">Expires: 30-Nov</span>
            <button
              onClick={() => onNavigate('LOCKER')}
              className="text-xs font-bold text-[#087F68] hover:text-[#066553] inline-flex items-center gap-1"
            >
              Submit Face DLC <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Payment: Delayed */}
        <div className="bg-white rounded-2xl border-2 border-[#B42332]/30 p-5 shadow-xs flex flex-col justify-between bg-gradient-to-b from-white to-[#FEF3F2]/30">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#FEF3F2] text-[#B42332] flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <StatusChip 
                variant="high-risk" 
                label="Delayed" 
                source="DBT Return"
              />
            </div>

            <h3 className="text-sm font-bold text-[#111C2E] font-heading">
              October Disbursal Unpaid
            </h3>
            <p className="text-xs text-[#475467] mt-1.5 leading-relaxed">
              {recentPayment?.failureReason || 'Aadhaar not mapped to active NPCI payment gateway (Code AB-01). Treasury released funds but bank bridge failed.'}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#FECDCA] flex items-center justify-between">
            <span className="text-xs font-bold text-[#B42332]">Withheld: ₹{recentPayment?.amount.toLocaleString('en-IN') || 3250}</span>
            <button
              onClick={() => onNavigate('DIAGNOSTIC')}
              className="text-xs font-bold text-[#B42332] hover:text-[#912018] inline-flex items-center gap-1 underline underline-offset-2"
            >
              Fix Delay Now <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Financial Account & Government Gateway Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Account Details Box */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475467]">Designated Bank</span>
            <Landmark className="w-4 h-4 text-[#087F68]" />
          </div>
          <div className="text-lg font-extrabold text-[#111C2E] font-heading">
            {beneficiary.bankName}
          </div>
          <div className="text-xs text-[#475467] space-y-1 font-mono-code">
            <div>Account: •••• •••• {beneficiary.accountLastFour}</div>
            <div>IFSC Code: {beneficiary.ifscCode}</div>
          </div>
          <div className="pt-2 border-t border-[#F2F4F7] flex items-center justify-between text-xs">
            <span className="text-[#475467]">Monthly Entitlement:</span>
            <strong className="text-sm font-bold text-[#111C2E]">₹{beneficiary.monthlyAmount.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* NPCI Aadhaar Seeding Bridge Status */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475467]">NPCI Payment Bridge</span>
            <Fingerprint className="w-4 h-4 text-[#087F68]" />
          </div>
          <div className="flex items-center gap-2">
            {beneficiary.npciAadhaarSeeded ? (
              <StatusChip variant="completed" label="NPCI Seeded Active" source="UIDAI" />
            ) : (
              <StatusChip variant="high-risk" label="Unmapped (Code AB-01)" source="APBS Return" />
            )}
          </div>
          <p className="text-xs text-[#475467] leading-relaxed">
            {beneficiary.npciAadhaarSeeded 
              ? 'Account is ready for automated direct benefit transfer credits.'
              : 'Branch consolidation dropped the active NPCI mandate. Postman doorstep seeding or Bank Annexure-I required.'}
          </p>
          <div className="pt-2 border-t border-[#F2F4F7] flex items-center justify-between text-xs">
            <span className="text-[#475467]">Aadhaar Masked:</span>
            <span className="font-mono-code font-bold text-[#111C2E]">•••• •••• {beneficiary.aadhaarLastFour}</span>
          </div>
        </div>

        {/* Doorstep Postman Fast Action */}
        <div className="bg-[#E7F4EF] rounded-2xl border border-[#A6F4C5] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#087F68] uppercase tracking-wider mb-2">
              <PhoneCall className="w-4 h-4" /> Doorstep Civic Helpline
            </div>
            <h4 className="text-base font-bold text-[#111C2E] font-heading">
              India Post Doorstep Aadhaar Seeding
            </h4>
            <p className="text-xs text-[#475467] mt-1.5 leading-relaxed">
              Senior citizens and disabled beneficiaries unable to walk to bank branches can request doorstep biometric authentication from local beat postmen.
            </p>
          </div>
          <div className="pt-3 border-t border-[#A6F4C5]/50 flex items-center justify-between">
            <span className="font-mono-code font-bold text-[#087F68] text-sm">Toll-Free: 155299</span>
            <span className="text-[11px] font-bold text-[#111C2E] bg-white px-2 py-0.5 rounded-sm border border-[#A6F4C5]">Zero Fee</span>
          </div>
        </div>
      </div>
    </div>
  );
};
