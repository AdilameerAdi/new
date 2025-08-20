import { Eye, EyeSlash, GoogleIcon, Lock, User } from '../../../../../../public/icons/Svg'
import { auth, googleProvider } from '../../../../../utils/firebaseConfig'
import { setLoad } from '../../../../../store/slices/loader.slice'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import apiConfig from '../../../../../utils/apiConfig'
import appError from '../../../../../utils/appError'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../../../elements/Input'
import { Card } from '../../../../elements/Card'
import { signInWithPopup } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

export const LoginForm = ({ setAccount }) => {

    const Username = sessionStorage.getItem('Username') 

    const [hide, setHide] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors }} = useForm();
  
    const switchAccount = () => {
        sessionStorage.removeItem("Username")
        navigate("/login")
    }

    const remember = (data) => {
        if(data.remember) {
            sessionStorage.setItem('Username', data.Name);
        }
        else {
            sessionStorage.removeItem('Username')
        }
    }

    const trigger = (res) => {

        if(res.status === 200) {
            sessionStorage.setItem('authToken', res.data.token);
            navigate("/home")
        }

        else if(res.status === 201) {
            navigate("/register", { state: { data: res.data } })
        }

        else if(res.status === 202) {
            setAccount(res.data.account)
        }
    }

    const firebase = async (token) => {
        dispatch(setLoad(false));
  
        const url = `${apiConfig().endpoint}/auth/login/firebase`;
        
        await axios.post(url, { token })
            .then((res) => trigger(res))
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

    const google = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            await firebase(res.user.accessToken)
        } catch (err) {
            appError(err);
        }
    };

    const submit = async (data) => {

        dispatch(setLoad(false));

        const url = `${apiConfig().endpoint}/auth/login`;

        const formData = data

        if(Username) {
            formData.Name = Username
            formData.remember = true
        }

        await axios.post(url, formData)
            .then((res) => {
                trigger(res)
                remember(formData)
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
    };

    return (
        <div className="flex flex-col gap-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
                {
                    Username ? 
                        <div className="flex flex-col gap-2 items-center text-black dark:text-white !p-2 border border-black/20 dark:border-gray-500 rounded-lg">
                            <h3 className="text-lg">{t("Hi")}, {Username}</h3>
                            <div className="flex gap-1 items-center text-sm">
                                <span>{t("Not you?")}</span>
                                <button type="button" className="hover:underline text-blue-400" onClick={switchAccount}>
                                    {t("Switch account")}
                                </button>
                            </div>
                        </div>  
                    :
                        <Input
                            icon={<User />}
                            id="Name"
                            name="Name"
                            type="text"
                            label={t("Username")}
                            placeholder={t("Username")}
                            element={
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" id="remember" {...register("remember")}/>
                                    <span className="text-sm text-gray-500">{t("Remember")}</span>
                                </label>
                            }
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                    rules: {
                                        required:
                                        t('Username is required'),
                                    },
                                },
                            }}
                        />
                    }


                <Input
                    icon={<Lock />}
                    id="Password"
                    name="Password"
                    type={hide ? 'password' : 'text'}
                    label={t("Password")}
                    placeholder={t("Password")}
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required:
                                t('Password is required'),
                            },
                        },
                    }}
                    helperLink={{
                        url: '/recovery',
                        text: t('Forgot password?')
                    }}
                    element={
                        <button type="button" onClick={() => setHide(!hide)} >
                            {hide ? (<Eye /> ) : ( <EyeSlash />)}
                        </button>
                    }
                />

                <div className="text-center">
                    <Link to={'/register'} className="text-sm text-blue-400 hover:underline">
                        {t("Don't have an account?")}
                    </Link>
                </div>

                <PrimaryButton type="submit">
                    {t("Login")}
                </PrimaryButton>
            </form>
            <div className="flex gap-2 items-center justify-center">
                <hr className="flex-grow border-black/20 dark:border-gray-500"/>
                <span className="text-xs text-center uppercase font-medium text-black/50 dark:text-gray-500">
                    {t("Or log in with")}
                </span>
                <hr className="flex-grow border-black/20 dark:border-gray-500"/>
            </div>
            <PrimaryButton variant="outline" className="flex justify-center" onClick={google}>
                <GoogleIcon />
            </PrimaryButton>
        </div>
    )
}
