import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  User, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BloodGroup } from '../types';

export const DonorRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, currentUser } = useAuth();
  const { registerDonor } = useData();

  // Form State
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(28);
  const [city, setCity] = useState('Seattle');
  const [area, setArea] = useState('Capitol Hill');
  const [contactPreference, setContactPreference] = useState<'In-App Notification' | 'SMS via Platform' | 'Authorized Hospital Only'>('In-App Notification');

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [preferredDonationCenters, setPreferredDonationCenters] = useState('Swedish Medical Center, Bloodworks NW');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!termsAccepted || !privacyConsent) {
      setErrorMessage('Please accept the platform terms and privacy consent to register.');
      return;
    }
    if (age < 18 || age > 65) {
      setErrorMessage('Standard voluntary donor guidelines require age between 18 and 65.');
      return;
    }
    if (!currentUser && (!email || !password)) {
      setErrorMessage('Please provide an email and password to create your account.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Firebase Auth account if not currently logged in
      if (!currentUser) {
        await signUpWithEmail(email, password, fullName, 'donor', '', city);
      }

      // 2. Create donor profile in Firestore
      // Use privacy-safe display name like "First Name + Last Initial"
      const names = fullName.trim().split(' ');
      const privacyDisplayName = names.length > 1 ? `${names[0]} ${names[names.length - 1][0]}.` : names[0];

      await registerDonor({
        displayName: privacyDisplayName,
        bloodGroup,
        age,
        city,
        area,
        isAvailable,
        lastDonationDate,
        preferredDonationCenters,
        contactPreference,
        status: 'Active',
      });

      // Redirect to donor dashboard
      navigate('/donor-dashboard');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMessage(err.message || 'Registration failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
          <Heart className="w-3.5 h-3.5 text-red-600 fill-current" />
          <span>Voluntary Blood Donor Network</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Become a Blood Donor
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Join our voluntary community of donors. Your information is privacy-protected and only general area information is displayed to seekers.
        </p>
      </div>

      {/* Mandatory Regulatory Statement */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950 space-y-1">
        <p className="font-bold flex items-center gap-1.5 text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          Important Medical Notice
        </p>
        <p className="leading-relaxed">
          "Registration does not confirm medical eligibility to donate. Final eligibility is determined by qualified healthcare professionals/blood banks."
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 sm:p-10 shadow-xs border border-slate-200/80 space-y-8">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Personal Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="w-4 h-4 text-red-700" />
            1. Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Marcus Thorne"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Displayed privacy-safely to public (e.g. Marcus T.)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Age (18 - 65) *
              </label>
              <input
                type="number"
                min={18}
                max={65}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
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
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                General Area / District *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Capitol Hill"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Exact home street address is NEVER asked or published.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Preferred Contact Channel
            </label>
            <select
              value={contactPreference}
              onChange={(e) => setContactPreference(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="In-App Notification">In-App Notification (Recommended)</option>
              <option value="SMS via Platform">SMS via Platform Relay</option>
              <option value="Authorized Hospital Only">Authorized Hospital Desk Only</option>
            </select>
          </div>
        </div>

        {/* 2. Donation Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Heart className="w-4 h-4 text-red-700" />
            2. Donation Information
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Your Blood Group *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setBloodGroup(bg)}
                  className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Last Donation Date (if applicable)
              </label>
              <input
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Initial Availability Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAvailable(true)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    isAvailable
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Available to Donate
                </button>
                <button
                  type="button"
                  onClick={() => setIsAvailable(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    !isAvailable
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Unavailable
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Preferred Donation Locations / Centers
            </label>
            <input
              type="text"
              placeholder="e.g. Swedish Hospital, UW Medical Center, Bloodworks NW"
              value={preferredDonationCenters}
              onChange={(e) => setPreferredDonationCenters(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
        </div>

        {/* 3. Account & Security (if not signed in) */}
        {!currentUser && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Lock className="w-4 h-4 text-red-700" />
              3. Account Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="donor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password (min 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. Terms & Privacy Consent */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <span>
              I accept the <Link to="/terms" className="text-red-700 font-bold hover:underline">Terms of Service</Link> and understand that BloodConnect is a coordination platform, not an authorized medical provider or blood bank.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              required
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <span>
              I consent to the <Link to="/privacy" className="text-red-700 font-bold hover:underline">Privacy Policy</Link>. My exact address and phone number will remain confidential.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>{loading ? 'Creating Donor Profile...' : 'Complete Donor Registration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
