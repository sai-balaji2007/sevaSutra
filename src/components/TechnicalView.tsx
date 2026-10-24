import React from 'react';
import { StatusChip } from './StatusChip';
import { 
  Code2, 
  ShieldCheck, 
  Server, 
  Layers, 
  Lock, 
  Cpu, 
  Award,
  CheckCircle2
} from 'lucide-react';

export const TechnicalView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#D0D5DD] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#111C2E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Code2 className="w-6 h-6 text-[#C5A267]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#111C2E] font-heading tracking-tight">
                Technical Architecture & Impact Evaluation
              </h2>
              <StatusChip variant="official" label="IMPACTX 2026" source="Challenge 20" />
            </div>
            <p className="text-xs md:text-sm text-[#475467] mt-1 leading-relaxed">
              System architecture, civic-fintech security boundaries, and evaluation metrics for older adult and disabled beneficiary protection.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Pillars */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#087F68]" />
            <h3 className="text-base font-bold text-[#111C2E] font-heading">
              1. Civic-Fintech DBT Pipeline
            </h3>
          </div>
          <p className="text-xs text-[#475467] leading-relaxed">
            Direct Benefit Transfer (DBT) failures in India typically occur at the NPCI mapper layer (Aadhaar Payment Bridge System, APBS) rather than core banking accounts. SEVA SUTRA isolates root causes (e.g., Code AB-01) and equips seniors with doorstep postman resolutions (IPPB 155299) without requiring digital banking literacy.
          </p>
          <div className="bg-[#F8F9FA] p-3 rounded-lg border border-[#EAECF0] text-xs font-mono-code text-[#344054]">
            PFMS Treasury → NPCI APBS Gateway → Bank Account Seeding
          </div>
        </div>

        {/* Security & Caregiver Vault */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#087F68]" />
            <h3 className="text-base font-bold text-[#111C2E] font-heading">
              2. Suraksha Sutra Caregiver Guardrails
            </h3>
          </div>
          <p className="text-xs text-[#475467] leading-relaxed">
            Eliminates elder financial abuse by strictly separating <em>Assisted Action</em> (viewing status, submitting life proof) from <em>Asset Control</em>. Bank account modifications cannot be enacted by caregivers, enforcing a 72-hour cooling-off period and direct physical beneficiary confirmation.
          </p>
          <div className="bg-[#F8F9FA] p-3 rounded-lg border border-[#EAECF0] text-xs font-mono-code text-[#344054]">
            Granular Delegations • 72h Hold • Immutable Bank Accounts
          </div>
        </div>

        {/* AI & Heuristic Diagnostic Engine */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#087F68]" />
            <h3 className="text-base font-bold text-[#111C2E] font-heading">
              3. Hybrid Diagnostic Architecture
            </h3>
          </div>
          <p className="text-xs text-[#475467] leading-relaxed">
            Uses server-side Gemini 3.8 Flash via the official <code>@google/genai</code> SDK with a 4-second race timeout and instant heuristic fallback. Guarantees deterministic, zero-hallucination civic guidance even under degraded connectivity.
          </p>
          <div className="bg-[#F8F9FA] p-3 rounded-lg border border-[#EAECF0] text-xs font-mono-code text-[#344054]">
            Gemini 3.8 Flash (Server-Side) + Heuristic Fallback Rules
          </div>
        </div>

        {/* Accessibility Compliance */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#087F68]" />
            <h3 className="text-base font-bold text-[#111C2E] font-heading">
              4. AAA Accessibility & Vernacular Support
            </h3>
          </div>
          <p className="text-xs text-[#475467] leading-relaxed">
            Engineered for older adults and disabled beneficiaries with high-contrast palette compliance, font scaling up to 125%, spoken audio narration, and complete bilingual support in Telugu and Hindi alongside English.
          </p>
          <div className="bg-[#F8F9FA] p-3 rounded-lg border border-[#EAECF0] text-xs font-mono-code text-[#344054]">
            WCAG 2.1 AAA • Noto Sans Telugu • Speech Synthesis
          </div>
        </div>
      </div>
    </div>
  );
};
