import React from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';

export const PublicSupportPlatform: React.FC = () => {
  const { navigateTo, citizenSession, hasConsented } = useApp();

  const startCitizenFlow = () => {
    if (!citizenSession) {
      navigateTo('citizen-login', 'push');
      return;
    }
    if (!hasConsented) {
      navigateTo('citizen-consent', 'push');
      return;
    }
    navigateTo('citizen-profile', 'push');
  };

  return (
    <div className="w-full min-h-full pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#002046] to-[#1b365d] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Logo & National Badge */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/assets/rakshasetu-logo.png"
                alt="RakshaSetu Shield Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-medium text-[#aec7f7]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>National Distress Management & Victim Monitoring System • 24x7 Toll-Free</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Victim Support & <br className="hidden sm:inline" />
            <span className="text-[#aec7f7]">Continuous Case Monitoring Platform</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#d8e3fa] font-normal leading-relaxed">
            RakshaSetu securely connects consented case updates from the NHAA registry with AI distress evaluation
            and certified Tele-MANAS counsellors for proactive, continuous human intervention.
          </p>

          {/* Core Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              id="get-support-now-btn"
              onClick={startCitizenFlow}
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#002046] font-bold text-sm sm:text-base rounded-xl shadow-lg hover:bg-[#d6e3ff] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">vital_signs</span>
              <span>Get Support Now</span>
            </button>

            <button
              id="learn-more-btn"
              onClick={() => navigateTo('screening-intro', 'push')}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#1b365d]/80 hover:bg-[#2e476f] text-white font-semibold text-sm sm:text-base rounded-xl border border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">info</span>
              <span>Learn More</span>
            </button>

            <button
              id="role-switcher-hero-btn"
              onClick={() => navigateTo('national-command', 'slide_up')}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#aec7f7]/20 hover:bg-[#aec7f7]/30 text-[#aec7f7] hover:text-white font-medium text-sm rounded-xl border border-[#aec7f7]/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
              <span>Role Switcher</span>
            </button>
          </div>

          <div className="pt-2 text-xs text-[#87a0cd] flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-emerald-400">lock</span> DPDPA 2023 Consent Authorized
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-emerald-400">sync</span> Continuous Case Stream
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-emerald-400">verified_user</span> Human Validation Authoritative
            </span>
          </div>
        </div>
      </section>

      {/* Emergency Lifeline Alert Strip */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-[#fff0f0] border-2 border-[#ba1a1a] rounded-xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">phone_in_talk</span>
            </div>
            <div>
              <h3 className="font-bold text-[#ba1a1a] text-base flex items-center gap-2">
                In Immediate Crisis or Feeling Overwhelmed?
              </h3>
              <p className="text-xs text-[#44474e] mt-0.5">
                Reach free, 24x7 multilingual tele-counsellors right now across all Indian states.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
            <a
              href="tel:14416"
              className="bg-[#ba1a1a] text-white px-4 py-2 rounded-lg font-mono text-sm font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#93000a] transition-colors"
            >
              <span className="material-symbols-outlined text-base">call</span>
              <span>Tele-MANAS: 14416</span>
            </a>
            <a
              href="tel:04424640050"
              className="bg-white border border-[#ba1a1a] text-[#ba1a1a] px-3 py-2 rounded-lg font-mono text-xs font-semibold hover:bg-[#ffdad6]/40 transition-colors"
            >
              <span>Sneha: 044-24640050</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* 3 Pillars of Victim Support & Continuous Monitoring */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-[#002046] tracking-tight">
              Proactive Case Monitoring & Victim Care
            </h2>
            <p className="text-xs sm:text-sm text-[#545f72] mt-1">
              Bridging consented NHAA case events with intelligent AI triage and certified Tele-MANAS clinicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl p-6 border border-[#c4c6cf]/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#d6e3ff] text-[#002046] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <h3 className="font-bold text-base text-[#002046]">1. NHAA Case Stream</h3>
              <p className="text-xs text-[#545f72] leading-relaxed">
                Permitted case tracking (hearing dates, trial delays, protection orders) synchronized with explicit victim consent under DPDPA.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#c4c6cf]/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#d5e0f7] text-[#1b365d] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">psychology</span>
              </div>
              <h3 className="font-bold text-base text-[#002046]">2. Continuous AI Reassessment</h3>
              <p className="text-xs text-[#545f72] leading-relaxed">
                When a trial delay or case milestone changes, the engine recalculates distress risk in real time and flags escalations.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#c4c6cf]/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#d6e3ff] text-[#002046] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">medical_services</span>
              </div>
              <h3 className="font-bold text-base text-[#002046]">3. Tele-MANAS Human Care</h3>
              <p className="text-xs text-[#545f72] leading-relaxed">
                Certified clinical psychologists review incoming risk alerts, validate decisions, authorize support plans, and schedule follow-ups.
              </p>
            </div>
          </div>
        </div>

        {/* 4-Step Continuous Lifecycle Roadmap */}
        <div className="bg-white rounded-xl border border-[#c4c6cf]/80 p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#eceef0] gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#002046] uppercase">Continuous Workflow</span>
              <h3 className="text-xl font-bold text-[#002046] mt-0.5">The RakshaSetu Case Lifecycle</h3>
            </div>
            <button
              onClick={startCitizenFlow}
              className="px-4 py-2 bg-[#002046] text-white text-xs font-semibold rounded-lg hover:bg-[#1b365d] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Begin Intake & Consent</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
              <div className="text-xs font-mono font-bold text-[#002046] bg-[#d6e3ff] w-6 h-6 rounded-full flex items-center justify-center">
                1
              </div>
              <h4 className="text-sm font-semibold text-[#002046]">Consent & Intake</h4>
              <p className="text-xs text-[#545f72]">Victim authorizes NHAA case access and completes baseline psychological screening.</p>
            </div>

            <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
              <div className="text-xs font-mono font-bold text-[#002046] bg-[#d6e3ff] w-6 h-6 rounded-full flex items-center justify-center">
                2
              </div>
              <h4 className="text-sm font-semibold text-[#002046]">Initial AI Triage</h4>
              <p className="text-xs text-[#545f72]">Initial risk evaluated (e.g. 58 MODERATE) and case entered into continuous monitoring.</p>
            </div>

            <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
              <div className="text-xs font-mono font-bold text-[#002046] bg-[#d6e3ff] w-6 h-6 rounded-full flex items-center justify-center">
                3
              </div>
              <h4 className="text-sm font-semibold text-[#002046]">Event Reassessment</h4>
              <p className="text-xs text-[#545f72]">NHAA hearing postponement triggers automatic re-scoring (e.g. 72 HIGH) and counsellor alert.</p>
            </div>

            <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
              <div className="text-xs font-mono font-bold text-[#002046] bg-[#d6e3ff] w-6 h-6 rounded-full flex items-center justify-center">
                4
              </div>
              <h4 className="text-sm font-semibold text-[#002046]">Human Intervention</h4>
              <p className="text-xs text-[#545f72]">Tele-MANAS clinician validates assessment, activates support plan, and schedules follow-up.</p>
            </div>
          </div>
        </div>

        {/* Ethics and Clinical Compliance */}
        <EthicsBanner type="all" />
      </main>
    </div>
  );
};
