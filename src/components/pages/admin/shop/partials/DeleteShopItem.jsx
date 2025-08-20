import React from 'react'
import Modal from '../../../../elements/Modal'
import { useDispatch } from 'react-redux'
import apiConfig from '../../../../../utils/apiConfig'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import Swal from 'sweetalert2'
import { shopItemsThunk } from '../../../../../store/slices/shopItems.slice'
import { Exclamation } from '../../../../../../public/icons/Svg'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import appError from '../../../../../utils/appError'

export const DeleteShopItem = ({ modal, setModal, item }) => {

  const dispatch = useDispatch()

  const handleDelete = async () => {

    const url = `${apiConfig().endpoint}/shop/${item.id}`

    dispatch(setLoad(false));

    await axios.delete(url, apiConfig().axios)
      .then(res => {
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
        dispatch(shopItemsThunk())
        dispatch(setLoad(true))
        setModal(false)
      })
  }

  return (
    <Modal
      open={modal}
      setOpen={setModal}
      title={'Delete item'}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-full bg-orange-400/30 p-4 w-max mx-auto">
          <Exclamation size={70} color="orange" />
        </div>
        <h5 className="text-xl text-center">
          Are you sure you want to delete "{item?.name?.uk}" from shop?
        </h5>          
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SecondaryButton onClick={() => setModal(false)}>Cancel</SecondaryButton>
        <PrimaryButton onClick={handleDelete}>Accept</PrimaryButton>
      </div>
    </Modal>
  )
}
