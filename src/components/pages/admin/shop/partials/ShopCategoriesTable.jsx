import React, { useState } from 'react'
import { Table } from '../../../../elements/Table'
import { useDispatch } from 'react-redux'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { CreateShopCategory } from './CreateShopCategory'
import apiConfig from '../../../../../utils/apiConfig'
import appError from '../../../../../utils/appError'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import { UpdateShopCategory } from './UpdateShopCategory'
import { Delete, Edit } from '../../../../../../public/icons/Svg'
import { DeleteShopCategory } from './DeleteShopCategory'

const Element = () => {

    const [newModal, setNewModal] = useState(false)
  
    return (
        <div className="flex flex-wrap justify-between gap-4 font-normal items-center border-b border-black/20 dark:border-admin-dark-500 pb-4">
            <CreateShopCategory
                modal={newModal}
                setModal={setNewModal}
            />
            <PrimaryButton
                className="font-normal"
                onClick={() => setNewModal(true)}
            >
                New category
            </PrimaryButton>
        </div>
    )
}

const Actions = ({ id }) => {

    const dispatch = useDispatch()

    const [updateModal, setUpdateModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [category, setCategory] = useState({})

    const getCategoryInfo = async () => {

        const url = `${apiConfig().endpoint}/shop/category/items/${id}`
        dispatch(setLoad(false));

        await axios.get(url, apiConfig().axios)
            .then(res => setCategory(res.data))
            .catch(err => appError(err))
            .finally(() => dispatch(setLoad(true)))
    }

    return (
        <div className="flex gap-4 justify-center">
            <UpdateShopCategory
                modal={updateModal}
                setModal={setUpdateModal}
                category={category}
            />
            <DeleteShopCategory
                modal={deleteModal}
                setModal={setDeleteModal}
                category={category}
            />
            <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
                onClick={() => { getCategoryInfo(); setUpdateModal(true) }}
            >
                <Edit color="green" />
            </button>
            <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
                onClick={() => { getCategoryInfo(); setDeleteModal(true) }}
            >
                <Delete color="red" />
            </button>
        </div>
    )
}

export const ShopCategoriesTable = ({ shopCategories }) => {

    const header = [
        {
          field: 'id',
          name: 'ID',
        },
        {
          field: 'name',
          name: 'Title',
        },
    ]

    return (
        <Table
            admin
            header={header} 
            items={shopCategories}
            title={"Web Shop Categories"}
            element={
                <Element />
            }
            actions={{
                header: 'Manage',
                component: <Actions />, 
                params: { id: '%id%' }
            }}

        />
    )
}
