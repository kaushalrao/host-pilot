import React from 'react';
import { CalendarCheck, Users, Edit3, Wallet } from 'lucide-react';
import { GuestDetails, GuestFormProps } from '../../lib/types';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { Input } from '../ui/Input';
import { DatePicker } from '../calendar/DatePicker';

export const GuestForm: React.FC<GuestFormProps> = ({ details, onChange, templateContent = '', blockedDates = [], onSaveGuest, onOpenDirectory, icalFeeds = [] }) => {

    const isDateBlocked = (dateStr: string, type: 'checkIn' | 'checkOut') => {
        if (!dateStr || blockedDates.length === 0) return false;
        // String comparison is safer for YYYY-MM-DD format to avoid timezone issues
        return blockedDates.some(range => {
            if (type === 'checkIn') {
                return dateStr >= range.start && dateStr < range.end;
            } else {
                // For check-out, it's blocked if it falls strictly after start and before-or-on end.
                // i.e. we cannot checkout if we stayed the night of 'start'.
                return dateStr > range.start && dateStr <= range.end;
            }
        });
    };

    const update = (field: keyof GuestDetails, value: any) => {
        if ((field === 'checkInDate' || field === 'checkOutDate')) {
            const type = field === 'checkInDate' ? 'checkIn' : 'checkOut';
            if (isDateBlocked(value, type)) {
                alert("This date is booked on Airbnb!");
                // return; // Optional: Force block, or just warn. Alert is strict enough.
            }
        }
        onChange({ ...details, [field]: value });
    };

    return (
        <Card className="!p-4 md:!p-8 relative">
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

                <div className="relative group animate-fade-in">
                    <input
                        value={details.phoneNumber || ''}
                        onChange={(e) => update('phoneNumber', e.target.value.replace(/[^0-9+\-\(\)\s]/g, ''))}
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 md:px-5 md:py-3.5 pl-4 md:pl-5 text-sm md:text-base font-medium text-white bg-black/20 border border-white/5 rounded-2xl outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 focus:bg-black/30 placeholder:text-slate-600"
                    />
                </div>

                <div className="space-y-3 md:space-y-4">
                    {(templateContent.includes('{{checkIn') || templateContent.includes('{{nights') || templateContent.includes('{{totalAmount')) && (
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div className="group bg-black/20 p-3 md:p-4 rounded-2xl border border-white/5 focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all">
                                <DatePicker
                                    label="Check-in"
                                    variant="check-in"
                                    date={details.checkInDate}
                                    otherDate={details.checkOutDate}
                                    onChange={(date) => update('checkInDate', date)}
                                    blockedDates={blockedDates}
                                    icalFeeds={icalFeeds}
                                />
                            </div>
                            <div className="group bg-black/20 p-3 md:p-4 rounded-2xl border border-white/5 focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all">
                                <DatePicker
                                    label="Check-out"
                                    variant="check-out"
                                    align="right"
                                    date={details.checkOutDate}
                                    otherDate={details.checkInDate}
                                    onChange={(date) => update('checkOutDate', date)}
                                    blockedDates={blockedDates}
                                    icalFeeds={icalFeeds}
                                />
                            </div>
                        </div>
                    )}

                    {(templateContent.includes('{{totalAmount') || templateContent.includes('{{balanceDue')) && (
                        <div className="grid grid-cols-1 gap-3 md:gap-4 animate-fade-in">
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
                        </div>
                    )}

                    {(templateContent.includes('{{totalAmount') || templateContent.includes('{{balanceDue')) && (
                        <div className="grid grid-cols-2 gap-3 md:gap-4 animate-fade-in">
                            <Input
                                type="number"
                                min={0}
                                label="Advance Paid"
                                icon={<Wallet size={12} className="shrink-0" />}
                                value={details.advancePaid === 0 ? '' : details.advancePaid}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    update('advancePaid', isNaN(val) ? 0 : val);
                                }}
                                placeholder="₹0"
                                className="text-sm md:text-base font-bold bg-black/20"
                            />
                            <Input
                                type="number"
                                min={0}
                                label="Discount"
                                labelClassName="!text-green-500 group-focus-within:!text-green-400"
                                icon={<Wallet size={12} className="shrink-0" />}
                                value={details.discount === 0 ? '' : details.discount}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    update('discount', isNaN(val) ? 0 : val);
                                }}
                                placeholder="₹0"
                                className="text-sm md:text-base font-bold bg-black/20"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        {onOpenDirectory && (
                            <button
                                type="button"
                                onClick={onOpenDirectory}
                                className="w-full h-[54px] bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 rounded-xl hover:text-white hover:from-slate-700 hover:to-slate-800 transition-all text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 shadow-lg active:scale-95 group"
                            >
                                <Users size={16} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" /> Directory
                            </button>
                        )}
                        {onSaveGuest && (() => {
                            const isPhoneValid = details.phoneNumber && details.phoneNumber.length >= 10 && /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(details.phoneNumber.replace(/\s/g, ''));
                            const isValid = details.guestName && isPhoneValid && details.checkInDate && details.checkOutDate && details.numberOfGuests > 0;
                            return (
                                <button
                                    type="button"
                                    onClick={onSaveGuest}
                                    disabled={!isValid}
                                    className={`w-full h-[54px] rounded-xl transition-all text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border active:scale-95 shadow-lg ${isValid
                                        ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white border-orange-400/20 hover:shadow-orange-500/25 hover:from-orange-400 hover:to-red-500'
                                        : 'bg-slate-800 text-slate-500 border-white/5 cursor-not-allowed opacity-50 shadow-none'
                                        }`}
                                >
                                    <CalendarCheck size={16} className={isValid ? "text-orange-100" : ""} /> Save Guest
                                </button>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </Card>
    );
};
