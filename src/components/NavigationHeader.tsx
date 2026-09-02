import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';

export const NavigationHeader: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    currentRole,
    setRole,
    setIsRoleSwitcherOpen,
    resetToDefault,
    alerts,
    setConsent
  } = useApp();

  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);
  const unreviewedAlerts = alerts.filter((a) => !a.isReviewed);

  const screens: { id: ScreenId; label: string; tier: string }[] = [
    { id: 'public-support', label: '1. RakshaSetu | Victim Support & Case Monitor', tier: 'Public' },
    { id: 'citizen-login', label: '2. Victim Login & OTP', tier: 'Public' },
    { id: 'citizen-consent', label: '3. NHAA Consent & DPDPA Authorization', tier: 'Public' },
    { id: 'citizen-profile', label: '4. Intake Profile Setup', tier: 'Public' },
    { id: 'screening-intro', label: '5. Screening Introduction', tier: 'Public' },
    { id: 'screening', label: '6. Screening (4-Step Clinical PHQ/GAD)', tier: 'Public' },
    { id: 'screening-review', label: '7. Review & Submit', tier: 'Public' },
    { id: 'assessment-result', label: '8. Assessment Result & Case Monitor', tier: 'Public' },
    { id: 'case-review', label: '9. Tele-MANAS Counsellor Case Review (Human Validation)', tier: 'Counsellor' },
    { id: 'district-dashboard', label: '10. District Dashboard | Chennai', tier: 'District' },
    { id: 'state-dashboard', label: '11. State Dashboard | Tamil Nadu', tier: 'State' },
    { id: 'national-command', label: '12. National Command Center', tier: 'National' }
  ];

  return (
    <header id="app-navigation-header" className="sticky top-0 z-40 bg-[#002046] text-white border-b border-[#1b365d] shadow-sm">
      {/* Top emergency strip */}
      <div className="bg-[#1b365d] px-4 py-1 text-xs flex items-center justify-between border-b border-[#002046]/40 text-[#aec7f7]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-medium">National Distress Management & Victim Monitoring System (NDMS)</span>
          </span>
          <span className="hidden md:inline text-[#87a0cd]">•</span>
          <span className="hidden md:inline text-white/90">Ministry of Health & Family Welfare • Government of India</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white bg-[#ba1a1a] px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold tracking-wider">
            <span className="material-symbols-outlined text-[13px]">call</span>
            <span>24x7 TOLL-FREE: 14416</span>
          </div>
          <button
            id="reset-demo-btn"
            onClick={resetToDefault}
            title="Reset to initial state"
            className="text-[11px] text-[#aec7f7] hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[13px]">refresh</span>
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity with RakshaSetu Logo */}
        <div
          id="brand-logo-button"
          onClick={() => navigateTo('public-support', 'push_back')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 overflow-hidden">
            <img
              src="/assets/rakshasetu-logo.png"
              alt="RakshaSetu Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to icon if image fails to render
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">RakshaSetu</span>
              <span className="text-[10px] bg-[#aec7f7] text-[#002046] font-bold px-1.5 py-0.2 rounded">
                रक्षासेतु
              </span>
            </div>
            <p className="text-[11px] text-[#aec7f7] tracking-normal font-light">
              Victim Support & Continuous Case Monitoring Platform
            </p>
          </div>
        </div>

        {/* Center & Right Controls */}
        <div className="flex items-center gap-3">
          {/* Active Counsellor Alert Indicator */}
          {unreviewedAlerts.length > 0 && (
            <button
              onClick={() => {
                setRole('counsellor');
                navigateTo('case-review', 'slide_up');
              }}
              className="flex items-center gap-1.5 bg-[#ba1a1a] hover:bg-[#d83a56] text-white text-xs px-3 py-1.5 rounded-lg font-bold animate-pulse shadow-sm transition-all"
              title={`${unreviewedAlerts.length} High-Risk Alert(s) Pending Review`}
            >
              <span className="material-symbols-outlined text-sm">notifications_active</span>
              <span>{unreviewedAlerts.length} Alert{unreviewedAlerts.length > 1 ? 's' : ''}</span>
            </button>
          )}

          {/* Quick Prototype Screen Switcher */}
          <div className="relative">
            <button
              id="quick-nav-dropdown-btn"
              onClick={() => setIsQuickNavOpen(!isQuickNavOpen)}
              className="flex items-center gap-1.5 bg-[#1b365d] hover:bg-[#2e476f] text-white text-xs px-3 py-2 rounded-lg border border-[#87a0cd]/30 transition-colors font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">layers</span>
              <span className="hidden sm:inline">Screen:</span>
              <span className="max-w-[140px] truncate font-semibold text-[#aec7f7]">
                {screens.find((s) => s.id === currentScreen)?.label.split('.')[1] || 'Overview'}
              </span>
              <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
            </button>

            {isQuickNavOpen && (
              <div
                id="quick-nav-menu"
                className="absolute right-0 mt-2 w-80 bg-white text-[#191c1e] rounded-xl shadow-xl border border-[#c4c6cf] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 border-b border-[#eceef0] flex items-center justify-between text-xs text-[#545f72]">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Prototype Screens</span>
                  <span className="text-[10px] text-[#74777f]">Click to jump</span>
                </div>
                <div className="max-h-96 overflow-y-auto py-1">
                  {screens.map((screen) => {
                    const isActive = currentScreen === screen.id;
                    return (
                      <button
                        key={screen.id}
                        id={`nav-screen-${screen.id}`}
                        onClick={() => {
                          navigateTo(screen.id, 'none');
                          setIsQuickNavOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#f2f4f6] transition-colors ${
                          isActive ? 'bg-[#d6e3ff]/40 text-[#002046] font-bold' : 'text-[#44474e]'
                        }`}
                      >
                        <span className="truncate pr-2">{screen.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                            screen.tier === 'Public'
                              ? 'bg-emerald-100 text-emerald-800'
                              : screen.tier === 'Counsellor'
                              ? 'bg-blue-100 text-blue-800'
                              : screen.tier === 'District'
                              ? 'bg-indigo-100 text-indigo-800'
                              : screen.tier === 'State'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {screen.tier}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Button */}
          <button
            id="role-switcher-header-btn"
            onClick={() => {
              navigateTo('national-command', 'slide_up');
            }}
            className="flex items-center gap-1.5 bg-[#aec7f7] hover:bg-[#d6e3ff] text-[#002046] font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-base">switch_account</span>
            <span>Role Switcher</span>
          </button>

          {/* Quick Perspective Modal Trigger */}
          <button
            id="open-role-modal-btn"
            onClick={() => setIsRoleSwitcherOpen(true)}
            title="Open Role Selection Panel"
            className="p-2 text-[#aec7f7] hover:text-white hover:bg-[#1b365d] rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>
        </div>
      </div>
    </header>
  );
};
