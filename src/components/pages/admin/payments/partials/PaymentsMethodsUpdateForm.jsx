import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
import apiConfig from '../../../../../utils/apiConfig';
import { planThunk } from '../../../../../store/slices/plan.slice';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { useDispatch } from 'react-redux';
import { Input } from '../../../../elements/Input';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import Swal from 'sweetalert2';
import appError from '../../../../../utils/appError';
import { Card } from '../../../../elements/admin/Card';

const currency = [
    {
        id: 1,
        name: "EUR",
    },
    {
        id: 1,
        name: "USD",
    },
    {
        id: 2,
        name: "USDT",
    },
]

export const PaymentsMethodsUpdateForm = ({ modal, setModal, method }) => {

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const dispatch = useDispatch()

    const handleUpdate = async (data) => {

        dispatch(setLoad(false));
        const url = `${apiConfig().endpoint}/methods/${method.id}`

        const formData = {
            name: data.name,
            coins: {
                bonus: data.bonus,
                discount: data.discount
            }
        }

        await axios.patch(url, formData, apiConfig().axios)
            .catch(err => appError(err))
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
            .finally(() => {
                dispatch(planThunk(true));
                dispatch(setLoad(true));
                setModal(false)
            })
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleUpdate)}>
            <Input
                id="name"
                name="name"
                type="text"
                label="Name"
                placeholder="Insert name"
                defaultValue={method.name}
                element={<span>{method.currency}</span>}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: 'Name is required'
                        },
                    },
                }}
            />
            <Card className="flex flex-col gap-4">
                <h4 className="text-sm font-medium">Coins</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        id="discount"
                        name="discount"
                        type="number"
                        label="Discount"
                        placeholder="Insert discount"
                        defaultValue={method?.coins?.discount}
                        min="0"
                        max="100"
                        element={"%"}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required: 'Discount is required'
                                },
                            },
                        }}
                    />                        
                    <Input
                        id="bonus"
                        name="bonus"
                        type="number"
                        label="Bonus"
                        placeholder="Insert bonus"
                        defaultValue={method?.coins?.bonus}
                        min="0"
                        max="100"
                        element={"%"}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required: 'Bonus is required'
                                },
                            },
                        }}
                    />
                </div>
            </Card>
            <SecondaryButton type="submit">
                Update
            </SecondaryButton>
        </form>
    )
}
