import React from 'react';

interface EthicsBannerProps {
  type?: 'ai-preliminary' | 'human-validation' | 'final-decision' | 'all';
  className?: string;
}

export const EthicsBanner: React.FC<EthicsBannerProps> = ({
  type = 'all',
  className = ''
}) => {
  return (
    <div
      id="ethics-compliance-banner"
      className={`rounded-lg border border-[#002046]/20 bg-[#F0F9FF] p-3 sm:p-4 text-xs text-[#191c1e] shadow-2xs ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[#002046] text-xl shrink-0 mt-0.5">verified_user</span>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap font-semibold text-[#002046]">
            <span>Human-in-the-Loop AI Ethics & Clinical Safeguard Protocol</span>
            <span className="bg-[#002046] text-white text-[10px] px-2 py-0.5 rounded font-mono">
              MoHFW GUIDELINE COMPLIANT
            </span>
          </div>

          {(type === 'ai-preliminary' || type === 'all') && (
            <div className="flex items-center gap-1.5 text-[#44474e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1b365d] shrink-0"></span>
              <span>
                <strong className="text-[#002046]">AI Assessment:</strong> Preliminary risk assessment generated from submitted screening information.
              </span>
            </div>
          )}

          {(type === 'human-validation' || type === 'all') && (
            <div className="flex items-center gap-1.5 text-[#44474e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] shrink-0"></span>
              <span>
                <strong className="text-[#002046]">Counsellor Review:</strong> Human validation required before support or referral action.
              </span>
            </div>
          )}

          {(type === 'final-decision' || type === 'all') && (
            <div className="flex items-center gap-1.5 text-[#44474e]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0"></span>
              <span>
                <strong className="text-[#002046]">Final Case Decision:</strong> Determined by authorised human personnel.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
