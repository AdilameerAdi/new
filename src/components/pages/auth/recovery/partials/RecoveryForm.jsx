import React from 'react'
import { Input } from '../../../../elements/Input';
import { At } from '../../../../../../public/icons/Svg';
import isEmailValid from '../../../../../utils/isEmailValid';
import { useForm } from 'react-hook-form';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { useDispatch } from 'react-redux';
import { setLoad } from '../../../../../store/slices/loader.slice';
import apiConfig from '../../../../../utils/apiConfig';
import Swal from 'sweetalert2';
import axios from 'axios';
import appError from '../../../../../utils/appError';
import { useTranslation } from 'react-i18next';

export const RecoveryForm = ({ setAccount }) => {

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const dispatch = useDispatch()
    const { t } = useTranslation();

    const submit = async (data) => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/auth/recovery`

        await axios.post(url, data)
            .then(res => {
                setAccount(res.data.account)
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
            .finally(() => dispatch(setLoad(true)));
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
            <Input
                icon={<At />}
                id="Email"
                name="Email"
                type="email"
                label={t("Account email")}
                placeholder={t("Email")}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required:
                            t('Email is required'),
                            validate: {
                                isEmailValid: (value) => {
                                    if (!isEmailValid(value)) {
                                        return t('Invalid email format');
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                }}
            />

            <PrimaryButton type="submit">
                {t("Send recovery code")}
            </PrimaryButton>
        </form>
    )
}
