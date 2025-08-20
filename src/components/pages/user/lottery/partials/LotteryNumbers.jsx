import { LotteryHeader } from './LotteryHeader';
import React from 'react'
import { TicketSeparator } from '../../../../elements/TicketSeparator';
import { useTranslation } from 'react-i18next';

export const LotteryNumbers = ({ numbers, userNumbers, price, selected, setSelected }) => {

    const { t } = useTranslation();

    const handleClick = (num) => {
        if (selected.includes(num)) {
            setSelected(selected.filter(item => item !== num));
        } else {
            setSelected([...selected, num]);
        }
    }
    
    return (
        <div className="flex flex-col">
            <LotteryHeader 
                price={price}
                numbers={numbers}
                userNumbers={userNumbers}
            />
            <TicketSeparator />
            <div className="flex flex-wrap gap-2 p-4 rounded-b-lg border border-t-0 border-black/20 dark:border-black shadow-md dark:shadow-zinc-900">
                {
                    numbers.map(num => (
                        <div className="text-center" key={num.number}>
                            {
                                num.available ?
                                    <button 
                                        className={`aspect-square rounded-full border-2 hover:bg-black/20 hover:dark:bg-black/60 w-[50px] font-medium 
                                        ${ selected.includes(num.number) ? "border-green-400 bg-green-400/10" : "border-black/20 dark:border-black"}`}
                                        onClick={() => handleClick(num.number)}
                                    >
                                        {num.number}
                                    </button>
                                :
                                    <div 
                                        title={ num.user ? t('You bought this number') : t('Number not available')}
                                        className={`aspect-square rounded-full border-2 bg-black/20 dark:bg-black/60 w-[50px] font-medium flex flex-col 
                                            items-center justify-center ${num.user ? "border-blue-400 bg-blue-400/10" : "border-black/20 dark:border-black" }`}
                                    >
                                        {num.number}
                                    </div>
                            }
                        </div>
                    ))
                }                        
            </div>
        </div> 
    )
}
