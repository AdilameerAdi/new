import { rankPrizesClaimedThunk } from '../../../../../store/slices/rankPrizesClaimed.slice'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { Coin, Delete } from '../../../../../../public/icons/Svg'
import apiConfig from '../../../../../utils/apiConfig'
import { useDispatch, useSelector } from 'react-redux'
import { Table } from '../../../../elements/Table'
import React, { useEffect, useState } from 'react'
import { DeleteClaims } from './DeleteClaims'
import { ResetClaims } from './ResetClaims'
import { DeleteClaim } from './DeleteClaim'

const Element = ({ selectedElements = [], setSelectedElements }) => {

    const [deleteModal, setDeleteModal] = useState(false)
    const [resetModal, setResetModal] = useState(false)
  
    return (
        <div className="flex justify-between gap-4 border-b border-black/20 dark:border-admin-dark-500 pb-4">
            <DeleteClaims
                modal={deleteModal}
                setModal={setDeleteModal}
                claims={selectedElements}
                setClaims={setSelectedElements}
            />

            <ResetClaims
                modal={resetModal}
                setModal={setResetModal}
            />
    
            {selectedElements.length > 0 ?
                <SecondaryButton
                    className="font-normal"
                    onClick={() => setDeleteModal(true)}
                >
                    Delete {selectedElements.length} claims
                </SecondaryButton>
                : null
            }

            <SecondaryButton
                className="font-normal"
                variant="outline"
                onClick={() => setResetModal(true)}
            >
                Reset claims
            </SecondaryButton>
        </div>
    )

}

const Actions = ({ id }) => {

    const [deleteModal, setDeleteModal] = useState(false)
  
    return (
        <div className="flex gap-4 justify-center">
            <DeleteClaim
                modal={deleteModal}
                setModal={setDeleteModal}
                id={id}
            />
            <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
                onClick={() => { setDeleteModal(true) }}
            >
                <Delete color="red" />
            </button>
        </div>
    )
}

export const RankPrizesClaimedTable = () => {

    const dispatch = useDispatch()

    const rankPrizesClaimed = useSelector(state => state.rankPrizesClaimed)

    const header = [
        {
            field: 'id',
            name: 'ID',
        },
        {
            field: 'category',
            name: 'Category',
        },
        {
            field: 'prize',
            name: 'Reward',
            function: {
                func: function (param) {

                    if(param.id)
                        return (
                            <div className="flex gap-2 items-center">
                                <img src={`${apiConfig().endpoint}/items/icon/${param.icon}`} alt={param.vnum} class="aspect-square max-w-[30px]" />
                                <span className="font-medium">{param.name.uk}</span>
                            </div>
                        )

                    return (
                        <div className="flex gap-2 items-center">
                            <span className="font-medium">{param}</span>
                            <Coin color="#FFD700" size="20"/>
                        </div>
                    )
                },
            }
        },
        {
            field: 'character',
            name: 'Claimer',
            function: {
                func: function (param) {
                    return (
                        <div className="flex gap-2 items-center">
                            <img src={`/img/class/${param.class}_${param.gender}.png`} alt={param.name} class="rounded-full z-10 aspect-square max-w-[30px]" />
                            <span className="font-medium">{param.name}</span>
                        </div>
                    )
                },
            }
        },
        {
            field: 'createdAt',
            name: 'Date',
            date: true
        },
    ]

    useEffect(() => {
        dispatch(rankPrizesClaimedThunk())
    }, [])

    return (
        <Table
            admin
            header={header} 
            items={rankPrizesClaimed || []}
            title={"Ranking Prizes Claimed"}
            check={"id"}
            element={ <Element />}
            actions={{
                header: 'Manage',
                component: <Actions />, 
                params: { id: '%id%' }
            }}
        />  
    )
}
