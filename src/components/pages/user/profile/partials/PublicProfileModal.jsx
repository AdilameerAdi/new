import React from 'react'
import Modal from '../../../../elements/Modal'
import { PublicProfile } from './PublicProfile'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Open } from '../../../../../../public/icons/Svg'

export const PublicProfileModal = ({ modal, setModal, id }) => {

    const { t } = useTranslation();

    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={
                <Link to={`/profile/${id}`} onClick={() => setModal(false)} className="flex gap-2 items-center">
                    {t("View full profile")}
                    <Open />
                </Link>
            }
        >
            <PublicProfile id={id} modal/>
        </Modal>     
    )
}
