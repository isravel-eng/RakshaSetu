import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DemoSimulationControl: React.FC = () => {
  const {
    nhaaData,
    currentCase,
    syncNhaaCase,
    simulateNhaaCaseUpdate,
    resetToDefault,
    isNhaaSyncing,
    setRole,
    navigateTo
  } = useApp();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const isPostponed =
    nhaaData.nextHearingDate.includes('18') ||
    (currentCase.distressScore >= 70 && currentCase.riskLevel === 'HIGH');

  return (
    <aside aria-label="Demo Simulator" className="bg-[#00142b] text-white border-b border-blue-900/60 shadow-md text-xs relative z-40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        {/* Left: Indicator & Status */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono font-bold bg-[#ffd98e] text-[#482a00] px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
            <span className="material-symbols-outlined text-[12px]">tune</span>
            <span>SIH DEMO CONTROLLER</span>
          </span>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-blue-200">
            <span>NHAA Status:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded ${isPostponed ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-400/20 text-emerald-300'}`}>
              Hearing: {nhaaData.nextHearingDate || '04 Sep 2026'}
            </span>
            <span>•</span>
            <span>AI Risk:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded ${isPostponed ? 'bg-red-400/20 text-red-300' : 'bg-blue-400/20 text-blue-300'}`}>
              {currentCase.distressScore}/100 ({currentCase.riskLevel})
            </span>
          </div>
        </div>

        {/* Right: Simulation Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => syncNhaaCase()}
            disabled={isNhaaSyncing}
            className="px-2.5 py-1 rounded bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-100 font-mono text-[11px] flex items-center gap-1 transition-colors disabled:opacity-50"
            title="Fetch permitted NHAA case state"
          >
            <span className={`material-symbols-outlined text-[13px] ${isNhaaSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>Sync NHAA</span>
          </button>

          {!isPostponed ? (
            <button
              onClick={() => simulateNhaaCaseUpdate()}
              disabled={isNhaaSyncing}
              className="px-3 py-1 rounded bg-[#ba1a1a] hover:bg-[#d83a56] text-white font-bold font-mono text-[11px] flex items-center gap-1.5 shadow-sm transition-all animate-pulse"
              title="Trigger simulated 14-day judicial postponement event"
            >
              <span className="material-symbols-outlined text-[13px]">bolt</span>
              <span>Simulate NHAA Event (Hearing 04 → 18 Sep)</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded">
                ⚡ EVENT INGESTED (Score 72 HIGH)
              </span>
              <button
                onClick={() => {
                  setRole('counsellor');
                  navigateTo('case-review', 'slide_up');
                }}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
              >
                <span>Open Counsellor Triage</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            </div>
          )}

          <button
            onClick={resetToDefault}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
            title="Reset demo data to baseline"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
};
