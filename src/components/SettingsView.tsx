import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { StatusChip } from './StatusChip';
import { 
  Settings, 
  Eye, 
  Volume2, 
  VolumeX, 
  Type, 
  Globe, 
  Keyboard, 
  ShieldCheck, 
  PhoneCall
} from 'lucide-react';

interface SettingsViewProps {
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

export const SettingsView: React.FC<SettingsViewProps> = ({
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#D0D5DD] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#087F68] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Settings className="w-6 h-6 text-[#A6F4C5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#111C2E] font-heading tracking-tight">
                Accessibility Preferences & System Settings
              </h2>
              <StatusChip variant="official" label="WCAG 2.1 AAA" source="Standards" />
            </div>
            <p className="text-xs md:text-sm text-[#475467] mt-1 leading-relaxed">
              Tailor font scaling, visual contrast, spoken narration, and vernacular localization for older adults and individuals with visual or motor impairments.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text Scaling Card */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Type className="w-5 h-5 text-[#087F68]" />
            <h3 className="text-base font-bold text-[#111C2E] font-heading">
              {t.textSize} (Text Size Scaling)
            </h3>
          </div>
          <p className="text-xs text-[#475467]">
            Scale typography across all cards, dialogs, and tables to ensure effortless legibility.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => {
                onChangeFontSize('normal');
                onSpeak('Text size set to standard 100%');
              }}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                fontSize === 'normal'
                  ? 'bg-[#E7F4EF] border-[#087F68] text-[#087F68] ring-1 ring-[#087F68]'
                  : 'bg-white border-[#D0D5DD] text-[#344054]'
              }`}
            >
              Standard (A)
            </button>
            <button
              onClick={() => {
                onChangeFontSize('large');
                onSpeak('Text size increased to Large 112%');
              }}
              className={`p-3 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                fontSize === 'large'
                  ? 'bg-[#E7F4EF] border-[#087F68] text-[#087F68] ring-1 ring-[#087F68]'
                  : 'bg-white border-[#D0D5DD] text-[#344054]'
              }`}
            >
              Large (A+)
            </button>
            <button
              onClick={() => {
                onChangeFontSize('xl');
                onSpeak('Text size increased to Extra Large 125%');
              }}
              className={`p-3 rounded-xl border text-center font-bold text-base transition-all cursor-pointer ${
                fontSize === 'xl'
                  ? 'bg-[#E7F4EF] border-[#087F68] text-[#087F68] ring-1 ring-[#087F68]'
                  : 'bg-white border-[#D0D5DD] text-[#344054]'
              }`}
            >
              Extra Large (A++)
            </button>
          </div>
        </div>

        {/* Visual Contrast Card */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-[#087F68]" />
            <h3 className="text-base font-bold text-[#111C2E] font-heading">
              {t.highContrast} (High Contrast Display)
            </h3>
          </div>
          <p className="text-xs text-[#475467]">
            Enhance readability for low-vision users by switching to high-contrast dark surfaces with amber outlines.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                onToggleHighContrast();
                onSpeak(highContrast ? 'High contrast turned off' : 'High contrast mode turned on');
              }}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                highContrast
                  ? 'bg-black text-amber-300 border-amber-400 ring-2 ring-amber-400'
                  : 'bg-white border-[#D0D5DD] text-[#111C2E] hover:bg-[#F4F6F8]'
              }`}
            >
              <span>{highContrast ? 'Active: High Contrast Mode' : 'Standard Fintech Color Palette'}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                highContrast ? 'bg-amber-400 text-black' : 'bg-[#E7F4EF] text-[#087F68]'
              }`}>
                {highContrast ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {/* Spoken Voice Narration Card */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-[#087F68]" />
            <h3 className="text-base font-bold text-[#111C2E] font-heading">
              {t.audioReadout} (Spoken Audio Feedback)
            </h3>
          </div>
          <p className="text-xs text-[#475467]">
            Automatically announce tab changes, diagnostic results, and critical warnings aloud using browser speech synthesis.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                onToggleAudioVoice();
                if (!audioVoiceEnabled) {
                  setTimeout(() => onSpeak('Voice narration enabled. System will announce key actions.'), 100);
                }
              }}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                audioVoiceEnabled
                  ? 'bg-[#E7F4EF] text-[#087F68] border-[#A6F4C5] ring-1 ring-[#087F68]'
                  : 'bg-white border-[#D0D5DD] text-[#475467] hover:bg-[#F4F6F8]'
              }`}
            >
              <div className="flex items-center gap-2">
                {audioVoiceEnabled ? <Volume2 className="w-4 h-4 text-[#087F68]" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
                <span>{audioVoiceEnabled ? 'Voice Narration: Enabled' : 'Voice Narration: Muted'}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                audioVoiceEnabled ? 'bg-[#087F68] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {audioVoiceEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </button>
          </div>
        </div>

        {/* Language Selection Card */}
        <div className="bg-white rounded-2xl border border-[#D0D5DD] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#087F68]" />
            <h3 className="text-base font-bold text-[#111C2E] font-heading">
              Vernacular Language Selection
            </h3>
          </div>
          <p className="text-xs text-[#475467]">
            Switch entire application copy between English, Telugu (తెలుగు), and Hindi (हिन्दी).
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => {
                onSelectLanguage('en');
                onSpeak('Language set to English');
              }}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#111C2E] text-white border-[#111C2E]'
                  : 'bg-white border-[#D0D5DD] text-[#344054] hover:bg-[#F9FAFB]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                onSelectLanguage('te');
                onSpeak('భాష తెలుగుగా ఎంపిక చేయబడింది');
              }}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                language === 'te'
                  ? 'bg-[#087F68] text-white border-[#087F68]'
                  : 'bg-white border-[#D0D5DD] text-[#344054] hover:bg-[#F9FAFB]'
              }`}
            >
              తెలుగు (Telugu)
            </button>
            <button
              onClick={() => {
                onSelectLanguage('hi');
                onSpeak('भाषा हिंदी चुनी गई');
              }}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-[#087F68] text-white border-[#087F68]'
                  : 'bg-white border-[#D0D5DD] text-[#344054] hover:bg-[#F9FAFB]'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
