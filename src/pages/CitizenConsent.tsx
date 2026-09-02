import React from 'react';
import { useApp } from '../context/AppContext';
import { EthicsBanner } from '../components/EthicsBanner';

export const CitizenConsent: React.FC = () => {
  const {
    citizenProfile,
    updateCitizenProfile,
    setConsent,
    revokeConsent,
    hasConsented,
    navigateTo
  } = useApp();

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
          <span className="text-[#002046] font-semibold">Consent & NHAA Authorization</span>
        </div>
        <span className="text-xs font-mono font-bold bg-[#d6e3ff] text-[#002046] px-2.5 py-1 rounded-full">
          Step 1 of 5
        </span>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-[#c4c6cf] shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002046] text-3xl">verified_user</span>
            <div>
              <h1 className="text-2xl font-bold text-[#002046] tracking-tight">
                Victim Consent & NHAA Case Data Authorization
              </h1>
              <p className="text-xs text-[#545f72] font-mono mt-0.5">
                Digital Personal Data Protection Act (DPDPA 2023) Compliant Intake
              </p>
            </div>
          </div>
          <p className="text-sm text-[#44474e] leading-relaxed pt-2">
            RakshaSetu operates as a confidential victim support and continuous case monitoring bridge.
            To provide continuous distress monitoring when case milestones or hearing dates change, we request your explicit consent.
          </p>
        </div>

        {/* Primary Authorization Block */}
        <div className="p-4 bg-blue-50/80 border-2 border-blue-200 rounded-xl space-y-3">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#002046] text-2xl mt-0.5">account_balance</span>
            <div>
              <h3 className="font-bold text-sm text-[#002046]">
                NHAA Integrated Case Access Authorization
              </h3>
              <p className="text-xs text-[#1b365d] leading-relaxed mt-1 font-medium">
                &ldquo;Allow RakshaSetu to access permitted case information from the integrated NHAA system for support assessment and follow-up.&rdquo;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs border-t border-blue-200/60">
            <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
              <span className="font-bold text-[#002046] block flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span>What Data is Accessed</span>
              </span>
              <p className="text-[#545f72] text-[11px] leading-snug">
                Case reference (NHAA-TN-2026-00981), scheduled hearing dates, court postponement notices, and active protection orders. Zero call recordings or private messages.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
              <span className="font-bold text-[#002046] block flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">psychology</span>
                <span>Why It is Needed</span>
              </span>
              <p className="text-[#545f72] text-[11px] leading-snug">
                Enables automated continuous monitoring. When a hearing is postponed or case state changes, risk is recalculated to alert Tele-MANAS counsellors proactively.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
              <span className="font-bold text-[#002046] block flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                <span>Who Can Review</span>
              </span>
              <p className="text-[#545f72] text-[11px] leading-snug">
                Certified Tele-MANAS clinical psychologists and authorized District Mental Health Programme (DMHP) clinicians. Never shared with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Consent Status & Manage/Revoke Info */}
        <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[#191c1e] font-semibold">
              Consent Status: <span className="text-emerald-700 font-bold">{citizenProfile.consentDataSharing ? 'ACTIVE AUTHORIZATION' : 'PENDING APPROVAL'}</span>
            </span>
            {citizenProfile.consentTimestamp && (
              <span className="text-[#74777f] font-mono text-[11px]">
                (Granted: {new Date(citizenProfile.consentTimestamp).toLocaleDateString()})
              </span>
            )}
          </div>

          {citizenProfile.consentDataSharing && (
            <button
              onClick={revokeConsent}
              className="text-xs text-[#ba1a1a] hover:underline font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">cancel</span>
              <span>Revoke / Manage NHAA Consent</span>
            </button>
          )}
        </div>

        <EthicsBanner type="ai-preliminary" />

        {/* Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer text-xs text-[#44474e] p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors">
          <input
            id="milestone-consent-checkbox"
            type="checkbox"
            checked={citizenProfile.consentDataSharing}
            onChange={(e) => {
              const checked = e.target.checked;
              updateCitizenProfile({
                consentDataSharing: checked,
                consentNhaaAccess: checked,
                consentTimestamp: checked ? new Date().toISOString() : undefined
              });
            }}
            className="mt-0.5 w-4 h-4 rounded text-[#002046] border-[#c4c6cf] focus:ring-[#002046]"
          />
          <span className="font-medium text-[#191c1e]">
            I explicitly authorize RakshaSetu to access permitted NHAA case information (NHAA-TN-2026-00981) and process my screening responses under the Tele-MANAS clinical guidelines and DPDPA 2023 for continuous triage, counsellor notification, and follow-up support.
          </span>
        </label>

        {/* Action buttons */}
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
            <span>Authorize & Continue to Profile</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
