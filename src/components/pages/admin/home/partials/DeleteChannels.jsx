import React from 'react'
import Modal from '../../../../elements/Modal'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { Exclamation } from '../../../../../../public/icons/Svg'
import axios from 'axios'
import apiConfig from '../../../../../utils/apiConfig'
import { setLoad } from '../../../../../store/slices/loader.slice'
import Swal from 'sweetalert2'
import appError from '../../../../../utils/appError'
import { channelsThunk } from '../../../../../store/slices/channel.slice'
import { useDispatch } from 'react-redux'

export const DeleteChannels = ({ modal, setModal, channels, setChannels }) => {

    const dispatch = useDispatch()

    const submit = async () => {

        const url = `${apiConfig().endpoint}/channels/remove/`
    
        dispatch(setLoad(false));
    
        await axios.post(url, { channels }, apiConfig().axios)
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
                dispatch(channelsThunk())
                dispatch(setLoad(true))
                setModal(false)
                setChannels([])
            })
    }


    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Delete channels'}
            className="flex flex-col gap-10"
        >
            <div className="flex flex-col gap-4">
                <div className="rounded-full bg-orange-400/30 p-4 w-max mx-auto">
                    <Exclamation size={70} color="orange" />
                </div>
                <h5 className="text-xl text-center">
                    Are you sure you want to delete {channels.length} channels?
                </h5>          
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SecondaryButton onClick={() => setModal(false)}>Cancel</SecondaryButton>
                <PrimaryButton onClick={submit}>Accept</PrimaryButton>
            </div>
        </Modal>
    )
}
