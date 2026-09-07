'use client';

import React, { useEffect, useState } from 'react';

const StickyBar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const comparisonSection = document.getElementById('comparison');
    if (!comparisonSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0 && !dismissed) {
          setVisible(true);
        } else if (entry.isIntersecting) {
          // Don't hide once shown unless dismissed
        }
      },
      { threshold: 0 }
    );

    observer.observe(comparisonSection);
    return () => observer.disconnect();
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      className={`sticky-bar ${visible ? 'visible' : ''}`}
      role="complementary"
      aria-label="Calculate savings CTA"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--teal-primary)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="8" y1="10" x2="16" y2="10"/>
            <line x1="8" y1="14" x2="12" y2="14"/>
          </svg>
        </div>
        <p className="text-sm text-white font-medium truncate">
          <span className="hidden sm:inline">Your institution could be overpaying by </span>
          <span className="font-bold" style={{ color: 'var(--amber)' }}>$400K+ annually</span>
          <span className="hidden sm:inline"> in processing fees.</span>
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <a
          href="#cta-form"
          className="btn-amber py-2.5 px-5 text-sm"
          onClick={() => setVisible(false)}
        >
          Calculate Your Savings
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <button
          onClick={() => { setDismissed(true); setVisible(false); }}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Dismiss"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StickyBar;