'use client';
import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  module: string;
  feeComponent?: string;
  level?: string;
  levelValue?: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  ipAddress: string;
  referenceId: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

// ─── Demo Data ────────────────────────────────────────────────────────────────
const DEMO_AUDIT: AuditEntry[] = [
  { id: 'a001', timestamp: '2026-03-12 16:00:22', user: 'Finance Manager', userRole: 'FINANCE_MANAGER', action: 'FEE_OVERRIDE_CREATED', module: 'Fee Management', feeComponent: 'Certification Fee', level: 'Program', levelValue: 'MBA', oldValue: '₹2,000', newValue: '₹2,500', reason: 'MBA certificate premium', ipAddress: '192.168.1.45', referenceId: 'IMP-20260312', severity: 'INFO' },
  { id: 'a002', timestamp: '2026-03-12 14:32:11', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'FEE_OVERRIDE_UPDATED', module: 'Fee Management', feeComponent: 'Hostel Fee', level: 'Course', levelValue: 'MBA Finance', oldValue: '₹95,000', newValue: '₹1,00,000', reason: 'Finance batch premium block', ipAddress: '192.168.1.12', referenceId: 'v001', severity: 'WARNING' },
  { id: 'a003', timestamp: '2026-03-12 14:30:00', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'BULK_IMPORT_COMPLETED', module: 'Fee Management', oldValue: '—', newValue: '10 rows processed (7 created, 2 updated, 1 failed)', reason: 'Annual fee update 2026-27', ipAddress: '192.168.1.12', referenceId: 'IMP-20260312', severity: 'INFO' },
  { id: 'a004', timestamp: '2026-03-10 14:00:05', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'FEE_OVERRIDE_CREATED', module: 'Fee Management', feeComponent: 'Application Fee', level: 'Course', levelValue: 'MBA Finance', oldValue: '₹2,500', newValue: '₹3,000', reason: 'Finance specialization premium', ipAddress: '192.168.1.12', referenceId: 'v006', severity: 'INFO' },
  { id: 'a005', timestamp: '2026-03-10 11:15:33', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'FEE_OVERRIDE_UPDATED', module: 'Fee Management', feeComponent: 'Hostel Fee', level: 'Program', levelValue: 'MBA', oldValue: '₹90,000', newValue: '₹95,000', reason: 'MBA students get AC rooms', ipAddress: '192.168.1.12', referenceId: 'v002', severity: 'WARNING' },
  { id: 'a006', timestamp: '2026-03-08 10:30:44', user: 'Finance Manager', userRole: 'FINANCE_MANAGER', action: 'FEE_OVERRIDE_UPDATED', module: 'Fee Management', feeComponent: 'Tuition Fee', level: 'Branch', levelValue: 'Mumbai', oldValue: '₹4,00,000', newValue: '₹4,20,000', reason: 'Mumbai campus infrastructure upgrade', ipAddress: '192.168.1.45', referenceId: 'v004', severity: 'CRITICAL' },
  { id: 'a007', timestamp: '2026-03-08 09:45:12', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'FEE_OVERRIDE_CREATED', module: 'Fee Management', feeComponent: 'Transport Fee', level: 'Branch', levelValue: 'Delhi', oldValue: '₹20,000', newValue: '₹18,000', reason: 'Shorter routes in Delhi campus', ipAddress: '192.168.1.12', referenceId: 'v008', severity: 'INFO' },
  { id: 'a008', timestamp: '2026-03-08 09:00:00', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'FEE_OVERRIDE_CREATED', module: 'Fee Management', feeComponent: 'Hostel Fee', level: 'Branch', levelValue: 'Mumbai', oldValue: '₹80,000', newValue: '₹90,000', reason: 'Mumbai real estate cost increase', ipAddress: '192.168.1.12', referenceId: 'v003', severity: 'WARNING' },
  { id: 'a009', timestamp: '2026-03-05 16:00:00', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'GLOBAL_DEFAULT_UPDATED', module: 'Fee Management', feeComponent: 'Tuition Fee', level: 'Global', levelValue: 'All Courses', oldValue: '₹80,000', newValue: '₹1,00,000', reason: 'Annual fee revision 2026-27', ipAddress: '192.168.1.12', referenceId: 'v005', severity: 'CRITICAL' },
  { id: 'a010', timestamp: '2026-03-05 15:30:00', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'FEE_OVERRIDE_CREATED', module: 'Fee Management', feeComponent: 'Examination Fee', level: 'Program', levelValue: 'MBA', oldValue: '₹5,000', newValue: '₹10,000', reason: 'MBA exam infrastructure cost', ipAddress: '192.168.1.12', referenceId: 'IMP-20260305', severity: 'INFO' },
  { id: 'a011', timestamp: '2026-03-05 11:00:00', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'FEE_OVERRIDE_CREATED', module: 'Fee Management', feeComponent: 'Lab Fee', level: 'Program', levelValue: 'BCA', oldValue: '₹8,000', newValue: '₹15,000', reason: 'BCA requires dedicated computer labs', ipAddress: '192.168.1.12', referenceId: 'v007', severity: 'INFO' },
  { id: 'a012', timestamp: '2026-03-01 09:00:00', user: 'Super Admin', userRole: 'SUPER_ADMIN', action: 'FEE_STRUCTURE_INITIALIZED', module: 'Fee Management', oldValue: '—', newValue: '12 fee components configured with global defaults', reason: 'Initial system setup for 2026-27', ipAddress: '10.0.0.1', referenceId: 'INIT-2026', severity: 'INFO' },
  { id: 'a013', timestamp: '2026-03-05 15:45:00', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'BULK_IMPORT_STARTED', module: 'Fee Management', oldValue: '—', newValue: 'File: fee_data_2026.xlsx · 10 rows', reason: 'Annual fee update', ipAddress: '192.168.1.12', referenceId: 'IMP-20260305', severity: 'INFO' },
  { id: 'a014', timestamp: '2026-03-10 14:05:00', user: 'Finance Admin', userRole: 'FINANCE_ADMIN', action: 'FEE_EXPORT_GENERATED', module: 'Fee Management', oldValue: '—', newValue: 'All Fees · 12 components · 23 rules', reason: 'Monthly fee audit', ipAddress: '192.168.1.12', referenceId: 'EXP-20260310', severity: 'INFO' },
];

const SEVERITY_STYLES: Record<string, string> = {
  INFO: 'bg-blue-50 text-blue-700 border-blue-200',
  WARNING: 'bg-amber-50 text-amber-700 border-amber-200',
  CRITICAL: 'bg-red-50 text-red-700 border-red-200',
};

const ACTION_ICONS: Record<string, string> = {
  FEE_OVERRIDE_CREATED: '➕',
  FEE_OVERRIDE_UPDATED: '✏️',
  FEE_OVERRIDE_DEACTIVATED: '🚫',
  GLOBAL_DEFAULT_UPDATED: '🌐',
  BULK_IMPORT_STARTED: '📥',
  BULK_IMPORT_COMPLETED: '✅',
  FEE_STRUCTURE_INITIALIZED: '🏗️',
  FEE_EXPORT_GENERATED: '📤',
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const uniqueActions = Array.from(new Set(DEMO_AUDIT.map(a => a.action)));

  const filtered = DEMO_AUDIT.filter(a => {
    const matchSearch = a.user.toLowerCase().includes(search.toLowerCase()) || a.action.toLowerCase().includes(search.toLowerCase()) || (a.feeComponent || '').toLowerCase().includes(search.toLowerCase()) || a.referenceId.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === 'All' || a.severity === severityFilter;
    const matchAction = actionFilter === 'All' || a.action === actionFilter;
    return matchSearch && matchSeverity && matchAction;
  });

  return (
    <AppShell activePath="/fee-management/audit-logs">
      <div className="p-6 max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/fee-management" className="text-[#94A3B8] hover:text-[#1E3A5F] text-sm">← Fee Management</Link>
            <span className="text-[#E2E8F0]">/</span>
            <h1 className="text-xl font-bold text-[#1E3A5F]">Audit Logs</h1>
          </div>
          <button className="flex items-center gap-2 border border-[#E2E8F0] text-[#374151] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC]">
            <span>📤</span> Export Audit Log
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl">🔍</span>
          <div>
            <p className="text-sm font-semibold text-[#9A3412]">Complete Audit Trail</p>
            <p className="text-xs text-[#9A3412] mt-0.5">Every sensitive fee management action is tracked with user, timestamp, IP, old value, new value, and reason. Audit logs are immutable and cannot be deleted.</p>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Events', value: DEMO_AUDIT.length, color: 'bg-slate-50 border-slate-200 text-slate-700' },
            { label: 'Critical', value: DEMO_AUDIT.filter(a => a.severity === 'CRITICAL').length, color: 'bg-red-50 border-red-200 text-red-700' },
            { label: 'Warnings', value: DEMO_AUDIT.filter(a => a.severity === 'WARNING').length, color: 'bg-amber-50 border-amber-200 text-amber-700' },
            { label: 'Info', value: DEMO_AUDIT.filter(a => a.severity === 'INFO').length, color: 'bg-blue-50 border-blue-200 text-blue-700' },
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user, action, component, ref ID..." className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#0EA5E9]" />
          </div>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:border-[#0EA5E9]">
            <option>All</option>
            <option>CRITICAL</option>
            <option>WARNING</option>
            <option>INFO</option>
          </select>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:border-[#0EA5E9] max-w-[200px]">
            <option>All</option>
            {uniqueActions.map(a => <option key={a}>{a}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:border-[#0EA5E9]" />
            <span className="text-[#94A3B8] text-xs">to</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:border-[#0EA5E9]" />
          </div>
          <span className="text-sm text-[#64748B]">{filtered.length} events</span>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Component</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Old → New</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Severity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Ref ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => {
                const isExpanded = expandedId === entry.id;
                return (
                  <React.Fragment key={entry.id}>
                    <tr className={`border-b border-[#E2E8F0] hover:bg-[#F8FAFC] ${entry.severity === 'CRITICAL' ? 'bg-red-50/30' : ''}`}>
                      <td className="px-4 py-3 text-xs text-[#64748B] font-mono whitespace-nowrap">{entry.timestamp}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold text-[#1E3A5F]">{entry.user}</p>
                          <p className="text-xs text-[#94A3B8]">{entry.userRole}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span>{ACTION_ICONS[entry.action] || '📌'}</span>
                          <span className="text-xs font-medium text-[#374151] whitespace-nowrap">{entry.action.replace(/_/g, ' ')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {entry.feeComponent ? (
                          <div>
                            <p className="text-xs font-medium text-[#1E3A5F]">{entry.feeComponent}</p>
                            {entry.level && <p className="text-xs text-[#94A3B8]">{entry.level} → {entry.levelValue}</p>}
                          </div>
                        ) : <span className="text-[#94A3B8] text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {entry.oldValue && entry.newValue ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-[#94A3B8] line-through">{entry.oldValue}</span>
                            <span className="text-[#94A3B8]">→</span>
                            <span className="font-semibold text-[#1E3A5F]">{entry.newValue}</span>
                          </div>
                        ) : <span className="text-[#94A3B8] text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SEVERITY_STYLES[entry.severity]}`}>{entry.severity}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#64748B]">{entry.referenceId}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setExpandedId(isExpanded ? null : entry.id)} className="text-xs text-[#0EA5E9] hover:underline">{isExpanded ? 'Hide' : 'Details'}</button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div><p className="text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">IP Address</p><p className="text-[#1E3A5F] font-mono">{entry.ipAddress}</p></div>
                            <div><p className="text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Module</p><p className="text-[#1E3A5F]">{entry.module}</p></div>
                            <div><p className="text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Reference ID</p><p className="text-[#1E3A5F] font-mono">{entry.referenceId}</p></div>
                            <div><p className="text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Severity</p><span className={`px-2 py-0.5 rounded-full border font-medium ${SEVERITY_STYLES[entry.severity]}`}>{entry.severity}</span></div>
                            {entry.reason && <div className="md:col-span-4"><p className="text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">Reason</p><p className="text-[#374151]">{entry.reason}</p></div>}
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
