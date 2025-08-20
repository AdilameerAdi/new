import React, { useEffect } from 'react'
import { PaymentsTable } from './partials/PaymentsTable';
import { PaymentsPrizesTable } from './partials/PaymentsPrizesTable';
import { PaymentsMethodsCard } from './partials/PaymentsMethodsCard';
import { useDispatch, useSelector } from 'react-redux';
import { paymentPrizesThunk } from '../../../../store/slices/paymentsPrizes.slice';
import { planThunk } from '../../../../store/slices/plan.slice';
import { paymentsThunk } from '../../../../store/slices/payments';

export const PaymentsPage = () => {

    const dispatch = useDispatch()

    const plans = useSelector( (state) => state.plans);
    const payments = useSelector(state => state.payments)
    const paymentPrizes = useSelector(state => state.paymentPrizes)

    useEffect(() => {
        dispatch(planThunk(true));
        dispatch(paymentsThunk(true));
        dispatch(paymentPrizesThunk(true));
    }, [])

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="col-span-1 xl:col-span-7 flex flex-col gap-4">
                { plans.status &&<PaymentsMethodsCard data={plans.methods} /> }
                <PaymentsTable data={payments} />
            </div>
            <div className="col-span-1 xl:col-span-5">
                { paymentPrizes.status && <PaymentsPrizesTable data={paymentPrizes.items} /> }
            </div>
        </div>
    )
}
