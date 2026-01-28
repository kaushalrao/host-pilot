import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DatePickerProps } from './types';
import { getBlockMeta, isBlocked } from './utils';
import { useCalendar } from '../../hooks/useCalendar';
import { CalendarHeader } from './CalendarHeader';
import { CalendarLegend } from './CalendarLegend';
import { CalendarDay } from './CalendarDay';

export const DatePicker: React.FC<DatePickerProps> = ({
    date,
    onChange,
    label,
    blockedDates = [],
    variant = 'check-in',
    align = 'left',
    otherDate,
    icalFeeds = []
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use Custom Hook
    const { currentMonth, nextMonth, prevMonth, goToDate, days } = useCalendar(date);

    // Sync external date changes
    useEffect(() => {
        if (date) {
            goToDate(date);
        }
    }, [date, goToDate]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedDate = date ? parseISO(date) : undefined;
    const comparisonDate = otherDate ? parseISO(otherDate) : undefined;

    const handleSelect = (day: Date) => {
        if (!isBlocked(day, blockedDates, variant)) {
            onChange(format(day, 'yyyy-MM-dd'));
            setIsOpen(false);
        }
    };

    return (
        <div className="relative group" ref={containerRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 group-focus-within:text-orange-400">
                <CalendarIcon size={12} className="shrink-0" />
                <span>{label}</span>
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-xs md:text-sm font-bold text-white transition-all hover:bg-slate-800 focus:outline-none focus:border-orange-500/50 ${isOpen ? 'border-orange-500/50 ring-1 ring-orange-500/50' : ''}`}
            >
                {date ? format(parseISO(date), 'MMM dd, yyyy') : <span className="text-slate-600">Select Date</span>}
            </button>

            {isOpen && (
                <div className={`absolute top-full z-50 mt-2 p-4 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl animate-fade-in ${align === 'right' ? 'right-0' : 'left-0'} w-[300px]`}>

                    <CalendarHeader currentMonth={currentMonth} onNext={nextMonth} onPrev={prevMonth} />

                    <div className="grid grid-cols-7 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1">
                        {days.map((day) => {
                            const blocked = isBlocked(day, blockedDates, variant);
                            const meta = blocked ? getBlockMeta(day, blockedDates) : null;

                            return (
                                <CalendarDay
                                    key={day.toISOString()}
                                    day={day}
                                    currentMonth={currentMonth}
                                    selectedDate={selectedDate}
                                    comparisonDate={comparisonDate}
                                    blockedDates={blockedDates}
                                    variant={variant}
                                    onSelect={handleSelect}
                                    isBlocked={blocked}
                                    blockMeta={meta}
                                />
                            );
                        })}
                    </div>

                    <CalendarLegend feeds={icalFeeds} />
                </div>
            )}
        </div>
    );
};
