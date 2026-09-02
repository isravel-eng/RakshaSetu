import React from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';

export const ScreeningReview: React.FC = () => {
  const { citizenProfile, screeningAnswers, submitScreening, navigateTo } = useApp();

  const handleSubmit = () => {
    submitScreening();
    navigateTo('assessment-result', 'push');
  };

  const rows: { label: string; value: string }[] = [
    { label: 'Name', value: citizenProfile.anonymousMode ? 'Anonymous Citizen' : citizenProfile.fullName },
    { label: 'Phone', value: citizenProfile.anonymousMode ? 'Protected Token' : citizenProfile.phone },
    { label: 'Location', value: `${citizenProfile.district}, ${citizenProfile.state}` },
    { label: 'Distress (0–10)', value: String(screeningAnswers.emotionalDistress) },
    { label: 'Frequency', value: screeningAnswers.distressFrequency },
    { label: 'Coping', value: screeningAnswers.feelingOverwhelmed },
    { label: 'Sleep', value: screeningAnswers.sleepDisturbance },
    { label: 'Energy', value: screeningAnswers.energyFatigue },
    { label: 'Appetite', value: screeningAnswers.appetiteChanges },
    { label: 'Primary stressor', value: screeningAnswers.primaryStressor },
    { label: 'Social support', value: screeningAnswers.socialSupportLevel },
    { label: 'Safety check', value: screeningAnswers.selfHarmThoughts },
    { label: 'Notes', value: screeningAnswers.additionalNotes || '—' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      <div className="flex items-center justify-between pb-6 border-b border-[#eceef0]">
        <div className="flex items-center gap-2 text-xs text-[#545f72]">
          <button
            onClick={() => navigateTo('screening', 'push_back')}
            className="hover:text-[#002046] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Screening</span>
          </button>
          <span>/</span>
          <span className="text-[#002046] font-semibold">Review & Submit</span>
        </div>
        <span className="text-xs font-mono font-bold bg-[#d6e3ff] text-[#002046] px-2.5 py-1 rounded-full">
          Step 5 of 5
        </span>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-[#c4c6cf] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002046] text-2xl">fact_check</span>
            <h1 className="text-2xl font-bold text-[#002046] tracking-tight">Review Screening Before Submit</h1>
          </div>
          <p className="text-sm text-[#545f72] leading-relaxed">
            Confirm your responses below. Submitting processes your screening through our deterministic AI Risk Engine to
            provide an immediate preliminary triage summary and route your case for certified human clinical review.
          </p>
        </div>

        <div className="divide-y divide-[#eceef0] border border-[#e0e3e5] rounded-lg overflow-hidden">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 px-4 py-3 bg-[#f7f9fb]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#545f72]">{row.label}</span>
              <span className="sm:col-span-2 text-sm text-[#191c1e]">{row.value}</span>
            </div>
          ))}
        </div>

        <EthicsBanner type="ai-preliminary" />

        <div className="pt-6 border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            id="review-back-btn"
            onClick={() => navigateTo('screening', 'push_back')}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#74777f] text-[#002046] font-semibold text-sm rounded-lg hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Edit Screening</span>
          </button>
          <button
            id="submit-screening-review-btn"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-7 py-3 bg-[#002046] hover:bg-[#1b365d] text-white font-bold text-sm sm:text-base rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">send</span>
            <span>Submit Screening</span>
          </button>
        </div>
      </div>
    </div>
  );
};
