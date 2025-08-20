import React, { useEffect, useState } from 'react'
import { Coin, Package } from '../../../../../../public/icons/Svg'
import { SwitchCustom } from '../../../../elements/SwitchCustom'
import Modal from '../../../../elements/Modal'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import apiConfig from '../../../../../utils/apiConfig'
import axios from 'axios'
import Swal from 'sweetalert2'
import appError from '../../../../../utils/appError'
import { setLoad } from '../../../../../store/slices/loader.slice'
import { Input } from '../../../../elements/Input'
import { shopWeeklyItemsThunk } from '../../../../../store/slices/shopWeeklyItems.slice'

export const UpdateShopWeeklyItems = ({ modal, setModal, item }) => {

    const { register, handleSubmit, watch, reset, setValue, formState: { errors }} = useForm();

    const [stackeable, setStackeable] = useState(item.stackeable)
    const [status, setStatus] = useState(item.status)
  
    const dispatch = useDispatch()
  
    const handleUpdate = async (data) => {
  
        const url = `${apiConfig().endpoint}/shop/weekly/${item.id}`
    
        const body = {
            stackeable,
            stack: data.stack || 1,
            price: data.price,
            status: status
        }
    
        dispatch(setLoad(false));
    
        await axios.patch(url, body, apiConfig().axios)
            .then((res) => {
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
                setModal(false)
                dispatch(shopWeeklyItemsThunk(true))
                dispatch(setLoad(true))
            })
  
    }
  
    useEffect(() => {
        setValue('price', item?.price); 
        setValue('stack', item?.stack);
        setStackeable(item.stackeable);
        setStatus(item?.status);
    }, [item]);

    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Update shop weekly item'}
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleUpdate)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SwitchCustom
                        checked={status}
                        setChecked={setStatus}
                        label="Status"
                    />  
                    <Input
                        icon={<Coin />}
                        id="price"
                        name="price"
                        type="number"
                        label="Price"
                        min="1"
                        placeholder="Insert price"
                        defaultValue={item?.price}
                        register={{
                            function: register,
                            errors: {
                            function: errors,
                            rules: { required: 'Price is required' },
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
                        defaultValue={item?.stack}
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
