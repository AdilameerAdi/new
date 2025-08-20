import selectCompatible from '../../../../utils/selectCompatible';
import { PrimaryButton } from '../../../elements/PrimaryButton'
import { CustomSelect } from '../../../elements/CustomSelect';
import { Ticket2, User } from '../../../../../public/icons/Svg'
import { Input } from '../../../elements/Input';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react'
import { charactersThunk } from '../../../../store/slices/character.slice';
import { setLoad } from '../../../../store/slices/loader.slice';
import apiConfig from '../../../../utils/apiConfig';
import axios from 'axios';
import Swal from 'sweetalert2';
import appError from '../../../../utils/appError';
import { accountThunk } from '../../../../store/slices/account.slice';
import { useTranslation } from 'react-i18next';

export const RedeemCouponForm = ({ setModal }) => {
 
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { register, handleSubmit, setValue, reset, formState: { errors }} = useForm();

    const characters = useSelector( (state) => state.characters);

    const [characterId, setCharacterId] = useState(null)

    const submit = async (data) => {

        dispatch(setLoad(false));

        const url = `${apiConfig().endpoint}/coupons/claim`

        await axios.post(url, data, apiConfig().axios)
            .then(res => {
                Swal.fire({
                    icon: 'success',
                    title: 'Congrats!',
                    text: res.data.message,
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
                dispatch(accountThunk())
                dispatch(setLoad(true))
            })
    }

    useEffect(() => {
        dispatch(charactersThunk())
    }, [])

    useEffect(() => {
        setValue('characterId', characterId);
    }, [characterId]);

    return (
        <form className="flex flex-col justify-center h-full gap-3" onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col justify-evenly gap-4 border border-dashed border-black/20 dark:border-gray-500 p-3 rounded-2xl">
                <Input
                    icon={<Ticket2 />}
                    id="code"
                    name="code"
                    type="text"
                    placeholder={t("Insert coupon code")}
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
                <div>
                <CustomSelect 
                    id="characterId"
                    name="characterId"
                    placeholder={t("Select character")}
                    data={selectCompatible(characters, 'id', 'name', '/img/class/%class%_%gender%.png')}
                    onChange={(selected) => {
                        setCharacterId(selected.value)
                    }}
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required: t('You should select any character'),
                            },
                        },
                    }}
                />
                </div>
            </div>
            <PrimaryButton variant="outline" type="submit">
                {t("Redeem")}
            </PrimaryButton>                
        </form>
    )
}
