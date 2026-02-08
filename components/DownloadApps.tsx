import React from 'react';
import { Smartphone, Monitor, Tv, Apple } from 'lucide-react';

const DownloadApps: React.FC = () => {
    const apps = [
        {
            platform: 'Android',
            icon: <Smartphone className="w-8 h-8" />,
            description: 'Get it on Google Play',
            gradient: 'from-green-400 to-emerald-600',
            link: '#',
            subText: 'For flexible learning on the go'
        },
        {
            platform: 'iOS',
            icon: <Apple className="w-8 h-8" />,
            description: 'Download on the App Store',
            gradient: 'from-gray-100 to-gray-400 text-black',
            link: '#',
            subText: 'Premium experience for iPhone & iPad'
        },
        {
            platform: 'Windows',
            icon: <Monitor className="w-8 h-8" />,
            description: 'Get it from Microsoft Store',
            gradient: 'from-blue-400 to-blue-600',
            link: '#',
            subText: 'Desktop productivity for pros'
        },
        {
            platform: 'Android TV',
            icon: <Tv className="w-8 h-8" />,
            description: 'Available on Google TV',
            gradient: 'from-red-400 to-rose-600',
            link: '#',
            subText: 'Immersive classroom on big screen'
        }
    ];

    return (
        <section className="relative py-20 bg-black overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-sm font-bold tracking-[0.2em] text-[#EAB308] uppercase mb-4 block animate-fade-in-up">
                        Everywhere You Are
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                        One Platform. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Any Device.</span>
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Seamlessly switch between your phone, tablet, laptop, and TV. Your classroom follows you wherever you go.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {apps.map((app, idx) => (
                        <a
                            key={idx}
                            href={app.link}
                            className="group relative p-1 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />

                            <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.4rem] p-6 flex flex-col items-center text-center transition-colors group-hover:bg-white/10">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:rotate-6 transition-transform duration-300`}>
                                    {app.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{app.platform}</h3>
                                <p className="text-sm text-white/50 mb-4 h-10">{app.subText}</p>

                                <div className="mt-auto w-full py-3 rounded-xl bg-white/10 text-white text-sm font-semibold group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center gap-2">
                                    <span>Download</span>
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DownloadApps;
