import React, { useState } from 'react'
import { Table } from '../../../../elements/Table'
import { useDispatch, useSelector } from 'react-redux'
import { DailyItemsDropdown } from './DailyItemsDropdown'
import { ResetDailyShop } from './ResetDailyShop'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { ResetAccountDailyShop } from './ResetAccountDailyShop'
import { Refresh, Update } from '../../../../../../public/icons/Svg'
import Countdown, { zeroPad } from 'react-countdown'
import { usersThunk } from '../../../../../store/slices/users.slice'
import getNextMidnight from '../../../../../utils/getNextMidnight'

const Element = () => {

  const dispatch = useDispatch()
  const [targetDate, setTargetDate] = useState(getNextMidnight())

  const countdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="flex gap-1 items-center">
          <h3 className="text-xl">00:00:00</h3>
          <Update color="white" size="22" />
        </div>
      );
    } else {
      return (
        <div className="flex gap-1 items-center">
          <h3 className="text-xl font-medium">{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</h3>
          <Update color="white" size="22" />
        </div>
      );
    }
  };

  const [resetModal, setResetModal] = useState(false)

  return (
    <div className="flex justify-between items-center gap-4 border-b border-black/20 dark:border-admin-dark-500 pb-4">
      <ResetDailyShop
        modal={resetModal}
        setModal={setResetModal}
      />
      <SecondaryButton
        className="font-normal"
        variant="outline"
        onClick={() => setResetModal(true)}
      >
        Reset daily shop
      </SecondaryButton>
      <Countdown
        key={targetDate}
        date={targetDate}
        renderer={countdown}
        onComplete={() => {
          setTargetDate(getNextMidnight())
          dispatch(usersThunk())
        }}
      />
    </div>
  )
}

const Actions = ({ id }) => {

  const [resetModal, setResetModal] = useState(false)

  return (
    <div className="flex gap-4 justify-center">
      <ResetAccountDailyShop
        modal={resetModal}
        setModal={setResetModal}
        id={id}
      />
      <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
        onClick={() => { setResetModal(true) }}
      >
        <Refresh color="#00BCD4" />
      </button>
    </div>
  )
}

export const AccountsDailyShopTable = ({ users }) => {

  const header = [
    {
      field: 'id',
      name: 'ID',
    },
    {
      field: 'profile_pic',
      name: 'Pic',
      img: `/img/profile/user/%FIELD%.png`
    },
    {
      field: 'username',
      name: 'Username',
      function: {
        func: function (param) {
          return (
            <div className="flex flex-col gap-1 items-center">
              <span className="font-medium">{param.private}</span>
              <code className="text-green-300 text-xs px-2 rounded-lg bg-black">
                {param.public}
              </code>
            </div>
          )
        },
      }
    },
  ]

  return (
    <Table
      admin
      dropdown={{
        header: "Daily shop",
        params: { data: '%dailyShop%' },
        component: <DailyItemsDropdown />
      }}
      element={<Element />}
      items={users}
      header={header}
      title={"Account's daily shop items"}
      actions={{
        header: 'Reset',
        params: { id: '%id%' },
        component: <Actions />,
      }}
    />
  )
}
