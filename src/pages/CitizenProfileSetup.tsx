import React from 'react';
import { useApp } from '../context/AppContext';

export const CitizenProfileSetup: React.FC = () => {
  const {
    citizenProfile,
    updateCitizenProfile,
    hasConsented,
    navigateTo
  } = useApp();

  const tamilNaduDistricts = [
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Tiruchirappalli',
    'Salem',
    'Tirunelveli',
    'Vellore',
    'Erode',
    'Thoothukudi',
    'Dindigul',
    'Thanjavur',
    'Kanchipuram',
    'Chengalpattu',
    'Tiruvallur'
  ];

  const languages = [
    'English / தமிழ் (Tamil)',
    'தமிழ் (Tamil Only)',
    'English Only',
    'हिंदी (Hindi)',
    'తెలుగు (Telugu)',
    'മലയാളം (Malayalam)',
    'ಕನ್ನಡ (Kannada)'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Top Breadcrumb & Step Tracker */}
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
          <span className="text-[#002046] font-semibold">Citizen Profile Setup</span>
        </div>
        <span className="text-xs font-mono font-bold bg-[#d6e3ff] text-[#002046] px-2.5 py-1 rounded-full">
          Step 2 of 5
        </span>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-[#c4c6cf] shadow-sm p-6 sm:p-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002046] text-2xl">person_pin</span>
            <h1 className="text-2xl font-bold text-[#002046] tracking-tight">Citizen Profile Setup</h1>
          </div>
          <p className="text-sm text-[#545f72] leading-relaxed">
            Please provide your basic contact details so our clinical support team can connect you with appropriate local
            resources. You may also choose <strong>Anonymous Mode</strong> for complete confidentiality.
          </p>
        </div>

        {/* Anonymous Mode Switcher */}
        <div className="mt-6 p-4 rounded-lg bg-[#f0f9ff] border border-[#aec7f7]/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#002046] text-xl shrink-0 mt-0.5">visibility_off</span>
            <div>
              <h3 className="text-sm font-bold text-[#002046]">Enable Anonymous Mode</h3>
              <p className="text-xs text-[#545f72] mt-0.5">
                Hide your personal identity. We will generate a secure pseudo-token for screening and clinical triage.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              id="anonymous-mode-toggle"
              type="checkbox"
              checked={citizenProfile.anonymousMode}
              onChange={(e) => updateCitizenProfile({ anonymousMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#c4c6cf] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c4c6cf] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002046]"></div>
          </label>
        </div>

        {/* Form Fields */}
        <div className="mt-8 space-y-6">
          {!citizenProfile.anonymousMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1.5" htmlFor="full-name-input">
                  Full Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  id="full-name-input"
                  type="text"
                  value={citizenProfile.fullName}
                  onChange={(e) => updateCitizenProfile({ fullName: e.target.value })}
                  placeholder="e.g. Karthik Subramanian"
                  className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1.5" htmlFor="phone-input">
                  Mobile / WhatsApp Number <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  id="phone-input"
                  type="tel"
                  value={citizenProfile.phone}
                  onChange={(e) => updateCitizenProfile({ phone: e.target.value })}
                  placeholder="e.g. +91 98401 23456"
                  className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm font-mono text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
                />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#e6e8ea] rounded-lg border border-[#c4c6cf] text-xs font-mono text-[#002046] flex items-center gap-2">
              <span className="material-symbols-outlined text-base">vpn_key</span>
              <span>Encrypted Session Token: <strong>TOKEN-ANON-TN-2026-X84</strong> (Zero PII stored)</span>
            </div>
          )}

          {/* Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1.5" htmlFor="state-select">
                State / UT <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                id="state-select"
                value={citizenProfile.state}
                onChange={(e) => updateCitizenProfile({ state: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
              >
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1.5" htmlFor="district-select">
                District <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                id="district-select"
                value={citizenProfile.district}
                onChange={(e) => updateCitizenProfile({ district: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
              >
                {tamilNaduDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1.5" htmlFor="language-select">
                Preferred Language
              </label>
              <select
                id="language-select"
                value={citizenProfile.preferredLanguage}
                onChange={(e) => updateCitizenProfile({ preferredLanguage: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1.5" htmlFor="gender-select">
                Gender
              </label>
              <select
                id="gender-select"
                value={citizenProfile.gender}
                onChange={(e) => updateCitizenProfile({ gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary / Transgender">Non-Binary / Transgender</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1.5" htmlFor="age-group-select">
                Age Group
              </label>
              <select
                id="age-group-select"
                value={citizenProfile.ageGroup}
                onChange={(e) => updateCitizenProfile({ ageGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
              >
                <option value="18-24">18–24 (Young Adult / Student)</option>
                <option value="25-34">25–34 (Early Career)</option>
                <option value="35-49">35–49 (Mid Career / Family)</option>
                <option value="50-64">50–64 (Senior)</option>
                <option value="65+">65+ (Elderly)</option>
              </select>
            </div>
          </div>

          {/* Emergency Contact (Optional) */}
          <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#545f72] text-lg">contact_phone</span>
              <h4 className="text-xs font-bold text-[#002046] uppercase tracking-wider">
                Emergency Support Contact (Optional)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                id="emergency-contact-name"
                type="text"
                value={citizenProfile.emergencyContactName}
                onChange={(e) => updateCitizenProfile({ emergencyContactName: e.target.value })}
                placeholder="Contact Name & Relationship"
                className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg text-xs text-[#191c1e]"
              />
              <input
                id="emergency-contact-phone"
                type="tel"
                value={citizenProfile.emergencyContactPhone}
                onChange={(e) => updateCitizenProfile({ emergencyContactPhone: e.target.value })}
                placeholder="Emergency Contact Phone"
                className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg text-xs font-mono text-[#191c1e]"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-[#44474e]">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={citizenProfile.consentDataSharing}
                onChange={(e) => updateCitizenProfile({ consentDataSharing: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-[#002046] border-[#c4c6cf] focus:ring-[#002046]"
              />
              <span>
                I consent to the processing of my responses by certified mental health professionals under the
                Tele-MANAS clinical guidelines and Digital Personal Data Protection Act (DPDPA).
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons - EXACT SPEC LABELS */}
        <div className="mt-8 pt-6 border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            id="back-to-home-btn"
            onClick={() => navigateTo('public-support', 'push_back')}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#74777f] text-[#002046] font-semibold text-sm rounded-lg hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Home</span>
          </button>

          <button
            id="continue-to-screening-btn"
            onClick={() => {
              if (!hasConsented) {
                navigateTo('citizen-consent', 'push_back');
                return;
              }
              navigateTo('screening', 'push');
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#002046] hover:bg-[#1b365d] text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to Screening</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
