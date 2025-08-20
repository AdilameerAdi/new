import { paymentPrizesThunk } from '../../../../../store/slices/paymentsPrizes.slice'
import { charactersThunk } from '../../../../../store/slices/character.slice'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Diamond } from '../../../../../../public/icons/Svg'
import { useDispatch, useSelector } from 'react-redux'
import apiConfig from '../../../../../utils/apiConfig'
import React, { useEffect, useState } from 'react'
import { Card } from '../../../../elements/Card'
import { Check } from '@mui/icons-material'
import { ClaimItem } from './ClaimItem'
import { useTranslation } from 'react-i18next'

export const PaymentsTimeline = ({ className = "" }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const account = useSelector(state => state.account)
    const paymentPrizes = useSelector(state => state.paymentPrizes)
    const publicData = useSelector(state => state.publicData.web_general)

    const [modal, setModal] = useState(false)
    const [item, setItem] = useState({})
    const [prizes, setPrizes] = useState(paymentPrizes?.items)
    const [maxTarget, setMaxTarget] = useState(paymentPrizes?.maxTarget)

    const calcPercent = (max, index) => {
        if (max <= 0) {
          return 0;
        }
      
        const percent = (index / max) * 100;

        if(percent >= 100) return 100

        return percent.toFixed(0);
    }

    useEffect(() => {
        dispatch(paymentPrizesThunk())
    }, [])

    useEffect(() => {
        dispatch(charactersThunk())
    }, [])

    useEffect(() => {
        setPrizes(paymentPrizes?.items)
        setMaxTarget(paymentPrizes?.maxTarget)
    }, [paymentPrizes, account])

    if(paymentPrizes.maxTarget && publicData?.gems_prizes_status)

        return (
            <Card className={`flex flex-col !p-0 ${className}`}>
                <ClaimItem modal={modal} setModal={setModal} item={item}/>
                <div className="flex gap-4 justify-between items-center px-4 py-1 font-medium">
                    <span className="flex gap-1 items-center" title={`You have ${account.gems} gems, awesome!`}>
                        <span>{account.gems}</span>
                        <Diamond color="cyan" size={20} />
                    </span>
                    <span>{t("Payment prizes")}</span>
                </div>
                <Splide
                    options={{
                        perPage: 8,
                        arrows: false,
                        autoWidth: true,
                    }}
                >
                    { prizes?.map((prize, index) => (
                        <SplideSlide key={index} className="flex flex-col gap-2 items-center aspect-square relative !px-4 cursor-pointer border-y border-black/20 dark:border-black !mb-8" 
                            title={prize.item.name['uk']}
                            onClick={() => {
                                setItem(prize)
                                setModal(true)
                            }}
                        >
                            <span className="p-2 font-medium">{calcPercent(maxTarget, prize.target)}%</span>
                            <div className={`p-3 rounded-full bg-custom-light-700 dark:bg-custom-dark-700 border-2 z-10 relative overflow-hidden
                                ${prize.claim ? 'border-green-500' : 'border-red-500'} hover:scale-110 transition-all duration-200 ease-in-out`}>
                                <img src={`${apiConfig().endpoint}/items/icon/${prize.item.vnum}`} className="max-w-[30px]" />
                                {prize.claim &&
                                    <div className="w-full h-full absolute flex flex-col justify-center items-center top-0 left-0 bg-black/50">
                                        <Check className="text-green-500" />
                                    </div>                                    
                                }
                            </div>
                            <span className="p-2 font-medium whitespace-nowrap flex items-center gap-1">
                                <span>{prize.target}</span>
                                <Diamond color="cyan" size={20} />
                            </span>
                            <div className="flex flex-col justify-center absolute w-full h-full top-0 left-0">
                                <div className={`${prize.claim ? 'bg-green-500' : 'bg-red-500'} h-[2px] w-full`} />
                            </div>
                        </SplideSlide>   
                    ))}
                </Splide>
            </Card>  
        )

    }

