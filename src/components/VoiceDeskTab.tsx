import React, { useState } from 'react';
import { Beneficiary, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { StatusChip } from './StatusChip';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Bot, 
  User, 
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
      {/* Hero Banner - Midnight Navy */}
      <div className="bg-[#111C2E] text-white p-6 rounded-2xl border border-[#1F2F4A] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#1A2840] rounded-xl border border-[#2D3E5D] shrink-0">
              <Bot className="w-6 h-6 text-[#A6F4C5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-white tracking-tight">
                  {t.tabVoice}
                </h2>
                <StatusChip variant="official" label="Vernacular AI" source="Voice" />
              </div>
              <p className="text-xs md:text-sm text-[#98A2B3] mt-1 max-w-2xl leading-relaxed">
                {t.voiceAssistantPrompt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-[#1A2840] px-3 py-1.5 rounded-lg border border-[#2D3E5D] text-[#D0D5DD]">
              Languages: English • తెలుగు • हिन्दी
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Quick Tap Prompts */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-[#475467] uppercase tracking-wider">
          Quick Accessibility Questions (Tap to Speak):
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="bg-white hover:bg-[#F9FAFB] text-[#172033] border border-[#D0D5DD] px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs hover:border-[#087F68] transition-all cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#087F68]" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-2xl border border-[#D0D5DD] shadow-xs p-6 space-y-4 min-h-[340px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[440px] pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-[#111C2E] text-white' : 'bg-[#E7F4EF] text-[#087F68]'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[80%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  isUser 
                    ? 'bg-[#111C2E] text-white rounded-tr-none' 
                    : 'bg-[#F8F9FA] text-[#172033] border border-[#D0D5DD] rounded-tl-none shadow-2xs'
                }`}>
                  <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => onSpeak(msg.text)}
                        className="hover:underline flex items-center gap-1 text-[#087F68] font-bold cursor-pointer"
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
            <div className="flex items-center gap-3 text-xs text-[#475467]">
              <div className="w-7 h-7 rounded-lg bg-[#E7F4EF] text-[#087F68] flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-2.5 bg-[#F8F9FA] rounded-lg border border-[#D0D5DD]">
                <Sparkles className="w-3.5 h-3.5 inline animate-spin text-[#087F68] mr-2" />
                Processing question...
              </div>
            </div>
          )}
        </div>

        {/* Big Mic Button & Input Control Bar */}
        <div className="pt-4 border-t border-[#F2F4F7] space-y-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleMicListening}
              className={`p-3.5 rounded-xl font-bold shadow-xs flex items-center justify-center transition-all cursor-pointer ${
                isListening 
                  ? 'bg-[#B42332] text-white animate-pulse ring-2 ring-[#B42332]/30' 
                  : 'bg-[#087F68] hover:bg-[#066553] text-white hover:scale-105'
              }`}
              title="Click to Speak"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion(inputText)}
              placeholder={isListening ? t.listening : 'Type or speak your question...'}
              className="flex-1 bg-white border border-[#D0D5DD] rounded-xl px-4 py-2.5 text-xs text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#087F68]"
            />

            <button
              onClick={() => handleAskQuestion(inputText)}
              disabled={!inputText.trim() || loading}
              className="bg-[#111C2E] hover:bg-black text-white p-3 rounded-xl font-bold shadow-xs disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#475467] px-1">
            <span>Official Civic Grounding • No Hallucination Protocol</span>
            <span className="flex items-center gap-1 text-[#087F68] font-bold">
              <PhoneCall className="w-3 h-3" /> Elderline: 14567
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
