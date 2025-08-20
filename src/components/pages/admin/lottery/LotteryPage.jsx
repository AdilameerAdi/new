import { lotteryBuyersThunk } from '../../../../store/slices/lottery.buyers.slice'
import { lotteryThunk } from '../../../../store/slices/lottery.slice'
import { publicThunk } from '../../../../store/slices/public.slice'
import { LotteryBuyersTable } from './partials/LotteryBuyersTable'
import { LotteryConfig } from './partials/LotteryConfig'
import { LotteryTable } from './partials/LotteryTable'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'

export const LotteryPage = () => {

    const dispatch = useDispatch()

    const lottery = useSelector(state => state.lottery)
    const publicData = useSelector(state => state.publicData)
    const lotteryBuyers = useSelector(state => state.lotteryBuyers)

    useEffect(() => {
        dispatch(publicThunk())
    }, [])

    useEffect(() => {
        dispatch(lotteryThunk())
    }, [])
    
    useEffect(() => {
        dispatch(lotteryBuyersThunk())
    }, [])

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="col-span-1 xl:col-span-7">
                <LotteryTable data={lottery} />
            </div>
            <div className="col-span-1 xl:col-span-5 flex flex-col gap-4">
                <LotteryConfig data={publicData.web_lottery} />
                <LotteryBuyersTable data={lotteryBuyers} />
            </div>
        </div>
    )
}
