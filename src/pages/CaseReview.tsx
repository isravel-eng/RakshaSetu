import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';
import { RiskHistoryTrend } from '../components/RiskHistoryTrend';
import { CaseLifecycleTimeline } from '../components/CaseLifecycleTimeline';
import { CounsellorAlertBanner } from '../components/CounsellorAlertBanner';
import { RiskLevel, SupportInterventionType } from '../types';

const SUPPORT_OPTIONS: SupportInterventionType[] = [
  'Tele-counselling',
  'Tele-MANAS',
  'Legal support',
  'Medical support',
  'Protection',
  'Relocation',
  'Financial assistance'
];

export const CaseReview: React.FC = () => {
  const {
    currentCase,
    validateCaseByCounsellor,
    navigateTo,
    cases,
    setCurrentCaseId,
    acknowledgeAlert
  } = useApp();

  const [clinicalNotes, setClinicalNotes] = useState<string>(
    currentCase.counsellorReview.clinicalNotes ||
      'Citizen presents with escalated situational distress following a 14-day judicial postponement on the NHAA registry (04 Sep → 18 Sep 2026). Chronic sleep deprivation (<3 hours) and anticipatory court anxiety noted. Patient expresses high strain but no immediate self-harm intent. Approved structured 3-session tele-counselling plan with DLSA legal aid liaison at RGGGH Chennai.'
  );

  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>(
    currentCase.counsellorReview.humanValidatedRisk || currentCase.riskLevel
  );

  const [selectedSupport, setSelectedSupport] = useState<SupportInterventionType[]>(
    currentCase.counsellorReview.selectedSupportTypes && currentCase.counsellorReview.selectedSupportTypes.length > 0
      ? currentCase.counsellorReview.selectedSupportTypes
      : ['Tele-counselling', 'Tele-MANAS', 'Legal support']
  );

  const [referralTarget, setReferralTarget] = useState<string>(
    currentCase.counsellorReview.referralTarget ||
      'Rajiv Gandhi Government General Hospital - DMHP Unit, Chennai'
  );

  const [followUpDate, setFollowUpDate] = useState<string>(
    currentCase.counsellorReview.followUpDate || '2026-09-03'
  );

  const [followUpTime, setFollowUpTime] = useState<string>(
    currentCase.counsellorReview.followUpTime || '10:30 AM IST'
  );

  const [validationSuccess, setValidationSuccess] = useState<boolean>(
    currentCase.counsellorReview.isHumanValidated
  );

  const activeAlert = currentCase.alerts && currentCase.alerts.find((a) => !a.isReviewed);

  const toggleSupport = (item: SupportInterventionType) => {
    if (selectedSupport.includes(item)) {
      setSelectedSupport(selectedSupport.filter((s) => s !== item));
    } else {
      setSelectedSupport([...selectedSupport, item]);
    }
  };

  const handleValidateAndCreatePlan = () => {
    validateCaseByCounsellor(currentCase.caseId, {
      humanValidatedRisk: selectedRisk,
      clinicalNotes,
      selectedSupportTypes: selectedSupport,
      referralTarget,
      followUpDate,
      followUpTime
    });
    setValidationSuccess(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-6">
      {/* Top Header with Breadcrumbs and Queue */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#eceef0] gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#545f72]">
            <button
              onClick={() => navigateTo('district-dashboard', 'push_back')}
              className="hover:text-[#002046] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">location_city</span>
              <span>District Dashboard (Chennai)</span>
            </button>
            <span>/</span>
            <span className="text-[#002046] font-semibold">Tele-MANAS Case Review: {currentCase.caseId}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#002046] tracking-tight flex items-center gap-2.5 flex-wrap">
            <span className="material-symbols-outlined text-[#002046] text-3xl">rate_review</span>
            <span>Case Review: {currentCase.caseId}</span>
            <span className="text-xs font-mono font-bold bg-blue-100 text-blue-950 px-2.5 py-1 rounded">
              NHAA: {currentCase.nhaaCaseReference}
            </span>
            <span
              className={`text-xs font-mono px-2.5 py-1 rounded font-bold ${
                currentCase.riskLevel === 'CRITICAL'
                  ? 'bg-[#ba1a1a] text-white'
                  : currentCase.riskLevel === 'HIGH'
                  ? 'bg-[#d83a56] text-white'
                  : currentCase.riskLevel === 'MODERATE'
                  ? 'bg-[#f59e0b] text-white'
                  : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              AI TRIAGE: {currentCase.riskLevel} ({currentCase.distressScore}/100)
            </span>
          </h1>
        </div>

        {/* Case Queue Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#545f72] font-semibold">Case Queue:</span>
          <div className="flex items-center gap-1.5">
            {cases.map((c) => (
              <button
                key={c.caseId}
                onClick={() => setCurrentCaseId(c.caseId)}
                className={`text-xs px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                  currentCase.caseId === c.caseId
                    ? 'bg-[#002046] text-white font-bold shadow-xs'
                    : 'bg-[#e0e3e5] text-[#191c1e] hover:bg-[#c4c6cf]'
                }`}
              >
                {c.caseId}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Human-in-the-loop Ethics Banner */}
      <EthicsBanner type="human-validation" />

      {/* Active Counsellor Alert (if event triggered) */}
      {activeAlert && (
        <CounsellorAlertBanner
          alert={activeAlert}
          onReview={() => {}}
          onAcknowledge={acknowledgeAlert}
        />
      )}

      {/* Validation Status Notification */}
      {validationSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl flex items-center justify-between gap-4 flex-wrap shadow-xs">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-700 text-2xl">verified</span>
            <div>
              <h4 className="font-bold text-sm text-emerald-900">
                Human Clinical Validation Completed by Dr. Priya Raman
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Validated Risk: <strong>{selectedRisk}</strong> • Support Plan: <strong>{selectedSupport.join(', ')}</strong> • Referral: <strong>{referralTarget}</strong>
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded font-bold shrink-0">
            RECORD SIGNED & PERSISTED
          </span>
        </div>
      )}

      {/* 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): SOURCE DATA (NHAA) & AI ASSESSMENT */}
        <div className="lg:col-span-5 space-y-5">
          {/* SECTION 1: SOURCE DATA (NHAA Registry) */}
          <div className="bg-white rounded-xl border-2 border-blue-200 shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#002046]">account_balance</span>
                <h3 className="font-bold text-sm text-[#002046]">
                  1. SOURCE DATA: NHAA Case Registry
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                PERMITTED ACCESS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#545f72] block">Victim Name</span>
                <span className="font-semibold text-[#191c1e]">{currentCase.citizenName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#545f72] block">NHAA Case Ref</span>
                <span className="font-mono text-[#002046] font-bold">{currentCase.nhaaCaseReference}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#545f72] block">Case Status</span>
                <span className="font-semibold text-emerald-800">
                  {currentCase.nhaaData?.caseStatus || 'Active'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#545f72] block">Next Hearing</span>
                <span className="font-bold font-mono text-[#ba1a1a]">
                  {currentCase.nhaaData?.nextHearingDate || '18 Sep 2026'}
                </span>
              </div>
            </div>

            {currentCase.nhaaData?.events && currentCase.nhaaData.events.length > 0 && (
              <div className="pt-2 border-t border-blue-100 space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-[#002046] block">Latest Event Ingested:</span>
                <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200">
                  <span className="font-bold text-[#ba1a1a] block text-[11px]">
                    {currentCase.nhaaData.events[0].title}
                  </span>
                  <p className="text-[#44474e] text-[11px] mt-0.5">
                    {currentCase.nhaaData.events[0].description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: AI ASSESSMENT (Preliminary Scoring) */}
          <div className="bg-[#f0f9ff] rounded-xl border border-[#aec7f7] shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#aec7f7]/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#002046]">psychology</span>
                <h3 className="font-bold text-sm text-[#002046]">
                  2. AI ASSESSMENT (Preliminary Triage)
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono bg-[#002046] text-white px-2 py-0.5 rounded font-bold">
                  {currentCase.priority || 'URGENT'}
                </span>
                <span className="text-xs font-mono bg-[#d6e3ff] text-[#002046] px-2 py-0.5 rounded font-bold">
                  {currentCase.distressScore}/100
                </span>
              </div>
            </div>

            <p className="text-xs text-[#1b365d] leading-relaxed">
              {currentCase.aiAssessment.explanation}
            </p>

            {/* Recommendation Box */}
            <div className="p-3 rounded-lg bg-white border border-[#aec7f7] text-xs space-y-1">
              <span className="font-bold text-[#002046] block">
                {currentCase.aiAssessment.recommendedTier}
              </span>
              <p className="text-[#545f72] text-[11px]">
                {currentCase.aiAssessment.recommendedAction}
              </p>
            </div>

            {/* Identified Contributing Risk Factors */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider block">
                Contributing Risk Signals ({currentCase.aiAssessment.keyRiskFactors.length}):
              </span>
              <ul className="space-y-1 text-xs text-[#44474e]">
                {currentCase.aiAssessment.keyRiskFactors.map((rf, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 p-1.5 rounded bg-white/70 border border-red-100">
                    <span className="text-[#ba1a1a] font-bold">•</span>
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Screening Intake Context Card */}
          <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-2xs p-5 space-y-2.5 text-xs">
            <h4 className="font-bold text-xs text-[#002046] border-b border-slate-100 pb-1.5">
              Screening Context Summary
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#74777f] block">Emotional Scale:</span>
                <span className="font-medium">{currentCase.screeningSummary.phqScore}</span>
              </div>
              <div>
                <span className="text-[#74777f] block">Anxiety Index:</span>
                <span className="font-medium">{currentCase.screeningSummary.gadScore}</span>
              </div>
              <div>
                <span className="text-[#74777f] block">Sleep Impact:</span>
                <span className="font-medium text-[#ba1a1a]">{currentCase.screeningSummary.sleepImpact}</span>
              </div>
              <div>
                <span className="text-[#74777f] block">Primary Trigger:</span>
                <span className="font-medium">{currentCase.screeningSummary.primaryTrigger}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): HUMAN REVIEW & SUPPORT ACTION */}
        <div className="lg:col-span-7 space-y-5">
          {/* SECTION 3: HUMAN CLINICAL REVIEW (Authoritative Decision) */}
          <div className="bg-white rounded-xl border-2 border-[#002046] shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#eceef0] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#002046] text-2xl">medical_services</span>
                <div>
                  <h3 className="font-bold text-base text-[#002046]">
                    3. HUMAN REVIEW: Tele-MANAS Clinician Validation
                  </h3>
                  <p className="text-xs text-[#545f72]">
                    Authoritative clinical decision by Dr. Priya Raman (Lead Clinical Psychologist)
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
                HUMAN IS AUTHORITATIVE
              </span>
            </div>

            {/* Validated Risk Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#002046] uppercase tracking-wider block">
                Human Validated Clinical Risk Level:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['MILD', 'MODERATE', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((level) => {
                  const isSelected = selectedRisk === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedRisk(level)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? level === 'CRITICAL'
                            ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] shadow-xs'
                            : level === 'HIGH'
                            ? 'bg-[#d83a56] text-white border-[#d83a56] shadow-xs'
                            : level === 'MODERATE'
                            ? 'bg-[#f59e0b] text-white border-[#f59e0b] shadow-xs'
                            : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white border-[#c4c6cf] text-[#44474e] hover:bg-[#f2f4f8]'
                      }`}
                    >
                      <span>{level}</span>
                      {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#002046] uppercase tracking-wider block">
                Clinical Examination & Triage Notes:
              </label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                rows={4}
                className="w-full text-xs text-[#191c1e] p-3 rounded-lg border border-[#c4c6cf] focus:ring-2 focus:ring-[#002046] focus:border-[#002046] leading-relaxed"
                placeholder="Enter clinical assessment notes..."
              />
            </div>

            {/* SECTION 4: ACTION & SUPPORT INTERVENTIONS */}
            <div className="space-y-3 pt-3 border-t border-[#eceef0]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#002046] uppercase tracking-wider block">
                  4. ACTION: Prescribed Support & Intervention Package:
                </label>
                <span className="text-[11px] text-[#74777f]">
                  {selectedSupport.length} selected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUPPORT_OPTIONS.map((opt) => {
                  const isChecked = selectedSupport.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleSupport(opt)}
                      className={`p-2 rounded-lg border text-xs font-semibold text-left transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                        isChecked
                          ? 'bg-[#002046] text-white border-[#002046] shadow-xs'
                          : 'bg-[#fcfdfd] border-slate-200 text-[#44474e] hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{opt}</span>
                      <span className="material-symbols-outlined text-sm">
                        {isChecked ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Referral Target & Follow-up Scheduling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#eceef0] text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#002046] block">Referral Target Facility:</label>
                <input
                  type="text"
                  value={referralTarget}
                  onChange={(e) => setReferralTarget(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#c4c6cf] text-xs text-[#191c1e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#002046] block">Follow-up Date:</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#c4c6cf] text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#002046] block">Time (IST):</label>
                  <input
                    type="text"
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#c4c6cf] text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#eceef0] flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigateTo('assessment-result', 'push_back')}
                className="px-4 py-2 bg-white border border-[#c4c6cf] text-[#002046] text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                ← Return to Victim View
              </button>

              <button
                type="button"
                onClick={handleValidateAndCreatePlan}
                className="px-6 py-2.5 bg-[#002046] hover:bg-[#003366] text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Validate & Create Support Plan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Risk Trajectory Graph */}
      <RiskHistoryTrend
        history={currentCase.riskHistory}
        currentScore={currentCase.distressScore}
        currentRisk={currentCase.riskLevel}
      />

      {/* Full Reusable Lifecycle Timeline */}
      <CaseLifecycleTimeline timeline={currentCase.timeline} />
    </div>
  );
};
