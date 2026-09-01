import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_DISTRICT_METRICS } from '../data/initialData';
import { RiskLevel } from '../types';

export const DistrictDashboard: React.FC = () => {
  const {
    cases,
    setCurrentCaseId,
    navigateTo
  } = useApp();

  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCases = cases.filter((c) => {
    if (filterRisk !== 'ALL' && c.riskLevel !== filterRisk) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (
      searchQuery &&
      !c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.citizenName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleReviewCase = (caseId: string) => {
    setCurrentCaseId(caseId);
    navigateTo('case-review', 'push');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#eceef0] gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#545f72]">
            <button
              onClick={() => navigateTo('state-dashboard', 'push_back')}
              className="hover:text-[#002046] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">map</span>
              <span>State Dashboard (Tamil Nadu)</span>
            </button>
            <span>/</span>
            <span className="text-[#002046] font-semibold">District Dashboard | Chennai</span>
          </div>
          <h1 className="text-2xl font-bold text-[#002046] tracking-tight flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#002046] text-3xl">location_city</span>
            <span>District Mental Health Operations • Chennai</span>
          </h1>
        </div>

        {/* Top Navigation Links */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="district-to-state-btn"
            onClick={() => navigateTo('state-dashboard', 'push')}
            className="px-3.5 py-2 bg-[#d6e3ff] hover:bg-[#aec7f7] text-[#002046] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">map</span>
            <span>State Dashboard</span>
          </button>
          <button
            id="district-to-national-btn"
            onClick={() => navigateTo('national-command', 'push')}
            className="px-3.5 py-2 bg-[#002046] hover:bg-[#1b365d] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">shield</span>
            <span>National Command</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#545f72] uppercase tracking-wider block">
            Active Triage Queue
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#002046] font-mono">
              {INITIAL_DISTRICT_METRICS.activeQueue}
            </span>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
              Live Cases
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">Chennai DMHP Unit</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider block">
            Critical Alerts
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#ba1a1a] font-mono">
              {INITIAL_DISTRICT_METRICS.criticalAlerts}
            </span>
            <span className="text-xs text-white bg-[#ba1a1a] px-2 py-0.5 rounded font-bold animate-pulse">
              Urgent SOS
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">Immediate contact required</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#545f72] uppercase tracking-wider block">
            Counsellors Active
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#002046] font-mono">
              {INITIAL_DISTRICT_METRICS.counsellorsAvailable}
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              86 / 90 Duty
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">Tele-MANAS & OPD Staff</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c4c6cf] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[#545f72] uppercase tracking-wider block">
            Avg Triage Time
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#002046] font-mono">
              {INITIAL_DISTRICT_METRICS.avgResponseMins} min
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              &lt; 5m Target
            </span>
          </div>
          <p className="text-[11px] text-[#74777f]">From citizen screening</p>
        </div>
      </div>

      {/* Case Queue Table with Filters */}
      <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#eceef0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-[#002046] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">view_list</span>
              <span>District Clinical Review Queue</span>
            </h3>
            <p className="text-xs text-[#545f72]">
              Select a case to inspect screening details, AI explanation, and sign off human validation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search */}
            <input
              type="text"
              placeholder="Search Case ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-[#191c1e] w-48"
            />

            {/* Risk Filter */}
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-[#191c1e]"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MODERATE">Moderate</option>
              <option value="MILD">Mild</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-[#191c1e]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="FOLLOW_UP_SCHEDULED">Follow-Up Scheduled</option>
              <option value="REFERRED">Referred</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f9fb] text-[#545f72] border-b border-[#eceef0] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Case ID</th>
                <th className="px-4 py-3">Citizen</th>
                <th className="px-4 py-3">Severity & Score</th>
                <th className="px-4 py-3">Primary Trigger</th>
                <th className="px-4 py-3">Assigned Clinical Staff</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0]">
              {filteredCases.map((c) => {
                const isTargetDemo = c.caseId === 'RS-2026-00124';
                return (
                  <tr
                    key={c.caseId}
                    id={`case-row-${c.caseId}`}
                    onClick={() => handleReviewCase(c.caseId)}
                    className={`hover:bg-[#f2f4f6] cursor-pointer transition-colors ${
                      isTargetDemo ? 'bg-[#d6e3ff]/15' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-[#002046] whitespace-nowrap flex items-center gap-1.5">
                      {isTargetDemo && (
                        <span className="w-2 h-2 rounded-full bg-[#002046] animate-pulse"></span>
                      )}
                      <span>{c.caseId}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#191c1e] whitespace-nowrap">
                      <div>{c.citizenName}</div>
                      <div className="text-[11px] text-[#74777f] font-mono">{c.citizenPhone}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          c.riskLevel === 'CRITICAL'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : c.riskLevel === 'HIGH'
                            ? 'bg-amber-100 text-amber-900'
                            : c.riskLevel === 'MODERATE'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {c.riskLevel === 'CRITICAL' || c.riskLevel === 'HIGH'
                            ? 'warning'
                            : 'check_circle'}
                        </span>
                        <span>{c.riskLevel} ({c.distressScore}/100)</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#44474e] max-w-xs truncate">
                      {c.screeningSummary.primaryTrigger}
                    </td>
                    <td className="px-4 py-3 text-[#545f72] whitespace-nowrap">
                      {c.counsellorReview.assignedCounsellor.split('(')[0]}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          c.status === 'PENDING_REVIEW'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : c.status === 'IN_REVIEW'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : c.status === 'FOLLOW_UP_SCHEDULED'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : c.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewCase(c.caseId);
                        }}
                        className="px-3 py-1.5 bg-[#002046] hover:bg-[#1b365d] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Review Case
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chennai Designated Mental Health Infrastructure */}
      <div className="bg-white rounded-xl border border-[#c4c6cf] shadow-2xs p-5 sm:p-6 space-y-4">
        <h3 className="font-bold text-base text-[#002046] flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">local_hospital</span>
          <span>Chennai District Hospital & DMHP Node Network</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {INITIAL_DISTRICT_METRICS.centers.map((center, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-[#002046] line-clamp-1">{center.name}</h4>
                <span className="text-[10px] font-mono bg-[#d6e3ff] text-[#002046] px-1.5 py-0.5 rounded shrink-0">
                  {center.distanceKm} km
                </span>
              </div>
              <p className="text-[#545f72] text-[11px]">{center.type}</p>
              <p className="text-[#191c1e] text-[11px] font-mono">{center.phone}</p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-800">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{center.availableSlots} consultation slots available</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
