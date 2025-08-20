import React from 'react'
import Modal from '../../../../elements/Modal'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { useForm } from 'react-hook-form'
import { setLoad } from '../../../../../store/slices/loader.slice'
import Swal from 'sweetalert2'
import appError from '../../../../../utils/appError'
import apiConfig from '../../../../../utils/apiConfig'
import axios from 'axios'
import { Input } from '../../../../elements/Input'
import { Tag } from '../../../../../../public/icons/Svg'
import { shopCategoriesThunk } from '../../../../../store/slices/shopCategories'
import { useDispatch } from 'react-redux'

export const CreateShopCategory = ({ modal, setModal }) => {

    const dispatch = useDispatch()

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const submit = async (data) => {

        const url = `${apiConfig().endpoint}/shop/category`

        dispatch(setLoad(false));
    
        await axios.post(url, data, apiConfig().axios)
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
                reset()
                setModal(false)
                dispatch(shopCategoriesThunk());
                dispatch(setLoad(true))
            })
    }

    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Create shop category'}
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
                <Input
                    icon={<Tag />}
                    id="name"
                    name="name"
                    type="text"
                    label="Name"
                    min="1"
                    placeholder="Insert category name"
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: { required: 'Name is required' },
                        },
                    }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SecondaryButton type="button" onClick={() => setModal(false)}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit">Accept</PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}
