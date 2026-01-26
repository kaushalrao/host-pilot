import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from "firebase/auth";
import { Sparkles, UserCircle, CheckCircle2, XCircle } from 'lucide-react';
import { app, auth } from '../lib/firebase';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const AuthForm: React.FC<{ onAuthSuccess: (user: User) => void }> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!app) throw new Error("Firebase not initialized");

            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message?.replace('Firebase: ', '') || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-3xl mb-4 border border-white/10">
                        <Sparkles size={32} className="text-orange-400" />
                    </div>
                    <h1 className="text-3xl font-extrabold mb-2">Guest Greeter</h1>
                    <p className="text-slate-400">Sign in to manage your properties</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        icon={<UserCircle size={16} />}
                        label="Email Address"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        icon={<CheckCircle2 size={16} />} // Using CheckCircle just as an icon placeholder
                        label="Password"
                    />

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                            <XCircle size={16} /> {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" isLoading={loading}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};
