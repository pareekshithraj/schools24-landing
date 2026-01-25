
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';

const Hero: React.FC = () => {
  const [ref, isInView] = useInView(0.1);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.querySelector('.snap-container');
    if (!container || !logoRef.current) return;

    let animationFrameId: number;

    const handleScroll = () => {
      const scrolled = container.scrollTop;
      const viewportHeight = window.innerHeight;

      // Optimize: Only calculate when in or near viewport
      if (scrolled <= viewportHeight * 1.5) {
        animationFrameId = requestAnimationFrame(() => {
          if (logoRef.current) {
            // "Future" Warp Effect:
            // 1. Scale massively to simulate flying through
            // 2. Fade out slightly later to keep it visible during zoom
            // 3. Add blur for speed sensation

            const progress = scrolled / viewportHeight;
            const growth = 1 + progress * 40; // Massive scale up to 40x

            // Opacity stays 1 until 30% scroll, then fades fast
            const opacity = 1 - Math.max(0, (progress - 0.3) * 2);

            // Blur increases with speed/scroll
            const blur = Math.min(10, progress * 20);

            logoRef.current.style.transform = `scale(${growth})`;
            logoRef.current.style.opacity = Math.max(0, opacity).toString();
            logoRef.current.style.filter = `blur(${blur}px)`;
          }
        });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`snap-section relative h-screen bg-black overflow-hidden flex items-center justify-center snap-active`}>
      {/* Ambient background energy */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.08)_0%,transparent_60%)] pointer-events-none" />

      {/* Static Logo Background - Scales on Scroll */}
      <div
        className="absolute z-10 pointer-events-none will-change-transform flex items-center justify-center inset-0"
      >
        <img
          ref={logoRef}
          src="/logo-icon.png"
          alt="Schools24 Logo"
          className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain origin-center transition-none"
        />
      </div>

      {/* Full Wordmark Reveal */}
      <div className="relative z-20 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl md:text-[12vw] font-[900] tracking-tighter leading-tight md:leading-none text-white select-none animate-on-scroll animate-fade-up delay-100">
          SCHOOLS<span className="text-[#f59e0b]">24</span>
        </h1>
        <div className="mt-4 md:mt-8 text-sm md:text-2xl font-bold text-slate-400 tracking-[0.2em] md:tracking-[0.4em] uppercase animate-on-scroll animate-fade-up delay-200">
          Powering Schools. Empowering Students.
        </div>

        <div className="mt-8 md:mt-16 flex flex-col sm:flex-row gap-4 md:gap-6 opacity-80 z-30 animate-on-scroll animate-fade-up delay-300 w-full px-6 md:w-auto">
          <Link to="/register" className="w-full md:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-black rounded-2xl font-black text-lg md:text-xl hover:scale-105 transition-all">
            Get Started
          </Link>
          <Link to="/contact" className="w-full md:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-lg md:text-xl hover:bg-white/10 transition-all">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
