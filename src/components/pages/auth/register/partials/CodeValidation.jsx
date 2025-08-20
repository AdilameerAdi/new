import React from 'react'
import { Envelope, Lock } from '../../../../../../public/icons/Svg'
import { Input } from '../../../../elements/Input';
import { useForm } from 'react-hook-form';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { useDispatch } from 'react-redux';
import { setLoad } from '../../../../../store/slices/loader.slice';
import apiConfig from '../../../../../utils/apiConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import appError from '../../../../../utils/appError';
import { useTranslation } from 'react-i18next';

export const CodeValidation = ({ account }) => {

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const reSendCode = async () => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/auth/code`

        const formData = { Email: account.email }

        await axios.post(url, formData)
        .then(res => { 
            Swal.fire({
                toast: true,
                position: 'bottom-right',
                icon: 'success',
                text: res.data.message,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            })
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

    const submit = async (data) => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/auth/register/validation/`

        let formData = data

        formData.AccountId = account.accountId

        await axios.post(url, formData)
            .then(res => { 
                Swal.fire({
                    icon: 'success',
                    title: 'Done!',
                    text: res.data.message,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                }).then(() => navigate('/'));
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

    return (
        <form className="flex flex-col gap-4 justify-center items-center" onSubmit={handleSubmit(submit)}>
            <Envelope size={80} color="green" />
            <p className="text-sm text-center">
                {t("We have sent a verification code to your email address")} <br /><b>{account.email}</b>, {t("please enter it here.")}
            </p>
            <Input
                icon={<Lock />}
                id="code"
                name="code"
                maxLength="6"
                full
                label={t("Verification code")}
                helperLink={{ url: "", text: <button type="button" onClick={reSendCode}>{t("Send again")}</button> }}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: t('Code is required'),
                        },
                    },
                }}
            />
            <PrimaryButton type="submit" className="w-full">
                {t("Validate")}
            </PrimaryButton>
        </form>
    )
}
