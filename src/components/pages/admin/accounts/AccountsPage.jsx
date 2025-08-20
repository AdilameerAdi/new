import React, { useEffect } from 'react'
import { AccountsTable } from './partials/AccountsTable'
import { usersThunk } from '../../../../store/slices/users.slice'
import { useDispatch } from 'react-redux'
import { Card } from '../../../elements/admin/Card'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { SendBalances } from './partials/SendBalances'
import { SendItems } from './partials/SendItems'
import { CreateAccount } from './partials/CreateAccount'

export const AccountsPage = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(usersThunk())
    }, [])

    return (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-3">
                <AccountsTable />
            </div>
            <div className="xl:col-span-2 flex flex-col gap-4">
                <Disclosure as={Card} defaultOpen>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between font-medium">
                                <span>Create account</span>
                                <ChevronUpIcon
                                    className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="pt-4">
                                <CreateAccount />
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
                <Disclosure as={Card} defaultOpen>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between font-medium">
                                <span>Send items</span>
                                <ChevronUpIcon
                                    className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="pt-4">
                                <SendItems />
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
                <Disclosure as={Card}>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between font-medium">
                                <span>Send Coins / Gems</span>
                                <ChevronUpIcon
                                    className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="pt-4">
                                <SendBalances />
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </div>
    )
}
