import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NavigationHeader } from './components/NavigationHeader';
import { DemoSimulationControl } from './components/DemoSimulationControl';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { ScreenContainer } from './components/ScreenContainer';

// Prototype screens
import { PublicSupportPlatform } from './pages/PublicSupportPlatform';
import { CitizenLogin } from './pages/CitizenLogin';
import { CitizenConsent } from './pages/CitizenConsent';
import { CitizenProfileSetup } from './pages/CitizenProfileSetup';
import { ScreeningIntro } from './pages/ScreeningIntro';
import { ScreeningFlow } from './pages/ScreeningFlow';
import { ScreeningReview } from './pages/ScreeningReview';
import { AssessmentResult } from './pages/AssessmentResult';
import { CaseReview } from './pages/CaseReview';
import { DistrictDashboard } from './pages/DistrictDashboard';
import { StateDashboard } from './pages/StateDashboard';
import { NationalCommandCenter } from './pages/NationalCommandCenter';

const MainScreenRouter: React.FC = () => {
  const { currentScreen, demoToast, clearDemoToast } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'public-support':
        return <PublicSupportPlatform />;
      case 'citizen-login':
        return <CitizenLogin />;
      case 'citizen-consent':
        return <CitizenConsent />;
      case 'citizen-profile':
        return <CitizenProfileSetup />;
      case 'screening-intro':
        return <ScreeningIntro />;
      case 'screening':
        return <ScreeningFlow />;
      case 'screening-review':
        return <ScreeningReview />;
      case 'assessment-result':
        return <AssessmentResult />;
      case 'case-review':
        return <CaseReview />;
      case 'district-dashboard':
        return <DistrictDashboard />;
      case 'state-dashboard':
        return <StateDashboard />;
      case 'national-command':
        return <NationalCommandCenter />;
      default:
        return <PublicSupportPlatform />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e]">
      {/* Top Demo Simulation Controller */}
      <DemoSimulationControl />

      {/* Main Navigation Header */}
      <NavigationHeader />

      {/* Floating Demo Toast Notification */}
      {demoToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md p-4 bg-[#002046] text-white rounded-xl shadow-2xl border-2 border-blue-400 animate-slide-up flex items-start gap-3"
        >
          <span
            className={`material-symbols-outlined text-2xl ${
              demoToast.type === 'alert'
                ? 'text-red-400 animate-bounce'
                : demoToast.type === 'success'
                ? 'text-emerald-400'
                : 'text-blue-300'
            }`}
          >
            {demoToast.type === 'alert' ? 'bolt' : demoToast.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <div className="flex-1 text-xs">
            <span className="font-bold block uppercase tracking-wider text-[10px] text-blue-200">
              {demoToast.type === 'alert' ? 'Continuous Case Event Stream' : 'System Notification'}
            </span>
            <p className="mt-0.5 leading-snug font-medium text-white">{demoToast.message}</p>
          </div>
          <button
            onClick={clearDemoToast}
            className="text-slate-400 hover:text-white p-1 text-xs"
            title="Close"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col">
        <ScreenContainer>{renderScreen()}</ScreenContainer>
      </main>

      {/* Global Footer */}
      <footer className="bg-[#002046] text-white border-t border-[#1b365d] py-8 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white p-0.5 flex items-center justify-center font-bold overflow-hidden">
              <img
                src="/assets/rakshasetu-logo.png"
                alt="RakshaSetu Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <p className="font-bold text-sm text-white">RakshaSetu | Victim Support & Continuous Case Monitoring</p>
              <p className="text-[#aec7f7] text-[11px]">
                Under National Tele Mental Health Programme • MoHFW & NHAA Integrated Registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[#aec7f7] text-xs flex-wrap justify-center">
            <span className="flex items-center gap-1 text-white font-mono font-bold bg-[#ba1a1a] px-2.5 py-1 rounded">
              <span className="material-symbols-outlined text-sm">call</span>
              <span>24x7 Lifeline: 14416</span>
            </span>
            <span>DPDPA 2023 Compliant</span>
            <span>Zero Commercial Monetization</span>
          </div>
        </div>
      </footer>

      <RoleSwitcherModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainScreenRouter />
    </AppProvider>
  );
}

export default App;
