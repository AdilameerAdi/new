import React from 'react'

export const ShopHeader = ({ option, setOption }) => {
    return (
        <nav className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
                onClick={() => setOption(1)} 
                className={`${option === 1 ? 
                    'bg-admin-light-600 dark:bg-admin-dark-600' :
                    'bg-transparent border border-admin-light-600 dark:border-admin-dark-600 hover:bg-admin-light-600/50 hover:dark:bg-admin-dark-600/50'} 
                    p-3 font-medium`
                }
            >
                Web shop
            </button>
            <button 
                onClick={() => setOption(2)} 
                className={`${option === 2 ? 
                    'bg-admin-light-600 dark:bg-admin-dark-600' :
                    'bg-transparent border border-admin-light-600 dark:border-admin-dark-600 hover:bg-admin-light-600/50 hover:dark:bg-admin-dark-600/50'} 
                    p-3 font-medium`
                }
            >
                Daily shop
            </button>
            <button 
                onClick={() => setOption(3)} 
                className={`${option === 3 ? 
                    'bg-admin-light-600 dark:bg-admin-dark-600' :
                    'bg-transparent border border-admin-light-600 dark:border-admin-dark-600 hover:bg-admin-light-600/50 hover:dark:bg-admin-dark-600/50'} 
                    p-3 font-medium`
                }
            >
                Weekly shop
            </button>
        </nav>
    )
}
