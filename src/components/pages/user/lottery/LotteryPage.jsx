import { lotteryThunk } from '../../../../store/slices/lottery.slice'
import { LotteryNumbers } from './partials/LotteryNumbers'
import { LotteryPanel } from './partials/LotteryPanel'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Card } from '../../../elements/Card'
import { Ticket } from '../../../../../public/icons/Svg'
import { useTranslation } from 'react-i18next'
import { Maintenance } from '../../../shared/Maintenance'

export const LotteryPage = () => {

    const publicData = useSelector(state => state.publicData)
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lottery = useSelector(state => state.lottery)
    const account = useSelector(state => state.account)
    const [price, setPrice] = useState(0)
    const [selected, setSelected] = useState([])
    const [numbers, setNumbers] = useState([])
    const [disabled, setDisabled] = useState([])
    const [userNumbers, setUserNumbers] = useState([])
    const [winners, setWinners] = useState([])
    const [lotto, setLotto] = useState({})

    const generateNumbers = (max) => {

        const numbers = []

        for (let i = 1; i <= max; i++)
            numbers.push({ 
                number: i, 
                available: !disabled.includes(i), 
                user: userNumbers.includes(i)
            })

        setNumbers(numbers)
    }

    const handleDisabled = (buyers) => {

        const disabled = []
        const userNumbers = []

        buyers?.forEach(num => {
            disabled.push(num.number);
            if (account.id === num.Account.Id) {
                userNumbers.push(num.number);
            }
        });

        setDisabled(disabled)
        setUserNumbers(userNumbers)
    }

    const __init__ = async () => {        
        const lotto = {
            actual_lotto: lottery[0],
            last_lotto: lottery[1]
        }

        setLotto(lotto)
        setPrice(lottery[0]?.price)
        setWinners(lottery[1]?.winners)
        generateNumbers(lottery[0]?.numbers)
        handleDisabled(lottery[0]?.lottery_buyers)
    }

    useEffect(() => {
        dispatch(lotteryThunk())
    }, [])
    
    useEffect(() => {
        __init__()
    }, [lottery, account])

    if(publicData.id) {
        if(publicData.web_lottery.status || account.authority >= 30000) {
            if(!lotto.actual_lotto)

                return (
                    <div className="flex flex-col justify-center items-center font-medium h-full">
                        <Ticket size="80"/>
                        <h1 className="text-3xl">{t("No Events availables")}</h1>
                    </div>
                )

            return (
                <div className="p-4 overflow-auto">
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-6 xl:col-span-4 flex flex-col gap-4">
                            {
                                winners && 
                                    winners.length > 0 &&
                                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 font-medium">
                                            {
                                                winners.map(winner => (
                                                    <Card className="flex flex-col items-center gap-4" key={winner.id}>
                                                        <h3 className="italic">{t("Last winners")}</h3>
                                                        <div className="flex gap-4 items-center justify-center">
                                                            <div className="flex flex-col items-center">
                                                                <span>{winner.id} {t("place")}</span>
                                                                <h1 className="text-3xl lg:text-5xl">{winner.number}</h1>
                                                            </div>
                                                        </div>
                                                        {
                                                            winner.user ?
                                                            <Card className="!p-2 flex gap-2 items-center justify-center w-full">
                                                                <img src={`/img/profile/user/${winner.user.pic}.png`} alt={winner.user.name} className="rounded-full aspect-square w-8" />
                                                                <span className="text-lg">{winner.user.name}</span>
                                                            </Card>
                                                            :
                                                            <Card className="!p-2 flex flex-grow gap-2 items-center justify-center w-full">
                                                                <span className="text-lg">{t("No winner")}</span>
                                                            </Card>
                                                        }
                                                    </Card>
                                                ))
                                            }
                                        </div>
                            }
                            <LotteryNumbers
                                price={price}
                                numbers={numbers} 
                                userNumbers={userNumbers} 
                                selected={selected} 
                                setSelected={setSelected}
                            /> 
                        </div>
                        <LotteryPanel 
                            price={price}
                            lotto={lotto}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </div>
                </div>
            )
        }
        return <Maintenance data={publicData} message={t("Lottery is under maintenance")} />
    }
}
