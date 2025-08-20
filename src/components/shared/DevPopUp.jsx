import React, { useState } from 'react'
import { Close, CodeSlash } from '../../../public/icons/Svg'
import { CodeOffSharp } from '@mui/icons-material'

export const DevPopUp = ({ message = 'Development mode' }) => {

    const [showMsg, setShowMsg] = useState(true)

    return (
        <div className="p-4 pb-0">
            <div className={`p-3 bg-red-300 dark:bg-red-500/50 border border-red-500 dark:border-red-400/30 
                font-medium rounded-lg flex justify-between gap-2 relative overflow-hidden ${showMsg ? 'block' : 'hidden'}`
            }>
                <div className="absolute">
                    <CodeOffSharp className="-rotate-12 !h-24 !w-24 -mt-10 text-red-500/30 dark:text-red-400/30 " />
                </div>
                <div className="flex flex-grow justify-center gap-2">
                    <CodeSlash color={"#FFFFFF"} />
                    <span>{message}</span>                    
                </div>
                <button onClick={() => setShowMsg(!showMsg)}>
                    <Close color="#FFFFFF" />
                </button>
            </div>
        </div>
    )
}
