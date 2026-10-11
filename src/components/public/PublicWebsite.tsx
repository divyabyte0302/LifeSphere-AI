import React, { useState } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicHero } from './PublicHero';
import { PublicProblemSolution } from './PublicProblemSolution';
import { PublicHowItWorks } from './PublicHowItWorks';
import { PublicFeatures } from './PublicFeatures';
import { PublicContinuousProfile } from './PublicContinuousProfile';
import { PublicHealthTrends } from './PublicHealthTrends';
import { PublicMonthlyCheckup } from './PublicMonthlyCheckup';
import { PublicPersonalizedPlan } from './PublicPersonalizedPlan';
import { PublicEnvironmentalIntelligence } from './PublicEnvironmentalIntelligence';
import { PublicPrivacyConsent } from './PublicPrivacyConsent';
import { PublicEmergencySupport } from './PublicEmergencySupport';
import { PublicTechnology } from './PublicTechnology';
import { PublicFAQ } from './PublicFAQ';
import { PublicContact } from './PublicContact';
import { PublicAuthModals } from './PublicAuthModals';
import { PublicFooter } from './PublicFooter';
import { UserRole } from '../../types/admin';

interface PublicWebsiteProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenDoctorPortal?: () => void;
  onOpenAdminPortal?: () => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  onEnterApp,
  onOpenLogin,
  onOpenRegister,
  onOpenDoctorPortal,
  onOpenAdminPortal,
}) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('USER');

  const handleOpenLoginModal = (role: UserRole = 'USER') => {
    setAuthDefaultRole(role);
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleOpenRegisterModal = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSuccessfulAuth = (role: UserRole) => {
    if (role === 'DOCTOR' && onOpenDoctorPortal) {
      onOpenDoctorPortal();
    } else if (role === 'ADMIN' && onOpenAdminPortal) {
      onOpenAdminPortal();
    } else {
      onEnterApp();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Header */}
      <PublicHeader
        onOpenLogin={handleOpenLoginModal}
        onOpenRegister={handleOpenRegisterModal}
        onGetStarted={onEnterApp}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Landing Page Sections 1 - 16 */}
      <main className="flex-1">
        {/* Section 1: Hero */}
        <PublicHero
          onGetStarted={onEnterApp}
          onExploreFeatures={() => handleNavigateSection('features')}
        />

        {/* Section 2 & 3: Problem and Solution */}
        <PublicProblemSolution />

        {/* Section 4: How It Works */}
        <PublicHowItWorks />

        {/* Section 5: Features */}
        <PublicFeatures />

        {/* Section 6: Continuous Health Profile */}
        <PublicContinuousProfile />

        {/* Section 7: AI-Assisted Health Trends */}
        <PublicHealthTrends />

        {/* Section 8 & 9: Monthly Check-up & Post Check-up Updates */}
        <PublicMonthlyCheckup />

        {/* Section 10: Personalized Health Plan */}
        <PublicPersonalizedPlan />

        {/* Section 11: Environmental Intelligence */}
        <PublicEnvironmentalIntelligence />

        {/* Section 12: Privacy & Consent */}
        <PublicPrivacyConsent />

        {/* Section 13: Emergency Support */}
        <PublicEmergencySupport />

        {/* Section 14: Technology */}
        <PublicTechnology />

        {/* Section 15: FAQ */}
        <PublicFAQ />

        {/* Section 16: Contact */}
        <PublicContact />
      </main>

      {/* Footer */}
      <PublicFooter
        onNavigateSection={handleNavigateSection}
        onOpenLogin={handleOpenLoginModal}
        onOpenRegister={handleOpenRegisterModal}
      />

      {/* Sections 17 & 18: Interactive Login & Register Modals */}
      <PublicAuthModals
        isOpen={authModalOpen}
        initialMode={authModalMode}
        defaultRole={authDefaultRole}
        onClose={() => setAuthModalOpen(false)}
        onSuccessLogin={handleSuccessfulAuth}
      />

    </div>
  );
};
