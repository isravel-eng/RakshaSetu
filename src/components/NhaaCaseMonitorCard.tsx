import React from 'react';
import { NHAACaseData } from '../types';

interface NhaaCaseMonitorCardProps {
  nhaaData: NHAACaseData;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const NhaaCaseMonitorCard: React.FC<NhaaCaseMonitorCardProps> = ({
  nhaaData,
  onSync,
  isSyncing = false
}) => {
  if (!nhaaData) return null;

  const latestEvent = nhaaData.events && nhaaData.events[0];
  const hasDelay = nhaaData.nextHearingDate.includes('18') || (latestEvent && latestEvent.delayDays);

  return (
    <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-2xs p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#eceef0] pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#002046] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-base">account_balance</span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#002046] flex items-center gap-2">
              <span>NHAA Integrated Case Monitor</span>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                PERMITTED SOURCE
              </span>
            </h3>
            <p className="text-[11px] text-[#545f72]">
              Case Ref: <strong className="font-mono text-[#002046]">{nhaaData.nhaaCaseReference}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>MONITORING ACTIVE</span>
          </span>
          {onSync && (
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="p-1.5 rounded-lg border border-[#c4c6cf] hover:bg-[#f2f4f8] text-[#002046] transition-colors disabled:opacity-50"
              title="Synchronize NHAA Case Stream"
            >
              <span className={`material-symbols-outlined text-sm ${isSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Structured Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-[#545f72] block">Source Authority</span>
          <span className="font-semibold text-[#002046] block truncate">NHAA Registry</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-[#545f72] block">Case State</span>
          <span className="font-semibold text-emerald-800 block truncate">{nhaaData.caseStatus}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-[#545f72] block">Next Hearing Date</span>
          <span className={`font-bold font-mono block ${hasDelay ? 'text-[#ba1a1a]' : 'text-[#002046]'}`}>
            {nhaaData.nextHearingDate} {hasDelay ? '(!)' : ''}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-[#545f72] block">Last Synchronized</span>
          <span className="font-mono text-[#545f72] block text-[11px] truncate">
            {new Date(nhaaData.lastSynchronized).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
          </span>
        </div>
      </div>

      {/* Latest Case Event Banner */}
      {latestEvent && (
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            hasDelay ? 'bg-[#fff5f5] border-[#ba1a1a]/30' : 'bg-blue-50/60 border-blue-200'
          }`}
        >
          <span
            className={`material-symbols-outlined text-xl shrink-0 ${
              hasDelay ? 'text-[#ba1a1a]' : 'text-[#002046]'
            }`}
          >
            {hasDelay ? 'warning' : 'event_available'}
          </span>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#002046]">{latestEvent.title}</span>
              {hasDelay && (
                <span className="text-[10px] font-mono font-bold bg-[#ba1a1a] text-white px-2 py-0.5 rounded">
                  CASE EVENT DETECTED
                </span>
              )}
            </div>
            <p className="text-[#44474e] leading-snug text-[11px]">{latestEvent.description}</p>
            <div className="flex items-center gap-3 text-[10px] text-[#74777f] font-mono pt-1">
              <span>Stage: {latestEvent.legalStage}</span>
              <span>•</span>
              <span>Court: {latestEvent.courtOrAuthority}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legal Protection & Stress Markers */}
      {nhaaData.legalStressMarkers && nhaaData.legalStressMarkers.length > 0 && (
        <div className="pt-2 border-t border-[#eceef0] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-[#545f72]">Legal Stress Markers:</span>
            {nhaaData.legalStressMarkers.map((m, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200"
              >
                {m}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-emerald-800 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">lock</span>
            <span>DPDPA Consent Authorized</span>
          </span>
        </div>
      )}
    </div>
  );
};
