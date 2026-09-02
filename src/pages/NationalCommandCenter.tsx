import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_NATIONAL_METRICS } from '../data/initialData';

export const NationalCommandCenter: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#eceef0] gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#545f72]">
            <button
              onClick={() => navigateTo('public-support', 'push_back')}
              className="hover:text-[#002046] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Public Support Platform</span>
            </button>
            <span>/</span>
            <span className="text-[#002046] font-semibold">National Command Center | RakshaSetu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#002046] tracking-tight flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#002046] text-3xl sm:text-4xl">shield</span>
            <span>National Distress Management Command Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#545f72]">
            Ministry of Health & Family Welfare • National Tele Mental Health Programme (Tele-MANAS)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="national-to-state-tn-btn"
            onClick={() => navigateTo('state-dashboard', 'push')}
            className="px-4 py-2 bg-[#d6e3ff] hover:bg-[#aec7f7] text-[#002046] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">map</span>
            <span>State: Tamil Nadu</span>
          </button>

          <button
            id="national-to-public-btn"
            onClick={() => navigateTo('public-support', 'push_back')}
            className="px-4 py-2 bg-[#002046] hover:bg-[#1b365d] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">public</span>
            <span>Public Platform</span>
          </button>
        </div>
      </div>

      {/* 5 Pan-India Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-[#545f72] uppercase tracking-wider block">
            Pan-India Screenings
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#002046] font-mono">
              {INITIAL_NATIONAL_METRICS.totalScreenings.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              Live Feed
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">All 36 States & UTs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-[#002046] uppercase tracking-wider block">
            Monitored NHAA Cases
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#002046] font-mono">
              {INITIAL_NATIONAL_METRICS.monitoredNhaaCases.toLocaleString()}
            </span>
            <span className="text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-semibold">
              Live Stream
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">Continuous Monitoring</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider block">
            Critical Alerts (Pan-India)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#ba1a1a] font-mono">
              {INITIAL_NATIONAL_METRICS.criticalCases.toLocaleString()}
            </span>
            <span className="text-xs text-white bg-[#ba1a1a] px-2 py-0.5 rounded font-bold">
              2.57% Rate
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">Priority Triage Active</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-[#545f72] uppercase tracking-wider block">
            Active Counsellors On Duty
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#002046] font-mono">
              {INITIAL_NATIONAL_METRICS.activeCounsellors.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              91.4% Capacity
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">Tele-MANAS 51 Hubs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold text-[#545f72] uppercase tracking-wider block">
            Avg Triage Speed
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#002046] font-mono">
              {INITIAL_NATIONAL_METRICS.triageTimeMinutes}m
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              SLA Met
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">AI + Human Loop</p>
        </div>
      </div>

      {/* Real-time Hourly Screening Volume Trend Visualizer */}
      <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eceef0] pb-3">
          <div>
            <h3 className="font-bold text-base text-[#002046] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">timeline</span>
              <span>24-Hour Screening Volume & Distress Influx</span>
            </h3>
            <p className="text-xs text-[#545f72]">Hourly nationwide screening submissions across 14 languages</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-[#002046] font-semibold">
              <span className="w-3 h-3 rounded-full bg-[#002046]"></span>
              <span>Total Screenings</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#ba1a1a] font-semibold">
              <span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span>
              <span>Critical SOS Triggers</span>
            </span>
          </div>
        </div>

        {/* Responsive Bar Graphic */}
        <div className="grid grid-cols-7 gap-2 pt-4 items-end h-40">
          {INITIAL_NATIONAL_METRICS.trendData.map((item, idx) => {
            const heightPercent = Math.min(100, Math.round((item.screenings / 1200) * 100));
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="text-[10px] font-mono text-[#545f72] font-semibold">
                  {item.screenings}
                </div>
                <div className="w-full max-w-[36px] bg-[#d6e3ff] rounded-t-md relative flex flex-col justify-end overflow-hidden" style={{ height: `${heightPercent}%` }}>
                  <div
                    className="w-full bg-[#ba1a1a] rounded-t-xs"
                    style={{ height: `${Math.min(100, (item.criticalAlerts / item.screenings) * 400)}%` }}
                    title={`Critical: ${item.criticalAlerts}`}
                  ></div>
                  <div className="w-full bg-[#002046] flex-1"></div>
                </div>
                <span className="text-[10px] font-mono text-[#74777f]">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* State-by-State Readiness Table */}
      <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#eceef0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-[#002046] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">flag</span>
              <span>State & Union Territory Readiness Grid</span>
            </h3>
            <p className="text-xs text-[#545f72]">
              Select <strong>Tamil Nadu</strong> to inspect state-level nodal command operations.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f9fb] text-[#545f72] border-b border-[#eceef0] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">State / UT</th>
                <th className="px-4 py-3">Screenings</th>
                <th className="px-4 py-3">High Risk Volume</th>
                <th className="px-4 py-3">Counsellor Capacity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0]">
              {INITIAL_NATIONAL_METRICS.stateBreakdown.map((s) => {
                const isTN = s.state === 'Tamil Nadu';
                return (
                  <tr
                    key={s.state}
                    id={`state-row-${s.state.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      if (isTN) {
                        navigateTo('state-dashboard', 'push');
                      }
                    }}
                    className={`hover:bg-[#f2f4f6] transition-colors ${
                      isTN ? 'bg-[#d6e3ff]/20 cursor-pointer font-medium' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-[#002046] whitespace-nowrap flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">map</span>
                      <span>{s.state}</span>
                      {isTN && (
                        <span className="text-[10px] bg-[#002046] text-white px-1.5 py-0.2 rounded font-mono">
                          ACTIVE DEMO
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-[#191c1e] whitespace-nowrap">
                      {s.cases.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-[#ba1a1a] font-bold whitespace-nowrap">
                      {s.highRisk.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#e0e3e5] rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              s.capacity > 90
                                ? 'bg-emerald-600'
                                : s.capacity > 80
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${s.capacity}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-xs">{s.capacity}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.status === 'OPTIMAL'
                            ? 'bg-emerald-100 text-emerald-900'
                            : s.status === 'MODERATE'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isTN ? (
                        <button
                          id="open-tn-state-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateTo('state-dashboard', 'push');
                          }}
                          className="px-3 py-1.5 bg-[#002046] hover:bg-[#1b365d] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <span>Open State View</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      ) : (
                        <span className="text-[#74777f] text-[11px] italic">Tele-MANAS Live</span>
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
