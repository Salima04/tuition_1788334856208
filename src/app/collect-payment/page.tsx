'use client';
import React, { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';

interface Student {
  id: string;
  name: string;
  studentId: string;
  course: string;
  program: string;
  branch: string;
  batch: string;
  mobile: string;
  email: string;
  outstanding: number;
  overdue: number;
  package: string;
}

interface Invoice {
  id: string;
  description: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  status: 'ISSUED' | 'PARTIALLY_PAID' | 'OVERDUE';
}

const STUDENTS: Student[] = [
  { id: 'STU-1001', name: 'Rahul Sharma', studentId: 'STU-1001', course: 'MBA Finance', program: 'MBA', branch: 'Mumbai', batch: '2026-28', mobile: '9876543210', email: 'rahul.sharma@abc.edu', outstanding: 350000, overdue: 0, package: 'MBA Standard' },
  { id: 'STU-1002', name: 'Priya Patel', studentId: 'STU-1002', course: 'MBA Marketing', program: 'MBA', branch: 'Mumbai', batch: '2026-28', mobile: '9876543211', email: 'priya.patel@abc.edu', outstanding: 262500, overdue: 87500, package: 'MBA Merit' },
  { id: 'STU-1003', name: 'Amit Kumar', studentId: 'STU-1003', course: 'BBA', program: 'BBA', branch: 'Delhi', batch: '2026-29', mobile: '9876543212', email: 'amit.kumar@abc.edu', outstanding: 141000, overdue: 47000, package: 'BBA Standard' },
  { id: 'STU-1004', name: 'Sneha Joshi', studentId: 'STU-1004', course: 'MBA HR', program: 'MBA', branch: 'Pune', batch: '2026-28', mobile: '9876543213', email: 'sneha.joshi@abc.edu', outstanding: 360000, overdue: 90000, package: 'MBA Standard' },
  { id: 'STU-1005', name: 'Vikram Singh', studentId: 'STU-1005', course: 'MBA Finance', program: 'MBA', branch: 'Mumbai', batch: '2026-28', mobile: '9876543214', email: 'vikram.singh@abc.edu', outstanding: 200000, overdue: 0, package: 'MBA Early Bird' },
  { id: 'STU-1006', name: 'Ananya Reddy', studentId: 'STU-1006', course: 'BCA', program: 'BCA', branch: 'Bangalore', batch: '2026-29', mobile: '9876543215', email: 'ananya.reddy@abc.edu', outstanding: 99000, overdue: 33000, package: 'BCA Standard' },
  { id: 'STU-1007', name: 'Rohit Gupta', studentId: 'STU-1007', course: 'MBA Marketing', program: 'MBA', branch: 'Delhi', batch: '2026-28', mobile: '9876543216', email: 'rohit.gupta@abc.edu', outstanding: 262500, overdue: 0, package: 'MBA Standard' },
  { id: 'STU-1008', name: 'Kavya Nair', studentId: 'STU-1008', course: 'PGDM', program: 'PGDM', branch: 'Mumbai', batch: '2026-28', mobile: '9876543217', email: 'kavya.nair@abc.edu', outstanding: 168000, overdue: 84000, package: 'PGDM Standard' },
];

const STUDENT_INVOICES: Record<string, Invoice[]> = {
  'STU-1001': [
    { id: 'INV-2026-001', description: 'Semester 1 Fee - MBA Finance', dueDate: '2026-07-15', amount: 100000, paid: 100000, balance: 0, status: 'ISSUED' },
    { id: 'INV-2026-002', description: 'Semester 2 Fee - MBA Finance', dueDate: '2026-10-15', amount: 100000, paid: 0, balance: 100000, status: 'ISSUED' },
    { id: 'INV-2026-003', description: 'Semester 3 Fee - MBA Finance', dueDate: '2027-01-15', amount: 150000, paid: 0, balance: 150000, status: 'ISSUED' },
  ],
  'STU-1002': [
    { id: 'INV-2026-004', description: 'Semester 1 Fee - MBA Marketing', dueDate: '2026-07-15', amount: 87500, paid: 87500, balance: 0, status: 'ISSUED' },
    { id: 'INV-2026-005', description: 'Semester 2 Fee - MBA Marketing', dueDate: '2026-10-15', amount: 87500, paid: 0, balance: 87500, status: 'OVERDUE' },
    { id: 'INV-2026-006', description: 'Semester 3 Fee - MBA Marketing', dueDate: '2027-01-15', amount: 87500, paid: 0, balance: 87500, status: 'ISSUED' },
  ],
  'STU-1003': [
    { id: 'INV-2026-007', description: 'Annual Fee - BBA Year 1', dueDate: '2026-07-01', amount: 47000, paid: 0, balance: 47000, status: 'OVERDUE' },
    { id: 'INV-2026-008', description: 'Annual Fee - BBA Year 2', dueDate: '2027-07-01', amount: 47000, paid: 0, balance: 47000, status: 'ISSUED' },
    { id: 'INV-2026-009', description: 'Annual Fee - BBA Year 3', dueDate: '2028-07-01', amount: 47000, paid: 0, balance: 47000, status: 'ISSUED' },
  ],
};

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', category: 'online' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳', category: 'online' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', category: 'online' },
  { id: 'wallet', label: 'Wallet', icon: '👛', category: 'online' },
  { id: 'cash', label: 'Cash', icon: '💵', category: 'offline' },
  { id: 'cheque', label: 'Cheque', icon: '📝', category: 'offline' },
  { id: 'dd', label: 'Demand Draft', icon: '📋', category: 'offline' },
  { id: 'pos', label: 'POS / Swipe', icon: '🖥️', category: 'offline' },
  { id: 'neft', label: 'NEFT / RTGS', icon: '🔁', category: 'offline' },
  { id: 'qr', label: 'QR Code', icon: '⬛', category: 'online' },
];

const COUPONS = [
  { code: 'EARLY10', discount: 10, type: 'percentage', description: 'Early Bird 10% off' },
  { code: 'MERIT5000', discount: 5000, type: 'fixed', description: 'Merit scholarship ₹5,000' },
  { code: 'SIBLING2500', discount: 2500, type: 'fixed', description: 'Sibling concession ₹2,500' },
];

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

type Step = 'search' | 'invoices' | 'payment' | 'confirm' | 'receipt';

export default function CollectPaymentPage() {
  const [step, setStep] = useState<Step>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof COUPONS[0] | null>(null);
  const [couponError, setCouponError] = useState('');
  const [remarks, setRemarks] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [receiptData, setReceiptData] = useState<{ txnId: string; amount: number; student: Student; method: string; date: string } | null>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return STUDENTS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.mobile.includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const studentInvoices = selectedStudent ? (STUDENT_INVOICES[selectedStudent.id] || []) : [];
  const selectedInvoiceData = studentInvoices.filter(inv => selectedInvoices.includes(inv.id));
  const invoiceTotal = selectedInvoiceData.reduce((s, inv) => s + inv.balance, 0);
  const payAmount = customAmount ? parseFloat(customAmount) : invoiceTotal;

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.round(payAmount * appliedCoupon.discount / 100)
      : appliedCoupon.discount
    : 0;
  const finalAmount = Math.max(0, payAmount - couponDiscount);

  const handleApplyCoupon = () => {
    const found = COUPONS.find(c => c.code === couponCode.toUpperCase());
    if (found) { setAppliedCoupon(found); setCouponError(''); }
    else { setCouponError('Invalid coupon code'); setAppliedCoupon(null); }
  };

  const handleConfirmPayment = () => {
    const txnId = 'TXN-' + Date.now().toString().slice(-8);
    setReceiptData({
      txnId,
      amount: finalAmount,
      student: selectedStudent!,
      method: paymentMethod,
      date: new Date().toLocaleDateString('en-IN'),
    });
    setStep('receipt');
  };

  const handleReset = () => {
    setStep('search');
    setSearchQuery('');
    setSelectedStudent(null);
    setSelectedInvoices([]);
    setPaymentMethod('');
    setCustomAmount('');
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
    setRemarks('');
    setReferenceNo('');
    setReceiptData(null);
  };

  const STEPS = [
    { key: 'search', label: 'Find Student', num: 1 },
    { key: 'invoices', label: 'Select Invoice', num: 2 },
    { key: 'payment', label: 'Payment Mode', num: 3 },
    { key: 'confirm', label: 'Confirm', num: 4 },
    { key: 'receipt', label: 'Receipt', num: 5 },
  ];
  const stepIndex = STEPS.findIndex(s => s.key === step);

  return (
    <AppShell activePath="/collect-payment">
      <div className="p-6 max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <div className="text-xs text-gray-400 mb-1">Collection / Collect Payment</div>
          <h1 className="text-xl font-bold text-[#0F172A]">Collect Payment</h1>
          <p className="text-sm text-gray-500 mt-0.5">Search student, select invoice, choose payment mode and record payment</p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i < stepIndex ? 'bg-emerald-500 text-white' : i === stepIndex ? 'bg-[#0EA5E9] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {i < stepIndex ? '✓' : s.num}
                  </div>
                  <div className={`text-xs mt-1 font-medium ${i === stepIndex ? 'text-[#0EA5E9]' : i < stepIndex ? 'text-emerald-600' : 'text-gray-400'}`}>{s.label}</div>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < stepIndex ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step: Search Student */}
        {step === 'search' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-[#0F172A]">Find Student</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by name, student ID, mobile, or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30"
                autoFocus
              />
            </div>
            {searchResults.length > 0 && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                {searchResults.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedStudent(s); setStep('invoices'); }}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-blue-50/50 border-b border-gray-50 last:border-0 text-left transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#0F172A] text-sm">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.studentId} · {s.course} · {s.branch}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-red-600">{fmt(s.outstanding)}</div>
                      <div className="text-xs text-gray-400">Outstanding</div>
                    </div>
                    <span className="text-[#0EA5E9] text-sm">→</span>
                  </button>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">👤</div>
                <div className="text-sm">No students found for "{searchQuery}"</div>
              </div>
            )}
            {!searchQuery && (
              <div className="text-center py-8 text-gray-300">
                <div className="text-4xl mb-2">🔍</div>
                <div className="text-sm">Start typing to search students</div>
              </div>
            )}
          </div>
        )}

        {/* Step: Select Invoices */}
        {step === 'invoices' && selectedStudent && (
          <div className="space-y-4">
            {/* Student Card */}
            <div className="bg-[#0F172A] rounded-xl p-5 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0EA5E9] flex items-center justify-center font-bold text-lg flex-shrink-0">
                {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">{selectedStudent.name}</div>
                <div className="text-sm text-gray-300">{selectedStudent.studentId} · {selectedStudent.course} · {selectedStudent.branch}</div>
                <div className="text-xs text-gray-400 mt-0.5">{selectedStudent.package}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-400">{fmt(selectedStudent.outstanding)}</div>
                <div className="text-xs text-gray-400">Total Outstanding</div>
                {selectedStudent.overdue > 0 && <div className="text-xs text-red-400 mt-0.5">⚠ {fmt(selectedStudent.overdue)} overdue</div>}
              </div>
              <button onClick={() => { setSelectedStudent(null); setStep('search'); }} className="text-gray-400 hover:text-white ml-2">✕</button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#0F172A]">Select Invoice(s) to Pay</h2>
                <button onClick={() => setSelectedInvoices(studentInvoices.filter(i => i.balance > 0).map(i => i.id))} className="text-xs text-[#0EA5E9] hover:underline">Select All Due</button>
              </div>
              <div className="space-y-2">
                {studentInvoices.map(inv => (
                  <label key={inv.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${selectedInvoices.includes(inv.id) ? 'border-[#0EA5E9] bg-blue-50/30' : 'border-gray-100 hover:border-gray-200'} ${inv.balance === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(inv.id)}
                      disabled={inv.balance === 0}
                      onChange={() => {
                        if (inv.balance === 0) return;
                        setSelectedInvoices(prev => prev.includes(inv.id) ? prev.filter(x => x !== inv.id) : [...prev, inv.id]);
                      }}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[#0F172A]">{inv.description}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{inv.id} · Due: {inv.dueDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-[#0F172A]">{fmt(inv.balance)}</div>
                      <div className="text-xs text-gray-400">of {fmt(inv.amount)}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${inv.status === 'OVERDUE' ? 'bg-red-50 text-red-600 border border-red-200' : inv.status === 'PARTIALLY_PAID' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>{inv.status.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
              {selectedInvoices.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">{selectedInvoices.length} invoice(s) selected</div>
                  <div className="text-lg font-bold text-[#0F172A]">{fmt(invoiceTotal)}</div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('search')} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">← Back</button>
                <button
                  disabled={selectedInvoices.length === 0}
                  onClick={() => setStep('payment')}
                  className="flex-1 px-4 py-2 bg-[#0EA5E9] text-white rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-[#0284C7] transition-colors"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Payment Mode */}
        {step === 'payment' && selectedStudent && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-[#0F172A]">Payment Details</h2>

              {/* Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Invoice Amount</label>
                  <div className="text-2xl font-bold text-[#0F172A]">{fmt(invoiceTotal)}</div>
                  <div className="text-xs text-gray-400">{selectedInvoices.length} invoice(s)</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Custom Amount (Optional)</label>
                  <input
                    type="number"
                    placeholder={invoiceTotal.toString()}
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30"
                  />
                  <div className="text-xs text-gray-400 mt-1">Leave blank to pay full invoice amount</div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-3">Payment Method</label>
                <div className="mb-2 text-xs text-gray-400 font-medium">Online</div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {PAYMENT_METHODS.filter(m => m.category === 'online').map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${paymentMethod === m.id ? 'border-[#0EA5E9] bg-blue-50 text-[#0EA5E9]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      <span>{m.icon}</span> {m.label}
                    </button>
                  ))}
                </div>
                <div className="mb-2 text-xs text-gray-400 font-medium">Offline</div>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.filter(m => m.category === 'offline').map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${paymentMethod === m.id ? 'border-[#0EA5E9] bg-blue-50 text-[#0EA5E9]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      <span>{m.icon}</span> {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference No for offline */}
              {['cash', 'cheque', 'dd', 'neft', 'pos'].includes(paymentMethod) && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                    {paymentMethod === 'cash' ? 'Receipt No.' : paymentMethod === 'cheque' ? 'Cheque No.' : paymentMethod === 'dd' ? 'DD No.' : 'Reference No.'}
                  </label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={e => setReferenceNo(e.target.value)}
                    placeholder="Enter reference number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30"
                  />
                </div>
              )}

              {/* Coupon */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Apply Coupon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={e => { setCouponCode(e.target.value); setCouponError(''); setAppliedCoupon(null); }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 uppercase"
                  />
                  <button onClick={handleApplyCoupon} className="px-4 py-2 bg-[#0F172A] text-white text-sm rounded-lg font-medium hover:bg-[#1E3A5F]">Apply</button>
                </div>
                {couponError && <div className="text-xs text-red-500 mt-1">{couponError}</div>}
                {appliedCoupon && (
                  <div className="flex items-center gap-2 mt-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <span className="text-emerald-600 text-sm">✓</span>
                    <span className="text-sm text-emerald-700 font-medium">{appliedCoupon.description}</span>
                    <span className="ml-auto text-sm font-bold text-emerald-700">-{fmt(couponDiscount)}</span>
                    <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">Try: EARLY10, MERIT5000, SIBLING2500</div>
              </div>

              {/* Remarks */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Remarks (Optional)</label>
                <textarea
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Add any notes or remarks..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 resize-none"
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Invoice Amount</span><span className="font-medium">{fmt(invoiceTotal)}</span></div>
                {customAmount && parseFloat(customAmount) !== invoiceTotal && (
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Custom Amount</span><span className="font-medium">{fmt(parseFloat(customAmount))}</span></div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600"><span>Coupon Discount ({appliedCoupon?.code})</span><span>-{fmt(couponDiscount)}</span></div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
                  <span>Amount to Collect</span>
                  <span className="text-[#0EA5E9]">{fmt(finalAmount)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('invoices')} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">← Back</button>
                <button
                  disabled={!paymentMethod}
                  onClick={() => setStep('confirm')}
                  className="flex-1 px-4 py-2 bg-[#0EA5E9] text-white rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-[#0284C7] transition-colors"
                >
                  Review & Confirm →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && selectedStudent && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-[#0F172A]">Confirm Payment</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              ⚠ Please verify all details before confirming. This action will record the payment and generate a receipt.
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Student</div>
                <div className="font-bold text-[#0F172A]">{selectedStudent.name}</div>
                <div className="text-sm text-gray-500">{selectedStudent.studentId}</div>
                <div className="text-sm text-gray-500">{selectedStudent.course} · {selectedStudent.branch}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment</div>
                <div className="text-2xl font-bold text-[#0EA5E9]">{fmt(finalAmount)}</div>
                <div className="text-sm text-gray-500">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</div>
                {referenceNo && <div className="text-xs text-gray-400">Ref: {referenceNo}</div>}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Invoices</div>
              {selectedInvoiceData.map(inv => (
                <div key={inv.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{inv.description}</span>
                  <span className="font-medium">{fmt(inv.balance)}</span>
                </div>
              ))}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 border-t border-gray-200 pt-1.5 mt-1.5">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-{fmt(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-1.5 mt-1.5">
                <span>Total</span>
                <span className="text-[#0EA5E9]">{fmt(finalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('payment')} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">← Back</button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors"
              >
                ✓ Confirm & Record Payment
              </button>
            </div>
          </div>
        )}

        {/* Step: Receipt */}
        {step === 'receipt' && receiptData && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-emerald-600 p-6 text-white text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-xl font-bold">Payment Recorded Successfully</div>
              <div className="text-emerald-100 text-sm mt-1">Transaction ID: {receiptData.txnId}</div>
            </div>
            <div className="p-6 space-y-4">
              <div className="border border-gray-100 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-3">
                  <div>
                    <div className="font-bold text-lg text-[#0F172A]">ABC Business School</div>
                    <div className="text-xs text-gray-400">Payment Receipt</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Date</div>
                    <div className="font-medium text-sm">{receiptData.date}</div>
                  </div>
                </div>
                {[
                  ['Student', receiptData.student.name],
                  ['Student ID', receiptData.student.studentId],
                  ['Course', receiptData.student.course],
                  ['Transaction ID', receiptData.txnId],
                  ['Payment Method', PAYMENT_METHODS.find(m => m.id === receiptData.method)?.label || receiptData.method],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-gray-500">{l}</span>
                    <span className="font-medium text-[#0F172A]">{v}</span>
                  </div>
                ))}
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between font-bold text-lg">
                  <span>Amount Paid</span>
                  <span className="text-emerald-600">{fmt(receiptData.amount)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">🖨 Print Receipt</button>
                <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">📧 Email Receipt</button>
                <button onClick={handleReset} className="flex-1 px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm font-bold hover:bg-[#1E3A5F]">+ New Payment</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
