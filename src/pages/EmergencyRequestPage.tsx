import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  Hospital, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Send
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { BloodGroup } from '../types';
import { BloodGroupBadge } from '../components/common/BloodGroupBadge';

export const EmergencyRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { addBloodRequest } = useData();
  const { userProfile, currentUser } = useAuth();

  // Emergency Form State
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [city, setCity] = useState('Seattle');
  const [area, setArea] = useState('');
  const [contactPhone, setContactPhone] = useState(userProfile?.phone || '');
  const [contactMethod, setContactMethod] = useState<'Phone Call' | 'In-App & Hospital Desk'>('Phone Call');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [emergencyRequestId, setEmergencyRequestId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!patientName.trim()) {
      setErrorMessage('Patient or requester name is required.');
      return;
    }
    if (!hospitalName.trim()) {
      setErrorMessage('Hospital or Blood Center name is required.');
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMessage('Emergency contact phone number is required.');
      return;
    }

    setSubmitting(true);
    try {
      const newReq = await addBloodRequest({
        bloodGroup,
        unitsRequired,
        hospitalName,
        hospitalAddress: hospitalAddress || `${area}, ${city}`,
        city,
        area,
        requiredDate: new Date().toISOString().split('T')[0],
        requiredTime: 'IMMEDIATELY',
        urgency: 'Urgent',
        additionalNotes: `[EMERGENCY PROTOCOL]: ${additionalNotes}. Patient: ${patientName}. Preferred Contact: ${contactMethod}.`,
        requesterName: patientName,
        requesterPhone: contactPhone,
        requesterEmail: currentUser?.email || 'emergency@bloodconnect.org',
      });

      setEmergencyRequestId(newReq.requestId);
    } catch (err) {
      console.error('Emergency request failure:', err);
      setErrorMessage('Could not record emergency request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* High-visibility Urgent Header (clean and serious, no cartoonish flashing) */}
      <div className="rounded-3xl bg-red-700 text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-800/80 border border-red-500/50 text-xs font-bold uppercase tracking-wider text-red-100">
            <AlertCircle className="w-4 h-4 text-white" />
            <span>Priority Emergency Channel</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Emergency Blood Request
          </h1>

          <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
            Rapid coordination dispatch for critical surgical requirements, traumatic hemorrhages, and acute transfusions. Matching registered donors in the target city are automatically notified.
          </p>
        </div>
      </div>

      {/* Mandatory Emergency Pre-submission Disclaimer */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 text-amber-950 shadow-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <span>Legitimate Hospital Association Required</span>
        </div>
        <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
          "Please ensure that the request is associated with a legitimate hospital or authorized blood bank. BloodConnect does not independently verify medical emergencies."
        </p>
      </div>

      {emergencyRequestId ? (
        /* Emergency Confirmation Card */
        <div className="rounded-3xl bg-white p-8 sm:p-12 text-center border-2 border-red-200 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-3.5 py-1 rounded-full border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              Status: Urgent - Pending Verification
            </span>
            <h2 className="text-2xl font-bold text-slate-900 pt-2">
              Emergency Request Dispatched
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your urgent request has been broadcast to available <strong className="text-red-700">{bloodGroup}</strong> donors in {city}.
            </p>
            <div className="p-3.5 rounded-2xl bg-red-50/80 font-mono text-base font-extrabold text-red-900 border border-red-200 select-all">
              {emergencyRequestId}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-left text-xs text-slate-700 space-y-1.5 max-w-lg mx-auto">
            <p className="font-bold text-slate-900">Hospital Next Steps:</p>
            <p className="leading-relaxed">
              1. Direct arriving donors to <strong>{hospitalName}</strong> Blood Bank / Transfusion Service.
            </p>
            <p className="leading-relaxed">
              2. Hospital technicians will conduct official cross-matching and hemoglobin checks before donation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/requester-dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>Track in Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/find-blood"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              View Active Donors Now
            </Link>
          </div>
        </div>
      ) : (
        /* Emergency Request Form */
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 sm:p-10 shadow-xs border border-slate-200/80 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Patient / Requester Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full name of patient or medical attendant"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Units required */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Units Required Immediately *
              </label>
              <input
                type="number"
                min={1}
                max={15}
                required
                value={unitsRequired}
                onChange={(e) => setUnitsRequired(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Blood group selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Blood Group Required *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setBloodGroup(bg)}
                  className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                    bloodGroup === bg
                      ? 'bg-red-700 text-white border-red-700 shadow-xs'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-red-50'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Hospital Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hospital / Blood Bank *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Harborview Emergency Trauma Center"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Hospital Wing/Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hospital Address / Floor / ICU Room
              </label>
              <input
                type="text"
                placeholder="e.g. 325 9th Ave, ICU Section B"
                value={hospitalAddress}
                onChange={(e) => setHospitalAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Seattle"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Area / District
              </label>
              <input
                type="text"
                placeholder="e.g. First Hill"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Emergency Contact Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="Direct line for donor coordination"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Preferred contact method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Coordination Method
              </label>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="Phone Call">Immediate Phone Call</option>
                <option value="In-App & Hospital Desk">In-App Notification & Hospital Desk</option>
              </select>
            </div>
          </div>

          {/* Urgent Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Urgent Medical Notes / Case Description
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Surgery scheduled within 3 hours. Need whole blood or packed red cells immediately..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-500 text-center sm:text-left">
              Status will be recorded as <strong>Urgent - Pending Verification</strong> in Firestore.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>{submitting ? 'Broadcasting Emergency...' : 'Broadcast Emergency Request'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
