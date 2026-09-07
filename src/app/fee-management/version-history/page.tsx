'use client';
import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface VersionRecord {
  id: string;
  versionNo: number;
  feeComponent: string;
  level: string;
  levelValue: string;
  oldAmount: number;
  newAmount: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
  changedBy: string;
  changedAt: string;
  reason: string;
  importId?: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'EXPIRED';
  changeType: 'CREATED' | 'UPDATED' | 'DEACTIVATED' | 'IMPORTED';
}

// ─── Demo Data ────────────────────────────────────────────────────────────────
const DEMO_VERSIONS: VersionRecord[] = [
  { id: 'v001', versionNo: 3, feeComponent: 'Hostel Fee', level: 'Course', levelValue: 'MBA Finance', oldAmount: 95000, newAmount: 100000, currency: 'INR', effectiveFrom: '2026-04-01', effectiveTo: '2027-03-31', changedBy: 'Finance Admin', changedAt: '2026-03-12 14:32', reason: 'Finance batch premium block allocation', status: 'ACTIVE', changeType: 'UPDATED' },
  { id: 'v002', versionNo: 2, feeComponent: 'Hostel Fee', level: 'Program', levelValue: 'MBA', oldAmount: 90000, newAmount: 95000, currency: 'INR', effectiveFrom: '2026-03-10', effectiveTo: '2026-03-11', changedBy: 'Finance Admin', changedAt: '2026-03-10 11:15', reason: 'MBA students get AC rooms', status: 'SUPERSEDED', changeType: 'UPDATED' },
  { id: 'v003', versionNo: 1, feeComponent: 'Hostel Fee', level: 'Branch', levelValue: 'Mumbai', oldAmount: 80000, newAmount: 90000, currency: 'INR', effectiveFrom: '2026-03-08', effectiveTo: '2026-03-09', changedBy: 'Finance Admin', changedAt: '2026-03-08 09:00', reason: 'Mumbai real estate cost increase', status: 'SUPERSEDED', changeType: 'CREATED' },
  { id: 'v004', versionNo: 2, feeComponent: 'Tuition Fee', level: 'Branch', levelValue: 'Mumbai', oldAmount: 400000, newAmount: 420000, currency: 'INR', effectiveFrom: '2026-03-08', effectiveTo: '2027-03-31', changedBy: 'Finance Manager', changedAt: '2026-03-08 10:30', reason: 'Mumbai campus infrastructure upgrade', status: 'ACTIVE', changeType: 'UPDATED' },
  { id: 'v005', versionNo: 1, feeComponent: 'Tuition Fee', level: 'Program', levelValue: 'MBA', oldAmount: 0, newAmount: 400000, currency: 'INR', effectiveFrom: '2026-03-05', effectiveTo: '2026-03-07', changedBy: 'Finance Admin', changedAt: '2026-03-05 16:00', reason: 'MBA premium pricing setup', status: 'SUPERSEDED', changeType: 'CREATED' },
  { id: 'v006', versionNo: 1, feeComponent: 'Application Fee', level: 'Course', levelValue: 'MBA Finance', oldAmount: 2500, newAmount: 3000, currency: 'INR', effectiveFrom: '2026-03-10', effectiveTo: '2027-03-31', changedBy: 'Finance Admin', changedAt: '2026-03-10 14:00', reason: 'Finance specialization premium', status: 'ACTIVE', changeType: 'UPDATED' },
  { id: 'v007', versionNo: 1, feeComponent: 'Lab Fee', level: 'Program', levelValue: 'BCA', oldAmount: 8000, newAmount: 15000, currency: 'INR', effectiveFrom: '2026-03-05', effectiveTo: '2027-03-31', changedBy: 'Finance Admin', changedAt: '2026-03-05 11:00', reason: 'BCA requires dedicated computer labs', status: 'ACTIVE', changeType: 'CREATED' },
  { id: 'v008', versionNo: 1, feeComponent: 'Transport Fee', level: 'Branch', levelValue: 'Delhi', oldAmount: 20000, newAmount: 18000, currency: 'INR', effectiveFrom: '2026-03-08', effectiveTo: '2027-03-31', changedBy: 'Finance Admin', changedAt: '2026-03-08 09:45', reason: 'Shorter routes in Delhi campus', status: 'ACTIVE', changeType: 'UPDATED' },
  { id: 'v009', versionNo: 1, feeComponent: 'Examination Fee', level: 'Program', levelValue: 'MBA', oldAmount: 5000, newAmount: 10000, currency: 'INR', effectiveFrom: '2026-03-05', effectiveTo: '2027-03-31', changedBy: 'Finance Admin', changedAt: '2026-03-05 15:30', reason: 'MBA exam infrastructure cost', status: 'ACTIVE', changeType: 'UPDATED', importId: 'IMP-20260305' },
  { id: 'v010', versionNo: 1, feeComponent: 'Certification Fee', level: 'Program', levelValue: 'MBA', oldAmount: 2000, newAmount: 2500, currency: 'INR', effectiveFrom: '2026-03-12', effectiveTo: '2027-03-31', changedBy: 'Finance Manager', changedAt: '2026-03-12 16:00', reason: 'MBA certificate premium', status: 'ACTIVE', changeType: 'CREATED', importId: 'IMP-20260312' },
];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  SUPERSEDED: 'bg-gray-50 text-gray-500 border-gray-200',
  EXPIRED: 'bg-red-50 text-red-600 border-red-200',
};

const CHANGE_STYLES: Record<string, string> = {
  CREATED: 'bg-blue-50 text-blue-700 border-blue-200',
  UPDATED: 'bg-amber-50 text-amber-700 border-amber-200',
  DEACTIVATED: 'bg-red-50 text-red-600 border-red-200',
  IMPORTED: 'bg-violet-50 text-violet-700 border-violet-200',
};

function fmt(n: number) { return '₹' + n.toLocaleString('en-IN'); }

export default function VersionHistoryPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [componentFilter, setComponentFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const uniqueComponents = Array.from(new Set(DEMO_VERSIONS.map(v => v.feeComponent)));

  const filtered = DEMO_VERSIONS.filter(v => {
    const matchSearch = v.feeComponent.toLowerCase().includes(search.toLowerCase()) || v.levelValue.toLowerCase().includes(search.toLowerCase()) || v.changedBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchComp = componentFilter === 'All' || v.feeComponent === componentFilter;
    return matchSearch && matchStatus && matchComp;
  });

  return (
    <AppShell activePath="/fee-management/version-history">
      <div className="p-6 max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/fee-management" className="text-[#94A3B8] hover:text-[#1E3A5F] text-sm">← Fee Management</Link>
            <span className="text-[#E2E8F0]">/</span>
            <h1 className="text-xl font-bold text-[#1E3A5F]">Version History</h1>
          </div>
          <button className="flex items-center gap-2 border border-[#E2E8F0] text-[#374151] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC]">
            <span>📤</span> Export History
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <p className="text-sm font-semibold text-[#0369A1]">Immutable Financial History</p>
            <p className="text-xs text-[#0369A1] mt-0.5">Fee changes are never overwritten. Every version is preserved with full audit trail. Existing invoices are NOT affected by fee changes.</p>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Versions', value: DEMO_VERSIONS.length, color: 'bg-slate-50 border-slate-200 text-slate-700' },
            { label: 'Active Rules', value: DEMO_VERSIONS.filter(v => v.status === 'ACTIVE').length, color: 'bg-green-50 border-green-200 text-green-700' },
            { label: 'Superseded', value: DEMO_VERSIONS.filter(v => v.status === 'SUPERSEDED').length, color: 'bg-gray-50 border-gray-200 text-gray-600' },
            { label: 'Imported', value: DEMO_VERSIONS.filter(v => v.importId).length, color: 'bg-violet-50 border-violet-200 text-violet-700' },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl p-4 text-center ${s.color}`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by component, level, user..." className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#0EA5E9]" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:border-[#0EA5E9]">
            <option>All</option>
            <option>ACTIVE</option>
            <option>SUPERSEDED</option>
            <option>EXPIRED</option>
          </select>
          <select value={componentFilter} onChange={e => setComponentFilter(e.target.value)} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:border-[#0EA5E9]">
            <option>All</option>
            {uniqueComponents.map(c => <option key={c}>{c}</option>)}
          </select>
          <span className="text-sm text-[#64748B]">{filtered.length} records</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Version</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Fee Component</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Level → Value</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Old Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">New Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Change</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Effective From</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Changed By</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const diff = v.newAmount - v.oldAmount;
                const isExpanded = expandedId === v.id;
                return (
                  <React.Fragment key={v.id}>
                    <tr className={`border-b border-[#E2E8F0] hover:bg-[#F8FAFC] ${v.status === 'SUPERSEDED' ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded">v{v.versionNo}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1E3A5F]">{v.feeComponent}</td>
                      <td className="px-4 py-3 text-xs text-[#64748B]">{v.level} → {v.levelValue}</td>
                      <td className="px-4 py-3 text-[#94A3B8] line-through text-xs">{v.oldAmount > 0 ? fmt(v.oldAmount) : '—'}</td>
                      <td className="px-4 py-3 font-bold text-[#1E3A5F]">{fmt(v.newAmount)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${diff > 0 ? 'text-red-600' : diff < 0 ? 'text-green-600' : 'text-[#64748B]'}`}>
                          {diff > 0 ? `+${fmt(diff)}` : diff < 0 ? fmt(diff) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#64748B]">{v.effectiveFrom}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-medium text-[#1E3A5F]">{v.changedBy}</p>
                          <p className="text-xs text-[#94A3B8]">{v.changedAt}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[v.status]}`}>{v.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setExpandedId(isExpanded ? null : v.id)} className="text-xs text-[#0EA5E9] hover:underline">{isExpanded ? 'Hide' : 'Details'}</button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div><p className="text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Change Type</p><span className={`px-2 py-0.5 rounded-full border font-medium ${CHANGE_STYLES[v.changeType]}`}>{v.changeType}</span></div>
                            <div><p className="text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Effective To</p><p className="text-[#1E3A5F] font-medium">{v.effectiveTo}</p></div>
                            <div><p className="text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Currency</p><p className="text-[#1E3A5F] font-medium">{v.currency}</p></div>
                            {v.importId && <div><p className="text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Import ID</p><p className="text-[#1E3A5F] font-mono">{v.importId}</p></div>}
                            <div className="md:col-span-4"><p className="text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Reason</p><p className="text-[#374151]">{v.reason}</p></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
