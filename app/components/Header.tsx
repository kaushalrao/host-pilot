"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Settings, MessageCircle, LogOut, Wrench, Home } from 'lucide-react';
import { signOut } from "firebase/auth";
import { auth } from '../lib/firebase';

export const Header: React.FC = () => {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isSettings = pathname === '/settings';
    const isGreeter = pathname === '/greeter';
    const isMaintenance = pathname === '/maintenance';
    const isAuth = pathname === '/auth';

    if (isAuth) return null;

    return (
        <div className={`sticky top-0 z-50 flex flex-col transition-all duration-300 border-b ${isHome ? 'bg-transparent border-transparent' : 'bg-[#0f172a]/95 backdrop-blur-xl border-white/5'}`}>
            <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-3 w-full">
                        {!isHome && (
                            <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-slate-300">
                                <Home size={24} />
                            </Link>
                        )}

                        {isSettings && (
                            <h1 className="text-xl font-bold text-white tracking-tight animate-fade-in">Settings</h1>
                        )}

                        {isGreeter && (
                            <div className="flex-1 flex justify-center lg:justify-start">
                                <h1 className="text-xl font-bold text-white tracking-tight animate-fade-in">Greeter</h1>
                            </div>
                        )}

                        {isMaintenance && (
                            <h1 className="text-xl font-bold text-white tracking-tight animate-fade-in">Maintenance</h1>
                        )}
                    </div>

                    <div className="ml-auto flex-shrink-0 flex items-center gap-2">
                        {isGreeter ? (
                            <>
                                <Link href="/settings" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors border border-white/5 hover:bg-slate-700"><Settings size={20} /></Link>
                            </>
                        ) : isSettings || isMaintenance ? (
                            <Link href="/greeter" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors border border-white/5 hover:bg-slate-700"><MessageCircle size={20} /></Link>
                        ) : null}

                        <button onClick={() => signOut(auth)} className="p-2 hover:bg-red-500/20 rounded-full text-slate-400 hover:text-red-400 transition-colors" title="Sign Out">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
