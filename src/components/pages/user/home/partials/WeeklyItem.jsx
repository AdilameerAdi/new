import React, { useEffect } from 'react'
import { Card } from '../../../../elements/Card'
import { Coin } from '../../../../../../public/icons/Svg'
import { AccessTime, Redeem } from '@mui/icons-material'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import apiConfig from '../../../../../utils/apiConfig'
import { Link } from 'react-router-dom'
import { shopWeeklyItemsThunk } from '../../../../../store/slices/shopWeeklyItems.slice'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export const WeeklyItem = ({ className = '' }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const shopWeeklyItems = useSelector(state => state.shopWeeklyItems)

    useEffect(() => {
        dispatch(shopWeeklyItemsThunk());
    }, [])

    return (
        <div className={`relative ${className}`}>
            {
                shopWeeklyItems.length == 0 &&
                    <div className="flex items-center justify-center p-4 absolute z-20 backdrop-blur-md h-full w-full rounded-lg overflow-hidden">
                        <span className="font-medium text-center text-lg">
                            {t("Weekly item not available")}
                        </span>
                    </div>
            }
            <div className="h-full flex items-center absolute -right-2 z-10">
                <div className="flex gap-1 items-center p-2 pl-10 bg-gradient-to-l from-slate-500 via-slate-500 to-transparent rounded-r-lg">
                    <span className="text-xl text-white">{shopWeeklyItems?.price}</span>
                    <Coin color="#FFD700" size={25} />
                </div>
            </div>
            <div className="rounded-lg p-4 bg-slate-400 text-slate-800 font-medium relative overflow-hidden flex flex-col justify-between xl:h-full">
                <div className="flex flex-col justify-center">
                    <span className="text-lg font-medium">{t("Weekly Item")}</span>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="bg-[url(/img/deste.png)] dark:bg-[url(/img/deste_4.png)] bg-center bg-cover h-28 w-28 flex flex-col justify-center items-center breath__animate">
                        <img src={`${apiConfig().endpoint}/items/icon/${shopWeeklyItems?.item?.vnum}`} className="max-w-[30px]" />
                    </div>
                    <span>{shopWeeklyItems?.item?.name?.uk}</span>
                    <PrimaryButton as={Link} to="/shop" className="z-10 !rounded-full text-center">
                        {t("Go to Shop")}
                    </PrimaryButton>
                </div>
                <div className="absolute -top-5 -right-10 -rotate-12">
                    <Redeem className="!h-36 !w-36 text-black/5"/>
                </div>
                <div className="absolute bottom-5 -left-10 rotate-12">
                    <AccessTime className="!h-48 !w-48 text-black/5"/>
                </div>
            </div>
        </div>
    )

}
