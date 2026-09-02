import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CitizenLogin: React.FC = () => {
  const { citizenProfile, loginCitizen, navigateTo } = useApp();
  const [displayName, setDisplayName] = useState(citizenProfile.fullName);
  const [phone, setPhone] = useState(citizenProfile.phone);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!phone.trim()) {
      setError('Enter a mobile number to continue.');
      return;
    }
    if (otp.trim() && otp.trim() !== '123456') {
      setError('Invalid OTP. Use 123456 for this prototype, or leave OTP blank.');
      return;
    }
    loginCitizen(phone, displayName);
    navigateTo('citizen-consent', 'push');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
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
          <span className="text-[#002046] font-semibold">Citizen Login</span>
        </div>
        <span className="text-xs font-mono font-bold bg-[#d6e3ff] text-[#002046] px-2.5 py-1 rounded-full">
          Step 0 of 5
        </span>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-[#c4c6cf] shadow-sm p-6 sm:p-8">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden">
            <img
              src="/assets/rakshasetu-logo.png"
              alt="RakshaSetu Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#002046] tracking-tight">Victim / Citizen Intake Login</h1>
          </div>
          <p className="text-sm text-[#545f72] leading-relaxed">
            Sign in with your mobile number to authorize permitted NHAA case information and start confidential distress triage. Prototype OTP is{' '}
            <strong>123456</strong> (optional).
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1.5" htmlFor="login-name-input">
              Full Name
            </label>
            <input
              id="login-name-input"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Karthik Subramanian"
              className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1.5" htmlFor="login-phone-input">
              Mobile / WhatsApp Number <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="login-phone-input"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              placeholder="e.g. +91 98401 23456"
              className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm font-mono text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#191c1e] mb-1.5" htmlFor="login-otp-input">
              One-Time Password (optional)
            </label>
            <input
              id="login-otp-input"
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError('');
              }}
              placeholder="123456"
              className="w-full px-3.5 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm font-mono text-[#191c1e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002046]"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-xs text-[#ba1a1a] font-medium">{error}</p>
        )}

        <div className="mt-8 pt-6 border-t border-[#eceef0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            id="login-back-btn"
            onClick={() => navigateTo('public-support', 'push_back')}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#74777f] text-[#002046] font-semibold text-sm rounded-lg hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Home</span>
          </button>
          <button
            id="citizen-login-continue-btn"
            onClick={handleLogin}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#002046] hover:bg-[#1b365d] text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to Consent</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
