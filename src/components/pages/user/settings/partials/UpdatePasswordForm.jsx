import React, { useState } from 'react'
import { Input } from '../../../../elements/Input'
import { Eye, EyeSlash, Lock } from '../../../../../../public/icons/Svg'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Card } from '../../../../elements/Card';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import Swal from 'sweetalert2';
import { setLoad } from '../../../../../store/slices/loader.slice';
import axios from 'axios';
import apiConfig from '../../../../../utils/apiConfig';
import appError from '../../../../../utils/appError';
import { useTranslation } from 'react-i18next';

export const UpdatePasswordForm = ({ setPassword }) => {

    const [hide, setHide] = useState(true);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors }, } = useForm();

    const passValidation = (NewPassword, NewPasswordRepeat) => {

        let status =  true
        let message = ''
    
        if(NewPassword !== NewPasswordRepeat){ 
            message = t('Passwords do not match')
            status = false
        }

        if(!status)
            Swal.fire({
                toast: true,
                position: 'bottom-right',
                icon: 'error',
                text: message,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            });
      
        return status
    }

    const submit = async (data) => {

        if(passValidation(data.NewPassword, data.NewPasswordRepeat)){

            dispatch(setLoad(false))

            const url = `${apiConfig().endpoint}/auth/update/password/`

            await axios.patch(url, data, apiConfig().axios)
                .then(res => { 
                    setPassword(res.data.account.NewPassword)
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
                .finally(() => dispatch(setLoad(true)))
            }

    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
            <Input
                icon={<Lock />}
                id="ActualPassword"
                name="ActualPassword"
                type={hide ? 'password' : 'text'}
                label={t("Actual Password")}
                placeholder="***********"
                register={{
                    function: register,
                    errors: {
                    function: errors,
                    rules: {
                        required: t('Actual password is required'),
                        minLength: {
                            value: 8,
                            message: t('Must be at least 8 characters'),
                        },
                    },
                    },
                }}
                element={
                    <button
                        type="button"
                        onClick={() => setHide(!hide)}
                    >
                        {hide ? (
                            <Eye />
                        ) : (
                            <EyeSlash />
                        )}
                    </button>
                }
            />
            <Input
                icon={<Lock />}
                id="NewPassword"
                name="NewPassword"
                type={hide ? 'password' : 'text'}
                label={t("New Password")}
                placeholder="***********"
                register={{
                    function: register,
                    errors: {
                    function: errors,
                    rules: {
                        required: t('New password is required'),
                        minLength: {
                        value: 8,
                        message: t('Must be at least 8 characters'),
                        },
                    },
                    },
                }}
                element={
                    <button
                        type="button"
                        onClick={() => setHide(!hide)}
                    >
                        {hide ? (
                            <Eye />
                        ) : (
                            <EyeSlash />
                        )}
                    </button>
                }
            />
            <Input
                icon={<Lock />}
                id="NewPasswordRepeat"
                name="NewPasswordRepeat"
                type={hide ? 'password' : 'text'}
                label={t("Repeat new password")}
                placeholder="***********"
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: t('New password repeat is required'),
                            minLength: {
                                value: 8,
                                message: t('Must be at least 8 characters'),
                            },
                        },
                    },
                }}
                element={
                    <button
                        type="button"
                        onClick={() => setHide(!hide)}
                    >
                        {hide ? (
                            <Eye />
                        ) : (
                            <EyeSlash />
                        )}
                    </button>
                }
            />
            <PrimaryButton type="submit">
                {t("Update password")}
            </PrimaryButton>
        </form>
    )
}
