'use client';
import React, { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';

interface InvoiceItem {
  feeHead: string;
  amount: number;
  tax: number;
  total: number;
}

interface Invoice {
  id: string;
  student: string;
  studentId: string;
  course: string;
  program: string;
  branch: string;
  package: string;
  issueDate: string;
  dueDate: string;
  grossAmount: number;
  discount: number;
  scholarship: number;
  tax: number;
  netPayable: number;
  paid: number;
  balance: number;
  status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  items: InvoiceItem[];
  paymentMethod?: string;
  lastPaymentDate?: string;
}

const INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001', student: 'Rahul Sharma', studentId: 'STU-1001', course: 'MBA Finance', program: 'MBA', branch: 'Mumbai', package: 'MBA Standard',
    issueDate: '2026-06-01', dueDate: '2026-07-15', grossAmount: 450000, discount: 15000, scholarship: 50000, tax: 0, netPayable: 385000, paid: 100000, balance: 285000,
    status: 'PARTIALLY_PAID', paymentMethod: 'UPI', lastPaymentDate: '2026-07-10',
    items: [
      { feeHead: 'Tuition Fee', amount: 300000, tax: 0, total: 300000 },
      { feeHead: 'Admission Fee', amount: 25000, tax: 0, total: 25000 },
      { feeHead: 'Examination Fee', amount: 10000, tax: 0, total: 10000 },
      { feeHead: 'Technology Fee', amount: 15000, tax: 0, total: 15000 },
      { feeHead: 'Library Fee', amount: 5000, tax: 0, total: 5000 },
    ],
  },
  {
    id: 'INV-2026-002', student: 'Priya Patel', studentId: 'STU-1002', course: 'MBA Marketing', program: 'MBA', branch: 'Mumbai', package: 'MBA Merit',
    issueDate: '2026-06-01', dueDate: '2026-07-15', grossAmount: 450000, discount: 0, scholarship: 75000, tax: 0, netPayable: 375000, paid: 375000, balance: 0,
    status: 'PAID', paymentMethod: 'Card', lastPaymentDate: '2026-07-08',
    items: [
      { feeHead: 'Tuition Fee', amount: 300000, tax: 0, total: 300000 },
      { feeHead: 'Admission Fee', amount: 25000, tax: 0, total: 25000 },
      { feeHead: 'Examination Fee', amount: 10000, tax: 0, total: 10000 },
      { feeHead: 'Technology Fee', amount: 15000, tax: 0, total: 15000 },
    ],
  },
  {
    id: 'INV-2026-003', student: 'Amit Kumar', studentId: 'STU-1003', course: 'BBA', program: 'BBA', branch: 'Delhi', package: 'BBA Standard',
    issueDate: '2026-06-01', dueDate: '2026-07-01', grossAmount: 188000, discount: 0, scholarship: 0, tax: 0, netPayable: 188000, paid: 47000, balance: 141000,
    status: 'OVERDUE', lastPaymentDate: '2026-06-15',
    items: [
      { feeHead: 'Tuition Fee', amount: 120000, tax: 0, total: 120000 },
      { feeHead: 'Admission Fee', amount: 15000, tax: 0, total: 15000 },
      { feeHead: 'Examination Fee', amount: 8000, tax: 0, total: 8000 },
      { feeHead: 'Library Fee', amount: 5000, tax: 0, total: 5000 },
    ],
  },
  {
    id: 'INV-2026-004', student: 'Sneha Joshi', studentId: 'STU-1004', course: 'MBA HR', program: 'MBA', branch: 'Pune', package: 'MBA Standard',
    issueDate: '2026-06-01', dueDate: '2026-07-15', grossAmount: 450000, discount: 0, scholarship: 0, tax: 0, netPayable: 450000, paid: 0, balance: 450000,
    status: 'OVERDUE',
    items: [
      { feeHead: 'Tuition Fee', amount: 300000, tax: 0, total: 300000 },
      { feeHead: 'Admission Fee', amount: 25000, tax: 0, total: 25000 },
      { feeHead: 'Examination Fee', amount: 10000, tax: 0, total: 10000 },
      { feeHead: 'Hostel Fee', amount: 80000, tax: 0, total: 80000 },
      { feeHead: 'Mess Fee', amount: 35000, tax: 0, total: 35000 },
    ],
  },
  {
    id: 'INV-2026-005', student: 'Vikram Singh', studentId: 'STU-1005', course: 'MBA Finance', program: 'MBA', branch: 'Mumbai', package: 'MBA Early Bird',
    issueDate: '2026-05-15', dueDate: '2026-06-30', grossAmount: 450000, discount: 25000, scholarship: 0, tax: 0, netPayable: 425000, paid: 425000, balance: 0,
    status: 'PAID', paymentMethod: 'Card', lastPaymentDate: '2026-06-20',
    items: [
      { feeHead: 'Tuition Fee', amount: 300000, tax: 0, total: 300000 },
      { feeHead: 'Admission Fee', amount: 25000, tax: 0, total: 25000 },
      { feeHead: 'Examination Fee', amount: 10000, tax: 0, total: 10000 },
      { feeHead: 'Technology Fee', amount: 15000, tax: 0, total: 15000 },
    ],
  },
  {
    id: 'INV-2026-006', student: 'Ananya Reddy', studentId: 'STU-1006', course: 'BCA', program: 'BCA', branch: 'Bangalore', package: 'BCA Standard',
    issueDate: '2026-06-01', dueDate: '2026-07-15', grossAmount: 132000, discount: 0, scholarship: 0, tax: 0, netPayable: 132000, paid: 33000, balance: 99000,
    status: 'PARTIALLY_PAID', paymentMethod: 'Cash', lastPaymentDate: '2026-07-05',
    items: [
      { feeHead: 'Tuition Fee', amount: 90000, tax: 0, total: 90000 },
      { feeHead: 'Admission Fee', amount: 12000, tax: 0, total: 12000 },
      { feeHead: 'Lab Fee', amount: 20000, tax: 0, total: 20000 },
      { feeHead: 'Library Fee', amount: 5000, tax: 0, total: 5000 },
      { feeHead: 'Examination Fee', amount: 5000, tax: 0, total: 5000 },
    ],
  },
  {
    id: 'INV-2026-007', student: 'Rohit Gupta', studentId: 'STU-1007', course: 'MBA Marketing', program: 'MBA', branch: 'Delhi', package: 'MBA Standard',
    issueDate: '2026-06-15', dueDate: '2026-08-01', grossAmount: 450000, discount: 0, scholarship: 0, tax: 0, netPayable: 450000, paid: 0, balance: 450000,
    status: 'ISSUED',
    items: [
      { feeHead: 'Tuition Fee', amount: 300000, tax: 0, total: 300000 },
      { feeHead: 'Admission Fee', amount: 25000, tax: 0, total: 25000 },
      { feeHead: 'Examination Fee', amount: 10000, tax: 0, total: 10000 },
      { feeHead: 'Technology Fee', amount: 15000, tax: 0, total: 15000 },
    ],
  },
  {
    id: 'INV-2026-008', student: 'Kavya Nair', studentId: 'STU-1008', course: 'PGDM', program: 'PGDM', branch: 'Mumbai', package: 'PGDM Standard',
    issueDate: '2026-06-01', dueDate: '2026-07-15', grossAmount: 420000, discount: 0, scholarship: 0, tax: 0, netPayable: 420000, paid: 252000, balance: 168000,
    status: 'PARTIALLY_PAID', paymentMethod: 'Net Banking', lastPaymentDate: '2026-07-12',
    items: [
      { feeHead: 'Tuition Fee', amount: 280000, tax: 0, total: 280000 },
      { feeHead: 'Admission Fee', amount: 20000, tax: 0, total: 20000 },
      { feeHead: 'Examination Fee', amount: 10000, tax: 0, total: 10000 },
      { feeHead: 'Placement Fee', amount: 50000, tax: 0, total: 50000 },
      { feeHead: 'Technology Fee', amount: 15000, tax: 0, total: 15000 },
    ],
  },
  {
    id: 'INV-2026-009', student: 'Arjun Mehta', studentId: 'STU-1009', course: 'MBA Finance', program: 'MBA', branch: 'Mumbai', package: 'MBA International',
    issueDate: '2026-05-01', dueDate: '2026-06-01', grossAmount: 750000, discount: 0, scholarship: 0, tax: 0, netPayable: 750000, paid: 750000, balance: 0,
    status: 'PAID', paymentMethod: 'Wire Transfer', lastPaymentDate: '2026-05-28',
    items: [
      { feeHead: 'Tuition Fee', amount: 500000, tax: 0, total: 500000 },
      { feeHead: 'Admission Fee', amount: 50000, tax: 0, total: 50000 },
      { feeHead: 'Examination Fee', amount: 20000, tax: 0, total: 20000 },
      { feeHead: 'International Student Fee', amount: 100000, tax: 0, total: 100000 },
      { feeHead: 'Technology Fee', amount: 30000, tax: 0, total: 30000 },
    ],
  },
  {
    id: 'INV-2026-010', student: 'Deepak Verma', studentId: 'STU-1011', course: 'MCA', program: 'MCA', branch: 'Delhi', package: 'MCA Standard',
    issueDate: '2026-06-01', dueDate: '2026-07-15', grossAmount: 220000, discount: 0, scholarship: 0, tax: 0, netPayable: 220000, paid: 0, balance: 220000,
    status: 'DRAFT',
    items: [
      { feeHead: 'Tuition Fee', amount: 160000, tax: 0, total: 160000 },
      { feeHead: 'Admission Fee', amount: 15000, tax: 0, total: 15000 },
      { feeHead: 'Lab Fee', amount: 25000, tax: 0, total: 25000 },
      { feeHead: 'Examination Fee', amount: 10000, tax: 0, total: 10000 },
    ],
  },
];

const STATUS_FILTERS = ['All', 'Draft', 'Issued', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

const statusMap: Record<StatusFilter, Invoice['status'][] | null> = {
  All: null,
  Draft: ['DRAFT'],
  Issued: ['ISSUED'],
  'Partially Paid': ['PARTIALLY_PAID'],
  Paid: ['PAID'],
  Overdue: ['OVERDUE'],
  Cancelled: ['CANCELLED'],
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-600 border border-gray-200',
    ISSUED: 'bg-blue-50 text-blue-700 border border-blue-200',
    PARTIALLY_PAID: 'bg-amber-50 text-amber-700 border border-amber-200',
    PAID: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    OVERDUE: 'bg-red-50 text-red-700 border border-red-200',
    CANCELLED: 'bg-gray-100 text-gray-500 border border-gray-200',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const statusLabel = (s: string) => s.replace('_', ' ');
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function InvoicesPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('All');
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterProgram, setFilterProgram] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ student: '', course: '', dueDate: '', notes: '' });

  const filtered = useMemo(() => {
    let data = [...INVOICES];
    const statuses = statusMap[activeFilter];
    if (statuses) data = data.filter(inv => statuses.includes(inv.status));
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(inv =>
        inv.student.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        inv.studentId.toLowerCase().includes(q)
      );
    }
    if (filterBranch !== 'All') data = data.filter(inv => inv.branch === filterBranch);
    if (filterProgram !== 'All') data = data.filter(inv => inv.program === filterProgram);
    return data;
  }, [activeFilter, search, filterBranch, filterProgram]);

  const tabCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = { All: INVOICES.length, Draft: 0, Issued: 0, 'Partially Paid': 0, Paid: 0, Overdue: 0, Cancelled: 0 };
    INVOICES.forEach(inv => {
      if (inv.status === 'DRAFT') counts.Draft++;
      if (inv.status === 'ISSUED') counts.Issued++;
      if (inv.status === 'PARTIALLY_PAID') counts['Partially Paid']++;
      if (inv.status === 'PAID') counts.Paid++;
      if (inv.status === 'OVERDUE') counts.Overdue++;
      if (inv.status === 'CANCELLED') counts.Cancelled++;
    });
    return counts;
  }, []);

  const kpis = useMemo(() => ({
    totalDemand: INVOICES.reduce((s, i) => s + i.netPayable, 0),
    totalCollected: INVOICES.reduce((s, i) => s + i.paid, 0),
    totalOutstanding: INVOICES.reduce((s, i) => s + i.balance, 0),
    overdueCount: INVOICES.filter(i => i.status === 'OVERDUE').length,
  }), []);

  return (
    <AppShell activePath="/invoices">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 mb-1">Student Finance / Invoices</div>
            <h1 className="text-xl font-bold text-[#0F172A]">Invoice Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage, track, and generate student fee invoices</p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0EA5E9] text-white text-sm rounded-lg font-semibold hover:bg-[#0284C7] transition-colors"
          >
            + Generate Invoice
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Demand', value: fmt(kpis.totalDemand), sub: `${INVOICES.length} invoices`, icon: '📄', color: 'text-[#0F172A]' },
            { label: 'Total Collected', value: fmt(kpis.totalCollected), sub: `${INVOICES.filter(i => i.status === 'PAID').length} fully paid`, icon: '✅', color: 'text-emerald-600' },
            { label: 'Outstanding', value: fmt(kpis.totalOutstanding), sub: `${INVOICES.filter(i => i.balance > 0).length} invoices pending`, icon: '⏳', color: 'text-amber-600' },
            { label: 'Overdue', value: kpis.overdueCount.toString(), sub: 'Requires immediate action', icon: '⚠️', color: 'text-red-600' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">{k.label}</span>
                <span className="text-lg">{k.icon}</span>
              </div>
              <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Status Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-3.5 text-sm font-medium flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${activeFilter === f ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {f}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeFilter === f ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : 'bg-gray-100 text-gray-500'}`}>
                  {tabCounts[f]}
                </span>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search student, invoice ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30"
              />
            </div>
            <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none bg-white">
              {['All', 'MBA', 'BBA', 'BCA', 'MCA', 'PGDM'].map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none bg-white">
              {['All', 'Mumbai', 'Delhi', 'Pune', 'Bangalore'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Invoice</th>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Course / Branch</th>
                  <th className="px-4 py-3 text-left">Issue Date</th>
                  <th className="px-4 py-3 text-left">Due Date</th>
                  <th className="px-4 py-3 text-right">Net Payable</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-16 text-gray-400">
                    <div className="text-4xl mb-3">📄</div>
                    <div className="font-medium">No invoices found</div>
                  </td></tr>
                ) : filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs text-[#0EA5E9] font-semibold">{inv.id}</div>
                      <div className="text-xs text-gray-400">{inv.package}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0F172A]">{inv.student}</div>
                      <div className="text-xs text-gray-400">{inv.studentId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{inv.course}</div>
                      <div className="text-xs text-gray-400">{inv.branch}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{inv.issueDate}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      <span className={inv.status === 'OVERDUE' ? 'text-red-600 font-semibold' : ''}>{inv.dueDate}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#0F172A]">{fmt(inv.netPayable)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">{fmt(inv.paid)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-red-600">{fmt(inv.balance)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge(inv.status)}`}>{statusLabel(inv.status)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedInvoice(inv)} className="text-xs text-[#0EA5E9] hover:underline font-medium">View</button>
                        <button className="text-xs text-gray-500 hover:underline">PDF</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            Showing {filtered.length} of {INVOICES.length} invoices
          </div>
        </div>
      </div>

      {/* Invoice Detail Drawer */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setSelectedInvoice(null)} />
          <div className="w-[560px] bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#0F172A]">
              <div>
                <div className="text-xs text-gray-400">Invoice Detail</div>
                <div className="text-white font-bold font-mono">{selectedInvoice.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge(selectedInvoice.status)}`}>{statusLabel(selectedInvoice.status)}</span>
                <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
              </div>
            </div>

            <div className="p-6 space-y-5 flex-1">
              {/* Institute Header */}
              <div className="text-center border-b border-dashed border-gray-200 pb-4">
                <div className="font-bold text-lg text-[#0F172A]">ABC Business School</div>
                <div className="text-xs text-gray-400">Mumbai, Maharashtra · GSTIN: 27AABCA1234B1Z5</div>
                <div className="text-xs text-gray-400 mt-0.5">Tel: +91 22 1234 5678 · accounts@abcbs.edu.in</div>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bill To</div>
                  <div className="font-bold text-[#0F172A]">{selectedInvoice.student}</div>
                  <div className="text-sm text-gray-500">{selectedInvoice.studentId}</div>
                  <div className="text-sm text-gray-500">{selectedInvoice.course}</div>
                  <div className="text-sm text-gray-500">{selectedInvoice.branch}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Invoice Info</div>
                  {[
                    ['Invoice No.', selectedInvoice.id],
                    ['Issue Date', selectedInvoice.issueDate],
                    ['Due Date', selectedInvoice.dueDate],
                    ['Package', selectedInvoice.package],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between text-sm">
                      <span className="text-gray-500">{l}</span>
                      <span className="font-medium text-[#0F172A] text-xs">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fee Heads Breakdown */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Fee Components</div>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500">
                        <th className="px-4 py-2.5 text-left">Fee Head</th>
                        <th className="px-4 py-2.5 text-right">Amount</th>
                        <th className="px-4 py-2.5 text-right">Tax</th>
                        <th className="px-4 py-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedInvoice.items.map(item => (
                        <tr key={item.feeHead}>
                          <td className="px-4 py-2.5 text-gray-700">{item.feeHead}</td>
                          <td className="px-4 py-2.5 text-right text-gray-600">{fmt(item.amount)}</td>
                          <td className="px-4 py-2.5 text-right text-gray-400">{item.tax > 0 ? fmt(item.tax) : '—'}</td>
                          <td className="px-4 py-2.5 text-right font-medium text-[#0F172A]">{fmt(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Gross Amount</span><span className="font-medium">{fmt(selectedInvoice.grossAmount)}</span></div>
                {selectedInvoice.discount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Discount</span><span>-{fmt(selectedInvoice.discount)}</span></div>}
                {selectedInvoice.scholarship > 0 && <div className="flex justify-between text-sm text-blue-600"><span>Scholarship</span><span>-{fmt(selectedInvoice.scholarship)}</span></div>}
                {selectedInvoice.tax > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax / GST</span><span>{fmt(selectedInvoice.tax)}</span></div>}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
                  <span>Net Payable</span>
                  <span className="text-[#0F172A]">{fmt(selectedInvoice.netPayable)}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-600"><span>Amount Paid</span><span>{fmt(selectedInvoice.paid)}</span></div>
                <div className="flex justify-between font-bold text-base text-red-600 border-t border-gray-200 pt-2">
                  <span>Balance Due</span>
                  <span>{fmt(selectedInvoice.balance)}</span>
                </div>
              </div>

              {/* Payment Progress */}
              {selectedInvoice.netPayable > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Payment Progress</span>
                    <span>{Math.round(selectedInvoice.paid / selectedInvoice.netPayable * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round(selectedInvoice.paid / selectedInvoice.netPayable * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700">📄 Download PDF</button>
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700">📧 Send to Student</button>
                {selectedInvoice.balance > 0 && (
                  <button className="px-3 py-2 text-sm bg-[#0EA5E9] text-white rounded-lg font-medium hover:bg-[#0284C7]">💳 Collect Payment</button>
                )}
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700">🔗 Payment Link</button>
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700">📋 Audit Trail</button>
                {selectedInvoice.status === 'DRAFT' && (
                  <button className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">✓ Issue Invoice</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowGenerateModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-[#0F172A]">Generate Invoice</h2>
              <button onClick={() => setShowGenerateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Student</label>
                <input type="text" placeholder="Search student name or ID..." value={newInvoice.student} onChange={e => setNewInvoice(p => ({ ...p, student: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Course / Package</label>
                <select value={newInvoice.course} onChange={e => setNewInvoice(p => ({ ...p, course: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white">
                  <option value="">Select course...</option>
                  {['MBA Finance', 'MBA Marketing', 'MBA HR', 'BBA', 'BCA', 'MCA', 'PGDM'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Due Date</label>
                <input type="date" value={newInvoice.dueDate} onChange={e => setNewInvoice(p => ({ ...p, dueDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Notes</label>
                <textarea value={newInvoice.notes} onChange={e => setNewInvoice(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Optional notes..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowGenerateModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 px-4 py-2 bg-[#0EA5E9] text-white rounded-lg text-sm font-semibold hover:bg-[#0284C7]"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
