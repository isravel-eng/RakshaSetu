import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_STATE_METRICS } from '../data/initialData';

export const StateDashboard: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#eceef0] gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#545f72]">
            <button
              onClick={() => navigateTo('national-command', 'push_back')}
              className="hover:text-[#002046] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">shield</span>
              <span>National Command Center</span>
            </button>
            <span>/</span>
            <span className="text-[#002046] font-semibold">State Dashboard | Tamil Nadu</span>
          </div>
          <h1 className="text-2xl font-bold text-[#002046] tracking-tight flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#002046] text-3xl">map</span>
            <span>State Mental Health Directorate • Tamil Nadu</span>
          </h1>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="state-to-district-chennai-btn"
            onClick={() => navigateTo('district-dashboard', 'push')}
            className="px-3.5 py-2 bg-[#d6e3ff] hover:bg-[#aec7f7] text-[#002046] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">location_city</span>
            <span>District: Chennai</span>
          </button>

          <button
            id="state-to-national-btn"
            onClick={() => navigateTo('national-command', 'push')}
            className="px-3.5 py-2 bg-[#002046] hover:bg-[#1b365d] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">shield</span>
            <span>National Command Center</span>
          </button>
        </div>
      </div>

      {/* 4 State KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#545f72] uppercase tracking-wider block">
            Total State Screenings
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#002046] font-mono">
              {INITIAL_STATE_METRICS.totalCases.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              +8.4% MoM
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">Tamil Nadu All Districts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider block">
            Pending Validations
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#ba1a1a] font-mono">
              {INITIAL_STATE_METRICS.pendingValidation}
            </span>
            <span className="text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-semibold">
              Active Queue
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">Chennai DMHP node priority</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#545f72] uppercase tracking-wider block">
            Scheduled Follow-ups
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#002046] font-mono">
              {INITIAL_STATE_METRICS.activeFollowUps}
            </span>
            <span className="text-xs text-blue-900 bg-blue-100 px-2 py-0.5 rounded font-semibold">
              This Week
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">Tele-MANAS & District OPDs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#545f72] uppercase tracking-wider block">
            Resolved & Stabilized
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-800 font-mono">
              {INITIAL_STATE_METRICS.resolvedThisMonth.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              77.4% Rate
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">Successful Care Pathway</p>
        </div>
      </div>

      {/* District Breakdown Table */}
      <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#eceef0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-[#002046] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">domain</span>
              <span>Tamil Nadu District Mental Health Capacity & Triage Speed</span>
            </h3>
            <p className="text-xs text-[#545f72]">
              Click on <strong>Chennai</strong> or any district row to drill down into the local operational triage queue.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f9fb] text-[#545f72] border-b border-[#eceef0] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Active Screenings</th>
                <th className="px-4 py-3">Avg Distress Score</th>
                <th className="px-4 py-3">Counsellors Active</th>
                <th className="px-4 py-3">Operational Status</th>
                <th className="px-4 py-3 text-right">Drilldown Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0]">
              {INITIAL_STATE_METRICS.districtStats.map((d) => {
                const isChennai = d.district === 'Chennai';
                return (
                  <tr
                    key={d.district}
                    id={`district-row-${d.district.toLowerCase()}`}
                    onClick={() => {
                      if (isChennai) {
                        navigateTo('district-dashboard', 'push');
                      }
                    }}
                    className={`hover:bg-[#f2f4f6] transition-colors ${
                      isChennai ? 'bg-[#d6e3ff]/20 cursor-pointer' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-[#002046] whitespace-nowrap flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      <span>{d.district}</span>
                      {isChennai && (
                        <span className="text-[10px] bg-[#002046] text-white px-1.5 py-0.2 rounded font-mono">
                          FOCUS
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-[#191c1e] whitespace-nowrap">
                      {d.cases.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#e0e3e5] rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              d.riskScoreAvg > 65
                                ? 'bg-[#ba1a1a]'
                                : d.riskScoreAvg > 55
                                ? 'bg-amber-500'
                                : 'bg-emerald-600'
                            }`}
                            style={{ width: `${d.riskScoreAvg}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-xs">{d.riskScoreAvg}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#545f72] font-mono whitespace-nowrap">
                      {d.counsellorsOnline} online
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          d.status === 'High Volume'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isChennai ? (
                        <button
                          id="chennai-drilldown-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateTo('district-dashboard', 'push');
                          }}
                          className="px-3 py-1.5 bg-[#002046] hover:bg-[#1b365d] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <span>Open District View</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      ) : (
                        <span className="text-[#74777f] text-[11px] italic">Monitoring</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
