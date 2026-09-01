import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';

export const ScreeningFlow: React.FC = () => {
  const {
    screeningAnswers,
    updateScreeningAnswers,
    submitScreening,
    navigateTo,
    navigateBack
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);

  const handleStep4Completion = () => {
    submitScreening();
    navigateTo('assessment-result', 'push');
  };

  const stepTitles = [
    'Mood & Emotional State',
    'Sleep & Physical Symptoms',
    'Life Stressors & Support',
    'Safety & Final Review'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Top Step Breadcrumb & Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#eceef0] gap-3">
        <div className="flex items-center gap-2 text-xs text-[#545f72]">
          <button
            onClick={() => navigateTo('screening-intro', 'push_back')}
            className="hover:text-[#002046] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Screening Intro</span>
          </button>
          <span>/</span>
          <span className="text-[#002046] font-semibold">
            Screening | Step {currentStep} of 4: {stepTitles[currentStep - 1]}
          </span>
        </div>

        {/* 4 Step Progress Pills */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentStep === step
                  ? 'w-8 bg-[#002046]'
                  : currentStep > step
                  ? 'w-6 bg-[#aec7f7]'
                  : 'w-4 bg-[#e0e3e5]'
              }`}
              title={`Jump to Step ${step}: ${stepTitles[step - 1]}`}
              aria-label={`Step ${step}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-[#c4c6cf] shadow-sm p-6 sm:p-8">
        {/* Step 1: Mood & Emotional State */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#002046] text-2xl">sentiment_dissatisfied</span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#002046]">Step 1: Mood & Emotional State</h2>
              </div>
              <p className="text-xs sm:text-sm text-[#545f72]">
                These questions reflect standardized PHQ-4 psychological screening metrics.
              </p>
            </div>

            {/* Overall Distress Level Scale */}
            <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-[#002046]">
                  On a scale of 0 to 10, how intense is your emotional distress right now?
                </label>
                <span className="px-3 py-1 bg-[#002046] text-white font-mono font-bold text-sm rounded-lg">
                  {screeningAnswers.emotionalDistress} / 10
                </span>
              </div>
              <input
                id="emotional-distress-slider"
                type="range"
                min="0"
                max="10"
                value={screeningAnswers.emotionalDistress}
                onChange={(e) => updateScreeningAnswers({ emotionalDistress: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-[#d6e3ff] rounded-lg appearance-none cursor-pointer accent-[#002046]"
              />
              <div className="flex justify-between text-[11px] text-[#74777f]">
                <span>0 (Calm / Manageable)</span>
                <span>5 (Moderate Stress)</span>
                <span className="text-[#ba1a1a] font-semibold">10 (Extreme Overwhelm)</span>
              </div>
            </div>

            {/* Distress Frequency */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#191c1e]">
                Over the last 2 weeks, how often have you felt down, depressed, or hopeless?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Not at all',
                  'Several days (1-3 days/week)',
                  'More than half the days',
                  'Nearly every day (Past 2+ weeks)'
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateScreeningAnswers({ distressFrequency: option })}
                    className={`p-3 text-left text-xs rounded-lg border transition-all cursor-pointer ${
                      screeningAnswers.distressFrequency === option
                        ? 'bg-[#d6e3ff]/40 border-[#002046] text-[#002046] font-semibold ring-1 ring-[#002046]'
                        : 'bg-[#f7f9fb] border-[#c4c6cf]/80 text-[#44474e] hover:bg-[#eceef0]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Feeling Overwhelmed */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#191c1e]">
                How would you describe your ability to cope with day-to-day demands right now?
              </label>
              <div className="space-y-2">
                {[
                  'Managing well with minimal distress',
                  'Struggling occasionally but functioning',
                  'Severely overwhelmed, unable to cope with daily tasks',
                  'Paralyzed by anxiety and racing thoughts'
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateScreeningAnswers({ feelingOverwhelmed: option })}
                    className={`w-full p-3 text-left text-xs rounded-lg border transition-all cursor-pointer ${
                      screeningAnswers.feelingOverwhelmed === option
                        ? 'bg-[#d6e3ff]/40 border-[#002046] text-[#002046] font-semibold ring-1 ring-[#002046]'
                        : 'bg-[#f7f9fb] border-[#c4c6cf]/80 text-[#44474e] hover:bg-[#eceef0]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Sleep & Physical Symptoms */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#002046] text-2xl">bedtime</span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#002046]">Step 2: Sleep & Physical Symptoms</h2>
              </div>
              <p className="text-xs sm:text-sm text-[#545f72]">
                Somatic factors strongly influence mental health triage and recovery planning.
              </p>
            </div>

            {/* Sleep Disruption */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#191c1e]">
                How has your sleep pattern been affected in recent weeks?
              </label>
              <div className="space-y-2">
                {[
                  'Normal, restful sleep (7-8 hours)',
                  'Intermittent awakenings / 5-6 hours light sleep',
                  'Severe insomnia (< 3 hours erratic sleep nightly)',
                  'Excessive sleeping (> 10 hours) with no refreshed feeling'
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateScreeningAnswers({ sleepDisturbance: option })}
                    className={`w-full p-3 text-left text-xs rounded-lg border transition-all cursor-pointer ${
                      screeningAnswers.sleepDisturbance === option
                        ? 'bg-[#d6e3ff]/40 border-[#002046] text-[#002046] font-semibold ring-1 ring-[#002046]'
                        : 'bg-[#f7f9fb] border-[#c4c6cf]/80 text-[#44474e] hover:bg-[#eceef0]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy & Fatigue */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#191c1e]">
                Daily Energy & Fatigue Levels:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Normal energy reserves',
                  'Mild midday tiredness',
                  'Moderate physical exhaustion',
                  'Extreme fatigue and brain fog throughout the day'
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateScreeningAnswers({ energyFatigue: option })}
                    className={`p-3 text-left text-xs rounded-lg border transition-all cursor-pointer ${
                      screeningAnswers.energyFatigue === option
                        ? 'bg-[#d6e3ff]/40 border-[#002046] text-[#002046] font-semibold ring-1 ring-[#002046]'
                        : 'bg-[#f7f9fb] border-[#c4c6cf]/80 text-[#44474e] hover:bg-[#eceef0]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Appetite Changes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#191c1e]">
                Appetite or Eating Habit Changes:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'No significant change',
                  'Mild drop in appetite',
                  'Significant reduction in food intake',
                  'Stress eating or erratic binge patterns'
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateScreeningAnswers({ appetiteChanges: option })}
                    className={`p-3 text-left text-xs rounded-lg border transition-all cursor-pointer ${
                      screeningAnswers.appetiteChanges === option
                        ? 'bg-[#d6e3ff]/40 border-[#002046] text-[#002046] font-semibold ring-1 ring-[#002046]'
                        : 'bg-[#f7f9fb] border-[#c4c6cf]/80 text-[#44474e] hover:bg-[#eceef0]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Life Stressors & Support */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#002046] text-2xl">hub</span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#002046]">Step 3: Life Stressors & Support Network</h2>
              </div>
              <p className="text-xs sm:text-sm text-[#545f72]">
                Identifying contextual pressures allows clinical psychologists to craft targeted relief plans.
              </p>
            </div>

            {/* Primary Stressor */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#191c1e]">
                What is the primary factor driving your stress right now?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Acute financial pressure and career uncertainty',
                  'Academic exams and competitive pressure',
                  'Family conflict or marital discord',
                  'Chronic medical illness / Health anxiety',
                  'Grief, loss of a loved one, or bereavement',
                  'Social isolation and feeling disconnected'
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateScreeningAnswers({ primaryStressor: option })}
                    className={`p-3 text-left text-xs rounded-lg border transition-all cursor-pointer ${
                      screeningAnswers.primaryStressor === option
                        ? 'bg-[#d6e3ff]/40 border-[#002046] text-[#002046] font-semibold ring-1 ring-[#002046]'
                        : 'bg-[#f7f9fb] border-[#c4c6cf]/80 text-[#44474e] hover:bg-[#eceef0]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Support Level */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#191c1e]">
                Your Current Social & Family Support System:
              </label>
              <div className="space-y-2">
                {[
                  'Strong, active support (trusted family/friends available)',
                  'Moderate support (family present but hesitant to open up)',
                  'Minimal / living alone in Chennai (hesitant to disclose stress)',
                  'Completely isolated / No one to turn to locally'
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateScreeningAnswers({ socialSupportLevel: option })}
                    className={`w-full p-3 text-left text-xs rounded-lg border transition-all cursor-pointer ${
                      screeningAnswers.socialSupportLevel === option
                        ? 'bg-[#d6e3ff]/40 border-[#002046] text-[#002046] font-semibold ring-1 ring-[#002046]'
                        : 'bg-[#f7f9fb] border-[#c4c6cf]/80 text-[#44474e] hover:bg-[#eceef0]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Safety & Crisis Check */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a] text-2xl">shield_with_heart</span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#ba1a1a]">Step 4: Safety & Emotional Security Check</h2>
              </div>
              <p className="text-xs sm:text-sm text-[#545f72]">
                Your honest response ensures we trigger the correct level of emergency support if needed.
              </p>
            </div>

            {/* Self Harm / Crisis Marker */}
            <div className="p-4 rounded-lg bg-[#fff0f0] border border-[#ba1a1a]/40 space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-[#ba1a1a]">
                Have you had thoughts of harming yourself or feeling that life is not worth living?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: 'none', label: 'No thoughts of self-harm' },
                  { value: 'passive', label: 'Passive thoughts (e.g. "I wish I could sleep and not wake up")' },
                  { value: 'frequent', label: 'Frequent or intense distressing thoughts' },
                  { value: 'immediate', label: 'Immediate thoughts with intention to act' }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateScreeningAnswers({ selfHarmThoughts: item.value })}
                    className={`p-3 text-left text-xs rounded-lg border transition-all cursor-pointer ${
                      screeningAnswers.selfHarmThoughts === item.value
                        ? 'bg-[#ffdad6] border-[#ba1a1a] text-[#93000a] font-bold ring-1 ring-[#ba1a1a]'
                        : 'bg-white border-[#c4c6cf] text-[#44474e] hover:bg-[#eceef0]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Freeform Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#191c1e]">
                  Describe in your own words what you are experiencing (Optional):
                </label>
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                  className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 border transition-colors cursor-pointer ${
                    isRecordingVoice
                      ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] animate-pulse'
                      : 'bg-[#f2f4f6] text-[#002046] border-[#c4c6cf]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">mic</span>
                  <span>{isRecordingVoice ? 'Recording Audio...' : 'Record Voice Note'}</span>
                </button>
              </div>
              <textarea
                id="screening-additional-notes"
                rows={3}
                value={screeningAnswers.additionalNotes}
                onChange={(e) => updateScreeningAnswers({ additionalNotes: e.target.value })}
                placeholder="Share any specific circumstances, symptoms, or concerns you want the counsellor to know..."
                className="w-full p-3 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-xs text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
              />
            </div>

            {/* Ethics Disclosure */}
            <EthicsBanner type="ai-preliminary" />
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Back Button - EXACT SPEC BEHAVIOR */}
          <button
            id="screening-back-btn"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                navigateTo('screening-intro', 'push_back');
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#74777f] text-[#002046] font-semibold text-sm rounded-lg hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back</span>
          </button>

          {/* Forward / Step 4 CTA Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentStep < 4 ? (
              <button
                id="continue-to-step-4-btn"
                onClick={() => {
                  if (currentStep === 3) {
                    setCurrentStep(4);
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#002046] hover:bg-[#1b365d] text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentStep === 3 ? 'Continue to Step 4' : `Next: ${stepTitles[currentStep]}`}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            ) : (
              /* Step 4 Complete -> Assessment Result */
              <button
                id="submit-screening-btn"
                onClick={handleStep4Completion}
                className="w-full sm:w-auto px-7 py-3 bg-[#002046] hover:bg-[#1b365d] text-white font-bold text-sm sm:text-base rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">fact_check</span>
                <span>Generate Assessment & View Results</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
