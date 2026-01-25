
import React from 'react';
import Footer from '../components/Footer';

const News: React.FC = () => {
    return (
        <div className="bg-black h-screen w-full overflow-y-auto selection:bg-red-500 selection:text-white">
            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <span className="text-red-500 font-bold tracking-widest uppercase text-xs mb-4 block animate-fade-up">Press Room</span>
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-20 animate-fade-up delay-100">
                    Latest <span className="text-red-500">Updates.</span>
                </h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up delay-200">
                    {[
                        { date: 'Jan 24, 2026', title: 'Schools24 Raises Series B to Expand Nationwide', source: 'TechCrunch' },
                        { date: 'Dec 10, 2025', title: 'Top 100 EdTech Companies of the Year', source: 'Forbes India' },
                        { date: 'Nov 05, 2025', title: 'New AI Features for Admission Prediction', source: 'Press Release' },
                        { date: 'Oct 20, 2025', title: 'Partnering with 50 New International Schools', source: 'Education Times' },
                        { date: 'Sep 15, 2025', title: 'Schools24 Mobile App Hits 1 Million Downloads', source: 'App Store' },
                        { date: 'Aug 01, 2025', title: 'Empowering Rural Education with Cloud ERP', source: 'The Hindu' }
                    ].map((news, i) => (
                        <div key={i} className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
                            <div className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">{news.source} • {news.date}</div>
                            <h3 className="text-2xl font-bold text-white mb-6 leading-tight group-hover:text-red-500 transition-colors">
                                {news.title}
                            </h3>
                            <div className="text-red-500 font-bold text-sm flex items-center gap-2">
                                Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default News;
