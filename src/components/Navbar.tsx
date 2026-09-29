import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Search, 
  PlusCircle, 
  AlertCircle, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  FileText, 
  Activity,
  Layers
} from 'lucide-react';
import { BloodDropLogo } from './common/BloodDropLogo';
import { NotificationDropdown } from './NotificationDropdown';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, role, logout, switchDemoRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleRoleSwitch = (newRole: UserRole) => {
    switchDemoRole(newRole);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    if (newRole === 'donor') navigate('/donor-dashboard');
    else if (newRole === 'admin') navigate('/admin');
    else navigate('/requester-dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Subtle Demo Role Switcher bar for testing / evaluation */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              BloodConnect Core
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-400">
              Active Mode: <strong className="text-white capitalize">{role}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Role Preview:</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                onClick={() => handleRoleSwitch('requester')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  role === 'requester' ? 'bg-red-700 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Requester
              </button>
              <button
                onClick={() => handleRoleSwitch('donor')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  role === 'donor' ? 'bg-red-700 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Donor
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  role === 'admin' ? 'bg-red-700 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none">
            <BloodDropLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/find-blood"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/find-blood')
                  ? 'text-red-700 bg-red-50/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Blood
            </Link>

            <Link
              to="/request-blood"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/request-blood')
                  ? 'text-red-700 bg-red-50/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Request Blood
            </Link>

            <Link
              to="/emergency"
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                isActive('/emergency')
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-red-700 bg-red-100/80 hover:bg-red-700 hover:text-white'
              }`}
            >
              <AlertCircle className="w-4 h-4 animate-bounce" />
              Emergency Request
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/how-it-works')
                  ? 'text-red-700 bg-red-50/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              How It Works
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <NotificationDropdown />

            {/* Role-based Direct Dashboard Link */}
            {role === 'donor' && (
              <Link
                to="/donor-dashboard"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-700 transition-colors flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-red-600" />
                Donor Hub
              </Link>
            )}

            {role === 'requester' && (
              <Link
                to="/requester-dashboard"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-700 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                My Requests
              </Link>
            )}

            {role === 'admin' && (
              <Link
                to="/admin"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                Admin Panel
              </Link>
            )}

            {/* User Profile / Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-800 text-xs font-bold">
                  {userProfile?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-800 max-w-[90px] truncate">
                  {userProfile?.displayName?.split(' ')[0] || (currentUser ? 'User' : 'Guest')}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in duration-100">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {userProfile?.displayName || currentUser?.email || 'Guest Explorer'}
                    </p>
                    <p className="text-[11px] text-slate-500 capitalize">
                      {role} Access
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/donor-dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Heart className="w-4 h-4 text-red-600" />
                      Donor Dashboard
                    </Link>
                    <Link
                      to="/requester-dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="w-4 h-4 text-slate-600" />
                      Requester Dashboard
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <ShieldCheck className="w-4 h-4 text-red-700" />
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      Account & Privacy
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    {currentUser ? (
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-900 font-semibold hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-slate-600" />
                        Sign In / Register
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <NotificationDropdown />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              to="/find-blood"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Search className="w-4 h-4 text-slate-500" />
              Find Blood
            </Link>
            <Link
              to="/request-blood"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <PlusCircle className="w-4 h-4 text-slate-500" />
              Request Blood
            </Link>
            <Link
              to="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-700 bg-red-50"
            >
              <AlertCircle className="w-4 h-4 text-red-600" />
              Emergency Blood Request
            </Link>
            <Link
              to="/register-donor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Heart className="w-4 h-4 text-red-600" />
              Become a Donor
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              How It Works
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Dashboards
            </p>
            <Link
              to="/donor-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Heart className="w-4 h-4 text-red-600" />
              Donor Dashboard
            </Link>
            <Link
              to="/requester-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              Requester Dashboard
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ShieldCheck className="w-4 h-4 text-red-700" />
              Admin Dashboard
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              Settings
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-3">
            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                <User className="w-4 h-4" />
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
