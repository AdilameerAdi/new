import React from 'react'
import { useDispatch } from 'react-redux'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import apiConfig from '../../../../../utils/apiConfig'
import Swal from 'sweetalert2'
import { blogThunk } from '../../../../../store/slices/blog.slice'
import Modal from '../../../../elements/Modal'
import { Exclamation } from '../../../../../../public/icons/Svg'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import appError from '../../../../../utils/appError'

export const DeleteArticles = ({ modal, setModal, items = {}, setItems, setNewArticle, setUpdateArticle }) => {

    const dispatch = useDispatch()

    const handleDelete = async () => {

        const url = `${apiConfig().endpoint}/blog/remove/`
    
        dispatch(setLoad(false));

        await axios.post(url, {items}, apiConfig().axios)
            .then(res => {
                setNewArticle(false)
                setUpdateArticle(false)
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
                dispatch(blogThunk())
                dispatch(setLoad(true))
                setModal(false)
                setItems([])
            })
    }

    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Delete articles'}
            className="flex flex-col gap-10"
        >
            <div className="flex flex-col gap-4">
                <div className="rounded-full bg-orange-400/30 p-4 w-max mx-auto">
                    <Exclamation size={70} color="orange" />
                </div>
                <h5 className="text-xl text-center">
                    Are you sure you want to delete {items.length} articles?
              </h5>          
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SecondaryButton onClick={() => setModal(false)}>Cancel</SecondaryButton>
                <PrimaryButton onClick={handleDelete}>Accept</PrimaryButton>
            </div>
        </Modal>
    )
}
