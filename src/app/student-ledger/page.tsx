'use client';
import React, { useState } from 'react';
import AppShell from '@/components/AppShell';

const students = [
  { id: 'STU-2627-001', name: 'Rahul Sharma', course: 'MBA Finance', batch: '2026-28', branch: 'Mumbai', package: 'MBA Standard Package', total: 450000, paid: 100000, outstanding: 350000, overdue: 0, discount: 65000 },
  { id: 'STU-2627-002', name: 'Priya Patel', course: 'MBA Marketing', batch: '2026-28', branch: 'Mumbai', package: 'MBA Merit Package', total: 375000, paid: 187500, outstanding: 187500, overdue: 0, discount: 125000 },
  { id: 'STU-2627-003', name: 'Amit Kumar', course: 'BBA', batch: '2026-29', branch: 'Delhi', package: 'BBA Standard', total: 235000, paid: 47000, outstanding: 188000, overdue: 47000, discount: 15000 },
  { id: 'STU-2627-004', name: 'Sneha Joshi', course: 'MBA HR', batch: '2026-28', branch: 'Pune', package: 'MBA Standard Package', total: 450000, paid: 0, outstanding: 450000, overdue: 90000, discount: 65000 },
  { id: 'STU-2627-005', name: 'Vikram Singh', course: 'MBA Finance', batch: '2026-28', branch: 'Mumbai', package: 'MBA Early Bird', total: 425000, paid: 212500, outstanding: 212500, overdue: 0, discount: 90000 },
];

const ledgerEntries = [
  { date: '01 Apr 2026', ref: 'PKG-001', desc: 'Package Assigned — MBA Standard Package', debit: 450000, credit: 0, balance: 450000, status: 'Posted' },
  { date: '01 Apr 2026', ref: 'DISC-001', desc: 'Early Bird Discount Applied', debit: 0, credit: 15000, balance: 435000, status: 'Posted' },
  { date: '01 Apr 2026', ref: 'SCH-001', desc: 'Merit Scholarship Applied', debit: 0, credit: 50000, balance: 385000, status: 'Posted' },
  { date: '15 Apr 2026', ref: 'INV-2627-001', desc: 'Invoice Generated — Installment 1', debit: 100000, credit: 0, balance: 485000, status: 'Posted' },
  { date: '20 Apr 2026', ref: 'TXN-001', desc: 'Payment Received — UPI (Razorpay)', debit: 0, credit: 100000, balance: 385000, status: 'Settled' },
  { date: '20 Apr 2026', ref: 'RCP-001', desc: 'Receipt Generated — RCP-2627-001', debit: 0, credit: 0, balance: 385000, status: 'Posted' },
];

const invoices = [
  { no: 'INV-2627-001', date: '15 Apr 2026', desc: 'Installment 1', amount: 100000, paid: 100000, balance: 0, status: 'PAID' },
  { no: 'INV-2627-002', date: '15 Jun 2026', desc: 'Installment 2', amount: 87500, paid: 0, balance: 87500, status: 'DUE' },
  { no: 'INV-2627-003', date: '15 Aug 2026', desc: 'Installment 3', amount: 87500, paid: 0, balance: 87500, status: 'UPCOMING' },
  { no: 'INV-2627-004', date: '15 Oct 2026', desc: 'Installment 4', amount: 87500, paid: 0, balance: 87500, status: 'UPCOMING' },
  { no: 'INV-2627-005', date: '15 Dec 2026', desc: 'Installment 5', amount: 87500, paid: 0, balance: 87500, status: 'UPCOMING' },
];

const transactions = [
  { id: 'TXN-001', date: '20 Apr 2026', amount: 100000, method: 'UPI', gateway: 'Razorpay', status: 'SUCCESS', settlement: 'Settled', ref: 'pay_OBJ123456' },
];

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

const invStatusStyle: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  DUE: 'bg-red-100 text-red-700',
  UPCOMING: 'bg-blue-100 text-blue-700',
  OVERDUE: 'bg-orange-100 text-orange-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

const tabs = ['Fee Structure', 'Payment Plan', 'Invoices', 'Transactions', 'Ledger', 'Receipts', 'Refunds', 'Adjustments'];

export default function StudentLedgerPage() {
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [activeTab, setActiveTab] = useState('Ledger');
  const [search, setSearch] = useState('');
  const [showToast, setShowToast] = useState('');

  const toast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3000);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell activePath="/student-ledger">
      <div className="p-6 space-y-5">
        {/* Toast */}
        {showToast && (
          <div className="fixed top-5 right-5 z-50 bg-[#1E3A5F] text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg animate-fade-in">
            ✓ {showToast}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">Student Ledger</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Complete financial history for each student</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toast('Statement downloaded')} className="border border-[#E2E8F0] text-[#64748B] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#F8FAFC]">
              ↓ Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Student List */}
          <div className="lg:col-span-1 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="p-3 border-b border-[#E2E8F0]">
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {filteredStudents.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full text-left p-3 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors ${selectedStudent.id === s.id ? 'bg-[#EFF6FF] border-l-2 border-l-[#0EA5E9]' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E3A5F] truncate">{s.name}</p>
                      <p className="text-xs text-[#94A3B8]">{s.id}</p>
                      <p className="text-xs text-[#64748B]">{s.course}</p>
                    </div>
                  </div>
                  {s.overdue > 0 && (
                    <div className="mt-1.5 ml-10">
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Overdue {fmt(s.overdue)}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Student Detail */}
          <div className="lg:col-span-3 space-y-5">
            {/* Student Profile Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#1E3A5F] text-white text-xl font-bold flex items-center justify-center">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1E3A5F]">{selectedStudent.name}</h2>
                    <p className="text-sm text-[#64748B]">{selectedStudent.id} · {selectedStudent.course} · {selectedStudent.batch}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{selectedStudent.branch} · Academic Year 2026-27</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#64748B]">Package</p>
                  <p className="text-sm font-semibold text-[#1E3A5F]">{selectedStudent.package}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>
              </div>

              {/* Financial Summary Cards */}
              <div className="grid grid-cols-5 gap-3 mt-5">
                {[
                  { label: 'Total Fee', value: fmt(selectedStudent.total), color: 'text-[#1E3A5F]', bg: 'bg-[#F8FAFC]' },
                  { label: 'Paid', value: fmt(selectedStudent.paid), color: 'text-[#16A34A]', bg: 'bg-green-50' },
                  { label: 'Outstanding', value: fmt(selectedStudent.outstanding), color: 'text-[#D97706]', bg: 'bg-yellow-50' },
                  { label: 'Overdue', value: fmt(selectedStudent.overdue), color: selectedStudent.overdue > 0 ? 'text-[#DC2626]' : 'text-[#94A3B8]', bg: selectedStudent.overdue > 0 ? 'bg-red-50' : 'bg-[#F8FAFC]' },
                  { label: 'Discount / Scholarship', value: fmt(selectedStudent.discount), color: 'text-[#0EA5E9]', bg: 'bg-blue-50' },
                ].map((c, i) => (
                  <div key={i} className={`${c.bg} rounded-xl p-3 text-center`}>
                    <p className={`text-base font-bold ${c.color}`}>{c.value}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[#64748B] mb-1.5">
                  <span>Collection Progress</span>
                  <span>{Math.round(selectedStudent.paid / selectedStudent.total * 100)}% collected</span>
                </div>
                <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(selectedStudent.paid / selectedStudent.total * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => toast('Payment collection opened')} className="bg-[#1E3A5F] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#0F2A4F]">
                💳 Collect Payment
              </button>
              <button onClick={() => toast('Payment link generated')} className="bg-[#0EA5E9] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-sky-600">
                🔗 Generate Payment Link
              </button>
              <button onClick={() => toast('Reminder sent to student')} className="border border-[#E2E8F0] text-[#64748B] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#F8FAFC]">
                📩 Send Reminder
              </button>
              <button onClick={() => toast('Statement downloaded')} className="border border-[#E2E8F0] text-[#64748B] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#F8FAFC]">
                ↓ Download Statement
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="flex overflow-x-auto border-b border-[#E2E8F0]">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'text-[#1E3A5F] border-b-2 border-[#1E3A5F] bg-[#F8FAFC]'
                        : 'text-[#64748B] hover:text-[#1E3A5F] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {/* LEDGER TAB */}
                {activeTab === 'Ledger' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F8FAFC]">
                          {['Date', 'Reference', 'Description', 'Debit', 'Credit', 'Balance', 'Status'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ledgerEntries.map((entry, i) => (
                          <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                            <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">{entry.date}</td>
                            <td className="px-4 py-3 font-mono text-xs text-[#0EA5E9]">{entry.ref}</td>
                            <td className="px-4 py-3 text-[#1E3A5F]">{entry.desc}</td>
                            <td className="px-4 py-3 font-medium text-[#DC2626]">
                              {entry.debit > 0 ? fmt(entry.debit) : '—'}
                            </td>
                            <td className="px-4 py-3 font-medium text-[#16A34A]">
                              {entry.credit > 0 ? fmt(entry.credit) : '—'}
                            </td>
                            <td className="px-4 py-3 font-semibold text-[#1E3A5F]">{fmt(entry.balance)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${entry.status === 'Settled' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {entry.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-[#94A3B8] mt-3 px-4">Ledger entries are immutable and cannot be edited or deleted.</p>
                  </div>
                )}

                {/* INVOICES TAB */}
                {activeTab === 'Invoices' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F8FAFC]">
                          {['Invoice No', 'Date', 'Description', 'Amount', 'Paid', 'Balance', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv, i) => (
                          <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                            <td className="px-4 py-3 font-mono text-xs text-[#0EA5E9]">{inv.no}</td>
                            <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">{inv.date}</td>
                            <td className="px-4 py-3 text-[#1E3A5F]">{inv.desc}</td>
                            <td className="px-4 py-3 font-medium text-[#1E3A5F]">{fmt(inv.amount)}</td>
                            <td className="px-4 py-3 font-medium text-[#16A34A]">{inv.paid > 0 ? fmt(inv.paid) : '—'}</td>
                            <td className="px-4 py-3 font-medium text-[#D97706]">{inv.balance > 0 ? fmt(inv.balance) : '—'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${invStatusStyle[inv.status] || 'bg-gray-100 text-gray-500'}`}>{inv.status}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => toast(`Invoice ${inv.no} downloaded`)} className="text-xs text-[#0EA5E9] hover:underline">View</button>
                                {inv.status === 'DUE' && (
                                  <button onClick={() => toast('Payment link sent')} className="text-xs text-[#16A34A] hover:underline font-medium">Pay Now</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TRANSACTIONS TAB */}
                {activeTab === 'Transactions' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F8FAFC]">
                          {['Transaction ID', 'Date', 'Amount', 'Method', 'Gateway', 'Status', 'Settlement', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx, i) => (
                          <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                            <td className="px-4 py-3 font-mono text-xs text-[#0EA5E9]">{tx.id}</td>
                            <td className="px-4 py-3 text-[#64748B]">{tx.date}</td>
                            <td className="px-4 py-3 font-semibold text-[#1E3A5F]">{fmt(tx.amount)}</td>
                            <td className="px-4 py-3 text-[#64748B]">{tx.method}</td>
                            <td className="px-4 py-3 text-[#64748B]">{tx.gateway}</td>
                            <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">{tx.status}</span></td>
                            <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{tx.settlement}</span></td>
                            <td className="px-4 py-3">
                              <button onClick={() => toast('Receipt downloaded')} className="text-xs text-[#0EA5E9] hover:underline">View Receipt</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* FEE STRUCTURE TAB */}
                {activeTab === 'Fee Structure' && (
                  <div className="space-y-3">
                    {[
                      { head: 'Admission Fee', amount: 25000, mandatory: true, refundable: false },
                      { head: 'Tuition Fee', amount: 400000, mandatory: true, refundable: false },
                      { head: 'Examination Fee', amount: 10000, mandatory: true, refundable: false },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                        <div>
                          <p className="text-sm font-semibold text-[#1E3A5F]">{f.head}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{f.mandatory ? 'Mandatory' : 'Optional'}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${f.refundable ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>{f.refundable ? 'Refundable' : 'Non-refundable'}</span>
                          </div>
                        </div>
                        <p className="text-base font-bold text-[#1E3A5F]">{fmt(f.amount)}</p>
                      </div>
                    ))}
                    <div className="bg-[#1E3A5F] text-white rounded-xl p-4 flex justify-between">
                      <span className="font-semibold">Total Fee (after discounts)</span>
                      <span className="font-bold text-lg">{fmt(selectedStudent.total)}</span>
                    </div>
                  </div>
                )}

                {/* PAYMENT PLAN TAB */}
                {activeTab === 'Payment Plan' && (
                  <div className="space-y-3">
                    <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-[#0EA5E9]">MBA 5-Installment Plan</p>
                      <p className="text-xs text-[#64748B] mt-1">5 equal installments of ₹87,500 · Grace period: 5 days · Late fee: ₹500 fixed</p>
                    </div>
                    {invoices.map((inv, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${inv.status === 'PAID' ? 'bg-green-500 text-white' : inv.status === 'DUE' ? 'bg-red-500 text-white' : 'bg-[#E2E8F0] text-[#64748B]'}`}>
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1E3A5F]">{inv.desc}</p>
                            <p className="text-xs text-[#64748B]">Due: {inv.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#1E3A5F]">{fmt(inv.amount)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${invStatusStyle[inv.status]}`}>{inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* REFUNDS TAB */}
                {activeTab === 'Refunds' && (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">↩</div>
                    <p className="text-sm font-semibold text-[#1E3A5F]">No Refunds</p>
                    <p className="text-xs text-[#94A3B8] mt-1">No refund requests for this student</p>
                    <button onClick={() => toast('Refund request form opened')} className="mt-4 border border-[#E2E8F0] text-[#64748B] text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#F8FAFC]">
                      + Initiate Refund
                    </button>
                  </div>
                )}

                {/* ADJUSTMENTS TAB */}
                {activeTab === 'Adjustments' && (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">⚖️</div>
                    <p className="text-sm font-semibold text-[#1E3A5F]">No Adjustments</p>
                    <p className="text-xs text-[#94A3B8] mt-1">No manual adjustments recorded</p>
                    <button onClick={() => toast('Adjustment form opened')} className="mt-4 border border-[#E2E8F0] text-[#64748B] text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#F8FAFC]">
                      + Add Adjustment
                    </button>
                  </div>
                )}

                {/* RECEIPTS TAB */}
                {activeTab === 'Receipts' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F8FAFC]">
                          {['Receipt No', 'Date', 'Amount', 'Method', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]">
                          <td className="px-4 py-3 font-mono text-xs text-[#0EA5E9]">RCP-2627-001</td>
                          <td className="px-4 py-3 text-[#64748B]">20 Apr 2026</td>
                          <td className="px-4 py-3 font-semibold text-[#1E3A5F]">₹1,00,000</td>
                          <td className="px-4 py-3 text-[#64748B]">UPI</td>
                          <td className="px-4 py-3">
                            <button onClick={() => toast('Receipt downloaded')} className="text-xs text-[#0EA5E9] hover:underline">Download PDF</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
