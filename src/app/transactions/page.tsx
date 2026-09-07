'use client';
import React, { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';

interface Transaction {
  id: string;
  orderId: string;
  student: string;
  studentId: string;
  course: string;
  program: string;
  branch: string;
  invoice: string;
  package: string;
  amount: number;
  method: string;
  gateway: string;
  gatewayTxnId: string;
  date: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REVERSED' | 'REFUNDED' | 'CANCELLED';
  failureReason?: string;
  settlementStatus: 'SETTLED' | 'PENDING' | 'FAILED' | 'N/A';
  retryCount?: number;
}

const TRANSACTIONS: Transaction[] = [
  { id: 'TXN-2026-001', orderId: 'ORD-8821', student: 'Rahul Sharma', studentId: 'STU-1001', course: 'MBA Finance', program: 'MBA', branch: 'Mumbai', invoice: 'INV-2026-001', package: 'MBA Standard', amount: 100000, method: 'UPI', gateway: 'Razorpay', gatewayTxnId: 'pay_OABCxyz001', date: '2026-04-20', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-002', orderId: 'ORD-8822', student: 'Priya Patel', studentId: 'STU-1002', course: 'MBA Marketing', program: 'MBA', branch: 'Mumbai', invoice: 'INV-2026-002', package: 'MBA Merit', amount: 87500, method: 'Card', gateway: 'Razorpay', gatewayTxnId: 'pay_OABCxyz002', date: '2026-04-19', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-003', orderId: 'ORD-8823', student: 'Amit Kumar', studentId: 'STU-1003', course: 'BBA', program: 'BBA', branch: 'Delhi', invoice: 'INV-2026-003', package: 'BBA Standard', amount: 47000, method: 'Net Banking', gateway: 'Cashfree', gatewayTxnId: 'CF_TXN_003', date: '2026-04-19', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-004', orderId: 'ORD-8824', student: 'Sneha Joshi', studentId: 'STU-1004', course: 'MBA HR', program: 'MBA', branch: 'Pune', invoice: 'INV-2026-004', package: 'MBA Standard', amount: 90000, method: 'UPI', gateway: 'Razorpay', gatewayTxnId: 'pay_OABCxyz004', date: '2026-04-18', status: 'FAILED', failureReason: 'Insufficient Funds', settlementStatus: 'N/A', retryCount: 2 },
  { id: 'TXN-2026-005', orderId: 'ORD-8825', student: 'Vikram Singh', studentId: 'STU-1005', course: 'MBA Finance', program: 'MBA', branch: 'Mumbai', invoice: 'INV-2026-005', package: 'MBA Early Bird', amount: 100000, method: 'Card', gateway: 'Razorpay', gatewayTxnId: 'pay_OABCxyz005', date: '2026-04-18', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-006', orderId: 'ORD-8826', student: 'Ananya Reddy', studentId: 'STU-1006', course: 'BCA', program: 'BCA', branch: 'Bangalore', invoice: 'INV-2026-006', package: 'BCA Standard', amount: 33000, method: 'Cash', gateway: 'Offline', gatewayTxnId: 'CASH-006', date: '2026-04-17', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-007', orderId: 'ORD-8827', student: 'Rohit Gupta', studentId: 'STU-1007', course: 'MBA Marketing', program: 'MBA', branch: 'Delhi', invoice: 'INV-2026-007', package: 'MBA Standard', amount: 87500, method: 'UPI', gateway: 'PayU', gatewayTxnId: 'PU_TXN_007', date: '2026-04-17', status: 'PENDING', settlementStatus: 'PENDING' },
  { id: 'TXN-2026-008', orderId: 'ORD-8828', student: 'Kavya Nair', studentId: 'STU-1008', course: 'PGDM', program: 'PGDM', branch: 'Mumbai', invoice: 'INV-2026-008', package: 'PGDM Standard', amount: 84000, method: 'Net Banking', gateway: 'Razorpay', gatewayTxnId: 'pay_OABCxyz008', date: '2026-04-16', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-009', orderId: 'ORD-8829', student: 'Arjun Mehta', studentId: 'STU-1009', course: 'MBA Finance', program: 'MBA', branch: 'Mumbai', invoice: 'INV-2026-009', package: 'MBA International', amount: 150000, method: 'Wire Transfer', gateway: 'Stripe', gatewayTxnId: 'ch_stripe_009', date: '2026-04-15', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-010', orderId: 'ORD-8830', student: 'Pooja Agarwal', studentId: 'STU-1010', course: 'BBA', program: 'BBA', branch: 'Pune', invoice: 'INV-2026-010', package: 'BBA Standard', amount: 47000, method: 'Card', gateway: 'Cashfree', gatewayTxnId: 'CF_TXN_010', date: '2026-04-15', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-011', orderId: 'ORD-8831', student: 'Deepak Verma', studentId: 'STU-1011', course: 'MCA', program: 'MCA', branch: 'Delhi', invoice: 'INV-2026-011', package: 'MCA Standard', amount: 55000, method: 'UPI', gateway: 'Razorpay', gatewayTxnId: 'pay_OABCxyz011', date: '2026-04-14', status: 'REVERSED', settlementStatus: 'FAILED' },
  { id: 'TXN-2026-012', orderId: 'ORD-8832', student: 'Meera Krishnan', studentId: 'STU-1012', course: 'MBA HR', program: 'MBA', branch: 'Bangalore', invoice: 'INV-2026-012', package: 'MBA Standard', amount: 90000, method: 'Card', gateway: 'Razorpay', gatewayTxnId: 'pay_OABCxyz012', date: '2026-04-13', status: 'REFUNDED', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-013', orderId: 'ORD-8833', student: 'Sanjay Tiwari', studentId: 'STU-1013', course: 'PGDM', program: 'PGDM', branch: 'Mumbai', invoice: 'INV-2026-013', package: 'PGDM Standard', amount: 84000, method: 'Cheque', gateway: 'Offline', gatewayTxnId: 'CHQ-013', date: '2026-04-12', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-014', orderId: 'ORD-8834', student: 'Ritu Sharma', studentId: 'STU-1014', course: 'BCA', program: 'BCA', branch: 'Delhi', invoice: 'INV-2026-014', package: 'BCA Standard', amount: 33000, method: 'UPI', gateway: 'Razorpay', gatewayTxnId: 'pay_OABCxyz014', date: '2026-04-11', status: 'FAILED', failureReason: 'Bank Declined', settlementStatus: 'N/A', retryCount: 1 },
  { id: 'TXN-2026-015', orderId: 'ORD-8835', student: 'Nikhil Bose', studentId: 'STU-1015', course: 'MBA Finance', program: 'MBA', branch: 'Pune', invoice: 'INV-2026-015', package: 'MBA Sponsored', amount: 200000, method: 'NEFT', gateway: 'Offline', gatewayTxnId: 'NEFT-015', date: '2026-04-10', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-016', orderId: 'ORD-8836', student: 'Swati Mishra', studentId: 'STU-1016', course: 'MBA Marketing', program: 'MBA', branch: 'Mumbai', invoice: 'INV-2026-016', package: 'MBA Standard', amount: 87500, method: 'UPI', gateway: 'Razorpay', gatewayTxnId: 'pay_OABCxyz016', date: '2026-04-09', status: 'PENDING', settlementStatus: 'PENDING' },
  { id: 'TXN-2026-017', orderId: 'ORD-8837', student: 'Karan Malhotra', studentId: 'STU-1017', course: 'BBA', program: 'BBA', branch: 'Bangalore', invoice: 'INV-2026-017', package: 'BBA Standard', amount: 47000, method: 'Card', gateway: 'Cashfree', gatewayTxnId: 'CF_TXN_017', date: '2026-04-08', status: 'SUCCESS', settlementStatus: 'SETTLED' },
  { id: 'TXN-2026-018', orderId: 'ORD-8838', student: 'Divya Kapoor', studentId: 'STU-1018', course: 'MCA', program: 'MCA', branch: 'Delhi', invoice: 'INV-2026-018', package: 'MCA Standard', amount: 55000, method: 'Net Banking', gateway: 'PayU', gatewayTxnId: 'PU_TXN_018', date: '2026-04-07', status: 'SUCCESS', settlementStatus: 'SETTLED' },
];

const STATUS_TABS = ['All', 'Successful', 'Failed', 'Pending', 'Reversed', 'Refunds'] as const;
type StatusTab = typeof STATUS_TABS[number];

const statusMap: Record<StatusTab, Transaction['status'][] | null> = {
  All: null,
  Successful: ['SUCCESS'],
  Failed: ['FAILED', 'CANCELLED'],
  Pending: ['PENDING'],
  Reversed: ['REVERSED'],
  Refunds: ['REFUNDED'],
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    SUCCESS: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    FAILED: 'bg-red-50 text-red-700 border border-red-200',
    PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
    REVERSED: 'bg-purple-50 text-purple-700 border border-purple-200',
    REFUNDED: 'bg-blue-50 text-blue-700 border border-blue-200',
    CANCELLED: 'bg-gray-100 text-gray-600 border border-gray-200',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const settlementBadge = (s: string) => {
  const map: Record<string, string> = {
    SETTLED: 'text-emerald-600',
    PENDING: 'text-amber-600',
    FAILED: 'text-red-600',
    'N/A': 'text-gray-400',
  };
  return map[s] || 'text-gray-400';
};

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>('All');
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');
  const [filterGateway, setFilterGateway] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<Transaction | null>(null);
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let data = [...TRANSACTIONS];
    const statuses = statusMap[activeTab];
    if (statuses) data = data.filter(t => statuses.includes(t.status));
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(t =>
        t.student.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.studentId.toLowerCase().includes(q) ||
        t.invoice.toLowerCase().includes(q) ||
        t.gatewayTxnId.toLowerCase().includes(q)
      );
    }
    if (filterMethod !== 'All') data = data.filter(t => t.method === filterMethod);
    if (filterGateway !== 'All') data = data.filter(t => t.gateway === filterGateway);
    if (filterBranch !== 'All') data = data.filter(t => t.branch === filterBranch);
    if (dateFrom) data = data.filter(t => t.date >= dateFrom);
    if (dateTo) data = data.filter(t => t.date <= dateTo);
    data.sort((a, b) => {
      const va = sortField === 'date' ? a.date : a.amount;
      const vb = sortField === 'date' ? b.date : b.amount;
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return data;
  }, [activeTab, search, filterMethod, filterGateway, filterBranch, dateFrom, dateTo, sortField, sortDir]);

  const tabCounts = useMemo(() => {
    const counts: Record<StatusTab, number> = { All: TRANSACTIONS.length, Successful: 0, Failed: 0, Pending: 0, Reversed: 0, Refunds: 0 };
    TRANSACTIONS.forEach(t => {
      if (t.status === 'SUCCESS') counts.Successful++;
      if (t.status === 'FAILED' || t.status === 'CANCELLED') counts.Failed++;
      if (t.status === 'PENDING') counts.Pending++;
      if (t.status === 'REVERSED') counts.Reversed++;
      if (t.status === 'REFUNDED') counts.Refunds++;
    });
    return counts;
  }, []);

  const totalAmount = useMemo(() => filtered.filter(t => t.status === 'SUCCESS').reduce((s, t) => s + t.amount, 0), [filtered]);

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(t => t.id));

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <AppShell activePath="/transactions">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 mb-1">Transactions / All Transactions</div>
            <h1 className="text-xl font-bold text-[#0F172A]">Transaction Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track, audit, and manage all payment transactions</p>
          </div>
          <div className="flex gap-2">
            {selected.length > 0 && (
              <button className="flex items-center gap-1.5 px-3 py-2 bg-[#0F172A] text-white text-sm rounded-lg font-medium">
                <span>⬇</span> Export {selected.length} Selected
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-50">
              <span>⬇</span> Export All
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Transactions', value: TRANSACTIONS.length.toString(), sub: 'All time', icon: '🔄', color: 'text-[#0F172A]' },
            { label: 'Successful Amount', value: fmt(TRANSACTIONS.filter(t => t.status === 'SUCCESS').reduce((s, t) => s + t.amount, 0)), sub: `${TRANSACTIONS.filter(t => t.status === 'SUCCESS').length} transactions`, icon: '✅', color: 'text-emerald-600' },
            { label: 'Failed Transactions', value: TRANSACTIONS.filter(t => t.status === 'FAILED').length.toString(), sub: 'Needs attention', icon: '❌', color: 'text-red-600' },
            { label: 'Pending Settlement', value: fmt(TRANSACTIONS.filter(t => t.settlementStatus === 'PENDING').reduce((s, t) => s + t.amount, 0)), sub: `${TRANSACTIONS.filter(t => t.settlementStatus === 'PENDING').length} transactions`, icon: '⏳', color: 'text-amber-600' },
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

        {/* Status Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex border-b border-gray-100">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : 'bg-gray-100 text-gray-500'}`}>
                  {tabCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search student, TXN ID, invoice..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30"
              />
            </div>
            <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 bg-white">
              {['All', 'UPI', 'Card', 'Net Banking', 'Cash', 'Cheque', 'NEFT', 'Wire Transfer'].map(m => <option key={m}>{m}</option>)}
            </select>
            <select value={filterGateway} onChange={e => setFilterGateway(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 bg-white">
              {['All', 'Razorpay', 'Cashfree', 'PayU', 'Stripe', 'Offline'].map(g => <option key={g}>{g}</option>)}
            </select>
            <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 bg-white">
              {['All', 'Mumbai', 'Delhi', 'Pune', 'Bangalore'].map(b => <option key={b}>{b}</option>)}
            </select>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30" />
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30" />
            {(search || filterMethod !== 'All' || filterGateway !== 'All' || filterBranch !== 'All' || dateFrom || dateTo) && (
              <button onClick={() => { setSearch(''); setFilterMethod('All'); setFilterGateway('All'); setFilterBranch('All'); setDateFrom(''); setDateTo(''); }} className="text-sm text-[#0EA5E9] hover:underline">Clear</button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left w-10">
                    <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
                  </th>
                  <th className="px-4 py-3 text-left">Transaction ID</th>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Invoice</th>
                  <th className="px-4 py-3 text-left">Method</th>
                  <th className="px-4 py-3 text-left">Gateway</th>
                  <th className="px-4 py-3 text-right cursor-pointer select-none" onClick={() => handleSort('amount')}>
                    Amount {sortField === 'amount' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => handleSort('date')}>
                    Date {sortField === 'date' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                  </th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Settlement</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={11} className="text-center py-16 text-gray-400">
                    <div className="text-4xl mb-3">🔍</div>
                    <div className="font-medium">No transactions found</div>
                    <div className="text-xs mt-1">Try adjusting your filters</div>
                  </td></tr>
                ) : filtered.map(t => (
                  <tr key={t.id} className={`hover:bg-gray-50/50 transition-colors ${selected.includes(t.id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggleSelect(t.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs text-[#0EA5E9] font-semibold">{t.id}</div>
                      <div className="text-xs text-gray-400">{t.orderId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0F172A]">{t.student}</div>
                      <div className="text-xs text-gray-400">{t.studentId} · {t.course}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-mono text-gray-600">{t.invoice}</div>
                      <div className="text-xs text-gray-400">{t.branch}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">{t.method}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{t.gateway}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[#0F172A]">{fmt(t.amount)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{t.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge(t.status)}`}>{t.status}</span>
                      {t.failureReason && <div className="text-xs text-red-500 mt-0.5">{t.failureReason}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${settlementBadge(t.settlementStatus)}`}>{t.settlementStatus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDrawer(t)} className="text-xs text-[#0EA5E9] hover:underline font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing {filtered.length} of {TRANSACTIONS.length} transactions</span>
            {activeTab === 'Successful' || activeTab === 'All' ? (
              <span className="font-semibold text-emerald-600">Successful Total: {fmt(totalAmount)}</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Transaction Detail Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setDrawer(null)} />
          <div className="w-[480px] bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#0F172A]">
              <div>
                <div className="text-xs text-gray-400">Transaction Detail</div>
                <div className="text-white font-bold font-mono">{drawer.id}</div>
              </div>
              <button onClick={() => setDrawer(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="p-6 space-y-5 flex-1">
              {/* Status Banner */}
              <div className={`rounded-xl p-4 flex items-center gap-3 ${drawer.status === 'SUCCESS' ? 'bg-emerald-50 border border-emerald-200' : drawer.status === 'FAILED' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                <span className="text-2xl">{drawer.status === 'SUCCESS' ? '✅' : drawer.status === 'FAILED' ? '❌' : '⏳'}</span>
                <div>
                  <div className="font-bold text-[#0F172A]">{fmt(drawer.amount)}</div>
                  <div className={`text-sm font-semibold ${drawer.status === 'SUCCESS' ? 'text-emerald-700' : drawer.status === 'FAILED' ? 'text-red-700' : 'text-amber-700'}`}>{drawer.status}</div>
                  {drawer.failureReason && <div className="text-xs text-red-600 mt-0.5">{drawer.failureReason}</div>}
                </div>
              </div>

              {/* Student Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Student Information</div>
                {[
                  ['Student Name', drawer.student],
                  ['Student ID', drawer.studentId],
                  ['Course', drawer.course],
                  ['Program', drawer.program],
                  ['Branch', drawer.branch],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-gray-500">{l}</span>
                    <span className="font-medium text-[#0F172A]">{v}</span>
                  </div>
                ))}
              </div>

              {/* Transaction Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Transaction Details</div>
                {[
                  ['Transaction ID', drawer.id],
                  ['Order ID', drawer.orderId],
                  ['Invoice', drawer.invoice],
                  ['Package', drawer.package],
                  ['Payment Method', drawer.method],
                  ['Gateway', drawer.gateway],
                  ['Gateway Txn ID', drawer.gatewayTxnId],
                  ['Date', drawer.date],
                  ['Settlement Status', drawer.settlementStatus],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-gray-500">{l}</span>
                    <span className={`font-medium ${l === 'Settlement Status' ? settlementBadge(v) : 'text-[#0F172A]'} font-mono text-xs`}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700">📄 View Invoice</button>
                  <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700">🧾 Download Receipt</button>
                  {drawer.status === 'FAILED' && <button className="px-3 py-2 text-sm bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 font-medium text-amber-700">🔄 Retry Payment</button>}
                  {drawer.status === 'SUCCESS' && <button className="px-3 py-2 text-sm bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 font-medium text-red-700">↩ Initiate Refund</button>}
                  <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700">📋 Audit Trail</button>
                  <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700">📤 Export</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
