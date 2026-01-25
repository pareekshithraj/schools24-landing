
import React from 'react';
import { useInView } from '../hooks/useInView';

const ScrollVideo: React.FC = () => {
    const [ref, isInView] = useInView(0.3);

    return (
        <section
            ref={ref as React.RefObject<HTMLElement>}
            className={`snap-section relative h-screen bg-black flex items-center justify-center overflow-hidden ${isInView ? 'snap-active' : ''}`}
        >
            {/* The Video - Autoplay Loop */}
            <video
                src="/hallway.mp4"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                autoPlay
                loop
                muted
                playsInline
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

            {/* Content Overlay */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center">

                {/* Title Group */}
                <div className="mb-20">
                    <h2 className="text-5xl md:text-7xl font-[900] tracking-tighter text-white mb-4 animate-on-scroll animate-fade-up">
                        Better Schools.
                    </h2>
                    <h2 className="text-5xl md:text-7xl font-[900] tracking-tighter text-[#f59e0b] animate-on-scroll animate-fade-up delay-100">
                        Brighter Futures.
                    </h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full animate-on-scroll animate-fade-up delay-200">
                    {[
                        { val: "0", label: "Schools" },
                        { val: "0", label: "Happy Students" },
                        { val: "100%", label: "Data Secured" },
                        { val: "24/7", label: "Consulting Hub" }
                    ].map((stat, i) => (
                        <div key={i} className="group p-6 rounded-3xl bg-black/40 border border-white/10 hover:bg-black/60 transition-all">
                            <div className="text-4xl md:text-5xl font-[900] text-white mb-2 tracking-tighter text-[#f59e0b]">
                                {stat.val}
                            </div>
                            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ScrollVideo;
