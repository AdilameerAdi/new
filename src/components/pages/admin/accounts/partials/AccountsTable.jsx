import { Table } from '../../../../elements/Table'
import { AccountsChart } from './AccountsChart'
import { useSelector } from 'react-redux'
import React from 'react'
import { CharactersDropdown } from './CharactersDropdown'

const Element = () => {
    return (
        <div className="border-b border-black/20 dark:border-admin-dark-500">
            <AccountsChart />
        </div>
    )
}

export const AccountsTable = () => {

    const users = useSelector((state) => state.users)

    const header = [
        {
            field: 'id',
            name: 'ID',
        },
        {
            field: 'profile_pic',
            name: 'Pic',
            img: `/img/profile/user/%FIELD%.png`
        },
        {
            field: 'username',
            name: 'Username',
            function: {
                func: function (param) {
                    return (
                        <div className="flex flex-col gap-1 items-center">
                            <span className="font-medium">{param.private}</span>
                            <code className="text-green-300 text-xs px-2 rounded-lg bg-black">
                                {param.public}
                            </code>
                        </div>
                    )
                },
            }
        },
        {
            field: 'range',
            name: 'Authority',
        },
        {
            field: 'email',
            name: 'Email',
        },
        {
            field: 'balance',
            name: 'Balance',
        },
        {
            field: 'gems',
            name: 'Gems',
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
            dropdown={{
                header: "Characters",
                component: <CharactersDropdown />,
                params: { data: '%characters%', }
            }}
            header={header} 
            items={users}
            title={"Accounts"}
            element={
                <Element />
            }
        />
    )
}
