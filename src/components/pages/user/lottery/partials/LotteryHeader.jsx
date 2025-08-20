import React from 'react'
import { Coin } from '../../../../../../public/icons/Svg'
import { useTranslation } from 'react-i18next';

export const LotteryHeader = ({ price, userNumbers, numbers }) => {

    const { t } = useTranslation();

    return (
        <header className="flex flex-wrap items-center font-medium text-xl gap-4 uppercase justify-between p-4 
            rounded-t-lg border border-b-0 border-black/20 dark:border-black">
            <div className="flex items-center gap-1">
                <span>{t("Price")}: {price}</span>
                <Coin color="#FFD700"/>                            
            </div>
            <span>{t("Buyed numbers")}: {userNumbers.length}/{numbers.length}</span>                     
        </header>
    )
}
