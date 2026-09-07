'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';

const packages = [
  { id: 1, name: 'MBA Standard Package', code: 'MBA-STD-2627', program: 'MBA', course: 'MBA Finance / Marketing / HR', year: '2026-27', base: '₹5,00,000', final: '₹4,50,000', students: 124, status: 'ACTIVE' },
  { id: 2, name: 'MBA Merit Package', code: 'MBA-MERIT-2627', program: 'MBA', course: 'MBA Finance / Marketing', year: '2026-27', base: '₹5,00,000', final: '₹3,75,000', students: 38, status: 'ACTIVE' },
  { id: 3, name: 'MBA Early Bird', code: 'MBA-EB-2627', program: 'MBA', course: 'MBA All Courses', year: '2026-27', base: '₹5,00,000', final: '₹4,25,000', students: 67, status: 'ACTIVE' },
  { id: 4, name: 'MBA International', code: 'MBA-INTL-2627', program: 'MBA', course: 'MBA Finance', year: '2026-27', base: '₹8,50,000', final: '₹8,00,000', students: 12, status: 'ACTIVE' },
  { id: 5, name: 'BBA Standard', code: 'BBA-STD-2627', program: 'BBA', course: 'BBA', year: '2026-27', base: '₹2,50,000', final: '₹2,35,000', students: 89, status: 'ACTIVE' },
  { id: 6, name: 'BCA Standard', code: 'BCA-STD-2627', program: 'BCA', course: 'BCA', year: '2026-27', base: '₹1,80,000', final: '₹1,65,000', students: 56, status: 'ACTIVE' },
  { id: 7, name: 'MBA Sponsored', code: 'MBA-SPON-2627', program: 'MBA', course: 'MBA Finance', year: '2026-27', base: '₹5,00,000', final: '₹2,50,000', students: 8, status: 'DRAFT' },
  { id: 8, name: 'PGDM Standard', code: 'PGDM-STD-2627', program: 'PGDM', course: 'PGDM', year: '2026-27', base: '₹4,50,000', final: '₹4,20,000', students: 0, status: 'DRAFT' },
];

const statusStyle: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700 border border-green-200',
  DRAFT: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  ARCHIVED: 'bg-gray-100 text-gray-500 border border-gray-200',
  PAUSED: 'bg-orange-100 text-orange-700 border border-orange-200',
};

const STEPS = [
  'Basic Info',
  'Fee Components',
  'Payment Options',
  'Discounts',
  'Installments / EMI',
  'Eligibility',
  'Assign Students',
  'Review',
  'Approval',
];

const feeComponents = [
  { head: 'Admission Fee', amount: 25000, qty: 1, mandatory: true, refundable: false, tax: false, taxPct: 0 },
  { head: 'Tuition Fee', amount: 400000, qty: 1, mandatory: true, refundable: false, tax: false, taxPct: 0 },
  { head: 'Examination Fee', amount: 10000, qty: 1, mandatory: true, refundable: false, tax: true, taxPct: 18 },
  { head: 'Hostel Fee', amount: 80000, qty: 1, mandatory: false, refundable: true, tax: false, taxPct: 0 },
];

const feeHeadOptions = [
  'Application Fee', 'Registration Fee', 'Admission Fee', 'Tuition Fee',
  'Examination Fee', 'Library Fee', 'Lab Fee', 'Hostel Fee', 'Mess Fee',
  'Transport Fee', 'Course Material', 'Certification Fee', 'Training Fee',
  'Placement Fee', 'Technology Fee', 'Miscellaneous Fee', 'Custom Fee',
];

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function PaymentPackagesPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [components, setComponents] = useState(feeComponents);
  const [showAddComp, setShowAddComp] = useState(false);
  const [newComp, setNewComp] = useState({ head: 'Application Fee', amount: 0, mandatory: true, refundable: false, tax: false, taxPct: 0 });
  const [form, setForm] = useState({
    name: '', code: '', institute: 'ABC Business School', branch: 'Mumbai',
    year: '2026-27', program: 'MBA', course: 'MBA Finance', category: 'General',
    currency: 'INR', validFrom: '', validTo: '', description: '',
    paymentTypes: [] as string[],
    discount: 15000, scholarship: 50000,
    installments: [
      { no: 1, due: '15 Apr 2026', amount: 87500 },
      { no: 2, due: '15 Jun 2026', amount: 87500 },
      { no: 3, due: '15 Aug 2026', amount: 87500 },
      { no: 4, due: '15 Oct 2026', amount: 87500 },
      { no: 5, due: '15 Dec 2026', amount: 87500 },
    ],
  });

  const gross = components.filter(c => c.mandatory).reduce((s, c) => s + c.amount, 0);
  const tax = components.filter(c => c.tax && c.mandatory).reduce((s, c) => s + Math.round(c.amount * c.taxPct / 100), 0);
  const finalPayable = gross + tax - form.discount - form.scholarship;

  const filtered = packages.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const togglePaymentType = (type: string) => {
    setForm(f => ({
      ...f,
      paymentTypes: f.paymentTypes.includes(type)
        ? f.paymentTypes.filter(t => t !== type)
        : [...f.paymentTypes, type],
    }));
  };

  const addComponent = () => {
    setComponents(prev => [...prev, { ...newComp, qty: 1 }]);
    setShowAddComp(false);
    setNewComp({ head: 'Application Fee', amount: 0, mandatory: true, refundable: false, tax: false, taxPct: 0 });
  };

  const removeComponent = (i: number) => setComponents(prev => prev.filter((_, idx) => idx !== i));

  if (showWizard) {
    return (
      <AppShell activePath="/payment-packages">
        <div className="p-6">
          {/* Wizard Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => { setShowWizard(false); setStep(0); }} className="text-[#64748B] hover:text-[#1E3A5F] text-sm flex items-center gap-1">
              ← Back to Packages
            </button>
            <span className="text-[#CBD5E0]">/</span>
            <span className="text-sm font-semibold text-[#1E3A5F]">Create Payment Package</span>
          </div>

          {/* Stepper */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-6 overflow-x-auto">
            <div className="flex items-center min-w-max">
              {STEPS.map((s, i) => (
                <React.Fragment key={i}>
                  <button
                    onClick={() => setStep(i)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      i === step ? 'bg-[#1E3A5F] text-white' :
                      i < step ? 'text-[#16A34A] bg-green-50': 'text-[#94A3B8] hover:text-[#64748B]'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === step ? 'bg-white text-[#1E3A5F]' :
                      i < step ? 'bg-green-500 text-white': 'bg-[#E2E8F0] text-[#94A3B8]'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </span>
                    {s}
                  </button>
                  {i < STEPS.length - 1 && <div className={`w-6 h-px mx-1 ${i < step ? 'bg-green-400' : 'bg-[#E2E8F0]'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* STEP 0: Basic Info */}
              {step === 0 && (
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                  <h2 className="text-base font-bold text-[#1E3A5F] mb-5">Step 1 — Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Package Name *', key: 'name', placeholder: 'MBA Standard Package 2026-27', type: 'text' },
                      { label: 'Package Code', key: 'code', placeholder: 'MBA-STD-2627 (auto-generated)', type: 'text' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-[#64748B] mb-1.5">{f.label}</label>
                        <input
                          type={f.type}
                          value={(form as Record<string, string>)[f.key]}
                          onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#1E3A5F] focus:outline-none focus:border-[#0EA5E9] bg-[#F8FAFC]"
                        />
                      </div>
                    ))}
                    {[
                      { label: 'Institute *', key: 'institute', options: ['ABC Business School'] },
                      { label: 'Branch / Campus *', key: 'branch', options: ['Mumbai', 'Delhi', 'Pune', 'Bangalore'] },
                      { label: 'Academic Year *', key: 'year', options: ['2026-27', '2025-26'] },
                      { label: 'Program *', key: 'program', options: ['MBA', 'BBA', 'BCA', 'MCA', 'PGDM'] },
                      { label: 'Course *', key: 'course', options: ['MBA Finance', 'MBA Marketing', 'MBA HR', 'BBA', 'BCA'] },
                      { label: 'Student Category', key: 'category', options: ['General', 'Merit', 'Management', 'Sponsored', 'International'] },
                      { label: 'Currency', key: 'currency', options: ['INR ₹', 'USD $', 'AED د.إ', 'GBP £', 'EUR €'] },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-[#64748B] mb-1.5">{f.label}</label>
                        <select
                          value={(form as Record<string, string>)[f.key]}
                          onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#1E3A5F] focus:outline-none focus:border-[#0EA5E9] bg-[#F8FAFC]"
                        >
                          {f.options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Valid From</label>
                      <input type="date" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#1E3A5F] focus:outline-none focus:border-[#0EA5E9] bg-[#F8FAFC]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Valid To</label>
                      <input type="date" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#1E3A5F] focus:outline-none focus:border-[#0EA5E9] bg-[#F8FAFC]" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Description</label>
                      <textarea rows={3} placeholder="Package description, terms, notes..." className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#1E3A5F] focus:outline-none focus:border-[#0EA5E9] bg-[#F8FAFC] resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: Fee Components */}
              {step === 1 && (
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-[#1E3A5F]">Step 2 — Fee Components</h2>
                    <button
                      onClick={() => setShowAddComp(true)}
                      className="bg-[#1E3A5F] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#0F2A4F] transition-colors"
                    >
                      + Add Fee Component
                    </button>
                  </div>

                  {showAddComp && (
                    <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4 mb-4">
                      <h4 className="text-sm font-semibold text-[#0EA5E9] mb-3">New Fee Component</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs text-[#64748B] mb-1">Fee Head</label>
                          <select value={newComp.head} onChange={e => setNewComp(p => ({ ...p, head: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs bg-white focus:outline-none">
                            {feeHeadOptions.map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#64748B] mb-1">Amount (₹)</label>
                          <input type="number" value={newComp.amount} onChange={e => setNewComp(p => ({ ...p, amount: +e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs bg-white focus:outline-none" />
                        </div>
                        <div className="flex items-end gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-[#64748B] cursor-pointer">
                            <input type="checkbox" checked={newComp.mandatory} onChange={e => setNewComp(p => ({ ...p, mandatory: e.target.checked }))} className="rounded" />
                            Mandatory
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-[#64748B] cursor-pointer">
                            <input type="checkbox" checked={newComp.tax} onChange={e => setNewComp(p => ({ ...p, tax: e.target.checked }))} className="rounded" />
                            Tax
                          </label>
                        </div>
                        <div className="flex items-end gap-2">
                          <button onClick={addComponent} className="bg-[#16A34A] text-white text-xs px-3 py-2 rounded-lg hover:bg-green-700">Add</button>
                          <button onClick={() => setShowAddComp(false)} className="bg-[#F1F5F9] text-[#64748B] text-xs px-3 py-2 rounded-lg hover:bg-[#E2E8F0]">Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F8FAFC]">
                          {['Fee Head', 'Amount', 'Mandatory', 'Refundable', 'Tax', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {components.map((c, i) => (
                          <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                            <td className="px-4 py-3 font-medium text-[#1E3A5F]">{c.head}</td>
                            <td className="px-4 py-3 font-semibold text-[#1E3A5F]">{fmt(c.amount)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.mandatory ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                {c.mandatory ? 'Mandatory' : 'Optional'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.refundable ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                {c.refundable ? 'Refundable' : 'Non-refundable'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[#64748B] text-xs">
                              {c.tax ? `GST ${c.taxPct}%` : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => removeComponent(i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* STEP 2: Payment Options */}
              {step === 2 && (
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                  <h2 className="text-base font-bold text-[#1E3A5F] mb-5">Step 3 — Payment Options</h2>
                  <p className="text-sm text-[#64748B] mb-4">Select one or more payment methods students can use.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Full Payment', 'Partial Payment', 'Installment', 'EMI', 'Auto-Debit', 'Payment Link', 'Assisted Collection', 'Offline Payment', 'UPI', 'Card', 'Net Banking', 'Cash / Cheque'].map(type => (
                      <label key={type} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.paymentTypes.includes(type) ? 'border-[#0EA5E9] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#CBD5E0]'}`}>
                        <input type="checkbox" checked={form.paymentTypes.includes(type)} onChange={() => togglePaymentType(type)} className="rounded text-[#0EA5E9]" />
                        <span className="text-sm font-medium text-[#1E3A5F]">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Discounts */}
              {step === 3 && (
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                  <h2 className="text-base font-bold text-[#1E3A5F] mb-5">Step 4 — Discounts & Scholarships</h2>
                  <div className="space-y-4">
                    <div className="border border-[#E2E8F0] rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-[#1E3A5F] mb-3">Early Bird Discount</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-[#64748B] mb-1">Discount Type</label>
                          <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none">
                            <option>Fixed Amount</option>
                            <option>Percentage</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#64748B] mb-1">Amount (₹)</label>
                          <input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: +e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs text-[#64748B] mb-1">Valid Until</label>
                          <input type="date" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none" />
                        </div>
                      </div>
                    </div>
                    <div className="border border-[#E2E8F0] rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-[#1E3A5F] mb-3">Merit Scholarship</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-[#64748B] mb-1">Scholarship Type</label>
                          <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none">
                            <option>Merit</option>
                            <option>Need Based</option>
                            <option>Government</option>
                            <option>Sports</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#64748B] mb-1">Amount (₹)</label>
                          <input type="number" value={form.scholarship} onChange={e => setForm(p => ({ ...p, scholarship: +e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs text-[#64748B] mb-1">Approval Required</label>
                          <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none">
                            <option>Finance Manager</option>
                            <option>Director</option>
                            <option>Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Installments */}
              {step === 4 && (
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                  <h2 className="text-base font-bold text-[#1E3A5F] mb-5">Step 5 — Installment / EMI Plan</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                    <div>
                      <label className="block text-xs text-[#64748B] mb-1">Plan Name</label>
                      <input type="text" defaultValue="MBA 5-Installment Plan" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#64748B] mb-1">No. of Installments</label>
                      <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none">
                        {[2,3,4,5,6,8,10,12].map(n => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#64748B] mb-1">Distribution</label>
                      <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none">
                        <option>Equal</option>
                        <option>Custom</option>
                        <option>Percentage Based</option>
                      </select>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8FAFC]">
                        {['#', 'Due Date', 'Amount', 'Status'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.installments.map((inst, i) => (
                        <tr key={i} className="border-t border-[#F1F5F9]">
                          <td className="px-4 py-3 font-medium text-[#1E3A5F]">{inst.no}</td>
                          <td className="px-4 py-3 text-[#64748B]">{inst.due}</td>
                          <td className="px-4 py-3 font-semibold text-[#1E3A5F]">{fmt(inst.amount)}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">Upcoming</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* STEP 5: Eligibility */}
              {step === 5 && (
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                  <h2 className="text-base font-bold text-[#1E3A5F] mb-5">Step 6 — Eligibility Criteria</h2>
                  <div className="space-y-3">
                    {[
                      { field: 'Academic Year', op: '=', value: '2026-27' },
                      { field: 'Program', op: '=', value: 'MBA' },
                      { field: 'Admission Status', op: '=', value: 'Confirmed' },
                      { field: 'Branch', op: '=', value: 'Mumbai' },
                    ].map((rule, i) => (
                      <div key={i} className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                        {i > 0 && <span className="text-xs font-bold text-[#0EA5E9] w-8">AND</span>}
                        {i === 0 && <span className="text-xs font-bold text-[#94A3B8] w-8">IF</span>}
                        <select defaultValue={rule.field} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none flex-1">
                          <option>Academic Year</option>
                          <option>Program</option>
                          <option>Admission Status</option>
                          <option>Branch</option>
                          <option>Student Category</option>
                          <option>Gender</option>
                        </select>
                        <select defaultValue={rule.op} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none w-20">
                          <option>=</option>
                          <option>!=</option>
                          <option>IN</option>
                          <option>NOT IN</option>
                        </select>
                        <input defaultValue={rule.value} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none flex-1" />
                        <button className="text-red-400 hover:text-red-600 text-xs px-2">✕</button>
                      </div>
                    ))}
                    <button className="text-sm text-[#0EA5E9] hover:underline font-medium">+ Add Condition</button>
                  </div>
                  <div className="mt-5 bg-[#F0FDF4] border border-green-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-green-700">✓ Preview: 124 students matched</p>
                    <p className="text-xs text-green-600 mt-1">Already assigned: 0 · Not eligible: 12 · Missing data: 3</p>
                  </div>
                </div>
              )}

              {/* STEP 6: Assign Students */}
              {step === 6 && (
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                  <h2 className="text-base font-bold text-[#1E3A5F] mb-5">Step 7 — Assign Students</h2>
                  <div className="flex gap-3 mb-4">
                    <button className="bg-[#1E3A5F] text-white text-xs font-semibold px-4 py-2 rounded-lg">Select All (124)</button>
                    <button className="bg-[#F1F5F9] text-[#64748B] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#E2E8F0]">Clear Selection</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F8FAFC]">
                          {['', 'Student', 'App ID', 'Course', 'Batch', 'Gross Fee', 'Final Fee', 'Status'].map(h => (
                            <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-[#64748B] uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Joshi', 'Vikram Singh'].map((name, i) => (
                          <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                            <td className="px-3 py-3"><input type="checkbox" defaultChecked className="rounded" /></td>
                            <td className="px-3 py-3 font-medium text-[#1E3A5F]">{name}</td>
                            <td className="px-3 py-3 text-[#64748B] font-mono text-xs">APP-{2627000 + i + 1}</td>
                            <td className="px-3 py-3 text-[#64748B]">MBA Finance</td>
                            <td className="px-3 py-3 text-[#64748B]">2026-28</td>
                            <td className="px-3 py-3 text-[#1E3A5F]">₹5,15,000</td>
                            <td className="px-3 py-3 font-semibold text-[#16A34A]">₹4,50,000</td>
                            <td className="px-3 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Confirmed</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-[#94A3B8] px-3 py-2">Showing 5 of 124 matched students</p>
                  </div>
                </div>
              )}

              {/* STEP 7: Review */}
              {step === 7 && (
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                  <h2 className="text-base font-bold text-[#1E3A5F] mb-5">Step 8 — Review & Calculation</h2>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-[#F8FAFC] rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-[#64748B] uppercase mb-3">Package Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-[#64748B]">Package</span><span className="font-medium text-[#1E3A5F]">MBA Standard Package</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">Program</span><span className="font-medium text-[#1E3A5F]">MBA</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">Academic Year</span><span className="font-medium text-[#1E3A5F]">2026-27</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">Students</span><span className="font-medium text-[#1E3A5F]">124</span></div>
                      </div>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-[#64748B] uppercase mb-3">Financial Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-[#64748B]">Tuition Fee</span><span className="text-[#1E3A5F]">₹4,00,000</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">Admission Fee</span><span className="text-[#1E3A5F]">₹25,000</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">Exam Fee</span><span className="text-[#1E3A5F]">₹10,000</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">GST (18% on Exam)</span><span className="text-[#1E3A5F]">₹1,800</span></div>
                        <div className="flex justify-between border-t border-[#E2E8F0] pt-2"><span className="text-[#64748B]">Gross</span><span className="font-semibold text-[#1E3A5F]">₹4,36,800</span></div>
                        <div className="flex justify-between text-red-600"><span>Early Bird Discount</span><span>-₹15,000</span></div>
                        <div className="flex justify-between text-red-600"><span>Merit Scholarship</span><span>-₹50,000</span></div>
                        <div className="flex justify-between border-t border-[#E2E8F0] pt-2 font-bold text-base"><span className="text-[#1E3A5F]">Final Payable</span><span className="text-[#16A34A]">₹3,71,800</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: Approval */}
              {step === 8 && (
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
                  <h2 className="text-base font-bold text-[#1E3A5F] mb-5">Step 9 — Approval & Publish</h2>
                  <div className="space-y-4">
                    <div className="bg-[#FFF7ED] border border-orange-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-orange-700">⚠ Approval Required</p>
                      <p className="text-xs text-orange-600 mt-1">Scholarship &gt; 10% requires Finance Manager approval before publishing.</p>
                    </div>
                    <div className="border border-[#E2E8F0] rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-[#1E3A5F] mb-3">Approval Workflow</h4>
                      <div className="space-y-3">
                        {[
                          { role: 'Finance Admin', status: 'Pending', action: 'Review package details' },
                          { role: 'Finance Manager', status: 'Waiting', action: 'Approve scholarship > 10%' },
                          { role: 'Director', status: 'Waiting', action: 'Final sign-off' },
                        ].map((a, i) => (
                          <div key={i} className="flex items-center justify-between bg-[#F8FAFC] rounded-lg p-3">
                            <div>
                              <p className="text-sm font-medium text-[#1E3A5F]">{a.role}</p>
                              <p className="text-xs text-[#64748B]">{a.action}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{a.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Actions */}
              <div className="flex items-center justify-between bg-white border border-[#E2E8F0] rounded-xl p-4">
                <div className="flex gap-2">
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)} className="border border-[#E2E8F0] text-[#64748B] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#F8FAFC]">
                      ← Back
                    </button>
                  )}
                  <button className="border border-[#E2E8F0] text-[#64748B] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#F8FAFC]">
                    Save Draft
                  </button>
                </div>
                <div className="flex gap-2">
                  {step < STEPS.length - 1 ? (
                    <button onClick={() => setStep(s => s + 1)} className="bg-[#1E3A5F] text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-[#0F2A4F]">
                      Next →
                    </button>
                  ) : (
                    <button onClick={() => { setShowWizard(false); setStep(0); }} className="bg-[#16A34A] text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-green-700">
                      Submit for Approval
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Calculation Panel */}
            <div className="space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sticky top-6">
                <h3 className="text-sm font-bold text-[#1E3A5F] mb-4">Live Calculation</h3>
                <div className="space-y-2 text-sm">
                  {components.filter(c => c.mandatory).map((c, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-[#64748B]">{c.head}</span>
                      <span className="text-[#1E3A5F]">{fmt(c.amount)}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#E2E8F0] pt-2 flex justify-between font-medium">
                    <span className="text-[#64748B]">Gross Fee</span>
                    <span className="text-[#1E3A5F]">{fmt(gross)}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">+ Tax (GST)</span>
                      <span className="text-[#1E3A5F]">{fmt(tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-red-600">
                    <span>- Discount</span>
                    <span>-{fmt(form.discount)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>- Scholarship</span>
                    <span>-{fmt(form.scholarship)}</span>
                  </div>
                  <div className="border-t-2 border-[#1E3A5F] pt-2 flex justify-between font-bold text-base">
                    <span className="text-[#1E3A5F]">Final Payable</span>
                    <span className="text-[#16A34A]">{fmt(finalPayable)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span>Optional (Hostel)</span>
                    <span>₹80,000</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">Not included in final payable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activePath="/payment-packages">
      <div className="p-6 space-y-6">
        {/* Create Package Type Selection Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#1E3A5F]">Create Payment Package</h2>
                    <p className="text-sm text-[#64748B] mt-0.5">Choose how you want to create your package</p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-[#94A3B8] hover:text-[#1E3A5F] transition-colors p-1 rounded-lg hover:bg-[#F1F5F9]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Single Package */}
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setBulkMode(false);
                    setShowWizard(true);
                    setStep(0);
                  }}
                  className="group flex flex-col items-start gap-3 p-5 border-2 border-[#E2E8F0] rounded-xl hover:border-[#1E3A5F] hover:bg-[#F8FAFC] transition-all text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] group-hover:bg-[#DBEAFE] flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1E3A5F] group-hover:text-[#0F2A4F]">Create Single Package</p>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">Build one package with a step-by-step wizard — fee components, payment options, discounts, installments, eligibility &amp; more.</p>
                  </div>
                  <span className="mt-auto text-xs font-medium text-[#1E3A5F] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start Wizard
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>

                {/* Multiple / Bulk Packages */}
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setBulkMode(true);
                  }}
                  className="group flex flex-col items-start gap-3 p-5 border-2 border-[#E2E8F0] rounded-xl hover:border-[#0369A1] hover:bg-[#F0F9FF] transition-all text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#F0F9FF] group-hover:bg-[#E0F2FE] flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-[#0369A1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414A1 1 0 0120 8.414V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0369A1] group-hover:text-[#075985]">Create Multiple Packages</p>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">Bulk-create packages via Excel upload or copy an existing package and modify it for multiple programs, batches, or branches.</p>
                  </div>
                  <span className="mt-auto text-xs font-medium text-[#0369A1] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Bulk Creation
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="px-6 pb-5">
                <p className="text-xs text-[#94A3B8] text-center">You can always switch modes or save as draft at any point</p>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Package Creation Panel */}
        {bulkMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
              <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1E3A5F]">Bulk Package Creation</h2>
                  <p className="text-sm text-[#64748B] mt-0.5">Create multiple packages at once</p>
                </div>
                <button onClick={() => setBulkMode(false)} className="text-[#94A3B8] hover:text-[#1E3A5F] p-1 rounded-lg hover:bg-[#F1F5F9]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                {/* Option A: Excel Upload */}
                <div className="flex items-start gap-4 p-4 border border-[#E2E8F0] rounded-xl hover:border-[#0369A1] hover:bg-[#F0F9FF] transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1E3A5F]">Upload via Excel</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Download the template, fill in package details for multiple programs/batches, and upload to create all at once.</p>
                    <div className="flex gap-2 mt-3">
                      <button className="text-xs font-medium text-[#16A34A] border border-[#16A34A] px-3 py-1.5 rounded-lg hover:bg-[#DCFCE7] transition-colors">
                        ↓ Download Template
                      </button>
                      <button className="text-xs font-medium text-white bg-[#16A34A] px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
                        Upload Excel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Option B: Clone & Modify */}
                <div className="flex items-start gap-4 p-4 border border-[#E2E8F0] rounded-xl hover:border-[#7C3AED] hover:bg-[#FAF5FF] transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1E3A5F]">Clone Existing Package</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Select an existing package as a base and create variants for different programs, branches, or academic years.</p>
                    <button className="mt-3 text-xs font-medium text-[#7C3AED] border border-[#7C3AED] px-3 py-1.5 rounded-lg hover:bg-[#EDE9FE] transition-colors">
                      Select Base Package →
                    </button>
                  </div>
                </div>

                {/* Option C: Create one by one */}
                <div className="flex items-start gap-4 p-4 border border-[#E2E8F0] rounded-xl hover:border-[#1E3A5F] hover:bg-[#F8FAFC] transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1E3A5F]">Create One by One (Wizard)</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Use the step-by-step wizard to create each package individually with full control over every setting.</p>
                    <button
                      onClick={() => { setBulkMode(false); setShowWizard(true); setStep(0); }}
                      className="mt-3 text-xs font-medium text-[#1E3A5F] border border-[#1E3A5F] px-3 py-1.5 rounded-lg hover:bg-[#EFF6FF] transition-colors"
                    >
                      Open Wizard →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">Payment Packages</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Manage fee packages for all programs · ABC Business School</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#1E3A5F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0F2A4F] transition-colors shadow-sm"
          >
            + Create Package
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Packages', value: '12', color: 'text-[#1E3A5F]' },
            { label: 'Active', value: '8', color: 'text-[#16A34A]' },
            { label: 'Draft', value: '2', color: 'text-[#D97706]' },
            { label: 'Archived', value: '2', color: 'text-[#94A3B8]' },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#64748B] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 bg-white border border-[#E2E8F0] rounded-xl p-3">
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9] w-56"
          />
          {[
            { label: 'Program', options: ['All Programs', 'MBA', 'BBA', 'BCA', 'PGDM'] },
            { label: 'Academic Year', options: ['2026-27', '2025-26'] },
          ].map(f => (
            <select key={f.label} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]">
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]">
            {['All', 'ACTIVE', 'DRAFT', 'ARCHIVED', 'PAUSED'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {['Package Name', 'Code', 'Program / Course', 'Acad. Year', 'Base Amount', 'Final Amount', 'Students', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((pkg) => (
                  <tr key={pkg.id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#1E3A5F]">{pkg.name}</p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{pkg.course}</p>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[#64748B]">{pkg.code}</td>
                    <td className="px-5 py-4 text-[#64748B]">{pkg.program}</td>
                    <td className="px-5 py-4 text-[#64748B]">{pkg.year}</td>
                    <td className="px-5 py-4 text-[#64748B]">{pkg.base}</td>
                    <td className="px-5 py-4 font-semibold text-[#1E3A5F]">{pkg.final}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#1E3A5F]">{pkg.students}</span>
                      <span className="text-[#94A3B8] text-xs ml-1">students</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[pkg.status] || 'bg-gray-100 text-gray-500'}`}>{pkg.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-[#0EA5E9] hover:underline font-medium">View</button>
                        <button className="text-xs text-[#64748B] hover:text-[#1E3A5F]">Edit</button>
                        <button className="text-xs text-[#64748B] hover:text-[#1E3A5F]">Duplicate</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-[#F1F5F9] flex items-center justify-between">
            <p className="text-xs text-[#94A3B8]">Showing {filtered.length} of {packages.length} packages</p>
            <div className="flex gap-1">
              {[1, 2, 3].map(p => (
                <button key={p} className={`w-7 h-7 rounded text-xs font-medium ${p === 1 ? 'bg-[#1E3A5F] text-white' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
