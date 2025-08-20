import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Modal from '../../../../elements/Modal';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import apiConfig from '../../../../../utils/apiConfig';
import axios from 'axios';
import Swal from 'sweetalert2';
import appError from '../../../../../utils/appError';
import { planThunk } from '../../../../../store/slices/plan.slice';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { Textarea } from '../../../../elements/Textarea';
import { Input } from '../../../../elements/Input';
import { Coin, Payments } from '../../../../../../public/icons/Svg';

export const UpdatePlan = ({ modal, setModal, plan }) => {

  const dispatch = useDispatch()

  const { register, handleSubmit, watch, reset, setValue, formState: { errors }} = useForm();

  const submit = async (data) => {

    const url = `${apiConfig().endpoint}/plans/${plan.id}`

    dispatch(setLoad(false));

    await axios.patch(url, data, apiConfig().axios)
      .then(() => {
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
        setModal(false)
        dispatch(planThunk(true))
        dispatch(setLoad(true))
      })

  }

  useEffect(() => {
    setValue('amount', plan?.amount); 
    setValue('price', plan?.price); 
    setValue('description', plan?.description);
  }, [plan]);

  return (
    <Modal
      open={modal}
      setOpen={setModal}
      title={'Update Plan'}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="amount"
              name="amount"
              type="number"
              label="Coins amount"
              min="1"
              defaultValue={plan.amount}
              icon={<Coin />}
              placeholder="Insert the amount of coins"
              register={{
                function: register,
                errors: {
                  function: errors,
                  rules: {
                    required: 'Amount is required'
                  },
                },
              }}
            />
            <Input
              id="price"
              name="price"
              type="number"
              label="Coins price"
              defaultValue={plan.price}
              icon={<Payments />}
              min="1"
              placeholder="Insert the price of coins"
              register={{
                function: register,
                errors: {
                  function: errors,
                  rules: {
                    required: 'Price is required'
                  },
                },
              }}
            />
          </div>
          <Input
            id="methods"
            name="methods"
            label="Plan method"
            defaultValue={plan.plan_method?.name}
            disabled
          />
          <Textarea
            id="description"
            rows="3"
            name="description"
            label="Description"
            placeholder="Insert description"
            defaultValue={plan.description}
            register={{
              function: register,
              errors: {
                function: errors,
              },
            }}
          /> 
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SecondaryButton type="button" onClick={() => setModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit">
              Accept
            </PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}
