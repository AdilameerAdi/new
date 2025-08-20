import React, { useState } from 'react'
import { Input } from '../../../../elements/Input';
import { At, CheckCircle } from '../../../../../../public/icons/Svg';
import isEmailValid from '../../../../../utils/isEmailValid';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { setLoad } from '../../../../../store/slices/loader.slice';
import apiConfig from '../../../../../utils/apiConfig';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import appError from '../../../../../utils/appError';
import { useTranslation } from 'react-i18next';

export const UpdateEmailForm = ({ setEmail }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { register, handleSubmit, formState: { errors }} = useForm();
  
    const account = useSelector(state => state.account)
  
    const emailValidation = (NewEmail, NewEmailRepeat) => {
  
        let status =  true
        let message = ''
    
        if(NewEmail.toLowerCase() !== NewEmailRepeat.toLowerCase()){ 
            message = t('Emails do not match')
            status = false
        }
    
        if(NewEmail.toLowerCase() === account.email.toLowerCase()){ 
            message = t('The email must be different from the current email')
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

        if(emailValidation(data.NewEmail, data.NewEmailRepeat)){
    
          dispatch(setLoad(false))
    
          const url = `${apiConfig().endpoint}/auth/update/email/`
    
          await axios.patch(url, data, apiConfig().axios)
            .then(res => setEmail(res.data.account.email))
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
            .then(() => dispatch(setLoad(true)))
        }
    
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
            <Input
                icon={<At />}
                id="ActualEmail"
                name="ActualEmail"
                type="email"
                label={t("Actual email")}
                placeholder={t("Email")}
                disabled
                defaultValue={account.email}
                element={<span title={t("Verified")}><CheckCircle color="green" /></span>}
            />
            <Input
                icon={<At />}
                id="NewEmail"
                name="NewEmail"
                type="email"
                label={t("New email")}
                placeholder={t("Insert new email")}
                autoComplete="off"
                register={{
                    function: register,
                    errors: {
                    function: errors,
                    rules: {
                        required: t('New email is required'),
                        validate: {
                            isEmailValid: (value) => {
                                if ( !isEmailValid(value) ) {
                                    return t('Invalid email format');
                                }
                                return true;
                            },
                        },
                    },
                    },
                }}
            />
            <Input
                icon={<At />}
                id="NewEmailRepeat"
                name="NewEmailRepeat"
                type="email"
                label={t("Repeat new email")}
                placeholder={t("Insert new email again")}
                autoComplete="off"
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: t('New mail repeat is required'),
                            validate: {
                            isEmailValid: (value) => {
                                if ( !isEmailValid(value) ) {
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
                {t("Update email")}
            </PrimaryButton>
        </form>
    )
}
