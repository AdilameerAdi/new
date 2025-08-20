import React, { useState } from 'react'
import Modal from '../../elements/Modal'
import { NavLink } from '../../elements/user/NavLink'
import { Ticket2 } from '../../../../public/icons/Svg'
import { TicketCard } from './partials/TicketCard'
import { RedeemCouponForm } from './partials/RedeemCouponForm'
import { useTranslation } from 'react-i18next'

export const RedeemCoupon = ({ darkMode }) => {

    const [modal, setModal] = useState(false)

    const { t } = useTranslation();

    return (
        <>
        <Modal
            open={modal}
            setOpen={setModal}
            title={t('Redeem coupon')}
        >
            <TicketCard className="flex flex-col w-full">
                <RedeemCouponForm setModal={setModal} />
            </TicketCard>
        </Modal>     
        <NavLink
            as="button"
            className="flex gap-2 items-center"
            onClick={ () => setModal(!modal)}
        >
            <Ticket2
                color={
                    darkMode
                    ? '#FFFFFF'
                    : '#000000'
                }
            />
        </NavLink>
        </>
    )

}