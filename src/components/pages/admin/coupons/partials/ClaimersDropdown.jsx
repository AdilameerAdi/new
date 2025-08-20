import React from 'react'
import { useTranslation } from 'react-i18next';

export const ClaimersDropdown = ({ data }) => {

    const { t } = useTranslation();

    if(data.length > 0)

        return (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 max-h-40 overflow-auto">
                {
                    data?.map((claimer, index) => (
                        <div className="flex gap-4 items-center p-2 rounded-full border dark:border-admin-dark-700" key={index}>
                            <img src={`/img/profile/user/${claimer.AccountWeb?.ProfilePic}.png`} alt={claimer.Name} className="w-10"/>
                            <div className="w-full flex flex-col justify-center items-center">
                                <h3 className="text-lg font-medium">{claimer.Name}</h3>
                            </div>
                        </div>
                    ))
                }
            </div>
        )

    return (
        <div className="p-4 flex justify-center items-center">
            <h1 className="font-medium text-xl">{t("No results found")}</h1>                        
        </div>
    )
}
