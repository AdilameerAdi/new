import React, { useEffect, useState } from 'react'
import Modal from '../../../../elements/Modal'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setLoad } from '../../../../../store/slices/loader.slice';
import axios from 'axios';
import { wheelItemsThunk } from '../../../../../store/slices/wheelItems.slice';
import Swal from 'sweetalert2';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { SwitchCustom } from '../../../../elements/SwitchCustom';
import { Input } from '../../../../elements/Input';
import apiConfig from '../../../../../utils/apiConfig';
import appError from '../../../../../utils/appError';
import { BarcodeScanner, Package } from '../../../../../../public/icons/Svg';

export const UpdateWheelItems = ({ modal, setModal, item }) => {

  const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

  const dispatch = useDispatch()

  const [jackpot, setJackpot] = useState(item.jackpot)
  const [stackeable, setStackeable] = useState(item.stackeable)

  const handleUpdate = async (data) => {

    const url = `${apiConfig().endpoint}/wheel/${item.id}`

    const body = {
      vnum: data.vnum,
      jackpot,
      stackeable,
      stack: data.stack || 1,
    }

    dispatch(setLoad(false));

    await axios.patch(url, body, apiConfig().axios)
      .then(() => {
        Swal.fire({
          toast: true,
          position: 'bottom-right',
          icon: 'success',
          text: 'The shop item was updated successfully!',
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
        dispatch(wheelItemsThunk())
        dispatch(setLoad(true))
      })

  }

  useEffect(() => {
    setJackpot(item.jackpot)
    setStackeable(item.stackeable)
  }, [item])

  if(item.id)

    return (
      <Modal
        open={modal}
        setOpen={setModal}
        title={'Update wheel item'}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleUpdate)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="sm:col-span-1">
              <Input
                icon={<BarcodeScanner />}
                id="vnum"
                name="vnum"
                type="number"
                label="VNum"
                min="1"
                defaultValue={item.item.vnum}
                placeholder="Insert vnum"
                register={{
                  function: register,
                  errors: {
                    function: errors,
                    rules: { required: 'VNum is required' },
                  },
                }}
              />
            </div>
            <div className="sm:col-span-1">
              <Input
                icon={<Package />}
                id="stack"
                name="stack"
                type="number"
                label="Stackeable"
                min="1"
                max="999"
                placeholder="Insert stack"
                defaultValue={item.stack}
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
                  },
                }}
              />
            </div>
            <SwitchCustom
              checked={jackpot}
              setChecked={setJackpot}
              label='Jackpot'
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SecondaryButton type="button" onClick={() => setModal(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit">Accept</PrimaryButton>
          </div>
        </form>
      </Modal>
    )
}
