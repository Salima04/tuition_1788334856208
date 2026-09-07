'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AppShell from '@/components/AppShell';

const collectionTrend = [
  { month: 'Jan', collected: 28.5, outstanding: 12.3 },
  { month: 'Feb', collected: 34.2, outstanding: 10.8 },
  { month: 'Mar', collected: 42.1, outstanding: 9.5 },
  { month: 'Apr', collected: 38.7, outstanding: 11.2 },
  { month: 'May', collected: 51.3, outstanding: 8.9 },
  { month: 'Jun', collected: 45.8, outstanding: 7.6 },
];

const paymentMethods = [
  { name: 'UPI', value: 45, color: '#0EA5E9' },
  { name: 'Card', value: 28, color: '#1E3A5F' },
  { name: 'Net Banking', value: 15, color: '#16A34A' },
  { name: 'Cash', value: 8, color: '#D97706' },
  { name: 'Other', value: 4, color: '#94A3B8' },
];

const courseCollection = [
  { course: 'MBA Finance', amount: 68.5 },
  { course: 'MBA Mktg', amount: 52.3 },
  { course: 'MBA HR', amount: 41.7 },
  { course: 'BBA', amount: 35.2 },
  { course: 'BCA', amount: 28.9 },
];

const branchOutstanding = [
  { branch: 'Mumbai', amount: 22.4 },
  { branch: 'Delhi', amount: 18.7 },
  { branch: 'Pune', amount: 11.3 },
  { branch: 'Bangalore', amount: 5.1 },
];

const recentTransactions = [
  { student: 'Rahul Sharma', course: 'MBA Finance', amount: '₹1,00,000', method: 'UPI', status: 'SUCCESS', date: '20 Apr 2026' },
  { student: 'Priya Patel', course: 'MBA Marketing', amount: '₹87,500', method: 'Card', status: 'SUCCESS', date: '19 Apr 2026' },
  { student: 'Amit Kumar', course: 'BBA', amount: '₹47,000', method: 'Net Banking', status: 'SUCCESS', date: '19 Apr 2026' },
  { student: 'Sneha Joshi', course: 'MBA HR', amount: '₹90,000', method: 'UPI', status: 'FAILED', date: '18 Apr 2026' },
  { student: 'Vikram Singh', course: 'MBA Finance', amount: '₹1,00,000', method: 'Card', status: 'SUCCESS', date: '18 Apr 2026' },
  { student: 'Ananya Reddy', course: 'BCA', amount: '₹33,000', method: 'Cash', status: 'SUCCESS', date: '17 Apr 2026' },
  { student: 'Rohit Gupta', course: 'MBA Marketing', amount: '₹87,500', method: 'UPI', status: 'PENDING', date: '17 Apr 2026' },
  { student: 'Kavya Nair', course: 'PGDM', amount: '₹84,000', method: 'Net Banking', status: 'SUCCESS', date: '16 Apr 2026' },
  { student: 'Arjun Mehta', course: 'MBA Finance', amount: '₹1,00,000', method: 'UPI', status: 'SUCCESS', date: '16 Apr 2026' },
  { student: 'Pooja Agarwal', course: 'BBA', amount: '₹47,000', method: 'Card', status: 'SUCCESS', date: '15 Apr 2026' },
];

const kpiCards = [
  { label: 'Total Fee Demand', value: '₹2,45,00,000', sub: '+12% vs last year', color: 'bg-[#1E3A5F]', textColor: 'text-white', icon: '📊' },
  { label: 'Total Collected', value: '₹1,87,50,000', sub: '76.5% collection rate', color: 'bg-[#16A34A]', textColor: 'text-white', icon: '✅' },
  { label: 'Total Outstanding', value: '₹57,50,000', sub: '23.5% pending', color: 'bg-white', textColor: 'text-[#1E3A5F]', icon: '⏳', border: true },
  { label: 'Overdue Amount', value: '₹12,30,000', sub: '47 students overdue', color: 'bg-white', textColor: 'text-[#DC2626]', icon: '⚠️', border: true },
  { label: "Today\'s Collection", value: '₹3,45,000', sub: '28 transactions', color: 'bg-white', textColor: 'text-[#1E3A5F]', icon: '📅', border: true },
  { label: 'Successful Payments', value: '847', sub: 'This month', color: 'bg-white', textColor: 'text-[#16A34A]', icon: '💳', border: true },
  { label: 'Failed Payments', value: '23', sub: '2.6% failure rate', color: 'bg-white', textColor: 'text-[#DC2626]', icon: '❌', border: true },
  { label: 'Active Packages', value: '12', sub: '8 programs covered', color: 'bg-white', textColor: 'text-[#1E3A5F]', icon: '📦', border: true },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    SUCCESS: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

export default function DashboardPage() {
  const [institute, setInstitute] = useState('ABC Business School');
  const [branch, setBranch] = useState('All Branches');
  const [year, setYear] = useState('2026-27');

  return (
    <AppShell activePath="/dashboard">
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">Payment Dashboard</h1>
            <p className="text-sm text-[#64748B] mt-0.5">ABC Business School · Academic Year 2026-27</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            Live · Last updated just now
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 bg-white border border-[#E2E8F0] rounded-xl p-3">
          {[
            { label: 'Institute', value: institute, setter: setInstitute, options: ['ABC Business School'] },
            { label: 'Branch', value: branch, setter: setBranch, options: ['All Branches', 'Mumbai', 'Delhi', 'Pune', 'Bangalore'] },
            { label: 'Academic Year', value: year, setter: setYear, options: ['2026-27', '2025-26'] },
          ].map(f => (
            <select
              key={f.label}
              value={f.value}
              onChange={e => f.setter(e.target.value)}
              className="text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]"
            >
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
          <select className="text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]">
            <option>All Programs</option>
            <option>MBA</option>
            <option>BBA</option>
            <option>BCA</option>
            <option>PGDM</option>
          </select>
          <select className="text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]">
            <option>Last 6 Months</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpiCards.map((card, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 ${card.color} ${card.border ? 'border border-[#E2E8F0]' : ''} shadow-sm`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className={`text-xs font-medium ${card.textColor === 'text-white' ? 'text-white/70' : 'text-[#64748B]'}`}>{card.label}</p>
                <span className="text-lg">{card.icon}</span>
              </div>
              <p className={`text-xl font-bold ${card.textColor} leading-tight`}>{card.value}</p>
              <p className={`text-xs mt-1 ${card.textColor === 'text-white' ? 'text-white/60' : 'text-[#94A3B8]'}`}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#1E3A5F] mb-4">Collection Trend (₹ Lakhs)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={collectionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip formatter={(v: number) => [`₹${v}L`, '']} />
                <Legend />
                <Line type="monotone" dataKey="collected" stroke="#0EA5E9" strokeWidth={2.5} dot={{ r: 4 }} name="Collected" />
                <Line type="monotone" dataKey="outstanding" stroke="#DC2626" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name="Outstanding" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#1E3A5F] mb-4">Payment Method Distribution</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                    {paymentMethods.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {paymentMethods.map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }}></span>
                      <span className="text-[#64748B]">{m.name}</span>
                    </div>
                    <span className="font-semibold text-[#1E3A5F]">{m.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#1E3A5F] mb-4">Course-wise Collection (₹ Lakhs)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={courseCollection}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="course" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip formatter={(v: number) => [`₹${v}L`, 'Collected']} />
                <Bar dataKey="amount" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#1E3A5F] mb-4">Outstanding by Branch (₹ Lakhs)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={branchOutstanding} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="branch" type="category" tick={{ fontSize: 11, fill: '#64748B' }} width={70} />
                <Tooltip formatter={(v: number) => [`₹${v}L`, 'Outstanding']} />
                <Bar dataKey="amount" fill="#DC2626" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-[#1E3A5F]">Recent Transactions</h3>
            <Link href="/transactions" className="text-xs text-[#0EA5E9] hover:underline font-medium">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  {['Student', 'Course', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, i) => (
                  <tr key={i} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3 font-medium text-[#1E3A5F]">{tx.student}</td>
                    <td className="px-5 py-3 text-[#64748B]">{tx.course}</td>
                    <td className="px-5 py-3 font-semibold text-[#1E3A5F]">{tx.amount}</td>
                    <td className="px-5 py-3 text-[#64748B]">{tx.method}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(tx.status)}`}>{tx.status}</span>
                    </td>
                    <td className="px-5 py-3 text-[#94A3B8]">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
