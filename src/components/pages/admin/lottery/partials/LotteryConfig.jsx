import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { SwitchCustom } from '../../../../elements/SwitchCustom'
import { Calendar, Coin, Numbers } from '../../../../../../public/icons/Svg'
import { Card } from '../../../../elements/admin/Card'
import { Input } from '../../../../elements/Input'
import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import apiConfig from '../../../../../utils/apiConfig'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import Swal from 'sweetalert2'
import appError from '../../../../../utils/appError'
import { publicThunk } from '../../../../../store/slices/public.slice'

export const LotteryConfig = ({ data }) => {

    const [status, setStatus] = useState(data?.status)

    const { register, handleSubmit, watch, reset, setValue, formState: { errors }} = useForm();

    const dispatch = useDispatch();

    const submit = async (data) => {

        dispatch(setLoad(false));

        const url = `${apiConfig().endpoint}/lottery/control`

        const formData = data;
        formData.status = status;

        await axios.patch(url, formData, apiConfig().axios)
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

    useEffect(() => {
        setStatus(data?.status)
        setValue('numbers', data?.numbers);
    //    setValue('end_date', data?.end_date);
        setValue('price', data?.price);
        setValue('place_1', data?.prizes?.place_1);
        setValue('place_2', data?.prizes?.place_2);
        setValue('place_3', data?.prizes?.place_3);
    }, [data])

    return (
        <Card className="flex flex-col gap-4">
            <div className="w-full flex flex-wrap justify-between items-center gap-4">
                <h3 className="font-medium text-lg">Configuration</h3>
                <SwitchCustom
                    checked={status}
                    setChecked={setStatus}
                    label="Lottery status"
                />
            </div>
            <hr className="border-t border-black/20 dark:border-admin-dark-500"/>
            <div className="flex flex-col gap-4">
                <form onSubmit={handleSubmit(submit)} className={`flex flex-col gap-4`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            icon={<Numbers />}
                            id="numbers"
                            name="numbers"
                            type="number"
                            min="100"
                            label="Numbers"
                            defaultValue={data?.numbers}
                            placeholder={data?.numbers}
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                    rules: { required: 'Numbers is required' },
                                },
                            }}
                        />
                        <Input
                            icon={<Calendar />}
                            id="end_date"
                            name="end_date"
                            type="date"
                            label="End date"
                            disabled
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            icon={<Coin />}
                            id="price"
                            name="price"
                            type="number"
                            min="10"
                            label="Numbers price"
                            defaultValue={data?.price}
                            placeholder={data?.price}
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                    rules: { required: 'Price is required' },
                                },
                            }}
                        />
                        <Input
                            icon={<Coin />}
                            id="place_1"
                            name="place_1"
                            type="number"
                            min="100"
                            label="1rst place prize"
                            defaultValue={data?.prizes?.place_1}
                            placeholder={data?.prizes?.place_1}
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                    rules: { required: '1rst place prize is required' },
                                },
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            icon={<Coin />}
                            id="place_2"
                            name="place_2"
                            type="number"
                            min="100"
                            label="2nd place prize"
                            defaultValue={data?.prizes?.place_2}
                            placeholder={data?.prizes?.place_2}
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                    rules: { required: '2nd place prize is required' },
                                },
                            }}
                        />
                        <Input
                            icon={<Coin />}
                            id="place_3"
                            name="place_3"
                            type="number"
                            min="100"
                            label="3rd place prize"
                            defaultValue={data?.prizes?.place_3}
                            placeholder={data?.prizes?.place_3}
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                    rules: { required: '3rd place prize is required' },
                                },
                            }}
                        />
                    </div>
                    <hr className="border-black/20 dark:border-admin-dark-500"/>
                    <PrimaryButton type="submit">
                        Update
                    </PrimaryButton>
                </form>
            </div>
        </Card>
    )
}
