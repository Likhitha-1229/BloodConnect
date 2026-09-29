import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { SafetyDisclaimerBanner } from '../components/common/SafetyDisclaimerBanner';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
          <FileText className="w-3.5 h-3.5" />
          <span>Platform Agreement</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Please read these terms carefully before utilizing the BloodConnect coordination platform.
        </p>
      </div>

      <SafetyDisclaimerBanner />

      <div className="rounded-3xl bg-white p-8 shadow-xs border border-slate-200/80 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            1. Non-Clinical Coordination Service
          </h2>
          <p>
            BloodConnect operates purely as an information directory and communication platform connecting voluntary blood donors and seekers. BloodConnect is NOT a licensed healthcare clinic, blood bank, or diagnostic laboratory. We do not manufacture, collect, test, or transfuse blood.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            2. Medical Eligibility & Final Authority
          </h2>
          <p>
            Registration on BloodConnect does not determine or guarantee medical eligibility to donate blood. Final medical eligibility, physical checkup, hemoglobin levels, infectious disease screening, and compatibility testing must be independently performed and approved by licensed medical personnel at an authorized hospital or blood bank.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            3. Prohibition of Commercial Transactions
          </h2>
          <p>
            Blood donation through BloodConnect is strictly voluntary, altruistic, and non-remunerated in compliance with international and national healthcare regulations. Any commercial sale, purchasing of blood units, or financial extortion is strictly prohibited and will result in immediate suspension and referral to legal authorities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            4. Emergency Requisitions
          </h2>
          <p>
            BloodConnect provides priority notification channels for urgent requisitions, but does not guarantee the immediate arrival of donors or the successful outcome of surgical procedures. In case of acute medical emergencies, always contact official local emergency services and your primary hospital emergency room immediately.
          </p>
        </section>
      </div>
    </div>
  );
};
