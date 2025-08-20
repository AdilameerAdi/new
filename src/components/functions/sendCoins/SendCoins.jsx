import React, { useState } from 'react'
import { NavLink } from '../../elements/user/NavLink'
import { SendMoney } from '../../../../public/icons/Svg'
import Modal from '../../elements/Modal'
import { SendCoinsForm } from './partials/SendCoinsForm'
import { useTranslation } from 'react-i18next'

export const SendCoins = ({ darkMode }) => {

    const [sendCoinsModal, setSendCoinsModal] = useState(false)

    const { t } = useTranslation();

    return (
      <>
        <Modal
          open={sendCoinsModal}
          setOpen={setSendCoinsModal}
          title={t('Send coins')}
        >
          <SendCoinsForm setOpen={setSendCoinsModal} />
        </Modal>     
        <NavLink
          as="button"
          className="flex gap-2 items-center !rounded-full"
          onClick={ () => setSendCoinsModal(!sendCoinsModal)}
        >
          <SendMoney           
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
