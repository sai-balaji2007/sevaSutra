import React, { useState } from 'react';
import { Beneficiary, CaregiverDelegation, CaregiverAuditLog, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  ShieldCheck, 
  UserCheck, 
  AlertOctagon, 
  Lock, 
  Unlock, 
  History, 
  PlusCircle, 
  Trash2, 
  Calendar, 
  Phone, 
  Eye, 
  FileUp, 
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle
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

  const beneficiaryCaregivers = caregivers.filter(c => c.beneficiaryId === beneficiary.id);

  return (
    <div className="space-y-6">
      {/* Intro Hero with Guardrails Banner */}
      <div className="bg-[#FAF8F5] border-2 border-[#E2DAC7] rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#087F68] text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-[#101B2D] font-heading">
                  {t.tabCaregiver} (Suraksha Sutra)
                </h2>
                <span className="bg-[#E8F5E9] text-[#087F68] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#087F68]/20">
                  Zero Exploitation Protocol
                </span>
              </div>
              <p className="text-sm text-[#4A5568] mt-1 max-w-2xl leading-relaxed">
                {t.caregiverDesc}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#087F68] hover:bg-[#066553] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addCaregiver}</span>
          </button>
        </div>

        {/* Permanent Security Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#E8E1D3] text-xs">
          <div className="flex items-center gap-2 text-[#2D3748]">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span><strong>Bank Accounts Immutable:</strong> Caregivers can never alter or divert bank accounts.</span>
          </div>
          <div className="flex items-center gap-2 text-[#2D3748]">
            <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
            <span><strong>Time-Bound Expiration:</strong> All delegations automatically expire unless renewed.</span>
          </div>
          <div className="flex items-center gap-2 text-[#2D3748]">
            <AlertOctagon className="w-4 h-4 text-red-700 shrink-0" />
            <span><strong>Instant 1-Tap Revoke:</strong> Beneficiary or family can terminate access at any second.</span>
          </div>
        </div>
      </div>

      {/* Delegated Caregivers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#101B2D] font-heading flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#087F68]" />
            Active Delegated Caregivers ({beneficiaryCaregivers.length})
          </h3>
          <span className="text-xs text-[#5A6A80]">
            Beneficiary: {beneficiary.name}
          </span>
        </div>

        {beneficiaryCaregivers.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-[#D5CBB8] text-center text-[#5A6A80] text-sm">
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
                    isActive ? 'border-[#E2DAC7]' : 'border-gray-200 bg-gray-50 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#101B2D]">
                          {cg.caregiverName}
                        </h4>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cg.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A6A80] mt-0.5">
                        {cg.relationship} • {cg.phoneNumber}
                      </p>
                    </div>

                    {isActive && (
                      <button
                        onClick={() => {
                          onRevokeCaregiver(cg.id);
                          onSpeak(`Revoked access for caregiver ${cg.caregiverName}`);
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        {t.revokeAccess}
                      </button>
                    )}
                  </div>

                  {/* Granular Permissions Badges */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E1D3]">
                      <Eye className="w-3.5 h-3.5 text-[#087F68]" />
                      <span className="text-[#2D3748]">Check Payments:</span>
                      <strong className={cg.canCheckPayments ? 'text-emerald-700' : 'text-gray-400'}>
                        {cg.canCheckPayments ? 'Allowed' : 'Disabled'}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E1D3]">
                      <FileUp className="w-3.5 h-3.5 text-[#087F68]" />
                      <span className="text-[#2D3748]">Upload Docs:</span>
                      <strong className={cg.canUploadDocuments ? 'text-emerald-700' : 'text-gray-400'}>
                        {cg.canUploadDocuments ? 'Allowed' : 'Disabled'}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E1D3]">
                      <MessageSquare className="w-3.5 h-3.5 text-[#087F68]" />
                      <span className="text-[#2D3748]">File Grievance:</span>
                      <strong className={cg.canFileGrievances ? 'text-emerald-700' : 'text-gray-400'}>
                        {cg.canFileGrievances ? 'Allowed' : 'Disabled'}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50/50 border border-red-200">
                      <Lock className="w-3.5 h-3.5 text-red-600" />
                      <span className="text-[#2D3748]">Change Bank:</span>
                      <strong className="text-red-700">LOCKED</strong>
                    </div>
                  </div>

                  {/* Expiration Footnote */}
                  <div className="pt-2 border-t border-[#E8E1D3] flex items-center justify-between text-[11px] text-[#5A6A80]">
                    <span>Valid until: <strong>{cg.validUntil}</strong></span>
                    <span>Added on: {cg.addedOn}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tamper-Evident Audit Log Section */}
      <div className="bg-white rounded-3xl border border-[#E2DAC7] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2DAC7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#087F68]" />
            <h3 className="text-base font-bold text-[#101B2D] font-heading">
              {t.auditLogTitle}
            </h3>
          </div>
          <span className="text-xs text-[#5A6A80] font-mono-code">
            Immutable Activity Feed
          </span>
        </div>

        <div className="divide-y divide-[#E2DAC7]">
          {auditLogs.map((log) => {
            const isAlert = log.securityFlag === 'ALERT';
            return (
              <div
                key={log.id}
                className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  isAlert ? 'bg-red-50/60' : 'hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    isAlert ? 'bg-red-600 text-white' : 'bg-[#E8F5E9] text-[#087F68]'
                  }`}>
                    {isAlert ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#101B2D] text-sm">{log.action}</span>
                      {isAlert && (
                        <span className="bg-red-200 text-red-900 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                          PROTECTION TRIGGERED
                        </span>
                      )}
                    </div>
                    <p className="text-[#4A5568] mt-0.5">{log.details}</p>
                    <div className="text-[11px] text-[#5A6A80] mt-1">
                      By: <strong>{log.caregiverName}</strong> • Network: {log.ipLocation}
                    </div>
                  </div>
                </div>

                <div className="text-[#5A6A80] font-mono-code text-[11px] shrink-0">
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D5CBB8] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DAC7]">
              <h4 className="text-lg font-bold text-[#101B2D] font-heading flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#087F68]" />
                Delegate New Caregiver
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCaregiver} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-[#5A6A80] mb-1">
                  Caregiver Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-[#FAF8F5] border border-[#D5CBB8] rounded-xl px-3 py-2 text-[#101B2D] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5A6A80] mb-1">
                    Relationship *
                  </label>
                  <select
                    value={newRelationship}
                    onChange={(e) => setNewRelationship(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CBB8] rounded-xl px-3 py-2 text-[#101B2D] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
                  >
                    <option value="Son / Family Caregiver">Son</option>
                    <option value="Daughter / Family Caregiver">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Ward Sachivalayam Volunteer">Village Volunteer</option>
                    <option value="Authorized NGO Worker">NGO Worker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A6A80] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CBB8] rounded-xl px-3 py-2 text-[#101B2D] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A6A80] mb-1">
                  Time-Bound Expiry Period
                </label>
                <select
                  value={newValidMonths}
                  onChange={(e) => setNewValidMonths(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CBB8] rounded-xl px-3 py-2 text-[#101B2D] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
                >
                  <option value={1}>1 Month (Temporary Assistance)</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months (Recommended)</option>
                  <option value={12}>1 Year</option>
                </select>
              </div>

              {/* Scope Toggles */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E1D3] space-y-2">
                <div className="text-xs font-bold text-[#101B2D]">Permitted Actions:</div>
                <label className="flex items-center gap-2 text-xs text-[#2D3748]">
                  <input
                    type="checkbox"
                    checked={newCanCheckPayments}
                    onChange={(e) => setNewCanCheckPayments(e.target.checked)}
                    className="rounded text-[#087F68]"
                  />
                  <span>Can view payment records and failure alerts</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#2D3748]">
                  <input
                    type="checkbox"
                    checked={newCanUploadDocs}
                    onChange={(e) => setNewCanUploadDocs(e.target.checked)}
                    className="rounded text-[#087F68]"
                  />
                  <span>Can upload life certificates (Jeevan Pramaan)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#2D3748]">
                  <input
                    type="checkbox"
                    checked={newCanFileGrievance}
                    onChange={(e) => setNewCanFileGrievance(e.target.checked)}
                    className="rounded text-[#087F68]"
                  />
                  <span>Can file official grievances on beneficiary behalf</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2DAC7]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#087F68] hover:bg-[#066553] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
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
