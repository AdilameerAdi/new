import React, { useState } from 'react'
import { Table } from '../../../../elements/Table'
import apiConfig from '../../../../../utils/apiConfig'
import { useDispatch } from 'react-redux'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import appError from '../../../../../utils/appError'
import { UpdateShopItems } from './UpdateShopItems'
import { DeleteShopItem } from './DeleteShopItem'
import { Delete, Edit } from '../../../../../../public/icons/Svg'
import Swal from 'sweetalert2'
import { publicThunk } from '../../../../../store/slices/public.slice'
import { CreateShopItem } from './CreateShopItem'
import { DeleteShopItems } from './DeleteShopItems'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { SwitchCustom } from '../../../../elements/SwitchCustom'

const Element = ({ selectedElements = [], setSelectedElements, shopCategories, data }) => {

    const [newShopItemModal, setNewShopItemModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [status, setStatus] = useState(data.status)
  
    const dispatch = useDispatch()
  
    const changeStatus = async () => {
  
        dispatch(setLoad(false))
    
        const url = `${apiConfig().endpoint}/shop/control`
    
        await axios.patch(url, { status: !status }, apiConfig().axios)
            .then(res => {
                Swal.fire({
                    toast: true,
                    position: 'bottom-right',
                    icon: 'success',
                    text: res.data.message,
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                });
                setStatus(!status)
            })
            .catch(err => {
                appError(err)
                Swal.fire({
                    toast: true,
                    position: 'bottom-right',
                    icon: 'error',
                    text: err.response.data.message,
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                });
            })
            .finally(() => {
                dispatch(publicThunk())
                dispatch(setLoad(true))
            })
    } 
  
    return (
        <div className="flex flex-wrap justify-between gap-4 font-normal items-center border-b border-black/20 dark:border-admin-dark-500 pb-4">
            <div className="flex justify-start gap-4">
                <CreateShopItem
                    newShopItemModal={newShopItemModal}
                    setNewShopItemModal={setNewShopItemModal}
                    shopCategories={shopCategories}
                />
        
                <DeleteShopItems
                    deleteModal={deleteModal}
                    setDeleteModal={setDeleteModal}
                    items={selectedElements}
                    setShopItems={setSelectedElements}
                />
        
                <PrimaryButton
                    className="font-normal"
                    onClick={() => setNewShopItemModal(true)}
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
            <SwitchCustom
                checked={status}
                setChecked={changeStatus}
                label="Shop status"
            />
        </div>
    )
}
  
const Actions = ({ itemId, shopCategories }) => {

    const dispatch = useDispatch()

    const [updateModal, setUpdateModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [item, setItem] = useState({})

    const getItemInfo = async () => {

        const url = `${apiConfig().endpoint}/shop/${itemId}`
        dispatch(setLoad(false));

        await axios.get(url, apiConfig().axios)
            .then(res => setItem(res.data))
            .catch(err => appError(err))
            .finally(() => dispatch(setLoad(true)))
    }

    return (
        <div className="flex gap-4 justify-center">
            <UpdateShopItems
                modal={updateModal}
                setModal={setUpdateModal}
                item={item}
                shopCategories={shopCategories}
            />
            <DeleteShopItem
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

export const ShopItemsTable = ({ publicData, shopItems, shopCategories }) => {

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
            field: 'discount',
            name: 'Discount',
            function: {
                func: function (param) {
                    return `${param}%`
                },
            }
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
            items={shopItems} 
            element={publicData.id && <Element shopCategories={shopCategories} data={publicData.web_shop} />}
            title={"Web shop items"}
            check={"id"}
            actions={{
                header: 'Manage',
                component: <Actions />, 
                params: { itemId: '%id%', shopCategories: shopCategories }
            }}
        />
    )
}
