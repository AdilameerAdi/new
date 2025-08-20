import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import apiConfig from '../../../../../utils/apiConfig'
import { Table } from '../../../../elements/Table'
import { Delete, Edit } from '../../../../../../public/icons/Svg'
import { UpdateItems } from './UpdateItems'
import { DeleteItems } from './DeleteItems'
import axios from 'axios'
import { setLoad } from '../../../../../store/slices/loader.slice'
import appError from '../../../../../utils/appError'
import { DeleteItem } from './DeleteItem'
import { CreateItem } from './CreateItem'
import { SwitchCustom } from '../../../../elements/SwitchCustom'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { ResetClaims } from './ResetClaims'
import Swal from 'sweetalert2'
import { publicThunk } from '../../../../../store/slices/public.slice'

const Element = ({ selectedElements = [], setSelectedElements }) => {

  const publicData = useSelector(state => state.publicData.web_general)
  const [status, setStatus] = useState(publicData?.gems_prizes_status)
  const [newItemModal, setNewItemModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [resetModal, setResetModal] = useState(false)

  const dispatch = useDispatch()

  const changeStatus = async () => {

    dispatch(setLoad(false))

    const url = `${apiConfig().endpoint}/gems/control`

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
        <CreateItem
          modal={newItemModal}
          setModal={setNewItemModal}
        />

        <DeleteItems
          modal={deleteModal}
          setModal={setDeleteModal}
          items={selectedElements}
          setItems={setSelectedElements}
        />

        <ResetClaims
          modal={resetModal}
          setModal={setResetModal}
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
        <SecondaryButton
          className="font-normal"
          variant="outline"
          onClick={() => setResetModal(true)}
        >
          Reset claims
        </SecondaryButton>
      </div>

      <SwitchCustom
        checked={status}
        setChecked={changeStatus}
        label="Prizes status"
      />               
    </div>
  )
}

const Actions = ({ itemId }) => {

  const dispatch = useDispatch()

  const [updateModal, setUpdateModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const [item, setItem] = useState({})

  const getItemInfo = async () => {

    const url = `${apiConfig().endpoint}/gems/admin/${itemId}`
    dispatch(setLoad(false));

    await axios.get(url, apiConfig().axios)
      .then(res => setItem(res.data))
      .catch(err => appError(err))
      .finally(() => dispatch(setLoad(true)))
  }

  return (
    <div className="flex gap-4 justify-center">
      <UpdateItems
        modal={updateModal}
        setModal={setUpdateModal}
        item={item}
      />
  
      <DeleteItem
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

export const PaymentsPrizesTable = ({ data = [] }) => {

  const header = [
    {
      field: 'item.vnum',
      name: 'Icon',
      function: {
        func: function (param) {
          if(param) return <img src={`${apiConfig().endpoint}/items/icon/${param}`} alt={param} className="h-6 w-6"/>
        },
      }
    },
    {
      field: 'id',
      name: 'ID',
    },
    {
      field: 'item.vnum',
      name: 'VNum',
    },
    {
      field: 'target',
      name: 'Target',
    },
    {
      field: 'item.name.uk',
      name: 'Name (EN)',
      wordWrap: 30,
    },
  ]

  return (
    <Table
      admin
      header={header} 
      items={data} 
      title={"Payments prizes"}
      check={"id"}
      element={ <Element />}
      actions={{
        header: 'Manage',
        component: <Actions />, 
        params: { itemId: '%id%' }
      }}
    />    
  )
}
