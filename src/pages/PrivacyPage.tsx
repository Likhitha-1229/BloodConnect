import React from 'react';
import { Shield, Lock, EyeOff, UserCheck } from 'lucide-react';
import { SafetyDisclaimerBanner } from '../components/common/SafetyDisclaimerBanner';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Privacy Protocol</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Last updated: September 2026. How BloodConnect safeguards your sensitive healthcare and contact information.
        </p>
      </div>

      <SafetyDisclaimerBanner compact />

      <div className="rounded-3xl bg-white p-8 shadow-xs border border-slate-200/80 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-700" />
            1. Non-Public Contact Protection
          </h2>
          <p>
            We strictly enforce a privacy-by-design policy. Your exact home street address, building number, GPS tracking coordinates, and telephone number are never exposed on public search pages. Seekers can only view your first name and initial, general area, and approximate distance radius.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-red-700" />
            2. Medical Information Isolation
          </h2>
          <p>
            BloodConnect does NOT request, process, or store detailed personal medical records, confidential diagnostic history, or pathogen laboratory results. The only biological marker registered is your self-declared ABO/Rh blood group for coordination purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-red-700" />
            3. Hospital Coordination Data Sharing
          </h2>
          <p>
            When you accept a blood donation request for a specific hospital or blood center, necessary identification details are only relayed to authorized clinical transfusion desk coordinators to facilitate on-site patient verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            4. User Rights and Deletion
          </h2>
          <p>
            You retain complete control over your account. You can toggle your availability to "Unavailable" instantly, or deactivate your profile entirely through Account Settings at any time, purging public search availability.
          </p>
        </section>
      </div>
    </div>
  );
};
