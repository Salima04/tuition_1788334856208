'use client';
import React, { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';

const INSTITUTES = ['ABC Business School'];
const BRANCHES = ['All Branches', 'Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Chennai'];
const PROGRAMS = ['All Programs', 'MBA', 'BBA', 'BCA', 'MCA', 'PGDM'];
const COURSES = ['All Courses', 'MBA Finance', 'MBA Marketing', 'MBA HR', 'BBA', 'BCA'];
const BATCHES = ['All Batches', '2026-28', '2026-29', '2025-27'];
const CATEGORIES = ['All Categories', 'General', 'Merit', 'Management', 'Sponsored', 'International'];
const STATUSES = ['All Statuses', 'Confirmed', 'Provisional', 'Pending', 'Cancelled'];
const PACKAGES = ['MBA Standard Package', 'MBA Merit Package', 'MBA Early Bird', 'MBA International', 'BBA Standard', 'BCA Standard'];
const CURRENCIES = ['INR', 'USD', 'AED', 'GBP', 'EUR'];

const mockStudents = Array.from({ length: 50 }, (_, i) => {
  const programs = ['MBA', 'MBA', 'MBA', 'BBA', 'BCA'];
  const courses = ['MBA Finance', 'MBA Marketing', 'MBA HR', 'BBA', 'BCA'];
  const branches = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Mumbai'];
  const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Joshi', 'Vikram Singh', 'Ananya Reddy', 'Rohan Mehta', 'Kavya Nair', 'Arjun Gupta', 'Divya Iyer', 'Siddharth Roy', 'Pooja Verma', 'Karan Malhotra', 'Nisha Agarwal', 'Ravi Krishnan', 'Meera Pillai', 'Suresh Rao', 'Lakshmi Devi', 'Aditya Bose', 'Sunita Sharma'];
  const idx = i % 5;
  const nameIdx = i % names.length;
  const pkgIdx = i % 3;
  const pkgs = ['MBA Standard Package', 'MBA Merit Package', 'MBA Early Bird'];
  const currencies = ['INR', 'INR', 'INR', 'INR', 'USD'];
  const grossFees = [515000, 515000, 515000, 265000, 195000];
  const finalFees = [450000, 375000, 425000, 235000, 165000];
  const statuses = ['Confirmed', 'Confirmed', 'Confirmed', 'Provisional', 'Confirmed'];
  return {
    id: `STU-${String(i + 1).padStart(3, '0')}`,
    appId: `APP-2627${String(i + 1).padStart(3, '0')}`,
    name: names[nameIdx],
    program: programs[idx],
    course: courses[idx],
    batch: idx < 3 ? '2026-28' : '2026-29',
    branch: branches[idx],
    category: idx === 3 ? 'International' : 'General',
    admissionStatus: statuses[idx],
    currentPackage: pkgs[pkgIdx],
    grossFee: grossFees[idx],
    finalFee: finalFees[idx],
    discount: finalFees[idx] < grossFees[idx] ? grossFees[idx] - finalFees[idx] : 0,
    currency: currencies[idx],
    outstanding: Math.round(finalFees[idx] * (0.3 + Math.random() * 0.7)),
    counselor: ['Rajesh Kumar', 'Sunita Patel', 'Mohan Das'][i % 3],
  };
});

type BulkMode = 'filter' | 'excel' | 'rules';

interface AssignmentRule {
  id: number;
  field: string;
  operator: string;
  value: string;
  logic: string;
}

export default function BulkPaymentPage() {
  const [mode, setMode] = useState<BulkMode>('filter');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    institute: 'ABC Business School',
    branch: 'All Branches',
    program: 'All Programs',
    course: 'All Courses',
    batch: 'All Batches',
    category: 'All Categories',
    admissionStatus: 'All Statuses',
    counselor: '',
    search: '',
  });
  const [bulkAction, setBulkAction] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [excelStep, setExcelStep] = useState(0);
  const [rules, setRules] = useState<AssignmentRule[]>([
    { id: 1, field: 'Program', operator: '=', value: 'MBA', logic: 'AND' },
    { id: 2, field: 'Admission Status', operator: '=', value: 'Confirmed', logic: 'AND' },
  ]);

  const filteredStudents = useMemo(() => {
    return mockStudents.filter(s => {
      if (filters.branch !== 'All Branches' && s.branch !== filters.branch) return false;
      if (filters.program !== 'All Programs' && s.program !== filters.program) return false;
      if (filters.course !== 'All Courses' && s.course !== filters.course) return false;
      if (filters.batch !== 'All Batches' && s.batch !== filters.batch) return false;
      if (filters.category !== 'All Categories' && s.category !== filters.category) return false;
      if (filters.admissionStatus !== 'All Statuses' && s.admissionStatus !== filters.admissionStatus) return false;
      if (filters.search && !s.name.toLowerCase().includes(filters.search.toLowerCase()) && !s.appId.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters]);

  const allSelected = filteredStudents.length > 0 && filteredStudents.every(s => selectedIds.has(s.id));
  const someSelected = selectedIds.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkAction = (action: string) => {
    setBulkAction(action);
    setShowActionModal(true);
  };

  const executeAction = () => {
    setActionComplete(true);
    setTimeout(() => {
      setShowActionModal(false);
      setActionComplete(false);
      setSelectedIds(new Set());
    }, 2000);
  };

  const totalSelected = selectedIds.size;
  const totalOutstanding = filteredStudents.filter(s => selectedIds.has(s.id)).reduce((sum, s) => sum + s.outstanding, 0);

  const statusColor: Record<string, string> = {
    'Confirmed': 'bg-green-100 text-green-700',
    'Provisional': 'bg-yellow-100 text-yellow-700',
    'Pending': 'bg-orange-100 text-orange-700',
    'Cancelled': 'bg-red-100 text-red-700',
  };

  const excelValidation = [
    { row: 1, student: 'Rahul Sharma', appId: 'APP-2627001', package: 'MBA Standard Package', status: 'Valid' },
    { row: 2, student: 'Priya Patel', appId: 'APP-2627002', package: 'MBA Merit Package', status: 'Valid' },
    { row: 3, student: 'Unknown Student', appId: 'APP-9999999', package: 'MBA Standard Package', status: 'Student Not Found' },
    { row: 4, student: 'Amit Kumar', appId: 'APP-2627003', package: 'MBA Standard Package', status: 'Already Assigned' },
    { row: 5, student: 'Sneha Joshi', appId: 'APP-2627004', package: 'MBA International', status: 'Course Mismatch' },
  ];

  const validationStatusColor: Record<string, string> = {
    'Valid': 'bg-green-100 text-green-700',
    'Student Not Found': 'bg-red-100 text-red-700',
    'Already Assigned': 'bg-yellow-100 text-yellow-700',
    'Course Mismatch': 'bg-orange-100 text-orange-700',
    'Invalid': 'bg-red-100 text-red-700',
  };

  return (
    <AppShell activePath="/bulk-payment">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">Bulk Student Payment Management</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Assign packages, collect payments, and manage fees for multiple students at once</p>
          </div>
          <div className="flex gap-2">
            <select value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value)} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none">
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E3A5F] bg-[#F8FAFC] focus:outline-none">
              <option>2026-27</option>
              <option>2025-26</option>
            </select>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-1 flex gap-1 w-fit">
          {[
            { key: 'filter', label: '🔍 Filter & Select', desc: 'Filter students and bulk assign' },
            { key: 'excel', label: '📊 Excel Upload', desc: 'Upload student list from Excel' },
            { key: 'rules', label: '⚙️ Rule-Based', desc: 'Auto-assign using rules' },
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as BulkMode)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === m.key ? 'bg-[#1E3A5F] text-white shadow-sm' : 'text-[#64748B] hover:text-[#1E3A5F] hover:bg-[#F8FAFC]'}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* FILTER MODE */}
        {mode === 'filter' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#1E3A5F]">Filter Students</h3>
                <button onClick={() => setFilters({ institute: 'ABC Business School', branch: 'All Branches', program: 'All Programs', course: 'All Courses', batch: 'All Batches', category: 'All Categories', admissionStatus: 'All Statuses', counselor: '', search: '' })} className="text-xs text-[#94A3B8] hover:text-[#64748B]">Clear All</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs text-[#64748B] mb-1">Institute</label>
                  <select className="w-full border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs bg-[#F8FAFC] focus:outline-none">
                    {INSTITUTES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#64748B] mb-1">Branch</label>
                  <select value={filters.branch} onChange={e => setFilters(f => ({ ...f, branch: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs bg-[#F8FAFC] focus:outline-none">
                    {BRANCHES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#64748B] mb-1">Program</label>
                  <select value={filters.program} onChange={e => setFilters(f => ({ ...f, program: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs bg-[#F8FAFC] focus:outline-none">
                    {PROGRAMS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#64748B] mb-1">Course</label>
                  <select value={filters.course} onChange={e => setFilters(f => ({ ...f, course: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs bg-[#F8FAFC] focus:outline-none">
                    {COURSES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#64748B] mb-1">Batch</label>
                  <select value={filters.batch} onChange={e => setFilters(f => ({ ...f, batch: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs bg-[#F8FAFC] focus:outline-none">
                    {BATCHES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#64748B] mb-1">Category</label>
                  <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs bg-[#F8FAFC] focus:outline-none">
                    {CATEGORIES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#64748B] mb-1">Admission Status</label>
                  <select value={filters.admissionStatus} onChange={e => setFilters(f => ({ ...f, admissionStatus: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs bg-[#F8FAFC] focus:outline-none">
                    {STATUSES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-[#64748B] mb-1">Search</label>
                  <input type="text" placeholder="Name or App ID..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} className="w-full border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs bg-[#F8FAFC] focus:outline-none focus:border-[#0EA5E9]" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs font-semibold text-[#1E3A5F]">{filteredStudents.length} students found</span>
                {filteredStudents.length > 0 && (
                  <span className="text-xs text-[#64748B]">Total Outstanding: ₹{filteredStudents.reduce((s, st) => s + st.outstanding, 0).toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>

            {/* Bulk Action Bar */}
            {someSelected && (
              <div className="bg-[#1E3A5F] text-white rounded-xl p-3 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{totalSelected} students selected</span>
                  <span className="text-white/60 text-xs">·</span>
                  <span className="text-sm text-white/80">Outstanding: ₹{totalOutstanding.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'assign', label: 'Assign Package', color: 'bg-[#0EA5E9]' },
                    { key: 'discount', label: 'Apply Discount', color: 'bg-purple-500' },
                    { key: 'scholarship', label: 'Apply Scholarship', color: 'bg-indigo-500' },
                    { key: 'link', label: 'Send Payment Links', color: 'bg-[#16A34A]' },
                    { key: 'reminder', label: 'Send Reminder', color: 'bg-orange-500' },
                  ].map(a => (
                    <button key={a.key} onClick={() => handleBulkAction(a.key)} className={`${a.color} text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity`}>{a.label}</button>
                  ))}
                  <button onClick={() => setSelectedIds(new Set())} className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/20">Clear</button>
                </div>
              </div>
            )}

            {/* Student Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="px-4 py-3.5 text-left">
                        <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded text-[#0EA5E9]" />
                      </th>
                      {['Student', 'App ID', 'Course / Batch', 'Branch', 'Current Package', 'Gross Fee', 'Discount', 'Final Fee', 'Outstanding', 'Status'].map(h => (
                        <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.slice(0, 20).map(s => (
                      <tr key={s.id} className={`border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors ${selectedIds.has(s.id) ? 'bg-[#F0F9FF]' : ''}`}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleStudent(s.id)} className="rounded text-[#0EA5E9]" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-[#1E3A5F] whitespace-nowrap">{s.name}</p>
                              <p className="text-xs text-[#94A3B8]">{s.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-[#64748B]">{s.appId}</td>
                        <td className="px-4 py-3">
                          <p className="text-[#1E3A5F] whitespace-nowrap">{s.course}</p>
                          <p className="text-xs text-[#94A3B8]">{s.batch}</p>
                        </td>
                        <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">{s.branch}</td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-[#64748B] whitespace-nowrap">{s.currentPackage}</p>
                        </td>
                        <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">₹{s.grossFee.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-purple-600 whitespace-nowrap">{s.discount > 0 ? `-₹${s.discount.toLocaleString('en-IN')}` : '—'}</td>
                        <td className="px-4 py-3 font-semibold text-[#1E3A5F] whitespace-nowrap">₹{s.finalFee.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap">
                          <span className={s.outstanding > 0 ? 'text-[#D97706]' : 'text-[#16A34A]'}>₹{s.outstanding.toLocaleString('en-IN')}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusColor[s.admissionStatus] || 'bg-gray-100 text-gray-600'}`}>{s.admissionStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <p className="text-xs text-[#94A3B8]">Showing 20 of {filteredStudents.length} students</p>
                <div className="flex gap-1">
                  {[1, 2, 3].map(p => (
                    <button key={p} className={`w-7 h-7 rounded text-xs font-medium ${p === 1 ? 'bg-[#1E3A5F] text-white' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXCEL MODE */}
        {mode === 'excel' && (
          <div className="space-y-4">
            {/* Steps */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <div className="flex items-center gap-0 mb-6">
                {['Download Template', 'Upload Excel', 'Validate', 'Preview', 'Confirm'].map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= excelStep ? 'bg-[#1E3A5F] text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                        {i < excelStep ? '✓' : i + 1}
                      </div>
                      <p className={`text-xs mt-1 text-center whitespace-nowrap ${i <= excelStep ? 'text-[#1E3A5F] font-medium' : 'text-[#94A3B8]'}`}>{step}</p>
                    </div>
                    {i < 4 && <div className={`flex-1 h-px mx-2 mt-[-12px] ${i < excelStep ? 'bg-[#1E3A5F]' : 'bg-[#E2E8F0]'}`} />}
                  </React.Fragment>
                ))}
              </div>

              {excelStep === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#F0F9FF] flex items-center justify-center text-3xl mx-auto mb-4">📊</div>
                  <h3 className="text-base font-bold text-[#1E3A5F] mb-2">Download Excel Template</h3>
                  <p className="text-sm text-[#64748B] mb-6 max-w-md mx-auto">Download the template with required columns: Student ID, App ID, Name, Course, Package, Discount, Notes</p>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => setExcelStep(1)} className="bg-[#1E3A5F] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0F2A4F]">⬇ Download Template</button>
                  </div>
                </div>
              )}

              {excelStep === 1 && (
                <div className="text-center py-8">
                  <div className="border-2 border-dashed border-[#CBD5E0] rounded-2xl p-12 hover:border-[#0EA5E9] transition-colors cursor-pointer" onClick={() => setExcelStep(2)}>
                    <div className="text-4xl mb-3">📤</div>
                    <p className="text-sm font-semibold text-[#1E3A5F]">Click to upload or drag & drop</p>
                    <p className="text-xs text-[#94A3B8] mt-1">Supports .xlsx, .xls, .csv — Max 10MB</p>
                    <button className="mt-4 bg-[#F0F9FF] text-[#0EA5E9] border border-[#BAE6FD] text-sm font-medium px-5 py-2 rounded-lg">Browse File</button>
                  </div>
                </div>
              )}

              {excelStep === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-4 p-3 bg-[#F8FAFC] rounded-xl">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1E3A5F]">student_bulk_assignment.xlsx</p>
                      <p className="text-xs text-[#64748B]">5 rows · Validating...</p>
                    </div>
                    <button onClick={() => setExcelStep(3)} className="ml-auto bg-[#1E3A5F] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0F2A4F]">Validate →</button>
                  </div>
                </div>
              )}

              {excelStep === 3 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-[#1E3A5F]">Validation Results</h4>
                    <div className="flex gap-3 text-xs">
                      <span className="text-[#16A34A] font-semibold">✓ 2 Valid</span>
                      <span className="text-[#D97706] font-semibold">⚠ 1 Already Assigned</span>
                      <span className="text-red-600 font-semibold">✕ 2 Errors</span>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8FAFC]">
                        {['Row', 'Student', 'App ID', 'Package', 'Validation Status'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excelValidation.map((row, i) => (
                        <tr key={i} className="border-t border-[#F1F5F9]">
                          <td className="px-4 py-3 text-[#94A3B8]">{row.row}</td>
                          <td className="px-4 py-3 font-medium text-[#1E3A5F]">{row.student}</td>
                          <td className="px-4 py-3 font-mono text-xs text-[#64748B]">{row.appId}</td>
                          <td className="px-4 py-3 text-[#64748B]">{row.package}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${validationStatusColor[row.status] || 'bg-gray-100 text-gray-600'}`}>{row.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex gap-3 mt-4">
                    <button className="border border-[#E2E8F0] text-[#64748B] text-xs px-4 py-2 rounded-lg hover:bg-[#F8FAFC]">⬇ Download Error Report</button>
                    <button onClick={() => setExcelStep(4)} className="bg-[#1E3A5F] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#0F2A4F]">Proceed with Valid (2) →</button>
                  </div>
                </div>
              )}

              {excelStep === 4 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                  <h3 className="text-base font-bold text-[#16A34A] mb-2">Bulk Assignment Complete!</h3>
                  <p className="text-sm text-[#64748B]">2 students have been assigned packages. Invoices and ledger entries created.</p>
                  <button onClick={() => setExcelStep(0)} className="mt-4 border border-[#E2E8F0] text-[#64748B] text-sm px-5 py-2 rounded-xl hover:bg-[#F8FAFC]">Upload Another File</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RULES MODE */}
        {mode === 'rules' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-[#1E3A5F]">Rule-Based Auto Assignment</h3>
                <button className="text-xs bg-[#1E3A5F] text-white px-3 py-1.5 rounded-lg hover:bg-[#0F2A4F]">+ Add Rule</button>
              </div>

              <div className="space-y-3 mb-5">
                {rules.map((rule, i) => (
                  <div key={rule.id} className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                    <span className="text-xs font-bold text-[#94A3B8] w-8 flex-shrink-0">{i === 0 ? 'IF' : 'AND'}</span>
                    <select defaultValue={rule.field} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none flex-1">
                      {['Program', 'Course', 'Branch', 'Academic Year', 'Admission Status', 'Student Category', 'Batch', 'Counselor', 'Gender'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <select defaultValue={rule.operator} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none w-24">
                      {['=', '!=', 'IN', 'NOT IN', 'CONTAINS'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <input defaultValue={rule.value} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none flex-1" />
                    <button onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))} className="text-red-400 hover:text-red-600 text-sm px-2 flex-shrink-0">✕</button>
                  </div>
                ))}
                <button onClick={() => setRules(prev => [...prev, { id: Date.now(), field: 'Branch', operator: '=', value: '', logic: 'AND' }])} className="text-sm text-[#0EA5E9] hover:underline font-medium">+ Add Condition</button>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4">
                <h4 className="text-xs font-semibold text-[#64748B] uppercase mb-3">THEN — Assign Package</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#64748B] mb-1">Package to Assign</label>
                    <select value={selectedPackage} onChange={e => setSelectedPackage(e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none">
                      {PACKAGES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#64748B] mb-1">Currency</label>
                    <select value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFC] focus:outline-none">
                      {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-[#F0FDF4] border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">✓ Preview: 124 students match these rules</p>
                    <p className="text-xs text-green-600 mt-1">Already assigned: 0 · Not eligible: 12 · Missing data: 3</p>
                  </div>
                  <button onClick={() => handleBulkAction('assign')} className="bg-[#16A34A] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-green-700">Run Assignment</button>
                </div>
              </div>
            </div>

            {/* Saved Rules */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <h3 className="text-sm font-bold text-[#1E3A5F] mb-4">Saved Assignment Rules</h3>
              <div className="space-y-3">
                {[
                  { name: 'MBA Merit Auto-Assign', conditions: 'Program = MBA AND Scholarship = Merit', package: 'MBA Merit Package', priority: 1, students: 38 },
                  { name: 'MBA Early Bird', conditions: 'Program = MBA AND Admission Date <= 31 Jan 2026', package: 'MBA Early Bird', priority: 2, students: 67 },
                  { name: 'MBA Standard Default', conditions: 'Program = MBA AND Admission Status = Confirmed', package: 'MBA Standard Package', priority: 3, students: 124 },
                ].map((rule, i) => (
                  <div key={i} className="flex items-center justify-between border border-[#E2E8F0] rounded-xl p-4 hover:bg-[#F8FAFC]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{rule.priority}</div>
                      <div>
                        <p className="text-sm font-semibold text-[#1E3A5F]">{rule.name}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{rule.conditions}</p>
                        <p className="text-xs text-[#0EA5E9] mt-0.5">→ {rule.package}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm font-bold text-[#1E3A5F]">{rule.students}</p>
                      <p className="text-xs text-[#94A3B8]">students</p>
                      <div className="flex gap-1 mt-1">
                        <button className="text-xs text-[#0EA5E9] hover:underline">Edit</button>
                        <span className="text-[#CBD5E0]">·</span>
                        <button className="text-xs text-[#64748B] hover:text-[#1E3A5F]">Run</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#1E3A5F]">
                {bulkAction === 'assign' ? 'Assign Package' :
                 bulkAction === 'discount' ? 'Apply Discount' :
                 bulkAction === 'scholarship' ? 'Apply Scholarship' :
                 bulkAction === 'link' ? 'Send Payment Links' : 'Send Reminder'}
              </h3>
              <button onClick={() => { setShowActionModal(false); setActionComplete(false); }} className="text-[#94A3B8] hover:text-[#1E3A5F] text-xl">✕</button>
            </div>
            {actionComplete ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                <h4 className="text-lg font-bold text-[#16A34A] mb-1">Action Complete!</h4>
                <p className="text-sm text-[#64748B]">{totalSelected} students processed successfully.</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="bg-[#F8FAFC] rounded-xl p-3">
                  <p className="text-sm font-semibold text-[#1E3A5F]">{totalSelected} students selected</p>
                  <p className="text-xs text-[#64748B] mt-0.5">Total Outstanding: ₹{totalOutstanding.toLocaleString('en-IN')}</p>
                </div>

                {bulkAction === 'assign' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Select Package</label>
                      <select value={selectedPackage} onChange={e => setSelectedPackage(e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none">
                        {PACKAGES.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Currency</label>
                      <select value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none">
                        {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="bg-[#FFF7ED] border border-orange-200 rounded-lg p-3">
                      <p className="text-xs text-orange-700">⚠ This will create invoices and ledger entries for all selected students. This action requires Finance Admin approval.</p>
                    </div>
                  </div>
                )}

                {bulkAction === 'discount' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Discount Type</label>
                      <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none">
                        <option>Fixed Amount</option>
                        <option>Percentage</option>
                        <option>Early Bird</option>
                        <option>Campaign</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Amount / Percentage</label>
                      <input type="number" placeholder="e.g. 5000 or 10" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Reason</label>
                      <textarea rows={2} placeholder="Reason for bulk discount..." className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none resize-none" />
                    </div>
                  </div>
                )}

                {bulkAction === 'scholarship' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Scholarship Type</label>
                      <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none">
                        <option>Merit</option>
                        <option>Need Based</option>
                        <option>Government</option>
                        <option>Sports</option>
                        <option>Management Quota</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Amount</label>
                      <input type="number" placeholder="Scholarship amount" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none" />
                    </div>
                  </div>
                )}

                {(bulkAction === 'link' || bulkAction === 'reminder') && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-2">Send Via</label>
                      <div className="flex gap-2">
                        {['WhatsApp', 'SMS', 'Email'].map(ch => (
                          <label key={ch} className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-lg px-3 py-2 cursor-pointer hover:border-[#0EA5E9]">
                            <input type="checkbox" defaultChecked className="rounded text-[#0EA5E9]" />
                            <span className="text-xs font-medium text-[#1E3A5F]">{ch}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1.5">Message Template</label>
                      <select className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-[#F8FAFC] focus:outline-none">
                        <option>Payment Due Reminder</option>
                        <option>Overdue Notice</option>
                        <option>Payment Link</option>
                        <option>Custom Message</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowActionModal(false)} className="flex-1 border border-[#E2E8F0] text-[#64748B] text-sm font-medium py-2.5 rounded-xl hover:bg-[#F8FAFC]">Cancel</button>
                  <button onClick={executeAction} className="flex-1 bg-[#1E3A5F] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0F2A4F]">
                    {bulkAction === 'assign' ? 'Assign Package' :
                     bulkAction === 'discount' ? 'Apply Discount' :
                     bulkAction === 'scholarship' ? 'Apply Scholarship' :
                     bulkAction === 'link' ? 'Send Links' : 'Send Reminder'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
