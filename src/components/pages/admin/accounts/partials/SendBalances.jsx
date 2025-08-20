import { Badge, Coin, Diamond } from '../../../../../../public/icons/Svg';
import { usersThunk } from '../../../../../store/slices/users.slice';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import apiConfig from '../../../../../utils/apiConfig';
import appError from '../../../../../utils/appError';
import { Input } from '../../../../elements/Input';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';

export const SendBalances = () => {

  const { register, handleSubmit, formState: { errors }, } = useForm();

  const dispatch = useDispatch()

  const [nameType, setNameType] = useState(0)
  const [type, setType] = useState(0)

  const submit = async (data) => {

    dispatch(setLoad(false))

    const url = `${apiConfig().endpoint}/services/admin/coins/send`

    let formData = data

    formData.type = type
    formData.nameType = nameType

    await axios.post(url, formData, apiConfig().axios)
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
        dispatch(usersThunk())
        dispatch(setLoad(true))
      });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <hr className="border-black/20 dark:border-admin-dark-500"/>
      <div className="flex flex-col gap-2">
        <label class="text-sm text-gray-500">Name type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-500">
          <button onClick={() => setNameType(0)} type="button"
            className={`p-2 text-center rounded-lg ${nameType === 0 ? 'border-2 border-blue-500 text-blue-500' : 'border border-black/20 dark:border-gray-500'}`}
          >
            <span>Character</span>
          </button>
          <button onClick={() => setNameType(1)} type="button"
            className={`p-2 text-center rounded-lg ${nameType === 1 ? 'border-2 border-blue-500 text-blue-500' : 'border border-black/20 dark:border-gray-500'}`}
          >
            <span>Username</span>
          </button>
        </div>
      </div>
      <Input
        icon={<Badge />}
        id="Name"
        name="Name"
        type="text"
        label={nameType === 0 ? 'Character name' : 'Username'}
        placeholder={`Insert ${nameType === 0 ? 'character name' : 'username'}`}
        register={{
          function: register,
          errors: {
            function: errors,
            rules: {
              required: `${nameType === 0 ? 'Character name' : 'Username'} is required`,
            },
          },
        }}
      />
      <div className="flex flex-col gap-2">
        <label class="text-sm text-gray-500">Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-500">
          <button onClick={() => setType(0)} type="button"
            className={`p-2 text-center rounded-lg ${type === 0 ? 'border-2 border-blue-500 text-blue-500' : 'border border-black/20 dark:border-gray-500'}`}
          >
            <span>Coins</span>
          </button>
          <button onClick={() => setType(1)} type="button"
            className={`p-2 text-center rounded-lg ${type === 1 ? 'border-2 border-blue-500 text-blue-500' : 'border border-black/20 dark:border-gray-500'}`}
          >
            <span>Gems</span>
          </button>
        </div>
      </div>
      <Input
        icon={type === 0 ? <Coin /> : <Diamond />}
        id="amount"
        name="amount"
        type="number"
        label="Amount"
        min="1"
        placeholder="Insert coins amount"
        register={{
          function: register,
          errors: {
            function: errors,
            rules: {
              required: 'Amount is required',
            },
          },
        }}
      />
      <PrimaryButton type="submit">
        Send {type === 0 ? 'coins' : 'gems'}
      </PrimaryButton>
    </form>
  )
}
