import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Guest, GuestDirectoryProps } from '../../lib/types';
import { format, addMonths, subMonths } from 'date-fns';
import { app, appId } from '../../lib/firebase';
import { dataService } from '../../services';
import { useApp } from '../providers/AppProvider';
import { GuestCard } from './GuestCard';
import { GuestFilters } from './GuestFilters';

export const GuestDirectory: React.FC<GuestDirectoryProps> = ({ onSelect, mode = 'page', className = '' }) => {
    const { user, showToast } = useApp();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'upcoming' | 'past' | 'all'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !app) return;

        const unsubscribe = dataService.guests.subscribe(user.uid, (guestList) => {
            setGuests(guestList);
            setLoading(false);
        }, (error) => {
            console.error(error);
            showToast("Error loading guests", "error");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, showToast]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this guest?')) return;

        if (!user) return;
        try {
            await dataService.guests.delete(user.uid, id);
            showToast('Guest deleted', 'success');
        } catch (error) {
            console.error(error);
            showToast('Error deleting guest', 'error');
        }
    };

    const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));

    const handlePrevMonth = () => {
        const date = selectedMonth === 'all' ? new Date() : new Date(selectedMonth + '-01');
        setSelectedMonth(format(subMonths(date, 1), 'yyyy-MM'));
    };

    const handleNextMonth = () => {
        const date = selectedMonth === 'all' ? new Date() : new Date(selectedMonth + '-01');
        setSelectedMonth(format(addMonths(date, 1), 'yyyy-MM'));
    };

    const toggleAllMonths = () => {
        if (selectedMonth === 'all') {
            setSelectedMonth(format(new Date(), 'yyyy-MM'));
        } else {
            setSelectedMonth('all');
        }
    };


    const filteredGuests = guests.filter(g => {
        const matchesSearch = g.guestName.toLowerCase().includes(search.toLowerCase()) ||
            g.propName?.toLowerCase().includes(search.toLowerCase());

        let matchesStatus = true;
        if (statusFilter === 'upcoming') {
            matchesStatus = g.status === 'upcoming' || g.status === 'active';
        } else if (statusFilter === 'past') {
            matchesStatus = g.status === 'completed' || g.status === 'cancelled';
        }

        const matchesMonth = selectedMonth === 'all' || (g.checkInDate && g.checkInDate.startsWith(selectedMonth));

        return matchesSearch && matchesStatus && matchesMonth;
    }).sort((a, b) => {
        // Sorting Logic
        const dateA = new Date(a.checkInDate).getTime();
        const dateB = new Date(b.checkInDate).getTime();

        if (statusFilter === 'upcoming') {
            return dateA - dateB; // Ascending for upcoming (soonest first)
        } else if (statusFilter === 'past') {
            return dateB - dateA; // Descending for past (most recent first)
        } else {
            // For 'all', prioritize upcoming soonest, then past most recent
            return dateA - dateB;
        }
    });

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Header / Search */}
            <GuestFilters
                search={search}
                setSearch={setSearch}
                selectedMonth={selectedMonth}
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
                toggleAllMonths={toggleAllMonths}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                mode={mode}
            />

            {/* List */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar p-2 ${mode === 'page' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20' : 'space-y-3 pb-4'}`}>
                {loading ? (
                    <div className="text-center py-10 text-slate-500 col-span-full">Loading guests...</div>
                ) : filteredGuests.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 col-span-full flex flex-col items-center gap-2">
                        <Users size={32} className="opacity-20" />
                        <p>{search ? 'No guests found matching search.' : 'No guests saved yet.'}</p>
                    </div>
                ) : (
                    filteredGuests.map(guest => (
                        <GuestCard
                            key={guest.id}
                            guest={guest}
                            mode={mode}
                            onSelect={onSelect}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
