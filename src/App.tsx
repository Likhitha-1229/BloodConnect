import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';

// Pages
import { HomePage } from './pages/HomePage';
import { FindBloodPage } from './pages/FindBloodPage';
import { RequestBloodPage } from './pages/RequestBloodPage';
import { EmergencyRequestPage } from './pages/EmergencyRequestPage';
import { DonorRegistrationPage } from './pages/DonorRegistrationPage';
import { DonorDashboardPage } from './pages/DonorDashboardPage';
import { RequesterDashboardPage } from './pages/RequesterDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-red-700 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/find-blood" element={<FindBloodPage />} />
                <Route path="/request-blood" element={<RequestBloodPage />} />
                <Route path="/emergency" element={<EmergencyRequestPage />} />
                <Route path="/register-donor" element={<DonorRegistrationPage />} />
                <Route path="/donor-dashboard" element={<DonorDashboardPage />} />
                <Route path="/requester-dashboard" element={<RequesterDashboardPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                {/* Fallback route */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
            <ChatWidget />
          </div>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
