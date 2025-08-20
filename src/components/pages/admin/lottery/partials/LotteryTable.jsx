import React from 'react'
import { Table } from '../../../../elements/Table'
import { Coin } from '../../../../../../public/icons/Svg'
import amountFormat from '../../../../../utils/amountFormat'

export const LotteryTable = ({ data = [] }) => {

    const header = [
        {
            field: 'id',
            name: 'ID',
        },
        {
            field: 'prize_1',
            name: '1rst place',
            function: {
                func: function (param) {
                    return  <div className="flex gap-1 items-center">
                        {amountFormat(param)}
                        <Coin color="#FFD700" size="20"/>
                    </div>
                },
            }
        },
        {
            field: 'prize_2',
            name: '2nd place',
            function: {
                func: function (param) {
                    return  <div className="flex gap-1 items-center">
                        {amountFormat(param)}
                        <Coin color="#FFD700" size="20"/>
                    </div>
                },
            }
        },
        {
            field: 'prize_3',
            name: '3rd place',
            function: {
                func: function (param) {
                    return  <div className="flex gap-1 items-center">
                        {amountFormat(param)}
                        <Coin color="#FFD700" size="20"/>
                    </div>
                },
            }
        },
        {
            field: 'price',
            name: 'Price',
            function: {
                func: function (param) {
                    return  <div className="flex gap-1 items-center">
                        {amountFormat(param)}
                        <Coin color="#FFD700" size="20"/>
                    </div>
                },
            }
        },
        {
            field: 'numbers',
            name: 'Numbers',
        },
        {
            field: 'end_event',
            name: 'Ends at',
            date: true
        },
    ]

    return (
        <Table
            admin
            header={header} 
            items={data} 
            title={"Lottery Events"}
            /*
            check={"id"}
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
