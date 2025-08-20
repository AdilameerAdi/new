import React from 'react'
import { useTranslation } from 'react-i18next';

export const Menu = ({ className = "", option, setOption }) => {

    const { t } = useTranslation();

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <button type="button" onClick={() => setOption(1)}
                className={`${option === 1 ? 'bg-custom-light-600 dark:bg-custom-dark-600' : 
                'bg-custom-light-700 dark:bg-custom-dark-700'} w-full block p-2 rounded-lg border border-black/10 dark:border-black`}>
                {t("General")}
            </button>
            <button type="button" onClick={() => setOption(2)} 
                className={`${option === 2 ? 'bg-custom-light-600 dark:bg-custom-dark-600' : 
                'bg-custom-light-700 dark:bg-custom-dark-700'} w-full block p-2 rounded-lg border border-black/10 dark:border-black`}>
                {t("Security")}
            </button>
        </div>
    )
}
