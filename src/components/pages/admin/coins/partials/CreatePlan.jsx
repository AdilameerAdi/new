import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import apiConfig from '../../../../../utils/apiConfig';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import appError from '../../../../../utils/appError';
import { planThunk } from '../../../../../store/slices/plan.slice';
import { setLoad } from '../../../../../store/slices/loader.slice';
import Modal from '../../../../elements/Modal';
import { Input } from '../../../../elements/Input';
import { Textarea } from '../../../../elements/Textarea';
import { CustomSelect } from '../../../../elements/CustomSelect';
import selectCompatible from '../../../../../utils/selectCompatible';
import { Coin, Payments } from '../../../../../../public/icons/Svg';

export const CreatePlan = ({ modal, setModal, methods }) => {

    const dispatch = useDispatch()

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const [planMethodId, setPlanMethodId] = useState([])

    const submit = async (data) => {

        dispatch(setLoad(false));

        let formData = data

        formData.methods = planMethodId

        const url = `${apiConfig().endpoint}/plans/`

        await axios.post(url, formData, apiConfig().axios)
            .then(() => {
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
                reset()
                setModal(false)
                dispatch(planThunk(true))
                dispatch(setLoad(true))
            })
    }

    useEffect(() => {
        dispatch(planThunk(true))
    }, [])

    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Create plan'}
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            label="Coins amount"
                            min="1"
                            icon={<Coin />}
                            placeholder="Insert the amount of coins"
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                    rules: {
                                        required: 'Amount is required'
                                    },
                                },
                            }}
                        />
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            label="Coins price"
                            min="1"
                            icon={<Payments />}
                            placeholder="Insert the price of coins"
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                    rules: {
                                        required: 'Price is required'
                                    },
                                },
                            }}
                        />
                    </div>
                    <CustomSelect
                        isMulti
                        name="methods"
                        id="methods"
                        label="Plan methods"
                        values={planMethodId}
                        onChange={(selected) => {
                            setPlanMethodId(selected)
                        }}
                        data={selectCompatible(methods, 'id', 'name')}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    validate: {
                                        validateMethodId: (value) => {
                                            if (planMethodId.length === 0) {
                                                return 'Please select at least one method';
                                            }
                                            return true;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                    <Textarea
                        id="description"
                        rows="3"
                        name="description"
                        label="Description"
                        placeholder="Insert description"
                        defaultValue={`Buy coins`}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                            },
                        }}
                    /> 
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SecondaryButton type="button" onClick={() => setModal(false)}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton type="submit">
                        Accept
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}
