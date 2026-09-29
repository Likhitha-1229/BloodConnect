import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { BloodDropLogo } from './common/BloodDropLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 p-1 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Blood<span className="text-red-500">Connect</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              "Connecting donors. Supporting lives." A trusted coordination platform connecting voluntary blood donors with patients, families, and authorized blood banks.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Privacy-Safe Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>Non-Clinical Coordination</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              For Seekers
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/find-blood" className="hover:text-white transition-colors">
                  Find Blood Donors
                </Link>
              </li>
              <li>
                <Link to="/request-blood" className="hover:text-white transition-colors">
                  Submit Blood Request
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center gap-1">
                  <span>Emergency Request</span>
                </Link>
              </li>
              <li>
                <Link to="/requester-dashboard" className="hover:text-white transition-colors">
                  Track My Requests
                </Link>
              </li>
            </ul>
          </div>

          {/* For Donors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              For Donors
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/register-donor" className="hover:text-white transition-colors">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/donor-dashboard" className="hover:text-white transition-colors">
                  Donor Hub & Availability
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  Eligibility & Guidelines
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Privacy Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Organization
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About BloodConnect
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Support & Hospital Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety Disclaimer in footer */}
        <div className="mt-8 rounded-xl bg-slate-800/60 p-4 border border-slate-700/60 text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">
            Official Platform Disclaimer:
          </p>
          <p>
            BloodConnect is a coordination platform. Blood availability, donor eligibility, compatibility, testing, and transfusion decisions must be confirmed by an authorized hospital or blood bank. We do not collect, store, or transfuse blood directly.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BloodConnect Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Hospital Verification</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
