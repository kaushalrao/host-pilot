import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Template } from '../lib/types';
import { AVAILABLE_ICONS } from '../lib/utils';
import { SectionHeader } from './ui/SectionHeader';

export const TemplateSelector: React.FC<{
    templates: Template[];
    selectedId: string;
    onSelect: (id: string) => void;
}> = ({ templates, selectedId, onSelect }) => (
    <div>
        <SectionHeader title="Select Template" icon={<MessageCircle size={14} />} />
        <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
            {templates.map((t) => {
                const Icon = AVAILABLE_ICONS[t.icon] || MessageCircle;
                const isSelected = selectedId === t.id;
                return (
                    <button
                        key={t.id}
                        onClick={() => onSelect(t.id)}
                        className={`group relative p-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 aspect-square border ${isSelected
                            ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/50 shadow-lg shadow-indigo-900/20'
                            : 'bg-slate-800/40 border-white/5 hover:bg-slate-800 hover:border-white/10'
                            }`}
                    >
                        <div className={`p-2 rounded-xl transition-all duration-300 ${isSelected ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg' : 'bg-black/20 text-slate-400 group-hover:text-white group-hover:bg-black/40'}`}>
                            <Icon className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                        <span className={`text-[10px] font-bold tracking-wide transition-colors truncate w-full text-center ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                            {t.label}
                        </span>
                        {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                        )}
                    </button>
                )
            })}
        </div>
    </div>
);
