import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Input } from '../../../../elements/Input';
import { SwitchCustom } from '../../../../elements/SwitchCustom';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { Download, File, Website } from '../../../../../../public/icons/Svg';
import { setLoad } from '../../../../../store/slices/loader.slice';
import apiConfig from '../../../../../utils/apiConfig';
import axios from 'axios';
import Swal from 'sweetalert2';
import appError from '../../../../../utils/appError';
import { publicThunk } from '../../../../../store/slices/public.slice';

export const LauncherConfig = ({ data }) => {

    const [external, setExternal] = useState(data?.external?.status)

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const dispatch = useDispatch()

    const submit = async (data) => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/admin/control/launcher`;

        let formData = data
        formData.external = external

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
            <SwitchCustom
                checked={external}
                setChecked={setExternal}
                label="External url"
            />
            {   external ?
                    <Input
                        id="url"
                        name="url"
                        type="url"
                        label="Dowload URL"
                        placeholder={data.external.url}
                        defaultValue={data.external.url}
                        icon={<Download />}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required: 'URL is required',
                                },
                            },
                        }}
                    />
                :
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <Input
                                id="filename"
                                name="filename"
                                type="text"
                                label="File name"
                                placeholder={data.filename}
                                defaultValue={data.filename}
                                element={
                                    <select
                                        className={"dark:bg-admin-dark-600 bg-admin-light-600 focus-visible:outline-none pr-2 cursor-pointer"}
                                        defaultValue={data.extension}
                                        {...register("extension", {
                                            required: true,
                                        })}
                                    >
                                        <option value="exe">.exe</option>
                                        <option value="rar">.rar</option>
                                    </select>
                                }
                                icon={<File />}
                                register={{
                                    function: register,
                                    errors: {
                                        function: errors,
                                        rules: {
                                            required: 'File name is required',
                                        },
                                    },
                                }}
                            />
                        </div>
                        <Input
                            id="version"
                            name="version"
                            type="text"
                            label="Version"
                            placeholder={data.version}
                            defaultValue={data.version}
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                    rules: {
                                        required: 'Version is required',
                                    },
                                },
                            }}
                        />
                    </div>
            }
            <hr className="border-black/20 dark:border-admin-dark-500"/>
            <PrimaryButton type="submit">
                Save
            </PrimaryButton>
        </form>
    )
}
