import React, { useState } from 'react';
import { Beneficiary, CaregiverDelegation, CaregiverAuditLog, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { StatusChip } from './StatusChip';
import { 
  ShieldCheck, 
  UserCheck, 
  AlertOctagon, 
  Lock, 
  History, 
  PlusCircle, 
  Calendar, 
  Eye, 
  FileUp, 
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldAlert,
  Ban,
  Check,
  X
} from 'lucide-react';

interface CaregiverVaultTabProps {
  beneficiary: Beneficiary;
  caregivers: CaregiverDelegation[];
  auditLogs: CaregiverAuditLog[];
  onAddCaregiver: (caregiver: Omit<CaregiverDelegation, 'id' | 'addedOn'>) => void;
  onRevokeCaregiver: (caregiverId: string) => void;
  language: Language;
  onSpeak: (text: string) => void;
}

export const CaregiverVaultTab: React.FC<CaregiverVaultTabProps> = ({
  beneficiary,
  caregivers,
  auditLogs,
  onAddCaregiver,
  onRevokeCaregiver,
  language,
  onSpeak,
}) => {
  const t = TRANSLATIONS[language];

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('Son / Family Caregiver');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [newAccessLevel, setNewAccessLevel] = useState<'VIEW_ONLY' | 'ASSIST_SUBMIT' | 'FULL_CARE'>('ASSIST_SUBMIT');
  const [newValidMonths, setNewValidMonths] = useState(6);
  const [newCanCheckPayments, setNewCanCheckPayments] = useState(true);
  const [newCanUploadDocs, setNewCanUploadDocs] = useState(true);
  const [newCanFileGrievance, setNewCanFileGrievance] = useState(false);

  // Simulated Bank Change Safeguard State (Requirement 8)
  const [simulatedBankChangeActive, setSimulatedBankChangeActive] = useState(true);
  const [bankChangeCanceled, setBankChangeCanceled] = useState(false);

  const handleCreateCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const validUntilDate = new Date();
    validUntilDate.setMonth(validUntilDate.getMonth() + Number(newValidMonths));

    onAddCaregiver({
      beneficiaryId: beneficiary.id,
      caregiverName: newName.trim(),
      relationship: newRelationship,
      phoneNumber: newPhone.trim(),
      accessLevel: newAccessLevel,
      validUntil: validUntilDate.toISOString().split('T')[0],
      status: 'ACTIVE',
      canCheckPayments: newCanCheckPayments,
      canUploadDocuments: newCanUploadDocs,
      canFileGrievances: newCanFileGrievance,
      canChangeBankDetails: false, // Permanently forbidden
      notes: `Granted ${newAccessLevel} delegation for ${newValidMonths} months.`
    });

    onSpeak(`New caregiver ${newName} delegated with time-bound protection until ${validUntilDate.toISOString().split('T')[0]}`);
    setShowAddModal(false);
    setNewName('');
  };

  const handleCancelBankChange = () => {
    setBankChangeCanceled(true);
    setSimulatedBankChangeActive(false);
    onSpeak('Bank account change request successfully cancelled. Original account protected.');
  };

  const beneficiaryCaregivers = caregivers.filter(c => c.beneficiaryId === beneficiary.id);

  return (
    <div className="space-y-6">
      {/* Intro Hero with Guardrails Banner */}
      <div className="bg-white border border-[#D0D5DD] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#087F68] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#A6F4C5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-[#111C2E] font-heading tracking-tight">
                  {t.tabCaregiver}
                </h2>
                <span className="bg-[#E7F4EF] text-[#087F68] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#A6F4C5]">
                  Suraksha Sutra Protocol
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#475467] mt-1 max-w-2xl leading-relaxed">
                {t.caregiverDesc}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#087F68] hover:bg-[#066553] text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-xs flex items-center gap-2 shrink-0 cursor-pointer transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addCaregiver}</span>
          </button>
        </div>

        {/* Permanent Security Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#F2F4F7] text-xs">
          <div className="flex items-start gap-2 text-[#344054]">
            <Lock className="w-4 h-4 text-[#087F68] shrink-0 mt-0.5" />
            <span><strong className="text-[#111C2E]">Bank Accounts Immutable:</strong> Caregivers can never alter or divert bank accounts.</span>
          </div>
          <div className="flex items-start gap-2 text-[#344054]">
            <Calendar className="w-4 h-4 text-[#C5A267] shrink-0 mt-0.5" />
            <span><strong className="text-[#111C2E]">Time-Bound Expiration:</strong> All delegations automatically expire unless renewed.</span>
          </div>
          <div className="flex items-start gap-2 text-[#344054]">
            <Ban className="w-4 h-4 text-[#B42332] shrink-0 mt-0.5" />
            <span><strong className="text-[#111C2E]">Instant 1-Tap Revoke:</strong> Beneficiary or family can terminate access at any second.</span>
          </div>
        </div>
      </div>

      {/* REQUIREMENT 8: SIMULATED BANK-ACCOUNT-CHANGE REQUEST SAFEGUARD */}
      {simulatedBankChangeActive && !bankChangeCanceled && (
        <div className="bg-white border border-[#D0D5DD] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F2F4F7]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FEF3F2] text-[#B42332] flex items-center justify-center shrink-0">
                <AlertOctagon className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111C2E] font-heading">
                  High-Risk Action Flagged: External Bank Account Alteration Attempt
                </h3>
                <span className="text-[11px] text-[#475467]">
                  Initiated by Caregiver Terminal • Target: Change DBT Crediting to Union Bank •••• 9912
                </span>
              </div>
            </div>

            <StatusChip 
              variant="high-risk" 
              label="Cooling-Off Active" 
              subtext="68h 14m left"
            />
          </div>

          {/* EXACT MANDATED COPY IN RESTRAINED PANEL (Requirement 8) */}
          <div className="bg-[#F8F9FA] border border-[#D0D5DD] rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-[#C5A267] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#111C2E] leading-relaxed">
                  “To keep your savings safe, we’ll confirm this change with you directly. Nothing changes for 72 hours.”
                </p>
                <p className="text-xs text-[#475467] mt-1">
                  SEVA SUTRA Civic Safeguard Rule 14-B: Bank account routing changes cannot be executed by delegates or caregivers alone. A physical or biometric verification request has been queued with your local Ward Sachivalayam.
                </p>
              </div>
            </div>
          </div>

          {/* Verification Requirements & Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border border-[#D0D5DD]">
              <div className="text-[#475467] font-semibold">1. Cooling-Off Period:</div>
              <div className="text-sm font-bold text-[#111C2E] mt-0.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C5A267]" /> 72 Hours Mandatory Hold
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#D0D5DD]">
              <div className="text-[#475467] font-semibold">2. Confirmation Required:</div>
              <div className="text-sm font-bold text-[#111C2E] mt-0.5">
                Direct In-Person Biometric / OTP
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#D0D5DD]">
              <div className="text-[#475467] font-semibold">3. Current Status:</div>
              <div className="text-sm font-bold text-[#B42332] mt-0.5">
                BLOCKED (Funds frozen to original acct)
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#475467]">
              Current beneficiary account remains safely linked to: <strong>{beneficiary.bankName} (•••• {beneficiary.accountLastFour})</strong>
            </div>

            <button
              onClick={handleCancelBankChange}
              className="bg-[#B42332] hover:bg-[#912018] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Request & Lock Modifications</span>
            </button>
          </div>
        </div>
      )}

      {bankChangeCanceled && (
        <div className="bg-[#E7F4EF] border border-[#A6F4C5] p-4 rounded-xl text-xs text-[#087F68] flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Bank account modification attempt successfully canceled and recorded in audit log. Beneficiary account is protected.</span>
          </div>
          <button 
            onClick={() => setBankChangeCanceled(false)}
            className="text-xs font-semibold underline text-[#087F68]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Delegated Caregivers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#111C2E] font-heading flex items-center gap-2">
            <UserCheck className="w-4.5 h-4.5 text-[#087F68]" />
            Active Delegated Caregivers ({beneficiaryCaregivers.length})
          </h3>
          <span className="text-xs text-[#475467]">
            Beneficiary: <strong>{beneficiary.name}</strong>
          </span>
        </div>

        {beneficiaryCaregivers.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-[#D0D5DD] text-center text-[#475467] text-xs">
            No active caregivers currently delegated for this beneficiary. Click "Delegate New Caregiver" above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beneficiaryCaregivers.map((cg) => {
              const isActive = cg.status === 'ACTIVE';
              return (
                <div
                  key={cg.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all relative ${
                    isActive ? 'border-[#D0D5DD]' : 'border-gray-200 bg-gray-50 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#111C2E] font-heading">
                          {cg.caregiverName}
                        </h4>
                        <StatusChip 
                          variant={isActive ? 'completed' : 'high-risk'} 
                          label={cg.status}
                        />
                      </div>
                      <p className="text-xs text-[#475467] mt-0.5">
                        {cg.relationship} • {cg.phoneNumber}
                      </p>
                    </div>

                    {isActive && (
                      <button
                        onClick={() => {
                          onRevokeCaregiver(cg.id);
                          onSpeak(`Revoked access for caregiver ${cg.caregiverName}`);
                        }}
                        className="bg-white hover:bg-[#FEF3F2] text-[#B42332] border border-[#FECDCA] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        {t.revokeAccess}
                      </button>
                    )}
                  </div>

                  {/* Granular Permissions Badges */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#F8F9FA] border border-[#E4E7EC]">
                      <Eye className="w-3.5 h-3.5 text-[#087F68]" />
                      <span className="text-[#344054]">Check Payments:</span>
                      <strong className={cg.canCheckPayments ? 'text-[#087F68]' : 'text-gray-400'}>
                        {cg.canCheckPayments ? 'Allowed' : 'Disabled'}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#F8F9FA] border border-[#E4E7EC]">
                      <FileUp className="w-3.5 h-3.5 text-[#087F68]" />
                      <span className="text-[#344054]">Upload Docs:</span>
                      <strong className={cg.canUploadDocuments ? 'text-[#087F68]' : 'text-gray-400'}>
                        {cg.canUploadDocuments ? 'Allowed' : 'Disabled'}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#F8F9FA] border border-[#E4E7EC]">
                      <MessageSquare className="w-3.5 h-3.5 text-[#087F68]" />
                      <span className="text-[#344054]">File Grievance:</span>
                      <strong className={cg.canFileGrievances ? 'text-[#087F68]' : 'text-gray-400'}>
                        {cg.canFileGrievances ? 'Allowed' : 'Disabled'}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#FEF3F2] border border-[#FECDCA]">
                      <Lock className="w-3.5 h-3.5 text-[#B42332]" />
                      <span className="text-[#344054]">Change Bank:</span>
                      <strong className="text-[#B42332]">LOCKED</strong>
                    </div>
                  </div>

                  {/* Expiration Footnote */}
                  <div className="pt-2 border-t border-[#F2F4F7] flex items-center justify-between text-[11px] text-[#475467]">
                    <span>Valid until: <strong className="text-[#111C2E]">{cg.validUntil}</strong></span>
                    <span>Added on: {cg.addedOn}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tamper-Evident Audit Log Section */}
      <div className="bg-white rounded-2xl border border-[#D0D5DD] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#D0D5DD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4.5 h-4.5 text-[#087F68]" />
            <h3 className="text-sm font-bold text-[#111C2E] font-heading">
              {t.auditLogTitle}
            </h3>
          </div>
          <span className="text-xs text-[#475467] font-mono-code">
            Immutable Activity Feed
          </span>
        </div>

        <div className="divide-y divide-[#F2F4F7]">
          {auditLogs.map((log) => {
            const isAlert = log.securityFlag === 'ALERT';
            return (
              <div
                key={log.id}
                className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  isAlert ? 'bg-[#FEF3F2]/40' : 'hover:bg-[#F9FAFB]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    isAlert ? 'bg-[#B42332] text-white' : 'bg-[#E7F4EF] text-[#087F68]'
                  }`}>
                    {isAlert ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111C2E] text-xs">{log.action}</span>
                      {isAlert && (
                        <span className="bg-[#FEF3F2] text-[#B42332] border border-[#FECDCA] text-[10px] font-bold px-1.5 py-0.2 rounded-xs">
                          PROTECTION TRIGGERED
                        </span>
                      )}
                    </div>
                    <p className="text-[#475467] mt-0.5 leading-relaxed">{log.details}</p>
                    <div className="text-[11px] text-[#667085] mt-1">
                      By: <strong>{log.caregiverName}</strong> • Network: {log.ipLocation}
                    </div>
                  </div>
                </div>

                <div className="text-[#667085] font-mono-code text-[11px] shrink-0">
                  {log.timestamp}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delegation Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#D0D5DD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D0D5DD]">
              <h4 className="text-base font-bold text-[#111C2E] font-heading flex items-center gap-2">
                <UserCheck className="w-4.5 h-4.5 text-[#087F68]" />
                Delegate New Caregiver
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCaregiver} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Caregiver Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Relationship *
                  </label>
                  <select
                    value={newRelationship}
                    onChange={(e) => setNewRelationship(e.target.value)}
                    className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
                  >
                    <option value="Son / Family Caregiver">Son</option>
                    <option value="Daughter / Family Caregiver">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Ward Sachivalayam Volunteer">Village Volunteer</option>
                    <option value="Authorized NGO Worker">NGO Worker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Time-Bound Expiry Period
                </label>
                <select
                  value={newValidMonths}
                  onChange={(e) => setNewValidMonths(Number(e.target.value))}
                  className="w-full bg-white border border-[#D0D5DD] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
                >
                  <option value={1}>1 Month (Temporary Assistance)</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months (Recommended)</option>
                  <option value={12}>1 Year</option>
                </select>
              </div>

              {/* Scope Toggles */}
              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#D0D5DD] space-y-2">
                <div className="text-xs font-bold text-[#111C2E]">Permitted Actions:</div>
                <label className="flex items-center gap-2 text-xs text-[#344054] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCanCheckPayments}
                    onChange={(e) => setNewCanCheckPayments(e.target.checked)}
                    className="rounded text-[#087F68]"
                  />
                  <span>Can view payment records and failure alerts</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#344054] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCanUploadDocs}
                    onChange={(e) => setNewCanUploadDocs(e.target.checked)}
                    className="rounded text-[#087F68]"
                  />
                  <span>Can upload life certificates (Jeevan Pramaan)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#344054] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCanFileGrievance}
                    onChange={(e) => setNewCanFileGrievance(e.target.checked)}
                    className="rounded text-[#087F68]"
                  />
                  <span>Can file official grievances on beneficiary behalf</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#D0D5DD]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#475467] hover:text-[#111C2E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#087F68] hover:bg-[#066553] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs"
                >
                  Confirm Delegation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
