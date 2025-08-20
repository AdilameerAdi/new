import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import apiConfig from '../../../../../utils/apiConfig'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import { PaymentDetails } from './PaymentDetails'
import { CancelCircle, CheckCircle, ExclamationCircle, Info, QuestionCircle } from '../../../../../../public/icons/Svg'
import Chart from 'react-apexcharts';
import amountFormat from '../../../../../utils/amountFormat'
import appError from '../../../../../utils/appError'
import { Table } from '../../../../elements/Table'
import { Link } from 'react-router-dom'

const Element = ({ payments }) => {

    const darkMode = useSelector((state) => state.darkMode );
    
    const options = {
        series: [
            {
                name: 'EUR',
                data: payments.filter(item => item.currency === 'EUR' && item.status === 'completed').map(item => amountFormat(item.amount)),
            },
            {
                name: 'USD',
                data: payments.filter(item => item.currency === 'USD' && item.status === 'completed').map(item => amountFormat(item.amount)),
            },
            {
                name: 'USDT',
                data: payments.filter(item => item.currency === 'USDT' && item.status === 'completed').map(item => amountFormat(item.amount)),
            },
        ],
        chart: {
            height: 250,
            type: 'area',
            background: 'transparent'
        },
        dataLabels: {
            enabled: false,
        },
            stroke: {
            curve: 'straight',
        },
        xaxis: {
            type: 'datetime',
            categories: payments.map(date => date.createdAt)
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm:ss',
            },
        },
        theme: {
            mode: darkMode ? 'dark' : '',
        },
    };

    return (
        <div className="border-b border-black/20 dark:border-admin-dark-500">
            <Chart options={options} series={options.series} type="area" width="100%" height="250" />
        </div>
    )
}

export const PaymentsTable = ({ data }) => {

    const header = [
        {
            field: 'Account',
            name: 'User',
            function: {
                func: function (param) {
                    return (
                        <Link className="hover:underline hover:text-blue-400" to={`/profile/${param.Id}`}>
                            {param.Name}
                        </Link>
                    )
                },
            }
        },        
        {
            field: 'transactionId',
            name: 'Transaction ID',
            wordWrap: 20,
        },
        {
            field: 'amount',
            name: 'Amount',
            function: {
                func: function (param) {
                    return amountFormat(param)
                },
            }
        },
        {
            field: 'currency',
            name: 'Currency',
            function: {
                func: function (param) {
                    return param.toUpperCase()
                },
            }
        },
        {
            field: 'status',
            name: 'Status',
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
        {
            field: 'plan.plan_method.name',
            name: 'Method',
        },
        {
            field: 'createdAt',
            name: 'Date',
            date: true
        },
    ]

    return (
        <Table
            admin
            header={header} 
            items={data} 
            title={"All payments"}
            element={<Element payments={data} />}
            dropdown={{
                header: "Details",
                component: <PaymentDetails />,
                params: { id: '%id%', }
            }}
        />
    )
}
