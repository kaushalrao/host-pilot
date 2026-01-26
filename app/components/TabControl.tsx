import React from 'react';

import { TabControlProps } from '../lib/types';

export const TabControl: React.FC<TabControlProps> = ({ options, activeId, onChange, className = '' }) => (
    <div className={`bg-slate-900/90 p-1 rounded-2xl inline-flex border border-white/10 relative shadow-2xl ${className}`}>
        {options.map(opt => (
            <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`relative z-10 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeId === opt.id ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
                {opt.icon} {opt.label}
            </button>
        ))}
        <div
            className="absolute top-1 bottom-1 rounded-xl bg-slate-700/80 shadow-inner transition-all duration-300 ease-out"
            style={{
                width: `calc(${100 / options.length}% - 0.5rem)`,
                left: `calc(${(options.findIndex(o => o.id === activeId) * (100 / options.length))}% + 0.25rem)`
            }}
        />
    </div>
);
