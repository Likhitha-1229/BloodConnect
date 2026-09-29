import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  ShieldCheck, 
  Send, 
  UserCheck, 
  Clock, 
  ChevronDown, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { BloodGroup, DonorProfile } from '../types';
import { BloodGroupBadge } from '../components/common/BloodGroupBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { SafetyDisclaimerBanner } from '../components/common/SafetyDisclaimerBanner';
import { SendRequestModal } from '../components/SendRequestModal';

export const FindBloodPage: React.FC = () => {
  const { donors } = useData();

  // Filters state
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('Any');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Available' | 'All'>('Available');
  const [distanceFilter, setDistanceFilter] = useState<string>('Any');
  const [sortBy, setSortBy] = useState<'nearest' | 'verified' | 'available'>('available');

  // Modal state
  const [selectedDonor, setSelectedDonor] = useState<DonorProfile | null>(null);

  // Filter and sort donors
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      // Exclude suspended donors
      if (d.status === 'Suspended') return false;

      // Blood group filter
      if (bloodGroupFilter !== 'Any' && d.bloodGroup !== bloodGroupFilter) {
        return false;
      }

      // Availability filter
      if (availabilityFilter === 'Available' && !d.isAvailable) {
        return false;
      }

      // Location filter (city or area)
      if (locationQuery.trim() !== '') {
        const q = locationQuery.toLowerCase().trim();
        const matchesCity = d.city.toLowerCase().includes(q);
        const matchesArea = d.area.toLowerCase().includes(q);
        if (!matchesCity && !matchesArea) return false;
      }

      // Distance filter
      if (distanceFilter !== 'Any') {
        const maxDist = parseInt(distanceFilter, 10);
        if (d.approximateDistanceKm && d.approximateDistanceKm > maxDist) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'available') {
        if (a.isAvailable === b.isAvailable) {
          return (a.approximateDistanceKm || 99) - (b.approximateDistanceKm || 99);
        }
        return a.isAvailable ? -1 : 1;
      } else if (sortBy === 'nearest') {
        return (a.approximateDistanceKm || 99) - (b.approximateDistanceKm || 99);
      } else if (sortBy === 'verified') {
        if (a.isVerified === b.isVerified) {
          return (b.donationCount || 0) - (a.donationCount || 0);
        }
        return a.isVerified ? -1 : 1;
      }
      return 0;
    });
  }, [donors, bloodGroupFilter, locationQuery, availabilityFilter, distanceFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Intro */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
          <Search className="w-3.5 h-3.5" />
          <span>Voluntary Donor Registry</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Find Blood Donors
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Search for registered donors in your area. Contact details and exact locations are protected by healthcare privacy standards.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <SafetyDisclaimerBanner compact />

      {/* Search & Filter Toolbar */}
      <div className="rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Group */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Blood Group
            </label>
            <select
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="Any">Any Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O- (Universal)</option>
            </select>
          </div>

          {/* Location query */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              City or Area
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Seattle, Ballard, Portland"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Availability
            </label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as 'Available' | 'All')}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="Available">Available Only</option>
              <option value="All">All Donors</option>
            </select>
          </div>

          {/* Distance */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Approximate Radius
            </label>
            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="Any">Any Distance</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <p className="text-slate-500 font-medium">
            Found <strong className="text-slate-900">{filteredDonors.length}</strong> privacy-safe donor profiles
          </p>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Sort by:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setSortBy('available')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  sortBy === 'available' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Available First
              </button>
              <button
                onClick={() => setSortBy('nearest')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  sortBy === 'nearest' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Nearest
              </button>
              <button
                onClick={() => setSortBy('verified')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  sortBy === 'verified' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Recently Verified
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredDonors.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No matching donors found
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Try adjusting your blood group filter, clearing city keywords, or extending your search radius to "Any distance".
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setBloodGroupFilter('Any');
                setLocationQuery('');
                setAvailabilityFilter('All');
                setDistanceFilter('Any');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-5"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <BloodGroupBadge group={donor.bloodGroup} size="md" variant="subtle" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                        {donor.displayName}
                        {donor.isVerified && (
                          <span title="Verified by BloodConnect administration">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{donor.area}, {donor.city}</span>
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    status={donor.isAvailable ? 'Available' : 'Unavailable'}
                    size="sm"
                  />
                </div>

                {/* Privacy-safe Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Distance
                    </span>
                    <span className="font-semibold text-slate-800">
                      ~{donor.approximateDistanceKm || 3} km radius
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Verification
                    </span>
                    <span className={`font-semibold ${donor.isVerified ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {donor.isVerified ? 'Verified' : 'Self-declared'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Past Donations
                    </span>
                    <span className="font-semibold text-slate-800">
                      {donor.donationCount} Recorded
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Verified Date
                    </span>
                    <span className="font-semibold text-slate-800">
                      {donor.lastVerifiedDate || 'In Review'}
                    </span>
                  </div>
                </div>

                {donor.preferredDonationCenters && (
                  <p className="text-[11px] text-slate-500 truncate">
                    <span className="font-semibold text-slate-700">Centers:</span> {donor.preferredDonationCenters}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedDonor(donor)}
                  disabled={!donor.isAvailable}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    donor.isAvailable
                      ? 'bg-red-700 hover:bg-red-800 text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{donor.isAvailable ? 'Send Blood Request' : 'Currently Unavailable'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send Request Modal */}
      {selectedDonor && (
        <SendRequestModal
          donor={selectedDonor}
          onClose={() => setSelectedDonor(null)}
        />
      )}
    </div>
  );
};
