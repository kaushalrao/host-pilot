import React from 'react';
import { DatePickerProps } from './types';

export const CalendarLegend: React.FC<{ feeds: DatePickerProps['icalFeeds'] }> = ({ feeds = [] }) => (
    <div className="mt-3 pt-3 border-t border-white/5 flex gap-4 justify-center flex-wrap">
        <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Host Pilot</span>
        </div>
        {feeds.map(feed => (
            <div key={feed.id} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: feed.color }}></div>
                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{feed.name}</span>
            </div>
        ))}
    </div>
);
