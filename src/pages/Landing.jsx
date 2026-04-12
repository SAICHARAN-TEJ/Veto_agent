import React from 'react';
import Nav from '../sections/Nav.jsx';
import Hero from '../sections/Hero.jsx';
import Marquee from '../sections/Marquee.jsx';
import Problem from '../sections/Problem.jsx';
import HowItWorks from '../sections/HowItWorks.jsx';
import Features from '../sections/Features.jsx';
import LiveMetrics from '../sections/LiveMetrics.jsx';
import MemoryArc from '../sections/MemoryArc.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import FAQ from '../sections/FAQ.jsx';
import Footer from '../sections/Footer.jsx';

export default function Landing() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 52 }}> {/* offset fixed nav */}
        <Hero />
        <Marquee />
        <Problem />
        <HowItWorks />
        <Features />
        <LiveMetrics />
        <MemoryArc />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
