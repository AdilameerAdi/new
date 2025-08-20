import React from 'react'

export const TicketCard = ({ children, className }) => {
    return (
        <div className="flex flex-col p-2">
            <div className="flex justify-between">
                <div className={`w-3 h-3 rounded-br-full border border-l-0 border-t-0 border-black/20 dark:border-gray-500`} />
                <div className={`border-t w-full border-black/20 dark:border-gray-500`} />
                <div className={`w-3 h-3 rounded-bl-full border border-r-0 border-t-0 border-black/20 dark:border-gray-500`} />
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <div className={`h-4 border-l border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-r-full border border-l-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-l border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-r-full border border-l-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-l border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-r-full border border-l-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-l border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-r-full border border-l-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-l border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-r-full border border-l-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-l border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-r-full border border-l-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-l border-black/20 dark:border-gray-500`} />
                </div>
                <div className={`p-3 ${className}`}>{children}</div>
                <div className="flex flex-col">
                    <div className={`h-4 border-r border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-l-full border border-r-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-r border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-l-full border border-r-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-r border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-l-full border border-r-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-r border-black/20 dark:border-gray-500`}/>
                    <div className={`w-3 h-6 rounded-l-full border border-r-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-r border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-l-full border border-r-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-r border-black/20 dark:border-gray-500`} />
                    <div className={`w-3 h-6 rounded-l-full border border-r-0 border-black/20 dark:border-gray-500`} />
                    <div className={`h-4 border-r border-black/20 dark:border-gray-500`} />
                </div>
            </div>
            <div className="flex justify-between">
                <div className={`w-3 h-3 rounded-tr-full border border-l-0 border-b-0 border-black/20 dark:border-gray-500`} />
                <div className={`border-b w-full border-black/20 dark:border-gray-500`} />
                <div className={`w-3 h-3 rounded-tl-full border border-r-0 border-b-0 border-black/20 dark:border-gray-500`} />
            </div>
        </div>
    )
}
