'use client';

import React, { useState, useEffect } from 'react';
import AppLogo from '@/components/ui/AppLogo';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-border-light shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group" aria-label="Tuition home">
          <AppLogo
            text="Tuition"
            iconName="CalculatorIcon"
            size={32}
            className="text-teal-primary"
          />
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {[
            { label: 'How It Works', href: '#comparison' },
            { label: 'Comparison', href: '#full-comparison' },
            { label: 'Results', href: '#metrics' },
            { label: 'Pricing', href: '#cta-form' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-charcoal-light hover:text-teal-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#cta-form"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-charcoal-light hover:text-teal-primary transition-colors"
          >
            Sign In
          </a>
          <a
            href="#calculator"
            className="btn-amber text-sm px-5 py-2.5"
          >
            Calculate Savings
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;