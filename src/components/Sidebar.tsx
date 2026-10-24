import React from 'react';
import { NavPage, Beneficiary, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  LayoutDashboard, 
  Building2, 
  Stethoscope, 
  FolderCheck, 
  ShieldCheck, 
  Bell, 
  Search, 
  FileText, 
  Bot, 
  Settings, 
  Code2, 
  User, 
  ChevronRight, 
  PhoneCall, 
  X
} from 'lucide-react';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  beneficiaries: Beneficiary[];
  currentBeneficiary: Beneficiary;
  onSelectBeneficiary: (b: Beneficiary) => void;
  language: Language;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  unreadNotificationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  beneficiaries,
  currentBeneficiary,
  onSelectBeneficiary,
  language,
  mobileOpen,
  onCloseMobile,
  unreadNotificationsCount,
}) => {
  const t = TRANSLATIONS[language];

  const mainNavItems: { page: NavPage; label: string; icon: React.ReactNode; badge?: React.ReactNode }[] = [
    {
      page: 'DASHBOARD',
      label: t.tabDashboard || 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      page: 'TRACKER',
      label: t.tabTracker || 'My Benefits',
      icon: <Building2 className="w-4 h-4" />
    },
    {
      page: 'DIAGNOSTIC',
      label: t.tabDiagnostic || 'Payment Diagnosis',
      icon: <Stethoscope className="w-4 h-4 text-[#C5A267]" />,
      badge: currentBeneficiary.npciAadhaarSeeded === false ? (
        <span className="w-2 h-2 rounded-full bg-[#B42332] animate-pulse"></span>
      ) : undefined
    },
    {
      page: 'LOCKER',
      label: t.tabLocker || 'Documents & Deadlines',
      icon: <FolderCheck className="w-4 h-4" />
    },
    {
      page: 'CAREGIVER',
      label: t.tabCaregiver || 'Caregiver Access',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      page: 'NOTIFICATIONS',
      label: t.tabNotifications || 'Notifications & Activity',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationsCount > 0 ? (
        <span className="bg-[#B42332] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
          {unreadNotificationsCount}
        </span>
      ) : undefined
    }
  ];

  const exploreNavItems: { page: NavPage; label: string; icon: React.ReactNode }[] = [
    {
      page: 'EXPLORE',
      label: t.tabExplore || 'Explore Benefits',
      icon: <Search className="w-4 h-4" />
    },
    {
      page: 'GRIEVANCE',
      label: t.tabGrievance || 'Assisted Completion',
      icon: <FileText className="w-4 h-4" />
    },
    {
      page: 'VOICE',
      label: t.tabVoice || 'Krupa Voice Desk',
      icon: <Bot className="w-4 h-4 text-[#A6F4C5]" />
    }
  ];

  const systemNavItems: { page: NavPage; label: string; icon: React.ReactNode }[] = [
    {
      page: 'SETTINGS',
      label: t.tabSettings || 'Accessibility & Settings',
      icon: <Settings className="w-4 h-4" />
    },
    {
      page: 'TECHNICAL',
      label: t.tabTechnical || 'Technical Overview',
      icon: <Code2 className="w-4 h-4 text-[#C5A267]" />
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Deep Midnight Navy Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#111C2E] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 border-r border-[#1F2F4A] shadow-xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand & Identity Header */}
          <div className="p-5 border-b border-[#1F2F4A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#087F68] text-white flex items-center justify-center font-bold text-xl font-heading shadow-md ring-1 ring-[#087F68]/30">
                సే
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-heading font-extrabold text-base tracking-tight text-white">
                    SEVA SUTRA
                  </h1>
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#C5A267] bg-[#C5A267]/10 px-1.5 py-0.5 rounded-xs border border-[#C5A267]/20">
                    IMPACTX
                  </span>
                </div>
                <p className="text-[11px] text-[#98A2B3] tracking-normal font-sans">
                  Civic-Fintech Benefit Platform
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile} 
              className="md:hidden text-[#98A2B3] hover:text-white p-1 rounded-md"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sections */}
          <div className="p-3 space-y-6">
            {/* Section 1: Main Workspace */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#667085]">
                Beneficiary Portal
              </div>
              <nav className="space-y-1">
                {mainNavItems.map((item) => {
                  const isActive = activePage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => {
                        onNavigate(item.page);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#087F68] text-white shadow-xs'
                          : 'text-[#D0D5DD] hover:bg-[#1A2840] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-[#98A2B3]'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Section 2: Explore & Assistance */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#667085]">
                Civic Services
              </div>
              <nav className="space-y-1">
                {exploreNavItems.map((item) => {
                  const isActive = activePage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => {
                        onNavigate(item.page);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#087F68] text-white shadow-xs'
                          : 'text-[#D0D5DD] hover:bg-[#1A2840] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-[#98A2B3]'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Section 3: System & Settings */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#667085]">
                Standards & Governance
              </div>
              <nav className="space-y-1">
                {systemNavItems.map((item) => {
                  const isActive = activePage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => {
                        onNavigate(item.page);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#087F68] text-white shadow-xs'
                          : 'text-[#D0D5DD] hover:bg-[#1A2840] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-[#98A2B3]'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Panel: Current Persona / Demo Role Selector */}
        <div className="p-3 border-t border-[#1F2F4A] bg-[#0C1523]">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#667085] px-2 mb-1.5 flex items-center justify-between">
            <span>Demo Beneficiary Role</span>
            <span className="text-[9px] font-mono-code text-[#087F68] font-bold">SYNTHETIC</span>
          </div>

          <div className="bg-[#111C2E] rounded-lg p-2.5 border border-[#1F2F4A] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-full bg-[#087F68]/20 text-[#087F68] flex items-center justify-center text-xs font-bold shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">
                    {currentBeneficiary.name}
                  </div>
                  <div className="text-[10px] text-[#98A2B3] truncate">
                    {currentBeneficiary.scheme} • {currentBeneficiary.district}
                  </div>
                </div>
              </div>
            </div>

            <select
              value={currentBeneficiary.id}
              onChange={(e) => {
                const found = beneficiaries.find(b => b.id === e.target.value);
                if (found) onSelectBeneficiary(found);
              }}
              className="w-full bg-[#1A2840] text-[11px] text-[#E0E6ED] rounded-md px-2 py-1 border border-[#2D3E5D] focus:outline-none focus:ring-1 focus:ring-[#087F68] cursor-pointer"
            >
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#111C2E] text-white">
                  {b.name} ({b.scheme})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 px-2 flex items-center justify-between text-[10px] text-[#667085]">
            <span className="flex items-center gap-1 text-[#087F68]">
              <PhoneCall className="w-3 h-3" /> 14567 Elderline
            </span>
            <span>v2.4.0 Fintech</span>
          </div>
        </div>
      </aside>
    </>
  );
};
