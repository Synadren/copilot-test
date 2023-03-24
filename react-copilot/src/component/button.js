import React, { useCallback } from 'react';

export const Button = ({ children, className, onClick, color, shape, icon }) => {
    const handleClick = useCallback(() => onClick(), [onClick]);
    const colors = () => <div className='bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full'></div>
    return <button
        className={`rounded${shape === 'round' ? '-full' : ''} cursor-pointer 
        p-2 my-1 transition uppercase text-xs bg-${color ?? 'teal'}-100 
        hover:bg-${color ?? 'teal'}-200 font-bold text-${color ?? 'teal'}-900 
        flex items-center gap-2 ${className}`}
        onClick={handleClick}
    >
        {icon}
        {children}
    </button>;
}
