'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TableSection {
  category: string;
  rows: {
    feature: string;
    legacy: 'yes' | 'no' | 'partial' | string;
    fintech: 'yes' | 'no' | 'partial' | string;
    tuition: 'yes' | 'no' | 'partial' | string;
    highlight?: boolean;
    tuitionNote?: string;
  }[];
}

const tableSections: TableSection[] = [
  {
    category: 'Payment Processing',
    rows: [
      { feature: 'ACH / eCheck processing', legacy: 'yes', fintech: 'yes', tuition: 'yes' },
      { feature: 'Credit & debit card acceptance', legacy: 'yes', fintech: 'yes', tuition: 'yes' },
      { feature: 'International wire & multi-currency', legacy: 'no', fintech: 'partial', tuition: 'yes', highlight: true, tuitionNote: '6 currencies, real-time FX' },
      { feature: 'Installment plan automation', legacy: 'partial', fintech: 'partial', tuition: 'yes', highlight: true, tuitionNote: 'Configurable per program type' },
      { feature: 'Financial aid disbursement routing', legacy: 'no', fintech: 'no', tuition: 'yes', highlight: true },
    ],
  },
  {
    category: 'Compliance & Security',
    rows: [
      { feature: 'PCI DSS Level 1 certified', legacy: 'yes', fintech: 'yes', tuition: 'yes' },
      { feature: 'P2PE tokenization (out-of-scope)', legacy: 'no', fintech: 'partial', tuition: 'yes', highlight: true },
      { feature: 'FERPA-compliant data handling', legacy: 'partial', fintech: 'no', tuition: 'yes', highlight: true },
      { feature: 'SOC 2 Type II report available', legacy: 'no', fintech: 'yes', tuition: 'yes' },
      { feature: 'Chargeback dispute automation', legacy: 'no', fintech: 'partial', tuition: 'yes', highlight: true, tuitionNote: 'Auto-evidence packaging' },
    ],
  },
  {
    category: 'System Integrations',
    rows: [
      { feature: 'Ellucian Banner / Colleague', legacy: 'partial', fintech: 'no', tuition: 'yes', highlight: true },
      { feature: 'Workday Student', legacy: 'no', fintech: 'partial', tuition: 'yes', highlight: true },
      { feature: 'PowerSchool / Infinite Campus (K-12)', legacy: 'no', fintech: 'no', tuition: 'yes', highlight: true },
      { feature: 'QuickBooks / NetSuite GL export', legacy: 'partial', fintech: 'yes', tuition: 'yes' },
      { feature: 'Real-time webhook + REST API', legacy: 'no', fintech: 'yes', tuition: 'yes' },
    ],
  },
  {
    category: 'Operations & Reporting',
    rows: [
      { feature: 'Same-day reconciliation report', legacy: 'no', fintech: 'partial', tuition: 'yes', highlight: true },
      { feature: 'Late fee rule engine', legacy: 'partial', fintech: 'no', tuition: 'yes', highlight: true, tuitionNote: 'Per-campus, per-program rules' },
      { feature: 'Parent / student payment portal', legacy: 'yes', fintech: 'yes', tuition: 'yes' },
      { feature: 'Automated refund processing', legacy: 'no', fintech: 'partial', tuition: 'yes', highlight: true },
      { feature: 'Custom reporting & data export', legacy: 'partial', fintech: 'yes', tuition: 'yes' },
    ],
  },
];

type CellValue = 'yes' | 'no' | 'partial' | string;

const CellContent: React.FC<{ value: CellValue; isWinner?: boolean; note?: string }> = ({ value, isWinner, note }) => {
  if (value === 'yes') {
    return (
      <div className="flex flex-col items-center gap-1">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="check-icon">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        {note && isWinner && (
          <span className="text-xs text-teal-primary font-medium text-center leading-tight">{note}</span>
        )}
      </div>
    );
  }
  if (value === 'no') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="cross-icon">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    );
  }
  if (value === 'partial') {
    return (
      <div className="flex flex-col items-center gap-1">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dash-icon">
          <path d="M5 12h14"/>
        </svg>
        <span className="text-xs text-charcoal-muted">Partial</span>
      </div>
    );
  }
  return <span className="text-sm text-charcoal-muted">{value}</span>;
};

const FullComparisonTable: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="full-comparison" ref={sectionRef} className="py-24 bg-bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className={`mb-12 max-w-3xl transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="section-label block mb-4">Feature Comparison</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal leading-tight">
            Every column tells the same story.{' '}
            <span className="italic" style={{ color: 'var(--teal-primary)' }}>One platform wins it.</span>
          </h2>
        </div>

        {/* Table Wrapper — horizontal scroll on mobile */}
        <div className="overflow-x-auto rounded-2xl border border-border-light shadow-sm">
          <table className="comparison-table w-full min-w-[720px] border-collapse bg-bg-pure">
            {/* Sticky Header */}
            <thead>
              <tr>
                <th className="text-left px-6 py-5 text-sm font-semibold text-charcoal-muted bg-bg-white border-b border-border-light w-[40%]">
                  Feature
                </th>
                <th className="px-4 py-5 text-center text-sm font-semibold text-charcoal-muted bg-bg-white border-b border-border-light w-[20%]">
                  Legacy Processor
                </th>
                <th className="px-4 py-5 text-center text-sm font-semibold text-charcoal-muted bg-bg-white border-b border-border-light w-[20%]">
                  Generic Fintech
                </th>
                <th
                  className="px-4 py-5 text-center text-sm font-bold text-white border-b border-teal-primary w-[20%] winner-col-header"
                >
                  ✦ Tuition
                </th>
              </tr>
            </thead>
            <tbody>
              {tableSections.map((section, sIdx) => (
                <React.Fragment key={section.category}>
                  {/* Category Row */}
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-b border-border-light"
                      style={{ background: 'var(--teal-light)', color: 'var(--teal-primary)' }}
                    >
                      {section.category}
                    </td>
                  </tr>
                  {/* Feature Rows */}
                  {section.rows.map((row, rIdx) => (
                    <tr
                      key={row.feature}
                      className={`transition-all duration-500 ${
                        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      } ${row.highlight ? '' : ''}`}
                      style={{ transitionDelay: `${(sIdx * 5 + rIdx) * 60 + 200}ms` }}
                    >
                      <td
                        className={`px-6 py-4 text-sm text-charcoal border-b border-border-light font-medium ${
                          row.highlight ? 'amber-highlight' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {row.feature}
                          {row.highlight && (
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                              style={{ background: 'var(--amber-light)', color: 'var(--amber-dark)' }}
                            >
                              Differentiator
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center border-b border-border-light">
                        <CellContent value={row.legacy} />
                      </td>
                      <td className="px-4 py-4 text-center border-b border-border-light">
                        <CellContent value={row.fintech} />
                      </td>
                      <td
                        className="px-4 py-4 text-center border-b border-teal-primary/20 winner-col"
                      >
                        <CellContent value={row.tuition} isWinner note={row.tuitionNote} />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              {/* Summary Row */}
              <tr style={{ background: 'var(--teal-light)' }}>
                <td className="px-6 py-5 text-sm font-bold text-charcoal">
                  Total features covered
                </td>
                <td className="px-4 py-5 text-center">
                  <span className="font-display text-2xl font-semibold text-charcoal-muted">8/20</span>
                </td>
                <td className="px-4 py-5 text-center">
                  <span className="font-display text-2xl font-semibold text-charcoal-muted">11/20</span>
                </td>
                <td className="px-4 py-5 text-center winner-col">
                  <span className="font-display text-2xl font-semibold" style={{ color: 'var(--teal-primary)' }}>20/20</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-charcoal-muted mt-4 text-center">
          Comparison based on publicly available documentation as of Q1 2026. "Partial" indicates limited or add-on availability.
        </p>
      </div>
    </section>
  );
};

export default FullComparisonTable;