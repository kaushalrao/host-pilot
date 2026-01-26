import React from 'react';
import { Property } from '../lib/types';

export const PropertyDock: React.FC<{
    properties: Property[];
    selectedId: string;
    onSelect: (id: string) => void;
}> = ({ properties, selectedId, onSelect }) => (
    <div className="flex justify-center sticky top-2 z-40 w-full pointer-events-none">
        <div className="pointer-events-auto inline-flex overflow-x-auto gap-2 p-1.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl no-scrollbar max-w-[calc(100vw-24px)] md:max-w-full">
            {properties.map(p => (
                <button
                    key={p.id}
                    onClick={() => onSelect(p.id)}
                    className={`flex-shrink-0 whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${selectedId === p.id
                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/30 border-transparent'
                        : 'bg-transparent text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {p.name}
                </button>
            ))}
        </div>
    </div>
);
