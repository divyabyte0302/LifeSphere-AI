import React, { useState } from 'react';
import {
  Stethoscope,
  Send,
  Sparkles,
  AlertTriangle,
  Heart,
  Wind,
  ShieldAlert,
  Info,
  ChevronRight,
  Bot,
  User,
  Activity
} from 'lucide-react';
import { HealthMetrics, EnvironmentalData } from '../types';

interface CheckupViewProps {
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  isMobile?: boolean;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  triageLevel?: 'safe' | 'moderate' | 'urgent';
  timestamp: string;
}

export const CheckupView: React.FC<CheckupViewProps> = ({ vitals, environment, isMobile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello Dr. Vance. I am your LifeSphere AI Clinical & Environmental Triage Assistant. I continuously monitor your vitals (HR: ${vitals.heartRate} BPM, SpO2: ${vitals.spO2}%) and ambient air quality (${environment.airQualityIndex} AQI, PM2.5: ${environment.pm25} µg/m³). What physical symptoms or environmental irritations are you experiencing right now?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickSymptoms = [
    'Mild chest tightness & cough',
    'Dry throat & itchy eyes',
    'Headache and eye strain in sunlight',
    'Shortness of breath after walking outdoors',
    'Palpitations and fatigue',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let triage: 'safe' | 'moderate' | 'urgent' = 'safe';
      const q = query.toLowerCase();

      if (q.includes('breath') || q.includes('tight') || q.includes('wheez') || q.includes('cough')) {
        triage = environment.airQualityIndex > 100 ? 'urgent' : 'moderate';
        reply = `Cross-referencing your reported respiratory symptoms against ambient atmospheric conditions:
- **Ambient AQI**: ${environment.airQualityIndex} (${environment.airQualityCategory})
- **PM2.5 Micro-Dust**: ${environment.pm25} µg/m³ (known bronchial spasm trigger)
- **Pulse Oximetry (SpO2)**: ${vitals.spO2}% | Heart Rate: ${vitals.heartRate} BPM

**Clinical Directive**:
1. Inhale 2 puffs of your prescribed albuterol rescue inhaler as a bronchodilator.
2. Retreat to a sealed, HEPA-filtered indoor space immediately.
3. If SpO2 drops below 94% or wheezing persists past 15 minutes, trigger LifeSphere Emergency SOS.`;
      } else if (q.includes('headache') || q.includes('eye') || q.includes('sun') || q.includes('dizz')) {
        triage = 'moderate';
        reply = `Evaluating cephalalgic symptoms against ambient sensory environment:
- **Ambient UV Index**: ${environment.uvIndex.toFixed(1)} (${environment.uvCategory})
- **Temperature / Humidity**: ${environment.temperature}°C / ${environment.humidity}%
- **Active Prescription**: Doxycycline Hyclate (photosensitizing agent)

**Clinical Directive**:
1. High UV combined with your photosensitive medication can trigger photophobic migraines.
2. Ingest 500mL of chilled electrolyte solution to mitigate heat-induced dehydration.
3. Rest in a dimly lit, air-conditioned room for 20 minutes.`;
      } else if (q.includes('throat') || q.includes('itch') || q.includes('sneeze') || q.includes('allergy')) {
        triage = 'safe';
        reply = `Corroborating mucosal irritation with allergen telemetry:
- **Pollen Allergen Count**: ${environment.pollenCount} grains/m³ (${environment.pollenCategory})
- **Patient Profile**: Known tree & ragweed pollen sensitivity

**Clinical Directive**:
1. Rinse eyes and nasal passages with sterile isotonic saline wash.
2. Keep bedroom windows closed to prevent pollen particulate infiltration.
3. Your scheduled evening Montelukast 10mg will provide overnight leukotriene receptor blockade.`;
      } else {
        reply = `I have logged this symptom report. Your vital signs remain within safe clinical boundaries (BP: ${vitals.bloodPressure}, SpO2: ${vitals.spO2}%). The ambient environment currently presents low acute risk. Continue monitoring; if acute pain or dyspnea develops, notify clinical services.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          triageLevel: triage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className={`p-4 ${isMobile ? 'h-[730px]' : 'p-6 max-w-5xl mx-auto h-[calc(100vh-120px)]'} flex flex-col`}>
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              AI Symptom & Environmental Triage
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                Dual Stream
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live vitals & atmospheric pollutants automatically factored into triage
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1 text-rose-400 font-medium">
            <Heart className="w-3.5 h-3.5" /> {vitals.heartRate} BPM
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <Wind className="w-3.5 h-3.5" /> {environment.airQualityIndex} AQI
          </span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              {m.triageLevel && (
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      m.triageLevel === 'urgent'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : m.triageLevel === 'moderate'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    Triage Level: {m.triageLevel}
                  </span>
                </div>
              )}
              <div className="whitespace-pre-line">{m.text}</div>
              <div className="mt-1.5 text-[10px] text-slate-400 text-right">{m.timestamp}</div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>LifeSphere AI synthesizing biometric and atmospheric telemetry...</span>
          </div>
        )}
      </div>

      {/* Quick symptom prompt pills */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">Suggestions:</span>
        {quickSymptoms.map((sym, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sym)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-300 hover:text-white shrink-0 transition-colors"
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your current symptoms or physical sensations..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Analyze</span>
        </button>
      </form>
    </div>
  );
};
