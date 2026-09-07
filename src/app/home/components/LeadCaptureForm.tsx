'use client';

import React, { useState } from 'react';

type InstitutionType = '' | 'k12' | 'higher-ed' | 'online';
type FormStep = 1 | 2 | 3 | 'success' | 'pdf-success';

const enrollmentRanges = [
  { value: '< 500', label: 'Under 500 students' },
  { value: '500–1,500', label: '500 – 1,500 students' },
  { value: '1,500–5,000', label: '1,500 – 5,000 students' },
  { value: '5,000–15,000', label: '5,000 – 15,000 students' },
  { value: '15,000+', label: 'Over 15,000 students' },
];

const institutionTypes = [
  {
    value: 'k12' as InstitutionType,
    label: 'K-12 District',
    description: 'Multi-campus fee structures, district mandates',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    value: 'higher-ed' as InstitutionType,
    label: 'Higher Education',
    description: 'University or college, financial aid disbursements',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    value: 'online' as InstitutionType,
    label: 'Online Program',
    description: 'Multi-timezone, multi-currency student payments',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
  },
];

const LeadCaptureForm: React.FC = () => {
  const [step, setStep] = useState<FormStep>(1);
  const [institutionType, setInstitutionType] = useState<InstitutionType>('');
  const [enrollment, setEnrollment] = useState('');
  const [email, setEmail] = useState('');
  const [pdfEmail, setPdfEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pdfSubmitting, setPdfSubmitting] = useState(false);

  const handleStep1 = (type: InstitutionType) => {
    setInstitutionType(type);
    setStep(2);
  };

  const handleStep2 = () => {
    if (!enrollment) return;
    setStep(3);
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitting(true);
    // Mock submit — replace with actual API call
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setStep('success');
  };

  const handlePdfCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfEmail || !pdfEmail.includes('@')) return;
    setPdfSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setPdfSubmitting(false);
    setStep('pdf-success');
  };

  return (
    <section id="cta-form" className="py-24 bg-bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Primary Lead Form */}
          <div>
            <span className="section-label block mb-4">Calculate Your Savings</span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal leading-tight mb-4">
              See exactly what{' '}
              <span className="italic" style={{ color: 'var(--teal-primary)' }}>
                Tuition saves your institution.
              </span>
            </h2>
            <p className="text-charcoal-muted text-lg mb-10 leading-relaxed">
              A 15-minute call with a Tuition implementation specialist. We&apos;ll pull your current processor&apos;s fee schedule, run the numbers, and give you a signed savings estimate — no commitment required.
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center gap-3 mb-8">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      (step === 'success' || step === 'pdf-success' || Number(step) >= s)
                        ? 'text-white' :'text-charcoal-muted border-2 border-border-mid'
                    }`}
                    style={
                      (step === 'success' || step === 'pdf-success' || Number(step) >= s)
                        ? { background: 'var(--teal-primary)' }
                        : {}
                    }
                  >
                    {(step === 'success' || step === 'pdf-success' || Number(step) > s) ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    ) : s}
                  </div>
                  {s < 3 && (
                    <div
                      className="flex-1 h-0.5 transition-all duration-500"
                      style={{
                        background: (step === 'success' || step === 'pdf-success' || Number(step) > s)
                          ? 'var(--teal-primary)' :'var(--border-mid)',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Institution Type */}
            {step === 1 && (
              <div className="animate-slide-up">
                <p className="text-sm font-semibold text-charcoal mb-4">What type of institution are you?</p>
                <div className="space-y-3">
                  {institutionTypes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => handleStep1(t.value)}
                      className="w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 hover:border-teal-primary hover:shadow-sm group"
                      style={{ borderColor: 'var(--border-light)', background: 'var(--bg-pure)' }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ background: 'var(--teal-light)', color: 'var(--teal-primary)' }}
                      >
                        {t.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal group-hover:text-teal-primary transition-colors">{t.label}</p>
                        <p className="text-xs text-charcoal-muted mt-0.5">{t.description}</p>
                      </div>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className="ml-auto text-charcoal-muted group-hover:text-teal-primary transition-colors flex-shrink-0"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Enrollment */}
            {step === 2 && (
              <div className="animate-slide-up">
                <p className="text-sm font-semibold text-charcoal mb-4">Annual enrollment count?</p>
                <div className="space-y-2 mb-6">
                  {enrollmentRanges.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => { setEnrollment(r.value); }}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        enrollment === r.value
                          ? 'border-teal-primary bg-teal-light' :'border-border-light bg-bg-pure hover:border-teal-primary/40'
                      }`}
                    >
                      <span className={`text-sm font-medium ${enrollment === r.value ? 'text-teal-primary' : 'text-charcoal'}`}>
                        {r.label}
                      </span>
                      {enrollment === r.value && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-teal-primary">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-outline"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStep2}
                    disabled={!enrollment}
                    className="btn-amber flex-1 justify-center"
                    style={{ opacity: enrollment ? 1 : 0.5 }}
                  >
                    Continue
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Email */}
            {step === 3 && (
              <form onSubmit={handleStep3} className="animate-slide-up">
                <p className="text-sm font-semibold text-charcoal mb-2">Work email</p>
                <p className="text-xs text-charcoal-muted mb-4">
                  We&apos;ll send your personalized savings estimate to this address.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourinstitution.edu"
                  className="form-input mb-4"
                  required
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-outline"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-amber flex-1 justify-center"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25"/>
                          <path d="M12 3a9 9 0 019 9"/>
                        </svg>
                        Calculating...
                      </>
                    ) : (
                      <>
                        Calculate My Savings
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-charcoal-muted mt-3">
                  No phone number required. No SDR calls. Your estimate arrives in under 4 hours.
                </p>
              </form>
            )}

            {/* Success */}
            {(step === 'success' || step === 'pdf-success') && (
              <div
                className="animate-slide-up p-8 rounded-2xl text-center"
                style={{ background: 'var(--teal-light)', border: '2px solid var(--teal-primary)' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--teal-primary)' }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-semibold text-charcoal mb-2">
                  {step === 'success' ? 'Your estimate is on its way.' : 'PDF sent to your inbox.'}
                </h3>
                <p className="text-sm text-charcoal-muted leading-relaxed">
                  {step === 'success' ? `We've received your request for ${institutionType === 'k12' ? 'K-12' : institutionType === 'higher-ed' ? 'Higher Education' : 'Online Program'} (${enrollment}). Expect a detailed savings breakdown within 4 business hours.`
                    : 'Check your inbox for "The True Cost of Manual Tuition Processing." It includes a 12-point audit checklist your finance team can use immediately.'}
                </p>
              </div>
            )}
          </div>

          {/* Right: PDF Secondary CTA */}
          <div className="lg:pt-20">
            <div
              className="rounded-2xl p-8 border-2"
              style={{ background: 'var(--charcoal)', borderColor: 'var(--charcoal)' }}
            >
              {/* PDF Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(242,169,34,0.15)' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>

              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: 'var(--amber)' }}
              >
                Free Research Report
              </p>
              <h3 className="font-display text-2xl font-semibold text-white mb-3 leading-tight">
                The True Cost of Manual Tuition Processing
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                A 14-page analysis of hidden costs across failed ACH batches, PCI audit hours, reconciliation labor, and refund cycle delays — with a 12-point checklist your CFO can act on immediately.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Staff-hour cost model for reconciliation workflows',
                  'PCI audit scope reduction calculator',
                  'SIS integration compatibility matrix',
                  '12-point payment operations audit checklist',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span className="text-sm text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              {step !== 'pdf-success' && step !== 'success' ? (
                <form onSubmit={handlePdfCapture}>
                  <input
                    type="email"
                    value={pdfEmail}
                    onChange={(e) => setPdfEmail(e.target.value)}
                    placeholder="your@institution.edu"
                    className="form-input mb-3"
                    required
                    style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.15)', color: 'white' }}
                  />
                  <button
                    type="submit"
                    disabled={pdfSubmitting}
                    className="w-full py-4 rounded-xl font-semibold text-charcoal text-base flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'var(--amber)' }}
                  >
                    {pdfSubmitting ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 3a9 9 0 019 9"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Download Free Report
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Email only. No phone. Unsubscribe any time.
                  </p>
                </form>
              ) : (
                <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(13,115,119,0.2)' }}>
                  <p className="text-sm text-white font-medium">
                    ✓ Report sent — check your inbox
                  </p>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              {[
                { label: 'PCI DSS Level 1', icon: '🔒' },
                { label: 'SOC 2 Type II', icon: '✓' },
                { label: 'FERPA Compliant', icon: '📋' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold text-charcoal-muted"
                  style={{ borderColor: 'var(--border-light)', background: 'var(--bg-pure)' }}
                >
                  <span>{badge.icon}</span>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureForm;