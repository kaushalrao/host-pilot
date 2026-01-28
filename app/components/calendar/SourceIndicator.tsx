import React from 'react';

export const SourceIndicator: React.FC<{ source?: string | null, color?: string }> = ({ source, color }) => {
    const bg = color || '#475569';
    return (
        <div className="absolute bottom-1 w-full flex justify-center">
            <div
                className="h-0.5 w-3 rounded-full"
                style={{ backgroundColor: bg }}
                title={source || 'Blocked'}
            ></div>
        </div>
    );
};
