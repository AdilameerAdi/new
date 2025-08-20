import React, { useState } from 'react'
import { Input } from '../../../../elements/Input'
import { SwitchCustom } from '../../../../elements/SwitchCustom'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import apiConfig from '../../../../../utils/apiConfig'
import Swal from 'sweetalert2'
import appError from '../../../../../utils/appError'
import { publicThunk } from '../../../../../store/slices/public.slice'
import { useDispatch } from 'react-redux'
import { setLoad } from '../../../../../store/slices/loader.slice'
import { Link, Website } from '../../../../../../public/icons/Svg'

export const GeneralConfig = ({ data }) => {

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const dispatch = useDispatch()

    const [status, setStatus] = useState(data.status)
    const [register_status, setRegister_status] = useState(data.register_status)

    const submit = async (data) => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/admin/control/general`;

        let formData = data

        formData.status = status
        formData.register_status = register_status

        await axios
            .patch(url, formData, apiConfig().axios)
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
            .catch((err) => {
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
                dispatch(publicThunk())
                dispatch(setLoad(true))
            });
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
            <hr className="border-black/20 dark:border-admin-dark-500"/>
            <Input
                id="name"
                name="name"
                type="text"
                label="Website name"
                placeholder={data.name}
                defaultValue={data.name}
                icon={<Website />}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: 'Name is required',
                        },
                    },
                }}
            />
            <Input
                id="domain"
                name="domain"
                type="url"
                label="Website domain"
                placeholder={data.domain}
                defaultValue={data.domain}
                icon={<Link />}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: 'Domain is required',
                        },
                    },
                }}
            />
            <SwitchCustom
                checked={status}
                setChecked={setStatus}
                label="Website status"
            />
            <SwitchCustom
                checked={register_status}
                setChecked={setRegister_status}
                label="Register status"
            />
            <hr className="border-black/20 dark:border-admin-dark-500"/>
            <PrimaryButton type="submit">
                Save
            </PrimaryButton>
        </form>
    )
}
