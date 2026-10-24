import React, { useState, useEffect } from 'react';
import { Beneficiary, CaregiverDelegation, CaregiverAuditLog, Language, NavPage } from './types';
import { INITIAL_BENEFICIARIES, INITIAL_CAREGIVERS, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { TRANSLATIONS } from './data/translations';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { StatusTrackerTab } from './components/StatusTrackerTab';
import { DiagnosticDoctorTab } from './components/DiagnosticDoctorTab';
import { CaregiverVaultTab } from './components/CaregiverVaultTab';
import { DocumentRakshakTab } from './components/DocumentRakshakTab';
import { GrievancePortalTab } from './components/GrievancePortalTab';
import { VoiceDeskTab } from './components/VoiceDeskTab';
import { NotificationsView } from './components/NotificationsView';
import { ExploreBenefitsView } from './components/ExploreBenefitsView';
import { SettingsView } from './components/SettingsView';
import { TechnicalView } from './components/TechnicalView';
import { 
  Landmark, 
  ShieldCheck, 
  HeartHandshake, 
  Scale, 
  PhoneCall 
} from 'lucide-react';

export function App() {
  const [beneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [currentBeneficiary, setCurrentBeneficiary] = useState<Beneficiary>(INITIAL_BENEFICIARIES[0]);
  const [caregivers, setCaregivers] = useState<CaregiverDelegation[]>(INITIAL_CAREGIVERS);
  const [auditLogs, setAuditLogs] = useState<CaregiverAuditLog[]>(INITIAL_AUDIT_LOGS);

  const [activePage, setActivePage] = useState<NavPage>('DASHBOARD');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [language, setLanguage] = useState<Language>('en');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [audioVoiceEnabled, setAudioVoiceEnabled] = useState(false);
  const [prefilledGrievanceText, setPrefilledGrievanceText] = useState<string>('');

  const t = TRANSLATIONS[language];

  // Speech Synthesis helper
  const speakText = (text: string) => {
    if (!audioVoiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'te') {
      utterance.lang = 'te-IN';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // High Contrast & Font Size DOM classes
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.remove('font-size-large', 'font-size-xl');
    if (fontSize === 'large') document.body.classList.add('font-size-large');
    if (fontSize === 'xl') document.body.classList.add('font-size-xl');
  }, [fontSize]);

  const handleAddCaregiver = (newCgData: Omit<CaregiverDelegation, 'id' | 'addedOn'>) => {
    const newCaregiver: CaregiverDelegation = {
      ...newCgData,
      id: `CG-${Date.now()}`,
      addedOn: new Date().toISOString().split('T')[0]
    };
    setCaregivers([newCaregiver, ...caregivers]);

    const newLog: CaregiverAuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      caregiverName: newCgData.caregiverName,
      action: 'Caregiver Rights Delegated',
      ipLocation: 'Authorized Family Terminal',
      details: `Granted ${newCgData.accessLevel} access until ${newCgData.validUntil}.`,
      securityFlag: 'NORMAL'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleRevokeCaregiver = (cgId: string) => {
    const cg = caregivers.find(c => c.id === cgId);
    setCaregivers(caregivers.map(c => c.id === cgId ? { ...c, status: 'REVOKED' } : c));

    if (cg) {
      const newLog: CaregiverAuditLog = {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        caregiverName: cg.caregiverName,
        action: 'Caregiver Access REVOKED',
        ipLocation: 'Beneficiary Command',
        details: 'Beneficiary terminated all caregiver delegation rights immediately.',
        securityFlag: 'ALERT'
      };
      setAuditLogs([newLog, ...auditLogs]);
    }
  };

  const unreadCount = INITIAL_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-[#F4F6F8] text-[#172033] font-sans">
      {/* Deep Midnight Navy Desktop & Mobile Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          speakText(`Navigated to ${page}`);
        }}
        beneficiaries={beneficiaries}
        currentBeneficiary={currentBeneficiary}
        onSelectBeneficiary={(b) => {
          setCurrentBeneficiary(b);
          speakText(`Switched beneficiary to ${b.name}`);
        }}
        language={language}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-72 transition-all">
        {/* Top Header */}
        <Header
          beneficiaries={beneficiaries}
          currentBeneficiary={currentBeneficiary}
          onSelectBeneficiary={(b) => setCurrentBeneficiary(b)}
          language={language}
          onSelectLanguage={(l) => setLanguage(l)}
          fontSize={fontSize}
          onChangeFontSize={(s) => setFontSize(s)}
          highContrast={highContrast}
          onToggleHighContrast={() => setHighContrast(!highContrast)}
          audioVoiceEnabled={audioVoiceEnabled}
          onToggleAudioVoice={() => setAudioVoiceEnabled(!audioVoiceEnabled)}
          onSpeak={speakText}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          activePage={activePage}
          onNavigate={(p) => setActivePage(p)}
          unreadCount={unreadCount}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
          {activePage === 'DASHBOARD' && (
            <DashboardView
              beneficiary={currentBeneficiary}
              language={language}
              onNavigate={(page) => setActivePage(page)}
              onSpeak={speakText}
            />
          )}

          {activePage === 'TRACKER' && (
            <StatusTrackerTab
              beneficiary={currentBeneficiary}
              language={language}
              onNavigateToDiagnostic={() => setActivePage('DIAGNOSTIC')}
              onSpeak={speakText}
            />
          )}

          {activePage === 'DIAGNOSTIC' && (
            <DiagnosticDoctorTab
              beneficiary={currentBeneficiary}
              language={language}
              onNavigateToGrievance={(draftText) => {
                if (draftText) setPrefilledGrievanceText(draftText);
                setActivePage('GRIEVANCE');
              }}
              onSpeak={speakText}
            />
          )}

          {activePage === 'LOCKER' && (
            <DocumentRakshakTab
              beneficiary={currentBeneficiary}
              language={language}
              onSpeak={speakText}
            />
          )}

          {activePage === 'CAREGIVER' && (
            <CaregiverVaultTab
              beneficiary={currentBeneficiary}
              caregivers={caregivers}
              auditLogs={auditLogs}
              onAddCaregiver={handleAddCaregiver}
              onRevokeCaregiver={handleRevokeCaregiver}
              language={language}
              onSpeak={speakText}
            />
          )}

          {activePage === 'NOTIFICATIONS' && (
            <NotificationsView
              language={language}
              onSpeak={speakText}
            />
          )}

          {activePage === 'EXPLORE' && (
            <ExploreBenefitsView
              language={language}
              onNavigate={(page) => setActivePage(page)}
              onSpeak={speakText}
            />
          )}

          {activePage === 'GRIEVANCE' && (
            <GrievancePortalTab
              beneficiary={currentBeneficiary}
              language={language}
              initialText={prefilledGrievanceText}
              onSpeak={speakText}
            />
          )}

          {activePage === 'VOICE' && (
            <VoiceDeskTab
              beneficiary={currentBeneficiary}
              language={language}
              onSpeak={speakText}
            />
          )}

          {activePage === 'SETTINGS' && (
            <SettingsView
              language={language}
              onSelectLanguage={(l) => setLanguage(l)}
              fontSize={fontSize}
              onChangeFontSize={(s) => setFontSize(s)}
              highContrast={highContrast}
              onToggleHighContrast={() => setHighContrast(!highContrast)}
              audioVoiceEnabled={audioVoiceEnabled}
              onToggleAudioVoice={() => setAudioVoiceEnabled(!audioVoiceEnabled)}
              onSpeak={speakText}
            />
          )}

          {activePage === 'TECHNICAL' && (
            <TechnicalView />
          )}
        </main>

        {/* Fintech Quality Footer */}
        <footer className="mt-auto border-t border-[#D0D5DD] bg-white py-6 text-xs text-[#475467]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-[#111C2E] text-white flex items-center justify-center font-bold text-xs font-heading">
                సే
              </div>
              <div>
                <div className="font-bold text-[#111C2E]">SEVA SUTRA — Navigable Civic-Fintech Platform</div>
                <div className="text-[11px] text-[#475467]">Built for IMPACTX 2026 • Challenge 20 (Older Adults & Persons with Disabilities)</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1 text-[#087F68]">
                <Landmark className="w-3.5 h-3.5" /> DBT Bharat
              </span>
              <span className="flex items-center gap-1 text-[#087F68]">
                <ShieldCheck className="w-3.5 h-3.5" /> NPCI APBS
              </span>
              <span className="flex items-center gap-1 text-[#087F68]">
                <HeartHandshake className="w-3.5 h-3.5" /> Jeevan Pramaan
              </span>
              <span className="flex items-center gap-1 text-[#087F68]">
                <Scale className="w-3.5 h-3.5" /> CP-GRAMS
              </span>
              <span className="flex items-center gap-1 text-[#087F68]">
                <PhoneCall className="w-3.5 h-3.5" /> Elderline 14567
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
