import React from 'react';
import { Calendar, Users, Phone, Trash2, ArrowRight, Home } from 'lucide-react';
import { GuestCardProps } from '../../lib/types';
import { formatDate, formatCurrency, getPropertyColorKey, getStatusColor } from '../../lib/utils';
import { COLOR_VARIANTS } from '../../lib/constants';

export const GuestCard: React.FC<GuestCardProps> = ({ guest, mode, onSelect, onDelete }) => {
    const propertyName = guest.propName || '';
    const colorKey = getPropertyColorKey(propertyName);
    const styles = COLOR_VARIANTS[colorKey];

    return (
        <div
            onClick={() => onSelect && onSelect(guest)}
            className={`
                group relative bg-slate-800/40 border border-white/5 rounded-2xl p-4 transition-all hover:bg-slate-800/60 hover:border-white/10
                ${onSelect ? 'cursor-pointer hover:scale-[1.02] active:scale-95 hover:z-10' : ''}
                ${mode === 'page' ? 'flex flex-col justify-between min-h-[160px]' : ''}
            `}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-lg border border-indigo-500/10">
                        {guest.guestName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="text-white font-bold leading-tight">{guest.guestName}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(guest.status)}`}></span>
                            {guest.status}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {guest.phoneNumber && (
                        <a
                            href={`tel:${guest.phoneNumber}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-slate-600 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center"
                            title={`Call ${guest.guestName}`}
                        >
                            <Phone size={16} />
                        </a>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => onDelete(e, guest.id)}
                            className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                            title="Delete Guest"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/20 p-2 rounded-lg">
                    <Calendar size={12} className="text-orange-400 shrink-0" />
                    <span>
                        {formatDate(guest.checkInDate)} - {formatDate(guest.checkOutDate)}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 px-1">
                    <span className="flex items-center gap-1"><Users size={12} /> {guest.numberOfGuests} Guests</span>
                    {guest.phoneNumber && <span className="flex items-center gap-1"><Phone size={12} /> {guest.phoneNumber}</span>}
                </div>
            </div>

            {mode === 'picker' && (
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-indigo-500 text-white p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
                        <ArrowRight size={14} />
                    </div>
                </div>
            )}

            {/* Financials & Property - Page Mode */}
            {mode === 'page' && (
                <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Total</p>
                            <p className="text-white font-mono font-medium">{guest.totalAmount ? formatCurrency(guest.totalAmount) : '-'}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Balance</p>
                            <p className="text-orange-400 font-mono font-medium">
                                {guest.totalAmount ? formatCurrency(Math.max(0, guest.totalAmount - guest.advancePaid)) : '-'}
                            </p>
                        </div>
                    </div>

                    {propertyName && (
                        <div className="flex justify-between items-center">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${styles.bg} ${styles.border} ${styles.text}`}>
                                <Home size={10} className={styles.icon} />
                                {propertyName}
                            </div>

                            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-x-4 md:group-hover:translate-x-0">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Property Chip - Picker Mode */}
            {mode !== 'page' && propertyName && (
                <div className="mt-3 border-t border-white/5 pt-3 flex justify-start">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${styles.bg} ${styles.border} ${styles.text}`}>
                        <Home size={10} className={styles.icon} />
                        {propertyName}
                    </div>
                </div>
            )}
        </div>
    );
};
