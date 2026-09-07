'use client';
import React, { useState, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
type ImportStep = 'upload' | 'mapping' | 'validation' | 'conflict' | 'preview' | 'confirm' | 'result';
type RowStatus = 'valid' | 'invalid' | 'duplicate' | 'conflict' | 'skipped' | 'created' | 'updated' | 'failed';
type ImportMode = 'CREATE' | 'UPDATE' | 'UPSERT' | 'DEACTIVATE';

interface ImportRow {
  rowNum: number;
  feeComponent: string;
  level: string;
  levelValue: string;
  amount: string;
  currency: string;
  mandatory: string;
  refundable: string;
  taxPercent: string;
  validFrom: string;
  validTo: string;
  frequency: string;
  status: RowStatus;
  errors: string[];
  warnings: string[];
}

interface ColumnMapping {
  sourceCol: string;
  targetField: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────
const TEMPLATE_COLUMNS = [
  'Institute', 'Branch', 'Academic Year', 'Program', 'Course', 'Batch',
  'Fee Head', 'Override Level', 'Level Value', 'Default Amount', 'Override Amount',
  'Effective Amount', 'Currency', 'Tax %', 'Mandatory', 'Refundable',
  'Frequency', 'Due Date', 'Late Fee Rule', 'Valid From', 'Valid To',
  'Status', 'Description', 'Accounting Code', 'Cost Center',
];

const TARGET_FIELDS = [
  { key: 'feeComponent', label: 'Fee Component *', required: true },
  { key: 'level', label: 'Override Level *', required: true },
  { key: 'levelValue', label: 'Level Value *', required: true },
  { key: 'amount', label: 'Amount *', required: true },
  { key: 'currency', label: 'Currency', required: false },
  { key: 'mandatory', label: 'Mandatory', required: false },
  { key: 'refundable', label: 'Refundable', required: false },
  { key: 'taxPercent', label: 'Tax %', required: false },
  { key: 'validFrom', label: 'Valid From', required: false },
  { key: 'validTo', label: 'Valid To', required: false },
  { key: 'frequency', label: 'Frequency', required: false },
  { key: 'skip', label: '— Skip Column —', required: false },
];

const MOCK_IMPORT_ROWS: ImportRow[] = [
  { rowNum: 2, feeComponent: 'Tuition Fee', level: 'Program', levelValue: 'MBA', amount: '400000', currency: 'INR', mandatory: 'Yes', refundable: 'No', taxPercent: '0', validFrom: '2026-04-01', validTo: '2027-03-31', frequency: 'Per Year', status: 'valid', errors: [], warnings: [] },
  { rowNum: 3, feeComponent: 'Hostel Fee', level: 'Branch', levelValue: 'Mumbai', amount: '90000', currency: 'INR', mandatory: 'No', refundable: 'Yes', taxPercent: '0', validFrom: '2026-04-01', validTo: '2027-03-31', frequency: 'Per Year', status: 'conflict', errors: [], warnings: ['Override already exists for Mumbai Branch — will update'] },
  { rowNum: 4, feeComponent: 'Application Fee', level: 'Course', levelValue: 'MBA Finance', amount: '3000', currency: 'INR', mandatory: 'Yes', refundable: 'No', taxPercent: '0', validFrom: '2026-04-01', validTo: '2027-03-31', frequency: 'One-Time', status: 'duplicate', errors: ['Exact duplicate of existing rule'], warnings: [] },
  { rowNum: 5, feeComponent: 'Lab Fee', level: 'Program', levelValue: 'BCA', amount: '', currency: 'INR', mandatory: 'Yes', refundable: 'No', taxPercent: '18', validFrom: '2026-04-01', validTo: '2027-03-31', frequency: 'Per Year', status: 'invalid', errors: ['Amount is required'], warnings: [] },
  { rowNum: 6, feeComponent: 'Transport Fee', level: 'Branch', levelValue: 'Delhi', amount: '18000', currency: 'INR', mandatory: 'No', refundable: 'No', taxPercent: '0', validFrom: '2026-04-01', validTo: '2027-03-31', frequency: 'Per Year', status: 'valid', errors: [], warnings: [] },
  { rowNum: 7, feeComponent: 'Examination Fee', level: 'Program', levelValue: 'MBA', amount: '10000', currency: 'INR', mandatory: 'Yes', refundable: 'No', taxPercent: '18', validFrom: '2026-04-01', validTo: '2027-03-31', frequency: 'Per Semester', status: 'valid', errors: [], warnings: [] },
  { rowNum: 8, feeComponent: 'Library Fee', level: 'Global', levelValue: 'All Courses', amount: '3000', currency: 'INR', mandatory: 'Yes', refundable: 'No', taxPercent: '0', validFrom: '2026-04-01', validTo: '2027-03-31', frequency: 'Per Year', status: 'duplicate', errors: ['Exact duplicate of existing rule'], warnings: [] },
  { rowNum: 9, feeComponent: 'Mess Fee', level: 'Global', levelValue: 'Hostel Students', amount: '36000', currency: 'INR', mandatory: 'No', refundable: 'No', taxPercent: '5', validFrom: '2026-04-01', validTo: '2027-03-31', frequency: 'Per Year', status: 'valid', errors: [], warnings: [] },
  { rowNum: 10, feeComponent: 'INVALID_FEE', level: 'Branch', levelValue: 'Mumbai', amount: '5000', currency: 'INR', mandatory: 'Yes', refundable: 'No', taxPercent: '0', validFrom: '2026-04-01', validTo: '2027-03-31', frequency: 'One-Time', status: 'invalid', errors: ['Fee component "INVALID_FEE" not found in system'], warnings: [] },
  { rowNum: 11, feeComponent: 'Certification Fee', level: 'Program', levelValue: 'MBA', amount: '2500', currency: 'INR', mandatory: 'Yes', refundable: 'No', taxPercent: '0', validFrom: '2026-04-01', validTo: '2027-03-31', frequency: 'One-Time', status: 'valid', errors: [], warnings: [] },
];

const STATUS_STYLES: Record<RowStatus, string> = {
  valid: 'bg-green-50 text-green-700 border-green-200',
  invalid: 'bg-red-50 text-red-700 border-red-200',
  duplicate: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  conflict: 'bg-orange-50 text-orange-700 border-orange-200',
  skipped: 'bg-gray-50 text-gray-600 border-gray-200',
  created: 'bg-green-50 text-green-700 border-green-200',
  updated: 'bg-blue-50 text-blue-700 border-blue-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

const STEPS: { key: ImportStep; label: string; icon: string }[] = [
  { key: 'upload', label: 'Upload', icon: '📤' },
  { key: 'mapping', label: 'Column Mapping', icon: '🗂️' },
  { key: 'validation', label: 'Validation', icon: '✅' },
  { key: 'conflict', label: 'Conflict Check', icon: '⚠️' },
  { key: 'preview', label: 'Preview', icon: '👁️' },
  { key: 'confirm', label: 'Confirm', icon: '🔒' },
  { key: 'result', label: 'Result', icon: '🎉' },
];

function fmt(n: number) { return '₹' + n.toLocaleString('en-IN'); }

export default function BulkImportPage() {
  const [step, setStep] = useState<ImportStep>('upload');
  const [importMode, setImportMode] = useState<ImportMode>('UPSERT');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [mappings, setMappings] = useState<ColumnMapping[]>(
    TEMPLATE_COLUMNS.slice(0, 12).map((col, i) => ({
      sourceCol: col,
      targetField: TARGET_FIELDS[Math.min(i, TARGET_FIELDS.length - 1)].key,
    }))
  );
  const [rows, setRows] = useState<ImportRow[]>(MOCK_IMPORT_ROWS);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [conflictAction, setConflictAction] = useState<'skip' | 'update' | 'overwrite'>('update');
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'update'>('skip');
  const [processing, setProcessing] = useState(false);
  const [importId] = useState('IMP-' + Date.now().toString().slice(-8));

  const stepIndex = STEPS.findIndex(s => s.key === step);

  const stats = {
    total: rows.length,
    valid: rows.filter(r => r.status === 'valid').length,
    invalid: rows.filter(r => r.status === 'invalid').length,
    duplicate: rows.filter(r => r.status === 'duplicate').length,
    conflict: rows.filter(r => r.status === 'conflict').length,
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setFileName(file.name); }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const goNext = () => {
    const idx = STEPS.findIndex(s => s.key === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].key);
  };

  const goPrev = () => {
    const idx = STEPS.findIndex(s => s.key === step);
    if (idx > 0) setStep(STEPS[idx - 1].key);
  };

  const handleConfirmImport = () => {
    setProcessing(true);
    setTimeout(() => {
      setRows(prev => prev.map(r => {
        if (r.status === 'valid') return { ...r, status: 'created' };
        if (r.status === 'conflict' && conflictAction !== 'skip') return { ...r, status: 'updated' };
        if (r.status === 'duplicate' && duplicateAction === 'update') return { ...r, status: 'updated' };
        if (r.status === 'invalid') return { ...r, status: 'failed' };
        return { ...r, status: 'skipped' };
      }));
      setProcessing(false);
      setStep('result');
    }, 2000);
  };

  const resultStats = {
    total: rows.length,
    created: rows.filter(r => r.status === 'created').length,
    updated: rows.filter(r => r.status === 'updated').length,
    skipped: rows.filter(r => r.status === 'skipped').length,
    failed: rows.filter(r => r.status === 'failed').length,
  };

  return (
    <AppShell activePath="/fee-management/bulk-import">
      <div className="p-6 max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/fee-management" className="text-[#94A3B8] hover:text-[#1E3A5F] text-sm">← Fee Management</Link>
            <span className="text-[#E2E8F0]">/</span>
            <h1 className="text-xl font-bold text-[#1E3A5F]">Bulk Import Fee Data</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8] font-mono bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg">Import ID: {importId}</span>
            <Link href="/fee-management/import-history" className="text-xs text-[#0EA5E9] hover:underline">View Import History</Link>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <div className="flex items-center gap-0 overflow-x-auto">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.key}>
                <div className={`flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer ${i <= stepIndex ? 'opacity-100' : 'opacity-40'}`} onClick={() => i < stepIndex && setStep(s.key)}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${i < stepIndex ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white' : i === stepIndex ? 'bg-white border-[#0EA5E9] text-[#0EA5E9]' : 'bg-white border-[#E2E8F0] text-[#94A3B8]'}`}>
                    {i < stepIndex ? '✓' : s.icon}
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${i === stepIndex ? 'text-[#0EA5E9]' : 'text-[#64748B]'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${i < stepIndex ? 'bg-[#0EA5E9]' : 'bg-[#E2E8F0]'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl">
          {/* STEP: Upload */}
          {step === 'upload' && (
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#1E3A5F]">Step 1: Upload File</h2>
                <p className="text-sm text-[#64748B] mt-1">Upload an Excel (.xlsx) or CSV file with fee data. Supports CREATE, UPDATE, UPSERT, and DEACTIVATE operations.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-2">Import Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['CREATE', 'UPDATE', 'UPSERT', 'DEACTIVATE'] as ImportMode[]).map(mode => (
                        <button key={mode} onClick={() => setImportMode(mode)} className={`p-3 rounded-xl border-2 text-left transition-colors ${importMode === mode ? 'border-[#0EA5E9] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#BAE6FD]'}`}>
                          <p className={`text-sm font-bold ${importMode === mode ? 'text-[#0EA5E9]' : 'text-[#1E3A5F]'}`}>{mode}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            {mode === 'CREATE' && 'Only create new rules'}
                            {mode === 'UPDATE' && 'Only update existing'}
                            {mode === 'UPSERT' && 'Create or update'}
                            {mode === 'DEACTIVATE' && 'Deactivate matched rules'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-[#0EA5E9] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#BAE6FD]'}`}
                  >
                    <div className="text-4xl mb-3">📁</div>
                    {fileName ? (
                      <div>
                        <p className="font-semibold text-[#1E3A5F]">{fileName}</p>
                        <p className="text-xs text-[#64748B] mt-1">File selected · 10 rows detected</p>
                        <button onClick={() => setFileName('')} className="text-xs text-red-500 hover:underline mt-2">Remove</button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-[#1E3A5F]">Drag & drop your file here</p>
                        <p className="text-xs text-[#64748B] mt-1">Supports .xlsx, .xls, .csv</p>
                        <label className="mt-3 inline-block cursor-pointer">
                          <span className="bg-[#0EA5E9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0284C7] transition-colors">Browse File</span>
                          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                    <h3 className="font-semibold text-[#1E3A5F] text-sm mb-3">📥 Download Template</h3>
                    <p className="text-xs text-[#64748B] mb-3">Download the standard template with all required columns and sample data.</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Full Template (All Columns)', icon: '📊' },
                        { label: 'Fee Heads Only Template', icon: '📋' },
                        { label: 'Overrides Template', icon: '🔀' },
                        { label: 'Sample Data Template', icon: '📝' },
                      ].map(t => (
                        <button key={t.label} className="w-full flex items-center gap-2 p-2.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#BAE6FD] hover:bg-[#F0F9FF] transition-colors text-left">
                          <span>{t.icon}</span>
                          <span className="text-xs font-medium text-[#374151]">{t.label}</span>
                          <span className="ml-auto text-xs text-[#0EA5E9]">↓ .xlsx</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h3 className="font-semibold text-amber-800 text-sm mb-2">⚠️ Important Notes</h3>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>• Never silently overwrite custom overrides</li>
                      <li>• Existing invoices will NOT be affected by fee changes</li>
                      <li>• All changes are versioned and audited</li>
                      <li>• Partial import is supported — failed rows are skipped</li>
                      <li>• Download error file after import for failed rows</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP: Column Mapping */}
          {step === 'mapping' && (
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#1E3A5F]">Step 2: Column Mapping</h2>
                <p className="text-sm text-[#64748B] mt-1">Map your file columns to the system fields. Required fields are marked with *.</p>
              </div>
              <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-3 flex items-center gap-3">
                <span className="text-lg">📄</span>
                <div>
                  <p className="text-sm font-semibold text-[#0369A1]">{fileName || 'fee_data_2026.xlsx'}</p>
                  <p className="text-xs text-[#0369A1]">10 data rows · {TEMPLATE_COLUMNS.length} columns detected</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">File Column</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Sample Value</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Maps To</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEMPLATE_COLUMNS.slice(0, 12).map((col, i) => {
                      const mapping = mappings.find(m => m.sourceCol === col);
                      const targetField = TARGET_FIELDS.find(f => f.key === mapping?.targetField);
                      const sampleValues: Record<string, string> = {
                        'Institute': 'ABC Business School', 'Branch': 'Mumbai', 'Academic Year': '2026-27',
                        'Program': 'MBA', 'Course': 'MBA Finance', 'Batch': '2026-28',
                        'Fee Head': 'Tuition Fee', 'Override Level': 'Program', 'Level Value': 'MBA',
                        'Default Amount': '400000', 'Override Amount': '420000', 'Effective Amount': '420000',
                      };
                      return (
                        <tr key={col} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                          <td className="px-4 py-3 font-medium text-[#1E3A5F]">{col}</td>
                          <td className="px-4 py-3 text-[#64748B] font-mono text-xs">{sampleValues[col] || '—'}</td>
                          <td className="px-4 py-3">
                            <select
                              value={mapping?.targetField || 'skip'}
                              onChange={e => setMappings(prev => prev.map(m => m.sourceCol === col ? { ...m, targetField: e.target.value } : m))}
                              className="border border-[#E2E8F0] rounded-lg px-2 py-1.5 text-xs text-[#1E3A5F] focus:outline-none focus:border-[#0EA5E9] min-w-[180px]"
                            >
                              {TARGET_FIELDS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            {mapping?.targetField === 'skip' ? (
                              <span className="text-xs bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">Skipped</span>
                            ) : targetField?.required ? (
                              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">✓ Required</span>
                            ) : (
                              <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">Optional</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#374151] mb-2">Required Fields Status</p>
                <div className="flex gap-3 flex-wrap">
                  {TARGET_FIELDS.filter(f => f.required).map(f => (
                    <div key={f.key} className="flex items-center gap-1.5 text-xs">
                      <span className="text-green-500">✓</span>
                      <span className="text-[#374151]">{f.label.replace(' *', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP: Validation */}
          {step === 'validation' && (
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#1E3A5F]">Step 3: Validation Results</h2>
                <p className="text-sm text-[#64748B] mt-1">System validated all rows. Review errors and warnings before proceeding.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total Rows', value: stats.total, color: 'bg-slate-50 border-slate-200 text-slate-700' },
                  { label: 'Valid', value: stats.valid, color: 'bg-green-50 border-green-200 text-green-700' },
                  { label: 'Invalid', value: stats.invalid, color: 'bg-red-50 border-red-200 text-red-700' },
                  { label: 'Warnings', value: stats.conflict + stats.duplicate, color: 'bg-amber-50 border-amber-200 text-amber-700' },
                ].map(s => (
                  <div key={s.label} className={`border rounded-xl p-4 text-center ${s.color}`}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs font-medium mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Row</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Fee Component</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Level</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={row.rowNum} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                        <td className="px-4 py-3 text-[#94A3B8] font-mono text-xs">{row.rowNum}</td>
                        <td className="px-4 py-3 font-medium text-[#1E3A5F]">{row.feeComponent}</td>
                        <td className="px-4 py-3 text-[#64748B] text-xs">{row.level} → {row.levelValue}</td>
                        <td className="px-4 py-3 font-semibold text-[#1E3A5F]">{row.amount ? '₹' + Number(row.amount).toLocaleString('en-IN') : <span className="text-red-500">Missing</span>}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_STYLES[row.status]}`}>{row.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          {row.errors.map((e, i) => <p key={i} className="text-xs text-red-600">❌ {e}</p>)}
                          {row.warnings.map((w, i) => <p key={i} className="text-xs text-amber-600">⚠️ {w}</p>)}
                          {row.errors.length === 0 && row.warnings.length === 0 && <span className="text-xs text-green-600">✓ No issues</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {stats.invalid > 0 && (
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-lg">❌</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-700">{stats.invalid} invalid rows found</p>
                    <p className="text-xs text-red-600">These rows will be skipped during import. Download error file to fix and re-import.</p>
                  </div>
                  <button className="text-xs bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg font-medium hover:bg-red-200">↓ Error File</button>
                </div>
              )}
            </div>
          )}

          {/* STEP: Conflict Check */}
          {step === 'conflict' && (
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#1E3A5F]">Step 4: Conflict & Duplicate Check</h2>
                <p className="text-sm text-[#64748B] mt-1">Configure how to handle conflicts and duplicates. Existing overrides will NOT be silently overwritten.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E2E8F0] rounded-xl p-4">
                  <h3 className="font-semibold text-[#1E3A5F] text-sm mb-3 flex items-center gap-2"><span className="text-orange-500">⚠️</span> Conflicts ({stats.conflict} rows)</h3>
                  <p className="text-xs text-[#64748B] mb-3">Override rules already exist at the same level for these fee components.</p>
                  <div className="space-y-2">
                    {[
                      { key: 'skip', label: 'Skip', desc: 'Keep existing rule, skip import row' },
                      { key: 'update', label: 'Update', desc: 'Update existing rule with new values' },
                      { key: 'overwrite', label: 'Overwrite + Version', desc: 'Create new version, keep history' },
                    ].map(opt => (
                      <label key={opt.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${conflictAction === opt.key ? 'border-[#0EA5E9] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#BAE6FD]'}`}>
                        <input type="radio" name="conflict" value={opt.key} checked={conflictAction === opt.key} onChange={() => setConflictAction(opt.key as typeof conflictAction)} className="mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#1E3A5F]">{opt.label}</p>
                          <p className="text-xs text-[#64748B]">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-xl p-4">
                  <h3 className="font-semibold text-[#1E3A5F] text-sm mb-3 flex items-center gap-2"><span className="text-yellow-500">🔁</span> Duplicates ({stats.duplicate} rows)</h3>
                  <p className="text-xs text-[#64748B] mb-3">Exact duplicate rules already exist in the system.</p>
                  <div className="space-y-2">
                    {[
                      { key: 'skip', label: 'Skip', desc: 'Skip duplicate rows (recommended)' },
                      { key: 'update', label: 'Update Timestamp', desc: 'Re-save with updated timestamp' },
                    ].map(opt => (
                      <label key={opt.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${duplicateAction === opt.key ? 'border-[#0EA5E9] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#BAE6FD]'}`}>
                        <input type="radio" name="duplicate" value={opt.key} checked={duplicateAction === opt.key} onChange={() => setDuplicateAction(opt.key as typeof duplicateAction)} className="mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#1E3A5F]">{opt.label}</p>
                          <p className="text-xs text-[#64748B]">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                <h3 className="font-semibold text-[#1E3A5F] text-sm mb-3">Conflict Details</h3>
                {rows.filter(r => r.status === 'conflict' || r.status === 'duplicate').map(row => (
                  <div key={row.rowNum} className="flex items-start gap-3 p-3 rounded-lg border border-[#E2E8F0] bg-white mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[row.status]}`}>{row.status}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1E3A5F]">Row {row.rowNum}: {row.feeComponent} — {row.level} → {row.levelValue}</p>
                      {row.warnings.map((w, i) => <p key={i} className="text-xs text-amber-600 mt-0.5">{w}</p>)}
                      {row.errors.map((e, i) => <p key={i} className="text-xs text-red-600 mt-0.5">{e}</p>)}
                    </div>
                    <span className="font-bold text-[#1E3A5F] text-sm flex-shrink-0">₹{Number(row.amount).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP: Preview */}
          {step === 'preview' && (
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#1E3A5F]">Step 5: Import Preview</h2>
                <p className="text-sm text-[#64748B] mt-1">Review what will be imported. Select/deselect rows to include or exclude.</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => setSelectedRows(new Set(rows.filter(r => r.status !== 'invalid').map(r => r.rowNum)))} className="text-xs text-[#0EA5E9] hover:underline">Select All Valid</button>
                <button onClick={() => setSelectedRows(new Set())} className="text-xs text-[#64748B] hover:underline">Clear All</button>
                <span className="text-xs text-[#94A3B8]">{selectedRows.size} rows selected</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="px-4 py-3 w-10"><input type="checkbox" checked={selectedRows.size === rows.filter(r => r.status !== 'invalid').length} onChange={e => e.target.checked ? setSelectedRows(new Set(rows.filter(r => r.status !== 'invalid').map(r => r.rowNum))) : setSelectedRows(new Set())} /></th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Row</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Fee Component</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Level → Value</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Frequency</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Action</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => {
                      const isSelected = selectedRows.has(row.rowNum);
                      const isInvalid = row.status === 'invalid';
                      const action = row.status === 'conflict' && conflictAction !== 'skip' ? 'UPDATE' : row.status === 'duplicate' && duplicateAction === 'update' ? 'UPDATE' : row.status === 'valid' ? 'CREATE' : 'SKIP';
                      return (
                        <tr key={row.rowNum} className={`border-b border-[#E2E8F0] ${isInvalid ? 'opacity-50' : ''} ${isSelected ? 'bg-[#F0F9FF]' : 'hover:bg-[#F8FAFC]'}`}>
                          <td className="px-4 py-3"><input type="checkbox" checked={isSelected} disabled={isInvalid} onChange={e => { const s = new Set(selectedRows); e.target.checked ? s.add(row.rowNum) : s.delete(row.rowNum); setSelectedRows(s); }} /></td>
                          <td className="px-4 py-3 text-[#94A3B8] font-mono text-xs">{row.rowNum}</td>
                          <td className="px-4 py-3 font-medium text-[#1E3A5F]">{row.feeComponent}</td>
                          <td className="px-4 py-3 text-xs text-[#64748B]">{row.level} → {row.levelValue}</td>
                          <td className="px-4 py-3 font-semibold text-[#1E3A5F]">{row.amount ? '₹' + Number(row.amount).toLocaleString('en-IN') : '—'}</td>
                          <td className="px-4 py-3 text-xs text-[#64748B]">{row.frequency}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${action === 'CREATE' ? 'bg-green-50 text-green-700 border-green-200' : action === 'UPDATE' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{action}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_STYLES[row.status]}`}>{row.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP: Confirm */}
          {step === 'confirm' && (
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#1E3A5F]">Step 6: Confirm Import</h2>
                <p className="text-sm text-[#64748B] mt-1">Review the import summary and confirm. This action cannot be undone (but is fully versioned).</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Will Create', value: rows.filter(r => r.status === 'valid').length, color: 'bg-green-50 border-green-200 text-green-700' },
                  { label: 'Will Update', value: rows.filter(r => r.status === 'conflict' && conflictAction !== 'skip').length, color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  { label: 'Will Skip', value: rows.filter(r => r.status === 'duplicate' || (r.status === 'conflict' && conflictAction === 'skip')).length, color: 'bg-gray-50 border-gray-200 text-gray-600' },
                  { label: 'Will Fail', value: rows.filter(r => r.status === 'invalid').length, color: 'bg-red-50 border-red-200 text-red-700' },
                ].map(s => (
                  <div key={s.label} className={`border rounded-xl p-4 text-center ${s.color}`}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs font-medium mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-[#64748B]">Import Mode</span><span className="font-semibold text-[#1E3A5F]">{importMode}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#64748B]">File</span><span className="font-semibold text-[#1E3A5F]">{fileName || 'fee_data_2026.xlsx'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#64748B]">Conflict Action</span><span className="font-semibold text-[#1E3A5F] capitalize">{conflictAction}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#64748B]">Duplicate Action</span><span className="font-semibold text-[#1E3A5F] capitalize">{duplicateAction}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#64748B]">Import ID</span><span className="font-mono text-[#1E3A5F]">{importId}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#64748B]">Initiated By</span><span className="font-semibold text-[#1E3A5F]">Finance Admin</span></div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Confirm before proceeding</p>
                  <p className="text-xs text-amber-700 mt-1">All changes will be versioned and audited. Existing invoices will NOT be affected. Custom overrides will be preserved unless you selected "Overwrite".</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP: Result */}
          {step === 'result' && (
            <div className="p-6 space-y-6">
              <div className="text-center py-4">
                <div className="text-5xl mb-3">🎉</div>
                <h2 className="text-xl font-bold text-[#1E3A5F]">Import Complete!</h2>
                <p className="text-sm text-[#64748B] mt-1">Import ID: <span className="font-mono font-semibold">{importId}</span></p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: 'Total', value: resultStats.total, color: 'bg-slate-50 border-slate-200 text-slate-700' },
                  { label: 'Created', value: resultStats.created, color: 'bg-green-50 border-green-200 text-green-700' },
                  { label: 'Updated', value: resultStats.updated, color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  { label: 'Skipped', value: resultStats.skipped, color: 'bg-gray-50 border-gray-200 text-gray-600' },
                  { label: 'Failed', value: resultStats.failed, color: 'bg-red-50 border-red-200 text-red-700' },
                ].map(s => (
                  <div key={s.label} className={`border rounded-xl p-4 text-center ${s.color}`}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs font-medium mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Row</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Fee Component</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Level → Value</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={row.rowNum} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                        <td className="px-4 py-3 text-[#94A3B8] font-mono text-xs">{row.rowNum}</td>
                        <td className="px-4 py-3 font-medium text-[#1E3A5F]">{row.feeComponent}</td>
                        <td className="px-4 py-3 text-xs text-[#64748B]">{row.level} → {row.levelValue}</td>
                        <td className="px-4 py-3 font-semibold text-[#1E3A5F]">{row.amount ? '₹' + Number(row.amount).toLocaleString('en-IN') : '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_STYLES[row.status]}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {resultStats.failed > 0 && <button className="flex items-center gap-2 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-50">↓ Download Error File</button>}
                <button className="flex items-center gap-2 border border-[#E2E8F0] text-[#374151] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC]">↓ Download Import Report</button>
                <Link href="/fee-management" className="flex items-center gap-2 bg-[#0EA5E9] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#0284C7]">View Fee Management →</Link>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step !== 'result' && (
            <div className="border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
              <button onClick={goPrev} disabled={step === 'upload'} className="flex items-center gap-2 border border-[#E2E8F0] text-[#64748B] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed">← Back</button>
              <div className="flex items-center gap-3">
                <button className="border border-[#E2E8F0] text-[#374151] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC]">Save Draft</button>
                {step === 'confirm' ? (
                  <button onClick={handleConfirmImport} disabled={processing} className="bg-[#0EA5E9] text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-[#0284C7] disabled:opacity-60 flex items-center gap-2">
                    {processing ? <><span className="animate-spin">⟳</span> Processing...</> : '✓ Confirm Import'}
                  </button>
                ) : (
                  <button onClick={goNext} disabled={step === 'upload' && !fileName} className="bg-[#0EA5E9] text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-[#0284C7] disabled:opacity-60">
                    {step === 'upload' ? (fileName ? 'Continue →' : 'Upload File First') : 'Next →'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
