import React from 'react'
import { useForm } from 'react-hook-form';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { Input } from '../../../../elements/Input';
import { Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material';
import { Discord } from '../../../../../../public/icons/Svg';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { useDispatch } from 'react-redux';
import apiConfig from '../../../../../utils/apiConfig';
import axios from 'axios';
import Swal from 'sweetalert2';
import appError from '../../../../../utils/appError';
import { publicThunk } from '../../../../../store/slices/public.slice';

export const SocialConfig = ({ data }) => {

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const dispatch = useDispatch()

    const submit = async (data) => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/admin/control/social`;

        await axios
            .patch(url, data, apiConfig().axios)
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
                id="discord"
                name="discord"
                type="url"
                label="Discord"
                placeholder={data.discord}
                defaultValue={data.discord}
                icon={<Discord />}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                    },
                }}
            />
            <Input
                id="discord_id"
                name="discord_id"
                type="number"
                label="Discord ID (Widget)"
                placeholder={data.discord_id}
                defaultValue={data.discord_id}
                icon={<Discord />}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                    },
                }}
            />
            <Input
                id="facebook"
                name="facebook"
                type="url"
                label="Facebook"
                placeholder={data.facebook}
                defaultValue={data.facebook}
                icon={<Facebook className="text-gray-500"/>}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                    },
                }}
            />                    
            <Input
                id="twitter"
                name="twitter"
                type="url"
                label="Twitter"
                placeholder={data.twitter}
                defaultValue={data.twitter}
                icon={<Twitter className="text-gray-500"/>}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                    },
                }}
            />
            <Input
                id="instagram"
                name="instagram"
                type="url"
                label="Instagram"
                placeholder={data.instagram}
                defaultValue={data.instagram}
                icon={<Instagram className="text-gray-500"/>}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                    },
                }}
            />
            <Input
                id="youtube"
                name="youtube"
                type="url"
                label="Youtube"
                placeholder={data.youtube}
                defaultValue={data.youtube}
                icon={<YouTube className="text-gray-500"/>}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                    },
                }}
            />
            <hr className="border-black/20 dark:border-admin-dark-500"/>
            <PrimaryButton type="submit">
                Save
            </PrimaryButton>
        </form>
    )
}
