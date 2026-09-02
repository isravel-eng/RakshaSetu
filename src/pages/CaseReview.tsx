import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';
import { RiskLevel, CaseStatus } from '../types';

export const CaseReview: React.FC = () => {
  const {
    currentCase,
    validateCaseByCounsellor,
    navigateTo,
    cases,
    setCurrentCaseId
  } = useApp();

  const [clinicalNotes, setClinicalNotes] = useState<string>(
    currentCase.counsellorReview.clinicalNotes ||
      'Citizen presents with high situational distress (78/100) aggravated by 3 weeks of acute sleep deprivation (<3 hours) and academic-financial uncertainty. Patient expresses passive feelings of helplessness with no immediate suicidal intent. Agreed to a structured 3-session tele-counselling plan and referral to DMHP outpatient consultation at RGGGH Chennai.'
  );
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>(
    currentCase.counsellorReview.humanValidatedRisk || currentCase.riskLevel
  );
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>(
    currentCase.counsellorReview.interventionPlan.length > 0
      ? currentCase.counsellorReview.interventionPlan
      : [
          'Tele-counselling session (1-on-1 scheduled)',
          'District Mental Health Centre referral (Chennai)',
          'Emergency SOS lifeline protocol briefing'
        ]
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

  const handleValidate = (newStatus: CaseStatus = 'FOLLOW_UP_SCHEDULED') => {
    validateCaseByCounsellor(currentCase.caseId, {
      clinicalNotes,
      humanValidatedRisk: selectedRisk,
      interventionPlan: selectedInterventions,
      referralTarget,
      followUpDate,
      followUpTime,
      isHumanValidated: true,
      newStatus
    });
    setValidationSuccess(true);
  };

  const toggleIntervention = (item: string) => {
    if (selectedInterventions.includes(item)) {
      setSelectedInterventions(selectedInterventions.filter((i) => i !== item));
    } else {
      setSelectedInterventions([...selectedInterventions, item]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-6">
      {/* Top Header with Breadcrumbs and Quick Case Switcher */}
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
            <span className="text-[#002046] font-semibold">Case Review: {currentCase.caseId}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#002046] tracking-tight flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#002046] text-3xl">rate_review</span>
            <span>Case Review: {currentCase.caseId}</span>
            <span
              className={`text-xs font-mono px-2.5 py-1 rounded font-bold ${
                currentCase.riskLevel === 'CRITICAL'
                  ? 'bg-[#ba1a1a] text-white'
                  : currentCase.riskLevel === 'HIGH'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              AI RISK: {currentCase.riskLevel} ({currentCase.distressScore}/100)
            </span>
          </h1>
        </div>

        {/* Case Queue Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#545f72] font-semibold">Queue:</span>
          <div className="flex items-center gap-1.5">
            {cases.map((c) => (
              <button
                key={c.caseId}
                onClick={() => setCurrentCaseId(c.caseId)}
                className={`text-xs px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                  currentCase.caseId === c.caseId
                    ? 'bg-[#002046] text-white font-bold'
                    : 'bg-[#e0e3e5] text-[#191c1e] hover:bg-[#c4c6cf]'
                }`}
              >
                {c.caseId}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Human in the Loop Ethics Banner */}
      <EthicsBanner type="human-validation" />

      {/* Emergency Alert Banner if Emergency Flag is Active */}
      {(currentCase.emergencyFlag || currentCase.aiAssessment.emergencyFlag || currentCase.riskLevel === 'CRITICAL') && (
        <div className="p-4 bg-[#fff0f0] border-2 border-[#ba1a1a] rounded-xl flex items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ba1a1a] text-3xl">e911_emergency</span>
            <div>
              <h4 className="font-bold text-sm text-[#ba1a1a] uppercase tracking-wide flex items-center gap-2">
                <span>Critical Crisis Alert: Immediate Clinical Outreach Required</span>
                <span className="text-[10px] bg-[#ba1a1a] text-white px-2 py-0.5 rounded font-mono font-bold">
                  EMERGENCY TIER-1
                </span>
              </h4>
              <p className="text-xs text-[#93000a] mt-0.5">
                Acute self-harm/crisis markers detected. Initiate immediate tele-crisis triage protocol or physical dispatch link.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-[#ba1a1a] text-white px-3 py-1 rounded font-bold shrink-0">
            FLAGGED: IMMEDIATE
          </span>
        </div>
      )}

      {/* Validation Status Notification if already validated */}
      {validationSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-700 text-2xl">verified</span>
            <div>
              <h4 className="font-bold text-sm text-emerald-900">
                Human Clinical Validation Completed by Dr. Priya Raman
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Status: <strong>{currentCase.status}</strong> • Validated Risk Level:{' '}
                <strong>{selectedRisk}</strong> • Referral: <strong>{referralTarget}</strong>
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded font-bold shrink-0">
            RECORD SIGNED
          </span>
        </div>
      )}

      {/* Main 2-Column Clinical Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Citizen Screening & AI Explanation (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Citizen Details Card */}
          <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#eceef0] pb-2.5">
              <h3 className="font-bold text-sm text-[#002046] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">person</span>
                <span>Citizen Intake Profile</span>
              </h3>
              <span className="text-xs font-mono text-[#545f72]">{currentCase.district}, {currentCase.state}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-[#74777f] block text-[11px]">Name:</span>
                <span className="font-semibold text-[#191c1e]">{currentCase.citizenName}</span>
              </div>
              <div>
                <span className="text-[#74777f] block text-[11px]">Contact:</span>
                <span className="font-mono text-[#191c1e]">{currentCase.citizenPhone}</span>
              </div>
              <div>
                <span className="text-[#74777f] block text-[11px]">Clinical Scale:</span>
                <span className="font-semibold text-[#002046]">{currentCase.screeningSummary.phqScore}</span>
              </div>
              <div>
                <span className="text-[#74777f] block text-[11px]">Anxiety Index:</span>
                <span className="font-semibold text-[#002046]">{currentCase.screeningSummary.gadScore}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#eceef0] text-xs space-y-1.5">
              <div>
                <span className="text-[#74777f] text-[11px] block">Primary Trigger:</span>
                <span className="text-[#191c1e] font-medium">{currentCase.screeningSummary.primaryTrigger}</span>
              </div>
              <div>
                <span className="text-[#74777f] text-[11px] block">Sleep Disruption:</span>
                <span className="text-[#ba1a1a] font-medium">{currentCase.screeningSummary.sleepImpact}</span>
              </div>
            </div>
          </div>

          {/* AI Diagnostic Explanation Card */}
          <div className="bg-[#f0f9ff] rounded-xl border border-[#aec7f7] shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#aec7f7]/60 pb-2.5">
              <h3 className="font-bold text-sm text-[#002046] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#002046]">psychology</span>
                <span>AI Clinical Explanation</span>
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono bg-[#002046] text-white px-2 py-0.5 rounded font-bold">
                  {currentCase.priority || currentCase.aiAssessment.priority || 'URGENT'}
                </span>
                <span className="text-xs font-mono bg-[#d6e3ff] text-[#002046] px-2 py-0.5 rounded font-bold">
                  Confidence: {currentCase.aiAssessment.confidenceScore}%
                </span>
              </div>
            </div>

            <p className="text-xs text-[#1b365d] leading-relaxed">
              {currentCase.aiAssessment.explanation}
            </p>

            {/* AI Recommendation Box */}
            <div className="p-3 rounded-lg bg-white/80 border border-[#aec7f7] text-xs space-y-1">
              <span className="font-bold text-[#002046] block">
                {currentCase.aiAssessment.recommendedTier}
              </span>
              <p className="text-[#545f72] text-[11px]">
                {currentCase.aiAssessment.recommendedAction ||
                  'Specialist clinical triage and structured psychological support recommended.'}
              </p>
            </div>

            {/* Key Risk Factors */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider block">
                Identified Risk Factors:
              </span>
              <ul className="space-y-1 text-xs text-[#44474e]">
                {currentCase.aiAssessment.keyRiskFactors.map((rf, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#ba1a1a] font-bold">•</span>
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Protective Factors */}
            <div className="space-y-1 pt-1 border-t border-[#aec7f7]/40">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Protective Factors:
              </span>
              <ul className="space-y-1 text-xs text-[#44474e]">
                {currentCase.aiAssessment.protectiveFactors.map((pf, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{pf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Interventions */}
            {currentCase.aiAssessment.suggestedInterventions && currentCase.aiAssessment.suggestedInterventions.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-[#aec7f7]/40">
                <span className="text-[11px] font-bold text-[#002046] uppercase tracking-wider block">
                  AI Suggested Interventions:
                </span>
                <ul className="space-y-1 text-[11px] text-[#545f72]">
                  {currentCase.aiAssessment.suggestedInterventions.map((si, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#002046] font-bold">→</span>
                      <span>{si}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Human Counsellor Validation & Intervention Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-xl border border-[#002046]/30 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-[#eceef0] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#002046] flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-[#002046]">assignment_ind</span>
                  <span>Human Counsellor Review & Action Protocol</span>
                </h3>
                <p className="text-xs text-[#545f72] mt-0.5">
                  Assigned Clinical Psychologist: <strong>Dr. Priya Raman (TN-PSY-8492)</strong>
                </p>
              </div>
              <span className="text-[11px] bg-[#d6e3ff] text-[#002046] px-2 py-1 rounded font-mono font-bold">
                MANDATORY REVIEW
              </span>
            </div>

            {/* Risk Level Validation / Override */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#002046] uppercase tracking-wider">
                Human Validated Clinical Severity:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['MILD', 'MODERATE', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedRisk(level)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedRisk === level
                        ? level === 'CRITICAL'
                          ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] ring-2 ring-[#ba1a1a]'
                          : level === 'HIGH'
                          ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-600'
                          : 'bg-[#002046] text-white border-[#002046] ring-2 ring-[#002046]'
                        : 'bg-[#f7f9fb] border-[#c4c6cf] text-[#44474e] hover:bg-[#eceef0]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Assessment Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002046] uppercase tracking-wider" htmlFor="counsellor-notes">
                Clinical Assessment & Intake Notes:
              </label>
              <textarea
                id="counsellor-notes"
                rows={4}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Enter clinical observations, MSE findings, risk mitigation rationale..."
                className="w-full p-3 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-xs text-[#191c1e] leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
              />
            </div>

            {/* Intervention Selection Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#002046] uppercase tracking-wider">
                Prescribed Interventions:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'Tele-counselling session (1-on-1 scheduled)',
                  'District Mental Health Centre referral (Chennai)',
                  'Emergency SOS lifeline protocol briefing',
                  'Mobile Crisis Outreach Team Dispatch',
                  'Psychiatric OPD Intake (RGGGH Chennai)',
                  'Caregiver Psychoeducation & Support Link'
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-start gap-2 p-2 rounded bg-[#f7f9fb] border border-[#e0e3e5] cursor-pointer hover:bg-[#eceef0]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedInterventions.includes(item)}
                      onChange={() => toggleIntervention(item)}
                      className="mt-0.5 w-3.5 h-3.5 text-[#002046] rounded"
                    />
                    <span className="text-[#191c1e] text-[11px] leading-tight">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Referral Facility & Follow-up Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#191c1e] mb-1" htmlFor="referral-target-select">
                  Referral Facility (Chennai)
                </label>
                <select
                  id="referral-target-select"
                  value={referralTarget}
                  onChange={(e) => setReferralTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-xs text-[#191c1e]"
                >
                  <option value="Rajiv Gandhi Government General Hospital - DMHP Unit, Chennai">
                    Rajiv Gandhi Govt General Hospital - DMHP Unit
                  </option>
                  <option value="Institute of Mental Health (IMH) Kilpauk, Chennai">
                    Institute of Mental Health (IMH) Kilpauk
                  </option>
                  <option value="Government Stanley Medical College Hospital - Dept of Psychiatry">
                    Government Stanley Medical College Hospital
                  </option>
                  <option value="Tele-MANAS Tamil Nadu Hub (State Toll-Free Lifeline)">
                    Tele-MANAS Tamil Nadu Hub (State Tele-Counselling)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1" htmlFor="followup-date-input">
                  Follow-up Date
                </label>
                <input
                  id="followup-date-input"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-xs font-mono text-[#191c1e]"
                />
              </div>
            </div>

            {/* Clinical Action CTA Buttons */}
            <div className="pt-4 border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-[#74777f]">
                Decision authorized by <strong>TN-PSY-8492</strong>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="validate-case-btn"
                  onClick={() => handleValidate('FOLLOW_UP_SCHEDULED')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#002046] hover:bg-[#1b365d] text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Validate & Confirm Case Plan</span>
                </button>

                <button
                  id="escalate-emergency-btn"
                  onClick={() => handleValidate('ESCALATED')}
                  className="w-full sm:w-auto px-3.5 py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">e911_emergency</span>
                  <span>Escalate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cross-Hierarchy Navigation Bar */}
      <div className="p-4 bg-white rounded-xl border border-[#c4c6cf] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          id="back-to-district-dashboard-btn"
          onClick={() => navigateTo('district-dashboard', 'push_back')}
          className="w-full sm:w-auto px-4 py-2 bg-white border border-[#74777f] text-[#002046] font-semibold text-xs rounded-lg hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>District Dashboard | Chennai</span>
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            id="go-to-state-dashboard-btn"
            onClick={() => navigateTo('state-dashboard', 'push')}
            className="w-full sm:w-auto px-4 py-2 bg-[#d6e3ff] hover:bg-[#aec7f7] text-[#002046] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>State Dashboard (Tamil Nadu)</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>

          <button
            id="go-to-national-command-btn"
            onClick={() => navigateTo('national-command', 'push')}
            className="w-full sm:w-auto px-4 py-2 bg-[#002046] hover:bg-[#1b365d] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>National Command Center</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
