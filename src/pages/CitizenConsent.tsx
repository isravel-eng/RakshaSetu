import React from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';

export const CitizenConsent: React.FC = () => {
  const { citizenProfile, updateCitizenProfile, setConsent, navigateTo } = useApp();

  const handleContinue = () => {
    if (!citizenProfile.consentDataSharing) return;
    setConsent(true);
    navigateTo('citizen-profile', 'push');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      <div className="flex items-center justify-between pb-6 border-b border-[#eceef0]">
        <div className="flex items-center gap-2 text-xs text-[#545f72]">
          <button
            onClick={() => navigateTo('citizen-login', 'push_back')}
            className="hover:text-[#002046] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Login</span>
          </button>
          <span>/</span>
          <span className="text-[#002046] font-semibold">Consent</span>
        </div>
        <span className="text-xs font-mono font-bold bg-[#d6e3ff] text-[#002046] px-2.5 py-1 rounded-full">
          Step 1 of 5
        </span>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-[#c4c6cf] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002046] text-2xl">policy</span>
            <h1 className="text-2xl font-bold text-[#002046] tracking-tight">Consent & Data Protection</h1>
          </div>
          <p className="text-sm text-[#545f72] leading-relaxed">
            Before we collect your profile or screening responses, please confirm you understand how RakshaSetu uses this
            information for clinical triage.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-2 text-xs text-[#44474e] leading-relaxed">
          <p>
            Responses are used only to estimate distress severity and to connect you with certified Tele-MANAS / DMHP
            personnel. You may use Anonymous Mode on the next screen. You may stop at any time.
          </p>
          <p>
            Data handling follows Tele-MANAS clinical guidelines and the Digital Personal Data Protection Act (DPDPA).
            Zero commercial monetization.
          </p>
        </div>

        <EthicsBanner type="ai-preliminary" />

        <label className="flex items-start gap-3 cursor-pointer text-xs text-[#44474e]">
          <input
            id="milestone-consent-checkbox"
            type="checkbox"
            checked={citizenProfile.consentDataSharing}
            onChange={(e) => updateCitizenProfile({ consentDataSharing: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded text-[#002046] border-[#c4c6cf] focus:ring-[#002046]"
          />
          <span>
            I consent to the processing of my responses by certified mental health professionals under the Tele-MANAS
            clinical guidelines and the Digital Personal Data Protection Act (DPDPA).
          </span>
        </label>

        <div className="pt-6 border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            id="consent-back-btn"
            onClick={() => navigateTo('citizen-login', 'push_back')}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#74777f] text-[#002046] font-semibold text-sm rounded-lg hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back</span>
          </button>
          <button
            id="consent-continue-btn"
            onClick={handleContinue}
            disabled={!citizenProfile.consentDataSharing}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#002046] hover:bg-[#1b365d] text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Continue to Profile</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
