import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Input } from '../../../../elements/Input';
import { CustomSelect } from '../../../../elements/CustomSelect';
import { SwitchCustom } from '../../../../elements/SwitchCustom';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { useDispatch } from 'react-redux';
import { setLoad } from '../../../../../store/slices/loader.slice';
import apiConfig from '../../../../../utils/apiConfig';
import axios from 'axios';
import Swal from 'sweetalert2';
import { rankPrizesThunk } from '../../../../../store/slices/rankPrizes.slice';
import appError from '../../../../../utils/appError';

const types = [
    {
        label: "Item",
        value: 0
    },
    {
        label: "Coins",
        value: 1
    },
]

export const PrizeForm = ({ prize, category, setModal }) => {

    const { register, handleSubmit, watch, setValue, formState: { errors }} = useForm();

    const [type, setType] = useState(prize.type)
    const [stackeable, setStackeable] = useState(prize.stackeable)

    const dispatch = useDispatch()

    const submit = async (data) => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/ranking/prizes/${category}`

        let formData = data

        formData.type = type
        formData.stackeable = stackeable
        formData.prize = Number(data.prize)
        formData.place = Number(prize.place)
        formData.stack = Number(data.stack) || Number(prize.stack)

        await axios.patch(url, formData, apiConfig().axios)
            .then(res => {
                setModal(false)
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
                dispatch(setLoad(true))
                dispatch(rankPrizesThunk())
            })

    }

    useEffect(() => {
        setValue("type", type)
    }, [prize, type])
    
    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomSelect
                    name="type"
                    id="type"
                    label="Type"
                    defaultValue={types.filter(item => item.value === prize.type)[0]}
                    onChange={(selected) => setType(selected.value) }
                    data={types}
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required: 'Type is required',
                            },
                        },
                    }}
                />
                <Input
                    id="prize"
                    name="prize"
                    type="number"
                    label="Prize"
                    placeholder="Insert prize"
                    defaultValue={prize.prize}
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required: 'Prize is required',
                            },
                        },
                    }}
                    element={
                        !type ?
                            <div className="flex gap-2 items-center">
                                <span className={`${stackeable && 'hidden'} text-xs`}>
                                    Stackeable
                                </span>
                                <input 
                                    className={`w-16 bg-transparent text-center border-l border-black/20 dark:border-gray-500 ${!stackeable && 'hidden'}`}
                                    disabled={!stackeable} 
                                    placeholder="Stack" 
                                    type="text"
                                    maxLength={3}
                                    defaultValue={prize.stack}
                                    {...register("stack")}
                                />
                                <SwitchCustom
                                    checked={stackeable}
                                    setChecked={setStackeable}
                                />
                            </div>
                        : null
                    }
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SecondaryButton type="button" onClick={() => setModal(false)}>Cancel</SecondaryButton>
                <PrimaryButton type="submit">Accept</PrimaryButton>
            </div>
        </form>
    )
}
