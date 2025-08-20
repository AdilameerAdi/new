import React, { useState } from 'react'
import Modal from '../../../../elements/Modal'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { SwitchCustom } from '../../../../elements/SwitchCustom'
import { Input } from '../../../../elements/Input'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Swal from 'sweetalert2'
import apiConfig from '../../../../../utils/apiConfig'
import { setLoad } from '../../../../../store/slices/loader.slice'
import { paymentPrizesThunk } from '../../../../../store/slices/paymentsPrizes.slice'
import { useDispatch } from 'react-redux'
import appError from '../../../../../utils/appError'
import { BarcodeScanner, Package, Target } from '../../../../../../public/icons/Svg'

export const CreateItem = ({ modal, setModal }) => {

    const dispatch = useDispatch()

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const [stackeable, setStackeable] = useState(false)

    const submit = async (data) => {
        const url = `${apiConfig().endpoint}/gems/create/`

        const body = {
            target: data.target,
            vnum: data.vnum,
            stackeable,
            stack: data.stack || 1,
        }
    
        dispatch(setLoad(false));
    
        await axios.post(url, body, apiConfig().axios)
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
                reset()
                setModal(false)
                dispatch(paymentPrizesThunk())
                dispatch(setLoad(true))
            })
    }
    
    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Add item'}
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
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: { required: true },
                            },
                        }}
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
                        defaultValue="1"
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
