import React from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';

export const ScreeningIntro: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between pb-6 border-b border-[#eceef0]">
        <div className="flex items-center gap-2 text-xs text-[#545f72]">
          <button
            onClick={() => navigateTo('public-support', 'push_back')}
            className="hover:text-[#002046] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-[#002046] font-semibold">Screening Introduction</span>
        </div>
        <span className="text-xs font-mono font-bold bg-[#d6e3ff] text-[#002046] px-2.5 py-1 rounded-full">
          Step 2 of 3
        </span>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-[#c4c6cf] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002046] text-3xl">psychology_alt</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#002046] tracking-tight">
              Screening Introduction & Guidelines
            </h1>
          </div>
          <p className="text-sm text-[#545f72] leading-relaxed">
            This confidential assessment helps understand the nature and severity of the distress you may be experiencing.
            You can chat naturally with our assessment companion (OpenAI-powered conversation, scored by the RakshaSetu ML
            engine) or use the clinically validated public health screening instruments (PHQ-4 & GAD-2) adapted for India.
          </p>
        </div>

        {/* 4 Pillars of the Questionnaire */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#002046] text-white flex items-center justify-center text-xs font-bold shrink-0">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#002046]">Emotional & Mood State</h3>
              <p className="text-xs text-[#545f72] mt-0.5">
                Evaluation of emotional heaviness, anxiety levels, and feelings of nervousness over the past 2 weeks.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#002046] text-white flex items-center justify-center text-xs font-bold shrink-0">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#002046]">Sleep & Somatic Markers</h3>
              <p className="text-xs text-[#545f72] mt-0.5">
                Impact on sleep patterns, cognitive fatigue, appetite changes, and daily energy reserves.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#002046] text-white flex items-center justify-center text-xs font-bold shrink-0">
              3
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#002046]">Stressors & Support Network</h3>
              <p className="text-xs text-[#545f72] mt-0.5">
                Identification of key situational triggers (financial, academic, family) and social connection buffers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center text-xs font-bold shrink-0">
              4
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#ba1a1a]">Safety & Emergency Check</h3>
              <p className="text-xs text-[#545f72] mt-0.5">
                Safety evaluation with immediate priority routing to 24x7 clinical counsellors if acute distress is detected.
              </p>
            </div>
          </div>
        </div>

        {/* Reassurance Callout Box */}
        <div className="p-4 rounded-lg bg-[#d5e0f7]/40 border border-[#87a0cd]/40 flex items-start gap-3">
          <span className="material-symbols-outlined text-[#002046] text-xl shrink-0 mt-0.5">privacy_tip</span>
          <div className="text-xs text-[#1b365d] space-y-1">
            <p className="font-semibold">Your privacy is strictly guarded.</p>
            <p>
              Your responses are encrypted and accessible only to authorized clinical psychologists for the purpose of
              support delivery. You may stop or skip any question at any moment.
            </p>
          </div>
        </div>

        <EthicsBanner type="ai-preliminary" />

        {/* Assessment Mode Selection - EXACT SPEC LABELS */}
        <div className="pt-6 border-t border-[#eceef0]">
          <h3 className="text-sm font-bold text-[#002046]">How would you like to complete your assessment?</h3>
          <p className="text-xs text-[#545f72] mt-0.5">Both modes feed the same RakshaSetu ML risk engine and human counsellor review.</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1: Conversational Chatbot (OpenAI) */}
            <button
              id="begin-assessment-btn"
              onClick={() => navigateTo('screening-chat', 'push')}
              className="p-5 rounded-xl border-2 border-[#002046] bg-[#f0f9ff] hover:bg-[#d6e3ff]/40 hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#002046] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">forum</span>
                </span>
                <div>
                  <h4 className="font-bold text-sm text-[#002046]">OpenAI Conversational Chatbot</h4>
                  <p className="text-[11px] text-[#aec7f7]">Type or speak 🎤 voicebot</p>
                </div>
                <span className="material-symbols-outlined text-lg text-[#002046] ml-auto group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </div>
              <p className="text-xs text-[#545f72] mt-3 leading-relaxed">
                A short, adaptive natural-language conversation (text or voice) conducted by OpenAI. It asks one question at
                a time, extracts the structured signals, and the RakshaSetu ML engine scores the risk.
              </p>
            </button>

            {/* Option 2: 4-Step Clinical Screening */}
            <button
              id="use-standard-questionnaire-btn"
              onClick={() => navigateTo('screening', 'push')}
              className="p-5 rounded-xl border-2 border-[#c4c6cf] bg-white hover:bg-[#f2f4f6] hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#d6e3ff] text-[#002046] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">list_alt</span>
                </span>
                <div>
                  <h4 className="font-bold text-sm text-[#002046]">4-Step Clinical Screening</h4>
                  <p className="text-[11px] text-[#545f72]">PHQ-4 & GAD-2 questionnaire</p>
                </div>
                <span className="material-symbols-outlined text-lg text-[#002046] ml-auto group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </div>
              <p className="text-xs text-[#545f72] mt-3 leading-relaxed">
                The clinically validated public health screening instrument (PHQ-4 & GAD-2) adapted for India — a structured
                4-step questionnaire reviewed before submission.
              </p>
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <button
              id="screening-intro-back-btn"
              onClick={() => navigateTo('public-support', 'push_back')}
              className="px-5 py-2.5 bg-white border border-[#74777f] text-[#002046] font-semibold text-sm rounded-lg hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
