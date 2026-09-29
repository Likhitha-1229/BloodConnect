import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  Hospital, 
  Award, 
  Settings,
  Bell,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BloodGroupBadge } from '../components/common/BloodGroupBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { DonorRequestStatus } from '../types';

export const DonorDashboardPage: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const { 
    donors, 
    updateDonorAvailability, 
    updateDonorProfile, 
    donorRequests, 
    respondToDonorRequest, 
    donations 
  } = useData();

  // Find donor profile associated with current user or fallback to demo donor
  const currentUserId = currentUser?.uid || userProfile?.id || 'user-donor-1';
  const myDonorProfile = donors.find((d) => d.userId === currentUserId) || donors[0];

  const [activeTab, setActiveTab] = useState<'requests' | 'history' | 'settings'>('requests');

  // Edit settings form state
  const [cityInput, setCityInput] = useState(myDonorProfile?.city || 'Seattle');
  const [areaInput, setAreaInput] = useState(myDonorProfile?.area || 'Capitol Hill');
  const [contactPref, setContactPref] = useState(myDonorProfile?.contactPreference || 'In-App Notification');
  const [centerPref, setCenterPref] = useState(myDonorProfile?.preferredDonationCenters || 'Swedish Medical Center');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Requests directed to this donor
  const myRequests = donorRequests.filter(
    (r) => r.donorId === currentUserId || r.donorId === myDonorProfile?.userId || myDonorProfile?.userId.startsWith('user-donor-')
  );

  // Donations history for this donor
  const myDonations = donations.filter(
    (d) => d.donorId === myDonorProfile?.id || d.donorId === 'donor-1'
  );

  const handleToggleAvailability = async () => {
    if (!myDonorProfile) return;
    await updateDonorAvailability(myDonorProfile.id, !myDonorProfile.isAvailable);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myDonorProfile) return;
    await updateDonorProfile(myDonorProfile.id, {
      city: cityInput,
      area: areaInput,
      contactPreference: contactPref as any,
      preferredDonationCenters: centerPref,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Donor Profile & Availability Toggle */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Profile details */}
          <div className="flex items-center gap-4">
            <BloodGroupBadge group={myDonorProfile?.bloodGroup || 'O-'} size="lg" variant="solid" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {myDonorProfile?.displayName || userProfile?.displayName || 'Registered Donor'}
                </h1>
                {myDonorProfile?.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Donor
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                    Self-Declared
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{myDonorProfile?.area}, {myDonorProfile?.city}</span>
                <span>•</span>
                <span>{myDonorProfile?.donationCount || 0} Donations Completed</span>
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <p className="text-xs font-bold text-slate-900">Donation Availability</p>
              <p className="text-[11px] text-slate-500">
                {myDonorProfile?.isAvailable
                  ? 'Active in search results'
                  : 'Hidden from new donor searches'}
              </p>
            </div>

            <button
              onClick={handleToggleAvailability}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                myDonorProfile?.isAvailable
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {myDonorProfile?.isAvailable ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Available to Donate</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  <span>Currently Unavailable</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'text-red-700 font-bold border-b-2 border-red-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Received Requests ({myRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeTab === 'history'
              ? 'text-red-700 font-bold border-b-2 border-red-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Donation History ({myDonations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'text-red-700 font-bold border-b-2 border-red-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Donor Settings</span>
        </button>
      </div>

      {/* Tab 1: Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No active donor requests right now
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                When patients or hospital desks in {myDonorProfile?.city || 'your area'} request {myDonorProfile?.bloodGroup || 'your blood group'}, you will be notified here immediately.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {req.requestId}
                      </span>
                      <StatusBadge status={req.status} size="sm" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                        <Hospital className="w-4 h-4 text-red-600 shrink-0" />
                        {req.hospitalName}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Requested: <strong>{req.units} Unit{req.units > 1 ? 's' : ''}</strong> of <strong>{req.bloodGroup}</strong>
                      </p>
                      {req.message && (
                        <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          "{req.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions depending on status */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>

                    {req.status === 'New' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => respondToDonorRequest(req.id, 'Declined')}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => respondToDonorRequest(req.id, 'Accepted')}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          Accept & Coordinate
                        </button>
                      </div>
                    )}

                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => respondToDonorRequest(req.id, 'Completed')}
                        className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Donation History Timeline */}
      {activeTab === 'history' && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Donation Timeline</h3>
              <p className="text-xs text-slate-500">Official verified donation records</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full">
              <Award className="w-4 h-4" />
              <span>{myDonations.length} Lifesaving Milestones</span>
            </div>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
            {myDonations.map((don, idx) => (
              <div key={don.id || idx} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-1.5 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-xs" />
                <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Hospital className="w-3.5 h-3.5 text-red-600" />
                      {don.donationCenter}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {don.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Date: <strong className="text-slate-700">{don.donationDate}</strong> • Units: <strong className="text-slate-700">{don.units} Unit ({don.bloodGroup})</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Donor Settings */}
      {activeTab === 'settings' && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/80 max-w-2xl space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Donor Profile Settings</h3>
            <p className="text-xs text-slate-500">Update your general locality and contact preferences.</p>
          </div>

          {settingsSaved && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">General Area</label>
                <input
                  type="text"
                  required
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Contact Method</label>
              <select
                value={contactPref}
                onChange={(e) => setContactPref(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="In-App Notification">In-App Notification</option>
                <option value="SMS via Platform">SMS via Platform</option>
                <option value="Authorized Hospital Only">Authorized Hospital Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Donation Centers</label>
              <input
                type="text"
                value={centerPref}
                onChange={(e) => setCenterPref(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
