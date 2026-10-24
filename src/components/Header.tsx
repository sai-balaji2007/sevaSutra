import React from 'react';
import { Beneficiary, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Volume2, 
  VolumeX, 
  Eye, 
  PhoneCall, 
  ShieldCheck, 
  ChevronDown, 
  User, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  beneficiaries: Beneficiary[];
  currentBeneficiary: Beneficiary;
  onSelectBeneficiary: (b: Beneficiary) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  fontSize: 'normal' | 'large' | 'xl';
  onChangeFontSize: (size: 'normal' | 'large' | 'xl') => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  audioVoiceEnabled: boolean;
  onToggleAudioVoice: () => void;
  onSpeak: (text: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  beneficiaries,
  currentBeneficiary,
  onSelectBeneficiary,
  language,
  onSelectLanguage,
  fontSize,
  onChangeFontSize,
  highContrast,
  onToggleHighContrast,
  audioVoiceEnabled,
  onToggleAudioVoice,
  onSpeak,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="border-b border-[#E2DAC7] bg-[#FDFBF7] shadow-xs">
      {/* Emergency & National Helpline Bar */}
      <div className="bg-[#087F68] text-white text-xs md:text-sm px-4 py-1.5 flex flex-wrap items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 animate-pulse text-[#E8F5E9]" />
          <span>{t.hotline}</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="hidden md:inline bg-[#055C4B] px-2 py-0.5 rounded-sm">IMPACTX 2026 • Challenge 20 Civic-Fintech</span>
          <span className="text-[#A7F3D0]">DBT Bharat Aligned</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand Logo & Motto */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#087F68] text-white flex items-center justify-center shadow-md font-bold text-2xl font-heading ring-2 ring-[#087F68]/20">
            సే
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#101B2D] font-heading">
                {t.appTitle}
              </h1>
              <span className="bg-[#E8F5E9] text-[#087F68] text-xs font-semibold px-2 py-0.5 rounded-full border border-[#087F68]/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Suraksha Verified
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#4A5568]">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Accessibility Toolbar & Language Select */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Language Selector */}
          <div className="flex items-center bg-[#EFE9DC] p-1 rounded-lg border border-[#D5CBB8]">
            <button
              onClick={() => {
                onSelectLanguage('en');
                onSpeak('Language switched to English');
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'en' 
                  ? 'bg-white text-[#101B2D] shadow-xs' 
                  : 'text-[#4A5568] hover:text-[#101B2D]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                onSelectLanguage('te');
                onSpeak('భాష తెలుగుగా మార్చబడింది');
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'te' 
                  ? 'bg-[#087F68] text-white shadow-xs' 
                  : 'text-[#4A5568] hover:text-[#101B2D]'
              }`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => {
                onSelectLanguage('hi');
                onSpeak('भाषा हिंदी में बदली गई');
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'hi' 
                  ? 'bg-[#087F68] text-white shadow-xs' 
                  : 'text-[#4A5568] hover:text-[#101B2D]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Font Size Adjusters */}
          <div className="flex items-center bg-[#EFE9DC] p-1 rounded-lg border border-[#D5CBB8] text-xs font-bold text-[#101B2D]">
            <span className="px-1.5 text-[#5A6A80] text-[10px] uppercase">Size:</span>
            <button
              onClick={() => onChangeFontSize('normal')}
              className={`px-2 py-1 rounded-sm ${fontSize === 'normal' ? 'bg-white shadow-xs' : 'text-[#4A5568]'}`}
              title="Normal Font Size"
            >
              A
            </button>
            <button
              onClick={() => onChangeFontSize('large')}
              className={`px-2 py-1 rounded-sm text-sm ${fontSize === 'large' ? 'bg-white shadow-xs' : 'text-[#4A5568]'}`}
              title="Large Font Size"
            >
              A+
            </button>
            <button
              onClick={() => onChangeFontSize('xl')}
              className={`px-2 py-1 rounded-sm text-base ${fontSize === 'xl' ? 'bg-white shadow-xs' : 'text-[#4A5568]'}`}
              title="Extra Large Font Size"
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={onToggleHighContrast}
            className={`p-2 rounded-lg border flex items-center gap-1 text-xs font-semibold transition-all ${
              highContrast 
                ? 'bg-black text-amber-300 border-amber-400 ring-2 ring-amber-400' 
                : 'bg-[#EFE9DC] text-[#101B2D] border-[#D5CBB8] hover:bg-[#E5DDCD]'
            }`}
            title="Toggle High Contrast Mode for Visually Impaired"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* Audio Voice Narration Toggle */}
          <button
            onClick={onToggleAudioVoice}
            className={`p-2 rounded-lg border flex items-center gap-1 text-xs font-semibold transition-all ${
              audioVoiceEnabled 
                ? 'bg-[#087F68] text-white border-[#087F68] ring-2 ring-[#087F68]/30' 
                : 'bg-[#EFE9DC] text-[#101B2D] border-[#D5CBB8] hover:bg-[#E5DDCD]'
            }`}
            title="Toggle Spoken Audio Feedback"
          >
            {audioVoiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-200" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            <span className="hidden sm:inline">{audioVoiceEnabled ? 'Voice ON' : 'Voice OFF'}</span>
          </button>
        </div>
      </div>

      {/* Active Beneficiary Ribbon */}
      <div className="bg-[#EAE2D2] border-t border-[#DFD5C2] px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#5A6A80] font-medium text-xs uppercase tracking-wide">
              {t.activeBeneficiary}:
            </span>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#D5CBB8] shadow-2xs font-semibold text-[#101B2D]">
              <User className="w-4 h-4 text-[#087F68]" />
              <span>{currentBeneficiary.name}</span>
              <span className="text-xs text-[#5A6A80] font-normal">
                ({currentBeneficiary.age}y, {currentBeneficiary.category})
              </span>
              <span className="text-xs bg-[#E8F5E9] text-[#087F68] px-2 py-0.5 rounded-full font-mono-code font-bold">
                {currentBeneficiary.pensionId}
              </span>
            </div>
          </div>

          {/* Quick Beneficiary Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#5A6A80] font-medium hidden sm:inline">
              {t.switchBeneficiary}:
            </label>
            <select
              value={currentBeneficiary.id}
              onChange={(e) => {
                const found = beneficiaries.find(b => b.id === e.target.value);
                if (found) {
                  onSelectBeneficiary(found);
                  onSpeak(`Selected beneficiary: ${found.name}`);
                }
              }}
              className="bg-white text-xs md:text-sm font-medium border border-[#D5CBB8] rounded-lg px-2.5 py-1 text-[#101B2D] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
            >
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} — {b.scheme} ({b.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
