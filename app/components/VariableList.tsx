import React from 'react';
import { VARIABLE_CATEGORIES } from '../lib/utils';

export const VariableList: React.FC<{ onInsert: (tag: string) => void }> = ({ onInsert }) => (
    <div className="space-y-6">
        {Object.entries(VARIABLE_CATEGORIES).map(([category, vars]) => (
            <div key={category} className="mb-6 last:mb-0">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">{category}</h5>
                <div className="flex flex-wrap gap-2">
                    {vars.map(tag => (
                        <button
                            type="button"
                            key={tag}
                            onClick={() => onInsert(tag)}
                            className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-orange-600 hover:text-white border border-white/5 transition-all active:scale-95 flex items-center gap-1"
                        >
                            <span className="opacity-50 text-[8px]">{`{{`}</span>{tag}<span className="opacity-50 text-[8px]">{`}}`}</span>
                        </button>
                    ))}
                </div>
            </div>
        ))}
    </div>
);
