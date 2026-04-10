import React from 'react';
import Nav from '../sections/Nav';
import Hero from '../sections/Hero';
import MarqueeStrip from '../sections/MarqueeStrip';
import Problem from '../sections/Problem';
import HowItWorks from '../sections/HowItWorks';
import Features from '../sections/Features';
import LiveMetrics from '../sections/LiveMetrics';
import MemoryArc from '../sections/MemoryArc';
import Testimonials from '../sections/Testimonials';
import FAQ from '../sections/FAQ';
import FooterSection from '../sections/FooterSection';

export default function Landing() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Nav />
      {/* spacer for fixed nav */}
      <div style={{ height: 56 }} />

      <Hero />
      <MarqueeStrip />
      <Problem />
      <HowItWorks />
      <Features />
      <LiveMetrics />
      <MemoryArc />
      <Testimonials />
      <FAQ />
      <FooterSection />
    </div>
  );
}
