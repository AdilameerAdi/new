import React, { useEffect } from 'react'
import { CouponsTable } from './partials/CouponsTable'
import { useDispatch, useSelector } from 'react-redux'
import { couponsThunk } from '../../../../store/slices/coupons.slice'

export const CouponsPage = () => {

    const dispatch = useDispatch()

    const coupons = useSelector(state => state.coupons)

    useEffect(() => {
        dispatch(couponsThunk(true))
    }, []);

    return (
        <CouponsTable data={coupons} />
    )
}