import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NavigationHeader } from './components/NavigationHeader';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { ScreenContainer } from './components/ScreenContainer';

// 9 Prototype Screens
import { PublicSupportPlatform } from './pages/PublicSupportPlatform';
import { CitizenProfileSetup } from './pages/CitizenProfileSetup';
import { ScreeningIntro } from './pages/ScreeningIntro';
import { ScreeningFlow } from './pages/ScreeningFlow';
import { AssessmentResult } from './pages/AssessmentResult';
import { CaseReview } from './pages/CaseReview';
import { DistrictDashboard } from './pages/DistrictDashboard';
import { StateDashboard } from './pages/StateDashboard';
import { NationalCommandCenter } from './pages/NationalCommandCenter';

const MainScreenRouter: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'public-support':
        return <PublicSupportPlatform />;
      case 'citizen-profile':
        return <CitizenProfileSetup />;
      case 'screening-intro':
        return <ScreeningIntro />;
      case 'screening':
        return <ScreeningFlow />;
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
      <NavigationHeader />

      <main className="flex-1 flex flex-col">
        <ScreenContainer>{renderScreen()}</ScreenContainer>
      </main>

      {/* Global Footer */}
      <footer className="bg-[#002046] text-white border-t border-[#1b365d] py-8 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-white text-[#002046] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl text-[#002046]">health_and_safety</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">RakshaSetu | National Distress Management System</p>
              <p className="text-[#aec7f7] text-[11px]">
                Under National Tele Mental Health Programme • MoHFW, Govt. of India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[#aec7f7] text-xs flex-wrap justify-center">
            <span className="flex items-center gap-1 text-white font-mono font-bold bg-[#ba1a1a] px-2.5 py-1 rounded">
              <span className="material-symbols-outlined text-sm">call</span>
              <span>24x7 Lifeline: 14416</span>
            </span>
            <span>Digital Personal Data Protection Act (DPDPA) Compliant</span>
            <span>Zero Data Monitization</span>
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
