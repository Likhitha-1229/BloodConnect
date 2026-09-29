import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Hospital, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Phone, 
  Mail, 
  User, 
  ArrowRight,
  MapPin
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { BloodGroup, RequestUrgency } from '../types';
import { BloodGroupBadge } from '../components/common/BloodGroupBadge';
import { SafetyDisclaimerBanner } from '../components/common/SafetyDisclaimerBanner';

export const RequestBloodPage: React.FC = () => {
  const navigate = useNavigate();
  const { addBloodRequest } = useData();
  const { userProfile, currentUser } = useAuth();

  // Form state
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [unitsRequired, setUnitsRequired] = useState<number>(2);
  const [city, setCity] = useState<string>('Seattle');
  const [area, setArea] = useState<string>('');
  const [hospitalName, setHospitalName] = useState<string>('');
  const [hospitalAddress, setHospitalAddress] = useState<string>('');
  const [requiredDate, setRequiredDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [requiredTime, setRequiredTime] = useState<string>('10:00');
  const [urgency, setUrgency] = useState<RequestUrgency>('Normal');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  
  // Requester contact info
  const [requesterName, setRequesterName] = useState<string>(userProfile?.displayName || '');
  const [requesterPhone, setRequesterPhone] = useState<string>(userProfile?.phone || '');
  const [requesterEmail, setRequesterEmail] = useState<string>(userProfile?.email || currentUser?.email || '');

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!hospitalName.trim()) {
      setFormError('Hospital or blood bank name is required.');
      return;
    }
    if (!city.trim()) {
      setFormError('City is required.');
      return;
    }
    if (!requesterName.trim() || !requesterPhone.trim() || !requesterEmail.trim()) {
      setFormError('Please provide complete requester contact details for coordination.');
      return;
    }

    setSubmitting(true);
    try {
      const newReq = await addBloodRequest({
        bloodGroup,
        unitsRequired,
        hospitalName,
        hospitalAddress,
        city,
        area,
        requiredDate,
        requiredTime,
        urgency,
        additionalNotes,
        requesterName,
        requesterPhone,
        requesterEmail,
      });

      setCreatedRequestId(newReq.requestId);
    } catch (err) {
      console.error('Request creation error:', err);
      setFormError('Unable to submit request. Please verify connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Patient & Seeker Coordination</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Submit Blood Request
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Create a coordination requisition for patient blood needs. Requests are broadcast to registered matching donors and verified by authorized hospital personnel.
        </p>
      </div>

      {/* Safety Notice */}
      <SafetyDisclaimerBanner />

      {createdRequestId ? (
        /* Confirmation State */
        <div className="rounded-3xl bg-white p-8 sm:p-12 text-center border border-slate-200/80 shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Status: Pending Verification
            </span>
            <h2 className="text-2xl font-bold text-slate-900 pt-2">
              Blood Request Submitted!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your request has been registered in the coordination system with tracking ID:
            </p>
            <div className="p-3 rounded-2xl bg-slate-100 font-mono text-base font-extrabold text-slate-900 border border-slate-200 select-all">
              {createdRequestId}
            </div>
          </div>

          {/* Important Medical Disclaimer reminder */}
          <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5 max-w-lg mx-auto">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              Next Step: Hospital Verification
            </p>
            <p className="leading-relaxed">
              BloodConnect does not medically approve transfusions. The specified hospital's transfusion desk will verify patient requisition details before blood units are prepared.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/requester-dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>View in Requester Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                setCreatedRequestId(null);
                setHospitalName('');
                setHospitalAddress('');
                setAdditionalNotes('');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        /* The Blood Request Form */
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 sm:p-10 shadow-xs border border-slate-200/80 space-y-8">
          {formError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Blood & Clinical Requirements */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-red-700" />
              1. Blood Requirements
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Blood group selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Blood Group Required *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                    <button
                      type="button"
                      key={bg}
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        bloodGroup === bg
                          ? 'bg-red-700 text-white border-red-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-red-50'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units & Urgency */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Units Required (Bags) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={unitsRequired}
                    onChange={(e) => setUnitsRequired(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Request Urgency Level *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUrgency('Normal')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        urgency === 'Normal'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Normal Procedure
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('Urgent')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        urgency === 'Urgent'
                          ? 'bg-red-700 text-white border-red-700'
                          : 'bg-white text-red-700 border-red-200'
                      }`}
                    >
                      Urgent Need
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Hospital & Location Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Hospital className="w-4 h-4 text-red-700" />
              2. Hospital or Blood Center Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hospital / Blood Bank Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harborview Medical Center"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hospital Street Address / Wing
                </label>
                <input
                  type="text"
                  placeholder="e.g. 325 9th Ave, East Wing 3rd Floor"
                  value={hospitalAddress}
                  onChange={(e) => setHospitalAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

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
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Area / Neighborhood
                </label>
                <input
                  type="text"
                  placeholder="e.g. First Hill, Capitol Hill"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Required By Date *
                </label>
                <input
                  type="date"
                  required
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Required By Time
                </label>
                <input
                  type="time"
                  value={requiredTime}
                  onChange={(e) => setRequiredTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Additional Clinical Notes / Transfusion Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Include doctor's requisition number, department, or surgical schedule if known..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Section 3: Requester Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-red-700" />
              3. Requester Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name / Attendant *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 019-2834"
                  value={requesterPhone}
                  onChange={(e) => setRequesterPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. msantos@example.com"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              Submission generates a verifiable Request ID for hospital coordination.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{submitting ? 'Registering Request...' : 'Submit Blood Request'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
