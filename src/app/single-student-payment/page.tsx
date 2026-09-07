'use client';
import React, { useState } from 'react';
import AppShell from '@/components/AppShell';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', type: 'online' },
  { id: 'card', label: 'Card', icon: '💳', type: 'online' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', type: 'online' },
  { id: 'wallet', label: 'Wallet', icon: '👛', type: 'online' },
  { id: 'neft', label: 'NEFT/RTGS', icon: '🔄', type: 'online' },
  { id: 'cash', label: 'Cash', icon: '💵', type: 'offline' },
  { id: 'cheque', label: 'Cheque', icon: '📄', type: 'offline' },
  { id: 'dd', label: 'Demand Draft', icon: '📋', type: 'offline' },
  { id: 'pos', label: 'POS Terminal', icon: '🖥️', type: 'offline' },
  { id: 'emi', label: 'EMI', icon: '📅', type: 'online' },
];

const mockStudents = [
  { id: 'STU-001', appId: 'APP-2627001', name: 'Rahul Sharma', course: 'MBA Finance', program: 'MBA', batch: '2026-28', branch: 'Mumbai', status: 'Confirmed', totalFee: 450000, paid: 100000, outstanding: 350000, overdue: 0, discount: 15000, scholarship: 50000, refund: 0, currency: 'INR', package: 'MBA Standard Package' },
  { id: 'STU-002', appId: 'APP-2627002', name: 'Priya Patel', course: 'MBA Marketing', program: 'MBA', batch: '2026-28', branch: 'Delhi', status: 'Confirmed', totalFee: 375000, paid: 375000, outstanding: 0, overdue: 0, discount: 75000, scholarship: 50000, refund: 0, currency: 'INR', package: 'MBA Merit Package' },
  { id: 'STU-003', appId: 'APP-2627003', name: 'Amit Kumar', course: 'MBA HR', program: 'MBA', batch: '2026-28', branch: 'Pune', status: 'Confirmed', totalFee: 450000, paid: 87500, outstanding: 362500, overdue: 87500, discount: 15000, scholarship: 0, refund: 0, currency: 'INR', package: 'MBA Standard Package' },
  { id: 'STU-004', appId: 'APP-2627004', name: 'Sarah Johnson', course: 'MBA Finance', program: 'MBA', batch: '2026-28', branch: 'Mumbai', status: 'Confirmed', totalFee: 800000, paid: 400000, outstanding: 400000, overdue: 0, discount: 0, scholarship: 0, refund: 0, currency: 'USD', package: 'MBA International Package' },
  { id: 'STU-005', appId: 'APP-2627005', name: 'Sneha Joshi', course: 'BBA', program: 'BBA', batch: '2026-29', branch: 'Mumbai', status: 'Confirmed', totalFee: 235000, paid: 235000, outstanding: 0, overdue: 0, discount: 15000, scholarship: 0, refund: 5000, currency: 'INR', package: 'BBA Standard' },
];

const mockLedger = [
  { date: '01 Apr 2026', ref: 'INV-2627-001', desc: 'Fee Demand - MBA Standard Package', debit: 450000, credit: 0, balance: 450000, type: 'invoice', status: 'Active' },
  { date: '01 Apr 2026', ref: 'DISC-001', desc: 'Early Bird Discount Applied', debit: 0, credit: 15000, balance: 435000, type: 'discount', status: 'Applied' },
  { date: '01 Apr 2026', ref: 'SCH-001', desc: 'Merit Scholarship Applied', debit: 0, credit: 50000, balance: 385000, type: 'scholarship', status: 'Applied' },
  { date: '15 Apr 2026', ref: 'TXN-001', desc: 'Payment Received - UPI', debit: 0, credit: 100000, balance: 285000, type: 'payment', status: 'Success' },
  { date: '15 Apr 2026', ref: 'RCP-001', desc: 'Receipt Generated', debit: 0, credit: 0, balance: 285000, type: 'receipt', status: 'Issued' },
];

const mockInvoices = [
  { id: 'INV-2627-001', date: '01 Apr 2026', due: '15 Apr 2026', amount: 450000, paid: 100000, balance: 350000, status: 'Partially Paid' },
  { id: 'INV-2627-002', date: '01 Jun 2026', due: '15 Jun 2026', amount: 87500, paid: 0, balance: 87500, status: 'Due' },
];

const mockInstallments = [
  { no: 1, due: '15 Apr 2026', amount: 87500, paid: 87500, balance: 0, status: 'Paid' },
  { no: 2, due: '15 Jun 2026', amount: 87500, paid: 0, balance: 87500, status: 'Due' },
  { no: 3, due: '15 Aug 2026', amount: 87500, paid: 0, balance: 87500, status: 'Upcoming' },
  { no: 4, due: '15 Oct 2026', amount: 87500, paid: 0, balance: 87500, status: 'Upcoming' },
  { no: 5, due: '15 Dec 2026', amount: 87500, paid: 0, balance: 87500, status: 'Upcoming' },
];

function fmt(n: number, symbol = '₹') {
  return symbol + n.toLocaleString('en-IN');
}

interface Student {
  id: string;
  appId: string;
  name: string;
  course: string;
  program: string;
  batch: string;
  branch: string;
  status: string;
  totalFee: number;
  paid: number;
  outstanding: number;
  overdue: number;
  discount: number;
  scholarship: number;
  refund: number;
  currency: string;
  package: string;
}

export default function SingleStudentPaymentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [collectAmount, setCollectAmount] = useState('');
  const [collectMethod, setCollectMethod] = useState('upi');
  const [collectCurrency, setCollectCurrency] = useState('INR');
  const [searchBy, setSearchBy] = useState('name');
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const filteredStudents = mockStudents.filter(s => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    if (searchBy === 'name') return s.name.toLowerCase().includes(q);
    if (searchBy === 'appId') return s.appId.toLowerCase().includes(q);
    if (searchBy === 'id') return s.id.toLowerCase().includes(q);
    if (searchBy === 'mobile') return false;
    return s.name.toLowerCase().includes(q);
  });

  const currencySymbol = selectedStudent
    ? (CURRENCIES.find(c => c.code === selectedStudent.currency)?.symbol || '₹')
    : '₹';

  const handleCollect = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowCollectModal(false);
      setPaymentSuccess(false);
      setCollectAmount('');
    }, 2000);
  };

  const statusColor: Record<string, string> = {
    'Paid': 'bg-green-100 text-green-700',
    'Partially Paid': 'bg-blue-100 text-blue-700',
    'Due': 'bg-orange-100 text-orange-700',
    'Overdue': 'bg-red-100 text-red-700',
    'Upcoming': 'bg-gray-100 text-gray-600',
    'Confirmed': 'bg-green-100 text-green-700',
    'Active': 'bg-blue-100 text-blue-700',
    'Applied': 'bg-purple-100 text-purple-700',
    'Success': 'bg-green-100 text-green-700',
    'Issued': 'bg-gray-100 text-gray-600',
  };

  const tabs = ['overview', 'invoices', 'installments', 'ledger', 'transactions', 'payment-links', 'adjustments'];

  return (
    <AppShell activePath="/single-student-payment">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">Single Student Payment</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Search a student and manage their complete payment profile</p>
          </div>
          {selectedStudent && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowLinkModal(true)}
                className="border border-[#1E3A5F] text-[#1E3A5F] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors"
              >
                🔗 Payment Link
              </button>
              <button
                onClick={() => setShowCollectModal(true)}
                className="bg-[#1E3A5F] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#0F2A4F] transition-colors shadow-sm"
              >
                + Collect Payment
              </button>
            </div>
          )}
        </div>

        {/* Search Panel */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#1E3A5F] mb-3">Search Student</h3>
          <div className="flex gap-3 flex-wrap">
            <div className="flex gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-1">
              {[
                { key: 'name', label: 'Name' },
                { key: 'appId', label: 'App ID' },
                { key: 'id', label: 'Student ID' },
                { key: 'mobile', label: 'Mobile' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSearchBy(opt.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${searchBy === opt.key ? 'bg-white text-[#1E3A5F] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#1E3A5F]'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder={`Search by ${searchBy === 'name' ? 'student name' : searchBy === 'appId' ? 'application ID' : searchBy === 'id' ? 'student ID' : 'mobile number'}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 min-w-64 border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]"
            />
            <select className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none">
              <option>All Institutes</option>
              <option>ABC Business School</option>
            </select>
            <select className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none">
              <option>All Branches</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Pune</option>
              <option>Bangalore</option>
            </select>
            <select className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none">
              <option>2026-27</option>
              <option>2025-26</option>
            </select>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-3 border border-[#E2E8F0] rounded-xl overflow-hidden">
              {filteredStudents.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#94A3B8]">No students found matching your search.</div>
              ) : (
                filteredStudents.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedStudent(s); setSearchQuery(''); setActiveTab('overview'); }}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#F0F9FF] transition-colors border-b border-[#F1F5F9] last:border-0 text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#1E3A5F] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1E3A5F]">{s.name}</p>
                      <p className="text-xs text-[#64748B]">{s.appId} · {s.course} · {s.branch}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#1E3A5F]">{fmt(s.outstanding, CURRENCIES.find(c => c.code === s.currency)?.symbol || '₹')}</p>
                      <p className="text-xs text-[#94A3B8]">Outstanding</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.outstanding === 0 ? 'bg-green-100 text-green-700' : s.overdue > 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {s.outstanding === 0 ? 'Paid' : s.overdue > 0 ? 'Overdue' : 'Pending'}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Student Profile */}
        {selectedStudent ? (
          <div className="space-y-5">
            {/* Student Header Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#1E3A5F] text-white text-xl font-bold flex items-center justify-center flex-shrink-0">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1E3A5F]">{selectedStudent.name}</h2>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-[#64748B] font-mono">{selectedStudent.id}</span>
                      <span className="text-[#CBD5E0]">·</span>
                      <span className="text-xs text-[#64748B]">{selectedStudent.appId}</span>
                      <span className="text-[#CBD5E0]">·</span>
                      <span className="text-xs text-[#64748B]">{selectedStudent.course}</span>
                      <span className="text-[#CBD5E0]">·</span>
                      <span className="text-xs text-[#64748B]">{selectedStudent.branch}</span>
                      <span className="text-[#CBD5E0]">·</span>
                      <span className="text-xs text-[#64748B]">Batch {selectedStudent.batch}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[selectedStudent.status] || 'bg-gray-100 text-gray-600'}`}>{selectedStudent.status}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{selectedStudent.package}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">{selectedStudent.currency}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs border border-[#E2E8F0] text-[#64748B] px-3 py-1.5 rounded-lg hover:bg-[#F8FAFC]">Override Package</button>
                  <button className="text-xs border border-[#E2E8F0] text-[#64748B] px-3 py-1.5 rounded-lg hover:bg-[#F8FAFC]">Add Discount</button>
                  <button className="text-xs border border-[#E2E8F0] text-[#64748B] px-3 py-1.5 rounded-lg hover:bg-[#F8FAFC]">Add Scholarship</button>
                  <button className="text-xs bg-[#F0F9FF] text-[#0EA5E9] border border-[#BAE6FD] px-3 py-1.5 rounded-lg hover:bg-[#E0F2FE] font-medium">Send Reminder</button>
                </div>
              </div>
            </div>

            {/* Financial KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Total Fee', value: fmt(selectedStudent.totalFee, currencySymbol), color: 'text-[#1E3A5F]', bg: 'bg-white' },
                { label: 'Paid', value: fmt(selectedStudent.paid, currencySymbol), color: 'text-[#16A34A]', bg: 'bg-white' },
                { label: 'Outstanding', value: fmt(selectedStudent.outstanding, currencySymbol), color: selectedStudent.outstanding > 0 ? 'text-[#D97706]' : 'text-[#16A34A]', bg: 'bg-white' },
                { label: 'Overdue', value: fmt(selectedStudent.overdue, currencySymbol), color: selectedStudent.overdue > 0 ? 'text-red-600' : 'text-[#94A3B8]', bg: 'bg-white' },
                { label: 'Discount', value: fmt(selectedStudent.discount, currencySymbol), color: 'text-purple-600', bg: 'bg-white' },
                { label: 'Scholarship', value: fmt(selectedStudent.scholarship, currencySymbol), color: 'text-indigo-600', bg: 'bg-white' },
                { label: 'Refund', value: fmt(selectedStudent.refund, currencySymbol), color: 'text-[#64748B]', bg: 'bg-white' },
              ].map((card, i) => (
                <div key={i} className={`${card.bg} border border-[#E2E8F0] rounded-xl p-3 text-center`}>
                  <p className={`text-base font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Payment Progress */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#64748B]">Payment Progress</span>
                <span className="text-xs font-bold text-[#1E3A5F]">{Math.round((selectedStudent.paid / selectedStudent.totalFee) * 100)}% Paid</span>
              </div>
              <div className="w-full bg-[#F1F5F9] rounded-full h-2.5">
                <div
                  className="bg-[#16A34A] h-2.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.round((selectedStudent.paid / selectedStudent.totalFee) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-[#94A3B8]">
                <span>Paid: {fmt(selectedStudent.paid, currencySymbol)}</span>
                <span>Remaining: {fmt(selectedStudent.outstanding, currencySymbol)}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="border-b border-[#E2E8F0] overflow-x-auto">
                <div className="flex min-w-max">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-3.5 text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'text-[#0EA5E9] border-b-2 border-[#0EA5E9] bg-[#F0F9FF]' : 'text-[#64748B] hover:text-[#1E3A5F] hover:bg-[#F8FAFC]'}`}
                    >
                      {tab.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">Fee Structure</h4>
                        <div className="space-y-2">
                          {[
                            { head: 'Tuition Fee', amount: 400000, mandatory: true },
                            { head: 'Admission Fee', amount: 25000, mandatory: true },
                            { head: 'Examination Fee', amount: 10000, mandatory: true },
                            { head: 'Hostel Fee', amount: 80000, mandatory: false },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-[#F1F5F9]">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-[#1E3A5F]">{item.head}</span>
                                {!item.mandatory && <span className="text-xs text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded">Optional</span>}
                              </div>
                              <span className="text-sm font-medium text-[#1E3A5F]">{fmt(item.amount, currencySymbol)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-2 font-semibold">
                            <span className="text-[#64748B]">Gross (Mandatory)</span>
                            <span className="text-[#1E3A5F]">{fmt(435000, currencySymbol)}</span>
                          </div>
                          <div className="flex justify-between text-purple-600 text-sm">
                            <span>- Discount (Early Bird)</span>
                            <span>-{fmt(selectedStudent.discount, currencySymbol)}</span>
                          </div>
                          <div className="flex justify-between text-indigo-600 text-sm">
                            <span>- Scholarship (Merit)</span>
                            <span>-{fmt(selectedStudent.scholarship, currencySymbol)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-base border-t border-[#E2E8F0] pt-2">
                            <span className="text-[#1E3A5F]">Final Payable</span>
                            <span className="text-[#16A34A]">{fmt(selectedStudent.totalFee, currencySymbol)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">Payment Plan</h4>
                        <div className="space-y-2">
                          {mockInstallments.map((inst, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-[#F1F5F9]">
                              <div>
                                <p className="text-sm font-medium text-[#1E3A5F]">Installment {inst.no}</p>
                                <p className="text-xs text-[#94A3B8]">Due: {inst.due}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-[#1E3A5F]">{fmt(inst.amount, currencySymbol)}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[inst.status] || 'bg-gray-100 text-gray-600'}`}>{inst.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Invoices Tab */}
                {activeTab === 'invoices' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-[#1E3A5F]">Invoices</h4>
                      <button className="text-xs bg-[#1E3A5F] text-white px-3 py-1.5 rounded-lg hover:bg-[#0F2A4F]">+ Generate Invoice</button>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F8FAFC]">
                          {['Invoice #', 'Date', 'Due Date', 'Amount', 'Paid', 'Balance', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {mockInvoices.map((inv, i) => (
                          <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                            <td className="px-4 py-3 font-mono text-xs text-[#0EA5E9]">{inv.id}</td>
                            <td className="px-4 py-3 text-[#64748B]">{inv.date}</td>
                            <td className="px-4 py-3 text-[#64748B]">{inv.due}</td>
                            <td className="px-4 py-3 font-medium text-[#1E3A5F]">{fmt(inv.amount, currencySymbol)}</td>
                            <td className="px-4 py-3 text-[#16A34A]">{fmt(inv.paid, currencySymbol)}</td>
                            <td className="px-4 py-3 font-semibold text-[#D97706]">{fmt(inv.balance, currencySymbol)}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[inv.status] || 'bg-gray-100 text-gray-600'}`}>{inv.status}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button className="text-xs text-[#0EA5E9] hover:underline">View</button>
                                <button className="text-xs text-[#64748B] hover:text-[#1E3A5F]">Pay</button>
                                <button className="text-xs text-[#64748B] hover:text-[#1E3A5F]">Download</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Installments Tab */}
                {activeTab === 'installments' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-[#1E3A5F]">Installment Schedule</h4>
                      <div className="flex gap-2">
                        <button className="text-xs border border-[#E2E8F0] text-[#64748B] px-3 py-1.5 rounded-lg hover:bg-[#F8FAFC]">Reschedule</button>
                        <button className="text-xs bg-[#1E3A5F] text-white px-3 py-1.5 rounded-lg hover:bg-[#0F2A4F]">Collect Installment</button>
                      </div>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F8FAFC]">
                          {['#', 'Due Date', 'Amount', 'Paid', 'Balance', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {mockInstallments.map((inst, i) => (
                          <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                            <td className="px-4 py-3 font-medium text-[#1E3A5F]">{inst.no}</td>
                            <td className="px-4 py-3 text-[#64748B]">{inst.due}</td>
                            <td className="px-4 py-3 font-medium text-[#1E3A5F]">{fmt(inst.amount, currencySymbol)}</td>
                            <td className="px-4 py-3 text-[#16A34A]">{fmt(inst.paid, currencySymbol)}</td>
                            <td className="px-4 py-3 font-semibold text-[#D97706]">{fmt(inst.balance, currencySymbol)}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[inst.status] || 'bg-gray-100 text-gray-600'}`}>{inst.status}</span></td>
                            <td className="px-4 py-3">
                              {inst.status !== 'Paid' && (
                                <button onClick={() => setShowCollectModal(true)} className="text-xs text-[#0EA5E9] hover:underline font-medium">Collect</button>
                              )}
                              {inst.status === 'Paid' && <span className="text-xs text-[#16A34A]">✓ Paid</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Ledger Tab */}
                {activeTab === 'ledger' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-[#1E3A5F]">Student Ledger</h4>
                      <button className="text-xs border border-[#E2E8F0] text-[#64748B] px-3 py-1.5 rounded-lg hover:bg-[#F8FAFC]">Export</button>
                    </div>
                    <div className="bg-[#FFF7ED] border border-orange-200 rounded-lg px-4 py-2 mb-4">
                      <p className="text-xs text-orange-700">📌 Ledger entries are immutable. Historical records cannot be modified.</p>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F8FAFC]">
                          {['Date', 'Reference', 'Description', 'Debit', 'Credit', 'Balance', 'Status'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {mockLedger.map((entry, i) => (
                          <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                            <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">{entry.date}</td>
                            <td className="px-4 py-3 font-mono text-xs text-[#0EA5E9]">{entry.ref}</td>
                            <td className="px-4 py-3 text-[#1E3A5F]">{entry.desc}</td>
                            <td className="px-4 py-3 font-medium text-red-600">{entry.debit > 0 ? fmt(entry.debit, currencySymbol) : '—'}</td>
                            <td className="px-4 py-3 font-medium text-[#16A34A]">{entry.credit > 0 ? fmt(entry.credit, currencySymbol) : '—'}</td>
                            <td className="px-4 py-3 font-semibold text-[#1E3A5F]">{fmt(entry.balance, currencySymbol)}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[entry.status] || 'bg-gray-100 text-gray-600'}`}>{entry.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                  <div>
                    <h4 className="text-sm font-bold text-[#1E3A5F] mb-4">Transaction History</h4>
                    <div className="space-y-3">
                      {[
                        { id: 'TXN-2627-001', date: '15 Apr 2026', method: 'UPI', gateway: 'Razorpay', amount: 100000, status: 'Success', gatewayId: 'pay_OxKj8Ld2mN' },
                      ].map((txn, i) => (
                        <div key={i} className="border border-[#E2E8F0] rounded-xl p-4 hover:bg-[#F8FAFC]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-[#F0F9FF] flex items-center justify-center text-lg">💳</div>
                              <div>
                                <p className="text-sm font-semibold text-[#1E3A5F]">{txn.id}</p>
                                <p className="text-xs text-[#64748B]">{txn.date} · {txn.method} · {txn.gateway}</p>
                                <p className="text-xs text-[#94A3B8] font-mono">{txn.gatewayId}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-base font-bold text-[#16A34A]">{fmt(txn.amount, currencySymbol)}</p>
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{txn.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Links Tab */}
                {activeTab === 'payment-links' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-[#1E3A5F]">Payment Links</h4>
                      <button onClick={() => setShowLinkModal(true)} className="text-xs bg-[#1E3A5F] text-white px-3 py-1.5 rounded-lg hover:bg-[#0F2A4F]">+ Create Link</button>
                    </div>
                    <div className="text-center py-10 text-[#94A3B8]">
                      <p className="text-4xl mb-3">🔗</p>
                      <p className="text-sm font-medium">No payment links created yet</p>
                      <p className="text-xs mt-1">Create a payment link to share with the student</p>
                    </div>
                  </div>
                )}

                {/* Adjustments Tab */}
                {activeTab === 'adjustments' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-[#1E3A5F]">Adjustments & Credit Notes</h4>
                      <button className="text-xs bg-[#1E3A5F] text-white px-3 py-1.5 rounded-lg hover:bg-[#0F2A4F]">+ Add Adjustment</button>
                    </div>
                    <div className="text-center py-10 text-[#94A3B8]">
                      <p className="text-4xl mb-3">📋</p>
                      <p className="text-sm font-medium">No adjustments recorded</p>
                      <p className="text-xs mt-1">Adjustments, concessions, and waivers will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-16 text-center">
            <p className="text-5xl mb-4">🎓</p>
            <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">Search for a Student</h3>
            <p className="text-sm text-[#64748B] mb-6 max-w-md mx-auto">Use the search panel above to find a student by name, application ID, student ID, or mobile number to view and manage their payment profile.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {mockStudents.slice(0, 4).map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className="flex items-center gap-2 border border-[#E2E8F0] rounded-xl px-4 py-2.5 hover:bg-[#F0F9FF] hover:border-[#BAE6FD] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center">
                    {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-[#1E3A5F]">{s.name}</p>
                    <p className="text-xs text-[#94A3B8]">{s.course}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Collect Payment Modal */}
      {showCollectModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#1E3A5F]">Collect Payment</h3>
              <button onClick={() => { setShowCollectModal(false); setPaymentSuccess(false); }} className="text-[#94A3B8] hover:text-[#1E3A5F] text-xl">✕</button>
            </div>
            {paymentSuccess ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                <h4 className="text-lg font-bold text-[#16A34A] mb-1">Payment Recorded!</h4>
                <p className="text-sm text-[#64748B]">Receipt and ledger entry have been created.</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="bg-[#F8FAFC] rounded-xl p-3">
                  <p className="text-xs text-[#64748B]">Student</p>
                  <p className="text-sm font-semibold text-[#1E3A5F]">{selectedStudent.name} · {selectedStudent.appId}</p>
                  <p className="text-xs text-[#94A3B8]">Outstanding: {fmt(selectedStudent.outstanding, currencySymbol)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Currency</label>
                    <select value={collectCurrency} onChange={e => setCollectCurrency(e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]">
                      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Amount</label>
                    <input
                      type="number"
                      value={collectAmount}
                      onChange={e => setCollectAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map(m => (
                      <label key={m.id} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${collectMethod === m.id ? 'border-[#0EA5E9] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#CBD5E0]'}`}>
                        <input type="radio" name="method" value={m.id} checked={collectMethod === m.id} onChange={() => setCollectMethod(m.id)} className="text-[#0EA5E9]" />
                        <span className="text-base">{m.icon}</span>
                        <div>
                          <p className="text-xs font-medium text-[#1E3A5F]">{m.label}</p>
                          <p className="text-xs text-[#94A3B8] capitalize">{m.type}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Reference / Transaction ID</label>
                  <input type="text" placeholder="Bank ref, UTR, cheque no..." className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowCollectModal(false)} className="flex-1 border border-[#E2E8F0] text-[#64748B] text-sm font-medium py-2.5 rounded-xl hover:bg-[#F8FAFC]">Cancel</button>
                  <button onClick={handleCollect} disabled={!collectAmount} className="flex-1 bg-[#16A34A] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">Record Payment</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Link Modal */}
      {showLinkModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#1E3A5F]">Generate Payment Link</h3>
              <button onClick={() => { setShowLinkModal(false); setLinkGenerated(false); }} className="text-[#94A3B8] hover:text-[#1E3A5F] text-xl">✕</button>
            </div>
            <div className="p-5 space-y-4">
              {!linkGenerated ? (
                <>
                  <div className="bg-[#F8FAFC] rounded-xl p-3">
                    <p className="text-xs text-[#64748B]">Student: <span className="font-semibold text-[#1E3A5F]">{selectedStudent.name}</span></p>
                    <p className="text-xs text-[#64748B] mt-0.5">Outstanding: <span className="font-semibold text-[#D97706]">{fmt(selectedStudent.outstanding, currencySymbol)}</span></p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Amount</label>
                    <input type="number" defaultValue={selectedStudent.outstanding} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Expiry</label>
                    <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none">
                      <option>24 hours</option>
                      <option>48 hours</option>
                      <option>7 days</option>
                      <option>30 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-2">Send Via</label>
                    <div className="flex gap-2">
                      {['WhatsApp', 'SMS', 'Email'].map(ch => (
                        <label key={ch} className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-lg px-3 py-2 cursor-pointer hover:border-[#0EA5E9]">
                          <input type="checkbox" defaultChecked={ch === 'WhatsApp'} className="rounded text-[#0EA5E9]" />
                          <span className="text-xs font-medium text-[#1E3A5F]">{ch}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setLinkGenerated(true)} className="w-full bg-[#1E3A5F] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0F2A4F]">Generate & Send Link</button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl mx-auto">🔗</div>
                  <div>
                    <p className="text-sm font-bold text-[#16A34A]">Payment Link Generated!</p>
                    <p className="text-xs text-[#64748B] mt-1">Link sent via WhatsApp to student</p>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-left">
                    <p className="text-xs text-[#94A3B8] mb-1">Payment Link</p>
                    <p className="text-xs font-mono text-[#0EA5E9] break-all">https://pay.abcbusiness.edu/p/TXN-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 border border-[#E2E8F0] text-[#64748B] text-xs py-2 rounded-lg hover:bg-[#F8FAFC]">Copy Link</button>
                    <button className="flex-1 bg-[#25D366] text-white text-xs py-2 rounded-lg hover:bg-green-600">WhatsApp</button>
                    <button className="flex-1 bg-[#1E3A5F] text-white text-xs py-2 rounded-lg hover:bg-[#0F2A4F]">Email</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
