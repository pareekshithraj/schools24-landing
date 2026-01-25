
import React from 'react';
import { useInView } from '../hooks/useInView';

const Features: React.FC = () => {
  const [ref, isInView] = useInView(0.1);

  return (
    <section
      id="discover"
      ref={ref as React.RefObject<HTMLElement>}
      className={`snap-section relative bg-white text-black min-h-screen flex flex-col justify-center py-20 overflow-hidden ${isInView ? 'snap-active' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-8">
            <span className="text-blue-600 font-black tracking-widest text-sm uppercase block mb-6 animate-on-scroll animate-fade-up">Built for Excellence</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] animate-on-scroll animate-fade-up delay-100">
              Everything you need <br />
              <span className="text-slate-200">for the perfect fit.</span>
            </h2>
          </div>
        </div>

        {/* The Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto">
          {/* Main ERP Feature */}
          <div className="md:col-span-2 md:row-span-2 bg-[#f5f5f7] rounded-[3rem] p-12 flex flex-col justify-between group overflow-hidden border border-slate-100 animate-on-scroll animate-scale-in delay-200">
            <div>
              <h3 className="text-4xl font-black tracking-tight mb-6">School ERP Pro</h3>
              <p className="text-xl text-slate-500 font-medium max-w-sm">
                India's most loved school management software. Fees, Attendance, and Exams in one secure cloud.
              </p>
            </div>
            <div className="relative mt-12 bg-white rounded-3xl p-8 shadow-2xl shadow-black/5 translate-y-20 group-hover:translate-y-0 transition-transform duration-700">
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-slate-100 rounded" />
                  <div className="h-3 w-48 bg-slate-50 rounded" />
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-2 w-full bg-slate-50 rounded" />)}
              </div>
            </div>
          </div>

          {/* Admission Assistance */}
          <div className="md:col-span-2 bg-black text-white rounded-[3rem] p-12 flex flex-col justify-between overflow-hidden relative animate-on-scroll animate-scale-in delay-300">
            <div className="relative z-10">
              <h3 className="text-3xl font-black tracking-tight mb-4">Admissions Assisted</h3>
              <p className="text-lg text-slate-400 font-medium">
                Our expert consultants help you navigate the complex Indian school admission cycle.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600 blur-[100px] opacity-40" />
            <div className="mt-8 flex gap-4">
              <div className="px-6 py-3 bg-white/10 rounded-full text-sm font-bold">24/7 Support</div>
              <div className="px-6 py-3 bg-white/10 rounded-full text-sm font-bold">Form Help</div>
            </div>
          </div>

          {/* Data Comparison */}
          <div className="bg-[#f5f5f7] rounded-[3rem] p-10 flex flex-col justify-between animate-on-scroll animate-scale-in delay-500">
            <h3 className="text-2xl font-bold tracking-tight">Compare Schools</h3>
            <div className="text-blue-600 font-black text-5xl">0</div>
            <p className="text-slate-500 font-medium">Database of CBSE, ICSE, and IB schools.</p>
          </div>

          {/* Student Portal */}
          <div className="bg-blue-600 text-white rounded-[3rem] p-10 flex flex-col justify-between animate-on-scroll animate-scale-in delay-500">
            <h3 className="text-2xl font-bold tracking-tight">Student Hub</h3>
            <p className="font-medium opacity-80">Assignments, results, and teacher feedback at your fingertips.</p>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-3/4" />
            </div>
          </div>

          {/* Fee Management */}
          <div className="md:col-span-2 bg-[#f5f5f7] rounded-[3rem] p-10 flex flex-col justify-between animate-on-scroll animate-scale-in delay-500">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-3xl font-black tracking-tight">Fee Management</h3>
              <div className="p-3 bg-white rounded-full text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <p className="text-xl text-slate-500 font-medium max-w-sm">Automated reminders, online payments, and comprehensive financial reporting.</p>
          </div>

          {/* Noted Corrector */}
          <div className="bg-black text-white rounded-[3rem] p-10 flex flex-col justify-between animate-on-scroll animate-scale-in delay-500">
            <h3 className="text-2xl font-bold tracking-tight mb-2">Noted Corrector</h3>
            <p className="text-slate-400 font-medium mb-6">AI-powered grading assistant for faster, more accurate evaluations.</p>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-green-400">ONLINE</span>
            </div>
          </div>

          {/* Schools24 AI */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-[3rem] p-10 flex flex-col justify-between animate-on-scroll animate-scale-in delay-500 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight mb-2">Schools24 AI</h3>
              <p className="text-white/80 font-medium">Smart insights and predictive analytics.</p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-20 transform rotate-12">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.93V19h-2v-2.07A8.003 8.003 0 014.07 11H2v-2h2.07A8.003 8.003 0 0111 4.07V2h2v2.07A8.003 8.003 0 0119.93 9H22v2h-2.07A8.003 8.003 0 0113 16.93zM12 15a5 5 0 100-10 5 5 0 000 10z" /></svg>
            </div>
          </div>

          {/* Connected Ecosystem Visual - Premium Dark Version */}
          <div className="md:col-span-4 bg-[#0a0a0a] rounded-[3rem] p-12 animate-on-scroll animate-scale-in delay-500 overflow-hidden relative border border-white/5">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />

            <div className="relative z-10 text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">One Platform. <span className="text-blue-500">Total Connectivity.</span></h3>
              <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">Seamlessly connecting data, people, and decisions across your entire campus.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 relative z-10 py-8">
              {/* Student Node */}
              <div className="flex flex-col items-center gap-6 group relative z-20">
                <div className="w-24 h-24 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white group-hover:bg-blue-500/[0.15] group-hover:border-blue-500/50 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4.75 5.25a3 3 0 013 3M12 14v5" /></svg>
                </div>
                <span className="font-bold text-slate-300 tracking-wide uppercase text-sm group-hover:text-blue-400 transition-colors">Student</span>
              </div>

              {/* Left Connector */}
              <div className="hidden md:flex flex-1 max-w-[150px] overflow-hidden relative h-[2px] bg-white/10 rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/2 animate-[shimmer_2s_infinite]" />
              </div>

              {/* Central Admin Hub */}
              <div className="flex flex-col items-center gap-6 group relative z-20">
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-600/30 rounded-full blur-xl animate-pulse" />
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-[0_0_50px_rgba(37,99,235,0.3)] flex items-center justify-center text-white relative z-10 ring-4 ring-black ring-opacity-50">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                </div>
                <span className="font-black text-white uppercase tracking-[0.2em] text-sm">Admin Hub</span>
              </div>

              {/* Right Connector */}
              <div className="hidden md:flex flex-1 max-w-[150px] overflow-hidden relative h-[2px] bg-white/10 rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/2 animate-[shimmer_2s_infinite_1s]" />
              </div>

              {/* Teacher Node */}
              <div className="flex flex-col items-center gap-6 group relative z-20">
                <div className="w-24 h-24 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white group-hover:bg-blue-500/[0.15] group-hover:border-blue-500/50 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <span className="font-bold text-slate-300 tracking-wide uppercase text-sm group-hover:text-blue-400 transition-colors">Teacher</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
