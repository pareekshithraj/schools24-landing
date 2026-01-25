
import React from 'react';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
    return (
        <div className="bg-white h-screen w-full overflow-y-auto selection:bg-orange-500 selection:text-white">
            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-4 block">Get in Touch</span>
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-12 leading-[0.9]">
                            Let's build <br />
                            the <span className="text-orange-500">Future.</span>
                        </h1>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Headquarters</h3>
                                <p className="text-slate-500 font-medium">
                                    Bangalore, Karnataka,<br />
                                    India
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Support</h3>
                                <p className="text-slate-500 font-medium text-lg">
                                    partner@schools24.in
                                </p>
                                <p className="text-slate-500 font-medium">
                                    +91 9110893850
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="h-[600px] bg-slate-100 rounded-[3rem] overflow-hidden grayscale invert filter">
                        {/* Map Placeholder - Replace with iframe if needed */}
                        <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/77.5946,12.9716,11,0/800x800?access_token=Pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazl5b...')] bg-cover bg-center flex items-center justify-center">
                            <span className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold border border-white/20">Bangalore HQ</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
