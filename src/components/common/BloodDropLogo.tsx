import React from 'react';

interface BloodDropLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BloodDropLogo: React.FC<BloodDropLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-red-600/10 p-1.5 ring-1 ring-red-600/20 shadow-xs transition-transform hover:scale-105`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-red-600 drop-shadow-xs"
        >
          {/* Blood drop outer shape */}
          <path
            d="M16 3C16 3 7 13.5 7 20C7 24.9706 11.0294 29 16 29C20.9706 29 25 24.9706 25 20C25 13.5 16 3 16 3Z"
            fill="currentColor"
          />
          {/* Inner heartbeat pulse line */}
          <path
            d="M11 20.5H13.2L14.5 17L16.2 23L17.8 19L18.8 20.5H21"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Subtle light reflection highlight */}
          <path
            d="M12 14.5C10.5 17 10 19 10 20"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className={`font-extrabold tracking-tight text-slate-900 ${textSizes[size]}`}>
              Blood<span className="text-red-700">Connect</span>
            </span>
          </div>
          {size !== 'sm' && (
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-700 -mt-1">
              Donor Coordination
            </span>
          )}
        </div>
      )}
    </div>
  );
};
