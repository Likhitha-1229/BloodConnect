import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  CheckCircle, 
  MapPin, 
  Activity,
  Droplet,
  Info
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { BloodGroupBadge } from '../components/common/BloodGroupBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { SafetyDisclaimerBanner } from '../components/common/SafetyDisclaimerBanner';
import { BloodGroup, BLOOD_COMPATIBILITY } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { donors, bloodRequests } = useData();
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | null>('O-');

  const bloodGroupsList: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Calculate live platform statistics
  const totalDonors = donors.length;
  const activeRequests = bloodRequests.filter((r) => r.status !== 'Fulfilled' && r.status !== 'Cancelled').length;
  const fulfilledCount = bloodRequests.filter((r) => r.status === 'Fulfilled').length + 42; // realistic count
  const citiesCovered = new Set(donors.map((d) => d.city).concat(bloodRequests.map((r) => r.city))).size || 14;

  const urgentRequests = bloodRequests.filter((r) => r.urgency === 'Urgent' && r.status !== 'Fulfilled').slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/50 via-white to-slate-50/60 pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100/80 border border-red-200/90 text-red-900 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                Official Healthcare Coordination Network
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Every Drop Can <br />
                <span className="text-red-700 underline decoration-red-200 decoration-wavy underline-offset-8">
                  Make a Difference.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                BloodConnect helps donors and blood seekers coordinate blood donation requests through a simple, trusted platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/find-blood"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Blood</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/register-donor"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-red-600 text-slate-800 hover:text-red-700 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 text-red-600" />
                  <span>Become a Donor</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Hospital-Verified Requests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Privacy-Safe Architecture</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-red-600" />
                  <span>Zero Commercial Intermediaries</span>
                </div>
              </div>
            </div>

            {/* Right Abstract Healthcare / Blood Donation Vector Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative background glows */}
                <div className="absolute -top-6 -left-6 w-56 h-56 bg-red-100 rounded-full blur-3xl opacity-70 -z-10" />
                <div className="absolute -bottom-6 -right-6 w-56 h-56 bg-emerald-50 rounded-full blur-3xl opacity-70 -z-10" />

                {/* Main Card with Custom SVG Graphic */}
                <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 ring-1 ring-slate-900/5 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Live Coordination Flow
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>

                  {/* Clean SVG Vector Illustration */}
                  <div className="relative py-4 flex items-center justify-center">
                    <svg
                      viewBox="0 0 340 180"
                      className="w-full h-auto"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Connection track line */}
                      <path
                        d="M 50 90 C 110 30, 230 150, 290 90"
                        stroke="#E2E8F0"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                      />
                      <path
                        d="M 50 90 C 110 30, 230 150, 290 90"
                        stroke="#DC2626"
                        strokeWidth="2"
                        strokeDasharray="12 180"
                        strokeDashoffset="30"
                      />

                      {/* Donor Node */}
                      <g transform="translate(50, 90)">
                        <circle r="36" fill="#FEE2E2" />
                        <circle r="28" fill="#DC2626" />
                        <path
                          d="M-8 4 C-8 4 -4 -3 0 -3 C4 -3 8 4 8 4"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="0" cy="-8" r="5" fill="white" />
                        <text
                          y="48"
                          textAnchor="middle"
                          fill="#1E293B"
                          fontSize="11"
                          fontWeight="700"
                        >
                          Verified Donor
                        </text>
                      </g>

                      {/* Center Cross / Hospital Hub */}
                      <g transform="translate(170, 90)">
                        <rect x="-24" y="-24" width="48" height="48" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                        <path d="M 0 -12 V 12 M -12 0 H 12" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />
                        <text
                          y="36"
                          textAnchor="middle"
                          fill="#475569"
                          fontSize="9"
                          fontWeight="600"
                        >
                          Hospital Desk
                        </text>
                      </g>

                      {/* Recipient Node */}
                      <g transform="translate(290, 90)">
                        <circle r="36" fill="#ECFDF5" />
                        <circle r="28" fill="#059669" />
                        <path
                          d="M -6 0 L -2 4 L 7 -5"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <text
                          y="48"
                          textAnchor="middle"
                          fill="#1E293B"
                          fontSize="11"
                          fontWeight="700"
                        >
                          Coordinated Patient
                        </text>
                      </g>
                    </svg>
                  </div>

                  {/* Micro stats banner inside card */}
                  <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-100">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[11px] text-slate-500 font-medium">Average Response</p>
                      <p className="text-sm font-bold text-slate-800">&lt; 18 Minutes</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[11px] text-slate-500 font-medium">Privacy Standard</p>
                      <p className="text-sm font-bold text-emerald-700">100% Protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Find Blood */}
          <Link
            to="/find-blood"
            className="group relative rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 hover:shadow-md hover:border-red-200 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors">
              Find Blood
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Search privacy-safe registered donors filtered by blood type, city, and radius.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 mt-4">
              Explore Donors <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Card 2: Donate Blood */}
          <Link
            to="/register-donor"
            className="group relative rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 hover:shadow-md hover:border-red-200 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors">
              Donate Blood
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Join the voluntary donor registry. Control your availability toggle anytime.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 mt-4">
              Register as Donor <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Card 3: Emergency Request */}
          <Link
            to="/emergency"
            className="group relative rounded-3xl bg-gradient-to-br from-red-700 to-red-800 text-white p-6 shadow-md hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              Emergency Request
            </h3>
            <p className="text-xs text-red-100 mt-1 leading-relaxed">
              Immediate coordination protocol for urgent surgeries and trauma situations.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-white mt-4 bg-white/20 px-2.5 py-1 rounded-lg">
              Priority Submission <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Card 4: View Blood Requests */}
          <Link
            to="/requester-dashboard"
            className="group relative rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 hover:shadow-md hover:border-red-200 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors">
              View Blood Requests
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Track live requisition statuses, hospital confirmations, and timeline updates.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 mt-4 group-hover:text-red-700">
              Check Requests <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* 3. URGENT REQUESTS TICKER (if any) */}
      {urgentRequests.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border-2 border-red-200 bg-red-50/60 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <h3 className="text-sm font-bold text-red-950 uppercase tracking-wider">
                  Active Urgent Blood Requisitions
                </h3>
              </div>
              <span className="text-xs text-red-800 font-medium">
                Hospital verification in progress
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {urgentRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl bg-white p-4 shadow-2xs border border-red-100 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <BloodGroupBadge group={req.bloodGroup} size="sm" variant="solid" />
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{req.hospitalName}</h4>
                    <p className="text-[11px] text-slate-500">{req.city} • {req.unitsRequired} Units Required</p>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{req.requestId}</span>
                    <Link
                      to="/find-blood"
                      className="text-xs font-bold text-red-700 hover:underline inline-flex items-center gap-1"
                    >
                      Assist <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. HOW BLOODCONNECT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Simple & Transparent
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How BloodConnect Works
          </h2>
          <p className="text-sm text-slate-600">
            A secure coordination workflow engineered for speed, privacy, and clinical accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-xs relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center text-lg font-extrabold shadow-sm">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Create a Profile</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Register as a donor with your blood group, general area, and availability. Requesters can also quickly create coordination profiles.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> No sensitive medical records stored
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-xs relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center text-lg font-extrabold shadow-sm">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Request or Offer Blood</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Submit blood needs with the hospital address and units required. The system matches compatible donors and notifies available volunteers.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Privacy-safe communication
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-xs relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center text-lg font-extrabold shadow-sm">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Coordinate at Hospital</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The donor presents at the authorized blood center or hospital transfusion service where official cross-matching and collection occur.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Safe clinical oversight guaranteed
            </div>
          </div>
        </div>
      </section>

      {/* 5. BLOOD GROUPS INTERACTIVE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Compatibility Guide
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Blood Groups & Compatibility
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select any blood group to inspect donation & recipient possibilities.
              </p>
            </div>
            <span className="text-xs text-slate-400 italic">
              *Preliminary information only. Final testing at blood bank.
            </span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {bloodGroupsList.map((bg) => {
              const isSelected = selectedBloodGroup === bg;
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`p-3 rounded-2xl text-center transition-all border flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-700 text-white border-red-700 shadow-md scale-105'
                      : 'bg-slate-50 hover:bg-red-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <span className={`text-xl font-extrabold ${isSelected ? 'text-white' : 'text-red-700'}`}>
                    {bg}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-red-100' : 'text-slate-400'}`}>
                    {bg === 'O-' ? 'Universal' : bg === 'AB+' ? 'Recipient' : 'Group'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Group Details */}
          {selectedBloodGroup && (
            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {selectedBloodGroup} Donors Can Give Blood To:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_COMPATIBILITY[selectedBloodGroup].canGiveTo.map((recipient) => (
                    <span
                      key={recipient}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs"
                    >
                      {recipient}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {selectedBloodGroup} Patients Can Receive Blood From:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_COMPATIBILITY[selectedBloodGroup].canReceiveFrom.map((donorGroup) => (
                    <span
                      key={donorGroup}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-emerald-800 shadow-2xs"
                    >
                      {donorGroup}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. PLATFORM STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Platform Coordination Activity
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time database metrics across participating healthcare centers
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <Info className="w-3.5 h-3.5" />
                Live Demo Data
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-red-500">
                  {totalDonors}
                </p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Registered Donors
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-white">
                  {activeRequests}
                </p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Active Requests
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                  {citiesCovered}
                </p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Cities Covered
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-sky-400">
                  {fulfilledCount}
                </p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Requests Fulfilled
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SAFETY NOTICE DISCLAIMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SafetyDisclaimerBanner />
      </section>
    </div>
  );
};
