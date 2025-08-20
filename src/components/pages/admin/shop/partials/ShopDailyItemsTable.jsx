import React, { useState } from 'react'
import apiConfig from '../../../../../utils/apiConfig'
import { Table } from '../../../../elements/Table'
import { useDispatch } from 'react-redux'
import { Delete, Edit } from '../../../../../../public/icons/Svg'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import appError from '../../../../../utils/appError'
import { UpdateShopDailyItems } from './UpdateShopDailyItems'
import { DeleteShopDailyItem } from './DeleteShopDailyItem'
import { CreateShopDailyItem } from './CreateShopDailyItem'
import { DeleteShopDailyItems } from './DeleteShopDailyItems'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { SecondaryButton } from '../../../../elements/SecondaryButton'

const Element = ({ selectedElements = [], setSelectedElements }) => {

    const [newModal, setNewModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
  
    return (
        <div className="flex flex-wrap gap-4 font-normal items-center border-b border-black/20 dark:border-admin-dark-500 pb-4">
            <CreateShopDailyItem
                newModal={newModal}
                setNewModal={setNewModal}
            />
    
            <DeleteShopDailyItems
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                items={selectedElements}
                setShopDailyItems={setSelectedElements}
            />
    
            <PrimaryButton
                className="font-normal"
                onClick={() => setNewModal(true)}
            >
                New item
            </PrimaryButton>
            {selectedElements.length > 0 ?
                <SecondaryButton
                    className="font-normal"
                    onClick={() => setDeleteModal(true)}
                >
                    Delete {selectedElements.length} items
                </SecondaryButton>
                : null
            }
        </div>
    )
}

const Actions = ({ itemId }) => {

    const dispatch = useDispatch()

    const [updateModal, setUpdateModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [item, setItem] = useState({})

    const getItemInfo = async () => {

        const url = `${apiConfig().endpoint}/shop/daily/items/${itemId}`
        dispatch(setLoad(false));

        await axios.get(url, apiConfig().axios)
            .then(res => setItem(res.data))
            .catch(err => appError(err))
            .finally(() => dispatch(setLoad(true)))
    }

    return (
        <div className="flex gap-4 justify-center">
            <UpdateShopDailyItems
                modal={updateModal}
                setModal={setUpdateModal}
                item={item}
            />
            <DeleteShopDailyItem
                modal={deleteModal}
                setModal={setDeleteModal}
                item={item}
            />
            <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
                onClick={() => { getItemInfo(); setUpdateModal(true) }}
            >
                <Edit color="green" />
            </button>
            <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
                onClick={() => { getItemInfo(); setDeleteModal(true) }}
            >
                <Delete color="red" />
            </button>
        </div>
    )
}

export const ShopDailyItemsTable = ({ shopDailyItems }) => {

    const header = [
        {
            field: 'icon',
            img: `${apiConfig().endpoint}/items/icon/%FIELD%`,
            name: 'Icon',
        },
        {
            field: 'id',
            name: 'ID',
        },
        {
            field: 'vnum',
            name: 'VNum',
        },
        {
            field: 'price',
            name: 'Price',
        },
        {
            field: 'name.uk',
            name: 'Name (EN)',
            wordWrap: 30,
        },
        {
            field: 'desc.uk',
            name: 'Description (EN)',
            wordWrap: 30,
        },
    ]

    return (
        <Table
            admin
            header={header} 
            items={shopDailyItems} 
            element={<Element />}
            title={"Daily shop items"}
            check={"id"}
            actions={{
                header: 'Manage',
                component: <Actions />, 
                params: { itemId: '%id%' }
            }}
        />
    )
}
