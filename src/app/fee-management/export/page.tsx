'use client';
import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';

interface ExportConfig {
  scope: string;
  format: 'xlsx' | 'csv';
  columns: string[];
  filters: {
    institute: string;
    branch: string;
    program: string;
    course: string;
    academicYear: string;
    status: string;
    feeComponent: string;
  };
}

const ALL_COLUMNS = [
  { key: 'institute', label: 'Institute', required: true },
  { key: 'branch', label: 'Branch', required: true },
  { key: 'academicYear', label: 'Academic Year', required: true },
  { key: 'program', label: 'Program', required: false },
  { key: 'course', label: 'Course', required: false },
  { key: 'batch', label: 'Batch', required: false },
  { key: 'feeHead', label: 'Fee Head', required: true },
  { key: 'overrideLevel', label: 'Override Level', required: true },
  { key: 'levelValue', label: 'Level Value', required: true },
  { key: 'defaultAmount', label: 'Default Amount', required: true },
  { key: 'overrideAmount', label: 'Override Amount', required: false },
  { key: 'effectiveAmount', label: 'Effective Amount', required: true },
  { key: 'currency', label: 'Currency', required: true },
  { key: 'taxPercent', label: 'Tax %', required: false },
  { key: 'mandatory', label: 'Mandatory', required: false },
  { key: 'refundable', label: 'Refundable', required: false },
  { key: 'frequency', label: 'Frequency', required: false },
  { key: 'dueDate', label: 'Due Date', required: false },
  { key: 'lateFeeRule', label: 'Late Fee Rule', required: false },
  { key: 'validFrom', label: 'Valid From', required: false },
  { key: 'validTo', label: 'Valid To', required: false },
  { key: 'status', label: 'Status', required: true },
  { key: 'source', label: 'Source', required: false },
  { key: 'updatedBy', label: 'Updated By', required: false },
  { key: 'updatedDate', label: 'Updated Date', required: false },
  { key: 'description', label: 'Description', required: false },
  { key: 'accountingCode', label: 'Accounting Code', required: false },
  { key: 'costCenter', label: 'Cost Center', required: false },
];

const EXPORT_SCOPES = [
  { key: 'all', label: 'All Fees', desc: 'Export all fee components and rules', icon: '📋', count: '23 rules' },
  { key: 'defaults', label: 'Global Defaults Only', desc: 'Export only global default rules', icon: '🌐', count: '12 rules' },
  { key: 'overrides', label: 'Overrides Only', desc: 'Export only override rules', icon: '🔀', count: '11 rules' },
  { key: 'active', label: 'Active Rules', desc: 'Export only active fee rules', icon: '✅', count: '20 rules' },
  { key: 'inactive', label: 'Inactive / Deactivated', desc: 'Export deactivated rules', icon: '🚫', count: '3 rules' },
  { key: 'selected', label: 'Selected Components', desc: 'Choose specific fee components', icon: '☑️', count: 'Custom' },
];

const IMPORT_HISTORY = [
  { id: 'IMP-20260312', date: '2026-03-12 14:30', file: 'fee_data_march2026.xlsx', mode: 'UPSERT', total: 10, created: 7, updated: 2, skipped: 0, failed: 1, by: 'Finance Admin' },
  { id: 'IMP-20260305', date: '2026-03-05 15:45', file: 'fee_update_2026.xlsx', mode: 'CREATE', total: 8, created: 6, updated: 0, skipped: 1, failed: 1, by: 'Finance Admin' },
  { id: 'IMP-20260301', date: '2026-03-01 09:00', file: 'initial_fee_setup.xlsx', mode: 'CREATE', total: 12, created: 12, updated: 0, skipped: 0, failed: 0, by: 'Super Admin' },
];

export default function ExportPage() {
  const [activeTab, setActiveTab] = useState<'export' | 'history'>('export');
  const [config, setConfig] = useState<ExportConfig>({
    scope: 'all',
    format: 'xlsx',
    columns: ALL_COLUMNS.filter(c => c.required).map(c => c.key),
    filters: { institute: 'ABC Business School', branch: 'All', program: 'All', course: 'All', academicYear: '2026-27', status: 'All', feeComponent: 'All' },
  });
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const toggleColumn = (key: string) => {
    setConfig(c => ({
      ...c,
      columns: c.columns.includes(key) ? c.columns.filter(k => k !== key) : [...c.columns, key],
    }));
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExported(true); setTimeout(() => setExported(false), 3000); }, 1500);
  };

  return (
    <AppShell activePath="/fee-management/export">
      <div className="p-6 max-w-[1100px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/fee-management" className="text-[#94A3B8] hover:text-[#1E3A5F] text-sm">← Fee Management</Link>
            <span className="text-[#E2E8F0]">/</span>
            <h1 className="text-xl font-bold text-[#1E3A5F]">Export Fee Data</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-xl w-fit">
          {[{ key: 'export', label: '📤 Export', }, { key: 'history', label: '📋 Import History' }].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-white text-[#1E3A5F] shadow-sm' : 'text-[#64748B] hover:text-[#1E3A5F]'}`}>{t.label}</button>
          ))}
        </div>

        {activeTab === 'export' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Scope */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                <h3 className="font-bold text-[#1E3A5F] mb-4">Export Scope</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {EXPORT_SCOPES.map(s => (
                    <button key={s.key} onClick={() => setConfig(c => ({ ...c, scope: s.key }))} className={`p-3 rounded-xl border-2 text-left transition-colors ${config.scope === s.key ? 'border-[#0EA5E9] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#BAE6FD]'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg">{s.icon}</span>
                        <span className="text-xs text-[#94A3B8] font-mono">{s.count}</span>
                      </div>
                      <p className={`text-sm font-semibold ${config.scope === s.key ? 'text-[#0EA5E9]' : 'text-[#1E3A5F]'}`}>{s.label}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                <h3 className="font-bold text-[#1E3A5F] mb-4">Filters</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'institute', label: 'Institute', opts: ['ABC Business School'] },
                    { key: 'branch', label: 'Branch', opts: ['All', 'Mumbai', 'Delhi', 'Pune', 'Bangalore'] },
                    { key: 'academicYear', label: 'Academic Year', opts: ['2026-27', '2025-26'] },
                    { key: 'program', label: 'Program', opts: ['All', 'MBA', 'BBA', 'BCA', 'MCA', 'PGDM'] },
                    { key: 'course', label: 'Course', opts: ['All', 'MBA Finance', 'MBA Marketing', 'MBA HR', 'BBA', 'BCA'] },
                    { key: 'status', label: 'Status', opts: ['All', 'ACTIVE', 'INACTIVE', 'DRAFT'] },
                    { key: 'feeComponent', label: 'Fee Component', opts: ['All', 'Tuition Fee', 'Hostel Fee', 'Transport Fee', 'Examination Fee', 'Application Fee'] },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-[#374151] mb-1.5">{f.label}</label>
                      <select value={(config.filters as Record<string, string>)[f.key]} onChange={e => setConfig(c => ({ ...c, filters: { ...c.filters, [f.key]: e.target.value } }))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E3A5F] focus:outline-none focus:border-[#0EA5E9]">
                        {f.opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columns */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1E3A5F]">Export Columns</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setConfig(c => ({ ...c, columns: ALL_COLUMNS.map(col => col.key) }))} className="text-xs text-[#0EA5E9] hover:underline">Select All</button>
                    <button onClick={() => setConfig(c => ({ ...c, columns: ALL_COLUMNS.filter(col => col.required).map(col => col.key) }))} className="text-xs text-[#64748B] hover:underline">Required Only</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {ALL_COLUMNS.map(col => (
                    <label key={col.key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${config.columns.includes(col.key) ? 'border-[#0EA5E9] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#BAE6FD]'}`}>
                      <input type="checkbox" checked={config.columns.includes(col.key)} disabled={col.required} onChange={() => !col.required && toggleColumn(col.key)} className="rounded" />
                      <span className="text-xs text-[#374151]">{col.label}</span>
                      {col.required && <span className="text-xs text-[#94A3B8] ml-auto">*</span>}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-[#94A3B8] mt-3">* Required columns cannot be deselected · {config.columns.length} of {ALL_COLUMNS.length} columns selected</p>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sticky top-6">
                <h3 className="font-bold text-[#1E3A5F] mb-4">Export Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-[#64748B]">Scope</span><span className="font-semibold text-[#1E3A5F]">{EXPORT_SCOPES.find(s => s.key === config.scope)?.label}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748B]">Estimated Rows</span><span className="font-semibold text-[#1E3A5F]">{EXPORT_SCOPES.find(s => s.key === config.scope)?.count}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748B]">Columns</span><span className="font-semibold text-[#1E3A5F]">{config.columns.length}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748B]">Academic Year</span><span className="font-semibold text-[#1E3A5F]">{config.filters.academicYear}</span></div>
                  <div className="flex justify-between"><span className="text-[#64748B]">Branch</span><span className="font-semibold text-[#1E3A5F]">{config.filters.branch}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <p className="text-xs font-semibold text-[#374151] mb-2">Format</p>
                  <div className="flex gap-2">
                    {(['xlsx', 'csv'] as const).map(f => (
                      <button key={f} onClick={() => setConfig(c => ({ ...c, format: f }))} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${config.format === f ? 'border-[#0EA5E9] bg-[#F0F9FF] text-[#0EA5E9]' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#BAE6FD]'}`}>.{f}</button>
                    ))}
                  </div>
                </div>
                <button onClick={handleExport} disabled={exporting} className="w-full mt-4 bg-[#0EA5E9] text-white rounded-xl py-3 text-sm font-bold hover:bg-[#0284C7] disabled:opacity-60 flex items-center justify-center gap-2">
                  {exporting ? <><span className="animate-spin">⟳</span> Generating...</> : exported ? '✅ Downloaded!' : `📤 Export .${config.format}`}
                </button>
                <p className="text-xs text-[#94A3B8] text-center mt-2">Export is logged in audit trail</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-[#1E3A5F]">Import History</h3>
              <p className="text-xs text-[#64748B] mt-0.5">All bulk import operations with results</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Import ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">File</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Mode</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-green-600 uppercase">Created</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-blue-600 uppercase">Updated</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Skipped</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-red-600 uppercase">Failed</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">By</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase"></th>
                </tr>
              </thead>
              <tbody>
                {IMPORT_HISTORY.map(imp => (
                  <tr key={imp.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-mono text-xs text-[#64748B]">{imp.id}</td>
                    <td className="px-4 py-3 text-xs text-[#64748B]">{imp.date}</td>
                    <td className="px-4 py-3 text-xs font-medium text-[#1E3A5F]">{imp.file}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full font-medium">{imp.mode}</span></td>
                    <td className="px-4 py-3 text-center font-semibold text-[#1E3A5F]">{imp.total}</td>
                    <td className="px-4 py-3 text-center font-semibold text-green-700">{imp.created}</td>
                    <td className="px-4 py-3 text-center font-semibold text-blue-700">{imp.updated}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-500">{imp.skipped}</td>
                    <td className="px-4 py-3 text-center font-semibold text-red-600">{imp.failed}</td>
                    <td className="px-4 py-3 text-xs text-[#64748B]">{imp.by}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-xs text-[#0EA5E9] hover:underline">View</button>
                        {imp.failed > 0 && <button className="text-xs text-red-500 hover:underline">↓ Errors</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
