"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../components/providers/AppProvider';
import { AuthForm } from '../components/AuthForm';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
    const { user, loading } = useApp();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <Loader2 size={48} className="animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="w-full min-h-[85vh] flex items-center justify-center animate-fade-in">
            <AuthForm onAuthSuccess={() => router.push('/')} />
        </div>
    );
}
