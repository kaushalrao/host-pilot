import React from 'react';
import { Users, Edit3, Calendar, CalendarCheck, Wallet } from 'lucide-react';
import { Card } from './ui/Card';
import { SectionHeader } from './ui/SectionHeader';
import { Input } from './ui/Input';

import { GuestDetails } from '../lib/types';

export const GuestForm: React.FC<{
    details: GuestDetails;
    onChange: (details: GuestDetails) => void;
    templateContent?: string;
}> = ({ details, onChange, templateContent = '' }) => {

    const update = (field: keyof GuestDetails, value: any) => {
        onChange({ ...details, [field]: value });
    };

    return (
        <Card className="!p-4 md:!p-8">
            <SectionHeader title="Guest Details" icon={<Users size={16} />} />
            <div className="space-y-4 md:space-y-6">
                <div className="relative group">
                    <input
                        value={details.guestName}
                        onChange={(e) => update('guestName', e.target.value)}
                        placeholder="Guest Name"
                        className="w-full px-4 py-3 md:px-5 md:py-4 pl-4 md:pl-5 text-base md:text-lg font-bold text-white bg-black/20 border border-white/5 rounded-2xl outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 focus:bg-black/30 placeholder:text-slate-600"
                    />
                    <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-400 transition-colors">
                        <Edit3 size={16} />
                    </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                    {(templateContent.includes('{{checkIn') || templateContent.includes('{{nights') || templateContent.includes('{{totalAmount')) && (
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div className="group bg-black/20 p-3 md:p-4 rounded-2xl border border-white/5 focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 group-focus-within:text-orange-400">
                                    <Calendar size={12} className="shrink-0" />
                                    <span>Check-in</span>
                                </label>
                                <input
                                    type="date"
                                    value={details.checkInDate}
                                    onChange={(e) => update('checkInDate', e.target.value)}
                                    className="w-full text-xs md:text-sm font-bold bg-transparent text-white outline-none [color-scheme:dark] min-h-[1.5rem]"
                                />
                            </div>
                            <div className="group bg-black/20 p-3 md:p-4 rounded-2xl border border-white/5 focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 group-focus-within:text-orange-400">
                                    <CalendarCheck size={12} className="shrink-0" />
                                    <span>Check-out</span>
                                </label>
                                <input
                                    type="date"
                                    value={details.checkOutDate}
                                    onChange={(e) => update('checkOutDate', e.target.value)}
                                    className="w-full text-xs md:text-sm font-bold bg-transparent text-white outline-none [color-scheme:dark] min-h-[1.5rem]"
                                />
                            </div>
                        </div>
                    )}

                    {(templateContent.includes('{{totalAmount') || templateContent.includes('{{balanceDue')) && (
                        <div className="grid grid-cols-2 gap-3 md:gap-4 animate-fade-in">
                            <Input
                                type="number"
                                min={1}
                                label="No. of Guests"
                                icon={<Users size={12} className="shrink-0" />}
                                value={details.numberOfGuests === 0 ? '' : details.numberOfGuests}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    update('numberOfGuests', isNaN(val) ? 0 : val);
                                }}
                                placeholder="Guests"
                                className="text-sm md:text-base font-bold bg-black/20"
                            />
                            <Input
                                type="number"
                                min={0}
                                label="Advance (₹)"
                                icon={<Wallet size={12} className="shrink-0" />}
                                value={details.advancePaid === 0 ? '' : details.advancePaid}
                                onChange={(e) => update('advancePaid', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="text-sm md:text-base font-bold bg-black/20"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
