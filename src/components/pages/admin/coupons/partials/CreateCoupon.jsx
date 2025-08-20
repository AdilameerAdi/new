import React, { useEffect, useState } from 'react'
import Modal from '../../../../elements/Modal'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { useForm } from 'react-hook-form'
import { Add, AutoRenew, BarcodeScanner, Coin, Edit, Package, Remove } from '../../../../../../public/icons/Svg'
import { Input } from '../../../../elements/Input'
import { SwitchCustom } from '../../../../elements/SwitchCustom'
import axios from 'axios'
import apiConfig from '../../../../../utils/apiConfig'
import Swal from 'sweetalert2'
import appError from '../../../../../utils/appError'
import { couponsThunk } from '../../../../../store/slices/coupons.slice'
import { setLoad } from '../../../../../store/slices/loader.slice'
import { useDispatch } from 'react-redux'

export const CreateCoupon = ({ modal, setModal }) => {

    const dispatch = useDispatch()

    const [type, setType] = useState(1)
    const [stackeable, setStackeable] = useState(false)
    const [itemQty, setItemQty] = useState(1)
    const [multi, setMulti] = useState(false)

    const { register, handleSubmit, watch, reset, setValue, formState: { errors }} = useForm();

    const itemQuantity = (action) => {

        if(action){
            itemQty < 99 ? setItemQty(itemQty + 1) : setItemQty(99)
        }
        else {
            itemQty > 1  ? setItemQty(itemQty - 1) : setItemQty(1)
        }
    }

    const handleCreate = async (data) => {

        dispatch(setLoad(false));

        const url = `${apiConfig().endpoint}/coupons`

        let formData = data

        formData.type = type
        formData.multi = multi ? data.multi : false
        formData.stack = stackeable ? data.stack : false
        formData.custom = data.custom ? data.custom : false
        formData.quantity = type === 2 ? data.quantity : false

        await axios.post(url, formData, apiConfig().axios)
            .then(res => {
                setModal(false)
                reset()
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
                dispatch(couponsThunk(true))
                dispatch(setLoad(true))
            })
    }

    useEffect(() => {
        setValue("quantity", itemQty)
    }, [itemQty])
    
    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Create coupon'}
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleCreate)}>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label class="text-sm text-gray-500">Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-500">
                            <button onClick={() => setType(1)} type="button"
                                className={`p-2 text-center rounded-lg ${type === 1 ? 'border-2 border-blue-500 text-blue-500' : 'border border-black/20 dark:border-gray-500'}`}
                            >
                                <span>Coins</span>
                            </button>
                            <button onClick={() => setType(2)} type="button"
                                className={`p-2 text-center rounded-lg ${type === 2 ? 'border-2 border-blue-500 text-blue-500' : 'border border-black/20 dark:border-gray-500'}`}
                            >
                                <span>Item</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Input
                            icon={type === 1 ? <Coin /> : <BarcodeScanner />}
                            id="prize"
                            name="prize"
                            type="number"
                            label={type === 1 ? "Coins" : "Item"}
                            min="1"
                            placeholder={type === 1 ? "Amount" : "VNum"}
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                    rules: {
                                        required: true,
                                    },
                                },
                            }}
                            element={
                                type === 2 &&
                                    <div className="flex border-l pl-2 border-black/20 dark:border-gray-500">
                                        <button 
                                            className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700" 
                                            onClick={() => itemQuantity(false)}
                                            type="button" 
                                        >
                                            <Remove size={20} color={errors.quantity && 'rgb(248, 113, 113)'}/>
                                        </button>
                                        <input 
                                            type="text"
                                            name="quantity"
                                            maxLength="2"
                                            className={`bg-transparent text-center max-w-[40px] ${errors.quantity ? 'text-red-400' : ''}`}
                                            {...register("quantity", {
                                                required: "Quantity field is required",
                                                pattern: {
                                                    value: /^[1-9][0-9]?$/,
                                                    message: "Quantity must be between 1 and 99",
                                                },
                                            })}
                                            onChange={(e) => setItemQty(Number(e.target.value))}
                                            defaultValue={itemQty}
                                            value={itemQty}
                                        />
                                        <button type="button" className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700" onClick={() => itemQuantity(true)}>
                                            <Add size={20} color={errors.quantity && 'rgb(248, 113, 113)'}/>
                                        </button>                        
                                    </div>
                            }
                        />
                        {
                            type === 2 &&
                                <Input
                                    icon={<Package />}
                                    id="stack"
                                    name="stack"
                                    type="number"
                                    label="Stackeable"
                                    min="1"
                                    max="999"
                                    placeholder="Stack"
                                    disabled={!stackeable}
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
                                            rules: {
                                                required: stackeable,
                                            },
                                        },
                                    }}
                                />
                        }

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                icon={<Edit />}
                                id="custom"
                                name="custom"
                                type="text"
                                label="Custom code (optional)"
                                placeholder="EX: WINNER1"
                                register={{
                                    function: register,
                                    errors: {
                                        function: errors,
                                    },
                                }}
                            />
                            <Input
                                icon={<AutoRenew />}
                                id="multi"
                                name="multi"
                                type="number"
                                label="Multipurpose"
                                min="1"
                                placeholder="Quantity"
                                disabled={!multi}
                                element={
                                    <SwitchCustom
                                        checked={multi}
                                        setChecked={setMulti}
                                    />
                                }
                                register={{
                                    function: register,
                                    errors: {
                                        function: errors,
                                        rules: {
                                            required: multi,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SecondaryButton type="button" onClick={() => setModal(false)}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit">Accept</PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}
