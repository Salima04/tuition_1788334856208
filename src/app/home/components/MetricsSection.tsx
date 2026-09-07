'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Metric {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
  sublabel: string;
  color: string;
}

const metrics: Metric[] = [
  {
    value: '87',
    numericValue: 87,
    suffix: '%',
    label: 'Fewer failed-payment tickets',
    sublabel: 'Avg. across 340+ institutions in first 90 days',
    color: 'var(--teal-primary)',
  },
  {
    value: '1',
    numericValue: 1,
    suffix: ' day',
    label: 'Month-end close cycle',
    sublabel: 'Down from 4–6 days with legacy processors',
    color: 'var(--teal-mid)',
  },
  {
    value: '99.97',
    numericValue: 99.97,
    suffix: '%',
    label: 'ACH batch success rate',
    sublabel: 'Industry average: 96.4%',
    color: 'var(--teal-primary)',
  },
  {
    value: '6 wks',
    numericValue: 6,
    suffix: '→ 3 days',
    label: 'PCI audit cycle reduction',
    sublabel: 'P2PE tokenization removes you from scope',
    color: 'var(--amber)',
  },
];

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  institution: string;
  type: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'We processed $47M in tuition last fall with zero reconciliation discrepancies. For the first time in eight years, our month-end close happened on the 2nd — not the 9th.',
    name: 'Margaret Holloway',
    title: 'CFO',
    institution: 'Whitmore College',
    type: 'Higher Ed · 3,200 students',
  },
  {
    quote:
      'Managing fee structures across 14 campuses used to require a dedicated staff member. Now it\'s a Tuesday afternoon configuration. The K-12 module understood our district-mandated constraints from day one.',
    name: 'David Okonkwo',
    title: 'Business Manager',
    institution: 'Lakewood Unified School District',
    type: 'K-12 · 11,400 students',
  },
  {
    quote:
      'Our online MBA students pay in four currencies. Before Tuition, that meant four separate processors, four reconciliation files, and a finance team that dreaded enrollment week. Now it\'s one dashboard.',
    name: 'Priya Venkataraman',
    title: 'Director of Online Programs',
    institution: 'Hartfield Business School',
    type: 'Online · 6 currencies',
  },
];

interface AnimatedCounterProps {
  target: number;
  suffix: string;
  active: boolean;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, suffix, active, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, target]);

  const display = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toString();

  if (target === 6 && suffix === '→ 3 days') {
    return <span>6 wks{active ? <span style={{ transition: 'opacity 0.5s', opacity: active ? 1 : 0 }}> → 3 days</span> : null}</span>;
  }
  if (target === 1 && suffix === ' day') {
    return <span>{display}{suffix}</span>;
  }

  return <span>{display}{suffix}</span>;
};

const MetricsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="metrics" ref={sectionRef} className="py-24 bg-bg-pure">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className={`mb-16 max-w-3xl transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="section-label block mb-4">Measured Outcomes</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal leading-tight">
            The numbers your board{' '}
            <span className="italic" style={{ color: 'var(--teal-primary)' }}>
              will ask about.
            </span>
          </h2>
          <p className="text-charcoal-muted text-lg mt-4">
            Aggregated from 340+ institutions. Measured at 90-day and 12-month post-implementation checkpoints.
          </p>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className={`metric-card p-8 transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <p
                className="font-display text-5xl font-semibold mb-3 leading-none"
                style={{ color: m.color }}
              >
                <AnimatedCounter
                  target={m.numericValue}
                  suffix={m.suffix}
                  active={visible}
                  decimals={m.value.includes('.') ? 2 : 0}
                />
              </p>
              <p className="text-base font-semibold text-charcoal mb-1">{m.label}</p>
              <p className="text-sm text-charcoal-muted leading-snug">{m.sublabel}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="ledger-divider pt-16">
          <div className={`transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <span className="section-label block mb-8">From the institutions using it</span>

            {/* Active Testimonial */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div
                  key={t.name}
                  className={`testimonial-card cursor-pointer transition-all duration-500 ${
                    idx === activeTestimonial
                      ? 'ring-2 shadow-lg'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={idx === activeTestimonial ? { ringColor: 'var(--teal-primary)' } as React.CSSProperties : {}}
                  onClick={() => setActiveTestimonial(idx)}
                >
                  {idx === activeTestimonial && (
                    <div
                      className="w-8 h-1 rounded-full mb-4"
                      style={{ background: 'var(--teal-primary)' }}
                    />
                  )}
                  <blockquote className="text-base text-charcoal-light leading-relaxed mb-6 italic font-display">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: 'var(--teal-primary)' }}
                    >
                      {t.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                      <p className="text-xs text-charcoal-muted">
                        {t.title} · {t.institution}
                      </p>
                      <p
                        className="text-xs font-medium mt-0.5"
                        style={{ color: 'var(--teal-primary)' }}
                      >
                        {t.type}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;