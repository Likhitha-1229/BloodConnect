import React, { useState } from 'react';
import { X, Send, Heart, Hospital, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DonorProfile, BloodRequest } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { BloodGroupBadge } from './common/BloodGroupBadge';

interface SendRequestModalProps {
  donor: DonorProfile | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SendRequestModal: React.FC<SendRequestModalProps> = ({ donor, onClose, onSuccess }) => {
  const { bloodRequests, sendDonorRequest, addBloodRequest } = useData();
  const { currentUser, userProfile } = useAuth();

  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [customHospital, setCustomHospital] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customUnits, setCustomUnits] = useState(1);
  const [personalMessage, setPersonalMessage] = useState('');
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!donor) return null;

  // Filter requests that match or can receive this donor's blood
  const activeRequests = bloodRequests.filter((r) => r.status !== 'Fulfilled' && r.status !== 'Cancelled');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let targetReqId = selectedRequestId;

      if (mode === 'new' || !targetReqId) {
        // Create new quick request
        const newReq = await addBloodRequest({
          bloodGroup: donor.bloodGroup,
          unitsRequired: customUnits,
          hospitalName: customHospital || 'City General Hospital',
          city: customCity || donor.city,
          urgency: 'Normal',
          additionalNotes: personalMessage,
          requesterName: userProfile?.displayName || 'BloodConnect Seeker',
        });
        targetReqId = newReq.id;
      }

      await sendDonorRequest(donor.id, targetReqId, personalMessage);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to send request to donor:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <BloodGroupBadge group={donor.bloodGroup} size="sm" variant="solid" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Send Request to {donor.displayName}
              </h3>
              <p className="text-xs text-slate-700">
                {donor.city} • ~{donor.approximateDistanceKm || 3} km away
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Request Dispatched!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                The donor has received an in-app notification with your hospital and unit requirements. Personal contact information remains confidential until authorized coordination.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Privacy notice banner */}
            <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Protected:</strong> Donor contact information is kept private. Requests are coordinated through notifications and confirmed at the registered hospital.
              </span>
            </div>

            {/* Selection mode */}
            {activeRequests.length > 0 && (
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode('existing')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mode === 'existing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Attach Existing Request ({activeRequests.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMode('new')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mode === 'new' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Create New Request
                </button>
              </div>
            )}

            {mode === 'existing' && activeRequests.length > 0 ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Select Blood Request to Link
                </label>
                <select
                  value={selectedRequestId}
                  onChange={(e) => setSelectedRequestId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">-- Choose active request --</option>
                  {activeRequests.map((req) => (
                    <option key={req.id} value={req.id}>
                      {req.requestId} - {req.hospitalName} ({req.unitsRequired} Units {req.bloodGroup})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hospital / Blood Center Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customHospital}
                    onChange={(e) => setCustomHospital(e.target.value)}
                    placeholder="e.g. Swedish Medical Center"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="e.g. Seattle"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Units Required
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={customUnits}
                      onChange={(e) => setCustomUnits(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Coordination Message (Optional)
              </label>
              <textarea
                rows={3}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Include any specific transfusion schedule or ward details..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-700 text-white text-xs font-bold hover:bg-red-800 transition-colors disabled:opacity-50 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
