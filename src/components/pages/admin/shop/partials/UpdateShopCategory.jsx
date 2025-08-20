import React, { useEffect } from 'react'
import Modal from '../../../../elements/Modal'
import { Tag } from '../../../../../../public/icons/Svg'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import apiConfig from '../../../../../utils/apiConfig'
import axios from 'axios'
import { setLoad } from '../../../../../store/slices/loader.slice'
import Swal from 'sweetalert2'
import appError from '../../../../../utils/appError'
import { shopCategoriesThunk } from '../../../../../store/slices/shopCategories'
import { Input } from '../../../../elements/Input'

export const UpdateShopCategory = ({ modal, setModal, category }) => {

    const dispatch = useDispatch()

    const { register, handleSubmit, setValue, reset, formState: { errors }} = useForm();

    const submit = async (data) => {

        const url = `${apiConfig().endpoint}/shop/category/${category.id}`

        dispatch(setLoad(false));
    
        await axios.patch(url, data, apiConfig().axios)
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

    useEffect(() => {
        setValue('name', category?.name); 
    }, [category]);

    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Update shop category'}
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
                    defaultValue={category?.name}
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
