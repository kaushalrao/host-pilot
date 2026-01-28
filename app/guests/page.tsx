"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users, ChevronLeft } from 'lucide-react';
import { useApp } from '../components/providers/AppProvider';
import { GuestDirectory } from '../components/guests/GuestDirectory';

export default function GuestsPage() {
    const { user } = useApp();
    const router = useRouter();

    // Redirect if not logged in
    React.useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="animate-fade-in max-w-5xl mx-auto w-full pb-20 relative px-0 md:px-0 pt-4 md:pt-8 safe-area-top">
            <div className="px-4 md:px-0">
                <button
                    onClick={() => router.push('/')}
                    className="mb-4 md:mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs md:text-sm font-bold uppercase tracking-wider"
                >
                    <ChevronLeft size={16} /> Back to Dashboard
                </button>

                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="p-2 md:p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/10">
                        <Users className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-white tracking-tight">Guest Directory</h1>
                        <p className="text-xs md:text-base text-slate-400">View and manage all your past and upcoming guests.</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl md:border border-t border-b border-white/5 md:rounded-3xl p-4 md:p-6 min-h-[60vh] shadow-xl">
                <GuestDirectory
                    mode="page"
                    onSelect={(guest) => router.push(`/greeter?guestId=${guest.id}`)}
                />
            </div>
        </div>
    );
}
