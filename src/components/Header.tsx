import React from 'react';
import { Beneficiary, Language, NavPage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Volume2, 
  VolumeX, 
  Eye, 
  PhoneCall, 
  ShieldCheck, 
  Menu,
  Bell,
  User
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
  onOpenMobileMenu: () => void;
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  unreadCount: number;
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
  onOpenMobileMenu,
  activePage,
  onNavigate,
  unreadCount,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#D0D5DD] shadow-2xs">
      {/* Top Civic Security Strip */}
      <div className="bg-[#111C2E] text-white text-[11px] px-4 py-1.5 flex flex-wrap items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 text-[#A6F4C5] animate-pulse" />
          <span className="text-[#D0D5DD]">{t.hotline}</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[10px] text-[#98A2B3]">
          <span className="bg-[#1A2840] px-2 py-0.5 rounded-xs text-[#C5A267] font-mono-code font-bold">
            IMPACTX 2026 • Challenge 20
          </span>
          <span className="text-[#A6F4C5] flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3 h-3" /> DBT Bharat Aligned
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden text-[#111C2E] hover:bg-[#F4F6F8] p-2 rounded-lg border border-[#D0D5DD] cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg text-[#111C2E] tracking-tight">
                SEVA SUTRA
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#087F68] bg-[#E7F4EF] px-2 py-0.5 rounded-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Civic-Fintech
              </span>
            </div>
            <p className="text-[11px] text-[#475467] hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Accessibility Controls & Active Persona */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-[#F2F4F7] p-0.5 rounded-lg border border-[#D0D5DD]">
            <button
              onClick={() => {
                onSelectLanguage('en');
                onSpeak('Language set to English');
              }}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'en' 
                  ? 'bg-white text-[#111C2E] shadow-2xs font-bold' 
                  : 'text-[#475467] hover:text-[#111C2E]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                onSelectLanguage('te');
                onSpeak('భాష తెలుగుగా మార్చబడింది');
              }}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'te' 
                  ? 'bg-[#087F68] text-white shadow-2xs font-bold' 
                  : 'text-[#475467] hover:text-[#111C2E]'
              }`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => {
                onSelectLanguage('hi');
                onSpeak('भाषा हिंदी में बदली गई');
              }}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'hi' 
                  ? 'bg-[#087F68] text-white shadow-2xs font-bold' 
                  : 'text-[#475467] hover:text-[#111C2E]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Font Size Adjusters */}
          <div className="hidden sm:flex items-center bg-[#F2F4F7] p-0.5 rounded-lg border border-[#D0D5DD] text-xs font-bold text-[#111C2E]">
            <button
              onClick={() => onChangeFontSize('normal')}
              className={`px-2 py-1 rounded-sm cursor-pointer ${fontSize === 'normal' ? 'bg-white shadow-2xs' : 'text-[#475467]'}`}
              title="Normal Font Size"
            >
              A
            </button>
            <button
              onClick={() => onChangeFontSize('large')}
              className={`px-2 py-1 rounded-sm text-sm cursor-pointer ${fontSize === 'large' ? 'bg-white shadow-2xs' : 'text-[#475467]'}`}
              title="Large Font Size"
            >
              A+
            </button>
            <button
              onClick={() => onChangeFontSize('xl')}
              className={`px-2 py-1 rounded-sm text-base cursor-pointer ${fontSize === 'xl' ? 'bg-white shadow-2xs' : 'text-[#475467]'}`}
              title="Extra Large Font Size"
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={onToggleHighContrast}
            className={`p-2 rounded-lg border flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
              highContrast 
                ? 'bg-black text-amber-300 border-amber-400 ring-2 ring-amber-400' 
                : 'bg-white text-[#475467] border-[#D0D5DD] hover:bg-[#F4F6F8]'
            }`}
            title="Toggle High Contrast Display Mode"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Audio Voice Narration Toggle */}
          <button
            onClick={onToggleAudioVoice}
            className={`p-2 rounded-lg border flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
              audioVoiceEnabled 
                ? 'bg-[#E7F4EF] text-[#087F68] border-[#A6F4C5] ring-1 ring-[#087F68]' 
                : 'bg-white text-[#475467] border-[#D0D5DD] hover:bg-[#F4F6F8]'
            }`}
            title="Toggle Spoken Audio Narration"
          >
            {audioVoiceEnabled ? <Volume2 className="w-4 h-4 text-[#087F68]" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          {/* Notifications Shortcut */}
          <button
            onClick={() => onNavigate('NOTIFICATIONS')}
            className="p-2 rounded-lg border border-[#D0D5DD] text-[#475467] hover:bg-[#F4F6F8] relative cursor-pointer"
            title="View Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B42332] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
