import React from 'react';
import { ShieldCheck, Heart, Users, Hospital, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafetyDisclaimerBanner } from '../components/common/SafetyDisclaimerBanner';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
          Our Mission & Architecture
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          About BloodConnect
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
          Connecting voluntary blood donors with families, patients, and authorized healthcare facilities in critical moments.
        </p>
      </div>

      <SafetyDisclaimerBanner />

      <div className="rounded-3xl bg-white p-8 shadow-xs border border-slate-200/80 space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">
          What BloodConnect Is — and What It Is Not
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-2">
            <h3 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              What We Are
            </h3>
            <ul className="text-xs text-emerald-800/90 space-y-1.5 list-disc list-inside">
              <li>A coordination and notification platform for voluntary donors.</li>
              <li>A privacy-safe registry where personal details are never scraped or sold.</li>
              <li>A communication bridge between verified hospital requisitions and local donors.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              What We Are Not
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>NOT a hospital, diagnostic facility, or medical clinic.</li>
              <li>NOT a physical blood storage bank or transfusion operator.</li>
              <li>We NEVER test blood, diagnose eligibility, or collect fees.</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 pt-4">
          Core Pillars of BloodConnect
        </h3>

        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Absolute Privacy Protection</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Exact home addresses, GPS coordinates, and personal phone numbers are strictly kept private. Seekers only see general neighborhood zones and approximate radiuses.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Clinical Verification Requirement</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                All donations take place at certified hospital transfusion laboratories or authorized blood bank locations. Official antibody cross-matching is strictly conducted on-site by medical technicians.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Voluntary & Altruistic Standard</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                BloodConnect strongly upholds international WHO standards: voluntary, non-remunerated blood donation to support human life with dignity.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4">
          <Link
            to="/register-donor"
            className="px-6 py-2.5 rounded-xl bg-red-700 text-white font-bold text-xs hover:bg-red-800 transition-colors shadow-xs"
          >
            Become a Voluntary Donor
          </Link>
          <Link
            to="/find-blood"
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            Search Donors
          </Link>
        </div>
      </div>
    </div>
  );
};
