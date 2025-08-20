import React from 'react'

export const TicketSeparator = ({ className }) => {
    return (
        <div className={`flex justify-between gap-1 ${className}`}>
            <div className="w-3 h-6 rounded-r-full bg-transparent border border-l-0 dark:border-black border-black/20" />
            <div className="flex flex-col justify-center w-full">
                <div className="border-t border-dashed dark:border-black border-black/20" />
            </div>
            <div className="w-3 h-6 rounded-l-full bg-transparent border border-r-0 dark:border-black border-black/20" />
        </div>
    )
}
