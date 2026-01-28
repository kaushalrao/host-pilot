"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Home, Edit3, Trash2, Plus, LogOut, Users, CreditCard, Clock, Wifi, MessageCircle, Sparkles, X, Copy, Check, Calendar as CalendarIcon } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Property, Template } from '../lib/types';
import { DEFAULT_PROPERTY_TIMES, DEFAULT_PROPERTY_VALUES } from '../lib/constants';
import { app, db, appId } from '../lib/firebase';
import { AVAILABLE_ICONS } from '../lib/constants';
import { getIconForTemplate } from '../lib/utils';
import { TabControl } from '../components/TabControl';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { VariableEditor } from '../components/ui/VariableEditor';
import { VariableEditorRef } from '../lib/types';
import { VariableList } from '../components/VariableList';
import { useApp } from '../components/providers/AppProvider';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const { properties, templates, showToast, user } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'properties' | 'templates'>('properties');
    const [editingProp, setEditingProp] = useState<Partial<Property> | null>(null);
    const [editingTemp, setEditingTemp] = useState<Partial<Template> | null>(null);
    const editorRef = useRef<VariableEditorRef>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    // Redirect if not logged in (handled by layout/provider ideally, but safe check here)
    React.useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) return null;

    const saveToFirestore = async (collectionName: string, data: any, id?: string) => {
        if (!app) {
            showToast("Firebase not initialized", "error");
            return false;
        }
        try {
            const path = `artifacts/${appId}/users/${user.uid}/${collectionName}`;
            if (id) {
                await updateDoc(doc(db, path, id), data);
            } else {
                await addDoc(collection(db, path), data);
            }
            return true;
        } catch (e) {
            console.error(e);
            showToast("Error saving data", "error");
            return false;
        }
    };

    const deleteFromFirestore = async (collectionName: string, id: string) => {
        if (!app) return false;
        try {
            const path = `artifacts/${appId}/users/${user.uid}/${collectionName}`;
            await deleteDoc(doc(db, path, id));
            return true;
        } catch (e) {
            console.error(e);
            showToast("Error deleting data", "error");
            return false;
        }
    };

    const handleSaveProperty = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingProp) return;
        const formData = new FormData(e.currentTarget);
        const newProp = {
            name: formData.get('name') as string,
            hostName: formData.get('hostName') as string,
            coHostName: formData.get('coHostName') as string,
            contactPrimary: formData.get('contactPrimary') as string,
            contactSecondary: formData.get('contactSecondary') as string,
            checkInTime: formData.get('checkInTime') as string,
            checkOutTime: formData.get('checkOutTime') as string,
            wifiName: formData.get('wifiName') as string,
            wifiPass: formData.get('wifiPass') as string,
            locationLink: formData.get('locationLink') as string,
            propertyLink: formData.get('propertyLink') as string,
            airbnbIcalUrl: formData.get('airbnbIcalUrl') as string,
            basePrice: Number(formData.get('basePrice')) || DEFAULT_PROPERTY_VALUES.basePrice,
            extraGuestPrice: Number(formData.get('extraGuestPrice')) || DEFAULT_PROPERTY_VALUES.extraGuestPrice,
            baseGuests: Number(formData.get('baseGuests')) || DEFAULT_PROPERTY_VALUES.baseGuests,
            icalFeeds: editingProp.icalFeeds || [],
        };

        const success = await saveToFirestore('properties', newProp, editingProp.id);
        if (success) {
            setEditingProp(null);
            showToast('Property saved successfully!', 'success');
        }
    };

    const handleDeleteProperty = async (id: string) => {
        if (confirm('Delete this property?')) {
            const success = await deleteFromFirestore('properties', id);
            if (success) showToast('Property deleted', 'success');
        }
    };

    const handleSaveTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingTemp) return;
        const formData = new FormData(e.currentTarget);

        const label = formData.get('label') as string;
        const newTemp = {
            label: label,
            content: editingTemp.content || '',
            icon: getIconForTemplate(label)
        };

        const success = await saveToFirestore('templates', newTemp, editingTemp.id);
        if (success) {
            setEditingTemp(null);
            showToast('Template saved successfully!', 'success');
        }
    };

    const handleDeleteTemplate = async (id: string) => {
        if (confirm('Delete this template?')) {
            const success = await deleteFromFirestore('templates', id);
            if (success) showToast('Template deleted', 'success');
        }
    };

    const insertVariable = (tag: string) => {
        if (editorRef.current) {
            editorRef.current.insert(tag);
            setIsDrawerOpen(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8 max-w-5xl mx-auto w-full pb-20 relative">
            <div className="sticky top-[72px] z-40 bg-[#0f172a]/95 backdrop-blur-xl w-[calc(100%+2rem)] -mx-4 px-4 py-3 border-b border-white/5 lg:static lg:bg-transparent lg:border-none lg:w-auto lg:mx-0 lg:p-0 flex justify-center transition-all mb-8 lg:mb-8 -mt-4 pt-4 lg:mt-0 lg:pt-0">
                <TabControl
                    options={[
                        { id: 'properties', label: 'Properties' },
                        { id: 'templates', label: 'Templates' }
                    ]}
                    activeId={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            {
                activeTab === 'properties' && (
                    <div className="space-y-4">
                        {!editingProp ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {properties.length === 0 ? (
                                    <div className="col-span-full text-center py-20 text-slate-500">
                                        <Home size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No properties found. Add your first property!</p>
                                    </div>
                                ) : properties.map(p => (
                                    <div key={p.id} className="relative bg-slate-800/30 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-xl flex flex-col justify-between group min-h-[220px] hover:bg-slate-800/50 transition-all overflow-hidden ring-1 ring-white/5 hover:ring-white/10 hover:scale-[1.02] hover:-translate-y-1">
                                        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
                                        <div className="relative z-10 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-300 border border-indigo-500/10"><Home size={24} /></div>
                                                <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-wider backdrop-blur-md border border-white/5">{p.baseGuests} Guests</div>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-white text-xl tracking-tight leading-tight mb-1">{p.name}</h3>
                                                <p className="text-sm text-slate-400 font-medium">₹ {p.basePrice}/night</p>
                                            </div>

                                            <div className="space-y-2 pt-2 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Clock size={12} className="text-indigo-400" />
                                                    <span>{p.checkInTime || '13:00'} - {p.checkOutTime || '11:00'}</span>
                                                </div>
                                                {p.hostName && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <Users size={12} className="text-rose-400" />
                                                        <span className="truncate">{p.hostName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-6 mt-auto relative z-10">
                                            <Button variant="secondary" className="flex-1 !py-2.5 text-sm rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:text-white" onClick={() => setEditingProp(p)}><Edit3 size={16} /> Edit</Button>
                                            <Button variant="danger" className="!p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-transparent" onClick={() => handleDeleteProperty(p.id)}><Trash2 size={18} /></Button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => setEditingProp({})} className="flex flex-col items-center justify-center min-h-[180px] rounded-[2rem] border-2 border-dashed border-slate-700/50 text-slate-500 hover:text-indigo-300 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all gap-3 group relative overflow-hidden">
                                    <div className="p-4 rounded-full bg-slate-800 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-indigo-500/40"><Plus size={24} /></div>
                                    <span className="font-bold text-sm tracking-wide">Add New Property</span>
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSaveProperty} className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 max-w-4xl mx-auto animate-fade-in shadow-2xl ring-1 ring-white/5">
                                <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                                    <h3 className="text-2xl font-bold text-white mb-1">{editingProp.id ? 'Edit Property' : 'Add Property'}</h3>
                                    <button type="button" onClick={() => setEditingProp(null)} className="p-3 bg-slate-700/50 rounded-full text-slate-400 hover:text-white"><LogOut size={20} className="rotate-180" /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="md:col-span-2 space-y-4">
                                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Home size={14} /> General</h4>
                                        <Input name="name" label="Property Name" defaultValue={editingProp.name} required />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2 mt-4 flex items-center gap-2"><Users size={14} /> Host</h4>
                                        <Input name="hostName" label="Host Name" defaultValue={editingProp.hostName} />
                                        <Input name="contactPrimary" label="Host Phone" defaultValue={editingProp.contactPrimary} />
                                        <Input name="coHostName" label="Co-Host Name" defaultValue={editingProp.coHostName} />
                                        <Input name="contactSecondary" label="Co-Host Phone" defaultValue={editingProp.contactSecondary} />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 mt-4 flex items-center gap-2"><CreditCard size={14} /> Pricing</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input name="basePrice" type="number" label="Base Price" defaultValue={editingProp.basePrice} />
                                            <Input name="baseGuests" type="number" label="Base Guests" defaultValue={editingProp.baseGuests} />
                                        </div>
                                        <Input name="extraGuestPrice" type="number" label="Extra Guest Price" defaultValue={editingProp.extraGuestPrice} />
                                    </div>
                                    <div className="md:col-span-2 h-px bg-white/5 my-4"></div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Clock size={14} /> Timings</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input name="checkInTime" label="Check-in" defaultValue={editingProp.checkInTime || DEFAULT_PROPERTY_TIMES.checkIn} />
                                            <Input name="checkOutTime" label="Check-out" defaultValue={editingProp.checkOutTime || DEFAULT_PROPERTY_TIMES.checkOut} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Wifi size={14} /> Connectivity</h4>
                                        <Input name="wifiName" label="WiFi Name" defaultValue={editingProp.wifiName} />
                                        <Input name="wifiPass" label="WiFi Password" defaultValue={editingProp.wifiPass} />
                                        <Input name="locationLink" label="Maps Link" defaultValue={editingProp.locationLink} placeholder="https://maps..." />
                                        <Input name="propertyLink" label="Website Link" defaultValue={editingProp.propertyLink} placeholder="https://website..." />

                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                                    <CalendarIcon size={14} /> External Calendars
                                                </h4>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newFeed = { id: Date.now().toString(), name: '', url: '', color: '#3b82f6' };
                                                        setEditingProp(prev => prev ? ({ ...prev, icalFeeds: [...(prev.icalFeeds || []), newFeed] }) : null);
                                                    }}
                                                    className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-lg hover:bg-indigo-500/20 transition-all flex items-center gap-1"
                                                >
                                                    <Plus size={12} /> Add Calendar
                                                </button>
                                            </div>

                                            {(!editingProp.icalFeeds || editingProp.icalFeeds.length === 0) && !editingProp.airbnbIcalUrl && (
                                                <div className="text-sm text-slate-500 italic px-4 py-2 border border-white/5 bg-white/5 rounded-xl text-center">
                                                    No external calendars linked.
                                                </div>
                                            )}

                                            {editingProp.icalFeeds?.map((feed, index) => (
                                                <div key={feed.id} className="flex gap-2 items-start bg-slate-900/50 p-3 rounded-xl border border-white/10 group animate-fade-in relative">
                                                    <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: feed.color }}></div>
                                                    <div className="flex-1 space-y-2">
                                                        <input
                                                            value={feed.name}
                                                            onChange={(e) => {
                                                                const newFeeds = [...(editingProp.icalFeeds || [])];
                                                                newFeeds[index] = { ...newFeeds[index], name: e.target.value };
                                                                setEditingProp(prev => prev ? ({ ...prev, icalFeeds: newFeeds }) : null);
                                                            }}
                                                            placeholder="Calendar Name (e.g. Booking.com)"
                                                            className="w-full bg-transparent text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none"
                                                        />
                                                        <input
                                                            value={feed.url}
                                                            onChange={(e) => {
                                                                const newFeeds = [...(editingProp.icalFeeds || [])];
                                                                newFeeds[index] = { ...newFeeds[index], url: e.target.value };
                                                                setEditingProp(prev => prev ? ({ ...prev, icalFeeds: newFeeds }) : null);
                                                            }}
                                                            placeholder="https://..."
                                                            className="w-full bg-transparent text-xs text-slate-400 focus:text-white placeholder:text-slate-700 focus:outline-none font-mono"
                                                        />
                                                        {/* Color Picker (Simple Presets) */}
                                                        <div className="flex gap-1.5 pt-1">
                                                            {['#FF5A5F', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(c => (
                                                                <button
                                                                    key={c}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newFeeds = [...(editingProp.icalFeeds || [])];
                                                                        newFeeds[index] = { ...newFeeds[index], color: c };
                                                                        setEditingProp(prev => prev ? ({ ...prev, icalFeeds: newFeeds }) : null);
                                                                    }}
                                                                    className={`w-4 h-4 rounded-full transition-all ${feed.color === c ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100 hover:scale-110'}`}
                                                                    style={{ backgroundColor: c }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newFeeds = editingProp.icalFeeds?.filter((_, i) => i !== index);
                                                            setEditingProp(prev => prev ? ({ ...prev, icalFeeds: newFeeds }) : null);
                                                        }}
                                                        className="p-1.5 text-slate-600 hover:text-white hover:bg-white/10 rounded-lg transition-colors absolute top-2 right-2"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {editingProp.id && (
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                                    Export Calendar (2-Way Sync)
                                                </label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={`${origin}/api/public/calendar?uid=${user.uid}&propertyId=${editingProp.id}`}
                                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-4 pr-4 text-sm text-slate-400 focus:outline-none cursor-not-allowed select-all"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        className="px-4 rounded-xl"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(`${origin}/api/public/calendar?uid=${user.uid}&propertyId=${editingProp.id}`);
                                                            showToast("Export URL copied!", "success");
                                                        }}
                                                    >
                                                        <Copy size={18} />
                                                    </Button>
                                                </div>
                                                <p className="text-[10px] text-slate-500 ml-1">Paste this URL into Airbnb&apos;s &quot;Import Calendar&quot; to prevent double bookings.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-8 mt-4 border-t border-white/5">
                                    <Button type="button" variant="secondary" className="flex-1 py-4 rounded-2xl" onClick={() => setEditingProp(null)}>Cancel</Button>
                                    <Button type="submit" className="flex-1 py-4 rounded-2xl">Save Changes</Button>
                                </div>
                            </form>
                        )}
                    </div>
                )
            }

            {
                activeTab === 'templates' && (
                    <div className="space-y-4">
                        {!editingTemp ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.length === 0 ? (
                                    <div className="col-span-full text-center py-20 text-slate-500">
                                        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No templates found. Create your first template!</p>
                                    </div>
                                ) : templates.map(t => (
                                    <div key={t.id} className="relative bg-slate-800/30 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-xl flex flex-col justify-between group min-h-[160px] hover:bg-slate-800/50 transition-all overflow-hidden ring-1 ring-white/5 hover:ring-white/10 hover:scale-[1.02] hover:-translate-y-1">
                                        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                                                    {React.createElement(AVAILABLE_ICONS[t.icon] || MessageCircle, { size: 24, className: "text-slate-300" })}
                                                </div>
                                                <h3 className="font-bold text-white text-lg tracking-tight">{t.label}</h3>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-6 mt-auto relative z-10">
                                            <Button variant="secondary" className="flex-1 !py-2.5 text-sm rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:text-white" onClick={() => setEditingTemp(t)}><Edit3 size={16} /> Edit</Button>
                                            <Button variant="danger" className="!p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-transparent" onClick={() => handleDeleteTemplate(t.id)}><Trash2 size={18} /></Button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => setEditingTemp({})} className="flex flex-col items-center justify-center min-h-[160px] rounded-[2rem] border-2 border-dashed border-slate-700/50 text-slate-500 hover:text-indigo-300 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all gap-3 group relative overflow-hidden">
                                    <div className="p-4 rounded-full bg-slate-800 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-indigo-500/40"><Plus size={24} /></div>
                                    <span className="font-bold text-sm tracking-wide">Create Template</span>
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSaveTemplate} className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 max-w-4xl mx-auto animate-fade-in shadow-2xl relative ring-1 ring-white/5">
                                <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                                    <h3 className="text-2xl font-bold text-white mb-1">{editingTemp.id ? 'Edit Template' : 'New Template'}</h3>
                                    <button type="button" onClick={() => setEditingTemp(null)} className="p-3 bg-slate-700/50 rounded-full text-slate-400 hover:text-white"><LogOut size={20} className="rotate-180" /></button>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
                                    <div className="lg:col-span-2 space-y-6">
                                        <Input name="label" label="Template Name" icon={<MessageCircle size={12} />} defaultValue={editingTemp.label} required />
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end mb-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Edit3 size={12} /> Content</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsDrawerOpen(true)}
                                                    className="lg:hidden text-orange-400 text-xs font-bold flex items-center gap-1"
                                                >
                                                    <Sparkles size={12} /> Insert Variable
                                                </button>
                                            </div>

                                            <VariableEditor
                                                ref={editorRef}
                                                value={editingTemp.content || ''}
                                                onChange={(newContent) => setEditingTemp(prev => ({ ...prev!, content: newContent }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex bg-slate-900/30 rounded-3xl border border-white/5 sticky top-8 h-fit max-h-[600px] flex-col shadow-xl">
                                        <div className="bg-slate-900/95 backdrop-blur-xl z-10 px-6 py-4 border-b border-white/5 rounded-t-3xl shrink-0">
                                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                                <Sparkles size={14} className="text-orange-400" /> Click to Insert
                                            </h4>
                                        </div>

                                        <div className="p-6 overflow-y-auto custom-scrollbar">
                                            <VariableList onInsert={insertVariable} />
                                        </div>
                                    </div>

                                    {isDrawerOpen && (
                                        <div className="fixed inset-0 z-[100] lg:hidden">
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
                                            <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-white/10 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto animate-slide-up shadow-2xl">
                                                <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-900 z-10 pb-2 border-b border-white/5">
                                                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Sparkles size={18} className="text-orange-400" /> Insert Variable</h3>
                                                    <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-2 bg-slate-800 rounded-full text-slate-400"><X size={20} /></button>
                                                </div>
                                                <VariableList onInsert={(tag) => {
                                                    insertVariable(tag);
                                                    setIsDrawerOpen(false);
                                                }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4 pt-8 mt-4 border-t border-white/5">
                                    <Button type="button" variant="secondary" className="flex-1 py-4 rounded-2xl" onClick={() => setEditingTemp(null)}>Cancel</Button>
                                    <Button type="submit" className="flex-1 py-4 rounded-2xl">Save Template</Button>
                                </div>

                                <div className="lg:hidden fixed bottom-6 right-6 z-50">
                                    <button
                                        type="button"
                                        onClick={() => setIsDrawerOpen(true)}
                                        className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-xl shadow-orange-500/30 flex items-center justify-center active:scale-90 transition-all hover:scale-105 border border-white/10"
                                    >
                                        <Sparkles size={24} fill="white" />
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>
                )
            }
        </div >
    );
}
