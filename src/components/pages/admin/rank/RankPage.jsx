import React, { useEffect, useState } from 'react'
import { AOT } from './partials/categories/AOT'
import { ACT4 } from './partials/categories/ACT4'
import { Reputation } from './partials/categories/Reputation'
import { Raids } from './partials/categories/Raids'
import { RainbowBattle } from './partials/categories/RainbowBattle'
import { useDispatch, useSelector } from 'react-redux'
import { rankPrizesThunk } from '../../../../store/slices/rankPrizes.slice'
import Modal from '../../../elements/Modal'
import { PrizeForm } from './partials/PrizeForm'
import { Card } from '../../../elements/admin/Card'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { RankPrizesClaimedTable } from './partials/RankPrizesClaimedTable'

export const RankPage = () => {

  const rankPrizes = useSelector(state => state.rankPrizes)
  const dispatch = useDispatch()

  const [prize, setPrize] = useState({})
  const [modal, setModal] = useState(false)
  const [category, setCategory] = useState()

  useEffect(() => {
    dispatch(rankPrizesThunk())
  }, [])

  const color = (place) => {
    switch (place) {
      case 1:
        return '#ffcf00'
      case 2:
        return '#e3e4e5'
      case 3:
        return '#cd7f32'
      default:
        return '#FFFFFF';
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-7 gap-4">
      <Modal
        open={modal}
        setOpen={setModal}
        title={`${prize.place} Place prize`}
      >
        <PrizeForm prize={prize} category={category} setModal={setModal} />
      </Modal>
      <div className="md:col-span-3 lg:col-span-5">
        <RankPrizesClaimedTable />
      </div>
      <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-4">
        <Disclosure as={Card}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between font-medium">
                <span>AOT</span>
                <ChevronUpIcon
                  className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-4">
                <AOT data={rankPrizes.aot} color={color} setPrize={setPrize} setModal={setModal} setCategory={setCategory} />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as={Card}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between font-medium">
                <span>ACT 4</span>
                <ChevronUpIcon
                  className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-4">
                <ACT4 data={rankPrizes.act_4} color={color} setPrize={setPrize} setModal={setModal} setCategory={setCategory} />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as={Card}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between font-medium">
                <span>Raids</span>
                <ChevronUpIcon
                  className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-4">
                <Raids data={rankPrizes.raids} color={color} setPrize={setPrize} setModal={setModal} setCategory={setCategory} />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as={Card}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between font-medium">
                <span>Reputation</span>
                <ChevronUpIcon
                  className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-4">
                <Reputation data={rankPrizes.reputation} color={color} setPrize={setPrize} setModal={setModal} setCategory={setCategory} />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as={Card}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between font-medium">
                <span>Rainbow Battle</span>
                <ChevronUpIcon
                  className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-4">
                <RainbowBattle data={rankPrizes.rainbow_battle} color={color} setPrize={setPrize} setModal={setModal} setCategory={setCategory} />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}