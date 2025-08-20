import React, { useState } from 'react'
import { Input } from '../../../../elements/Input';
import { At, Eye, EyeSlash, Lock, User } from '../../../../../../public/icons/Svg';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import apiConfig from '../../../../../utils/apiConfig';
import axios from 'axios';
import Swal from 'sweetalert2';
import { setLoad } from '../../../../../store/slices/loader.slice';
import isEmailValid from '../../../../../utils/isEmailValid';
import { Maintenance } from '../../../../shared/Maintenance';
import appError from '../../../../../utils/appError';
import { useTranslation } from 'react-i18next';

export const RegisterForm = ({ setAccount, firebase }) => {

    const [hide, setHide] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors }, } = useForm();

    const publicData =  useSelector(state => state.publicData)
  
    const isFirstLetterUpperCase = (value) => {
      return /^[A-Z]/.test(value);
    };
  
    const containsSpecialCharacters = (value) => {
      const regex = /^[A-Za-z0-9]+$/;
      return regex.test(value);
    };
  
    const submit = async (data) => {
      dispatch(setLoad(false));
  
      const url = `${apiConfig().endpoint}/auth/register`;

      let formData = data

      if(firebase) {
        formData.Email = firebase.email
        formData.email_verified = firebase.email_verified
      }

      await axios
        .post(url, formData)
        .then((res) => {
            if(res.status === 200) setAccount(res.data.account)
            if(res.status === 201)
            Swal.fire({
                icon: 'success',
                title: 'Done!',
                text: res.data.message,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            }).then(() => navigate('/'));
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

    if(publicData.id) {

        if(publicData.web_general.register_status)
            return (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
                    <Input
                        icon={<User />}
                        id="Name"
                        name="Name"
                        type="text"
                        label={t("Username")}
                        placeholder={t("Username")}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required: t('Username is required'),
                                    validate: {
                                        isFirstLetterUpperCase: (value) => {
                                            if (!isFirstLetterUpperCase(value)) {
                                                return t('The first letter must be uppercase');
                                            }
                                            return true;
                                        },
                                        containsSpecialCharacters: (value) => {
                                            if (!containsSpecialCharacters(value)) {
                                                return t('No special characters or blank spaces are allowed');
                                            }
                                            return true;
                                        },
                                    },
                                    minLength: {
                                        value: 4,
                                        message: t('Must be at least 4 characters'),
                                    },
                                },
                            },
                        }}
                    />
                
                    { firebase ?

                        <Input
                            icon={<At />}
                            id="Email"
                            name="Email"
                            type="email"
                            label={t("Email")}
                            placeholder={t("Email")}
                            defaultValue={firebase.email}
                            disabled={true}
                        />
                    :
                        <Input
                            icon={<At />}
                            id="Email"
                            name="Email"
                            type="email"
                            label={t("Email")}
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
                                            if (
                                                !isEmailValid(value)
                                            ) {
                                                return t('Invalid email format');
                                            }
                                            return true;
                                        },
                                        },
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
                                required: t('Password is required'),
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
                        id="PasswordRepeat"
                        name="PasswordRepeat"
                        type={hide ? 'password' : 'text'}
                        label={t("Repeat password")}
                        placeholder={t("Repeat password")}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required: t('Password is required'),
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

                    <div className="text-center">
                        <Link
                            to={'/login'}
                            className="text-sm text-blue-400 hover:underline"
                        >
                            {t("Already registered? Log In")}
                        </Link>
                    </div>

                    <PrimaryButton type="submit">
                        {t("Register")}
                    </PrimaryButton>
                </form>
            )
        
        return <Maintenance icon={false} data={publicData} message="Register is not available" />
    }
}
