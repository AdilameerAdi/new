import React from 'react'
import Modal from '../../../../elements/Modal'
import { Exclamation } from '../../../../../../public/icons/Svg'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import apiConfig from '../../../../../utils/apiConfig'
import { useDispatch } from 'react-redux'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import Swal from 'sweetalert2'
import appError from '../../../../../utils/appError'
import { planThunk } from '../../../../../store/slices/plan.slice'

export const DeletePlans = ({ modal, setModal, plans, setPlans }) => {
    
    const dispatch = useDispatch()

    const handleDelete = async () => {
  
      const url = `${apiConfig().endpoint}/plans/remove`
  
      dispatch(setLoad(false));

      await axios.post(url, { plans }, apiConfig().axios)
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
            dispatch(planThunk(true))
            dispatch(setLoad(true))
            setModal(false)
            setPlans([])
        })
    }

    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Delete plans'}
            className="flex flex-col gap-10"
        >
            <div className="flex flex-col gap-4">
            <div className="rounded-full bg-orange-400/30 p-4 w-max mx-auto">
                <Exclamation size={70} color="orange" />
            </div>
            <h5 className="text-xl text-center">
                Are you sure you want to delete {plans.length} plans?
            </h5>          
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SecondaryButton onClick={() => setDeleteModal(false)}>
                    Cancel
                </SecondaryButton>
                <PrimaryButton onClick={handleDelete}>
                    Accept
                </PrimaryButton>
            </div>
        </Modal>
    )
}
