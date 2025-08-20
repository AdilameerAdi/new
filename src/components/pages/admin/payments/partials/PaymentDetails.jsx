import React, { useEffect, useState } from 'react'
import Modal from '../../../../elements/Modal'
import { CopyIcon } from '../../../../../../public/icons/Svg'
import clipboard from '../../../../../utils/clipboard'
import convertDate from '../../../../../utils/convertDate'
import { Card } from '../../../../elements/admin/Card'
import { useDispatch } from 'react-redux'
import { setLoad } from '../../../../../store/slices/loader.slice'
import apiConfig from '../../../../../utils/apiConfig'
import appError from '../../../../../utils/appError'
import axios from 'axios'
import { GiftcardManage } from './GiftcardManage'

export const PaymentDetails = ({ id }) => {

    const dispatch = useDispatch()

    const [paymentDetails, setPaymentDetails] = useState({});

    const getPaymentDetails = async () => {

        const url = `${apiConfig().endpoint}/payments/admin/${id}`
        
        dispatch(setLoad(false))

        await axios.get(url, apiConfig().axios)
            .then(res => setPaymentDetails(res.data))
            .catch(err => appError(err))
            .finally(() => {dispatch(setLoad(true))})
    }

    useEffect(() => {
        getPaymentDetails()
    }, [])

    return (
        <div className="grid grid-cols-4 gap-4 p-4">
            <div className="flex gap-2 items-center justify-between  col-span-4 border dark:border-admin-dark-700 p-2 rounded-full">
                <div className="flex flex-grow gap-2 items-center justify-center">
                    <h3 className="font-medium">{ paymentDetails?.plan?.plan_method?.name == 'GiftCard' ? 'Giftcard Code:' : 'Transaction Id:'}</h3>
                    <code className="font-normal text-xs rounded-lg p-1 bg-white dark:bg-black/50" id={`transactionId_tx_${paymentDetails?.id}`}>
                        { paymentDetails?.transactionId }
                    </code>
                </div>
                <button onClick={() => clipboard(`transactionId_tx_${paymentDetails?.id}`)} className="hover:bg-black/20 p-2 rounded-full">
                    <CopyIcon size="15" />
                </button>
            </div>
            <div className="flex gap-2 items-center justify-between col-span-2 border dark:border-admin-dark-700 p-2 rounded-full">
                <div className="flex flex-grow gap-2 items-center justify-center">
                    <h3 className="font-medium">Payer email:</h3>
                    <code className="font-normal text-xs rounded-lg p-1 bg-white dark:bg-black/50" id={`payerEmail_${paymentDetails?.id}`}>
                        { paymentDetails?.payerEmail }
                    </code>
                </div>
                <button onClick={() => clipboard(`payerEmail_${paymentDetails?.id}`)} className="hover:bg-black/20 p-2 rounded-full">
                    <CopyIcon size="15" />
                </button>
            </div>
            <div className="flex gap-2 items-center justify-center border dark:border-admin-dark-700 p-2 rounded-full">
                <h3 className="font-medium">Coins:</h3>
                <code className="font-normal text-xs rounded-lg p-1 bg-white dark:bg-black/50">
                    {  paymentDetails.plan?.amount }
                </code>
            </div>
            { paymentDetails?.plan?.plan_method?.name == 'GiftCard' ? 
                    <GiftcardManage paymentDetails={paymentDetails} getPaymentDetails={getPaymentDetails} />
                : 
                    <div className="flex gap-2 items-center justify-center border dark:border-admin-dark-700 p-2 rounded-full">
                        <h3 className="font-medium">Status:</h3>
                        <code className="font-normal text-xs rounded-lg p-1 bg-white dark:bg-black/50">
                            { paymentDetails?.status }
                        </code>
                    </div>
            }
        </div>
    )

}
