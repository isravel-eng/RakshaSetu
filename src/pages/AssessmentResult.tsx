import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';
import { NhaaCaseMonitorCard } from '../components/NhaaCaseMonitorCard';
import { RiskHistoryTrend } from '../components/RiskHistoryTrend';
import { CaseLifecycleTimeline } from '../components/CaseLifecycleTimeline';
import { INITIAL_DISTRICT_METRICS } from '../data/initialData';

export const AssessmentResult: React.FC = () => {
  const {
    currentCase,
    citizenProfile,
    nhaaData,
    syncNhaaCase,
    isNhaaSyncing,
    setRole,
    navigateTo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'monitoring' | 'timeline' | 'facilities'>('overview');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const isValidated = currentCase.counsellorReview.isHumanValidated;

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
          <span className="text-[#002046] font-semibold">Victim Case Monitor & Assessment | RakshaSetu</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono bg-[#002046] text-white px-3 py-1 rounded-md font-bold">
            CASE ID: {currentCase.caseId}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-md font-bold flex items-center gap-1 ${
              isValidated
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            <span className="material-symbols-outlined text-xs">
              {isValidated ? 'verified' : 'pending_actions'}
            </span>
            <span>{isValidated ? 'Human Clinician Validated' : 'Pending Human Review'}</span>
          </span>
        </div>
      </div>

      {/* Follow-up & Support Status Banner (if validated) */}
      {isValidated && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl flex items-center justify-between gap-4 flex-wrap shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">check</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                <span>Support Plan Active — Tele-MANAS Follow-up Scheduled</span>
                <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  PLAN INITIATED
                </span>
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Next Follow-up: <strong>{currentCase.counsellorReview.followUpDate} at {currentCase.counsellorReview.followUpTime}</strong> • Assigned: <strong>{currentCase.counsellorReview.assignedCounsellor}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-emerald-600 text-white px-3 py-1 rounded font-bold">
              MONITORING ACTIVE
            </span>
          </div>
        </div>
      )}

      {/* NHAA Integrated Case Monitor Card */}
      <NhaaCaseMonitorCard
        nhaaData={nhaaData}
        onSync={syncNhaaCase}
        isSyncing={isNhaaSyncing}
      />

      {/* Hero Distress Score & Severity Banner */}
      <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left: Score Dial Card */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#f7f9fb] to-[#eceef0] border border-[#c4c6cf] text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-xs font-bold text-[#545f72] uppercase tracking-wider">
              Distress Severity Score
            </span>
            <div className="relative flex items-center justify-center">
              <div
                className={`w-28 h-28 rounded-full border-8 flex items-center justify-center bg-white shadow-inner ${
                  currentCase.riskLevel === 'CRITICAL'
                    ? 'border-[#ba1a1a]/30'
                    : currentCase.riskLevel === 'HIGH'
                    ? 'border-red-500/40'
                    : currentCase.riskLevel === 'MODERATE'
                    ? 'border-[#f59e0b]/40'
                    : 'border-emerald-600/30'
                }`}
              >
                <div className="text-center">
                  <span
                    className={`text-3xl font-extrabold font-mono ${
                      currentCase.riskLevel === 'CRITICAL'
                        ? 'text-[#ba1a1a]'
                        : currentCase.riskLevel === 'HIGH'
                        ? 'text-[#d83a56]'
                        : currentCase.riskLevel === 'MODERATE'
                        ? 'text-[#f59e0b]'
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
                    ? 'bg-[#d83a56]'
                    : currentCase.riskLevel === 'MODERATE'
                    ? 'bg-[#f59e0b]'
                    : 'bg-emerald-700'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {currentCase.riskLevel === 'CRITICAL' ? 'emergency' : currentCase.riskLevel === 'HIGH' ? 'warning' : 'verified'}
                </span>
                <span>{currentCase.riskLevel} RISK LEVEL</span>
              </div>

              <span className="text-[11px] font-mono font-bold text-[#002046] bg-[#d6e3ff] px-2.5 py-0.5 rounded-md">
                PRIORITY: {currentCase.priority || 'PRIORITY'}
              </span>
            </div>

            <p className="text-[11px] text-[#545f72] max-w-xs">
              Combined psychological signals & NHAA judicial lifecycle context.
            </p>
          </div>

          {/* Center & Right: AI Clinical Assessment Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#002046] text-2xl">psychology</span>
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
              <div className="p-2.5 rounded-lg bg-[#f7f9fb] border border-[#eceef0]">
                <span className="text-[10px] text-[#74777f] font-mono block">AI Triage Confidence</span>
                <span className="font-bold text-[#002046] font-mono">
                  {currentCase.aiAssessment.confidenceScore}% (HIGH)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#f7f9fb] border border-[#eceef0]">
                <span className="text-[10px] text-[#74777f] font-mono block">Human Validation</span>
                <span className="font-bold text-amber-900">
                  {isValidated ? 'Validated & Signed' : 'Mandatory Protocol'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#f7f9fb] border border-[#eceef0] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#74777f] font-mono block">Continuous Monitoring</span>
                <span className="font-bold text-emerald-800">Active (24x7 Stream)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ethics & Legal Banner */}
      <EthicsBanner type="ai-preliminary" />

      {/* Interactive Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#eceef0] pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#002046] text-white font-bold shadow-xs'
              : 'text-[#545f72] hover:bg-[#f2f4f8]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">clinical_notes</span>
          <span>Overview & Factors</span>
        </button>

        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'monitoring'
              ? 'bg-[#002046] text-white font-bold shadow-xs'
              : 'text-[#545f72] hover:bg-[#f2f4f8]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span>Risk Trajectory & History</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-[#002046] text-white font-bold shadow-xs'
              : 'text-[#545f72] hover:bg-[#f2f4f8]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">timeline</span>
          <span>Case Lifecycle Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab('facilities')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'facilities'
              ? 'bg-[#002046] text-white font-bold shadow-xs'
              : 'text-[#545f72] hover:bg-[#f2f4f8]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">local_hospital</span>
          <span>District Facilities & SOS</span>
        </button>
      </div>

      {/* Tab 1: Clinical Overview & Factor Breakdown */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Contributing Risk Factors */}
          <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-2xs p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[#eceef0] pb-2.5">
              <span className="material-symbols-outlined text-[#ba1a1a]">warning</span>
              <h3 className="font-bold text-sm text-[#ba1a1a]">
                Key Contributing Risk Factors ({currentCase.aiAssessment.keyRiskFactors.length})
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-[#44474e]">
              {currentCase.aiAssessment.keyRiskFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-red-50/50 border border-red-100">
                  <span className="material-symbols-outlined text-sm text-[#ba1a1a] mt-0.5">priority_high</span>
                  <span className="leading-relaxed font-medium">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Protective Buffers */}
          <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-2xs p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[#eceef0] pb-2.5">
              <span className="material-symbols-outlined text-emerald-700">shield</span>
              <h3 className="font-bold text-sm text-emerald-800">
                Protective Buffers & Resilience Markers ({currentCase.aiAssessment.protectiveFactors.length})
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-[#44474e]">
              {currentCase.aiAssessment.protectiveFactors.map((buffer, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="material-symbols-outlined text-sm text-emerald-700 mt-0.5">check_circle</span>
                  <span className="leading-relaxed font-medium">{buffer}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Continuous Risk Trajectory & History */}
      {activeTab === 'monitoring' && (
        <RiskHistoryTrend
          history={currentCase.riskHistory}
          currentScore={currentCase.distressScore}
          currentRisk={currentCase.riskLevel}
        />
      )}

      {/* Tab 3: Case Lifecycle Timeline */}
      {activeTab === 'timeline' && (
        <CaseLifecycleTimeline timeline={currentCase.timeline} />
      )}

      {/* Tab 4: Facilities & SOS Lifelines */}
      {activeTab === 'facilities' && (
        <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#eceef0] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#002046]">
                District Mental Health Facilities & Verified Tele-Support ({citizenProfile.district || 'Chennai'})
              </h3>
              <p className="text-xs text-[#545f72]">
                Government-authorized clinical partners and 24x7 crisis hotlines
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#d6e3ff] text-[#002046] px-2.5 py-1 rounded">
              5 Centers Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INITIAL_DISTRICT_METRICS.centers.map((center, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-[#eceef0] bg-[#fcfdfd] space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs text-[#002046]">{center.name}</span>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded">
                    {center.distanceKm} km
                  </span>
                </div>
                <p className="text-[11px] text-[#545f72]">{center.address}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="font-mono text-[#002046] font-bold">{center.phone}</span>
                  <span className="text-emerald-700 text-[11px] font-semibold">{center.availableSlots} Slots Open</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer: Switch to Tele-MANAS Counsellor Review */}
      <div className="p-4 bg-[#f2f4f8] rounded-xl border border-[#c4c6cf] flex items-center justify-between flex-wrap gap-3">
        <div>
          <h4 className="text-xs font-bold text-[#002046]">
            SIH Demonstration Workflow Navigation
          </h4>
          <p className="text-[11px] text-[#545f72]">
            Review this case from the perspective of a certified Tele-MANAS clinical psychologist.
          </p>
        </div>

        <button
          onClick={() => {
            setRole('counsellor');
            navigateTo('case-review', 'slide_up');
          }}
          className="px-5 py-2.5 rounded-lg bg-[#002046] hover:bg-[#003366] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <span>Open Tele-MANAS Counsellor Review</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
