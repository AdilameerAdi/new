import React, { useState } from 'react'
import Modal from '../../../../elements/Modal';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { useForm } from 'react-hook-form';
import { CopyIcon } from '../../../../../../public/icons/Svg';
import clipboard from '../../../../../utils/clipboard';
import apiConfig from '../../../../../utils/apiConfig';
import axios from 'axios';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { useDispatch } from 'react-redux';
import appError from '../../../../../utils/appError';
import Swal from 'sweetalert2';
import { paymentsThunk } from '../../../../../store/slices/payments';
import { SecondaryButton } from '../../../../elements/SecondaryButton';

export const GiftcardManage = ({ paymentDetails, getPaymentDetails }) => {

  const [giftcardModal, setGiftcardModal] = useState(false);
  const [status, setStatus] = useState(true);
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();

    const url = `${apiConfig().endpoint}/payments/giftcard/${paymentDetails.id}`
        
    dispatch(setLoad(false));
    const data = { status: Boolean(status) };

    await axios.patch(url, data, apiConfig().axios)
      .then(res => {
        setGiftcardModal(false)
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
        dispatch(paymentsThunk(true));
        dispatch(setLoad(true));
        getPaymentDetails()
      })
  }

  return (
    <>
      <Modal
        open={giftcardModal}
        setOpen={setGiftcardModal}
        title={'Manage payment'}
        className="flex flex-col gap-4"
      >
        <img src='/img/eneba.png' className="w-full rounded-lg border border-black/20 dark:border-gray-500"/>
        <div className="grid grid-cols-1 md:flex gap-4 justify-between">
          <code className="text-xl font-medium w-full bg-white dark:bg-black/50 rounded-lg flex 
            items-center justify-center border border-black/20 dark:border-gray-500 p-2" 
            id={`code_${paymentDetails?.id}`}>
            {paymentDetails?.transactionId}
          </code>
          <button className="flex gap-2 items-center justify-center bg-white dark:bg-black/50 px-4 py-2
            rounded-lg border border-black/20 dark:border-gray-500 hover:!bg-black/10"
            onClick={() => clipboard(`code_${paymentDetails?.id}`)}
          >
            <CopyIcon size="20" />
          </button>
          <a className="flex gap-2 items-center justify-center bg-white dark:bg-black/50 px-4 py-2
            rounded-lg border border-black/20 dark:border-gray-500 hover:!bg-black/10"
            href="https://my.eneba.com/latam/redeem-gift-card" target="_blank"
          >
            <img src="/img/eneba_logo.png" alt="logo" className="w-10" />
          </a>
        </div>
        {
          paymentDetails.status === 'pending' ?
            <form className="flex flex-col gap-4" onSubmit={submit}>
              <div className="text-black p-2 rounded-lg bg-yellow-300 bortder border-yellow-500 flex flex-col items-center">
                <span className="text-sm text-center">Notice: The chosen option cannot be changed once confirmed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-500">
                <button onClick={() => setStatus(true)} type="button"
                  className={`p-2 text-center rounded-lg ${status ? 'border-2 border-green-500 text-green-500' : 'border border-black/20 dark:border-gray-500'}`}
                >
                  <span>APPROVE</span>
                </button>
                <button onClick={() => setStatus(false)} type="button"
                  className={`p-2 text-center rounded-lg ${!status ? 'border-2 border-red-500 text-red-500' : 'border border-black/20 dark:border-gray-500'}`}
                >
                  <span>DECLINE</span>
                </button>
              </div>
              <PrimaryButton className="uppercase" type="submit">
                Confirm
              </PrimaryButton>
            </form>
          :
            <span className={`p-2 text-center uppercase border-2 rounded-lg 
              ${ paymentDetails.status === 'completed' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500' }`}
            >
              {paymentDetails.status}
            </span>
        }
      </Modal>
      <button onClick={() => setGiftcardModal(true)}
        className="flex gap-2 items-center justify-center border dark:border-admin-dark-700 p-2 rounded-full 
        hover:bg-admin-light-700 hover:dark:bg-admin-dark-700">
        <h3 className="font-medium">Status:</h3>
        <code className="font-normal text-xs rounded-lg p-1 bg-white dark:bg-black/50">
          { paymentDetails?.status }
        </code>
      </button>
    </>
  )
}
