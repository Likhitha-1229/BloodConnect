import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface SafetyDisclaimerBannerProps {
  compact?: boolean;
  className?: string;
}

export const SafetyDisclaimerBanner: React.FC<SafetyDisclaimerBannerProps> = ({
  compact = false,
  className = '',
}) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 rounded-lg bg-amber-50/80 px-3 py-2 text-xs text-amber-900 border border-amber-200/80 ${className}`}>
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
        <p className="leading-tight">
          <strong>Safety Notice:</strong> BloodConnect coordinates communication only. Final compatibility, testing, and transfusion decisions must be conducted by an authorized hospital or blood bank.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 text-amber-950 shadow-2xs ${className}`}>
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-800">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900">
            Important Medical & Safety Disclaimer
          </h4>
          <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
            BloodConnect is a coordination platform. Blood availability, donor eligibility, compatibility, testing, and transfusion decisions must be confirmed by an authorized hospital or blood bank.
          </p>
        </div>
      </div>
    </div>
  );
};
