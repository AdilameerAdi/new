import React, { useEffect, useState } from 'react'
import { Table } from '../../../elements/Table'
import { useDispatch, useSelector } from 'react-redux'
import { planThunk } from '../../../../store/slices/plan.slice'
import { PrimaryButton } from '../../../elements/PrimaryButton'
import { SecondaryButton } from '../../../elements/SecondaryButton'
import { CreatePlan } from './partials/CreatePlan'
import { DeletePlan } from './partials/DeletePlan'
import { DeletePlans } from './partials/DeletePlans'
import axios from 'axios'
import apiConfig from '../../../../utils/apiConfig'
import { Delete, Edit } from '../../../../../public/icons/Svg'
import { UpdatePlan } from './partials/UpdatePlan'
import { setLoad } from '../../../../store/slices/loader.slice'
import appError from '../../../../utils/appError'
import amountFormat from '../../../../utils/amountFormat'

const Element = ({ selectedElements = [], setSelectedElements, data }) => {

  const [newModal, setNewModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  return (
      <div className="flex justify-start gap-4 border-b border-black/20 dark:border-admin-dark-500 pb-4">
        <CreatePlan
          modal={newModal}
          setModal={setNewModal}
          methods={data?.methods}
        />

        <DeletePlans
          modal={deleteModal}
          setModal={setDeleteModal}
          plans={selectedElements}
          setPlans={setSelectedElements}
        />

        <PrimaryButton
          className="font-normal"
          onClick={() => setNewModal(true)}
        >
          New Plan
        </PrimaryButton>
        {selectedElements.length > 0 ?
          <SecondaryButton
            className="font-normal"
            onClick={() => setDeleteModal(true)}
          >
            Delete {selectedElements.length} plans
          </SecondaryButton>
          : null
        }
      </div>
  )
}

const Actions = ({ id }) => {

  const dispatch = useDispatch()

  const [updateModal, setUpdateModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [plan, setPlan] = useState({})

  const getPlanInfo = async () => {

    const url = `${apiConfig().endpoint}/plans/admin/${id}`
    dispatch(setLoad(false));

    await axios.get(url, apiConfig().axios)
      .then(res => setPlan(res.data))
      .catch(err => appError(err))
      .finally(() => dispatch(setLoad(true)))
  }

  return (
    <div className="flex gap-4 justify-center">
      <UpdatePlan
        modal={updateModal}
        setModal={setUpdateModal}
        plan={plan}
      />
      <DeletePlan
        modal={deleteModal}
        setModal={setDeleteModal}
        plan={plan}
      />
      <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
        onClick={() => { getPlanInfo(); setUpdateModal(true) }}
      >
        <Edit color="green" />
      </button>
      <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
        onClick={() => { getPlanInfo(); setDeleteModal(true) }}
      >
        <Delete color="red" />
      </button>
    </div>
  )
}

export const CoinsPage = () => {

  const dispatch = useDispatch()

  const plans = useSelector(state => state.plans)

  const header = [
    {
      field: 'id',
      name: 'ID',
    },
    {
      field: 'amount',
      name: 'Amount',
    },
    {
      field: 'description',
      name: 'Description',
      wordWrap: 25,
    },
    {
      field: 'plan_method.name',
      name: 'Method',
    },
    {
      field: 'price',
      name: 'Price',
      function: {
        func: function (param) {
            return amountFormat(param)
        },
      }
    },
    {
      field: 'plan_method.currency',
      name: 'Currency',
    },
  ]

  useEffect(() => {
    dispatch(planThunk(true))
  }, [])

  if(plans.status)
    return (
      <Table
        admin
        header={header} 
        element={<Element data={plans} />}
        items={plans?.plans}
        title={"Coin plans"}
        check={"id"}
        actions={{
          header: 'Manage',
          component: <Actions />, 
          params: { id: '%id%' }
        }}
      />
    )
}

