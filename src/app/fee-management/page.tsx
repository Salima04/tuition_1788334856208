'use client';
import React, { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
type OverrideLevel = 'Global' | 'Institute' | 'Branch' | 'Program' | 'Course' | 'Specialization' | 'Batch' | 'Student';
type FeeStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';
type FeeFrequency = 'One-Time' | 'Per Semester' | 'Per Year' | 'Per Month' | 'Per Term';

interface FeeRule {
  id: string;
  level: OverrideLevel;
  levelValue: string;
  amount: number;
  currency: string;
  mandatory: boolean;
  refundable: boolean;
  taxPercent: number;
  validFrom: string;
  validTo: string;
  status: FeeStatus;
  frequency: FeeFrequency;
  dueDate: string;
  lateFeeRule: string;
  description: string;
  createdBy: string;
  createdAt: string;
  reason?: string;
}

interface FeeComponent {
  id: string;
  code: string;
  name: string;
  category: string;
  icon: string;
  rules: FeeRule[];
}

// ─── Demo Data ────────────────────────────────────────────────────────────────
const fmt = (n: number, cur = 'INR') => {
  if (cur === 'INR') return '₹' + n.toLocaleString('en-IN');
  if (cur === 'USD') return '$' + n.toLocaleString('en-US');
  return n.toLocaleString();
};

const DEMO_COMPONENTS: FeeComponent[] = [
  {
    id: 'fc-001', code: 'APP-FEE', name: 'Application Fee', category: 'Application Fee', icon: '📋',
    rules: [
      { id: 'r1', level: 'Global', levelValue: 'All Courses', amount: 2000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'One-Time', dueDate: 'On Application', lateFeeRule: 'None', description: 'Standard application processing fee', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
      { id: 'r2', level: 'Program', levelValue: 'MBA', amount: 2500, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'One-Time', dueDate: 'On Application', lateFeeRule: 'None', description: 'MBA program application fee', createdBy: 'Finance Admin', createdAt: '2026-03-05', reason: 'MBA has higher processing cost' },
      { id: 'r3', level: 'Course', levelValue: 'MBA Finance', amount: 3000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'One-Time', dueDate: 'On Application', lateFeeRule: 'None', description: 'MBA Finance specific fee', createdBy: 'Finance Admin', createdAt: '2026-03-10', reason: 'Finance specialization premium' },
    ],
  },
  {
    id: 'fc-002', code: 'TUT-FEE', name: 'Tuition Fee', category: 'Tuition Fee', icon: '📚',
    rules: [
      { id: 'r4', level: 'Global', levelValue: 'All Courses', amount: 100000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: '₹500/day after grace', description: 'Base tuition fee', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
      { id: 'r5', level: 'Program', levelValue: 'MBA', amount: 400000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: '₹500/day after grace', description: 'MBA tuition fee', createdBy: 'Finance Admin', createdAt: '2026-03-05', reason: 'MBA premium pricing' },
      { id: 'r6', level: 'Branch', levelValue: 'Mumbai', amount: 420000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: '₹500/day after grace', description: 'Mumbai campus premium', createdBy: 'Finance Admin', createdAt: '2026-03-08', reason: 'Mumbai campus infrastructure cost' },
    ],
  },
  {
    id: 'fc-003', code: 'ADM-FEE', name: 'Admission Fee', category: 'Admission Fee', icon: '🎓',
    rules: [
      { id: 'r7', level: 'Global', levelValue: 'All Courses', amount: 15000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'One-Time', dueDate: 'On Admission', lateFeeRule: 'None', description: 'One-time admission processing', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
      { id: 'r8', level: 'Program', levelValue: 'MBA', amount: 25000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'One-Time', dueDate: 'On Admission', lateFeeRule: 'None', description: 'MBA admission fee', createdBy: 'Finance Admin', createdAt: '2026-03-05', reason: 'MBA program overhead' },
    ],
  },
  {
    id: 'fc-004', code: 'HST-FEE', name: 'Hostel Fee', category: 'Hostel Fee', icon: '🏠',
    rules: [
      { id: 'r9', level: 'Global', levelValue: 'All Eligible', amount: 80000, currency: 'INR', mandatory: false, refundable: true, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: '2% per month', description: 'Standard hostel accommodation', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
      { id: 'r10', level: 'Branch', levelValue: 'Mumbai', amount: 90000, currency: 'INR', mandatory: false, refundable: true, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: '2% per month', description: 'Mumbai hostel premium', createdBy: 'Finance Admin', createdAt: '2026-03-08', reason: 'Mumbai real estate cost' },
      { id: 'r11', level: 'Program', levelValue: 'MBA', amount: 95000, currency: 'INR', mandatory: false, refundable: true, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: '2% per month', description: 'MBA hostel (AC rooms)', createdBy: 'Finance Admin', createdAt: '2026-03-10', reason: 'MBA students get AC rooms' },
      { id: 'r12', level: 'Course', levelValue: 'MBA Finance', amount: 100000, currency: 'INR', mandatory: false, refundable: true, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: '2% per month', description: 'MBA Finance premium hostel', createdBy: 'Finance Admin', createdAt: '2026-03-12', reason: 'Finance batch premium block' },
    ],
  },
  {
    id: 'fc-005', code: 'TRP-FEE', name: 'Transport Fee', category: 'Transport Fee', icon: '🚌',
    rules: [
      { id: 'r13', level: 'Global', levelValue: 'All Selected', amount: 20000, currency: 'INR', mandatory: false, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: 'None', description: 'Standard transport fee', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
      { id: 'r14', level: 'Branch', levelValue: 'Delhi', amount: 18000, currency: 'INR', mandatory: false, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: 'None', description: 'Delhi campus transport', createdBy: 'Finance Admin', createdAt: '2026-03-08', reason: 'Shorter routes in Delhi' },
    ],
  },
  {
    id: 'fc-006', code: 'EXM-FEE', name: 'Examination Fee', category: 'Examination Fee', icon: '📄',
    rules: [
      { id: 'r15', level: 'Global', levelValue: 'All Courses', amount: 5000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Semester', dueDate: '30 days before exam', lateFeeRule: '₹200 late fee', description: 'Per semester exam fee', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
      { id: 'r16', level: 'Program', levelValue: 'MBA', amount: 10000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 18, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Semester', dueDate: '30 days before exam', lateFeeRule: '₹200 late fee', description: 'MBA exam fee with GST', createdBy: 'Finance Admin', createdAt: '2026-03-05', reason: 'MBA exam infrastructure cost' },
    ],
  },
  {
    id: 'fc-007', code: 'LIB-FEE', name: 'Library Fee', category: 'Library Fee', icon: '📖',
    rules: [
      { id: 'r17', level: 'Global', levelValue: 'All Courses', amount: 3000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: 'None', description: 'Annual library access', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
    ],
  },
  {
    id: 'fc-008', code: 'LAB-FEE', name: 'Lab Fee', category: 'Lab Fee', icon: '🔬',
    rules: [
      { id: 'r18', level: 'Global', levelValue: 'All Courses', amount: 8000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 18, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: 'None', description: 'Lab usage and consumables', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
      { id: 'r19', level: 'Program', levelValue: 'BCA', amount: 15000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 18, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: 'None', description: 'BCA computer lab fee', createdBy: 'Finance Admin', createdAt: '2026-03-05', reason: 'BCA requires dedicated computer labs' },
    ],
  },
  {
    id: 'fc-009', code: 'REG-FEE', name: 'Registration Fee', category: 'Registration Fee', icon: '📝',
    rules: [
      { id: 'r20', level: 'Global', levelValue: 'All Courses', amount: 1000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'One-Time', dueDate: 'On Registration', lateFeeRule: 'None', description: 'Student registration fee', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
    ],
  },
  {
    id: 'fc-010', code: 'MSS-FEE', name: 'Mess Fee', category: 'Mess Fee', icon: '🍽️',
    rules: [
      { id: 'r21', level: 'Global', levelValue: 'Hostel Students', amount: 36000, currency: 'INR', mandatory: false, refundable: false, taxPercent: 5, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: 'None', description: 'Annual mess charges', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
    ],
  },
  {
    id: 'fc-011', code: 'CERT-FEE', name: 'Certification Fee', category: 'Certification Fee', icon: '🏆',
    rules: [
      { id: 'r22', level: 'Global', levelValue: 'All Courses', amount: 2000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'One-Time', dueDate: 'Final Year', lateFeeRule: 'None', description: 'Degree certificate issuance', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
    ],
  },
  {
    id: 'fc-012', code: 'MISC-FEE', name: 'Miscellaneous Fee', category: 'Miscellaneous Fee', icon: '🔧',
    rules: [
      { id: 'r23', level: 'Global', levelValue: 'All Courses', amount: 5000, currency: 'INR', mandatory: true, refundable: false, taxPercent: 0, validFrom: '2026-04-01', validTo: '2027-03-31', status: 'ACTIVE', frequency: 'Per Year', dueDate: '15 Jul 2026', lateFeeRule: 'None', description: 'Miscellaneous charges', createdBy: 'Finance Admin', createdAt: '2026-03-01' },
    ],
  },
];

const LEVEL_ORDER: OverrideLevel[] = ['Global', 'Institute', 'Branch', 'Program', 'Course', 'Specialization', 'Batch', 'Student'];
const LEVEL_COLORS: Record<OverrideLevel, string> = {
  Global: 'bg-slate-100 text-slate-600 border-slate-200',
  Institute: 'bg-blue-50 text-blue-600 border-blue-200',
  Branch: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  Program: 'bg-violet-50 text-violet-600 border-violet-200',
  Course: 'bg-purple-50 text-purple-600 border-purple-200',
  Specialization: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200',
  Batch: 'bg-pink-50 text-pink-600 border-pink-200',
  Student: 'bg-rose-50 text-rose-600 border-rose-200',
};

function getEffectiveRule(rules: FeeRule[]): FeeRule {
  const active = rules.filter(r => r.status === 'ACTIVE');
  const sorted = [...active].sort((a, b) => LEVEL_ORDER.indexOf(b.level) - LEVEL_ORDER.indexOf(a.level));
  return sorted[0] || rules[0];
}

function WhyThisFee({ rules, onClose }: { rules: FeeRule[]; onClose: () => void }) {
  const effective = getEffectiveRule(rules);
  const chain = [...rules].sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-bold text-[#1E3A5F] text-base">Why This Fee?</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Fee resolution chain — most specific rule wins</p>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#1E3A5F] text-xl">×</button>
        </div>
        <div className="p-6 space-y-3">
          {chain.map((rule, i) => {
            const isEffective = rule.id === effective.id;
            return (
              <div key={rule.id} className={`flex items-start gap-3 p-3 rounded-xl border ${isEffective ? 'border-[#0EA5E9] bg-[#F0F9FF]' : 'border-[#E2E8F0] bg-[#F8FAFC] opacity-60'}`}>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isEffective ? 'bg-[#0EA5E9] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${LEVEL_COLORS[rule.level]}`}>{rule.level}</span>
                    <span className="text-xs text-[#64748B]">{rule.levelValue}</span>
                    {isEffective && <span className="text-xs bg-[#0EA5E9] text-white px-2 py-0.5 rounded-full font-semibold">✓ Applied</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-bold text-[#1E3A5F]">{fmt(rule.amount, rule.currency)}</span>
                    {rule.reason && <span className="text-xs text-[#64748B] italic">"{rule.reason}"</span>}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="mt-4 p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
            <p className="text-xs text-[#166534] font-semibold">Effective Fee: {fmt(effective.amount, effective.currency)}</p>
            <p className="text-xs text-[#166534] mt-0.5">Applied from: {effective.level} → {effective.levelValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddOverrideDrawer({ component, onClose, onSave }: { component: FeeComponent; onClose: () => void; onSave: (rule: FeeRule) => void }) {
  const [form, setForm] = useState({
    level: 'Branch' as OverrideLevel,
    levelValue: '',
    amount: '',
    currency: 'INR',
    mandatory: true,
    refundable: false,
    taxPercent: 0,
    validFrom: '2026-04-01',
    validTo: '2027-03-31',
    frequency: 'One-Time' as FeeFrequency,
    dueDate: '',
    lateFeeRule: 'None',
    description: '',
    reason: '',
  });

  const levelValueOptions: Record<OverrideLevel, string[]> = {
    Global: ['All Courses'],
    Institute: ['ABC Business School'],
    Branch: ['Mumbai', 'Delhi', 'Pune', 'Bangalore'],
    Program: ['MBA', 'BBA', 'BCA', 'MCA', 'PGDM'],
    Course: ['MBA Finance', 'MBA Marketing', 'MBA HR', 'BBA', 'BCA'],
    Specialization: ['Finance', 'Marketing', 'HR', 'Operations'],
    Batch: ['2026-28', '2025-27', '2024-26'],
    Student: ['Custom Student ID'],
  };

  const handleSave = () => {
    if (!form.levelValue || !form.amount) return;
    const newRule: FeeRule = {
      id: 'r-' + Date.now(),
      level: form.level,
      levelValue: form.levelValue,
      amount: Number(form.amount),
      currency: form.currency,
      mandatory: form.mandatory,
      refundable: form.refundable,
      taxPercent: form.taxPercent,
      validFrom: form.validFrom,
      validTo: form.validTo,
      status: 'ACTIVE',
      frequency: form.frequency,
      dueDate: form.dueDate,
      lateFeeRule: form.lateFeeRule,
      description: form.description,
      reason: form.reason,
      createdBy: 'Finance Admin',
      createdAt: new Date().toISOString().split('T')[0],
    };
    onSave(newRule);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-bold text-[#1E3A5F]">Add Override Rule</h3>
            <p className="text-xs text-[#64748B] mt-0.5">{component.icon} {component.name}</p>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#1E3A5F] text-xl">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Override Level *</label>
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value as OverrideLevel, levelValue: '' }))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E3A5F] focus:outline-none focus:border-[#0EA5E9]">
                {LEVEL_ORDER.filter(l => l !== 'Global').map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Level Value *</label>
              <select value={form.levelValue} onChange={e => setForm(f => ({ ...f, levelValue: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E3A5F] focus:outline-none focus:border-[#0EA5E9]">
                <option value="">Select...</option>
                {levelValueOptions[form.level].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Amount *</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0EA5E9]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Currency</label>
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0EA5E9]">
                {['INR', 'USD', 'AED', 'GBP', 'EUR', 'SGD'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Frequency</label>
              <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value as FeeFrequency }))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0EA5E9]">
                {['One-Time', 'Per Semester', 'Per Year', 'Per Month', 'Per Term'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">GST %</label>
              <input type="number" value={form.taxPercent} onChange={e => setForm(f => ({ ...f, taxPercent: Number(e.target.value) }))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0EA5E9]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Valid From</label>
              <input type="date" value={form.validFrom} onChange={e => setForm(f => ({ ...f, validFrom: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0EA5E9]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Valid To</label>
              <input type="date" value={form.validTo} onChange={e => setForm(f => ({ ...f, validTo: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0EA5E9]" />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.mandatory} onChange={e => setForm(f => ({ ...f, mandatory: e.target.checked }))} className="rounded" />
              <span className="text-sm text-[#374151]">Mandatory</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.refundable} onChange={e => setForm(f => ({ ...f, refundable: e.target.checked }))} className="rounded" />
              <span className="text-sm text-[#374151]">Refundable</span>
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Due Date</label>
            <input type="text" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} placeholder="e.g. 15 Jul 2026" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0EA5E9]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Late Fee Rule</label>
            <input type="text" value={form.lateFeeRule} onChange={e => setForm(f => ({ ...f, lateFeeRule: e.target.value }))} placeholder="e.g. ₹500/day after 5-day grace" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0EA5E9]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Override Reason *</label>
            <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={2} placeholder="Why is this override needed?" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0EA5E9] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0EA5E9] resize-none" />
          </div>
        </div>
        <div className="border-t border-[#E2E8F0] px-6 py-4 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-[#E2E8F0] text-[#64748B] rounded-lg py-2 text-sm font-medium hover:bg-[#F8FAFC]">Cancel</button>
          <button onClick={handleSave} className="flex-1 bg-[#0EA5E9] text-white rounded-lg py-2 text-sm font-semibold hover:bg-[#0284C7]">Save Override</button>
        </div>
      </div>
    </div>
  );
}

function FeeComponentCard({ component, onAddOverride }: { component: FeeComponent; onAddOverride: (c: FeeComponent) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const effective = getEffectiveRule(component.rules);
  const globalRule = component.rules.find(r => r.level === 'Global');
  const hasOverrides = component.rules.length > 1;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] flex items-center justify-center text-xl flex-shrink-0">{component.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#1E3A5F] text-sm">{component.name}</span>
            <span className="text-xs text-[#94A3B8] font-mono bg-[#F8FAFC] px-2 py-0.5 rounded">{component.code}</span>
            {hasOverrides && <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">{component.rules.length - 1} override{component.rules.length > 2 ? 's' : ''}</span>}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-[#64748B]">Global Default: <span className="font-semibold text-[#1E3A5F]">{globalRule ? fmt(globalRule.amount) : '—'}</span></span>
            <span className="text-xs text-[#94A3B8]">·</span>
            <span className="text-xs text-[#64748B]">Effective: <span className="font-bold text-[#0EA5E9]">{fmt(effective.amount)}</span></span>
            <span className="text-xs text-[#94A3B8]">·</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${LEVEL_COLORS[effective.level]}`}>{effective.level}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setWhyOpen(true)} className="text-xs text-[#0EA5E9] hover:underline font-medium px-2 py-1 rounded hover:bg-[#F0F9FF]">Why?</button>
          <button onClick={() => onAddOverride(component)} className="text-xs bg-[#F0F9FF] text-[#0EA5E9] border border-[#BAE6FD] px-3 py-1.5 rounded-lg font-medium hover:bg-[#E0F2FE]">+ Override</button>
          <button onClick={() => setExpanded(e => !e)} className="text-[#94A3B8] hover:text-[#1E3A5F] w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-sm">
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="px-5 py-3">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-3">Override Chain (most specific wins)</p>
            <div className="space-y-2">
              {[...component.rules].sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)).map((rule, i) => {
                const isEffective = rule.id === effective.id;
                return (
                  <div key={rule.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isEffective ? 'border-[#0EA5E9] bg-white' : 'border-[#E2E8F0] bg-white/60'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isEffective ? 'bg-[#0EA5E9] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>{i + 1}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${LEVEL_COLORS[rule.level]}`}>{rule.level}</span>
                    <span className="text-xs text-[#64748B] flex-shrink-0">{rule.levelValue}</span>
                    <span className="font-bold text-[#1E3A5F] text-sm flex-shrink-0">{fmt(rule.amount)}</span>
                    <span className="text-xs text-[#94A3B8] flex-1 truncate">{rule.frequency}</span>
                    {rule.taxPercent > 0 && <span className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full">GST {rule.taxPercent}%</span>}
                    {rule.mandatory ? <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">Mandatory</span> : <span className="text-xs bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">Optional</span>}
                    {rule.refundable && <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">Refundable</span>}
                    {isEffective && <span className="text-xs bg-[#0EA5E9] text-white px-2 py-0.5 rounded-full font-semibold">✓ Active</span>}
                    {rule.reason && <span className="text-xs text-[#94A3B8] italic truncate max-w-[120px]" title={rule.reason}>"{rule.reason}"</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {whyOpen && <WhyThisFee rules={component.rules} onClose={() => setWhyOpen(false)} />}
    </div>
  );
}

// ─── Fee Calculation Engine ───────────────────────────────────────────────────
function FeeCalculator({ components }: { components: FeeComponent[] }) {
  const [context, setContext] = useState({ program: 'MBA', course: 'MBA Finance', branch: 'Mumbai', batch: '2026-28' });

  const resolved = useMemo(() => {
    return components.map(comp => {
      const active = comp.rules.filter(r => r.status === 'ACTIVE');
      const sorted = [...active].sort((a, b) => LEVEL_ORDER.indexOf(b.level) - LEVEL_ORDER.indexOf(a.level));
      const best = sorted.find(r => {
        if (r.level === 'Global') return true;
        if (r.level === 'Branch' && r.levelValue === context.branch) return true;
        if (r.level === 'Program' && r.levelValue === context.program) return true;
        if (r.level === 'Course' && r.levelValue === context.course) return true;
        if (r.level === 'Batch' && r.levelValue === context.batch) return true;
        return false;
      }) || sorted[0];
      return { comp, rule: best };
    });
  }, [components, context]);

  const mandatory = resolved.filter(r => r.rule?.mandatory);
  const optional = resolved.filter(r => !r.rule?.mandatory);
  const mandatoryTotal = mandatory.reduce((s, r) => s + (r.rule?.amount || 0), 0);
  const taxTotal = mandatory.reduce((s, r) => s + Math.round((r.rule?.amount || 0) * (r.rule?.taxPercent || 0) / 100), 0);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
      <h3 className="font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
        <span className="text-lg">🧮</span> Fee Calculation Engine
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Program', key: 'program', opts: ['MBA', 'BBA', 'BCA', 'MCA', 'PGDM'] },
          { label: 'Course', key: 'course', opts: ['MBA Finance', 'MBA Marketing', 'MBA HR', 'BBA', 'BCA'] },
          { label: 'Branch', key: 'branch', opts: ['Mumbai', 'Delhi', 'Pune', 'Bangalore'] },
          { label: 'Batch', key: 'batch', opts: ['2026-28', '2025-27', '2024-26'] },
        ].map(({ label, key, opts }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-[#374151] mb-1">{label}</label>
            <select value={(context as Record<string, string>)[key]} onChange={e => setContext(c => ({ ...c, [key]: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-2 py-1.5 text-xs text-[#1E3A5F] focus:outline-none focus:border-[#0EA5E9]">
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="space-y-1.5 mb-3">
        {mandatory.map(({ comp, rule }) => rule && (
          <div key={comp.id} className="flex items-center justify-between text-xs">
            <span className="text-[#374151]">{comp.icon} {comp.name}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-1.5 py-0.5 rounded border ${LEVEL_COLORS[rule.level]}`}>{rule.level}</span>
              <span className="font-semibold text-[#1E3A5F]">{fmt(rule.amount)}</span>
            </div>
          </div>
        ))}
      </div>
      {optional.length > 0 && (
        <div className="border-t border-dashed border-[#E2E8F0] pt-2 mb-3 space-y-1.5">
          <p className="text-xs text-[#94A3B8] font-medium">Optional</p>
          {optional.map(({ comp, rule }) => rule && (
            <div key={comp.id} className="flex items-center justify-between text-xs opacity-60">
              <span className="text-[#374151]">{comp.icon} {comp.name}</span>
              <span className="font-semibold text-[#1E3A5F]">{fmt(rule.amount)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="border-t border-[#E2E8F0] pt-3 space-y-1.5">
        <div className="flex justify-between text-xs text-[#64748B]"><span>Mandatory Subtotal</span><span className="font-semibold">{fmt(mandatoryTotal)}</span></div>
        {taxTotal > 0 && <div className="flex justify-between text-xs text-[#64748B]"><span>+ GST/Tax</span><span className="font-semibold">{fmt(taxTotal)}</span></div>}
        <div className="flex justify-between text-sm font-bold text-[#1E3A5F] pt-1 border-t border-[#E2E8F0]"><span>Total Payable</span><span className="text-[#0EA5E9]">{fmt(mandatoryTotal + taxTotal)}</span></div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FeeManagementPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'components' | 'overrides'>('dashboard');
  const [search, setSearch] = useState('');
  const [components, setComponents] = useState<FeeComponent[]>(DEMO_COMPONENTS);
  const [addOverrideFor, setAddOverrideFor] = useState<FeeComponent | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddOverride = (comp: FeeComponent) => setAddOverrideFor(comp);
  const handleSaveOverride = (rule: FeeRule) => {
    if (!addOverrideFor) return;
    setComponents(prev => prev.map(c => c.id === addOverrideFor.id ? { ...c, rules: [...c.rules, rule] } : c));
    setAddOverrideFor(null);
    showToast(`Override added for ${addOverrideFor.name} at ${rule.level} level`);
  };

  const filtered = components.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  const totalComponents = components.length;
  const totalRules = components.reduce((s, c) => s + c.rules.length, 0);
  const totalOverrides = components.reduce((s, c) => s + (c.rules.length - 1), 0);
  const activeRules = components.reduce((s, c) => s + c.rules.filter(r => r.status === 'ACTIVE').length, 0);

  const kpis = [
    { label: 'Fee Components', value: totalComponents, sub: 'All types configured', icon: '📋', color: 'bg-[#F0F9FF] border-[#BAE6FD]', textColor: 'text-[#0369A1]' },
    { label: 'Total Rules', value: totalRules, sub: 'Across all levels', icon: '📐', color: 'bg-[#F0FDF4] border-[#BBF7D0]', textColor: 'text-[#166534]' },
    { label: 'Active Overrides', value: totalOverrides, sub: 'Branch/Program/Course', icon: '🔀', color: 'bg-[#FFF7ED] border-[#FED7AA]', textColor: 'text-[#9A3412]' },
    { label: 'Active Rules', value: activeRules, sub: 'Currently in effect', icon: '✅', color: 'bg-[#F5F3FF] border-[#DDD6FE]', textColor: 'text-[#5B21B6]' },
  ];

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'components', label: 'Fee Components', icon: '📋' },
    { key: 'overrides', label: 'Override Matrix', icon: '🔀' },
  ] as const;

  return (
    <AppShell activePath="/fee-management">
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-[#1E3A5F]">Fee Structure Management</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Global Default + Override model · Most specific rule wins · ABC Business School · 2026-27</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/fee-management/bulk-import" className="flex items-center gap-2 border border-[#E2E8F0] text-[#374151] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC]">
              <span>📥</span> Bulk Import
            </Link>
            <Link href="/fee-management/export" className="flex items-center gap-2 border border-[#E2E8F0] text-[#374151] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC]">
              <span>📤</span> Export
            </Link>
            <Link href="/fee-management/version-history" className="flex items-center gap-2 border border-[#E2E8F0] text-[#374151] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC]">
              <span>🕐</span> Version History
            </Link>
            <Link href="/fee-management/audit-logs" className="flex items-center gap-2 border border-[#E2E8F0] text-[#374151] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC]">
              <span>📋</span> Audit Logs
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(k => (
            <div key={k.label} className={`border rounded-xl p-4 ${k.color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{k.icon}</span>
                <span className={`text-2xl font-bold ${k.textColor}`}>{k.value}</span>
              </div>
              <p className="text-sm font-semibold text-[#1E3A5F]">{k.label}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Override Hierarchy Banner */}
        <div className="bg-[#1E3A5F] rounded-xl p-4">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">Override Hierarchy — Most Specific Rule Wins</p>
          <div className="flex items-center gap-1 flex-wrap">
            {LEVEL_ORDER.map((level, i) => (
              <React.Fragment key={level}>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${LEVEL_COLORS[level]}`}>{level}</div>
                {i < LEVEL_ORDER.length - 1 && <span className="text-white/30 text-sm">→</span>}
              </React.Fragment>
            ))}
            <div className="ml-2 px-3 py-1.5 bg-[#0EA5E9] text-white rounded-lg text-xs font-bold">= Effective Fee</div>
          </div>
          <p className="text-xs text-white/40 mt-2">Example: Global Hostel ₹80,000 → Mumbai Branch ₹90,000 → MBA ₹95,000 → MBA Finance ₹1,00,000 → <span className="text-white/80 font-semibold">Effective = ₹1,00,000</span></p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-xl w-fit">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-white text-[#1E3A5F] shadow-sm' : 'text-[#64748B] hover:text-[#1E3A5F]'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Tab: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                <h3 className="font-bold text-[#1E3A5F] mb-4">Fee Components Summary</h3>
                <div className="space-y-3">
                  {components.map(comp => {
                    const effective = getEffectiveRule(comp.rules);
                    const global = comp.rules.find(r => r.level === 'Global');
                    const hasOverride = effective.id !== global?.id;
                    return (
                      <div key={comp.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:border-[#BAE6FD] hover:bg-[#F0F9FF]/30 transition-colors">
                        <span className="text-xl w-8 text-center flex-shrink-0">{comp.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1E3A5F]">{comp.name}</span>
                            {hasOverride && <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full">Override Active</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#94A3B8]">Global: {global ? fmt(global.amount) : '—'}</span>
                            {hasOverride && <><span className="text-xs text-[#94A3B8]">→</span><span className="text-xs font-semibold text-[#0EA5E9]">Effective: {fmt(effective.amount)}</span><span className={`text-xs px-1.5 py-0.5 rounded border ${LEVEL_COLORS[effective.level]}`}>{effective.level}</span></>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-[#1E3A5F]">{fmt(effective.amount)}</p>
                          <p className="text-xs text-[#94A3B8]">{effective.frequency}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <FeeCalculator components={components} />
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                <h3 className="font-bold text-[#1E3A5F] mb-3 flex items-center gap-2"><span>⚡</span> Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Bulk Import Fee Data', icon: '📥', href: '/fee-management/bulk-import', color: 'text-[#0EA5E9]' },
                    { label: 'Export All Fees', icon: '📤', href: '/fee-management/export', color: 'text-[#059669]' },
                    { label: 'View Version History', icon: '🕐', href: '/fee-management/version-history', color: 'text-[#7C3AED]' },
                    { label: 'View Audit Logs', icon: '📋', href: '/fee-management/audit-logs', color: 'text-[#D97706]' },
                  ].map(a => (
                    <Link key={a.label} href={a.href} className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:border-[#BAE6FD] hover:bg-[#F0F9FF]/30 transition-colors">
                      <span className="text-lg">{a.icon}</span>
                      <span className={`text-sm font-medium ${a.color}`}>{a.label}</span>
                      <span className="ml-auto text-[#94A3B8] text-xs">›</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Fee Components */}
        {activeTab === 'components' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search fee components..." className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#0EA5E9]" />
              </div>
              <span className="text-sm text-[#64748B]">{filtered.length} components</span>
            </div>
            <div className="space-y-3">
              {filtered.map(comp => (
                <FeeComponentCard key={comp.id} component={comp} onAddOverride={handleAddOverride} />
              ))}
            </div>
          </div>
        )}

        {/* Tab: Override Matrix */}
        {activeTab === 'overrides' && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="font-bold text-[#1E3A5F]">Override Matrix — All Fee Components</h3>
              <span className="text-xs text-[#64748B]">Showing effective fee per level</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide sticky left-0 bg-[#F8FAFC] min-w-[160px]">Fee Component</th>
                    {LEVEL_ORDER.map(l => (
                      <th key={l} className="text-center px-3 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide min-w-[100px]">{l}</th>
                    ))}
                    <th className="text-center px-3 py-3 text-xs font-semibold text-[#0EA5E9] uppercase tracking-wide min-w-[120px]">Effective</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((comp, i) => {
                    const effective = getEffectiveRule(comp.rules);
                    return (
                      <tr key={comp.id} className={`border-b border-[#E2E8F0] ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]/50'}`}>
                        <td className="px-4 py-3 sticky left-0 bg-inherit">
                          <div className="flex items-center gap-2">
                            <span>{comp.icon}</span>
                            <div>
                              <p className="font-semibold text-[#1E3A5F] text-xs">{comp.name}</p>
                              <p className="text-xs text-[#94A3B8] font-mono">{comp.code}</p>
                            </div>
                          </div>
                        </td>
                        {LEVEL_ORDER.map(level => {
                          const rule = comp.rules.find(r => r.level === level);
                          const isEffective = rule && rule.id === effective.id;
                          return (
                            <td key={level} className="px-3 py-3 text-center">
                              {rule ? (
                                <div className={`inline-flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${isEffective ? 'bg-[#F0F9FF] border border-[#0EA5E9]' : 'bg-[#F8FAFC] border border-[#E2E8F0]'}`}>
                                  <span className={`text-xs font-bold ${isEffective ? 'text-[#0EA5E9]' : 'text-[#1E3A5F]'}`}>{fmt(rule.amount)}</span>
                                  {isEffective && <span className="text-xs text-[#0EA5E9]">✓</span>}
                                </div>
                              ) : (
                                <span className="text-[#E2E8F0] text-xs">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-3 py-3 text-center">
                          <div className="inline-flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg bg-[#0EA5E9] text-white">
                            <span className="text-xs font-bold">{fmt(effective.amount)}</span>
                            <span className="text-xs opacity-80">{effective.level}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Override Drawer */}
      {addOverrideFor && (
        <AddOverrideDrawer component={addOverrideFor} onClose={() => setAddOverrideFor(null)} onSave={handleSaveOverride} />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1E3A5F] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium z-50 flex items-center gap-2">
          <span>✅</span> {toast}
        </div>
      )}
    </AppShell>
  );
}
