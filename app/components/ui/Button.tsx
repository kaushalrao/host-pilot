import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', isLoading, ...props }) => {
    const variants = {
        primary: "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/20 hover:opacity-90 disabled:opacity-50",
        secondary: "bg-slate-700/50 text-slate-200 hover:bg-slate-700 border border-white/5",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
        ghost: "bg-transparent text-slate-400 hover:text-white"
    };
    return (
        <button className={`py-3 px-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {children}
        </button>
    );
};
