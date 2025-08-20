import React, { useEffect, useState } from 'react'
import { Table } from '../../../elements/Table'
import { useDispatch, useSelector } from 'react-redux'
import apiConfig from '../../../../utils/apiConfig'
import { setLoad } from '../../../../store/slices/loader.slice'
import axios from 'axios'
import { PaymentsTimeline } from './partials/PaymentsTimeline'
import { CancelCircle, CheckCircle, ExclamationCircle, QuestionCircle } from '../../../../../public/icons/Svg'
import amountFormat from '../../../../utils/amountFormat'
import appError from '../../../../utils/appError'
import { useTranslation } from 'react-i18next'
import { paymentsThunk } from '../../../../store/slices/payments'

export const PaymentsPage = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const payments = useSelector(state => state.payments)

    useEffect(() => {
        dispatch(paymentsThunk())
    }, [])

    const header = [
        {
            field: 'createdAt',
            name: t('Date'),
            date: true
        },
        {
            field: 'transactionId',
            name: t('Transaction ID'),
        },
        {
            field: 'amount',
            name: t('Amount'),
            function: {
                func: function (param) {
                    return amountFormat(param)
                },
            }
        },
        {
            field: 'currency',
            name: t('Currency'),
            function: {
                func: function (param) {
                    return param.toUpperCase()
                },
            }
        },
        {
            field: 'plan.plan_method.name',
            name: t('Method'),
        },
        {
            field: 'status',
            name: t('Status'),
            function: {
                func: function (param) {
                    if(param === "completed"){
                        return (<CheckCircle color="green" />)
                    }
                    if(param === "pending"){
                        return (<ExclamationCircle color="yellow" />)
                    }
                    if(param === "cancelled"){
                        return (<CancelCircle color="red" />)
                    }
                    else return <QuestionCircle />
                },
            }
        },
    ]
    
    return (
        <div className="grid grid-cols-6 gap-4 p-4">
            <div className="flex flex-col gap-4 col-span-6 xl:col-span-4">
                <PaymentsTimeline />
                <Table
                    header={header} 
                    items={payments} 
                    title={t("My payments")}
                />            
            </div>            
        </div>
    )
}
