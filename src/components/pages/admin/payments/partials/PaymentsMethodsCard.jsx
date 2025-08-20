import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '../../../../elements/admin/Card'
import { planThunk } from '../../../../../store/slices/plan.slice'
import { useState } from 'react'
import { Code, CodeSlash, ToggleOff, ToggleOn } from '../../../../../../public/icons/Svg'
import apiConfig from '../../../../../utils/apiConfig'
import axios from 'axios'
import { setLoad } from '../../../../../store/slices/loader.slice'
import Modal from '../../../../elements/Modal'
import { PaymentsMethodsUpdateForm } from './PaymentsMethodsUpdateForm'
import appError from '../../../../../utils/appError'
import { NavLink } from '../../../../elements/admin/NavLink'
import { SwitchCustom } from '../../../../elements/SwitchCustom'

export const PaymentsMethodsCard = ({ data }) => {

    const dispatch = useDispatch()

    const [method, setMethod] = useState({})
    const [updateModal, setUpdateModal] = useState(false)

    const handleUpdateModal = (plan) => {
        setMethod(plan)
        setUpdateModal(true)
    }

    const handleMode = async (plan) => {

        dispatch(setLoad(false));
        const url = `${apiConfig().endpoint}/methods/${plan.id}`
        const data = { mode: !plan.mode }

        await axios.patch(url, data, apiConfig().axios)
            .catch(err => appError(err))
            .finally(() => {
                dispatch(planThunk(true));
                dispatch(setLoad(true));
            })
    }

    const handleToggle = async (plan) => {

        dispatch(setLoad(false));
        const url = `${apiConfig().endpoint}/methods/${plan.id}`
        const data = { status: !plan.status }

        await axios.patch(url, data, apiConfig().axios)
            .catch(err => appError(err))
            .finally(() => {
                dispatch(planThunk(true));
                dispatch(setLoad(true));
            })
    }

    return (
        <Card className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Payments methods</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {
                    data.map(plan => (
                        <div className="flex gap-2 !p-2 justify-between items-center border border-black/20 dark:border-admin-dark-500 rounded-xl">
                            <NavLink 
                                as="button"
                                className="flex-grow font-medium"
                                onClick={() => handleUpdateModal(plan)}
                            >
                                {plan.name}
                            </NavLink>
                            {plan.mode ? 
                                <NavLink as="button" onClick={() => handleMode(plan)}><CodeSlash size={25} color="green" /></NavLink>
                            : 
                                <NavLink as="button" onClick={() => handleMode(plan)}><Code size={25} color="blue" /></NavLink>
                            }
                            <SwitchCustom
                                checked={plan.status}
                                setChecked={() => handleToggle(plan)}
                            />
                        </div>
                    ))
                }
            </div>
            <Modal
                open={updateModal}
                setOpen={setUpdateModal}
                title={'Update method'}
            >
                <PaymentsMethodsUpdateForm 
                    modal={updateModal} 
                    setModal={setUpdateModal}
                    method={method}
                />
            </Modal>
        </Card>
    )
}
