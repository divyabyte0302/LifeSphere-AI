import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  Stethoscope,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

interface PublicHeaderProps {
  onOpenLogin: (defaultRole?: 'USER' | 'DOCTOR' | 'ADMIN') => void;
  onOpenRegister: () => void;
  onGetStarted: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  onOpenLogin,
  onOpenRegister,
  onGetStarted,
  onNavigateSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'problem', label: 'Problem' },
    { id: 'solution', label: 'Solution' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'continuous-profile', label: 'Continuous Profile' },
    { id: 'health-trends', label: 'AI Health Trends' },
    { id: 'monthly-checkup', label: 'Monthly Check-up' },
    { id: 'post-checkup', label: 'Post Check-up' },
    { id: 'personalized-plan', label: 'Health Plan' },
    { id: 'environmental-intelligence', label: 'Environmental Intel' },
    { id: 'privacy-consent', label: 'Privacy & Consent' },
    { id: 'emergency-support', label: 'Emergency Support' },
    { id: 'technology', label: 'Technology' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl'
          : 'bg-slate-950/70 backdrop-blur-sm border-b border-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              LIFESPHERE <span className="text-emerald-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-mono uppercase tracking-wider">
              Health-Atmospheric Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Quick Section Nav */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/70 p-1.5 rounded-full border border-slate-800 text-xs font-semibold">
          {navItems.slice(0, 8).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigateSection(item.id)}
              className="px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="relative">
            <button
              onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
              className="px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <span>More</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {portalDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1">
                {navItems.slice(8).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateSection(item.id);
                      setPortalDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onOpenLogin('USER')}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-900 transition-colors"
          >
            Sign In
          </button>
          
          <button
            onClick={onOpenRegister}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-950/60 transition-colors"
          >
            Register
          </button>

          <button
            onClick={onGetStarted}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigateSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                onOpenLogin('USER');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold text-center"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onOpenRegister();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold text-center"
            >
              Create Account
            </button>
            <button
              onClick={() => {
                onGetStarted();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-xl text-xs font-extrabold text-center shadow-md shadow-emerald-500/20"
            >
              Get Started Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
