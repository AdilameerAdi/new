import { CancelCircle, CheckCircle, Coin, CopyIcon, Delete } from '../../../../../../public/icons/Svg'
import clipboard from '../../../../../utils/clipboard'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { Table } from '../../../../elements/Table'
import React, { useState } from 'react'
import { CreateCoupon } from './CreateCoupon'
import { DeleteCoupons } from './DeleteCoupons'
import cutString from '../../../../../utils/cutString'
import apiConfig from '../../../../../utils/apiConfig'
import { ClaimersDropdown } from './ClaimersDropdown'
import { DeleteCoupon } from './DeleteCoupon'

const Element = ({ selectedElements = [], setSelectedElements }) => {

    const [newModal, setNewModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    return (
        <div className="flex justify-start gap-4 border-b border-black/20 dark:border-admin-dark-500 pb-4">

            <CreateCoupon
                modal={newModal}
                setModal={setNewModal}
            />
    
            <DeleteCoupons
                modal={deleteModal}
                setModal={setDeleteModal}
                coupons={selectedElements}
                setCoupons={setSelectedElements}
            />
    
            <PrimaryButton
                className="font-normal"
                onClick={() => setNewModal(true)}
            >
                New coupon
            </PrimaryButton>
            {selectedElements.length > 0 ?
                <SecondaryButton
                    className="font-normal"
                    onClick={() => setDeleteModal(true)}
                >
                    Delete {selectedElements.length} coupons
                </SecondaryButton>
            : null
            }
        </div>
    )
}

const Actions = ({ id }) => {

    const [deleteModal, setDeleteModal] = useState(false)
  
    return (
      <div className="flex gap-4 justify-center">

        <DeleteCoupon
          modal={deleteModal}
          setModal={setDeleteModal}
          id={id}
        />

        <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
          onClick={() => setDeleteModal(true)}
        >
          <Delete color="red" />
        </button>
      </div>
    )
}


export const CouponsTable = ({ data }) => {

    const header = [
        {
            field: 'id',
            name: 'ID',
        },
        {
            field: 'code',
            name: 'Code',
            function: {
                func: function (param) {
                    return (
                        <div className="flex gap-2">
                            <span id={`CODE_${param}`}>{param}</span>
                            <button onClick={() => clipboard(`CODE_${param}`)}>
                                <CopyIcon size="15" />
                            </button>
                        </div>

                    )
                }
            }
        },
        {
            field: 'claims',
            name: 'Claims',
        },
        {
            field: 'prize',
            name: 'Reward',
            function: {
                func: function (param) {
                    return (
                        <>
                            {
                                param.type === 1 && 
                                    <div className="flex gap-1 items-center">
                                        <span>{param.data.amount}</span>
                                        <Coin color="#FFD700" size="20" />
                                    </div>
                            }
                            {
                                param.type === 2 && 
                                    <div className="flex gap-2 items-center">
                                        <span className="font-medium" title="Quantity">[ {param.data.quantity} ]</span>
                                        <img src={`${apiConfig().endpoint}/items/icon/${param.data.item.icon}`} alt={param.data.item} className="w-5" />
                                        <span>{cutString(param.data.item.name.uk, 15)}</span>
                                        {param.data.stack > 1 && 
                                            <span className="px-2 rounded-full bg-red-500 font-medium text-xs" title="Stack">
                                                x{param.data.stack}
                                            </span>
                                        }
                                    </div>
                            }
                        </>
                    )
                },
            }
        },
        {
            field: 'createdAt',
            name: 'Created At',
            date: true
        }
    ]

    return (
        <Table
            admin
            header={header} 
            items={data} 
            element={<Element />}
            title={"Coupons"}
            check={"id"}
            actions={{
                header: 'Manage',
                component: <Actions />, 
                params: { id: '%id%' }
            }}
            dropdown={{
                header: "Claimers",
                component: <ClaimersDropdown />,
                params: { data: '%claimers%', }
            }}
        />
    )
}
