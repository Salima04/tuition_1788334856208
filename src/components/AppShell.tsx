'use client';
import React, { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  path?: string;
  icon: string;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  {
    label: 'Payment Management', icon: '💳',
    children: [
      { label: 'Payment Dashboard', path: '/payment-dashboard' },
      { label: 'Payment Packages', path: '/payment-packages' },
      { label: 'Fee Structures', path: '/fee-structures' },
      { label: 'Fee Management', path: '/fee-management' },
      { label: 'Fee Heads', path: '/fee-heads' },
      { label: 'Payment Plans', path: '/payment-plans' },
      { label: 'Discounts', path: '/discounts' },
      { label: 'Scholarships', path: '/scholarships' },
      { label: 'Concessions', path: '/concessions' },
      { label: 'Coupons', path: '/coupons' },
      { label: 'Late Fee Rules', path: '/late-fee-rules' },
      { label: 'Tax / GST Config', path: '/tax-config' },
    ],
  },
  {
    label: 'Student Finance', icon: '🎓',
    children: [
      { label: 'Single Student Payment', path: '/single-student-payment' },
      { label: 'Bulk Payment Mgmt', path: '/bulk-payment' },
      { label: 'Student Ledger', path: '/student-ledger' },
      { label: 'Student Dues', path: '/student-dues' },
      { label: 'Student Payment Plans', path: '/student-payment-plans' },
      { label: 'Invoices', path: '/invoices' },
      { label: 'Receipts', path: '/receipts' },
      { label: 'Adjustments', path: '/adjustments' },
      { label: 'Credit Notes', path: '/credit-notes' },
    ],
  },
  {
    label: 'Collection', icon: '💰',
    children: [
      { label: 'Collect Payment', path: '/collect-payment' },
      { label: 'Payment Links', path: '/payment-links' },
      { label: 'Assisted Collection', path: '/assisted-collection' },
      { label: 'Online Payments', path: '/online-payments' },
      { label: 'Offline Payments', path: '/offline-payments' },
      { label: 'Failed Payments', path: '/failed-payments' },
      { label: 'Pending Payments', path: '/pending-payments' },
    ],
  },
  {
    label: 'Transactions', icon: '🔄',
    children: [
      { label: 'All Transactions', path: '/transactions' },
      { label: 'Successful', path: '/transactions/successful' },
      { label: 'Failed', path: '/transactions/failed' },
      { label: 'Pending', path: '/transactions/pending' },
      { label: 'Reversed', path: '/transactions/reversed' },
      { label: 'Refunds', path: '/transactions/refunds' },
    ],
  },
  {
    label: 'Reconciliation', icon: '⚖️',
    children: [
      { label: 'Gateway Reconciliation', path: '/reconciliation/gateway' },
      { label: 'Bank Reconciliation', path: '/reconciliation/bank' },
      { label: 'Settlement', path: '/reconciliation/settlement' },
      { label: 'Unmatched Transactions', path: '/reconciliation/unmatched' },
      { label: 'Exceptions', path: '/reconciliation/exceptions' },
    ],
  },
  {
    label: 'Communication', icon: '📣',
    children: [
      { label: 'Payment Reminders', path: '/communication/reminders' },
      { label: 'Due Notifications', path: '/communication/due' },
      { label: 'Overdue Notifications', path: '/communication/overdue' },
      { label: 'Payment Success', path: '/communication/success' },
      { label: 'Payment Failure', path: '/communication/failure' },
    ],
  },
  {
    label: 'Reports', icon: '📈',
    children: [
      { label: 'Collection Report', path: '/reports/collection' },
      { label: 'Outstanding Report', path: '/reports/outstanding' },
      { label: 'Student Ledger Report', path: '/reports/ledger' },
      { label: 'Package Report', path: '/reports/package' },
      { label: 'Discount Report', path: '/reports/discount' },
      { label: 'Scholarship Report', path: '/reports/scholarship' },
      { label: 'Refund Report', path: '/reports/refund' },
      { label: 'Reconciliation Report', path: '/reports/reconciliation' },
      { label: 'Gateway Report', path: '/reports/gateway' },
      { label: 'Counselor Collection', path: '/reports/counselor' },
    ],
  },
  {
    label: 'Administration', icon: '⚙️',
    children: [
      { label: 'Users', path: '/admin/users' },
      { label: 'Roles & Permissions', path: '/admin/roles' },
      { label: 'Institutes', path: '/admin/institutes' },
      { label: 'Branches', path: '/admin/branches' },
      { label: 'Academic Years', path: '/admin/academic-years' },
      { label: 'Programs', path: '/admin/programs' },
      { label: 'Courses', path: '/admin/courses' },
      { label: 'Payment Gateways', path: '/admin/gateways' },
      { label: 'Audit Logs', path: '/admin/audit' },
      { label: 'System Settings', path: '/admin/settings' },
    ],
  },
];

const INSTITUTES = [
  { name: 'ABC Business School', branches: ['Mumbai', 'Delhi', 'Pune', 'Bangalore'] },
];

interface AppShellProps {
  children: React.ReactNode;
  activePath: string;
}

export default function AppShell({ children, activePath }: AppShellProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    'Payment Management', 'Student Finance',
  ]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Mumbai');
  const [selectedYear, setSelectedYear] = useState('2026-27');
  const [showInstituteMenu, setShowInstituteMenu] = useState(false);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => activePath === path;
  const isGroupActive = (item: NavItem) =>
    item.children?.some(c => c.path === activePath) || item.path === activePath;

  const getPageTitle = () => {
    for (const item of navItems) {
      if (item.path === activePath) return item.label;
      if (item.children) {
        const child = item.children.find(c => c.path === activePath);
        if (child) return child.label;
      }
    }
    return activePath.replace(/\//g, ' › ').replace(/-/g, ' ').trim();
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-14' : 'w-60'} bg-[#0F172A] flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden`}>
        {/* Logo + Institute */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          {!sidebarCollapsed && (
            <>
              <div className="w-8 h-8 rounded-lg bg-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">A</div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-bold truncate">ABC Business</p>
                <p className="text-white/40 text-xs truncate">School · {selectedBranch}</p>
              </div>
            </>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm mx-auto">A</div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-hide">
          {navItems.map(item => (
            <div key={item.label}>
              {item.path ? (
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                    isActive(item.path)
                      ? 'bg-[#0EA5E9] text-white font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 mx-0 text-sm transition-colors ${
                      isGroupActive(item) ? 'text-white' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <span className="text-base flex-shrink-0 ml-2">{item.icon}</span>
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left truncate font-medium">{item.label}</span>
                        <span className={`text-xs transition-transform ${expandedGroups.includes(item.label) ? 'rotate-90' : ''}`}>›</span>
                      </>
                    )}
                  </button>
                  {!sidebarCollapsed && expandedGroups.includes(item.label) && item.children && (
                    <div className="ml-4 mb-1">
                      {item.children.map(child => (
                        <Link
                          key={child.path}
                          href={child.path}
                          className={`flex items-center gap-2 px-4 py-2 mx-2 rounded-lg text-xs transition-colors ${
                            isActive(child.path)
                              ? 'bg-[#0EA5E9]/20 text-[#38BDF8] font-semibold border-l-2 border-[#0EA5E9]'
                              : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                          }`}
                        >
                          <span className="w-1 h-1 rounded-full bg-current flex-shrink-0"></span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => setSidebarCollapsed(s => !s)}
            className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white/80 text-xs py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span>{sidebarCollapsed ? '→' : '←'}</span>
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E2E8F0] px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
              <span>ABC Business School</span>
              <span>›</span>
              <span className="text-[#1E3A5F] font-medium capitalize">{getPageTitle()}</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {/* Institute / Branch Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowInstituteMenu(s => !s)}
                className="flex items-center gap-2 border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#1E3A5F] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E0] transition-colors"
              >
                <span className="font-medium">ABC Business School</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="text-[#0EA5E9] font-semibold">{selectedBranch}</span>
                <span className="text-[#94A3B8]">▾</span>
              </button>
              {showInstituteMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 w-56 py-2">
                  <p className="px-3 py-1.5 text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">ABC Business School</p>
                  {INSTITUTES[0].branches.map(branch => (
                    <button
                      key={branch}
                      onClick={() => { setSelectedBranch(branch); setShowInstituteMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedBranch === branch ? 'text-[#0EA5E9] font-semibold bg-[#F0F9FF]' : 'text-[#1E3A5F] hover:bg-[#F8FAFC]'}`}
                    >
                      {selectedBranch === branch && '✓ '}{branch}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Academic Year */}
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="text-xs border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none">
              <option>2026-27</option>
              <option>2025-26</option>
            </select>

            {/* Notifications */}
            <button className="relative text-[#64748B] hover:text-[#1E3A5F] p-1.5 rounded-lg hover:bg-[#F8FAFC]">
              <span className="text-lg">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User */}
            <div className="flex items-center gap-2 pl-3 border-l border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-full bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center">FA</div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-[#1E3A5F]">Finance Admin</p>
                <p className="text-xs text-[#94A3B8]">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay for institute menu */}
      {showInstituteMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowInstituteMenu(false)} />
      )}
    </div>
  );
}
