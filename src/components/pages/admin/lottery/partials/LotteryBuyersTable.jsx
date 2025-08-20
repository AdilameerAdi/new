import React from 'react'
import { Table } from '../../../../elements/Table'

export const LotteryBuyersTable = ({ data }) => {
    
    const header = [
        {
            field: 'id',
            name: 'ID',
        },
        {
            field: 'lotteryId',
            name: 'Event ID',
        },
        {
            field: 'number',
            name: 'Number',
        },
        {
            field: 'Account.Name',
            name: 'Buyer',
            wordWrap: 10
        },
    ]

    return (
        <Table
            admin
            header={header} 
            items={data} 
            title={"Lottery Buyers"}
            check={"id"}
            /*  
            element={ <Element />}
            actions={{
                header: 'Manage',
                component: <Actions />, 
                params: { itemId: '%id%' }
            }}
            */
        />
    )
}
