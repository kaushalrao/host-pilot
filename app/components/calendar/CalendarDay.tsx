import React from 'react';
import { format, isSameMonth, isSameDay, isToday, isBefore, isAfter } from 'date-fns';
import { isTurnoverDate } from './utils';
import { CalendarDayProps } from './types';
import { SourceIndicator } from './SourceIndicator';

export const CalendarDay: React.FC<CalendarDayProps> = ({
    day,
    currentMonth,
    selectedDate,
    comparisonDate,
    blockedDates,
    variant,
    onSelect,
    isBlocked,
    blockMeta
}) => {
    // 1. Math / State Logic
    const dayStr = format(day, 'yyyy-MM-dd');
    const isCurrent = isSameMonth(day, currentMonth);
    const isToDay = isToday(day);
    const isTurnover = isTurnoverDate(dayStr, blockedDates, variant);

    const isSelected = !!selectedDate && isSameDay(day, selectedDate);
    const isComp = !!comparisonDate && isSameDay(day, comparisonDate);

    // Range Logic
    let inRange = false;
    let isRangeStart = false;
    let isRangeEnd = false;

    if (selectedDate && comparisonDate) {
        // Ensure start is always before end
        const start = isBefore(selectedDate, comparisonDate) ? selectedDate : comparisonDate;
        const end = isAfter(selectedDate, comparisonDate) ? selectedDate : comparisonDate;

        inRange = isAfter(day, start) && isBefore(day, end);
        isRangeStart = isSameDay(day, start);
        isRangeEnd = isSameDay(day, end);
    }

    // 2. Style Logic (Declarative & Priority Based)
    const getStyles = () => {
        if (!isCurrent) return 'invisible';

        const base = 'h-9 w-full flex items-center justify-center text-xs transition-all relative rounded-lg';

        // HIGH PRIORITY: Selection endpoints
        if (isSelected || isComp) {
            return `${base} !bg-orange-600 !text-white font-bold shadow-lg z-10`;
        }

        // BLOCKED
        if (isBlocked) {
            return `${base} text-slate-700 cursor-not-allowed`;
        }

        // RANGE (Middle)
        if (inRange) {
            return `${base} bg-orange-500/20 text-white rounded-none`;
        }

        // RANGE (Endpoints Connections)
        if (isRangeStart && comparisonDate) return `${base} bg-orange-500/20 text-white rounded-l-lg rounded-r-none`;
        if (isRangeEnd && comparisonDate) return `${base} bg-orange-500/20 text-white rounded-l-none rounded-r-lg`;

        // TURNOVER (Half-blocked visually if needed, but here simple text)
        if (isTurnover) {
            return `${base} text-slate-500 font-medium`;
        }

        // DEFAULT
        return `${base} text-white hover:bg-slate-800`;
    };

    const className = getStyles();
    const showDot = isToDay && !isSelected && !isComp && !isBlocked && !inRange;

    // 3. Render
    return (
        <button
            type="button"
            onClick={() => onSelect(day)}
            disabled={isBlocked && !isSelected && !isComp}
            className={className.trim().replace(/\s+/g, ' ')}
        >
            <span className="relative z-10">{format(day, 'd')}</span>

            {showDot && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
            )}

            {isBlocked && (
                <SourceIndicator source={blockMeta?.source} color={blockMeta?.color} />
            )}
        </button>
    );
};
