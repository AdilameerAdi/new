import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Input } from '../../../../elements/Input';
import { Clock, Coin, Gift, Percent } from '../../../../../../public/icons/Svg';
import { SwitchCustom } from '../../../../elements/SwitchCustom';
import { Card } from '../../../../elements/admin/Card';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { publicThunk } from '../../../../../store/slices/public.slice';
import { setLoad } from '../../../../../store/slices/loader.slice';
import apiConfig from '../../../../../utils/apiConfig';
import appError from '../../../../../utils/appError';
import { PrimaryButton } from '../../../../elements/PrimaryButton';

export const WheelSettings = ({ data, className }) => {

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const [status, setStatus] = useState(data.status)

    const dispatch = useDispatch()

    const submit = async (data) => {

        const url = `${apiConfig().endpoint}/wheel/control`

        const body = {
            time: Number(data.time),
            price: Number(data.price),
            jackpot_spin: Number(data.jackpot_spin),
            jackpot_prob: Number(data.jackpot_prob),
            status
        }

        dispatch(setLoad(false));
    
        await axios.patch(url, body, apiConfig().axios)
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
            .finally(() => {
                dispatch(publicThunk())
                dispatch(setLoad(true))
            })
    }

    return (
        <Card className={`flex flex-col gap-4 h-max ${className}`}>
            <div className="pb-4 border-b border-black/20 dark:border-admin-dark-500 w-full flex flex-wrap justify-between items-center gap-4">
                <h3 className="font-medium text-lg">Configuration</h3>
                <SwitchCustom
                    checked={status}
                    setChecked={setStatus}
                    label="Wheel status"
                />
            </div>
            <form onSubmit={handleSubmit(submit)} className={`flex flex-col gap-4`}>
                <Input
                    icon={<Clock />}
                    id="time"
                    name="time"
                    type="number"
                    min="5000"
                    label="Wheel duration"
                    defaultValue={data.time}
                    placeholder={data.time}
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: { required: 'Duration is required' },
                        },
                    }}
                />
                <Input
                    icon={<Coin />}
                    id="price"
                    name="price"
                    type="number"
                    min="10"
                    label="Wheel price"
                    defaultValue={data.price}
                    placeholder={data.price}
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: { required: 'Price is required' },
                        },
                    }}
                />
                <Input
                    icon={<Gift />}
                    id="jackpot_spin"
                    name="jackpot_spin"
                    type="number"
                    min="10"
                    label="Jackpot spins"
                    defaultValue={data.jackpot_spin}
                    placeholder={data.jackpot_spin}
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: { required: 'Spins is required' },
                        },
                    }}
                /> 
                <Input
                    icon={<Percent />}
                    id="jackpot_prob"
                    name="jackpot_prob"
                    type="number"
                    min="1"
                    label="Jackpot probability"
                    defaultValue={data.jackpot_prob}
                    placeholder={data.jackpot_prob}
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: { required: 'Probability is required' },
                        },
                    }}
                />
                <hr className="border-black/20 dark:border-admin-dark-500"/>
                <PrimaryButton type="submit">
                    Update
                </PrimaryButton>
            </form>
        </Card>
    )
}
