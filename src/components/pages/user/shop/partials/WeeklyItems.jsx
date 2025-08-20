import React, { useEffect, useState } from 'react'
import { Coin } from '../../../../../../public/icons/Svg'
import { AccessTime, Redeem } from '@mui/icons-material'
import apiConfig from '../../../../../utils/apiConfig'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import Countdown, { zeroPad } from 'react-countdown'
import Modal from '../../../../elements/Modal'
import cutString from '../../../../../utils/cutString'
import selectCompatible from '../../../../../utils/selectCompatible'
import { CustomSelect } from '../../../../elements/CustomSelect'
import { useDispatch, useSelector } from 'react-redux'
import { shopWeeklyItemsThunk } from '../../../../../store/slices/shopWeeklyItems.slice'
import Swal from 'sweetalert2'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import appError from '../../../../../utils/appError'
import { accountThunk } from '../../../../../store/slices/account.slice'
import { useForm } from 'react-hook-form'
import getNextSundayMidnight from '../../../../../utils/getNextSundayMidnight'
import { useTranslation } from 'react-i18next'

export const WeeklyItems = ({ className }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { handleSubmit, reset, formState: { errors } } = useForm();

    const [itemModal, setItemModal] = useState(false)
    const [targetDate, setTargetDate] = useState(getNextSundayMidnight())
    const characters = useSelector(state => state.characters)
    const [characterId, setCharacterId] = useState(null)

    const shopWeeklyItems = useSelector(state => state.shopWeeklyItems)

    const countdown = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <h1 className="text-3xl 2xl:text-4xl">00:00:00</h1>
        } else {
            return <h1 className="text-3xl 2xl:text-4xl">{zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</h1>;
        }
    };

    const submit = async () => {

        if(characterId) {
            dispatch(setLoad(false));
    
            const url = `${apiConfig().endpoint}/shop/weekly/buy/${shopWeeklyItems.id}`
    
            await axios.post(url, { characterId }, apiConfig().axios)
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
                    appError(err);
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
                .finally(() => {
                    setCharacterId(null)
                    dispatch(accountThunk())
                    dispatch(shopWeeklyItemsThunk())
                    dispatch(setLoad(true))
                    setItemModal(false)
                })
        }
        else {
            Swal.fire({
                toast: true,
                position: 'bottom-right',
                icon: 'error',
                text: 'Select character',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            });
        }
    }

    useEffect(() => {
        dispatch(shopWeeklyItemsThunk());
    }, [])

    return (
        <div className={`relative ${className}`}>
            {
                shopWeeklyItems.id &&
                    <Modal
                        open={itemModal}
                        setOpen={setItemModal}
                        title={
                            <div className="flex flex-wrap gap-4 items-center justify-between relative">
                                <div className="flex gap-1 items-center">
                                    <span>{cutString(shopWeeklyItems?.item?.name?.uk, 30)}</span>
                                    {shopWeeklyItems?.stackeable && <span className="px-2 rounded-md text-white bg-red-500">x{ shopWeeklyItems?.stack }</span> }
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">
                                        {shopWeeklyItems?.price}
                                    </span>
                                    <Coin color="#FFD700" size={20} />
                                </div>
                            </div>
                        }
                        className="flex flex-col gap-4 !pt-0" 
                    >
                        <div className="flex gap-4 items-center w-full">
                            <img src={`${apiConfig().endpoint}/items/icon/${shopWeeklyItems?.item?.vnum}`} className="max-w-[50px]" alt={shopWeeklyItems?.item?.vnum} />
                            <p>{shopWeeklyItems?.item?.desc?.uk.replace('[n]', ' ')}</p>
                        </div>
                        {
                        shopWeeklyItems?.status &&
                            <form className="flex flex-wrap gap-4" onSubmit={handleSubmit(submit)}>
                                <CustomSelect
                                    data={selectCompatible(characters, 'id', 'name', '/img/class/%class%_%gender%.png')}
                                    id="characterId"
                                    name="characterId"
                                    placeholder={t("Select character")}
                                    onChange={(selected) => setCharacterId(selected.value)}
                                />
                                {
                                    errors.quantity ?
                                        <div className="border border-red-400 rounded-lg p-2 w-full">
                                            { errors.quantity && <span className="text-red-400 text-sm">• {errors.quantity.message}</span> }
                                        </div>
                                    : null
                                }              
                                <PrimaryButton type="submit" className="flex gap-4 justify-center items-center w-full">
                                    Buy Now
                                </PrimaryButton>
                            </form>
                        }
                    </Modal>
            }
            <div className="h-full flex items-center absolute -right-2 z-10">
                <div className="flex gap-1 items-center p-2 pl-10 bg-gradient-to-l from-blue-400 via-blue-400 to-transparent rounded-r-lg">
                    <span className="text-xl">{shopWeeklyItems?.price}</span>
                    <Coin color="#FFD700" size={25} />
                </div>
            </div>
            <div className="rounded-lg p-4 bg-blue-300 text-blue-900 font-medium relative overflow-hidden flex flex-col justify-between xl:h-full">
                {
                    shopWeeklyItems.length == 0 &&
                        <div className="flex items-center justify-center p-4 absolute z-20 backdrop-blur-md h-full w-full rounded-lg overflow-hidden top-0 left-0">
                            <span className="font-medium text-center text-xl">
                                {t("Weekly item not available")}
                            </span>
                        </div>
                }
                <div className="flex flex-col justify-center">
                    <span className="text-lg font-medium">{t("Weekly Item")}</span>
                    <Countdown
                        key={targetDate}
                        date={targetDate}
                        renderer={countdown}
                        onComplete={() => {
                            setTargetDate(getNextSundayMidnight())
                            dispatch(shopWeeklyItemsThunk())
                        }}
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <div className="bg-[url(/img/deste.png)] dark:bg-[url(/img/deste_4.png)] bg-center bg-cover h-28 w-28 flex flex-col justify-center items-center breath__animate">
                        <img src={`${apiConfig().endpoint}/items/icon/${shopWeeklyItems?.item?.vnum}`} className="max-w-[30px]" />
                    </div>
                    <span>{shopWeeklyItems?.item?.name?.uk}</span>
                    <PrimaryButton className="z-10 !rounded-full" onClick={() => setItemModal(true)}>
                        { shopWeeklyItems?.status ? t("Buy Now") : t("Item Buyed")}
                    </PrimaryButton>
                </div>
                <div className="absolute -top-5 -right-10 -rotate-12">
                    <Redeem className="!h-40 !w-40 text-black/5"/>
                </div>
                <div className="absolute bottom-5 -left-10 rotate-12">
                    <AccessTime className="!h-56 !w-56 text-black/5"/>
                </div>
            </div>        
        </div>
    )
}
