import React from 'react'
import Modal from '../../../../elements/Modal'
import { Exclamation } from '../../../../../../public/icons/Svg'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { setLoad } from '../../../../../store/slices/loader.slice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import appError from '../../../../../utils/appError'
import { rankPrizesClaimedThunk } from '../../../../../store/slices/rankPrizesClaimed.slice'
import apiConfig from '../../../../../utils/apiConfig'

export const DeleteClaim = ({ modal, setModal, id }) => {

  const dispatch = useDispatch()

  const submit = async () => {

    const url = `${apiConfig().endpoint}/ranking/prizes/reset/${id}`

    dispatch(setLoad(false));

    await axios.post(url, {}, apiConfig().axios)
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
        dispatch(rankPrizesClaimedThunk())
        dispatch(setLoad(true))
        setModal(false)
      })
  }
  return (
    <Modal
      open={modal}
      setOpen={setModal}
      title={'Delete claim'}
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-full bg-orange-400/30 p-4 w-max mx-auto">
          <Exclamation size={70} color="orange" />
        </div>
        <h5 className="text-xl text-center pb-4">
          Are you sure you want to delete this claim?
        </h5>          
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SecondaryButton onClick={() => setModal(false)}>Cancel</SecondaryButton>
        <PrimaryButton onClick={submit}>Accept</PrimaryButton>
      </div>
    </Modal>
  )
}
