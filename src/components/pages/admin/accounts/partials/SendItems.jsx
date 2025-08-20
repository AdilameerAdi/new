import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Input } from '../../../../elements/Input';
import { Add, Badge, BarcodeScanner, Package, Remove } from '../../../../../../public/icons/Svg';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import axios from 'axios';
import Swal from 'sweetalert2';
import appError from '../../../../../utils/appError';
import { setLoad } from '../../../../../store/slices/loader.slice';
import apiConfig from '../../../../../utils/apiConfig';
import { useDispatch } from 'react-redux';
import { SwitchCustom } from '../../../../elements/SwitchCustom';

export const SendItems = () => {

  const { register, handleSubmit, reset, formState: { errors }, } = useForm();

  const [itemQty, setItemQty] = useState(1)
  const [stackeable, setStackeable] = useState(false)

  const dispatch = useDispatch()

  const itemQuantity = (action) => {

    if(action){
      itemQty < 99 ? setItemQty(itemQty + 1) : setItemQty(99)
    }
    else {
      itemQty > 1  ? setItemQty(itemQty - 1) : setItemQty(1)
    }
  }

  const submit = async (data) => {

    let formData = data

    formData.stackeable = stackeable

    dispatch(setLoad(false));
  
    const url = `${apiConfig().endpoint}/items/send`;

    await axios
      .post(url, formData, apiConfig().axios)
      .then((res) => {
        reset()
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
        });
      })
      .finally(() => dispatch(setLoad(true)));

  }
  
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <hr className="border-black/20 dark:border-admin-dark-500"/>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            icon={<BarcodeScanner />}
            id="vnum"
            name="vnum"
            type="number"
            label="VNum"
            placeholder="Insert VNum"
            min="1"
            register={{
              function: register,
              errors: {
                function: errors,
                rules: {
                  required: true,
                },
              },
            }}
            element={
              <div className="flex border-l pl-2 border-black/20 dark:border-gray-500">
                <button 
                  className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700" 
                  onClick={() => itemQuantity(false)}
                  type="button" 
                >
                  <Remove size={20} />
                </button>
                <input 
                  type="text"
                  name="quantity"
                  maxLength="2"
                  className="bg-transparent text-center max-w-[40px]"
                  {...register("quantity", {
                    required: "Quantity field is required",
                    pattern: {
                      value: /^[1-9][0-9]?$/,
                      message: "Quantity must be between 1 and 99",
                    },
                  })}
                  onChange={(e) => setItemQty(Number(e.target.value))}
                  defaultValue={itemQty}
                  value={itemQty}
                />
                <button type="button" className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700" onClick={() => itemQuantity(true)}>
                  <Add size={20} />
                </button>                        
              </div>
            }
          />
          <Input
            icon={<Package />}
            id="stack"
            name="stack"
            type="number"
            label="Stackeable"
            min="1"
            max="999"
            placeholder="Stack"
            disabled={!stackeable}
            element={
              <SwitchCustom
                checked={stackeable}
                setChecked={setStackeable}
              />
            }
            register={{
              function: register,
              errors: {
                function: errors,
                rules: {
                  required: stackeable,
                },
              },
            }}
          />
        </div>
        <Input
          icon={<Badge />}
          id="Name"
          name="Name"
          type="text"
          label="Character name"
          placeholder="Insert character name"
          register={{
            function: register,
            errors: {
              function: errors,
              rules: {
                required: true,
              },
            },
          }}
        />
      </div>
      <PrimaryButton>Send item</PrimaryButton>
    </form>
  )
}
