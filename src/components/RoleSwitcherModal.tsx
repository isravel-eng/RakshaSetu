import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const RoleSwitcherModal: React.FC = () => {
  const { isRoleSwitcherOpen, setIsRoleSwitcherOpen, currentRole, setRole } = useApp();

  if (!isRoleSwitcherOpen) return null;

  const roles: {
    id: UserRole;
    title: string;
    description: string;
    targetScreen: string;
    icon: string;
    badge: string;
    badgeColor: string;
  }[] = [
    {
      id: 'citizen',
      title: 'Citizen / Support Seeker',
      description: 'Confidential self-assessment, distress screening, immediate guidance, and local referral links.',
      targetScreen: 'Public Support Platform',
      icon: 'person',
      badge: 'Public Tier',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'counsellor',
      title: 'Clinical Counsellor (DMHP / Tele-MANAS)',
      description: 'Case triage queue, AI diagnostic explanation review, clinical validation, intervention planning.',
      targetScreen: 'Case Review (RS-2026-00124)',
      icon: 'psychology',
      badge: 'Clinical Tier',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    {
      id: 'district_officer',
      title: 'District Mental Health Officer (DMHO)',
      description: 'District case volume, hospital bed/counsellor availability, mobile crisis unit dispatch.',
      targetScreen: 'District Dashboard | Chennai',
      icon: 'location_city',
      badge: 'District Administration',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    },
    {
      id: 'state_officer',
      title: 'State Nodal Officer (Tamil Nadu)',
      description: 'Inter-district workload balancing, Tele-MANAS response metrics, district capacity monitoring.',
      targetScreen: 'State Dashboard | Tamil Nadu',
      icon: 'map',
      badge: 'State Directorate',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'national_admin',
      title: 'National Administrator (MoHFW)',
      description: 'Pan-India distress trend heatmaps, policy alerts, predictive load forecasting, inter-state protocols.',
      targetScreen: 'National Command Center',
      icon: 'shield',
      badge: 'Union Ministry',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
    }
  ];

  return (
    <div
      id="role-switcher-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#002046]/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={() => setIsRoleSwitcherOpen(false)}
    >
      <div
        id="role-switcher-modal-content"
        className="bg-white rounded-xl shadow-2xl border border-[#c4c6cf] max-w-2xl w-full p-6 sm:p-8 my-8 text-[#191c1e] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#eceef0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#002046] text-2xl">swap_horiz</span>
              <h2 className="text-xl font-bold text-[#002046] tracking-tight">Role Switcher & Perspective Selector</h2>
            </div>
            <p className="text-sm text-[#545f72] mt-1">
              Switch roles to experience the complete citizen-to-national multi-tier governance workflow.
            </p>
          </div>
          <button
            id="close-role-switcher-btn"
            onClick={() => setIsRoleSwitcherOpen(false)}
            className="text-[#74777f] hover:text-[#191c1e] hover:bg-[#f2f4f6] rounded-full p-1.5 transition-colors"
            aria-label="Close Role Switcher"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid gap-3 mt-5">
          {roles.map((r) => {
            const isSelected = currentRole === r.id;
            return (
              <div
                key={r.id}
                id={`role-option-${r.id}`}
                onClick={() => {
                  setRole(r.id);
                  setIsRoleSwitcherOpen(false);
                }}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#d6e3ff]/30 border-[#002046] shadow-xs ring-1 ring-[#002046]'
                    : 'bg-[#f7f9fb] border-[#c4c6cf]/60 hover:bg-[#eceef0] hover:border-[#74777f]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#002046] text-white' : 'bg-[#e0e3e5] text-[#002046]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{r.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#002046] text-base">{r.title}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${r.badgeColor}`}>
                      {r.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] bg-[#002046] text-white px-2 py-0.5 rounded-full font-medium ml-auto">
                        Active Role
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#545f72] mt-1 leading-relaxed">{r.description}</p>
                  <p className="text-[11px] text-[#002046] font-medium mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    Launches: <span className="font-semibold">{r.targetScreen}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[#eceef0] flex items-center justify-between">
          <p className="text-xs text-[#74777f]">
            All role changes preserve state, screening entries, and case reviews seamlessly.
          </p>
          <button
            id="role-switcher-done-btn"
            onClick={() => setIsRoleSwitcherOpen(false)}
            className="px-4 py-2 bg-[#002046] text-white text-sm font-medium rounded-lg hover:bg-[#1b365d] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
