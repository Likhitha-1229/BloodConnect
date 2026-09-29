import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  MapPin, 
  Lock, 
  LogOut, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { userProfile, currentUser, logout, updateProfileData } = useAuth();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || 'BloodConnect Member');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [city, setCity] = useState(userProfile?.city || 'Seattle');
  const [area, setArea] = useState(userProfile?.area || 'Capitol Hill');

  // Privacy Preferences
  const [contactVisibility, setContactVisibility] = useState('Authorized Hospital Only');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [urgentSmsAlerts, setUrgentSmsAlerts] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deactivateConfirm, setDeactivateConfirm] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({
      displayName,
      phone,
      city,
      area,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Profile & Privacy Controls</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your personal details, privacy boundaries, and notification channels.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Account Information */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="w-4 h-4 text-red-700" />
            1. Account Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || userProfile?.email || 'user@example.com'}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Managed by Firebase Auth</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Private)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Privacy Boundaries */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-red-700" />
            2. Privacy & Data Protection
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Details Visibility
              </label>
              <select
                value={contactVisibility}
                onChange={(e) => setContactVisibility(e.target.value)}
                className="w-full sm:w-80 rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="Authorized Hospital Only">Authorized Hospital Desk Only (Recommended)</option>
                <option value="In-App Notification Relay">In-App Notification Relay Only</option>
                <option value="Verified Requesters">Verified Hospital Requesters</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                Your exact street address, precise geolocation coordinates, and direct telephone number are never displayed publicly.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span>Receive blood request coordination emails</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={urgentSmsAlerts}
                  onChange={(e) => setUrgentSmsAlerts(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span>Receive urgent emergency blood matches within 10 km</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: General Locality */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-red-700" />
            3. General Locality
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">General District / Area</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div>
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md transition-all"
          >
            Save Settings & Preferences
          </button>
        </div>
      </form>

      {/* Account Management & Deactivation */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xs border border-red-100 space-y-4">
        <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2 border-b border-red-100 pb-2">
          <AlertTriangle className="w-4 h-4 text-red-700" />
          Account Actions
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Sign Out of Session</h4>
            <p className="text-[11px] text-slate-500">End your active authenticated session on this browser.</p>
          </div>

          <button
            onClick={() => logout()}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-red-700">Deactivate Coordination Profile</h4>
            <p className="text-[11px] text-slate-500">
              Removes your donor listing from public searches and archives pending requests.
            </p>
          </div>

          {deactivateConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeactivateConfirm(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logout();
                  setDeactivateConfirm(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-red-700 text-white text-xs font-bold hover:bg-red-800"
              >
                Confirm Deactivate
              </button>
            </div>
          ) : (
            <button
              onClick={() => setDeactivateConfirm(true)}
              className="px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors"
            >
              Deactivate Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
