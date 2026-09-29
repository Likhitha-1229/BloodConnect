import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Hospital, 
  Heart, 
  Search, 
  FileText 
} from 'lucide-react';
import { SafetyDisclaimerBanner } from '../components/common/SafetyDisclaimerBanner';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
          User Guide & Guidelines
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          How BloodConnect Operates
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          From donor registration to hospital transfusion coordination, learn how each phase ensures patient safety and donor privacy.
        </p>
      </div>

      <SafetyDisclaimerBanner />

      {/* 3 Step Deep Dive */}
      <div className="space-y-8">
        {/* Step 1 */}
        <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-700 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              01
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Donor Profile Creation & Privacy Shield
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Voluntary donors register with their blood group, city, and general locality. Exact GPS coordinates and telephone numbers are encrypted and isolated behind security rules. You have instant control over your donation availability toggle at all times.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full control to toggle unavailable anytime</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No spam calls or public phone exposure</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-700 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              02
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Requisition Matching & Instant Broadcast
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            When a patient or medical attendant enters a blood request with hospital details, our non-AI database engine matches available donors in the city based on compatibility criteria (e.g. O- universal donors, compatible Rh groups).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Priority emergency channel for urgent trauma</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>In-app notifications sent directly to volunteers</span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-700 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              03
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Clinical Transfusion at Registered Hospital
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Donors arrive at the designated hospital transfusion service or blood center. Healthcare professionals perform standard pre-donation screening (hemoglobin test, medical questionnaire, blood pressure) and safe phlebotomy.
          </p>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <strong>Hospital Requirement:</strong> Transfusion decisions, blood testing, and patient cross-matching are solely performed by licensed healthcare staff at the medical institution.
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/register-donor"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-700 text-white font-bold text-xs hover:bg-red-800 transition-colors shadow-xs flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4" />
          <span>Become a Voluntary Donor</span>
        </Link>
        <Link
          to="/find-blood"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Find Available Donors</span>
        </Link>
      </div>
    </div>
  );
};
