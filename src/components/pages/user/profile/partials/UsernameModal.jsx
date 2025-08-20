import { accountThunk } from '../../../../../store/slices/account.slice';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { User } from '../../../../../../public/icons/Svg';
import apiConfig from '../../../../../utils/apiConfig';
import appError from '../../../../../utils/appError';
import { Input } from '../../../../elements/Input';
import Modal from '../../../../elements/Modal'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const UsernameModal = ({ modal, setModal, data }) => {

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const submit = async (data) => {

        dispatch(setLoad(false));
    
        const url = `${apiConfig().endpoint}/auth/username`;
  
        await axios
            .post(url, data, apiConfig().axios)
            .then((res) => {
                Swal.fire({
                    toast: true,
                    icon: 'success',
                    position: 'bottom-right',
                    text: res.data.message,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 5000,
                });
            })
            .catch((err) => {
                appError(err);
                Swal.fire({
                    toast: true,
                    icon: 'error',
                    position: 'bottom-right',
                    text: err.response.data.message,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 5000,
                });
            })
            .finally(() => {
                dispatch(accountThunk())
                dispatch(setLoad(true))
                setModal(false)
            });
    };

    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={t('Change public username')}
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
                <Input
                    icon={<User />}
                    id="web_username"
                    name="web_username"
                    type="text"
                    label={t("Public username")}
                    placeholder={data?.web_username}
                    defaultValue={data?.web_username}
                    autoComplete="off"
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required: t('Username is required'),
                                minLength: {
                                    value: 6,
                                    message: t('Must be at least 6 characters'),
                                },
                            },
                        },
                    }}
                />
                <PrimaryButton type="submit">
                    {t("Update")}
                </PrimaryButton>
            </form>
        </Modal>    
    )
}
