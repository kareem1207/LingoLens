import React from 'react';

interface LoadingSpinnerProps {
  label: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
        <div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin"></div>
        <div className="absolute inset-4 rounded-full bg-white/5 backdrop-blur-md animate-pulse"></div>
      </div>
      <p className="text-white/60 font-sans text-sm tracking-widest uppercase animate-pulse">
        {label}
      </p>
    </div>
  );
};

export default LoadingSpinner;