
import React from 'react';
import Footer from '../components/Footer';

const SchoolRegistration: React.FC = () => {
    return (
        <div className="bg-white h-screen w-full overflow-y-auto selection:bg-blue-500 selection:text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-[#f5f5f7] rounded-b-[4rem]">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block">Partner with Schools24</span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                        Join the <span className="text-blue-600">Network.</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                        Connect with millions of parents, streamline admissions, and digitize your campus with one unified platform.
                    </p>
                </div>
            </section>

            {/* Registration Form */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto bg-white border border-slate-100 shadow-2xl shadow-blue-900/5 rounded-[3rem] p-10 md:p-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-8">School Details</h2>

                    <form className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">School Name</label>
                                <input type="text" placeholder="e.g. St. Xavier's High" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 font-bold text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">City</label>
                                <input type="text" placeholder="e.g. Mumbai" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 font-bold text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Affiliation Board</label>
                            <select className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                                <option>Select Board</option>
                                <option>CBSE</option>
                                <option>ICSE</option>
                                <option>IB World School</option>
                                <option>IGCSE</option>
                                <option>State Board</option>
                            </select>
                        </div>

                        <div className="h-px bg-slate-100 my-8" />

                        <h2 className="text-3xl font-black text-slate-900 mb-8">Contact Person</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Name</label>
                                <input type="text" placeholder="Admin Name" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 font-bold text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Role</label>
                                <input type="text" placeholder="Principal / Trustee" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 font-bold text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Official Email</label>
                            <input type="email" placeholder="contact@school.edu" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 font-bold text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                        </div>

                        <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 mt-8">
                            Submit Application
                        </button>

                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SchoolRegistration;
