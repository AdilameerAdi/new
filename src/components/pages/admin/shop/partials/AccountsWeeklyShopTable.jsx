import React, { useState } from 'react'
import { Table } from '../../../../elements/Table'
import apiConfig from '../../../../../utils/apiConfig'
import getNextSundayMidnight from '../../../../../utils/getNextSundayMidnight'
import Countdown, { zeroPad } from 'react-countdown'
import { Delete, Update } from '../../../../../../public/icons/Svg'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { shopWeeklyItemsThunk } from '../../../../../store/slices/shopWeeklyItems.slice'
import { useDispatch } from 'react-redux'
import { ResetWeeklyShop } from './ResetWeeklyShop'
import { ResetAccountWeeklyShop } from './ResetAccountWeeklyShop'

const Element = () => {

  const dispatch = useDispatch()
  const [targetDate, setTargetDate] = useState(getNextSundayMidnight())

  const countdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="flex gap-1 items-center">
          <h3 className="text-xl">00:00:00:00</h3>
          <Update color="white" size="22" />
        </div>
      );
    } else {
      return (
        <div className="flex gap-1 items-center">
          <h3 className="text-xl font-medium">{zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</h3>
          <Update color="white" size="22" />
        </div>
      );
    }
  };

  const [resetModal, setResetModal] = useState(false)

  return (
    <div className="flex justify-between items-center gap-4 border-b border-black/20 dark:border-admin-dark-500 pb-4">
      <ResetWeeklyShop
        modal={resetModal}
        setModal={setResetModal}
      />
      <SecondaryButton
        className="font-normal"
        variant="outline"
        onClick={() => setResetModal(true)}
      >
        Reset buys
      </SecondaryButton>
      <Countdown
        key={targetDate}
        date={targetDate}
        renderer={countdown}
        onComplete={() => {
          setTargetDate(getNextSundayMidnight())
          dispatch(shopWeeklyItemsThunk(true))
        }}
      />
    </div>
  )
}

const Actions = ({ id }) => {

  const [resetModal, setResetModal] = useState(false)

  return (
    <div className="flex gap-4 justify-center">
      <ResetAccountWeeklyShop
        modal={resetModal}
        setModal={setResetModal}
        id={id}
      />
      <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
        onClick={() => { setResetModal(true) }}
      >
        <Delete color="red" />
      </button>
    </div>
  )
}


export const AccountsWeeklyShopTable = ({ users }) => {

  const header = [
    {
      field: 'id',
      name: 'ID',
    },
    {
      field: 'profile_pic',
      name: 'Pic',
      img: `/img/profile/user/%FIELD%.png`,
    },
    {
      field: 'username',
      name: 'Username',
      wordWrap: 10
    },
    {
      field: 'vnum',
      name: 'Icon',
      img: `${apiConfig().endpoint}/items/icon/%FIELD%`
    },
    {
      field: 'name.uk',
      name: 'Name',
      wordWrap: 10
    },
  ]


  return (
    <Table
      admin
      header={header} 
      items={users}
      title={"Weekly shop items buyed"}
      element={
        <Element />
      }
      actions={{
        header: 'Delete',
        component: <Actions />, 
        params: { id: '%id%' }
      }}
    />
  )
}
