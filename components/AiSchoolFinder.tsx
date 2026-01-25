
import React, { useState } from 'react';
import { findSchools } from '../services/geminiService';
import { SearchResult } from '../types';
import { useInView } from '../hooks/useInView';

const AiSchoolFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [ref, isInView] = useInView(0.1);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const searchResult = await findSchools(query);
      setResult(searchResult);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="ai"
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`snap-section min-h-screen flex flex-col justify-center bg-black relative overflow-hidden py-20 ${isInView ? 'snap-active' : ''}`}
    >
      {/* Dynamic light rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,113,227,0.15)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500 text-[11px] font-black uppercase tracking-widest mb-6 animate-on-scroll animate-fade-up">
            Powered by Gemini
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 animate-on-scroll animate-fade-up delay-100">
            Intelligent Search.
          </h2>
          <p className="text-xl text-slate-400 font-medium max-w-xl mx-auto animate-on-scroll animate-fade-up delay-200">
            Experience education discovery through artificial intelligence. Ask anything.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative group animate-on-scroll animate-scale-in delay-300">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about schools, fees, or curricula..."
            className="w-full px-10 py-8 md:py-10 bg-white/5 border border-white/10 rounded-[2.5rem] text-xl md:text-2xl text-white font-medium focus:outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-5 top-5 bottom-5 px-10 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Go'}
          </button>
        </form>

        {result && (
          <div className="mt-12 bg-white/5 rounded-[3rem] p-10 border border-white/10 animate-in fade-in zoom-in-95 duration-700">
            <div className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
              {result.text}
            </div>
            {result.sources.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-4">
                {result.sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" className="px-5 py-2 bg-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20">
                    {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSchoolFinder;
