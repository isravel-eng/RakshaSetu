import React from 'react';
import { CounsellorAlert } from '../types';

interface CounsellorAlertBannerProps {
  alert: CounsellorAlert;
  onReview: () => void;
  onAcknowledge: (alertId: string) => void;
  onEscalate?: (alertId: string) => void;
  onDismiss?: () => void;
}

export const CounsellorAlertBanner: React.FC<CounsellorAlertBannerProps> = ({
  alert,
  onReview,
  onAcknowledge,
  onEscalate,
  onDismiss
}) => {
  if (!alert) return null;

  return (
    <div className="p-4 bg-[#fff5f5] border-2 border-[#ba1a1a] rounded-xl shadow-md animate-bounce-short space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl animate-pulse">notifications_active</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold bg-[#ba1a1a] text-white px-2 py-0.5 rounded">
                NEW RISK ALERT
              </span>
              <h4 className="font-bold text-sm text-[#ba1a1a]">
                Case {alert.caseId} (NHAA: {alert.nhaaCaseReference}) — Continuous Risk Escalation
              </h4>
            </div>
            <p className="text-xs text-[#93000a] mt-1 font-medium">
              Victim: <strong>{alert.victimName}</strong> ({alert.district}) • Trigger: <strong>{alert.trigger}</strong>
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 p-1"
            title="Dismiss notification"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-white rounded-lg border border-red-200 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#545f72] block">Previous Baseline</span>
          <span className="font-mono font-bold text-[#545f72]">
            {alert.previousScore}/100 ({alert.previousRisk})
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-[#ba1a1a] block">Current Escalated Score</span>
          <span className="font-mono font-bold text-[#ba1a1a] flex items-center gap-1">
            <span>{alert.currentScore}/100 ({alert.currentRisk})</span>
            <span className="material-symbols-outlined text-xs">arrow_upward</span>
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-[#545f72] block">Action Required</span>
          <span className="font-semibold text-[#002046] block">{alert.actionRequired}</span>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <span className="text-[10px] font-mono text-[#74777f]">
          Event Timestamp: {new Date(alert.timestamp).toLocaleTimeString()} IST • Tele-MANAS Triage Queue
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="px-3 py-1.5 rounded-lg border border-[#c4c6cf] bg-white text-xs font-semibold text-[#002046] hover:bg-slate-50 transition-colors"
          >
            Acknowledge
          </button>

          {onEscalate && (
            <button
              onClick={() => onEscalate(alert.id)}
              className="px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 text-xs font-semibold text-[#ba1a1a] hover:bg-red-100 transition-colors"
            >
              Escalate to DMHP
            </button>
          )}

          <button
            onClick={onReview}
            className="px-4 py-1.5 rounded-lg bg-[#002046] text-white text-xs font-bold hover:bg-[#003366] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Review Case</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
