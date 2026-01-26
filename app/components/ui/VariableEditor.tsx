import React, { useRef, useImperativeHandle } from 'react';
import { VariableEditorRef } from '../../lib/types';

export const VariableEditor = React.forwardRef<VariableEditorRef, {
    value: string;
    onChange: (val: string) => void;
    className?: string
}>(({ value, onChange, className }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Expose insertion method to parent
    useImperativeHandle(ref, () => ({
        insert: (textToInsert: string) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);

            const newText = before + `{{${textToInsert}}}` + after;

            // Update value
            onChange(newText);

            // Restore focus and update cursor position (after React render cycle)
            const newCursorPos = start + textToInsert.length + 4; // {{ + }} + length
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        }
    }));

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`relative w-full rounded-2xl bg-black/20 border border-white/10 group focus-within:border-orange-500/50 transition-colors overflow-hidden flex flex-col ${className}`} style={{ minHeight: '600px' }}>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                className="w-full flex-1 bg-transparent text-white caret-white outline-none resize-none p-5 font-mono text-base leading-relaxed placeholder-slate-600"
                placeholder="Type your message template here..."
                style={{
                    fontSize: '16px', // Crucial: Prevents iOS zoom on focus
                }}
            />
            {/* Simple Helper Text */}
            <div className="absolute bottom-3 right-5 text-[10px] text-slate-500 pointer-events-none bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                Use {'{{variable}}'} to insert dynamic data
            </div>
        </div>
    );
});
VariableEditor.displayName = 'VariableEditor';
