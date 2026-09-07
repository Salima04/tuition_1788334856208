'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ComparisonRow {
  painPoint: string;
  description: string;
  legacy: { label: string; bad: boolean };
  fintech: { label: string; bad: boolean };
  tuition: { label: string; highlight?: boolean };
  metric: string;
  metricLabel: string;
}

const rows: ComparisonRow[] = [
  {
    painPoint: 'Failed ACH Batches',
    description:
      'A single bad routing number cascades into parent complaint tickets, manual re-runs, and a bursar office that spends Tuesday morning on the phone instead of at the ledger.',
    legacy: { label: 'Manual re-submission, 48–72 hr delay', bad: true },
    fintech: { label: 'Retry logic, but no SIS sync', bad: true },
    tuition: { label: 'Auto-retry with parent SMS + real-time SIS update', highlight: true },
    metric: '87%',
    metricLabel: 'reduction in failed-payment support tickets',
  },
  {
    painPoint: 'PCI DSS Audit Burden',
    description:
      'Scope creep turns a 2-week compliance audit into a 6-week staff drain. Every system that touches a card number gets pulled into scope — including your SIS.',
    legacy: { label: 'Full PCI scope — your team owns it', bad: true },
    fintech: { label: 'SAQ-A only, card data still in-scope', bad: true },
    tuition: { label: 'P2PE tokenization — you\'re out of PCI scope entirely', highlight: true },
    metric: '6 wks → 3 days',
    metricLabel: 'average PCI audit cycle for Tuition institutions',
  },
  {
    painPoint: 'SIS ↔ GL Reconciliation Gaps',
    description:
      'Month-end close means exporting CSVs, manually matching line items, and hoping the aid disbursement file from the SIS matches the ACH file from the processor. It never does on the first pass.',
    legacy: { label: 'Manual CSV export, 2–3 day close cycle', bad: true },
    fintech: { label: 'Webhook sync, but no aid disbursement mapping', bad: true },
    tuition: { label: 'Native SIS connectors — Ellucian, Workday, Banner', highlight: true },
    metric: '1 day',
    metricLabel: 'month-end close for institutions on Tuition',
  },
];

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="check-icon inline-block flex-shrink-0">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const CrossIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="cross-icon inline-block flex-shrink-0">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const ProblemSolutionArc: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleRows, setVisibleRows] = useState<Set<number>>(new Set());
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-idx'));
          if (entry.isIntersecting) {
            setVisibleRows((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );

    rowRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="comparison" className="py-24 bg-bg-pure">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="reveal mb-16 max-w-3xl">
          <span className="section-label block mb-4">The Problem → Solution Arc</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal leading-tight">
            Three problems costing your institution{' '}
            <span className="italic" style={{ color: 'var(--teal-primary)' }}>
              real money, real time, real risk.
            </span>
          </h2>
          <p className="text-charcoal-muted text-lg mt-4 leading-relaxed">
            Every row below is a workflow your staff runs manually today. The last column is what happens when Tuition handles it instead.
          </p>
        </div>

        {/* Column Headers */}
        <div className="hidden md:grid grid-cols-12 gap-0 mb-2 text-xs font-bold uppercase tracking-widest text-charcoal-muted">
          <div className="col-span-4 px-4 py-3">Pain Point</div>
          <div className="col-span-2 px-4 py-3 text-center">Legacy Processor</div>
          <div className="col-span-2 px-4 py-3 text-center">Generic Fintech</div>
          <div
            className="col-span-2 px-4 py-3 text-center rounded-t-xl"
            style={{ background: 'var(--teal-primary)', color: 'white' }}
          >
            ✦ Tuition
          </div>
          <div className="col-span-2 px-4 py-3 text-center">Impact</div>
        </div>

        {/* Rows */}
        <div className="space-y-0 border border-border-light rounded-2xl overflow-hidden">
          {rows.map((row, idx) => (
            <div
              key={row.painPoint}
              ref={(el) => { rowRefs.current[idx] = el; }}
              data-idx={idx}
              className={`grid grid-cols-1 md:grid-cols-12 gap-0 pain-row transition-all duration-700 ${
                visibleRows.has(idx) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              {/* Pain Point Description */}
              <div className="md:col-span-4 p-6 bg-bg-white border-b md:border-b-0 md:border-r border-border-light">
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal-muted mb-1">
                  Pain #{idx + 1}
                </p>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                  {row.painPoint}
                </h3>
                <p className="text-sm text-charcoal-muted leading-relaxed">{row.description}</p>
              </div>

              {/* Legacy */}
              <div className="md:col-span-2 p-5 flex flex-col items-start md:items-center justify-center border-b md:border-b-0 md:border-r border-border-light bg-bg-pure">
                <div className="flex items-start gap-2">
                  <CrossIcon />
                  <p className="text-sm text-charcoal-muted leading-snug">{row.legacy.label}</p>
                </div>
              </div>

              {/* Generic Fintech */}
              <div className="md:col-span-2 p-5 flex flex-col items-start md:items-center justify-center border-b md:border-b-0 md:border-r border-border-light bg-bg-pure">
                <div className="flex items-start gap-2">
                  <CrossIcon />
                  <p className="text-sm text-charcoal-muted leading-snug">{row.fintech.label}</p>
                </div>
              </div>

              {/* Tuition — Winner */}
              <div
                className="md:col-span-2 p-5 flex flex-col items-start md:items-center justify-center border-b md:border-b-0 md:border-r border-border-light"
                style={{
                  background: 'linear-gradient(to bottom, rgba(13,115,119,0.06), rgba(13,115,119,0.02))',
                  borderLeft: '2px solid var(--teal-primary)',
                  borderRight: '2px solid var(--teal-primary)',
                }}
              >
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <p className="text-sm font-medium text-charcoal leading-snug">{row.tuition.label}</p>
                </div>
              </div>

              {/* Metric */}
              <div
                className="md:col-span-2 p-5 flex flex-col items-center justify-center"
                style={{ background: 'var(--amber-light)' }}
              >
                <p
                  className="font-display text-2xl font-semibold text-center"
                  style={{ color: 'var(--amber-dark)' }}
                >
                  {row.metric}
                </p>
                <p className="text-xs text-charcoal-muted text-center mt-1 leading-snug">
                  {row.metricLabel}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence accumulation footer */}
        <div
          className="mt-8 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ background: 'var(--teal-light)', border: '1px solid rgba(13,115,119,0.2)' }}
        >
          <p className="text-sm text-charcoal-light leading-relaxed max-w-xl">
            <strong className="text-charcoal">The pattern is the same every time:</strong> manual handoffs create gaps, gaps create errors, errors create staff hours. Tuition closes each gap at the source.
          </p>
          <a href="#cta-form" className="btn-amber whitespace-nowrap flex-shrink-0">
            Get the full breakdown
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionArc;