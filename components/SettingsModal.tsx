import React, { useState, useRef } from 'react';
import { X, Play, Loader2, Volume2, Zap } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    voice: string;
    language: string;
    instantAnalysis: boolean;
  };
  onSettingsChange: (newSettings: any) => void;
  languages: string[];
  labels: any;
}

const VOICES = [
  { name: 'Kore', label: 'Kore', gender: 'Female' },
  { name: 'Fenrir', label: 'Fenrir', gender: 'Male' },
  { name: 'Puck', label: 'Puck', gender: 'Male' },
  { name: 'Zephyr', label: 'Zephyr', gender: 'Female' },
  { name: 'Charon', label: 'Charon', gender: 'Male' },
];

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext) {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange, 
  languages,
  labels 
}) => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  if (!isOpen) return null;

  const handlePreviewVoice = async (voiceName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingVoice) return;

    setPlayingVoice(voiceName);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const text = "Hello traveler, I am your local guide.";
      const base64Audio = await generateSpeech(text, voiceName);
      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => setPlayingVoice(null);
      source.start();
    } catch (err) {
      console.error(err);
      setPlayingVoice(null);
    }
  };

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-[#121212]/80 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 bg-white/[0.02]">
          <h2 className="text-lg font-medium text-white tracking-wide">{labels.settingsTitle}</h2>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Instant Analysis */}
          <section>
             <div className="flex items-center gap-2 mb-4 text-white/40">
                <Zap className="w-3 h-3" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">{labels.analysisMode}</h3>
             </div>
             
             <div 
               onClick={() => updateSetting('instantAnalysis', !settings.instantAnalysis)}
               className="group flex items-center justify-between cursor-pointer"
             >
                <div className="flex-1 pr-4">
                  <div className="text-sm font-medium text-white/90 mb-1">
                    {labels.instantAnalysis}
                  </div>
                  <div className="text-xs text-white/40 font-light leading-relaxed">
                    {labels.instantAnalysisDesc}
                  </div>
                </div>
                
                {/* iOS Style Toggle */}
                <div className={`
                  relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-300 ease-in-out
                  ${settings.instantAnalysis ? 'bg-white' : 'bg-white/10'}
                `}>
                  <div className={`
                    absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full shadow-sm transform transition-transform duration-300 ease-in-out
                    ${settings.instantAnalysis ? 'translate-x-5' : 'translate-x-0'}
                  `}/>
                </div>
             </div>
          </section>

          {/* Voice Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-white/40">
              <Volume2 className="w-3 h-3" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">{labels.voicePersona}</h3>
            </div>
            <div className="space-y-1">
              {VOICES.map((voice) => (
                <div 
                  key={voice.name}
                  onClick={() => updateSetting('voice', voice.name)}
                  className={`
                    relative flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer group
                    ${settings.voice === voice.name 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                    }
                  `}
                >
                  <span className="text-sm font-medium">
                    {voice.label}
                  </span>
                  
                  <button 
                    onClick={(e) => handlePreviewVoice(voice.name, e)}
                    disabled={playingVoice !== null}
                    className={`
                      p-1.5 rounded-full transition-all
                      ${settings.voice === voice.name ? 'text-white' : 'text-white/20 hover:text-white'}
                    `}
                  >
                    {playingVoice === voice.name ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Language Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-white/40">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">{labels.targetLanguage}</h3>
            </div>
            <div className="relative">
              <select 
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-white/30 hover:bg-white/10 transition-colors cursor-pointer"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang} className="bg-[#1e1e1e] text-white">
                    {lang}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-white/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </section>

        </div>
        
        <div className="p-4 bg-white/[0.02] border-t border-white/5">
          <button 
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors active:scale-[0.98]"
          >
            {labels.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;