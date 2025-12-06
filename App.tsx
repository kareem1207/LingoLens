import React, { useState } from 'react';
import UploadButton from './components/UploadButton';
import ResultCard from './components/ResultCard';
import LoadingSpinner from './components/LoadingSpinner';
import SettingsModal from './components/SettingsModal';
import { analyzeImage } from './services/geminiService';
import { AnalysisResult } from './types';
import { Settings, Sparkles, ChevronDown } from 'lucide-react';
import { getTranslation } from './utils/translations';

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", 
  "Japanese", "Korean", "Chinese (Simplified)", "Portuguese", 
  "Russian", "Hindi", "Arabic", "Thai", "Vietnamese"
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileToAnalyze, setFileToAnalyze] = useState<File | null>(null);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    voice: 'Kore',
    language: 'English',
    instantAnalysis: false,
  });

  // Get localized text based on current language setting
  const t = getTranslation(settings.language);

  const handleImageSelect = (file: File) => {
    // Reset state for new image
    setResult(null);
    setError(null);
    setFileToAnalyze(file);

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // If Instant Analysis is ON, trigger analysis immediately
    if (settings.instantAnalysis) {
      triggerAnalysis(file, settings.language);
    }
  };

  // Separated analysis logic to support both manual and auto trigger
  const triggerAnalysis = async (file: File, lang: string) => {
    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        const mimeType = file.type;

        try {
          const analysis = await analyzeImage(base64Data, mimeType, lang);
          setResult(analysis);
        } catch (err) {
          console.error(err);
          setError(t.errorTitle); // Simple error for now, could be improved
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      console.error(err);
      setError(t.errorTitle);
      setLoading(false);
    }
  };

  const handleManualAnalyze = () => {
    if (!fileToAnalyze) return;
    triggerAnalysis(fileToAnalyze, settings.language);
  };

  const handleReset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    setFileToAnalyze(null);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        languages={LANGUAGES}
        labels={t}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex justify-between items-start mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col gap-2">
             <h1 className="text-5xl font-serif font-bold text-white tracking-tight drop-shadow-lg">
               {t.title}
             </h1>
             <span className="text-sm text-indigo-200/80 tracking-[0.3em] uppercase font-medium pl-1">{t.subtitle}</span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 text-white shadow-lg hover:shadow-indigo-500/20"
            title={t.settingsTitle}
          >
            <Settings className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </header>

        {/* Main Area */}
        <main className="flex-grow flex flex-col items-center gap-10">
          
          {/* Image Preview & Upload Area */}
          <div className="w-full transition-all duration-700 ease-out">
            {preview ? (
              <div className="relative w-full max-w-sm mx-auto aspect-[3/4] md:aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/50 ring-1 ring-white/20 group animate-in zoom-in-95 duration-500">
                <img 
                  src={preview} 
                  alt="Upload preview" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                
                {loading && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
                      <LoadingSpinner label={t.loadingText} />
                   </div>
                )}
                
                {!loading && (
                    <button 
                      onClick={handleReset}
                      className="absolute top-6 right-6 bg-black/40 hover:bg-black/60 text-white/90 text-xs font-medium px-4 py-2 rounded-full backdrop-blur-xl border border-white/10 transition-all hover:scale-105 z-20"
                    >
                      {t.newScan}
                    </button>
                )}
              </div>
            ) : (
              <div className="mt-8 w-full flex flex-col items-center">
                <div className="text-center mb-12 max-w-md mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <p className="text-indigo-100/80 text-lg font-light leading-relaxed drop-shadow-sm">
                     {t.description}
                   </p>
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 w-full">
                   <UploadButton onImageSelect={handleImageSelect} disabled={loading} labels={t} />
                </div>
              </div>
            )}
          </div>

          {/* Configuration & Action Area */}
          {preview && !result && !loading && !settings.instantAnalysis && (
            <div className="w-full max-w-sm mx-auto animate-in slide-in-from-bottom-4 fade-in duration-500">
               <div className="bg-white/[0.1] backdrop-blur-2xl border border-white/20 rounded-[2rem] p-6 shadow-2xl space-y-6">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] ml-1">{t.translateTo}</label>
                    <div className="relative">
                      <select 
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full appearance-none bg-black/20 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-white/30 hover:bg-black/30 transition-colors cursor-pointer"
                      >
                        {LANGUAGES.map(lang => (
                          <option key={lang} value={lang} className="bg-[#1e1e1e] text-white">
                            {lang}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    onClick={handleManualAnalyze}
                    className="w-full bg-white hover:bg-white/90 text-indigo-950 font-semibold text-sm py-4 rounded-2xl shadow-lg shadow-white/5 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                      <Sparkles className="w-4 h-4" />
                      <span>{t.analyzeBtn}</span>
                  </button>
                  
                  <div className="text-center">
                    <button 
                      onClick={() => setSettings({...settings, instantAnalysis: true})} 
                      className="text-[10px] text-white/40 hover:text-white/80 transition-colors uppercase tracking-wider"
                    >
                      {t.instantLink}
                    </button>
                  </div>
               </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="w-full max-w-sm p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-red-200/80 text-center backdrop-blur-md animate-in fade-in zoom-in duration-300">
              <p className="text-sm font-light mb-4">{t.errorTitle}</p>
              <button onClick={handleReset} className="text-xs font-semibold uppercase tracking-widest text-white hover:text-red-200 transition-colors border-b border-transparent hover:border-red-200 pb-0.5">{t.retryBtn}</button>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="w-full pb-20">
              <ResultCard result={result} voiceName={settings.voice} labels={t} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;