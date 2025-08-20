import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logsThunk } from '../../../../store/slices/logs.slice'
import { Table } from '../../../elements/Table'
import { ItemsInfo } from './partials/ItemsInfo'
import { useTranslation } from 'react-i18next'

const Actions = ({ data }) => {

    if(data.item) {

        return (
            <div className="flex gap-4 justify-center">
                <ItemsInfo data={data}/>
            </div>
        )
    }
}

export const LogsPage = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const logs = useSelector(state => state.logs)

    const header = [
        {
            field: 'data',
            name: t('Title'),
            function: {
                func: function (param) {
                    if(param) return param.title
                },
            }
        },
        {
            field: 'data',
            name: t('Description'),
            function: {
                func: function (param) {
                    if(param) return param.description
                },
            }
        },
        {
            field: 'createdAt',
            name: t('Date'),
            date: true
        },
    ]


    useEffect(() => {
        dispatch(logsThunk())
    }, [])
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            <Table
                className="col-span-1 md:col-span-3"
                header={header} 
                items={logs}
                title={t("Activity logs")}
                actions={{
                    header: 'Data',
                    component: 
                    <Actions />,
                    params: { data: '%data%', }
                }}
            />            
        </div>

    )
}
