
import React from 'react';
import Footer from '../components/Footer';

const Blog: React.FC = () => {
    return (
        <div className="bg-white h-screen w-full overflow-y-auto selection:bg-blue-600 selection:text-white">
            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block animate-fade-up">Thought Leadership</span>
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-12 animate-fade-up delay-100">
                    Insights & <br /> <span className="text-blue-600">Stories.</span>
                </h1>

                {/* Featured Post */}
                <div className="bg-slate-100 rounded-[3rem] p-8 md:p-12 mb-20 animate-fade-up delay-200 group cursor-pointer hover:shadow-2xl hover:shadow-blue-900/10 transition-all">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="h-64 md:h-96 bg-slate-300 rounded-3xl overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2600&auto=format&fit=crop" alt="Education" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div>
                            <div className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">Featured</div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                                The Future of Classroom Technology: AI & Beyond
                            </h2>
                            <p className="text-lg text-slate-500 mb-8 font-medium">
                                How artificial intelligence is personalizing learning experiences for students across the globe.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200" />
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Sarah Jenkins</div>
                                    <div className="text-xs font-bold text-slate-400">Jan 22, 2026 • 5 min read</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {[
                        { title: 'Optimizing School Administration', desc: 'Best practices for managing large campuses efficiently.' },
                        { title: 'Student Mental Health Awareness', desc: 'Creating supportive environments for growing minds.' },
                        { title: 'The Hybrid Learning Model', desc: 'Is remote learning here to stay? We analyze the data.' }
                    ].map((post, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="h-60 bg-slate-100 rounded-3xl mb-6 overflow-hidden">
                                <div className="w-full h-full bg-slate-200 group-hover:bg-slate-300 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{post.title}</h3>
                            <p className="text-sm text-slate-500 font-medium">{post.desc}</p>
                        </div>
                    ))}
                </div>

            </section>
            <Footer />
        </div>
    );
};

export default Blog;
