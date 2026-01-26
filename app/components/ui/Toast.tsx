import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ToastState } from '../../lib/types';

export const Toast: React.FC<{ toast: ToastState; onClose: () => void }> = ({ toast, onClose }) => (
    <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 transform ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${toast.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-200' : 'bg-red-500/20 border border-red-500/30 text-red-200'}`}
    >
        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        <span className="font-bold text-sm">{toast.message}</span>
    </div>
);
