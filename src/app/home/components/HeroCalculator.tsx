'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_ENROLLMENT = 2400;
const DEFAULT_TUITION = 18750;
const DEFAULT_FEE_PCT = 2.9;
const TUITION_FEE_PCT = 0.89;

const MIN_ENROLLMENT = 200;
const MAX_ENROLLMENT = 15000;

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}) => {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        prevRef.current = end;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  const formatted = decimals > 0
    ? display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(display).toLocaleString('en-US');

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

const HeroCalculator: React.FC = () => {
  const [enrollment, setEnrollment] = useState(DEFAULT_ENROLLMENT);
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Animate in on mount
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const currentAnnualFees = enrollment * DEFAULT_TUITION * (DEFAULT_FEE_PCT / 100);
  const tuitionAnnualFees = enrollment * DEFAULT_TUITION * (TUITION_FEE_PCT / 100);
  const overpaying = currentAnnualFees - tuitionAnnualFees;
  const savingsPct = Math.round(((overpaying) / currentAnnualFees) * 100);

  const sliderPct = ((enrollment - MIN_ENROLLMENT) / (MAX_ENROLLMENT - MIN_ENROLLMENT)) * 100;

  const updateSlider = useCallback((val: number) => {
    setEnrollment(val);
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--slider-pct', `${((val - MIN_ENROLLMENT) / (MAX_ENROLLMENT - MIN_ENROLLMENT)) * 100}%`);
    }
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--slider-pct', `${sliderPct}%`);
    }
  }, [sliderPct]);

  return (
    <section
      id="calculator"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg pt-24 pb-16"
    >
      {/* Subtle teal glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(13,115,119,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        {/* Top Label */}
        <div
          className={`flex items-center gap-3 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="section-label">Live Cost Estimator</span>
          <span className="inline-flex items-center gap-1.5 bg-teal-light text-teal-primary text-xs font-semibold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-primary animate-pulse inline-block" />
            Calculating in real time
          </span>
        </div>

        {/* Headline */}
        <div className={`mb-4 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[80px] leading-[0.95] text-charcoal font-light tracking-tight">
            Your tuition processor<br />
            <span className="italic" style={{ color: 'var(--teal-primary)' }}>is charging you</span>
          </h1>
        </div>
        <div className={`mb-12 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-baseline gap-4 flex-wrap">
            <AnimatedNumber
              value={currentAnnualFees}
              prefix="$"
              className="font-display text-5xl md:text-7xl lg:text-[80px] leading-[0.95] font-semibold"
              style={{ color: 'var(--amber)' } as React.CSSProperties}
            />
            <span className="font-display text-3xl md:text-5xl text-charcoal-muted font-light italic">per year</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Slider Control */}
          <div
            className={`lg:col-span-5 bg-bg-pure rounded-2xl border border-border-light p-8 shadow-sm transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <h2 className="text-base font-semibold text-charcoal mb-6">Adjust your enrollment</h2>

            {/* Enrollment Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-charcoal-muted font-medium">Enrolled students</span>
                <span className="font-display text-2xl font-semibold text-charcoal">
                  <AnimatedNumber value={enrollment} />
                </span>
              </div>
              <input
                ref={sliderRef}
                type="range"
                min={MIN_ENROLLMENT}
                max={MAX_ENROLLMENT}
                step={100}
                value={enrollment}
                onChange={(e) => updateSlider(Number(e.target.value))}
                className="calc-slider w-full"
                aria-label="Enrollment size"
                style={{ '--slider-pct': `${sliderPct}%` } as React.CSSProperties}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-charcoal-muted">{formatNumber(MIN_ENROLLMENT)}</span>
                <span className="text-xs text-charcoal-muted">{formatNumber(MAX_ENROLLMENT)}</span>
              </div>
            </div>

            {/* Fixed Assumptions */}
            <div className="space-y-3 pt-6 border-t border-border-light">
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wide mb-3">Assumptions</p>
              {[
                { label: 'Avg. tuition / student', value: `$${DEFAULT_TUITION.toLocaleString()}` },
                { label: 'Current processing fee', value: `${DEFAULT_FEE_PCT}%` },
                { label: 'Tuition fee rate', value: `${TUITION_FEE_PCT}%` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm text-charcoal-muted">{item.label}</span>
                  <span className="text-sm font-semibold text-charcoal font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-7 space-y-4">
            {/* Overpaying Card */}
            <div
              className={`rounded-2xl p-8 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ background: 'var(--amber-light)', border: '2px solid var(--amber)' }}
            >
              <p className="text-sm font-semibold text-charcoal-light mb-2 uppercase tracking-wide">
                You&apos;re overpaying by
              </p>
              <div className="flex items-baseline gap-3 flex-wrap">
                <AnimatedNumber
                  value={overpaying}
                  prefix="$"
                  className="font-display text-5xl md:text-6xl font-semibold"
                  style={{ color: 'var(--amber-dark)' } as React.CSSProperties}
                />
                <span
                  className="font-display text-2xl font-light italic"
                  style={{ color: 'var(--amber-dark)' }}
                >
                  / year
                </span>
              </div>
              <p className="text-sm text-charcoal-light mt-3">
                That&apos;s{' '}
                <strong style={{ color: 'var(--amber-dark)' }}>{savingsPct}% of your current processing spend</strong>
                {' '}going to fees that Tuition eliminates.
              </p>
            </div>

            {/* Comparison Row */}
            <div
              className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <div className="metric-card p-6">
                <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wide mb-2">Current annual cost</p>
                <AnimatedNumber
                  value={currentAnnualFees}
                  prefix="$"
                  className="font-display text-3xl font-semibold text-charcoal"
                />
                <div className="progress-bar mt-3">
                  <div className="progress-fill animate" style={{ '--bar-target': '100%' } as React.CSSProperties} />
                </div>
                <p className="text-xs text-charcoal-muted mt-2">{DEFAULT_FEE_PCT}% processing rate</p>
              </div>
              <div className="metric-card p-6" style={{ borderColor: 'var(--teal-primary)' }}>
                <p className="text-xs font-semibold text-teal-primary uppercase tracking-wide mb-2">With Tuition</p>
                <AnimatedNumber
                  value={tuitionAnnualFees}
                  prefix="$"
                  className="font-display text-3xl font-semibold text-charcoal"
                />
                <div className="progress-bar mt-3">
                  <div
                    className="progress-fill animate"
                    style={{
                      '--bar-target': `${Math.round((TUITION_FEE_PCT / DEFAULT_FEE_PCT) * 100)}%`,
                      background: 'linear-gradient(to right, var(--teal-primary), var(--teal-mid))',
                    } as React.CSSProperties}
                  />
                </div>
                <p className="text-xs text-teal-primary mt-2 font-medium">{TUITION_FEE_PCT}% — flat, no hidden fees</p>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`flex flex-col sm:flex-row gap-3 pt-2 transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <a href="#cta-form" className="btn-amber flex-1 justify-center text-base py-4">
                Calculate Your Savings
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#comparison" className="btn-outline flex-1 justify-center text-base py-4">
                See the full comparison
              </a>
            </div>
          </div>
        </div>

        {/* Bottom stat strip */}
        <div
          className={`mt-12 pt-8 border-t border-border-light grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {[
            { value: '340+', label: 'Institutions live' },
            { value: '99.97%', label: 'ACH batch success rate' },
            { value: '$2.4B', label: 'Processed in 2025' },
            { value: '6 currencies', label: 'International programs' },
          ].map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="font-display text-2xl font-semibold text-charcoal">{stat.value}</p>
              <p className="text-sm text-charcoal-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCalculator;