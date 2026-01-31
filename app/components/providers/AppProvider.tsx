"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';

import { auth } from '../../lib/firebase';
import { dataService } from '../../services';
import { Property, Template, ToastState, MaintenanceIssue } from '../../lib/types';
import { Toast } from '../ui/Toast';

interface AppContextType {
    user: User | null;
    loading: boolean;
    properties: Property[];
    templates: Template[];
    issues: MaintenanceIssue[];
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const AppContext = createContext<AppContextType>({
    user: null,
    loading: true,
    properties: [],
    templates: [],
    issues: [],
    showToast: () => { },
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState<Property[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [issues, setIssues] = useState<MaintenanceIssue[]>([]);
    const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });

    const showToast = React.useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }, []);

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Data Fetching
    useEffect(() => {
        if (!user) {
            setProperties([]);
            setTemplates([]);
            setIssues([]);
            return;
        }

        const unsubProps = dataService.properties.subscribe(user.uid, (props) => {
            setProperties(props);
        }, (err) => console.error("Error fetching properties", err));

        const unsubTemps = dataService.templates.subscribe(user.uid, (temps) => {
            setTemplates(temps);
        }, (err) => console.error("Error fetching templates", err));

        const unsubIssues = dataService.maintenance.subscribe(user.uid, (issues) => {
            setIssues(issues);
        }, (err) => console.error("Error fetching issues", err));

        return () => {
            unsubProps();
            unsubTemps();
            unsubIssues();
        };
    }, [user]);

    return (
        <AppContext.Provider value={{ user, loading, properties, templates, issues, showToast }}>
            {children}
            <Toast toast={toast} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
        </AppContext.Provider>
    );
};
