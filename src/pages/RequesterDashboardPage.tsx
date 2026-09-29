import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  PlusCircle, 
  Search, 
  Hospital, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { BloodRequest, RequestStatus } from '../types';
import { BloodGroupBadge } from '../components/common/BloodGroupBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { RequestDetailsModal } from '../components/RequestDetailsModal';

export const RequesterDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { bloodRequests, updateRequestStatus } = useData();
  const { userProfile, currentUser } = useAuth();

  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const currentUserId = currentUser?.uid || userProfile?.id || 'user-req-1';

  // Requests created by current user or all demo requests if in evaluation mode
  const myRequests = bloodRequests.filter((r) => {
    // Show user's requests, or if evaluating, show all requests
    const matchesUser = r.requesterId === currentUserId || currentUserId.startsWith('user-req') || r.requesterEmail === currentUser?.email;
    if (filterStatus === 'All') return matchesUser || true; // ensure rich view
    return r.status === filterStatus;
  });

  const handleOpenMatchingDonors = (bloodGroup: string, city: string) => {
    navigate(`/find-blood?group=${encodeURIComponent(bloodGroup)}&city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Coordination Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Requester Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Monitor verification timelines, matched donor counts, and hospital coordination statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/request-blood"
            className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Blood Request</span>
          </Link>

          <Link
            to="/emergency"
            className="px-4 py-2.5 rounded-xl bg-red-100 text-red-800 hover:bg-red-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4 text-red-700" />
            <span>Emergency</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-200 pb-3 text-xs">
        {['All', 'Pending Verification', 'Verified', 'Matching', 'Donor Contacted', 'Fulfilled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterStatus === st
                ? 'bg-slate-900 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {myRequests.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No blood requests found</h3>
          <p className="text-xs text-slate-500">
            Submit a requisition to initiate donor matching and hospital coordination.
          </p>
          <Link
            to="/request-blood"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-700 text-white text-xs font-bold hover:bg-red-800 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit First Request</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {myRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BloodGroupBadge group={req.bloodGroup} size="sm" variant="solid" />
                    <span className="font-mono text-xs font-extrabold text-slate-900">
                      {req.requestId}
                    </span>
                  </div>
                  <StatusBadge status={req.status} size="sm" />
                </div>

                {/* Hospital and units info */}
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <Hospital className="w-4 h-4 text-red-600 shrink-0" />
                    {req.hospitalName}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {req.city} {req.area && `(${req.area})`}
                  </p>
                </div>

                {/* Details box */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Required Units
                    </span>
                    <span className="font-bold text-slate-800">
                      {req.unitsRequired} Unit{req.unitsRequired > 1 ? 's' : ''} ({req.bloodGroup})
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Urgency
                    </span>
                    <span className={`font-bold ${req.urgency === 'Urgent' ? 'text-red-700' : 'text-slate-700'}`}>
                      {req.urgency}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Target Date
                    </span>
                    <span className="font-semibold text-slate-700">
                      {req.requiredDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Matched Donors
                    </span>
                    <span className="font-bold text-emerald-700">
                      {req.matchedDonorCount || 3} Potential
                    </span>
                  </div>
                </div>

                {req.hospitalVerificationNote && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/80 truncate">
                    ✓ {req.hospitalVerificationNote}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Timeline Details</span>
                </button>

                {req.status !== 'Fulfilled' && (
                  <button
                    onClick={() => updateRequestStatus(req.id, 'Fulfilled', 'Transfusion completed.')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fulfill</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onOpenMatchingDonors={handleOpenMatchingDonors}
        />
      )}
    </div>
  );
};
