import React, { useEffect, useState } from 'react';
import { NavLink } from '../../elements/user/NavLink';
import { DnsOutlined, DownloadSharp } from '@mui/icons-material';
import { ServerTime } from '../../elements/ServerTime';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../elements/Modal';
import { channelsThunk } from '../../../store/slices/channel.slice';
import { Card } from '../../elements/Card';
import { ExclamationCircle } from '../../../../public/icons/Svg';
import cutString from '../../../utils/cutString';
import { useTranslation } from 'react-i18next';
import apiConfig from '../../../utils/apiConfig';

const ServerStatus = ({ modal, setModal }) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const channels = useSelector(state => state.channels)

  useEffect(() => {
    dispatch(channelsThunk())
  }, [])
  
  return (
    <Modal
      open={modal}
      setOpen={setModal}
      title={t('Sever status')}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
        {
          channels?.length > 0 ?
            channels?.map((channel, index) => (
              <Card className="grid grid-cols-3 !p-2" key={index}>
                <div className="p-2">
                  <div className={`w-full aspect-square rounded-full breath__animate border-8 
                    ${channel.status ? 'border-green-500' : 'border-red-500'}`}
                  />
                </div>
                <div className="col-span-2 flex flex-col items-center justify-center gap-1">
                  <span className="text-2xl font-medium">{cutString(channel.name, 10)}</span>                  
                  <span className={`text-xs italic uppercase ${channel.status ? 'text-green-500' : 'text-red-500'}`}>
                    {channel.status ? t('Online') : t('Offline')}
                  </span>                  
                </div>
              </Card>
            ))
          :
            <div className="sm:col-span-2 flex flex-col gap-4 items-center">
              <ExclamationCircle size="70"/>
              <h3 className="font-medium text-2xl">
                {t("No status available")}
              </h3>              
            </div>
        }
      </div>
    </Modal>
  )
}

export const Footer = () => {

  const publicData = useSelector(state => state.publicData);

  const [modal, setModal] = useState(false)
  const { t } = useTranslation();

  if(publicData.id)

    return (
      <footer className="flex flex-wrap gap-4 justify-between items-center bg-custom-light-600 dark:bg-custom-dark-600  px-16 lg:px-6 py-2 text-xs">
        <span className="text-black dark:text-white w-full md:w-max text-center">© 2024 {publicData.web_general.name}, {t("All rights Reserved")}</span>
        <div className="flex flex-wrap gap-2 justify-center font-medium w-full md:w-max">

          <NavLink to={`${apiConfig().endpoint}/services/download/launcher`} className="flex gap-1 items-center">
            <DownloadSharp />
            <span className="hidden lg:block uppercase">{t("Download")}</span>
          </NavLink>

          <ServerStatus modal={modal} setModal={setModal} />

          <NavLink as="button" className="flex gap-2 items-center" onClick={() => setModal(true)}>
            <DnsOutlined />
            <span className="hidden lg:block uppercase">{t("Status")}</span>
          </NavLink>            

        </div>
        <div className="flex justify-center w-full md:w-max">
          <ServerTime />
        </div>
      </footer>
    );
};
