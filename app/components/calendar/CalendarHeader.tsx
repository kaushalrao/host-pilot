import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarHeaderProps } from './types';

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentMonth, onNext, onPrev }) => (
    <div className="flex items-center justify-between mb-4">
        <button
            onClick={onPrev}
            type="button"
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white"
            aria-label="Previous Month"
        >
            <ChevronLeft size={20} />
        </button>
        <span className="text-white font-bold text-sm">
            {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
            onClick={onNext}
            type="button"
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white"
            aria-label="Next Month"
        >
            <ChevronRight size={20} />
        </button>
    </div>
);
