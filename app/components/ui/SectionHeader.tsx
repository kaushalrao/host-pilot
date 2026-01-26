import React from 'react';

export const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
    <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
        {icon} <span className="text-orange-400">{title}</span>
    </h3>
);
