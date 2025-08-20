import React, { useEffect } from 'react'
import { Card } from '../../../../elements/Card'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { StarBorderOutlined } from '@mui/icons-material'
import { Coin } from '../../../../../../public/icons/Svg'
import Countdown, { zeroPad } from 'react-countdown'
import { lotteryThunk } from '../../../../../store/slices/lottery.slice'
import { useDispatch, useSelector } from 'react-redux'
import { setLoad } from '../../../../../store/slices/loader.slice'
import apiConfig from '../../../../../utils/apiConfig'
import axios from 'axios'
import Swal from 'sweetalert2'
import { accountThunk } from '../../../../../store/slices/account.slice'
import appError from '../../../../../utils/appError'
import { io } from 'socket.io-client'
import { TicketSeparator } from '../../../../elements/TicketSeparator'
import { useTranslation } from 'react-i18next'

export const LotteryPanel = ({ price, lotto, selected, setSelected }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const countdown = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span>{t("The event has ended!")}</span>;
        } else {
            return <h1 className="text-2xl md:text-5xl">{zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</h1>;
        }
    };

    const buyNumbers = async () => {

        dispatch(setLoad(false));
        const url = `${apiConfig().endpoint}/lottery/buy/${lotto.actual_lotto.id}`

        const data = { numbers: selected }

        await axios.post(url, data, apiConfig().axios)
            .then(res => {
                Swal.fire({
                    toast: true,
                    position: 'bottom-right',
                    icon: 'success',
                    text: res.data.message,
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                });
            })
            .catch(err => {
                appError(err)
                Swal.fire({
                    toast: true,
                    position: 'bottom-right',
                    icon: 'error',
                    text: err.response.data.message,
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                });
            })
            .finally(async () => {
                dispatch(accountThunk())

                // FALTA OPTIMIZAR ESTO
                dispatch(lotteryThunk())
                dispatch(lotteryThunk())
                
                dispatch(setLoad(true))
                setSelected([])
            })

    }

    const trigger = () => {
        dispatch(lotteryThunk())
        dispatch(lotteryThunk())
    }

    useEffect(() => {

        const socket = io(import.meta.env.VITE_API_URL);

        socket.emit('join_room', 'lottery_room');

        socket.on('lottery_room_buy', (data) => {
            if(Number(lotto.actual_lotto.id) === Number(data.lotteryId)) {
                setSelected(selected.filter(n => !data.numbers.includes(n)));
                trigger()
            }
        });

        return () => socket.disconnect();
    }, [selected]);

    return (
        <div className="col-span-6 lg:col-span-2">
            <div className="flex flex-col font-medium ">
                <div className="p-4 border border-b-0 dark:border-black border-black/20 rounded-t-lg grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <Card className="!p-2 flex flex-col items-center col-span-1 xl:col-span-2">
                        <h1 className="text-2xl">{t("1rst")}</h1>
                        <div className="flex justify-between items-center gap-2">
                            <StarBorderOutlined className="text-yellow-400" />
                            {lotto.actual_lotto.prize_1}
                            <Coin color="#FFD700" />
                        </div>
                    </Card>
                    <Card className="!p-2 flex flex-col items-center">
                        <h1 className="text-2xl">{t("2nd")}</h1>
                        <div className="flex justify-between items-center gap-2">
                            <StarBorderOutlined className="text-orange-400" />
                            {lotto.actual_lotto.prize_2}
                            <Coin color="#FFD700" />
                        </div>
                    </Card>
                    <Card className="!p-2 flex flex-col items-center">
                        <h1 className="text-2xl">{t("3rd")}</h1>
                        <div className="flex justify-between items-center gap-2">
                            <StarBorderOutlined className="text-green-400" />
                            {lotto.actual_lotto.prize_3}
                            <Coin color="#FFD700" />
                        </div>
                    </Card>
                </div>
                <TicketSeparator />
                <div className="px-4 border-x dark:border-black border-black/20 flex flex-col items-center gap-2 uppercase font-medium md:p-8">
                    <h5 className="text-lg md:text-2xl">{t("Event ends at")}</h5>
                    <Countdown
                        key={lotto?.actual_lotto?.end_event}
                        date={lotto?.actual_lotto?.end_event}
                        renderer={countdown}
                        onComplete={() => trigger()}
                    />
                </div>
                <TicketSeparator />
                <div className="p-4 border border-t-0 dark:border-black border-black/20 rounded-b-lg flex flex-col gap-4 shadow-md dark:shadow-zinc-900">
                    { selected.length > 0 ?
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4 justify-between font-medium">
                                <span>{t("Total")}: {selected.length * price} {t("Coins")}</span>
                                <button className="hover:underline text-blue-500" onClick={() => setSelected([])}>
                                    {t("Reset")}
                                </button>
                            </div>
                            <PrimaryButton size="lg" onClick={() => buyNumbers()}>
                                { selected.length > 1 ? `${t("Buy")} ${selected.length} ${t("numbers")}` :  `${t("Buy")} ${selected.length} ${t("number")}` }
                            </PrimaryButton>
                        </div>
                        :
                        <span className="text-lg text-center font-medium">{t("Select one or more numbers")}</span>
                    }
                </div>            
            </div>            
        </div>

    )
}
