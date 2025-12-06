import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { Languages, Sparkles, Lightbulb, Utensils, Volume2, Square, Loader2 } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

interface ResultCardProps {
  result: AnalysisResult;
  voiceName: string;
  labels: any;
}

// Helper to decode Base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to convert PCM Int16 to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, voiceName, labels }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleSpeak = async () => {
    if (isPlaying) {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsLoadingAudio(true);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      } else if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const base64Audio = await generateSpeech(result.proTip, voiceName);
      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        sourceNodeRef.current = null;
      };

      source.start();
      sourceNodeRef.current = source;
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to play audio:", error);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Primary Translation Card */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 text-white/50">
          <Languages className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em]">{labels.resultTranslation}</h3>
        </div>
        <p className="text-white text-xl font-light leading-relaxed tracking-wide font-serif">{result.translation}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Vibe Check */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4 text-white/50">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em]">{labels.resultVibe}</h3>
          </div>
          <p className="text-white/90 text-md leading-relaxed font-light">{result.vibeCheck}</p>
        </div>

        {/* Pro Tip */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-xl border border-white/10 p-8 shadow-2xl group">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3 text-indigo-300/80">
                <Lightbulb className="w-4 h-4" />
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em]">{labels.resultTip}</h3>
             </div>
             
             {/* TTS Button */}
             <button 
                onClick={handleSpeak}
                disabled={isLoadingAudio}
                className={`
                  relative z-20 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500
                  ${isPlaying 
                    ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                  }
                `}
             >
                {isLoadingAudio ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPlaying ? (
                  <Square className="w-3 h-3 fill-current" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
             </button>
          </div>
          
          <div className="relative z-10">
            <p className="text-white/90 text-md font-light leading-relaxed">{result.proTip}</p>
          </div>
          
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        </div>
      </div>

      {/* Flavor Profile (Conditional) */}
      {result.flavorProfile && (
        <div className="relative overflow-hidden rounded-full bg-white/5 backdrop-blur-md border border-white/10 py-3 px-6 shadow-xl flex items-center justify-between max-w-sm mx-auto">
          <div className="flex items-center gap-3 opacity-60">
             <Utensils className="w-4 h-4 text-white" />
             <span className="text-white text-xs font-semibold uppercase tracking-widest">{labels.resultFlavor}</span>
          </div>
          <span className="text-white font-medium text-sm">
            {result.flavorProfile}
          </span>
        </div>
      )}
    </div>
  );
};

export default ResultCard;