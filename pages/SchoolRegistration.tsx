import React, { useState } from 'react';
import Footer from '../components/Footer';
import { createAdmissionApplication } from '../services/firestore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { School, Building2, BookOpen, GraduationCap, Phone, Mail, User, CheckCircle2, Star, Globe, Wifi, Monitor, Cpu, Tv, Tablet, Beaker, Laptop, Sparkles, Megaphone, ArrowRight } from 'lucide-react';

const partnerBenefits = [
    { icon: <Monitor className="w-5 h-5" />, text: 'School Management Software (SaaS)' },
    { icon: <Tv className="w-5 h-5" />, text: 'Smart Classroom Infrastructure' },
    { icon: <Tablet className="w-5 h-5" />, text: 'Managed Learning Devices' },
    { icon: <Wifi className="w-5 h-5" />, text: 'Campus Networking & Mesh Wi-Fi' },
    { icon: <Cpu className="w-5 h-5" />, text: 'Next-Gen Computer Labs' },
    { icon: <Beaker className="w-5 h-5" />, text: 'Advanced STEAM Lab Solutions' },
    { icon: <Laptop className="w-5 h-5" />, text: 'Workstations for Educators' },
    { icon: <Globe className="w-5 h-5" />, text: 'Institutional Web Intelligence' },
    { icon: <Mail className="w-5 h-5" />, text: 'Unified Digital Identity' },
    { icon: <Sparkles className="w-5 h-5" />, text: 'AI-Enhanced Academic Suite' },
    { icon: <BookOpen className="w-5 h-5" />, text: 'JEE & NEET Competitive Edge' },
    { icon: <Megaphone className="w-5 h-5" />, text: 'Global Brand Architecture' },
];

const SchoolRegistration: React.FC = () => {
    const navigate = useNavigate();
    const { push } = useToast();
    const [schoolName, setSchoolName] = useState('');
    const [city, setCity] = useState('');
    const [board, setBoard] = useState('');
    const [students, setStudents] = useState('');
    const [grades, setGrades] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactRole, setContactRole] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [goLive, setGoLive] = useState('pay');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatus(null);
        setError(null);
        try {
            await createAdmissionApplication({
                schoolName,
                city,
                board,
                contactName,
                contactRole,
                email,
                students,
                grades,
                phone,
                goLive,
                notes: goLive === 'partner' ? notes : '',
            });
            if (goLive === 'pay') {
                push({ type: 'success', title: 'Registration submitted', message: 'Redirecting to payment console.' });
                navigate('/payments');
                return;
            }
            setStatus('Request submitted successfully.');
            push({ type: 'success', title: 'Registration submitted', message: 'Our executive team will reach out within 24 hours.' });
            window.scrollTo(0, 0);
        } catch (err: any) {
            console.error('Registration Error:', err);
            setError(err?.message ?? 'Action failed. Please retry.');
            push({ type: 'error', title: 'Submission failed', message: err?.message ?? 'Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[#020617] min-h-screen w-full overflow-y-auto selection:bg-blue-500 selection:text-white font-sans text-slate-200">
            <style>
                {`
                    @keyframes border-flow {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .animate-border-flow {
                        background-size: 200% 200%;
                        animation: border-flow 6s linear infinite;
                    }
                    .pro-input:focus-within label,
                    .pro-input input:not(:placeholder-shown) + label,
                    .pro-input select:not([value=""]) + label {
                        transform: translateY(-1.75rem) scale(0.8);
                        color: #3b82f6;
                        letter-spacing: 0.1em;
                    }
                    .glass-panel {
                        background: rgba(15, 23, 42, 0.7);
                        backdrop-filter: blur(24px);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    }
                `}
            </style>

            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-[-10%] w-[70vw] h-[70vw] bg-blue-600/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/5 rounded-full blur-[140px]" />
                <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <header className="relative pt-32 pb-16 px-6 z-10">
                <div className="max-w-6xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20 backdrop-blur-xl animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-400">Institutional Onboarding</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[0.95] drop-shadow-sm">
                        Enterprise <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Education Stack</span>
                    </h1>

                    <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Scale your institution with the most advanced digital architecture in education. Instant deployment, global standards.
                    </p>
                </div>
            </header>

            <main className="pb-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1.5fr_1fr]">

                    {/* Primary Application Form */}
                    <div className="relative">
                        <div className="glass-panel rounded-[3rem] p-8 md:p-16 overflow-hidden relative group">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

                            {status ? (
                                <div className="flex flex-col items-center justify-center text-center py-20 space-y-8 animate-fade-in-up">
                                    <div className="w-32 h-32 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center ring-1 ring-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative">
                                        <div className="absolute inset-0 animate-ping bg-emerald-500/5 rounded-full" />
                                        <CheckCircle2 className="w-16 h-16 relative z-10" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-4xl font-black text-white tracking-tight">Transmission Successful</h3>
                                        <p className="text-slate-400 max-w-md text-lg mx-auto">
                                            Your institutional profile has been ingested. Our Executive Dashboard has flagged this for immediate priority approval.
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 font-mono">
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Protocol ID:</span>
                                        <span className="text-white font-bold text-xl tracking-tighter">S24-{Date.now().toString().slice(-6)}</span>
                                    </div>
                                    <button
                                        onClick={() => { setStatus(null); setSchoolName(''); setEmail(''); }}
                                        className="mt-10 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-blue-50 transition-all hover:scale-[1.02] shadow-xl hover:shadow-white/10"
                                    >
                                        Initiate New Protocol
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-16">
                                        <div className="space-y-1">
                                            <h2 className="text-3xl font-black text-white tracking-tight">Core Configuration</h2>
                                            <p className="text-blue-500/60 font-bold text-xs uppercase tracking-[0.2em]">Institutional Identity & Scope</p>
                                        </div>
                                        <Cpu className="w-8 h-8 text-slate-800" />
                                    </div>

                                    <form className="space-y-12" onSubmit={handleSubmit}>
                                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
                                            {/* School Name */}
                                            <div className="pro-input relative">
                                                <input
                                                    type="text"
                                                    id="schoolName"
                                                    value={schoolName}
                                                    onChange={(e) => setSchoolName(e.target.value)}
                                                    className="peer w-full bg-transparent border-b-2 border-slate-800 px-0 py-4 text-xl font-bold text-white focus:outline-none focus:border-blue-500 transition-all placeholder-transparent"
                                                    placeholder="School Name"
                                                    required
                                                />
                                                <label htmlFor="schoolName" className="absolute left-0 top-4 text-slate-500 transition-all pointer-events-none font-bold uppercase text-[10px] tracking-[0.2em] transform translate-y-0 origin-left">
                                                    Institutional Name
                                                </label>
                                                <School className="absolute right-0 top-4 w-5 h-5 text-slate-800 peer-focus:text-blue-500 transition-colors" />
                                            </div>

                                            {/* City */}
                                            <div className="pro-input relative">
                                                <input
                                                    type="text"
                                                    id="city"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    className="peer w-full bg-transparent border-b-2 border-slate-800 px-0 py-4 text-xl font-bold text-white focus:outline-none focus:border-blue-500 transition-all placeholder-transparent"
                                                    placeholder="City"
                                                    required
                                                />
                                                <label htmlFor="city" className="absolute left-0 top-4 text-slate-500 transition-all pointer-events-none font-bold uppercase text-[10px] tracking-[0.2em] transform translate-y-0 origin-left">
                                                    Deployment City
                                                </label>
                                                <Building2 className="absolute right-0 top-4 w-5 h-5 text-slate-800 peer-focus:text-blue-500 transition-colors" />
                                            </div>

                                            {/* Board */}
                                            <div className="pro-input relative">
                                                <select
                                                    id="board"
                                                    value={board}
                                                    onChange={(e) => setBoard(e.target.value)}
                                                    className="peer w-full bg-transparent border-b-2 border-slate-800 px-0 py-4 text-xl font-bold text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                                    required
                                                >
                                                    <option value="" disabled className="bg-slate-900"></option>
                                                    <option value="CBSE" className="bg-slate-900">CBSE Central Board</option>
                                                    <option value="ICSE" className="bg-slate-900">ICSE Council</option>
                                                    <option value="IB" className="bg-slate-900">International Baccalaureate</option>
                                                    <option value="IGCSE" className="bg-slate-900">Cambridge IGCSE</option>
                                                    <option value="State" className="bg-slate-900">State Regulatory Board</option>
                                                </select>
                                                <label htmlFor="board" className={`absolute left-0 transition-all pointer-events-none font-bold uppercase text-[10px] tracking-[0.2em] origin-left ${board ? '-translate-y-7 text-blue-500' : 'translate-y-4 text-slate-500'}`}>
                                                    Accreditation Board
                                                </label>
                                                <BookOpen className="absolute right-0 top-4 w-5 h-5 text-slate-800 peer-focus:text-blue-500 transition-colors pointer-events-none" />
                                            </div>

                                            {/* Students */}
                                            <div className="pro-input relative">
                                                <input
                                                    type="number"
                                                    id="students"
                                                    value={students}
                                                    onChange={(e) => setStudents(e.target.value)}
                                                    className="peer w-full bg-transparent border-b-2 border-slate-800 px-0 py-4 text-xl font-bold text-white focus:outline-none focus:border-blue-500 transition-all placeholder-transparent"
                                                    placeholder="Total Students"
                                                />
                                                <label htmlFor="students" className="absolute left-0 top-4 text-slate-500 transition-all pointer-events-none font-bold uppercase text-[10px] tracking-[0.2em] transform translate-y-0 origin-left">
                                                    Aggregate Students
                                                </label>
                                                <User className="absolute right-0 top-4 w-5 h-5 text-slate-800 peer-focus:text-blue-500 transition-colors" />
                                            </div>
                                        </div>

                                        <div className="pt-12 space-y-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-0.5 w-12 bg-blue-500" />
                                                <h3 className="text-xl font-black text-white tracking-tight">Executive Lead</h3>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 bg-slate-400/5 rounded-3xl p-10 border border-white/5 mx-[-1rem] md:mx-0">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={contactName}
                                                        onChange={(e) => setContactName(e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-xl font-bold text-white placeholder-slate-800 focus:ring-0"
                                                        placeholder="Admin Identity"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Designation</label>
                                                    <input
                                                        type="text"
                                                        value={contactRole}
                                                        onChange={(e) => setContactRole(e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-xl font-bold text-white placeholder-slate-800 focus:ring-0"
                                                        placeholder="e.g. Director"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Communication Hub (Email)</label>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-xl font-bold text-white placeholder-slate-800 focus:ring-0"
                                                        placeholder="admin@institution.edu"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Secure Line (Phone)</label>
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="w-full bg-transparent border-none p-0 text-xl font-bold text-white placeholder-slate-800 focus:ring-0"
                                                        placeholder="+91 Institutional Mobile"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 space-y-6">
                                            <h3 className="text-xl font-black text-white tracking-tight">Deployment Strategy</h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <button
                                                    type="button"
                                                    onClick={() => setGoLive('pay')}
                                                    className={`group relative p-8 rounded-3xl border-2 text-left transition-all ${goLive === 'pay' ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                                >
                                                    <div className="relative z-10 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                                                                <Sparkles className="w-6 h-6" />
                                                            </div>
                                                            {goLive === 'pay' && <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"><CheckCircle2 className="w-5 h-5" /></div>}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-white text-lg">Express Activation</div>
                                                            <div className="text-sm text-slate-500 mt-1 leading-relaxed">Full portal orchestration in 48 hours. Secure gateway required.</div>
                                                        </div>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setGoLive('partner')}
                                                    className={`group relative p-8 rounded-3xl border-2 text-left transition-all ${goLive === 'partner' ? 'bg-purple-600/10 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                                >
                                                    <div className="relative z-10 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
                                                                <Megaphone className="w-6 h-6" />
                                                            </div>
                                                            {goLive === 'partner' && <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg"><CheckCircle2 className="w-5 h-5" /></div>}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-white text-lg">Partner Architecture</div>
                                                            <div className="text-sm text-slate-500 mt-1 leading-relaxed">End-to-end infra scaling & global marketing alliance.</div>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {goLive === 'partner' && (
                                            <div className="animate-fade-in-up space-y-4">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Mission Objectives / Requirements</label>
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-purple-500 transition-colors min-h-[160px] text-lg font-medium leading-relaxed"
                                                    placeholder="State your institutional priorities..."
                                                />
                                            </div>
                                        )}

                                        {error && <div className="text-sm text-red-400 bg-red-500/5 p-6 rounded-3xl border border-red-500/20 flex items-center gap-4"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />{error}</div>}

                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="group relative w-full py-6 bg-white text-black rounded-3xl font-black text-2xl overflow-hidden transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_30px_60px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                                        >
                                            <div className="absolute inset-x-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-slate-200/50 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                                            <span className="relative flex items-center justify-center gap-4">
                                                {isSaving ? 'Encrypting & Relaying...' : goLive === 'pay' ? 'Initiate Payment Protocol' : 'Submit Partnership Dossier'}
                                                {!isSaving && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                                            </span>
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Network & Proof Section */}
                    <div className="space-y-10 flex flex-col">

                        {/* Velocity Card */}
                        <div className="relative p-[2px] rounded-[3rem] overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-border-flow opacity-80 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative bg-[#020617] rounded-[2.9rem] p-10 h-full overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/20 blur-[90px] rounded-full pointer-events-none" />
                                <div className="relative z-10 space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] tracking-widest uppercase mb-4">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                        Velocity Launch System Activated
                                    </div>
                                    <h3 className="text-4xl font-black text-white leading-tight">Zero Lag <br /> Deployment.</h3>
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        Bypass the legacy waiting game. Our specialized deployment force ingests your institutional data and activates your entire digital ecosystem in record time. Zero friction, total transformation.
                                    </p>
                                    <div className="pt-6 grid grid-cols-2 gap-6">
                                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                            <div className="text-2xl font-black text-white tracking-tighter">48h</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Activation</div>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                            <div className="text-2xl font-black text-white tracking-tighter">100%</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Managed</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Window */}
                        <div className="flex-1 bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 ring-1 ring-blue-500/20">
                                            <Star className="w-6 h-6" />
                                        </div>
                                        Global Ecosystem
                                    </h3>
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Module Inventory</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                                    {partnerBenefits.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group/benefit">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover/benefit:text-blue-400 group-hover/benefit:bg-blue-500/10 transition-all transform group-hover/benefit:scale-110">
                                                {item.icon}
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-slate-300 font-bold group-hover/benefit:text-white transition-colors">{item.text}</span>
                                                <div className="h-0.5 w-0 group-hover/benefit:w-full bg-blue-500/50 transition-all duration-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SchoolRegistration;
