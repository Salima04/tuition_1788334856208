'use client';
import React, { useState, useCallback } from 'react';
import AppShell from '@/components/AppShell';

// ─── Types ────────────────────────────────────────────────────────────────────

type FeeFrequency = 'One-Time' | 'Per Semester' | 'Per Year' | 'Per Month' | 'Per Term';
type FeeCategory =
  | 'Application Fee' | 'Registration Fee' | 'Admission Fee' | 'Tuition Fee' | 'Examination Fee' |'Library Fee'| 'Lab Fee' | 'Hostel Fee' | 'Mess Fee' | 'Transport Fee' | 'Course Material' |'Certification Fee' | 'Training Fee' | 'Placement Fee' | 'Technology Fee' | 'Miscellaneous Fee' | 'Custom Fee';

interface FeeComponent {
  id: string;
  feeHead: FeeCategory;
  customName: string;
  amount: number;
  quantity: number;
  frequency: FeeFrequency;
  mandatory: boolean;
  refundable: boolean;
  taxApplicable: boolean;
  taxPercent: number;
  dueDate: string;
  lateFeeApplicable: boolean;
  description: string;
  accountingCode: string;
  costCenter: string;
}

interface FeeStructure {
  id: string;
  name: string;
  code: string;
  program: string;
  course: string;
  academicYear: string;
  branch: string;
  components: FeeComponent[];
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdBy: string;
  createdDate: string;
  totalAmount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FEE_CATEGORIES: FeeCategory[] = [
  'Application Fee', 'Registration Fee', 'Admission Fee', 'Tuition Fee',
  'Examination Fee', 'Library Fee', 'Lab Fee', 'Hostel Fee', 'Mess Fee',
  'Transport Fee', 'Course Material', 'Certification Fee', 'Training Fee',
  'Placement Fee', 'Technology Fee', 'Miscellaneous Fee', 'Custom Fee',
];

const FREQUENCIES: FeeFrequency[] = [
  'One-Time', 'Per Semester', 'Per Year', 'Per Month', 'Per Term',
];

const CATEGORY_ICONS: Record<string, string> = {
  'Application Fee': '📋', 'Registration Fee': '📝', 'Admission Fee': '🎓',
  'Tuition Fee': '📚', 'Examination Fee': '📄', 'Library Fee': '📖',
  'Lab Fee': '🔬', 'Hostel Fee': '🏠', 'Mess Fee': '🍽️',
  'Transport Fee': '🚌', 'Course Material': '📦', 'Certification Fee': '🏆',
  'Training Fee': '💼', 'Placement Fee': '🤝', 'Technology Fee': '💻',
  'Miscellaneous Fee': '🔧', 'Custom Fee': '✏️',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Application Fee': 'bg-violet-50 text-violet-700 border-violet-200',
  'Registration Fee': 'bg-blue-50 text-blue-700 border-blue-200',
  'Admission Fee': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Tuition Fee': 'bg-sky-50 text-sky-700 border-sky-200',
  'Examination Fee': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Library Fee': 'bg-teal-50 text-teal-700 border-teal-200',
  'Lab Fee': 'bg-green-50 text-green-700 border-green-200',
  'Hostel Fee': 'bg-lime-50 text-lime-700 border-lime-200',
  'Mess Fee': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Transport Fee': 'bg-orange-50 text-orange-700 border-orange-200',
  'Course Material': 'bg-amber-50 text-amber-700 border-amber-200',
  'Certification Fee': 'bg-rose-50 text-rose-700 border-rose-200',
  'Training Fee': 'bg-pink-50 text-pink-700 border-pink-200',
  'Placement Fee': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  'Technology Fee': 'bg-purple-50 text-purple-700 border-purple-200',
  'Miscellaneous Fee': 'bg-slate-50 text-slate-600 border-slate-200',
  'Custom Fee': 'bg-gray-50 text-gray-600 border-gray-200',
};

const DEMO_STRUCTURES: FeeStructure[] = [
  {
    id: 'fs-001', name: 'MBA Standard Fee Structure', code: 'FS-MBA-STD-2627',
    program: 'MBA', course: 'MBA Finance', academicYear: '2026-27', branch: 'Mumbai',
    status: 'ACTIVE', createdBy: 'Finance Admin', createdDate: '15 Mar 2026', totalAmount: 515000,
    components: [
      { id: 'c1', feeHead: 'Admission Fee', customName: '', amount: 25000, quantity: 1, frequency: 'One-Time', mandatory: true, refundable: false, taxApplicable: false, taxPercent: 0, dueDate: '2026-07-01', lateFeeApplicable: false, description: 'One-time admission processing fee', accountingCode: 'ADM-001', costCenter: 'Admissions' },
      { id: 'c2', feeHead: 'Tuition Fee', customName: '', amount: 400000, quantity: 1, frequency: 'Per Year', mandatory: true, refundable: false, taxApplicable: false, taxPercent: 0, dueDate: '2026-07-15', lateFeeApplicable: true, description: 'Annual tuition fee for MBA program', accountingCode: 'TUT-001', costCenter: 'Academics' },
      { id: 'c3', feeHead: 'Examination Fee', customName: '', amount: 10000, quantity: 1, frequency: 'Per Semester', mandatory: true, refundable: false, taxApplicable: false, taxPercent: 0, dueDate: '2026-08-01', lateFeeApplicable: false, description: 'Semester examination fee', accountingCode: 'EXM-001', costCenter: 'Examinations' },
      { id: 'c4', feeHead: 'Library Fee', customName: '', amount: 5000, quantity: 1, frequency: 'Per Year', mandatory: true, refundable: false, taxApplicable: false, taxPercent: 0, dueDate: '2026-07-15', lateFeeApplicable: false, description: 'Annual library access fee', accountingCode: 'LIB-001', costCenter: 'Library' },
      { id: 'c5', feeHead: 'Technology Fee', customName: '', amount: 15000, quantity: 1, frequency: 'Per Year', mandatory: true, refundable: false, taxApplicable: true, taxPercent: 18, dueDate: '2026-07-15', lateFeeApplicable: false, description: 'IT infrastructure and software access', accountingCode: 'TECH-001', costCenter: 'IT' },
      { id: 'c6', feeHead: 'Hostel Fee', customName: '', amount: 80000, quantity: 1, frequency: 'Per Year', mandatory: false, refundable: true, taxApplicable: false, taxPercent: 0, dueDate: '2026-07-15', lateFeeApplicable: false, description: 'Optional hostel accommodation', accountingCode: 'HST-001', costCenter: 'Hostel' },
    ],
  },
  {
    id: 'fs-002', name: 'BBA Standard Fee Structure', code: 'FS-BBA-STD-2627',
    program: 'BBA', course: 'BBA', academicYear: '2026-27', branch: 'Mumbai',
    status: 'ACTIVE', createdBy: 'Finance Admin', createdDate: '15 Mar 2026', totalAmount: 180000,
    components: [
      { id: 'c7', feeHead: 'Admission Fee', customName: '', amount: 10000, quantity: 1, frequency: 'One-Time', mandatory: true, refundable: false, taxApplicable: false, taxPercent: 0, dueDate: '2026-07-01', lateFeeApplicable: false, description: '', accountingCode: 'ADM-002', costCenter: 'Admissions' },
      { id: 'c8', feeHead: 'Tuition Fee', customName: '', amount: 150000, quantity: 1, frequency: 'Per Year', mandatory: true, refundable: false, taxApplicable: false, taxPercent: 0, dueDate: '2026-07-15', lateFeeApplicable: true, description: '', accountingCode: 'TUT-002', costCenter: 'Academics' },
      { id: 'c9', feeHead: 'Examination Fee', customName: '', amount: 8000, quantity: 1, frequency: 'Per Semester', mandatory: true, refundable: false, taxApplicable: false, taxPercent: 0, dueDate: '2026-08-01', lateFeeApplicable: false, description: '', accountingCode: 'EXM-002', costCenter: 'Examinations' },
      { id: 'c10', feeHead: 'Library Fee', customName: '', amount: 3000, quantity: 1, frequency: 'Per Year', mandatory: true, refundable: false, taxApplicable: false, taxPercent: 0, dueDate: '2026-07-15', lateFeeApplicable: false, description: '', accountingCode: 'LIB-002', costCenter: 'Library' },
    ],
  },
  {
    id: 'fs-003', name: 'BCA Standard Fee Structure', code: 'FS-BCA-STD-2627',
    program: 'BCA', course: 'BCA', academicYear: '2026-27', branch: 'Delhi',
    status: 'DRAFT', createdBy: 'Finance Admin', createdDate: '20 Mar 2026', totalAmount: 120000,
    components: [],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId() {
  return 'c-' + Math.random().toString(36).slice(2, 9);
}

function calcComponentTotal(c: FeeComponent): number {
  const base = c.amount * c.quantity;
  const tax = c.taxApplicable ? base * (c.taxPercent / 100) : 0;
  return base + tax;
}

function calcStructureTotals(components: FeeComponent[]) {
  const mandatory = components.filter(c => c.mandatory);
  const optional = components.filter(c => !c.mandatory);
  const grossMandatory = mandatory.reduce((s, c) => s + c.amount * c.quantity, 0);
  const grossOptional = optional.reduce((s, c) => s + c.amount * c.quantity, 0);
  const taxTotal = components.reduce((s, c) => {
    if (!c.taxApplicable) return s;
    return s + c.amount * c.quantity * (c.taxPercent / 100);
  }, 0);
  const grandTotal = grossMandatory + taxTotal;
  return { grossMandatory, grossOptional, taxTotal, grandTotal };
}

function emptyComponent(): FeeComponent {
  return {
    id: genId(), feeHead: 'Tuition Fee', customName: '', amount: 0, quantity: 1,
    frequency: 'One-Time', mandatory: true, refundable: false, taxApplicable: false,
    taxPercent: 18, dueDate: '', lateFeeApplicable: false, description: '',
    accountingCode: '', costCenter: '',
  };
}

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: FeeStructure['status'] }) {
  const map = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
    ARCHIVED: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  const dot = { ACTIVE: 'bg-emerald-500', DRAFT: 'bg-amber-500', ARCHIVED: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}

// ─── Pricing Preview Panel ────────────────────────────────────────────────────

function PricingPreviewPanel({ components }: { components: FeeComponent[] }) {
  const { grossMandatory, grossOptional, taxTotal, grandTotal } = calcStructureTotals(components);
  const mandatoryComponents = components.filter(c => c.mandatory);
  const optionalComponents = components.filter(c => !c.mandatory);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden sticky top-4 shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F2744] to-[#1E3A5F] px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Live Preview</span>
        </div>
        <h3 className="text-white font-bold text-base">Pricing Summary</h3>
        <p className="text-white/50 text-xs mt-0.5">Updates as you configure</p>
      </div>

      <div className="p-5 space-y-4">
        {components.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[#94A3B8] text-xs font-medium">Add fee components to see the pricing breakdown</p>
          </div>
        ) : (
          <>
            {/* Mandatory */}
            {mandatoryComponents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F]" />
                  <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">Mandatory</p>
                </div>
                <div className="space-y-2">
                  {mandatoryComponents.map(c => (
                    <div key={c.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-xs px-1.5 py-0.5 rounded border font-medium flex-shrink-0 ${CATEGORY_COLORS[c.feeHead] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                          {CATEGORY_ICONS[c.feeHead] || '💰'}
                        </span>
                        <span className="text-xs text-[#475569] truncate">{c.customName || c.feeHead}</span>
                      </div>
                      <span className="text-xs font-bold text-[#1E3A5F] tabular-nums ml-2 flex-shrink-0">{fmt(c.amount * c.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional */}
            {optionalComponents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                  <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Optional</p>
                </div>
                <div className="space-y-2">
                  {optionalComponents.map(c => (
                    <div key={c.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs px-1.5 py-0.5 rounded border bg-slate-50 text-slate-400 border-slate-200 flex-shrink-0">
                          {CATEGORY_ICONS[c.feeHead] || '💰'}
                        </span>
                        <span className="text-xs text-[#94A3B8] truncate">{c.customName || c.feeHead}</span>
                      </div>
                      <span className="text-xs text-[#94A3B8] tabular-nums ml-2 flex-shrink-0">{fmt(c.amount * c.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-dashed border-[#E2E8F0] pt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Subtotal (Mandatory)</span>
                <span className="text-[#1E3A5F] font-semibold tabular-nums">{fmt(grossMandatory)}</span>
              </div>
              {grossOptional > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Optional (if selected)</span>
                  <span className="text-[#94A3B8] tabular-nums">+{fmt(grossOptional)}</span>
                </div>
              )}
              {taxTotal > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748B]">GST / Tax</span>
                  <span className="text-amber-600 font-medium tabular-nums">+{fmt(taxTotal)}</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="bg-gradient-to-r from-[#F0F9FF] to-[#EFF6FF] border border-[#BAE6FD] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-[#0369A1] font-medium">Total Payable</p>
                  <p className="text-[10px] text-[#7DD3FC] mt-0.5">Mandatory fees · excl. optional</p>
                </div>
                <p className="text-xl font-black text-[#0369A1] tabular-nums">{fmt(grandTotal)}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-1 rounded-full border border-emerald-200 font-medium">
                {mandatoryComponents.length} Mandatory
              </span>
              {optionalComponents.length > 0 && (
                <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-1 rounded-full border border-amber-200 font-medium">
                  {optionalComponents.length} Optional
                </span>
              )}
              {components.filter(c => c.taxApplicable).length > 0 && (
                <span className="bg-yellow-50 text-yellow-700 text-[10px] px-2 py-1 rounded-full border border-yellow-200 font-medium">
                  {components.filter(c => c.taxApplicable).length} Taxable
                </span>
              )}
              {components.filter(c => c.refundable).length > 0 && (
                <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-full border border-blue-200 font-medium">
                  {components.filter(c => c.refundable).length} Refundable
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Fee Component Row ────────────────────────────────────────────────────────

interface ComponentRowProps {
  component: FeeComponent;
  index: number;
  onChange: (id: string, field: keyof FeeComponent, value: unknown) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

function ComponentRow({ component, index, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown, isFirst, isLast }: ComponentRowProps) {
  const [expanded, setExpanded] = useState(false);
  const lineTotal = calcComponentTotal(component);
  const colorClass = CATEGORY_COLORS[component.feeHead] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div className={`border rounded-xl bg-white overflow-hidden transition-all ${expanded ? 'border-[#0EA5E9] shadow-sm shadow-[#0EA5E9]/10' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'}`}>
      {/* Row header */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Order controls */}
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button onClick={() => onMoveUp(index)} disabled={isFirst} className="text-[#CBD5E1] hover:text-[#64748B] disabled:opacity-20 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
          </button>
          <button onClick={() => onMoveDown(index)} disabled={isLast} className="text-[#CBD5E1] hover:text-[#64748B] disabled:opacity-20 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        {/* Index */}
        <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] text-[#64748B] text-xs font-bold flex items-center justify-center flex-shrink-0 border border-[#E2E8F0]">
          {index + 1}
        </div>

        {/* Fee head */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold flex-shrink-0 ${colorClass}`}>
              {CATEGORY_ICONS[component.feeHead] || '💰'}
            </span>
            <select
              value={component.feeHead}
              onChange={e => onChange(component.id, 'feeHead', e.target.value as FeeCategory)}
              className="text-sm font-semibold text-[#1E3A5F] border-0 bg-transparent focus:outline-none cursor-pointer"
            >
              {FEE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {component.feeHead === 'Custom Fee' && (
            <input
              value={component.customName}
              onChange={e => onChange(component.id, 'customName', e.target.value)}
              placeholder="Enter custom fee name..."
              className="mt-1 text-xs text-[#64748B] border-b border-dashed border-[#CBD5E1] bg-transparent focus:outline-none w-full"
            />
          )}
        </div>

        {/* Amount input */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[#94A3B8] text-sm font-medium">₹</span>
          <input
            type="number"
            value={component.amount || ''}
            onChange={e => onChange(component.id, 'amount', parseFloat(e.target.value) || 0)}
            className="w-28 text-sm font-bold text-[#1E3A5F] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] text-right tabular-nums bg-[#FAFBFC]"
            placeholder="0"
          />
        </div>

        {/* Frequency */}
        <select
          value={component.frequency}
          onChange={e => onChange(component.id, 'frequency', e.target.value as FeeFrequency)}
          className="text-xs text-[#64748B] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 flex-shrink-0 bg-[#FAFBFC]"
        >
          {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        {/* Toggle badges */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onChange(component.id, 'mandatory', !component.mandatory)}
            className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${component.mandatory ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] hover:border-[#CBD5E1]'}`}
          >
            {component.mandatory ? 'Mandatory' : 'Optional'}
          </button>
          <button
            onClick={() => onChange(component.id, 'refundable', !component.refundable)}
            className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${component.refundable ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] hover:border-[#CBD5E1]'}`}
          >
            {component.refundable ? 'Refundable' : 'Non-Refund'}
          </button>
        </div>

        {/* Line total */}
        <div className="text-right flex-shrink-0 w-28">
          <p className="text-sm font-black text-[#1E3A5F] tabular-nums">{fmt(lineTotal)}</p>
          {component.taxApplicable && (
            <p className="text-[10px] text-amber-600 font-medium">+{fmt(component.amount * component.quantity * component.taxPercent / 100)} GST</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => setExpanded(e => !e)}
            className={`p-1.5 rounded-lg transition-all ${expanded ? 'bg-[#0EA5E9] text-white' : 'text-[#94A3B8] hover:text-[#1E3A5F] hover:bg-[#F1F5F9]'}`}
            title="Configure"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button onClick={() => onDuplicate(component.id)} className="p-1.5 text-[#94A3B8] hover:text-[#0EA5E9] hover:bg-[#F0F9FF] rounded-lg transition-colors" title="Duplicate">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button onClick={() => onDelete(component.id)} className="p-1.5 text-[#94A3B8] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded config */}
      {expanded && (
        <div className="border-t border-[#F1F5F9] bg-[#F8FAFC] px-4 py-4">
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Advanced Configuration</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">Quantity</label>
              <input
                type="number"
                value={component.quantity}
                min={1}
                onChange={e => onChange(component.id, 'quantity', parseInt(e.target.value) || 1)}
                className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">Due Date</label>
              <input
                type="date"
                value={component.dueDate}
                onChange={e => onChange(component.id, 'dueDate', e.target.value)}
                className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">Accounting Code</label>
              <input
                value={component.accountingCode}
                onChange={e => onChange(component.id, 'accountingCode', e.target.value)}
                placeholder="e.g. TUT-001"
                className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">Cost Center</label>
              <input
                value={component.costCenter}
                onChange={e => onChange(component.id, 'costCenter', e.target.value)}
                placeholder="e.g. Academics"
                className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 bg-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">Description</label>
              <input
                value={component.description}
                onChange={e => onChange(component.id, 'description', e.target.value)}
                placeholder="Brief description..."
                className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 bg-white"
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => onChange(component.id, 'taxApplicable', !component.taxApplicable)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${component.taxApplicable ? 'bg-[#0EA5E9]' : 'bg-[#CBD5E1]'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${component.taxApplicable ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs text-[#64748B] font-medium">GST Applicable</span>
              </label>
              {component.taxApplicable && (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={component.taxPercent}
                    min={0}
                    max={100}
                    onChange={e => onChange(component.id, 'taxPercent', parseFloat(e.target.value) || 0)}
                    className="w-16 text-sm border border-[#E2E8F0] rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 bg-white text-right"
                  />
                  <span className="text-xs text-[#64748B]">%</span>
                </div>
              )}
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => onChange(component.id, 'lateFeeApplicable', !component.lateFeeApplicable)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${component.lateFeeApplicable ? 'bg-[#0EA5E9]' : 'bg-[#CBD5E1]'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${component.lateFeeApplicable ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs text-[#64748B] font-medium">Late Fee Rule</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pricing Builder (create/edit) ────────────────────────────────────────────

interface BuilderProps {
  initial?: FeeStructure | null;
  onSave: (fs: FeeStructure) => void;
  onCancel: () => void;
}

function PricingBuilder({ initial, onSave, onCancel }: BuilderProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [code, setCode] = useState(initial?.code ?? '');
  const [program, setProgram] = useState(initial?.program ?? 'MBA');
  const [course, setCourse] = useState(initial?.course ?? 'MBA Finance');
  const [academicYear, setAcademicYear] = useState(initial?.academicYear ?? '2026-27');
  const [branch, setBranch] = useState(initial?.branch ?? 'Mumbai');
  const [components, setComponents] = useState<FeeComponent[]>(initial?.components ?? []);

  const addComponent = () => setComponents(prev => [...prev, emptyComponent()]);

  const updateComponent = useCallback((id: string, field: keyof FeeComponent, value: unknown) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
  }, []);

  const duplicateComponent = useCallback((id: string) => {
    setComponents(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const copy = { ...prev[idx], id: genId() };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }, []);

  const moveUp = useCallback((index: number) => {
    if (index === 0) return;
    setComponents(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setComponents(prev => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const handleSave = (status: FeeStructure['status']) => {
    const { grandTotal } = calcStructureTotals(components);
    onSave({
      id: initial?.id ?? 'fs-' + genId(),
      name, code, program, course, academicYear, branch, components,
      status,
      createdBy: initial?.createdBy ?? 'Finance Admin',
      createdDate: initial?.createdDate ?? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalAmount: grandTotal,
    });
  };

  const quickAddCategories = FEE_CATEGORIES.slice(0, 9);

  return (
    <div className="flex gap-6 h-full">
      {/* Left: Builder Canvas */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Step 1: Structure Identity */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC]">
            <div className="w-7 h-7 rounded-lg bg-[#1E3A5F] text-white text-xs font-black flex items-center justify-center">1</div>
            <div>
              <h3 className="text-sm font-bold text-[#1E3A5F]">Structure Identity</h3>
              <p className="text-xs text-[#94A3B8]">Name, code, and scope of this pricing structure</p>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Structure Name <span className="text-red-500">*</span></label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. MBA Standard Fee Structure"
                  className="w-full text-sm border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] bg-[#FAFBFC]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Structure Code</label>
                <input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="e.g. FS-MBA-STD-2627"
                  className="w-full text-sm border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] bg-[#FAFBFC] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Program</label>
                <select value={program} onChange={e => setProgram(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] bg-[#FAFBFC]">
                  {['MBA', 'BBA', 'BCA', 'MCA', 'PGDM'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Course</label>
                <select value={course} onChange={e => setCourse(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] bg-[#FAFBFC]">
                  {['MBA Finance', 'MBA Marketing', 'MBA HR', 'BBA', 'BCA', 'MCA', 'PGDM'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Academic Year</label>
                <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] bg-[#FAFBFC]">
                  <option>2026-27</option>
                  <option>2025-26</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Branch / Campus</label>
                <select value={branch} onChange={e => setBranch(e.target.value)} className="w-full text-sm border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] bg-[#FAFBFC]">
                  {['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'All Branches'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Fee Components */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#1E3A5F] text-white text-xs font-black flex items-center justify-center">2</div>
              <div>
                <h3 className="text-sm font-bold text-[#1E3A5F]">
                  Fee Components
                  {components.length > 0 && (
                    <span className="ml-2 text-xs font-normal text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded-full">{components.length} added</span>
                  )}
                </h3>
                <p className="text-xs text-[#94A3B8]">Build your pricing by adding fee heads</p>
              </div>
            </div>
            <button
              onClick={addComponent}
              className="flex items-center gap-2 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Component
            </button>
          </div>

          <div className="px-5 pt-4 pb-3">
            {/* Quick-add chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="text-xs text-[#94A3B8] font-medium self-center mr-1">Quick add:</span>
              {quickAddCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setComponents(prev => [...prev, { ...emptyComponent(), feeHead: cat }])}
                  className="flex items-center gap-1 text-xs border border-dashed border-[#CBD5E1] rounded-full px-2.5 py-1 hover:border-[#0EA5E9] hover:text-[#0EA5E9] hover:bg-[#F0F9FF] transition-all text-[#64748B]"
                >
                  <span className="text-[10px]">{CATEGORY_ICONS[cat]}</span>
                  {cat.replace(' Fee', '')}
                </button>
              ))}
              <button
                onClick={() => setComponents(prev => [...prev, { ...emptyComponent(), feeHead: 'Custom Fee' }])}
                className="text-xs border border-dashed border-[#E2E8F0] rounded-full px-2.5 py-1 hover:border-[#0EA5E9] hover:text-[#0EA5E9] hover:bg-[#F0F9FF] transition-all text-[#94A3B8]"
              >
                + Custom
              </button>
            </div>

            {/* Component list */}
            {components.length === 0 ? (
              <div className="text-center py-14 border-2 border-dashed border-[#E2E8F0] rounded-xl bg-[#FAFBFC]">
                <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-[#1E3A5F] font-bold text-sm mb-1">No fee components yet</p>
                <p className="text-[#94A3B8] text-xs mb-4">Use quick-add chips above or click "Add Component"</p>
                <button onClick={addComponent} className="bg-[#1E3A5F] text-white text-xs font-bold px-5 py-2 rounded-xl hover:bg-[#162D4A] transition-colors">
                  + Add First Component
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {components.map((c, i) => (
                  <ComponentRow
                    key={c.id}
                    component={c}
                    index={i}
                    onChange={updateComponent}
                    onDelete={deleteComponent}
                    onDuplicate={duplicateComponent}
                    onMoveUp={moveUp}
                    onMoveDown={moveDown}
                    isFirst={i === 0}
                    isLast={i === components.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between bg-white border border-[#E2E8F0] rounded-2xl px-5 py-4 shadow-sm">
          <button onClick={onCancel} className="text-sm text-[#64748B] hover:text-[#1E3A5F] font-semibold px-4 py-2 rounded-xl hover:bg-[#F1F5F9] transition-colors">
            ← Cancel
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => handleSave('DRAFT')} className="text-sm text-[#1E3A5F] font-bold px-5 py-2.5 border-2 border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all">
              Save as Draft
            </button>
            <button
              onClick={() => handleSave('ACTIVE')}
              disabled={!name.trim() || components.length === 0}
              className="text-sm bg-gradient-to-r from-[#1E3A5F] to-[#0F2744] hover:from-[#162D4A] hover:to-[#0A1F33] text-white font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Publish Pricing Structure
            </button>
          </div>
        </div>
      </div>

      {/* Right: Pricing Preview */}
      <div className="w-72 flex-shrink-0">
        <PricingPreviewPanel components={components} />
      </div>
    </div>
  );
}

// ─── Fee Heads Reference Panel ────────────────────────────────────────────────

const COURSES_LIST = [
  'MBA Finance', 'MBA Marketing', 'MBA HR', 'BBA', 'BCA', 'MCA', 'PGDM',
];

interface FeeHeadAssignment {
  feeHeadCode: string;
  feeHeadName: string;
  assignMode: 'all' | 'course-wise';
  globalAmount: number;
  courseAmounts: Record<string, number>;
}

function FeeHeadsPanel() {
  const feeHeadDetails = [
    { category: 'Application Fee', code: 'APP', description: 'Non-refundable application processing fee', taxable: false, refundable: false },
    { category: 'Registration Fee', code: 'REG', description: 'One-time student registration fee', taxable: false, refundable: false },
    { category: 'Admission Fee', code: 'ADM', description: 'Admission confirmation fee', taxable: false, refundable: false },
    { category: 'Tuition Fee', code: 'TUT', description: 'Core academic instruction fee', taxable: false, refundable: false },
    { category: 'Examination Fee', code: 'EXM', description: 'Per-semester examination fee', taxable: false, refundable: false },
    { category: 'Library Fee', code: 'LIB', description: 'Annual library access and resources', taxable: false, refundable: false },
    { category: 'Lab Fee', code: 'LAB', description: 'Laboratory usage and consumables', taxable: true, refundable: false },
    { category: 'Hostel Fee', code: 'HST', description: 'Accommodation charges (optional)', taxable: false, refundable: true },
    { category: 'Mess Fee', code: 'MSS', description: 'Dining and cafeteria charges', taxable: true, refundable: false },
    { category: 'Transport Fee', code: 'TRP', description: 'Bus/shuttle service charges', taxable: false, refundable: false },
    { category: 'Course Material', code: 'MAT', description: 'Books, notes, and study materials', taxable: true, refundable: false },
    { category: 'Certification Fee', code: 'CRT', description: 'Degree/certificate issuance fee', taxable: false, refundable: false },
    { category: 'Training Fee', code: 'TRN', description: 'Skill training and workshops', taxable: true, refundable: false },
    { category: 'Placement Fee', code: 'PLC', description: 'Career services and placement support', taxable: false, refundable: false },
    { category: 'Technology Fee', code: 'TCH', description: 'IT infrastructure, software, LMS access', taxable: true, refundable: false },
    { category: 'Miscellaneous Fee', code: 'MSC', description: 'Other administrative charges', taxable: false, refundable: false },
    { category: 'Custom Fee', code: 'CST', description: 'User-defined fee head', taxable: false, refundable: false },
  ];

  const initAssignments = (): Record<string, FeeHeadAssignment> => {
    const result: Record<string, FeeHeadAssignment> = {};
    feeHeadDetails.forEach(fh => {
      result[fh.code] = {
        feeHeadCode: fh.code,
        feeHeadName: fh.category,
        assignMode: 'all',
        globalAmount: fh.code === 'APP' ? 2000 : fh.code === 'TUT' ? 500000 : fh.code === 'ADM' ? 25000 : fh.code === 'HST' ? 80000 : fh.code === 'TRP' ? 20000 : 0,
        courseAmounts: {},
      };
    });
    return result;
  };

  const [assignments, setAssignments] = useState<Record<string, FeeHeadAssignment>>(initAssignments);
  const [assignPanelCode, setAssignPanelCode] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [importModal, setImportModal] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'done'>('upload');
  const [importFile, setImportFile] = useState<string | null>(null);
  const [importRows, setImportRows] = useState<Array<{ course: string; feeHead: string; amount: number; status: 'valid' | 'error' }>>([]);

  const showSaveToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const setMode = (code: string, mode: 'all' | 'course-wise') => {
    setAssignments(prev => ({ ...prev, [code]: { ...prev[code], assignMode: mode } }));
  };

  const setGlobalAmount = (code: string, amount: number) => {
    setAssignments(prev => ({ ...prev, [code]: { ...prev[code], globalAmount: amount } }));
  };

  const setCourseAmount = (code: string, course: string, amount: number) => {
    setAssignments(prev => ({
      ...prev,
      [code]: { ...prev[code], courseAmounts: { ...prev[code].courseAmounts, [course]: amount } },
    }));
  };

  const getEffectiveAmount = (code: string, course: string): number => {
    const a = assignments[code];
    if (!a) return 0;
    if (a.assignMode === 'all') return a.globalAmount;
    return a.courseAmounts[course] ?? a.globalAmount;
  };

  const handleExport = () => {
    const headers = ['Fee Head', 'Code', 'Assignment Mode', 'Global Amount', ...COURSES_LIST];
    const rows = feeHeadDetails.map(fh => {
      const a = assignments[fh.code];
      const courseVals = COURSES_LIST.map(c => a.assignMode === 'course-wise' ? (a.courseAmounts[c] ?? a.globalAmount) : a.globalAmount);
      return [fh.category, fh.code, a.assignMode === 'all' ? 'Assign to All' : 'Course-wise', a.globalAmount, ...courseVals];
    });
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fee_assignments.csv';
    a.click();
    URL.revokeObjectURL(url);
    showSaveToast('Fee assignments exported as CSV');
  };

  const handleImportUpload = (fileName: string) => {
    setImportFile(fileName);
    setImportRows([
      { course: 'MBA Finance', feeHead: 'Application Fee', amount: 2500, status: 'valid' },
      { course: 'MBA Marketing', feeHead: 'Application Fee', amount: 2000, status: 'valid' },
      { course: 'BBA', feeHead: 'Application Fee', amount: 1500, status: 'valid' },
      { course: 'BCA', feeHead: 'Tuition Fee', amount: 120000, status: 'valid' },
      { course: 'MCA', feeHead: 'Tuition Fee', amount: 150000, status: 'valid' },
      { course: 'INVALID_COURSE', feeHead: 'Lab Fee', amount: 5000, status: 'error' },
    ]);
    setImportStep('preview');
  };

  const handleImportConfirm = () => {
    const validRows = importRows.filter(r => r.status === 'valid');
    setAssignments(prev => {
      const next = { ...prev };
      validRows.forEach(row => {
        const fh = feeHeadDetails.find(f => f.category === row.feeHead);
        if (!fh) return;
        next[fh.code] = {
          ...next[fh.code],
          assignMode: 'course-wise',
          courseAmounts: { ...next[fh.code].courseAmounts, [row.course]: row.amount },
        };
      });
      return next;
    });
    setImportStep('done');
    showSaveToast(`${validRows.length} fee assignments imported successfully`);
  };

  const closeImport = () => {
    setImportModal(false);
    setImportStep('upload');
    setImportFile(null);
    setImportRows([]);
  };

  return (
    <div className="space-y-4">
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold bg-emerald-600 text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          {saveToast}
        </div>
      )}

      {/* Fee Heads Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between flex-wrap gap-3 bg-[#FAFBFC]">
          <div>
            <h3 className="text-sm font-bold text-[#1E3A5F]">Fee Heads Reference</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">Configure global and course-wise pricing for each fee head</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="flex items-center gap-1.5 text-xs text-[#1E3A5F] border border-[#E2E8F0] px-3 py-1.5 rounded-lg hover:bg-[#F8FAFC] font-semibold transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
            <button onClick={() => { setImportModal(true); setImportStep('upload'); }} className="flex items-center gap-1.5 text-xs bg-[#1E3A5F] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#162D4A] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" /></svg>
              Import
            </button>
            <span className="bg-[#F0F9FF] text-[#0EA5E9] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#BAE6FD]">
              {feeHeadDetails.length} Heads
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="text-left px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">Fee Head</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">Code</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">Description</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">GST</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">Refundable</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeHeadDetails.map((fh, i) => (
                <React.Fragment key={fh.code}>
                  <tr className={`border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFBFC]'}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${CATEGORY_COLORS[fh.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                          {CATEGORY_ICONS[fh.category] || '💰'}
                        </span>
                        <span className="font-semibold text-[#1E3A5F] text-sm">{fh.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-[#F1F5F9] text-[#64748B] px-2 py-1 rounded-md border border-[#E2E8F0]">{fh.code}</span>
                    </td>
                    <td className="px-4 py-3 text-[#64748B] text-xs">{fh.description}</td>
                    <td className="px-4 py-3 text-center">
                      {fh.taxable
                        ? <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-50 text-amber-600 rounded-full text-xs border border-amber-200">✓</span>
                        : <span className="text-[#CBD5E1] text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {fh.refundable
                        ? <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-50 text-blue-600 rounded-full text-xs border border-blue-200">✓</span>
                        : <span className="text-[#CBD5E1] text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setAssignPanelCode(assignPanelCode === fh.code ? null : fh.code)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${assignPanelCode === fh.code ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' : 'bg-white text-[#1E3A5F] border-[#E2E8F0] hover:bg-[#F0F9FF] hover:border-[#0EA5E9]'}`}
                      >
                        {assignPanelCode === fh.code ? '▲ Close' : '⚙ Configure'}
                      </button>
                    </td>
                  </tr>

                  {assignPanelCode === fh.code && (
                    <tr key={fh.code + '-panel'}>
                      <td colSpan={6} className="px-0 py-0 bg-[#F0F9FF] border-b border-[#BAE6FD]">
                        <div className="px-6 py-5">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`text-sm px-2.5 py-1 rounded-lg border font-semibold ${CATEGORY_COLORS[fh.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                              {CATEGORY_ICONS[fh.category] || '💰'} {fh.category}
                            </span>
                            <p className="text-xs text-[#64748B]">Choose assignment mode for this fee head</p>
                          </div>

                          <div className="flex gap-3 mb-5">
                            <button
                              onClick={() => setMode(fh.code, 'all')}
                              className={`flex items-start gap-3 flex-1 p-4 rounded-xl border-2 text-left transition-all ${assignments[fh.code]?.assignMode === 'all' ? 'border-[#0EA5E9] bg-white shadow-sm' : 'border-[#E2E8F0] bg-white/60 hover:border-[#BAE6FD]'}`}
                            >
                              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${assignments[fh.code]?.assignMode === 'all' ? 'border-[#0EA5E9]' : 'border-[#CBD5E1]'}`}>
                                {assignments[fh.code]?.assignMode === 'all' && <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#1E3A5F]">Assign to All Courses</p>
                                <p className="text-xs text-[#64748B] mt-0.5">One global amount applied to every course</p>
                              </div>
                            </button>
                            <button
                              onClick={() => setMode(fh.code, 'course-wise')}
                              className={`flex items-start gap-3 flex-1 p-4 rounded-xl border-2 text-left transition-all ${assignments[fh.code]?.assignMode === 'course-wise' ? 'border-[#0EA5E9] bg-white shadow-sm' : 'border-[#E2E8F0] bg-white/60 hover:border-[#BAE6FD]'}`}
                            >
                              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${assignments[fh.code]?.assignMode === 'course-wise' ? 'border-[#0EA5E9]' : 'border-[#CBD5E1]'}`}>
                                {assignments[fh.code]?.assignMode === 'course-wise' && <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#1E3A5F]">Course-wise Override</p>
                                <p className="text-xs text-[#64748B] mt-0.5">Different amounts per course with overrides</p>
                              </div>
                            </button>
                          </div>

                          {assignments[fh.code]?.assignMode === 'all' && (
                            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                              <div className="flex items-end gap-4">
                                <div className="flex-1 max-w-xs">
                                  <label className="block text-xs font-bold text-[#475569] mb-1.5">Global Amount (all courses)</label>
                                  <div className="flex items-center border border-[#E2E8F0] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0EA5E9]/20 focus-within:border-[#0EA5E9]">
                                    <span className="px-3 py-2.5 bg-[#F8FAFC] text-[#64748B] text-sm font-bold border-r border-[#E2E8F0]">₹</span>
                                    <input
                                      type="number"
                                      value={assignments[fh.code]?.globalAmount || ''}
                                      onChange={e => setGlobalAmount(fh.code, parseFloat(e.target.value) || 0)}
                                      placeholder="Enter amount"
                                      className="flex-1 px-3 py-2.5 text-sm font-bold text-[#1E3A5F] focus:outline-none tabular-nums"
                                    />
                                  </div>
                                </div>
                                <button
                                  onClick={() => showSaveToast(`${fh.category} set to ₹${(assignments[fh.code]?.globalAmount || 0).toLocaleString('en-IN')} for all courses`)}
                                  className="bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
                                >
                                  Apply to All
                                </button>
                              </div>
                              {assignments[fh.code]?.globalAmount > 0 && (
                                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                  <p className="text-xs text-emerald-700 font-semibold">
                                    ✓ {fh.category} = <span className="font-black">₹{(assignments[fh.code]?.globalAmount || 0).toLocaleString('en-IN')}</span> applied to all {COURSES_LIST.length} courses
                                  </p>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {COURSES_LIST.map(c => (
                                      <span key={c} className="text-xs bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">{c}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {assignments[fh.code]?.assignMode === 'course-wise' && (
                            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
                              <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#F1F5F9] flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-bold text-[#1E3A5F]">Course-wise Fee Override</p>
                                  <p className="text-xs text-[#94A3B8] mt-0.5">Leave blank to use global default</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-[#94A3B8]">Global default:</span>
                                  <div className="flex items-center border border-[#E2E8F0] rounded-lg overflow-hidden">
                                    <span className="px-2 py-1 bg-[#F1F5F9] text-[#64748B] text-xs border-r border-[#E2E8F0] font-bold">₹</span>
                                    <input
                                      type="number"
                                      value={assignments[fh.code]?.globalAmount || ''}
                                      onChange={e => setGlobalAmount(fh.code, parseFloat(e.target.value) || 0)}
                                      placeholder="0"
                                      className="w-24 px-2 py-1 text-xs font-bold text-[#1E3A5F] focus:outline-none tabular-nums"
                                    />
                                  </div>
                                </div>
                              </div>
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-[#F1F5F9]">
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Course</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Override Amount</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Effective</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Source</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {COURSES_LIST.map((course, ci) => {
                                    const overrideVal = assignments[fh.code]?.courseAmounts[course];
                                    const effectiveAmt = getEffectiveAmount(fh.code, course);
                                    const isOverridden = overrideVal !== undefined && overrideVal !== assignments[fh.code]?.globalAmount;
                                    return (
                                      <tr key={course} className={`border-b border-[#F8FAFC] hover:bg-[#F8FAFC] ${ci % 2 === 0 ? '' : 'bg-[#FAFBFC]'}`}>
                                        <td className="px-4 py-2.5">
                                          <span className="text-xs font-semibold text-[#1E3A5F]">{course}</span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                          <div className="flex items-center border border-[#E2E8F0] rounded-lg overflow-hidden w-36 focus-within:ring-2 focus-within:ring-[#0EA5E9]/20">
                                            <span className="px-2 py-1.5 bg-[#F8FAFC] text-[#94A3B8] text-xs border-r border-[#E2E8F0] font-bold">₹</span>
                                            <input
                                              type="number"
                                              value={overrideVal ?? ''}
                                              onChange={e => setCourseAmount(fh.code, course, parseFloat(e.target.value) || 0)}
                                              placeholder={`${assignments[fh.code]?.globalAmount || 0}`}
                                              className="flex-1 px-2 py-1.5 text-xs font-bold text-[#1E3A5F] focus:outline-none tabular-nums bg-transparent"
                                            />
                                          </div>
                                        </td>
                                        <td className="px-4 py-2.5">
                                          <span className={`text-sm font-black tabular-nums ${isOverridden ? 'text-[#0EA5E9]' : 'text-[#64748B]'}`}>
                                            ₹{effectiveAmt.toLocaleString('en-IN')}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                          {isOverridden
                                            ? <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">Override</span>
                                            : <span className="text-xs bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] px-2 py-0.5 rounded-full">Global</span>
                                          }
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                              <div className="px-4 py-3 border-t border-[#F1F5F9] flex justify-end">
                                <button
                                  onClick={() => showSaveToast(`${fh.category} course-wise assignments saved`)}
                                  className="bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors"
                                >
                                  Save Assignments
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {importModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0F2744] to-[#1E3A5F] px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-black text-base">Import Fee Assignments</h3>
                <p className="text-white/60 text-xs mt-0.5">
                  {importStep === 'upload' ? 'Step 1 of 3 — Upload your CSV/Excel file' : importStep === 'preview' ? 'Step 2 of 3 — Validate & Preview' : 'Step 3 of 3 — Import Complete'}
                </p>
              </div>
              <button onClick={closeImport} className="text-white/60 hover:text-white transition-colors p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex border-b border-[#F1F5F9]">
              {['Upload', 'Preview & Validate', 'Done'].map((step, idx) => {
                const stepKey = ['upload', 'preview', 'done'][idx];
                const isActive = importStep === stepKey;
                const isDone = (importStep === 'preview' && idx === 0) || (importStep === 'done' && idx <= 1);
                return (
                  <div key={step} className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors ${isActive ? 'border-[#0EA5E9] text-[#0EA5E9]' : isDone ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-[#94A3B8]'}`}>
                    {isDone ? '✓ ' : ''}{step}
                  </div>
                );
              })}
            </div>

            <div className="p-6">
              {importStep === 'upload' && (
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-10 text-center hover:border-[#0EA5E9] hover:bg-[#F0F9FF] transition-all cursor-pointer"
                    onClick={() => handleImportUpload('fee_assignments_upload.csv')}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <p className="text-sm font-bold text-[#1E3A5F] mb-1">Click to upload or drag & drop</p>
                    <p className="text-xs text-[#94A3B8]">Supports CSV, XLS, XLSX — Max 10MB</p>
                    <button className="mt-4 bg-[#1E3A5F] text-white text-xs font-bold px-5 py-2 rounded-xl hover:bg-[#162D4A] transition-colors">
                      Browse File
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl">
                    <span className="text-lg">💡</span>
                    <p className="text-xs text-[#0369A1]">
                      Use <strong>Export CSV</strong> to download current assignments as a template. Edit amounts and re-import.
                    </p>
                  </div>
                </div>
              )}

              {importStep === 'preview' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <p className="text-xs font-bold text-emerald-700">{importFile}</p>
                      <p className="text-xs text-emerald-600">{importRows.length} rows · {importRows.filter(r => r.status === 'valid').length} valid · {importRows.filter(r => r.status === 'error').length} errors</p>
                    </div>
                  </div>

                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-[#F8FAFC]">
                        <tr className="border-b border-[#F1F5F9]">
                          <th className="text-left px-3 py-2 font-bold text-[#64748B]">Course</th>
                          <th className="text-left px-3 py-2 font-bold text-[#64748B]">Fee Head</th>
                          <th className="text-right px-3 py-2 font-bold text-[#64748B]">Amount</th>
                          <th className="text-center px-3 py-2 font-bold text-[#64748B]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importRows.map((row, idx) => (
                          <tr key={idx} className={`border-b border-[#F8FAFC] ${row.status === 'error' ? 'bg-red-50' : ''}`}>
                            <td className="px-3 py-2 text-[#1E3A5F] font-semibold">{row.course}</td>
                            <td className="px-3 py-2 text-[#64748B]">{row.feeHead}</td>
                            <td className="px-3 py-2 text-right font-bold text-[#1E3A5F] tabular-nums">₹{row.amount.toLocaleString('en-IN')}</td>
                            <td className="px-3 py-2 text-center">
                              {row.status === 'valid'
                                ? <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">Valid</span>
                                : <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-semibold">Error</span>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {importRows.some(r => r.status === 'error') && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <p className="text-xs text-red-600 font-medium">{importRows.filter(r => r.status === 'error').length} rows have errors and will be skipped. Valid rows will still be imported.</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button onClick={() => setImportStep('upload')} className="text-sm text-[#64748B] border border-[#E2E8F0] px-4 py-2 rounded-xl hover:bg-[#F8FAFC] font-semibold transition-colors">
                      ← Back
                    </button>
                    <button onClick={handleImportConfirm} className="bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-sm font-bold px-6 py-2 rounded-xl transition-colors">
                      Confirm Import ({importRows.filter(r => r.status === 'valid').length} rows)
                    </button>
                  </div>
                </div>
              )}

              {importStep === 'done' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#1E3A5F]">Import Successful</h4>
                    <p className="text-sm text-[#64748B] mt-1">{importRows.filter(r => r.status === 'valid').length} fee assignments imported</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <p className="text-xl font-black text-emerald-700">{importRows.filter(r => r.status === 'valid').length}</p>
                      <p className="text-xs text-emerald-600 font-medium">Imported</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-xl font-black text-red-600">{importRows.filter(r => r.status === 'error').length}</p>
                      <p className="text-xs text-red-500 font-medium">Skipped</p>
                    </div>
                    <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-3">
                      <p className="text-xl font-black text-[#0EA5E9]">{importRows.length}</p>
                      <p className="text-xs text-[#0EA5E9] font-medium">Total</p>
                    </div>
                  </div>
                  <button onClick={closeImport} className="bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-sm font-bold px-8 py-2.5 rounded-xl transition-colors">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type View = 'list' | 'create' | 'edit' | 'detail';

export default function PricingBuilderPage() {
  const [structures, setStructures] = useState<FeeStructure[]>(DEMO_STRUCTURES);
  const [view, setView] = useState<View>('list');
  const [editTarget, setEditTarget] = useState<FeeStructure | null>(null);
  const [detailTarget, setDetailTarget] = useState<FeeStructure | null>(null);
  const [activeTab, setActiveTab] = useState<'structures' | 'feeheads'>('structures');
  const [search, setSearch] = useState('');
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (fs: FeeStructure) => {
    setStructures(prev => {
      const idx = prev.findIndex(s => s.id === fs.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = fs;
        return next;
      }
      return [fs, ...prev];
    });
    setView('list');
    showToast(fs.status === 'DRAFT' ? 'Pricing structure saved as draft.' : 'Pricing structure published successfully!');
  };

  const handleEdit = (fs: FeeStructure) => {
    setEditTarget(fs);
    setView('edit');
  };

  const handleDuplicate = (fs: FeeStructure) => {
    const copy: FeeStructure = {
      ...fs,
      id: 'fs-' + genId(),
      name: fs.name + ' (Copy)',
      code: fs.code + '-COPY',
      status: 'DRAFT',
      createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setStructures(prev => [copy, ...prev]);
    showToast('Pricing structure duplicated as draft.');
  };

  const handleArchive = (id: string) => {
    setStructures(prev => prev.map(s => s.id === id ? { ...s, status: 'ARCHIVED' } : s));
    showToast('Pricing structure archived.');
  };

  const filtered = structures.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase());
    const matchProgram = filterProgram === 'All' || s.program === filterProgram;
    const matchStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchSearch && matchProgram && matchStatus;
  });

  // ── Detail view ──
  if (view === 'detail' && detailTarget) {
    const { grossMandatory, grossOptional, taxTotal, grandTotal } = calcStructureTotals(detailTarget.components);
    return (
      <AppShell activePath="/fee-structures">
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <button onClick={() => setView('list')} className="hover:text-[#0EA5E9] transition-colors font-medium">Pricing Builder</button>
            <span>›</span>
            <span className="text-[#1E3A5F] font-semibold">{detailTarget.name}</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-black text-[#1E3A5F]">{detailTarget.name}</h1>
                <StatusBadge status={detailTarget.status} />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-[#F1F5F9] text-[#64748B] px-2 py-1 rounded-lg border border-[#E2E8F0]">{detailTarget.code}</span>
                <span className="text-xs text-[#94A3B8]">{detailTarget.program} · {detailTarget.course} · {detailTarget.academicYear} · {detailTarget.branch}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(detailTarget)} className="flex items-center gap-2 text-sm text-[#1E3A5F] border border-[#E2E8F0] px-4 py-2 rounded-xl hover:bg-[#F8FAFC] font-semibold transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit
              </button>
              <button onClick={() => handleDuplicate(detailTarget)} className="flex items-center gap-2 text-sm text-[#64748B] border border-[#E2E8F0] px-4 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Duplicate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Gross (Mandatory)', value: fmt(grossMandatory), color: 'text-[#1E3A5F]', bg: 'bg-[#F8FAFC]', border: 'border-[#E2E8F0]' },
              { label: 'Optional Fees', value: fmt(grossOptional), color: 'text-[#64748B]', bg: 'bg-[#F8FAFC]', border: 'border-[#E2E8F0]' },
              { label: 'GST / Tax', value: fmt(taxTotal), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
              { label: 'Total Payable', value: fmt(grandTotal), color: 'text-[#0369A1]', bg: 'bg-[#F0F9FF]', border: 'border-[#BAE6FD]' },
            ].map(card => (
              <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-4`}>
                <p className="text-xs text-[#94A3B8] font-medium mb-1">{card.label}</p>
                <p className={`text-xl font-black tabular-nums ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-[#F1F5F9] bg-[#FAFBFC] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E3A5F]">Fee Components <span className="text-[#94A3B8] font-normal">({detailTarget.components.length})</span></h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                  {['Fee Head', 'Amount', 'Qty', 'Frequency', 'Type', 'GST', 'Refundable', 'Late Fee', 'Total'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detailTarget.components.map((c, i) => (
                  <tr key={c.id} className={`border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFBFC]'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold ${CATEGORY_COLORS[c.feeHead] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                          {CATEGORY_ICONS[c.feeHead]}
                        </span>
                        <span className="font-semibold text-[#1E3A5F]">{c.customName || c.feeHead}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-[#1E3A5F] font-semibold">{fmt(c.amount)}</td>
                    <td className="px-4 py-3 text-[#64748B]">{c.quantity}</td>
                    <td className="px-4 py-3 text-[#64748B] text-xs">{c.frequency}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${c.mandatory ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'}`}>
                        {c.mandatory ? 'Mandatory' : 'Optional'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748B]">{c.taxApplicable ? <span className="text-amber-600 font-semibold">{c.taxPercent}%</span> : '—'}</td>
                    <td className="px-4 py-3 text-xs">{c.refundable ? <span className="text-blue-600 font-semibold">Yes</span> : <span className="text-[#94A3B8]">No</span>}</td>
                    <td className="px-4 py-3 text-xs">{c.lateFeeApplicable ? <span className="text-red-500 font-semibold">Yes</span> : <span className="text-[#94A3B8]">No</span>}</td>
                    <td className="px-4 py-3 tabular-nums font-black text-[#1E3A5F]">{fmt(calcComponentTotal(c))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#F0F9FF] border-t-2 border-[#BAE6FD]">
                  <td className="px-4 py-3 font-black text-[#0369A1] text-sm" colSpan={8}>Total Payable (Mandatory + GST)</td>
                  <td className="px-4 py-3 font-black text-[#0369A1] text-sm tabular-nums">{fmt(grandTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Create / Edit view ──
  if (view === 'create' || view === 'edit') {
    return (
      <AppShell activePath="/fee-structures">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-5">
            <button onClick={() => setView('list')} className="hover:text-[#0EA5E9] transition-colors font-medium">Pricing Builder</button>
            <span>›</span>
            <span className="text-[#1E3A5F] font-semibold">{view === 'create' ? 'New Pricing Structure' : `Edit: ${editTarget?.name}`}</span>
          </div>

          {/* Builder header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-black text-[#1E3A5F]">
                {view === 'create' ? 'Build New Pricing Structure' : 'Edit Pricing Structure'}
              </h1>
              <p className="text-sm text-[#64748B] mt-0.5">Configure fee components, amounts, and rules for this pricing structure</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">Auto-calculating</span>
            </div>
          </div>

          <PricingBuilder
            initial={view === 'edit' ? editTarget : null}
            onSave={handleSave}
            onCancel={() => setView('list')}
          />
        </div>
      </AppShell>
    );
  }

  // ── List view ──
  return (
    <AppShell activePath="/fee-structures">
      <div className="p-6 space-y-5">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {toast.type === 'success'
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              }
            </svg>
            {toast.msg}
          </div>
        )}

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#0F2744] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-black text-[#1E3A5F]">Pricing Builder</h1>
            </div>
            <p className="text-sm text-[#64748B]">Build, configure and manage fee pricing structures for programs and courses</p>
          </div>
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#1E3A5F] to-[#0F2744] hover:from-[#162D4A] hover:to-[#0A1F33] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Pricing Structure
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Structures', value: structures.length, icon: '🏗️', bg: 'bg-[#F8FAFC]', border: 'border-[#E2E8F0]', color: 'text-[#1E3A5F]' },
            { label: 'Active', value: structures.filter(s => s.status === 'ACTIVE').length, icon: '✅', bg: 'bg-emerald-50', border: 'border-emerald-200', color: 'text-emerald-700' },
            { label: 'Draft', value: structures.filter(s => s.status === 'DRAFT').length, icon: '📝', bg: 'bg-amber-50', border: 'border-amber-200', color: 'text-amber-700' },
            { label: 'Archived', value: structures.filter(s => s.status === 'ARCHIVED').length, icon: '📦', bg: 'bg-slate-50', border: 'border-slate-200', color: 'text-slate-500' },
          ].map(card => (
            <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-4 flex items-center gap-4`}>
              <span className="text-2xl">{card.icon}</span>
              <div>
                <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
                <p className="text-xs text-[#94A3B8] font-medium">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-xl w-fit border border-[#E2E8F0]">
          {([
            { key: 'structures', label: 'Pricing Structures', icon: '🏗️' },
            { key: 'feeheads', label: 'Fee Heads Config', icon: '⚙️' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-sm font-bold px-5 py-2 rounded-lg transition-all ${activeTab === tab.key ? 'bg-white text-[#1E3A5F] shadow-sm' : 'text-[#64748B] hover:text-[#1E3A5F]'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'feeheads' ? (
          <FeeHeadsPanel />
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl px-5 py-4 flex items-center gap-4 flex-wrap shadow-sm">
              <div className="flex-1 min-w-48 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, code, or course..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] bg-[#FAFBFC]"
                />
              </div>
              <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} className="text-sm border border-[#E2E8F0] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 text-[#64748B] bg-[#FAFBFC]">
                <option value="All">All Programs</option>
                {['MBA', 'BBA', 'BCA', 'MCA', 'PGDM'].map(p => <option key={p}>{p}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-[#E2E8F0] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 text-[#64748B] bg-[#FAFBFC]">
                <option value="All">All Status</option>
                <option>ACTIVE</option>
                <option>DRAFT</option>
                <option>ARCHIVED</option>
              </select>
              <span className="text-xs text-[#94A3B8] font-medium ml-auto">{filtered.length} of {structures.length} structures</span>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    {['Structure Name', 'Program / Course', 'Academic Year', 'Branch', 'Components', 'Total Fee', 'Status', 'Created', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-16 text-[#94A3B8]">
                        <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
                          <svg className="w-7 h-7 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <p className="font-bold text-[#1E3A5F]">No pricing structures found</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  ) : filtered.map((s, i) => (
                    <tr key={s.id} className={`border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFBFC]'}`}>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => { setDetailTarget(s); setView('detail'); }}
                          className="font-bold text-[#1E3A5F] hover:text-[#0EA5E9] transition-colors text-left"
                        >
                          {s.name}
                        </button>
                        <p className="text-xs text-[#94A3B8] font-mono mt-0.5">{s.code}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-[#1E3A5F]">{s.program}</p>
                        <p className="text-xs text-[#94A3B8]">{s.course}</p>
                      </td>
                      <td className="px-4 py-3.5 text-[#64748B] text-sm">{s.academicYear}</td>
                      <td className="px-4 py-3.5 text-[#64748B] text-sm">{s.branch}</td>
                      <td className="px-4 py-3.5">
                        <span className="bg-[#F1F5F9] text-[#1E3A5F] text-xs font-bold px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                          {s.components.length} heads
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-black text-[#1E3A5F] tabular-nums">{fmt(s.totalAmount)}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3.5 text-xs text-[#94A3B8]">
                        <p className="font-medium">{s.createdDate}</p>
                        <p>{s.createdBy}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => { setDetailTarget(s); setView('detail'); }}
                            className="p-1.5 text-[#94A3B8] hover:text-[#0EA5E9] hover:bg-[#F0F9FF] rounded-lg transition-colors"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button
                            onClick={() => handleEdit(s)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#1E3A5F] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button
                            onClick={() => handleDuplicate(s)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#0EA5E9] hover:bg-[#F0F9FF] rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                          {s.status !== 'ARCHIVED' && (
                            <button
                              onClick={() => handleArchive(s.id)}
                              className="p-1.5 text-[#94A3B8] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Archive"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
