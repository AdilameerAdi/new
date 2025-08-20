import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setLoad } from '../../../../store/slices/loader.slice';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Input } from '../../../elements/Input';
import { Badge, Coin } from '../../../../../public/icons/Svg';
import { PrimaryButton } from '../../../elements/PrimaryButton';
import apiConfig from '../../../../utils/apiConfig';
import { accountThunk } from '../../../../store/slices/account.slice';
import appError from '../../../../utils/appError';
import { useTranslation } from 'react-i18next';

export const SendCoinsForm = ({ setOpen }) => {

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const account = useSelector(state => state.account)

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const validations = (data) => {
        if(data.amount > account.balance) {
            return Swal.fire({
                toast: true,
                position: 'bottom-right',
                icon: 'error',
                text: 'Insuficient balance',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            });
        }

        if(data.amount < 1) {
            return Swal.fire({
                toast: true,
                position: 'bottom-right',
                icon: 'error',
                text: 'Invalid amount',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            });
        }

        return false
    }

    const submit = async (data) => {

        if(!validations(data)) {

            dispatch(setLoad(false))

            const url = `${apiConfig().endpoint}/services/coins/send`

            await axios.post(url, data, apiConfig().axios)
                .then(res => {
                    setOpen(false)
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
                    })
                })
                .finally(() => {
                    dispatch(accountThunk())
                    dispatch(setLoad(true))
                });
        }
        else return validations(data)
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
            <Input
                icon={<Badge />}
                id="Name"
                name="Name"
                type="text"
                label={t("Character name")}
                size="lg"
                placeholder={t("Insert character name")}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: t('Character name is required'),
                        },
                    },
                }}
            />
            <Input
                icon={<Coin />}
                id="amount"
                name="amount"
                type="number"
                label={t("Amount")}
                size="lg"
                min="1"
                placeholder={t("Insert coins amount")}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: t('Amount is required'),
                        },
                    },
                }}
            />
            <PrimaryButton type="submit" size="lg">{t("Send coins")}</PrimaryButton>
        </form>
    )
}
