import React from 'react';
import { RiskHistoryEntry, RiskLevel } from '../types';

interface RiskHistoryTrendProps {
  history: RiskHistoryEntry[];
  currentScore: number;
  currentRisk: RiskLevel;
}

const RISK_BADGES: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  CRITICAL: { bg: 'bg-[#ba1a1a]', text: 'text-white', label: 'CRITICAL' },
  HIGH: { bg: 'bg-[#d83a56]', text: 'text-white', label: 'HIGH' },
  MODERATE: { bg: 'bg-[#f59e0b]', text: 'text-white', label: 'MODERATE' },
  LOW: { bg: 'bg-[#10b981]', text: 'text-white', label: 'LOW' },
  MILD: { bg: 'bg-[#10b981]', text: 'text-white', label: 'MILD' }
};

export const RiskHistoryTrend: React.FC<RiskHistoryTrendProps> = ({ history, currentScore, currentRisk }) => {
  if (!history || history.length === 0) {
    return null;
  }

  // Reverse so oldest is left, latest is right for the trend graph
  const trendItems = [...history].reverse();
  const latestEntry = history[0];
  const initialEntry = trendItems[0];
  const scoreDelta = latestEntry.score - initialEntry.score;

  return (
    <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-2xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#eceef0] pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#002046]">trending_up</span>
          <div>
            <h3 className="font-bold text-sm text-[#002046]">
              Continuous Risk Trajectory & Case Reassessment History
            </h3>
            <p className="text-[11px] text-[#545f72]">
              Real-time score recalculation triggered by NHAA case stream events
            </p>
          </div>
        </div>

        {scoreDelta !== 0 && (
          <div
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs ${
              scoreDelta > 0 ? 'bg-red-50 text-[#ba1a1a] border border-red-200' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {scoreDelta > 0 ? 'arrow_upward' : 'arrow_downward'}
            </span>
            <span>
              {scoreDelta > 0 ? `+${scoreDelta} PTS ESCALATION` : `${scoreDelta} PTS REDUCTION`}
            </span>
          </div>
        )}
      </div>

      {/* Visual Step-Trend Graph (Responsive SVG & CSS layout) */}
      <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between text-xs font-mono text-[#545f72] mb-3">
          <span>INITIAL INTAKE (BASELINE)</span>
          <span>AUTOMATED EVENT REASSESSMENT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendItems.map((item, idx) => {
            const badge = RISK_BADGES[item.riskLevel] || RISK_BADGES.MODERATE;
            const isLatest = idx === trendItems.length - 1;

            return (
              <div
                key={item.id || idx}
                className={`p-4 rounded-xl border transition-all ${
                  isLatest
                    ? 'bg-white border-[#002046] ring-2 ring-blue-100 shadow-sm'
                    : 'bg-white/80 border-[#c4c6cf]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-[#545f72] font-bold">
                    {idx === 0 ? 'STEP 1: INITIAL ASSESSMENT' : `STEP ${idx + 1}: NHAA EVENT RE-EVALUATION`}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                    {item.riskLevel}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-extrabold font-mono text-[#002046]">{item.score}</span>
                  <span className="text-xs text-[#545f72] font-mono">/ 100</span>
                  <span className="text-[11px] font-semibold text-[#191c1e] ml-2">
                    Priority: {item.priority}
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      item.riskLevel === 'CRITICAL'
                        ? 'bg-[#ba1a1a]'
                        : item.riskLevel === 'HIGH'
                        ? 'bg-[#d83a56]'
                        : item.riskLevel === 'MODERATE'
                        ? 'bg-[#f59e0b]'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>

                <p className="text-xs text-[#44474e] leading-snug line-clamp-2">{item.reason}</p>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#74777f]">
                  <span className="font-mono">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
                  <span className="font-semibold text-[#002046]">{item.triggerLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown of Detailed Evaluation Log */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#002046] uppercase tracking-wider">
          Audit Log of Clinical Risk Signals
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {history.map((h, i) => (
            <div key={h.id || i} className="p-3 bg-[#fcfdfd] rounded-lg border border-[#eceef0] text-xs space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-bold text-[#002046] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#002046]"></span>
                  <span>{h.triggerLabel}</span>
                </span>
                <span className="font-mono text-[10px] text-[#74777f]">
                  {new Date(h.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-[#44474e] text-[11px]">{h.reason}</p>
              {h.contributingFactors && h.contributingFactors.length > 0 && (
                <div className="pt-1 text-[11px] text-[#ba1a1a]">
                  <strong>Key Factors:</strong> {h.contributingFactors.slice(0, 2).join(' • ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
