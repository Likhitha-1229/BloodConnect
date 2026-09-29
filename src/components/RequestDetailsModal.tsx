import React from 'react';
import { 
  X, 
  Hospital, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Clock3, 
  User, 
  ShieldCheck, 
  Phone, 
  Mail,
  ExternalLink 
} from 'lucide-react';
import { BloodRequest, RequestStatus } from '../types';
import { BloodGroupBadge } from './common/BloodGroupBadge';
import { StatusBadge } from './common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface RequestDetailsModalProps {
  request: BloodRequest | null;
  onClose: () => void;
  onOpenMatchingDonors?: (bloodGroup: string, city: string) => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  onClose,
  onOpenMatchingDonors,
}) => {
  const { role, currentUser } = useAuth();
  const { verifyRequest, updateRequestStatus } = useData();

  if (!request) return null;

  const isOwner = currentUser?.uid === request.requesterId;
  const isAdmin = role === 'admin';

  // Status timeline steps
  const steps: { label: string; statusMatch: RequestStatus[]; isDone: boolean; isCurrent: boolean }[] = [
    {
      label: 'Submitted',
      statusMatch: ['Pending Verification', 'Urgent - Pending Verification'],
      isDone: true,
      isCurrent: ['Pending Verification', 'Urgent - Pending Verification'].includes(request.status),
    },
    {
      label: 'Hospital Verified',
      statusMatch: ['Verified'],
      isDone: ['Verified', 'Matching', 'Donor Contacted', 'Fulfilled'].includes(request.status),
      isCurrent: request.status === 'Verified',
    },
    {
      label: 'Matching Donors',
      statusMatch: ['Matching'],
      isDone: ['Matching', 'Donor Contacted', 'Fulfilled'].includes(request.status),
      isCurrent: request.status === 'Matching',
    },
    {
      label: 'Donor Contacted',
      statusMatch: ['Donor Contacted'],
      isDone: ['Donor Contacted', 'Fulfilled'].includes(request.status),
      isCurrent: request.status === 'Donor Contacted',
    },
    {
      label: 'Fulfilled',
      statusMatch: ['Fulfilled'],
      isDone: request.status === 'Fulfilled',
      isCurrent: request.status === 'Fulfilled',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <BloodGroupBadge group={request.bloodGroup} size="sm" variant="solid" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Request {request.requestId}
                </h3>
                <StatusBadge status={request.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500">
                Created on {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Status Timeline */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Coordination Timeline
            </h4>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-3 right-3 top-3.5 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
              {steps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step.isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : step.isCurrent
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {step.isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 max-w-[70px] leading-tight font-medium ${
                      step.isCurrent
                        ? 'text-slate-900 font-bold'
                        : step.isDone
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Hospital className="w-4 h-4 text-red-600" />
                <span>Hospital / Blood Bank</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{request.hospitalName}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {request.hospitalAddress || `${request.area}, ${request.city}`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Calendar className="w-4 h-4 text-red-600" />
                <span>Required Timing</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {request.requiredDate} {request.requiredTime && `at ${request.requiredTime}`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-red-100 text-red-800">
                  {request.unitsRequired} Unit{request.unitsRequired > 1 ? 's' : ''} Needed
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  request.urgency === 'Urgent' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {request.urgency} Urgency
                </span>
              </div>
            </div>
          </div>

          {/* Hospital Verification Note */}
          {request.hospitalVerificationNote && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Hospital Desk Verification Note</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                {request.hospitalVerificationNote}
              </p>
            </div>
          )}

          {/* Additional notes */}
          {request.additionalNotes && (
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Clinical Context / Notes
              </h5>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70 leading-relaxed">
                {request.additionalNotes}
              </p>
            </div>
          )}

          {/* Privacy-conscious Requester Information */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              Requester Information
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <p>Name: <span className="font-semibold text-slate-800">{request.requesterName}</span></p>
              {isAdmin || isOwner ? (
                <>
                  <p className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {request.requesterPhone}
                  </p>
                  <p className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {request.requesterEmail}
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-slate-500 italic">
                  Contact details protected by healthcare privacy protocol.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onOpenMatchingDonors && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMatchingDonors(request.bloodGroup, request.city);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-white text-xs font-bold text-red-700 hover:bg-red-50 transition-colors"
              >
                Find Donors for this Request
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Verification action */}
            {isAdmin && request.status !== 'Verified' && request.status !== 'Fulfilled' && (
              <button
                onClick={() => verifyRequest(request.id, 'Verified by BloodConnect admin desk')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
              >
                Verify Request
              </button>
            )}

            {/* Fulfill action */}
            {(isAdmin || isOwner) && request.status !== 'Fulfilled' && (
              <button
                onClick={() => updateRequestStatus(request.id, 'Fulfilled', 'Marked as fulfilled by user.')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Mark as Fulfilled
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
