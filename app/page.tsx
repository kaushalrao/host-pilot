"use client";

import * as React from 'react';
import { Loader2, Sparkles, Hand, Settings, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TypewriterEffect } from './components/ui/TypewriterEffect';
import { useApp } from './components/providers/AppProvider';

export default function HomePage() {
  const { user, loading } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 size={48} className="animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center justify-start md:justify-center min-h-[60vh] md:min-h-[70vh] gap-4 md:gap-12 animate-fade-in max-w-7xl mx-auto w-full px-4 py-8 md:py-10 selection:bg-indigo-500/30">

      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />

      <div className="text-center space-y-4 md:space-y-6 max-w-3xl relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-medium text-indigo-300 uppercase tracking-wider shadow-lg backdrop-blur-md mb-6 animate-[fadeIn_0.5s_ease-out]">
          <Sparkles size={12} className="text-indigo-400" />
          <span>The Host Operating System</span>
        </div>

        <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter drop-shadow-sm flex flex-col gap-2 md:gap-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 h-[1.3em] pb-2">
            <TypewriterEffect words={["Generate Welcome Messages", "Track Maintenance", "Simplify Hospitality"]} />
          </span>
        </h1>

        <p className="text-slate-400 text-sm md:text-xl font-light leading-relaxed max-w-2xl mx-auto px-4 mt-2 mb-4">
          Modern tools for seamless hospitality management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 w-full max-w-6xl mx-auto relative z-10">

        {/* Greeter Tile */}
        <Link href="/greeter" className="group relative h-36 md:h-72 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 bg-indigo-600 block ring-1 ring-white/10">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/10 transition-colors duration-500"></div>

          <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
            <div className="bg-indigo-950/30 w-fit px-2 py-0.5 md:px-3 md:py-1 rounded-full backdrop-blur-md mb-2 md:mb-4 border border-white/5">
              <span className="text-indigo-100 text-[10px] md:text-xs font-bold tracking-wider uppercase">Communication</span>
            </div>
            <h2 className="text-xl md:text-4xl font-black text-white mb-1 md:mb-3 tracking-tighter leading-tight">Guest<br />Greeting</h2>
            <p className="text-indigo-100/80 text-xs md:text-base font-medium max-w-[200px] leading-relaxed hidden sm:block">Create personalized welcome messages instantly.</p>
          </div>
          <div className="absolute -bottom-2 -right-2 md:-bottom-8 md:-right-8 rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            <Hand className="w-24 h-24 md:w-[180px] md:h-[180px] text-indigo-400 mix-blend-screen drop-shadow-2xl opacity-90" strokeWidth={1.5} />
          </div>
        </Link>

        {/* Maintenance Tile */}
        <Link href="/maintenance" className="group relative h-36 md:h-72 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-rose-500/30 bg-rose-600 block ring-1 ring-white/10">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/10 transition-colors duration-500"></div>

          <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
            <div className="bg-rose-950/30 w-fit px-2 py-0.5 md:px-3 md:py-1 rounded-full backdrop-blur-md mb-2 md:mb-4 border border-white/5">
              <span className="text-rose-100 text-[10px] md:text-xs font-bold tracking-wider uppercase">Operations</span>
            </div>
            <h2 className="text-xl md:text-4xl font-black text-white mb-1 md:mb-3 tracking-tighter leading-tight">Issue<br />Tracker</h2>
            <p className="text-rose-100/80 text-xs md:text-base font-medium max-w-[200px] leading-relaxed hidden sm:block">Log and monitor property maintenance tasks.</p>
          </div>
          <div className="absolute -bottom-2 -right-2 md:-bottom-8 md:-right-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
            <Wrench className="w-24 h-24 md:w-[180px] md:h-[180px] text-rose-400 mix-blend-screen drop-shadow-2xl opacity-90" strokeWidth={1.5} />
          </div>
        </Link>

        {/* Settings Tile */}
        <Link href="/settings" className="group relative h-36 md:h-72 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 bg-cyan-600 block ring-1 ring-white/10">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/10 transition-colors duration-500"></div>

          <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
            <div className="bg-cyan-950/30 w-fit px-2 py-0.5 md:px-3 md:py-1 rounded-full backdrop-blur-md mb-2 md:mb-4 border border-white/5">
              <span className="text-cyan-100 text-[10px] md:text-xs font-bold tracking-wider uppercase">System</span>
            </div>
            <h2 className="text-xl md:text-4xl font-black text-white mb-1 md:mb-3 tracking-tighter leading-tight">App<br />Config</h2>
            <p className="text-cyan-100/80 text-xs md:text-base font-medium max-w-[200px] leading-relaxed hidden sm:block">Manage properties and templates.</p>
          </div>
          <div className="absolute -bottom-2 -right-2 md:-bottom-8 md:-right-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
            <Settings className="w-24 h-24 md:w-[180px] md:h-[180px] text-cyan-500 mix-blend-screen drop-shadow-2xl opacity-90" strokeWidth={1.5} />
          </div>
        </Link>

      </div>
    </div>
  );
}