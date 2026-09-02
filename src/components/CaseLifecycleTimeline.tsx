import React from 'react';
import { CaseTimelineEvent, TimelineActor } from '../types';

interface CaseLifecycleTimelineProps {
  timeline: CaseTimelineEvent[];
  compact?: boolean;
}

const ACTOR_LABELS: Record<TimelineActor, { name: string; bg: string; text: string; icon: string }> = {
  VICTIM: { name: 'Victim / Citizen', bg: 'bg-emerald-100', text: 'text-emerald-900', icon: 'person' },
  NHAA_SYSTEM: { name: 'NHAA Registry', bg: 'bg-blue-100', text: 'text-blue-900', icon: 'account_balance' },
  AI_ENGINE: { name: 'AI Risk Engine', bg: 'bg-purple-100', text: 'text-purple-900', icon: 'psychology' },
  COUNSELLOR: { name: 'Tele-MANAS Clinician', bg: 'bg-indigo-100', text: 'text-indigo-900', icon: 'medical_services' },
  SYSTEM_MONITOR: { name: 'Continuous Monitor', bg: 'bg-amber-100', text: 'text-amber-900', icon: 'sync' }
};

const STAGE_ICONS: Record<string, string> = {
  CONSENT_GRANTED: 'verified_user',
  NHAA_DATA_RETRIEVED: 'folder_shared',
  INITIAL_RISK_ASSESSMENT: 'assessment',
  CASE_STORED: 'cloud_done',
  NHAA_EVENT_DETECTED: 'event_busy',
  RISK_REASSESSMENT: 'troubleshoot',
  COUNSELLOR_ALERT: 'notifications_active',
  HUMAN_REVIEW: 'rate_review',
  SUPPORT_PLAN_CREATED: 'health_and_safety',
  FOLLOW_UP_SCHEDULED: 'calendar_month',
  MONITORING_ACTIVE: 'radar'
};

export const CaseLifecycleTimeline: React.FC<CaseLifecycleTimelineProps> = ({ timeline, compact = false }) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  // Display chronologically (from first to latest)
  const chronological = [...timeline].reverse();

  return (
    <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-2xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#eceef0] pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#002046]">timeline</span>
          <h3 className="font-bold text-sm text-[#002046] tracking-tight">
            Victim Support & Continuous Case Monitoring Lifecycle
          </h3>
        </div>
        <span className="text-[11px] font-mono font-bold bg-[#f2f4f8] text-[#002046] px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{timeline.length} Milestones Tracked</span>
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#002046] before:via-blue-300 before:to-emerald-500">
        {chronological.map((evt, idx) => {
          const actorInfo = ACTOR_LABELS[evt.actor] || ACTOR_LABELS.SYSTEM_MONITOR;
          const icon = STAGE_ICONS[evt.stage] || 'check_circle';
          const isLatest = idx === chronological.length - 1;
          const isAlert = evt.badgeType === 'alert';

          return (
            <div key={evt.id || idx} className="relative group">
              {/* Bullet Icon */}
              <div
                className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs transition-transform group-hover:scale-110 ${
                  isLatest
                    ? isAlert
                      ? 'bg-[#ba1a1a] text-white ring-4 ring-red-100'
                      : 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : isAlert
                    ? 'bg-[#ba1a1a] text-white'
                    : 'bg-[#002046] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{icon}</span>
              </div>

              {/* Event Content Box */}
              <div
                className={`p-3.5 rounded-lg border transition-all ${
                  isLatest
                    ? isAlert
                      ? 'bg-[#fff5f5] border-[#ba1a1a]'
                      : 'bg-blue-50/70 border-blue-200 shadow-2xs'
                    : 'bg-[#fcfdfd] border-[#eceef0] hover:border-[#c4c6cf]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#002046]">{evt.title}</span>
                    {isLatest && (
                      <span className="text-[10px] font-mono font-bold bg-[#002046] text-white px-1.5 py-0.5 rounded">
                        LATEST STATE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 ${actorInfo.bg} ${actorInfo.text}`}>
                      <span className="material-symbols-outlined text-[12px]">{actorInfo.icon}</span>
                      <span>{actorInfo.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#74777f]">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#44474e] leading-relaxed mt-1">
                  {evt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
