import React, { useState } from 'react'
import Modal from '../../../../elements/Modal'
import { Input } from '../../../../elements/Input'
import { SwitchCustom } from '../../../../elements/SwitchCustom'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import axios from 'axios'
import appError from '../../../../../utils/appError'
import { paymentPrizesThunk } from '../../../../../store/slices/paymentsPrizes.slice'
import { setLoad } from '../../../../../store/slices/loader.slice'
import apiConfig from '../../../../../utils/apiConfig'
import { BarcodeScanner, Package, Target } from '../../../../../../public/icons/Svg'

export const UpdateItems = ({ modal, setModal, item }) => {

    const dispatch = useDispatch()

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const [stackeable, setStackeable] = useState(item?.stackeable)

    const submit = async (data) => {
        const url = `${apiConfig().endpoint}/gems/${item.id}`

        const body = {
            target: data.target,
            stackeable,
            stack: data.stack || 1,
        }
    
        dispatch(setLoad(false));
    
        await axios.patch(url, body, apiConfig().axios)
            .then(() => {
                Swal.fire({
                    toast: true,
                    position: 'bottom-right',
                    icon: 'success',
                    text: 'The shop item was created successfully!',
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
                setModal(false)
                dispatch(paymentPrizesThunk())
                dispatch(setLoad(true))
            })
    }

    if(item.id)

    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Update item'}
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <Input
                        icon={<Target />}
                        id="target"
                        name="target"
                        type="number"
                        label="Target"
                        min="1"
                        placeholder="Insert target"
                        defaultValue={item?.target}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: { required: true },
                            },
                        }}
                    />
                    <Input
                        icon={<BarcodeScanner />}
                        id="vnum"
                        name="vnum"
                        type="number"
                        label="VNum"
                        min="1"
                        placeholder="Insert vnum"
                        defaultValue={item?.item?.vnum}
                        disabled={true}
                    />
                    <Input
                        icon={<Package />}
                        id="stack"
                        name="stack"
                        type="number"
                        label="Stackeable"
                        min="1"
                        max="999"
                        placeholder="Insert stack"
                        disabled={!stackeable}
                        defaultValue={item?.stack}
                        element={
                            <SwitchCustom
                                checked={stackeable}
                                setChecked={setStackeable}
                            />
                        }
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                            },
                        }}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SecondaryButton type="button" onClick={() => setModal(false)}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit">Accept</PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}
