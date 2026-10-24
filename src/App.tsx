import React, { useState, useEffect } from 'react';
import { Beneficiary, CaregiverDelegation, CaregiverAuditLog, Language } from './types';
import { INITIAL_BENEFICIARIES, INITIAL_CAREGIVERS, INITIAL_AUDIT_LOGS } from './data/mockData';
import { TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { StatusTrackerTab } from './components/StatusTrackerTab';
import { DiagnosticDoctorTab } from './components/DiagnosticDoctorTab';
import { CaregiverVaultTab } from './components/CaregiverVaultTab';
import { DocumentRakshakTab } from './components/DocumentRakshakTab';
import { GrievancePortalTab } from './components/GrievancePortalTab';
import { VoiceDeskTab } from './components/VoiceDeskTab';
import { 
  Building2, 
  Stethoscope, 
  ShieldCheck, 
  FolderCheck, 
  FileText, 
  Bot, 
  ExternalLink,
  HeartHandshake,
  Landmark,
  Scale
} from 'lucide-react';

export function App() {
  const [beneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [currentBeneficiary, setCurrentBeneficiary] = useState<Beneficiary>(INITIAL_BENEFICIARIES[0]);
  const [caregivers, setCaregivers] = useState<CaregiverDelegation[]>(INITIAL_CAREGIVERS);
  const [auditLogs, setAuditLogs] = useState<CaregiverAuditLog[]>(INITIAL_AUDIT_LOGS);

  const [activeTab, setActiveTab] = useState<
    'TRACKER' | 'DIAGNOSTIC' | 'CAREGIVER' | 'LOCKER' | 'GRIEVANCE' | 'VOICE'
  >('TRACKER');

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

    // Add audit log
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#101B2D]">
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
      />

      {/* Main Tab Navigation */}
      <nav className="bg-[#EFE9DC] border-b border-[#D5CBB8] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto scrollbar-none gap-2 py-2">
          <button
            onClick={() => {
              setActiveTab('TRACKER');
              speakText(t.tabTracker);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'TRACKER'
                ? 'bg-[#087F68] text-white shadow-md'
                : 'text-[#4A5568] hover:bg-white/60 hover:text-[#101B2D]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{t.tabTracker}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('DIAGNOSTIC');
              speakText(t.tabDiagnostic);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'DIAGNOSTIC'
                ? 'bg-[#087F68] text-white shadow-md'
                : 'text-[#4A5568] hover:bg-white/60 hover:text-[#101B2D]'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-300" />
            <span>{t.tabDiagnostic}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('CAREGIVER');
              speakText(t.tabCaregiver);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'CAREGIVER'
                ? 'bg-[#087F68] text-white shadow-md'
                : 'text-[#4A5568] hover:bg-white/60 hover:text-[#101B2D]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.tabCaregiver}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('LOCKER');
              speakText(t.tabLocker);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'LOCKER'
                ? 'bg-[#087F68] text-white shadow-md'
                : 'text-[#4A5568] hover:bg-white/60 hover:text-[#101B2D]'
            }`}
          >
            <FolderCheck className="w-4 h-4" />
            <span>{t.tabLocker}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('GRIEVANCE');
              speakText(t.tabGrievance);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'GRIEVANCE'
                ? 'bg-[#087F68] text-white shadow-md'
                : 'text-[#4A5568] hover:bg-white/60 hover:text-[#101B2D]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.tabGrievance}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('VOICE');
              speakText(t.tabVoice);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'VOICE'
                ? 'bg-[#087F68] text-white shadow-md'
                : 'text-[#4A5568] hover:bg-white/60 hover:text-[#101B2D]'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-300" />
            <span>{t.tabVoice}</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'TRACKER' && (
          <StatusTrackerTab
            beneficiary={currentBeneficiary}
            language={language}
            onNavigateToDiagnostic={() => setActiveTab('DIAGNOSTIC')}
            onSpeak={speakText}
          />
        )}

        {activeTab === 'DIAGNOSTIC' && (
          <DiagnosticDoctorTab
            beneficiary={currentBeneficiary}
            language={language}
            onNavigateToGrievance={(draftText) => {
              if (draftText) setPrefilledGrievanceText(draftText);
              setActiveTab('GRIEVANCE');
            }}
            onSpeak={speakText}
          />
        )}

        {activeTab === 'CAREGIVER' && (
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

        {activeTab === 'LOCKER' && (
          <DocumentRakshakTab
            beneficiary={currentBeneficiary}
            language={language}
            onSpeak={speakText}
          />
        )}

        {activeTab === 'GRIEVANCE' && (
          <GrievancePortalTab
            beneficiary={currentBeneficiary}
            language={language}
            initialText={prefilledGrievanceText}
            onSpeak={speakText}
          />
        )}

        {activeTab === 'VOICE' && (
          <VoiceDeskTab
            beneficiary={currentBeneficiary}
            language={language}
            onSpeak={speakText}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2DAC7] bg-[#FAF8F5] py-8 text-xs text-[#5A6A80]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#087F68] text-white flex items-center justify-center font-bold text-sm">
              సే
            </div>
            <div>
              <div className="font-bold text-[#101B2D]">SEVA SUTRA — Navigable Pensions & Social Benefits</div>
              <div>Built for IMPACTX 2026 • Challenge 20 (Civic-Fintech for Older Adults & PwD)</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-[#087F68]">
              <Landmark className="w-3.5 h-3.5" /> DBT Bharat
            </span>
            <span className="flex items-center gap-1 text-[#087F68]">
              <ShieldCheck className="w-3.5 h-3.5" /> NPCI APBS
            </span>
            <span className="flex items-center gap-1 text-[#087F68]">
              <HeartHandshake className="w-3.5 h-3.5" /> Jeevan Pramaan (UIDAI Face RD)
            </span>
            <span className="flex items-center gap-1 text-[#087F68]">
              <Scale className="w-3.5 h-3.5" /> CP-GRAMS
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
