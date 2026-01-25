
import React from 'react';
import Footer from '../components/Footer';

const Partners: React.FC = () => {
    return (
        <div className="bg-black h-screen w-full overflow-y-auto selection:bg-purple-500 selection:text-white">

            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
                <span className="text-purple-500 font-bold tracking-widest uppercase text-xs mb-4 block animate-fade-up">Trusted By Industry Leaders</span>
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-12 animate-fade-up delay-100">
                    Powering the <br />
                    <span className="text-purple-500">Best.</span>
                </h1>

                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-20 animate-fade-up delay-200">
                    Over 500+ top-tier educational institutions rely on Schools24 for their daily operations, admissions, and management.
                </p>

                {/* Partners Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 animate-fade-up delay-300">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="aspect-video bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all group">
                            {/* Placeholder Logo */}
                            <div className="text-slate-600 font-black text-2xl group-hover:text-white transition-colors">
                                SCHOOL {i}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-left flex flex-col md:flex-row items-center justify-between gap-10 border border-white/10">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Become a Partner</h2>
                        <p className="text-slate-300 text-lg max-w-md">
                            Join our network of elite schools and get access to premium tools, consulting, and more.
                        </p>
                    </div>
                    <button className="relative z-10 px-10 py-5 bg-white text-black rounded-full font-black text-xl hover:scale-105 transition-all shadow-xl shadow-purple-500/20 whitespace-nowrap">
                        Apply Now
                    </button>

                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 blur-[150px] opacity-40 rounded-full pointer-events-none" />
                </div>

            </section>

            <Footer />
        </div>
    );
};

export default Partners;
