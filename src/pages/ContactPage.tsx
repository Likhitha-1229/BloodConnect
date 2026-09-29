import React, { useState } from 'react';
import { Mail, Phone, MapPin, Hospital, Send, CheckCircle2, Shield } from 'lucide-react';
import { SafetyDisclaimerBanner } from '../components/common/SafetyDisclaimerBanner';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Hospital Verification Request');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
          <Hospital className="w-3.5 h-3.5 text-red-700" />
          <span>Hospital & Support Coordination Desk</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Contact & Hospital Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Inquire about hospital verification partnership, reporting data corrections, or platform support.
        </p>
      </div>

      <SafetyDisclaimerBanner compact />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mb-2">
              <Hospital className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Hospital Desk</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              For blood bank technicians requesting priority authorization or requisition validation.
            </p>
            <p className="text-xs font-semibold text-slate-800 pt-1">
              clinical-desk@bloodconnect.org
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Emergency Hotlines</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Non-clinical coordination help line for platform navigation.
            </p>
            <p className="text-xs font-semibold text-slate-800 pt-1">
              +1 (800) 555-BLOOD (2566)
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 rounded-3xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/80">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for contacting the BloodConnect coordination desk. A member of our clinical relations team will respond within 4 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Send an Inquiry or Verification Request
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Kevin Vance"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. kvance@uwhealth.org"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="Hospital Verification Request">Hospital / Blood Bank Verification</option>
                  <option value="Requisition Update">Urgent Requisition Clarification</option>
                  <option value="Donor Safety Report">Donor Safety Inquiry</option>
                  <option value="General Support">General Platform Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide context regarding hospital requisition number, coordination needs, or questions..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
