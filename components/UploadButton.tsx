import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

interface UploadButtonProps {
  onImageSelect: (file: File) => void;
  disabled: boolean;
  labels: any;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onImageSelect, disabled, labels }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          group relative w-full max-w-[320px] mx-auto aspect-square
          flex flex-col items-center justify-center gap-8
          rounded-[3rem]
          bg-white/[0.1] backdrop-blur-2xl border border-white/20
          hover:bg-white/[0.15] hover:border-white/30 hover:scale-[1.02]
          active:scale-[0.98]
          transition-all duration-500 ease-out
          shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {/* Decorative inner gradient orb */}
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
        
        <div className={`
          relative p-8 rounded-full 
          bg-gradient-to-tr from-white/10 to-transparent 
          border border-white/20 
          shadow-lg 
          transition-all duration-500
          ${disabled ? '' : 'animate-glow group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'}
        `}>
          <Camera className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
        </div>
        
        <div className="text-center z-10 px-6">
          <h3 className="text-xl font-medium text-white mb-3 tracking-wide drop-shadow-md">{labels.uploadTitle}</h3>
          <p className="text-sm text-white/60 font-light leading-relaxed drop-shadow-sm">{labels.uploadSubtitle}</p>
        </div>
      </button>
    </>
  );
};

export default UploadButton;