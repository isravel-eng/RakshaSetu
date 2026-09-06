import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';
import {
  createCase,
  ensureCitizenSession,
  predictionToRiskResult,
  submitAssessment,
} from '../services/backendApi';

export const ScreeningReview: React.FC = () => {
  const {
    citizenProfile,
    screeningAnswers,
    submitScreening,
    updateCase,
    navigateTo,
  } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    try {
      // The existing phone/OTP UX is preserved, while the backend receives a
      // real authenticated citizen session behind the scenes.
      const session = await ensureCitizenSession(citizenProfile);
      const backendCase = await createCase(session.token, citizenProfile, 'TRIAL');
      const backendResponse = await submitAssessment(
        session.token,
        backendCase.id,
        screeningAnswers,
      );
      const remoteRisk = predictionToRiskResult(backendResponse.prediction);

      if (!remoteRisk) {
        throw new Error('The ML service returned no prediction.');
      }

      // Keep the polished frontend's existing case/result UI, but replace the
      // locally calculated risk values with the real Render ML response.
      const submittedCase = submitScreening();
      updateCase(submittedCase.caseId, {
        distressScore: remoteRisk.score,
        riskLevel: remoteRisk.riskLevel as typeof submittedCase.riskLevel,
        priority: remoteRisk.priority as typeof submittedCase.priority,
        emergencyFlag: remoteRisk.emergencyFlag,
        status: remoteRisk.emergencyFlag ? 'IN_REVIEW' : 'PENDING_REVIEW',
        aiAssessment: {
          ...submittedCase.aiAssessment,
          distressCategory: remoteRisk.distressCategory,
          confidenceScore: remoteRisk.confidenceScore,
          confidenceLevel: remoteRisk.confidence as typeof submittedCase.aiAssessment.confidenceLevel,
          priority: remoteRisk.priority as typeof submittedCase.aiAssessment.priority,
          emergencyFlag: remoteRisk.emergencyFlag,
          recommendedTier: remoteRisk.recommendedTier,
          recommendedAction: remoteRisk.recommendedAction,
          keyRiskFactors: remoteRisk.contributingFactors,
          protectiveFactors: remoteRisk.protectiveFactors,
          explanation: remoteRisk.explanation,
          suggestedInterventions: submittedCase.aiAssessment.suggestedInterventions,
          requiresHumanReview: remoteRisk.requiresHumanReview,
          disclaimer: remoteRisk.disclaimer,
        },
        riskHistory: submittedCase.riskHistory.map((entry, index) => index === 0
          ? {
              ...entry,
              score: remoteRisk.score,
              riskLevel: remoteRisk.riskLevel as typeof entry.riskLevel,
              priority: remoteRisk.priority as typeof entry.priority,
              contributingFactors: remoteRisk.contributingFactors,
              protectiveFactors: remoteRisk.protectiveFactors,
              reason: `Render ML prediction from model ${backendResponse.prediction?.model_version || 'unknown'}.`,
            }
          : entry),
      });

      sessionStorage.setItem('rakshasetu.backendToken', session.token);
      sessionStorage.setItem('rakshasetu.backendCaseId', String(backendCase.id));
      sessionStorage.setItem('rakshasetu.backendCaseNumber', backendCase.case_number);
      sessionStorage.setItem('rakshasetu.lastPrediction', JSON.stringify(backendResponse.prediction));

      navigateTo('assessment-result', 'push');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to submit screening.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
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
            Confirm your responses below. Submitting sends the assessment through the Render backend and trained ML service to
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

        {error && (
          <div className="p-3 rounded-lg border border-[#ba1a1a]/30 bg-[#ffdad6] text-[#93000a] text-xs font-medium" role="alert">
            <strong>Submission failed:</strong> {error}
          </div>
        )}

        <div className="pt-6 border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            id="review-back-btn"
            onClick={() => navigateTo('screening', 'push_back')}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#74777f] text-[#002046] font-semibold text-sm rounded-lg hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            disabled={isSubmitting}
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Edit Screening</span>
          </button>
          <button
            id="submit-screening-review-btn"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 py-3 bg-[#002046] hover:bg-[#1b365d] text-white font-bold text-sm sm:text-base rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            <span className="material-symbols-outlined text-lg">{isSubmitting ? 'progress_activity' : 'send'}</span>
            <span>{isSubmitting ? 'Processing assessment…' : 'Submit Screening'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
