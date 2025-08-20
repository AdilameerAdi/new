import React from 'react'
import Modal from '../../../../elements/Modal'
import { Exclamation } from '../../../../../../public/icons/Svg'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import apiConfig from '../../../../../utils/apiConfig'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import appError from '../../../../../utils/appError'
import { setLoad } from '../../../../../store/slices/loader.slice'
import { shopWeeklyItemsThunk } from '../../../../../store/slices/shopWeeklyItems.slice'

export const DeleteShopWeeklyItems = ({ deleteModal, setDeleteModal, items, setShopWeeklyItems }) => {

    const dispatch = useDispatch()

    const handleDelete = async () => {
  
      const url = `${apiConfig().endpoint}/shop/weekly/remove/`
  
      dispatch(setLoad(false));
      
      await axios.post(url, {items}, apiConfig().axios)
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
            dispatch(shopWeeklyItemsThunk(true))
            dispatch(setLoad(true))
            setDeleteModal(false)
            setShopWeeklyItems([])
        })
    }
  

    return (
        <Modal
            open={deleteModal}
            setOpen={setDeleteModal}
            title={'Delete item'}
            className="flex flex-col gap-10"
        >
            <div className="flex flex-col gap-4">
                <div className="rounded-full bg-orange-400/30 p-4 w-max mx-auto">
                    <Exclamation size={70} color="orange" />
                </div>
                <h5 className="text-xl text-center">
                    Are you sure you want to delete {items.length} items from web shop?
                </h5>          
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SecondaryButton onClick={() => setDeleteModal(false)}>Cancel</SecondaryButton>
                <PrimaryButton onClick={handleDelete}>Accept</PrimaryButton>
            </div>
        </Modal>
    )
}
