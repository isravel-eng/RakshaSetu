import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';

export const AssessmentResult: React.FC = () => {
  const {
    currentCase,
    citizenProfile,
    navigateTo
  } = useApp();

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'toolkit'>('overview');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#eceef0] gap-3">
        <div className="flex items-center gap-2 text-xs text-[#545f72]">
          <button
            onClick={() => navigateTo('public-support', 'push_back')}
            className="hover:text-[#002046] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-[#002046] font-semibold">Assessment Result | RakshaSetu</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-[#002046] text-white px-3 py-1 rounded-md font-bold">
            CASE ID: {currentCase.caseId}
          </span>
          <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-md font-medium">
            Pending Human Validation
          </span>
        </div>
      </div>

      {/* Hero Distress Score & Severity Banner */}
      <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left: Score Dial Card */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#f7f9fb] to-[#eceef0] border border-[#c4c6cf] text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-xs font-bold text-[#545f72] uppercase tracking-wider">
              Distress Severity Score
            </span>
            <div className="relative flex items-center justify-center">
              {/* Radial representation */}
              <div
                className={`w-28 h-28 rounded-full border-8 flex items-center justify-center bg-white shadow-inner ${
                  currentCase.riskLevel === 'CRITICAL'
                    ? 'border-[#ba1a1a]/30'
                    : currentCase.riskLevel === 'HIGH'
                    ? 'border-amber-500/30'
                    : currentCase.riskLevel === 'MODERATE'
                    ? 'border-[#002046]/30'
                    : 'border-emerald-600/30'
                }`}
              >
                <div className="text-center">
                  <span
                    className={`text-3xl font-extrabold font-mono ${
                      currentCase.riskLevel === 'CRITICAL'
                        ? 'text-[#ba1a1a]'
                        : currentCase.riskLevel === 'HIGH'
                        ? 'text-amber-700'
                        : currentCase.riskLevel === 'MODERATE'
                        ? 'text-[#002046]'
                        : 'text-emerald-700'
                    }`}
                  >
                    {currentCase.distressScore}
                  </span>
                  <span className="text-xs text-[#74777f] block font-mono">/ 100</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 w-full">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold tracking-wide uppercase shadow-2xs ${
                  currentCase.riskLevel === 'CRITICAL'
                    ? 'bg-[#ba1a1a]'
                    : currentCase.riskLevel === 'HIGH'
                    ? 'bg-amber-700'
                    : currentCase.riskLevel === 'MODERATE'
                    ? 'bg-[#002046]'
                    : 'bg-emerald-700'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {currentCase.riskLevel === 'CRITICAL' ? 'emergency' : currentCase.riskLevel === 'HIGH' ? 'warning' : 'verified'}
                </span>
                <span>{currentCase.riskLevel} DISTRESS LEVEL</span>
              </div>

              <span className="text-[11px] font-mono font-bold text-[#002046] bg-[#d6e3ff] px-2.5 py-0.5 rounded-md">
                PRIORITY: {currentCase.priority || currentCase.aiAssessment.priority || (currentCase.riskLevel === 'CRITICAL' ? 'IMMEDIATE' : currentCase.riskLevel === 'HIGH' ? 'URGENT' : currentCase.riskLevel === 'MODERATE' ? 'PRIORITY' : 'ROUTINE')}
              </span>
            </div>

            <p className="text-[11px] text-[#545f72] max-w-xs">
              Based on standardized PHQ-4 & GAD-2 screening markers.
            </p>
          </div>

          {/* Center & Right: AI Clinical Assessment Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#002046] text-2xl">neurology</span>
                <h1 className="text-2xl font-bold text-[#002046] tracking-tight">
                  {currentCase.aiAssessment.distressCategory}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#545f72] mt-1 leading-relaxed">
                {currentCase.aiAssessment.explanation}
              </p>
            </div>

            {/* Recommended Tier Card & Next Action */}
            <div className="p-3.5 rounded-lg bg-[#d6e3ff]/50 border border-[#87a0cd]/60 space-y-1.5">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#002046] text-xl shrink-0 mt-0.5">verified</span>
                <div className="text-xs text-[#002046]">
                  <strong className="block text-sm font-bold">
                    Recommended Intervention Tier: {currentCase.aiAssessment.recommendedTier}
                  </strong>
                  <span className="text-[12px] block mt-0.5">
                    {currentCase.aiAssessment.recommendedAction ||
                      `Immediate clinical consultation and structured psychological support recommended for ${citizenProfile.district || 'Chennai'} district.`}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Confidence & Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5]">
                <span className="text-[#74777f] block text-[11px]">Primary Stressor</span>
                <span className="font-semibold text-[#002046] truncate block">
                  {currentCase.screeningSummary.primaryTrigger}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5]">
                <span className="text-[#74777f] block text-[11px]">Sleep Disruption</span>
                <span className="font-semibold text-[#002046] truncate block">
                  {currentCase.screeningSummary.sleepImpact}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] col-span-2 sm:col-span-1">
                <span className="text-[#74777f] block text-[11px]">Clinical Confidence</span>
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {currentCase.aiAssessment.confidenceScore}% ({currentCase.aiAssessment.confidenceLevel || 'High'})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Human in the Loop Ethics Banner */}
      <EthicsBanner type="ai-preliminary" />

      {/* Tabs for Support Pathways */}
      <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-sm overflow-hidden">
        <div className="flex border-b border-[#eceef0] bg-[#f7f9fb] px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-[#002046] text-[#002046] bg-white'
                : 'border-transparent text-[#545f72] hover:text-[#002046]'
            }`}
          >
            <span className="material-symbols-outlined text-base">support_agent</span>
            <span>Immediate Care Plan & Referrals</span>
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'facilities'
                ? 'border-[#002046] text-[#002046] bg-white'
                : 'border-transparent text-[#545f72] hover:text-[#002046]'
            }`}
          >
            <span className="material-symbols-outlined text-base">local_hospital</span>
            <span>Nearby Hospital Facilities ({citizenProfile.district || 'Chennai'})</span>
          </button>

          <button
            onClick={() => setActiveTab('toolkit')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'toolkit'
                ? 'border-[#002046] text-[#002046] bg-white'
                : 'border-transparent text-[#545f72] hover:text-[#002046]'
            }`}
          >
            <span className="material-symbols-outlined text-base">self_improvement</span>
            <span>Self-Care & Sleep Toolkit</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Tab 1: Overview & Interventions */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#002046]">Recommended Clinical Support Action</h3>
                  <p className="text-xs text-[#545f72]">
                    A certified DMHP psychologist has been alerted to review your assessment.
                  </p>
                </div>
                <div className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Assigned: Dr. Priya Raman (Lead Clinical Psychologist)</span>
                </div>
              </div>

              {/* Contributing Factors & Protective Factors Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#fff8f7] border border-[#ffdad6] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#ba1a1a] uppercase tracking-wider">
                    <span className="material-symbols-outlined text-base">analytics</span>
                    <span>Key Contributing Factors</span>
                  </div>
                  <ul className="text-xs text-[#44474e] space-y-1.5 pl-3 list-disc">
                    {currentCase.aiAssessment.keyRiskFactors.map((factor, idx) => (
                      <li key={idx} className="leading-snug">
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#f0fdf4] border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-base">shield_with_heart</span>
                    <span>Protective Factors</span>
                  </div>
                  <ul className="text-xs text-[#44474e] space-y-1.5 pl-3 list-disc">
                    {currentCase.aiAssessment.protectiveFactors.map((factor, idx) => (
                      <li key={idx} className="leading-snug">
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#002046] text-xl">call_end</span>
                    <h4 className="text-sm font-bold text-[#002046]">Tele-MANAS Tamil Nadu Support Hub</h4>
                  </div>
                  <p className="text-xs text-[#545f72] leading-relaxed">
                    Direct one-on-one tele-counselling with a certified psychologist fluent in Tamil and English.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="tel:14416"
                      className="px-3.5 py-1.5 bg-[#ba1a1a] text-white text-xs font-bold rounded-md flex items-center gap-1 hover:bg-[#93000a] transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                      <span>Call 14416 (Toll Free)</span>
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#002046] text-xl">calendar_month</span>
                    <h4 className="text-sm font-bold text-[#002046]">Scheduled Clinical Follow-up</h4>
                  </div>
                  <p className="text-xs text-[#545f72] leading-relaxed">
                    A follow-up review slot has been reserved for your case to track emotional recovery and check in.
                  </p>
                  <div className="text-xs font-mono bg-white p-2 rounded border border-[#c4c6cf] text-[#002046]">
                    Slot: Wednesday, Sep 3, 2026 • 10:30 AM IST (Tele-consult)
                  </div>
                </div>
              </div>

              {bookingConfirmed && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700">check_circle</span>
                  <span>
                    Your appointment has been registered with the Chennai District Mental Health Programme cell!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Facilities */}
          {activeTab === 'facilities' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#002046]">
                Designated District Mental Health Centres ({citizenProfile.district || 'Chennai'})
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-[#c4c6cf] bg-[#f7f9fb] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#002046]">
                      Rajiv Gandhi Govt General Hospital - Dept of Psychiatry
                    </h4>
                    <p className="text-xs text-[#545f72]">EVR Periyar Salai, Park Town, Chennai - 600003</p>
                    <p className="text-xs text-[#1b365d] font-mono mt-1">Phone: 044-25305000 | OPD: Mon-Sat 8AM-1PM</p>
                  </div>
                  <span className="text-xs bg-[#d6e3ff] text-[#002046] px-2.5 py-1 rounded font-semibold shrink-0">
                    3.2 km away
                  </span>
                </div>

                <div className="p-4 rounded-lg border border-[#c4c6cf] bg-[#f7f9fb] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#002046]">
                      Institute of Mental Health (IMH) Kilpauk
                    </h4>
                    <p className="text-xs text-[#545f72]">Medavakkam Tank Road, Kilpauk, Chennai - 600010</p>
                    <p className="text-xs text-[#1b365d] font-mono mt-1">Phone: 044-26441041 | 24x7 Emergency OPD</p>
                  </div>
                  <span className="text-xs bg-[#d6e3ff] text-[#002046] px-2.5 py-1 rounded font-semibold shrink-0">
                    5.8 km away
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Toolkit */}
          {activeTab === 'toolkit' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#002046]">Emergency Grounding & Sleep Hygiene Protocols</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#f0f9ff] border border-[#aec7f7] space-y-2">
                  <h4 className="font-bold text-sm text-[#002046]">5-4-3-2-1 Sensory Grounding</h4>
                  <p className="text-xs text-[#545f72]">
                    A quick cognitive calming routine to de-escalate acute panic and racing thoughts.
                  </p>
                  <ul className="text-xs text-[#191c1e] space-y-1 list-disc pl-4">
                    <li>5 things you can see around you</li>
                    <li>4 things you can physically touch</li>
                    <li>3 sounds you can hear</li>
                    <li>2 scents you can smell</li>
                    <li>1 deep, slow diaphragmatic breath</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#f0f9ff] border border-[#aec7f7] space-y-2">
                  <h4 className="font-bold text-sm text-[#002046]">Sleep Restoration Protocol</h4>
                  <p className="text-xs text-[#545f72]">
                    Structured nighttime hygiene to manage severe insomnia.
                  </p>
                  <ul className="text-xs text-[#191c1e] space-y-1 list-disc pl-4">
                    <li>Cease screen exposure 45 mins before bedtime</li>
                    <li>Keep bedroom dark, cool, and quiet</li>
                    <li>If awake for &gt; 20 mins, move to a dim room and read</li>
                    <li>Avoid caffeine after 3:00 PM</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - EXACT SPEC LABELS */}
        <div className="p-6 bg-[#f7f9fb] border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            id="assessment-back-to-home-btn"
            onClick={() => navigateTo('public-support', 'push_back')}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#74777f] text-[#002046] font-semibold text-sm rounded-lg hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="schedule-follow-up-btn"
              onClick={() => {
                setBookingConfirmed(true);
                // EXACT SPEC REQUIREMENT: Schedule Follow-Up -> Case Review: RS-2026-00124 (push transition)
                navigateTo('case-review', 'push');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#002046] hover:bg-[#1b365d] text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">psychology</span>
              <span>Schedule Follow-Up</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
