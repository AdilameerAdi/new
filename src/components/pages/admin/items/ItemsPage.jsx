import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Add, Delete, Edit, Exclamation } from '../../../../../public/icons/Svg'
import { itemsThunk } from '../../../../store/slices/items.slice'
import { DeleteItems } from './partials/DeleteItems'
import { UpdateItems } from './partials/UpdateItems'
import { CreateItem } from './partials/CreateItem'
import { PrimaryButton } from '../../../elements/PrimaryButton'
import { SecondaryButton } from '../../../elements/SecondaryButton'
import { DeleteItem } from './partials/DeleteItem'
import apiConfig from '../../../../utils/apiConfig'
import { setLoad } from '../../../../store/slices/loader.slice'
import axios from 'axios'
import appError from '../../../../utils/appError'
import { Table } from '../../../elements/Table'

const Element = ({ selectedElements = [], setSelectedElements }) => {

  const [newItemModal, setNewItemModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  return (
    <div className="flex justify-start gap-4 border-b border-black/20 dark:border-admin-dark-500 pb-4">

      <CreateItem
        newItemModal={newItemModal}
        setNewItemModal={setNewItemModal}
      />

      <DeleteItems
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        items={selectedElements}
        setItems={setSelectedElements}
      />

      <PrimaryButton
        className="font-normal"
        onClick={() => setNewItemModal(true)}
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

    const url = `${apiConfig().endpoint}/items/${itemId}`
    dispatch(setLoad(false));

    await axios.get(url, apiConfig().axios)
      .then(res => {
        setItem(res.data.item)
      })
      .catch(err => appError(err))
      .finally(() => {
        dispatch(setLoad(true))
        setUpdateModal(true)
      })
  }


  return (
    <div className="flex gap-4 justify-center">
      <UpdateItems
        updateModal={updateModal}
        setUpdateModal={setUpdateModal}
        item={item}
      />
  
      <DeleteItem
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={itemId}
      />

      <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
        onClick={() => getItemInfo()}
      >
        <Edit color="green" />
      </button>
      {/*
        <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
          onClick={() => setDeleteModal(true)}
        >
          <Delete color="red" />
        </button>
      */}
    </div>
  )
}

export const ItemsPage = () => {

  const dispatch = useDispatch()

  const items = useSelector( (state) => state.items);

  useEffect(() => {
    dispatch(itemsThunk());
  }, [])

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
      field: 'type',
      name: 'Type',
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
      items={items} 
      element={<Element />}
      title={"All items"}
      check={"vnum"}
      actions={{
        header: 'Manage',
        component: <Actions />, 
        params: { itemId: '%vnum%' }
      }}
    />
  )
}
