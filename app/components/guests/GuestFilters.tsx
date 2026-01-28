import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { GuestFiltersProps } from '../../lib/types';
import { GUEST_FILTER_OPTIONS } from '../../lib/constants';

export const GuestFilters: React.FC<GuestFiltersProps> = ({
    search,
    setSearch,
    selectedMonth,
    handlePrevMonth,
    handleNextMonth,
    toggleAllMonths,
    statusFilter,
    setStatusFilter,
    mode
}) => {
    return (
        <div className={`shrink-0 space-y-4 ${mode === 'page' ? 'mb-8' : 'mb-4 px-1'}`}>
            <div className={`flex flex-col ${mode === 'page' ? 'md:flex-row' : ''} gap-4`}>
                <div className="relative group flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search guests..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                    />
                </div>

                <div className={`flex flex-col ${mode === 'page' ? 'md:flex-row' : ''} gap-3 shrink-0`}>
                    {/* Month Filter Navigator */}
                    <div className={`flex items-center justify-between gap-1 bg-slate-900/50 border border-white/10 rounded-xl p-1 w-full ${mode === 'page' ? 'md:w-auto' : ''} min-w-[200px]`}>
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={toggleAllMonths}
                            className="flex-1 text-center text-sm font-bold text-white py-1 hover:text-indigo-300 transition-colors truncate px-2"
                        >
                            {selectedMonth === 'all' ? 'All Months' : format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className={`bg-slate-900/50 border border-white/10 rounded-xl p-1 grid grid-cols-3 shrink-0 w-full md:w-auto min-w-[280px]`}>
                        {GUEST_FILTER_OPTIONS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all w-full flex items-center justify-center ${statusFilter === filter
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
