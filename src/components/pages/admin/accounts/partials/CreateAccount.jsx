import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { At, Coin, Diamond, Eye, EyeSlash, Lock, ShieldUser, User } from '../../../../../../public/icons/Svg';
import { Input } from '../../../../elements/Input';
import isEmailValid from '../../../../../utils/isEmailValid';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { CustomSelect } from '../../../../elements/CustomSelect';
import selectCompatible from '../../../../../utils/selectCompatible';
import axios from 'axios';
import apiConfig from '../../../../../utils/apiConfig';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { useDispatch } from 'react-redux';
import appError from '../../../../../utils/appError';
import Swal from 'sweetalert2';
import { usersThunk } from '../../../../../store/slices/users.slice';

const authorityArray = [
  {
    id: 1,
    label: "Unverified",
    value: -1
  },
  {
    id: 1,
    label: "User",
    value: 0
  },
  {
    id: 1,
    label: "Administrator",
    value: 30000
  },
]

export const CreateAccount = () => {

  const dispatch = useDispatch()

  const { register, handleSubmit, reset, setValue, formState: { errors }, } = useForm();

  const [hide, setHide] = useState(true);
  const [authority, setAuthority] = useState(authorityArray[1].value)

  const isFirstLetterUpperCase = (value) => {
    return /^[A-Z]/.test(value);
  };

  const containsSpecialCharacters = (value) => {
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(value);
  };

  const submit = async (data) => {
    
    dispatch(setLoad(false));
  
    const url = `${apiConfig().endpoint}/auth/admin/register`;

    let formData = data
    data.Authority = authority

    await axios
      .post(url, formData, apiConfig().axios)
      .then((res) => {
        reset()
        Swal.fire({
          icon: 'success',
          title: 'Done!',
          text: res.data.message,
          showConfirmButton: false,
          timer: 3000,
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
        dispatch(usersThunk())
        dispatch(setLoad(true))
      });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <hr className="border-black/20 dark:border-admin-dark-500"/>
      <CustomSelect
        icon={<ShieldUser />}
        isSearchable
        label="Authority"
        name="Authority"
        id="Authority"
        onChange={(selected) => setAuthority(selected.value)}
        data={selectCompatible(authorityArray, 'value', 'label')}
        defaultValue={authorityArray[1]}
      /> 
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          icon={<Coin />}
          id="Coins"
          name="Coins"
          type="number"
          label="Coins"
          placeholder="Insert any amount"
          min="0"
          defaultValue="0"
          register={{
            function: register,
            errors: {
              function: errors,
              rules: {
                required: 'Coins is required',
              },
            },
          }}
        />
        <Input
          icon={<Diamond />}
          id="Gems"
          name="Gems"
          type="number"
          label="Gems"
          placeholder="Insert any amount"
          min="0"
          defaultValue="0"
          register={{
            function: register,
            errors: {
              function: errors,
              rules: {
                required: 'Gems is required',
              },
            },
          }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          icon={<User />}
          id="Name"
          name="Name"
          type="text"
          label="Username"
          placeholder="Username"
          register={{
            function: register,
            errors: {
              function: errors,
              rules: {
                required: 'Username is required',
                validate: {
                  isFirstLetterUpperCase: (value) => {
                    if (!isFirstLetterUpperCase(value)) {
                      return 'The first letter must be uppercase';
                    }
                    return true;
                  },
                  containsSpecialCharacters: (value) => {
                    if (!containsSpecialCharacters(value)) {
                      return 'No special characters or blank spaces are allowed';
                    }
                    return true;
                  },
                },
                minLength: {
                  value: 4,
                  message: 'Must be at least 4 characters',
                },
              },
            },
          }}
        />
        <Input
          icon={<At />}
          id="Email"
          name="Email"
          type="email"
          label="Email"
          placeholder="Email"
          register={{
            function: register,
            errors: {
              function: errors,
              rules: {
                required: 'Email is required',
                validate: {
                  isEmailValid: (value) => {
                    if ( !isEmailValid(value)) {
                      return 'Invalid email format';
                    }
                    return true;
                  },
                },
              },
            },
          }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          icon={<Lock />}
          id="Password"
          name="Password"
          type={hide ? 'password' : 'text'}
          label="Password"
          placeholder="Password"
          register={{
            function: register,
            errors: {
              function: errors,
              rules: {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Must be at least 8 characters',
                },
              },
            },
          }}
          element={
            <button type="button" onClick={() => setHide(!hide)} >
              {hide ? (<Eye />) : (<EyeSlash />)}
            </button>
          }
        />
        <Input
          icon={<Lock />}
          id="PasswordRepeat"
          name="PasswordRepeat"
          type={hide ? 'password' : 'text'}
          label="Repeat password"
          placeholder="Repeat password"
          register={{
            function: register,
            errors: {
              function: errors,
              rules: {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Must be at least 8 characters',
                },
              },
            },
          }}
          element={
            <button type="button" onClick={() => setHide(!hide)} >
              {hide ? (<Eye />) : (<EyeSlash />)}
            </button>
          }
        />
      </div>
      <PrimaryButton type="submit">
        Create account
      </PrimaryButton>
    </form>
  )
}
