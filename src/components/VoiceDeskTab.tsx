import React, { useState } from 'react';
import { Beneficiary, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Send, 
  MessageSquare, 
  HelpCircle, 
  Bot, 
  User, 
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface VoiceDeskTabProps {
  beneficiary: Beneficiary;
  language: Language;
  onSpeak: (text: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const VoiceDeskTab: React.FC<VoiceDeskTabProps> = ({
  beneficiary,
  language,
  onSpeak,
}) => {
  const t = TRANSLATIONS[language];

  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const initialGreeting = language === 'te'
    ? `నమస్కారం! నేను కృప, మీ పింఛను సహాయకురాలిని. మీ పింఛను ₹${beneficiary.monthlyAmount} జమ కావడం లేదా ఆధార్ సీడింగ్ గురించి ఏదైనా అడగండి.`
    : language === 'hi'
      ? `नमस्ते! मैं कृपा हूँ, आपकी पेंशन सहायक। आपकी ₹${beneficiary.monthlyAmount} की पेंशन या आधार सीडिंग के बारे में कोई भी सवाल पूछें।`
      : `Namaste! I am Krupa, your pension assistant. Ask me anything about your ₹${beneficiary.monthlyAmount} pension, Aadhaar DBT, or doorstep postman assistance.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: initialGreeting,
      timestamp: 'Just now'
    }
  ]);

  // Suggested preset questions by language
  const suggestedQuestions = language === 'te'
    ? [
        'నా పింఛను ఎందుకు రాలేదు?',
        'పోస్ట్‌మ్యాన్ ఇంటికే వచ్చి ఆధార్ లింక్ చేస్తారా?',
        'ఫోన్‌తో జీవన్ ప్రమాణ్ ఎలా చేయాలి?',
        'నా కేర్‌గివర్ నా ఖాతా నుండి డబ్బు తీసుకోగలరా?'
      ]
    : language === 'hi'
      ? [
          'मेरी पेंशन इस महीने क्यों नहीं आई?',
          'क्या डाकिया घर आकर आधार लिंक कर सकता है?',
          'मोबाइल से जीवन प्रमाण कैसे जमा करें?',
          'क्या केयरगिवर मेरे खाते से पैसे निकाल सकता है?'
        ]
      : [
          'Why was my pension delayed this month?',
          'Can the postman visit my home for Aadhaar DBT seeding?',
          'How to submit Jeevan Pramaan from mobile phone?',
          'Can my caregiver withdraw money from my account?'
        ];

  const handleAskQuestion = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/voice-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          language,
          beneficiaryName: beneficiary.name,
          scheme: beneficiary.schemeTitle
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.reply || 'Your inquiry has been received. Please verify with your local Sachivalayam or bank branch.';
        const assistantMsg: ChatMessage = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMsg]);
        onSpeak(reply);
      } else {
        throw new Error('Response not ok');
      }
    } catch (err) {
      const fallbackReply = language === 'te'
        ? 'మీ పింఛను డీబీటీ ద్వారా నేరుగా బ్యాంక్ ఖాతాకు జమ అవుతుంది. ఆధార్ లింక్ చేయడానికి మీ పోస్ట్‌మ్యాన్‌ను (155299) సంప్రదించండి.'
        : 'Your pension is credited directly to your bank account. Call postman helpline 155299 for doorstep Aadhaar DBT assistance.';
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
      onSpeak(fallbackReply);
    } finally {
      setLoading(false);
    }
  };

  const toggleMicListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice speech recognition is not supported in this browser. Please type or click the preset questions below.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        onSpeak(language === 'te' ? 'మీ ప్రశ్నను మాట్లాడండి' : 'Listening, please speak your question');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          handleAskQuestion(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Microphone start error:', err);
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#087F68] to-[#0A967B] text-white p-6 rounded-3xl shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs ring-1 ring-white/20">
              <Bot className="w-8 h-8 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-heading">
                  {t.tabVoice} (కృప / Krupa Assistant)
                </h2>
                <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> Multilingual Voice
                </span>
              </div>
              <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
                {t.voiceAssistantPrompt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-black/20 px-3 py-1.5 rounded-xl text-emerald-100">
              Languages: English • తెలుగు • हिन्दी
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Quick Tap Prompts */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-[#5A6A80] uppercase tracking-wider">
          Quick Accessibility Questions (Tap to Ask):
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="bg-white hover:bg-[#FAF8F5] text-[#101B2D] border border-[#D5CBB8] px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold shadow-2xs hover:border-[#087F68] transition-all cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#087F68]" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl border border-[#E2DAC7] shadow-xs p-6 space-y-4 min-h-[340px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[440px] pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-[#101B2D] text-white' : 'bg-[#087F68] text-white shadow-xs'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-200" />}
                </div>

                <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser 
                    ? 'bg-[#101B2D] text-white rounded-tr-none' 
                    : 'bg-[#FDFBF7] text-[#101B2D] border border-[#E8E1D3] rounded-tl-none shadow-2xs'
                }`}>
                  <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => onSpeak(msg.text)}
                        className="hover:underline flex items-center gap-1 text-[#087F68] font-bold"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Listen Aloud
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-[#5A6A80]">
              <div className="w-8 h-8 rounded-full bg-[#087F68] text-white flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E1D3]">
                <Sparkles className="w-4 h-4 inline animate-spin text-[#087F68] mr-2" />
                Thinking in {language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}...
              </div>
            </div>
          )}
        </div>

        {/* Big Mic Button & Input Control Bar */}
        <div className="pt-4 border-t border-[#E2DAC7] space-y-3">
          <div className="flex items-center gap-3">
            {/* Big Accessible Mic */}
            <button
              onClick={toggleMicListening}
              className={`p-4 rounded-2xl font-bold shadow-md flex items-center justify-center transition-all cursor-pointer ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-300' 
                  : 'bg-[#087F68] hover:bg-[#066553] text-white hover:scale-105'
              }`}
              title="Click to Speak"
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion(inputText)}
              placeholder={isListening ? t.listening : 'Or type your question here...'}
              className="flex-1 bg-[#FAF8F5] border border-[#D5CBB8] rounded-2xl px-4 py-3 text-sm text-[#101B2D] focus:outline-none focus:ring-2 focus:ring-[#087F68] focus:bg-white"
            />

            {/* Send Button */}
            <button
              onClick={() => handleAskQuestion(inputText)}
              disabled={!inputText.trim() || loading}
              className="bg-[#101B2D] hover:bg-black text-white p-3.5 rounded-2xl font-bold shadow-xs disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-[#5A6A80] px-1">
            <span>Powered by Gemini & Civic Rules Knowledge Base</span>
            <span className="flex items-center gap-1 text-[#087F68] font-bold">
              <PhoneCall className="w-3.5 h-3.5" /> Elderline: 14567
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
