import React from 'react'
import { useSelector } from 'react-redux'
import { Card } from '../../../../elements/Card'
import { CheckCircle, Coin } from '../../../../../../public/icons/Svg'
import apiConfig from '../../../../../utils/apiConfig'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const DailyItems = ({ items, className = '' }) => {

    const darkMode = useSelector(state => state.darkMode)
    const { t } = useTranslation();

    return (
        <div className={`bg-[url(/img/bg-light_mode_shop.jpg)] dark:bg-[url(/img/bg-dark_mode_shop.jpg)] bg-center bg-cover rounded-lg overflow-hidden relative ${className}`}>
            {
                items?.length == 0 &&
                    <div className="flex items-center justify-center p-4 absolute z-20 backdrop-blur-md h-full w-full rounded-lg overflow-hidden">
                        <span className="font-medium text-center text-lg">
                            {t("Daily items not available")}
                        </span>
                    </div>
            }
            <div className="flex flex-col bg-white/25 dark:bg-transparent h-full">
                <div className="bg-gradient-to-b from-white/80 dark:from-black/80 via-white/50 dark:via-black/50 to-transparent p-4">
                    <h3 className="font-medium text-lg">{t("Daily Items")}</h3>
                </div>
                <div className="flex flex-wrap gap-2 h-full justify-evenly items-center px-4 pb-4">
                    {
                        items?.map((item, index) => (
                            <Link to="/shop"
                                className={`flex flex-col items-center p-2 relative `}
                                key={index}  
                            >
                                <div className={`flex gap-1 items-center`}>
                                    <span className="font-medium">
                                        {item.shop_daily?.price}
                                    </span>
                                    <Coin color="#FFD700" size={20} />
                                </div>
                                <div className="bg-[url(/img/deste_4.png)] dark:bg-[url(/img/deste.png)] bg-center bg-cover h-28 w-28 flex flex-col justify-center items-center breath__animate">
                                    <img src={`${apiConfig().endpoint}/items/icon/${item.shop_daily?.item?.vnum}`} className="max-w-[25px]" />
                                </div>
                                <span className="font-medium text-sm"
                                    style={{ 
                                        textShadow: `2px 2px 5px ${ darkMode ? 'black' : 'white'}`
                                    }}
                                >
                                    {item.shop_daily?.item?.name?.uk}
                                </span>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>   
    )
}
