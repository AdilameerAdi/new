import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../elements/Modal';
import { PrimaryButton } from '../../../elements/PrimaryButton';
import apiConfig from '../../../../utils/apiConfig';
import axios from 'axios';
import { accountThunk } from '../../../../store/slices/account.slice';
import Swal from 'sweetalert2';
import { ProfilePicModal } from './partials/ProfilePicModal';
import { setLoad } from '../../../../store/slices/loader.slice';
import { Characters } from './partials/Characters';
import appError from '../../../../utils/appError';
import { NavLink } from '../../../elements/user/NavLink';
import { Edit } from '../../../../../public/icons/Svg';
import { UsernameModal } from './partials/UsernameModal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { charactersThunk } from '../../../../store/slices/character.slice';
import { PublicProfile } from './partials/PublicProfile';

const MyProfile = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const account = useSelector((state) => state.account);
  const characters = useSelector(state => state.characters);
  const [profilePicModal, setProfilePicModal] = useState(false);
  const [profilePic, setProfilePic] = useState(account.profilePic);
  const [usernameModal , setUsernameModal ] = useState(false);
  const [frontPic, setFrontPic] = useState(false);

  const handleProfilePic = async () => {
    const url = `${apiConfig().endpoint}/auth/profile`
    const data = { ProfilePic: profilePic }
    
    if(profilePic){

      dispatch(setLoad(false))

      await axios.post(url, data, apiConfig().axios)
        .then(res => {
          dispatch(accountThunk());
          setProfilePicModal(false)
          Swal.fire({
            toast: true,
            position: 'bottom-right',
            icon: 'success',
            text: res.data.message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        })
        .catch(err => {
          appError(err)
          Swal.fire({
            toast: true,
            position: 'bottom-right',
            icon: 'error',
            text: err.response.data.message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        })
        .finally(() => dispatch(setLoad(true)))
    }
  }

  useEffect(() => {
    dispatch(charactersThunk())
  }, [])

  useEffect(() => {
    setProfilePic(account.profilePic)
  }, [account])

  if(account.id)

  return (
    <div className="flex flex-col flex-grow gap-4 p-4">
      <div
        className={`rounded-b-xl w-full h-40 md:h-80 relative flex hover:brightness-75 transition-all duration-200 cursor-pointer bg-center bg-no-repeat bg-cover`}
        style={{  backgroundImage: `url(/img/bg-light_mode_shop.jpg)` }}
       // onClick={() => setFrontPic(!frontPic)}
      />
      <div className="flex flex-wrap justify-center md:justify-start gap-4 -mt-24 z-10 px-4">
        <div
          className="rounded-full flex gap-4 w-40 h-40 border-4 border-custom-light-500 dark:border-custom-dark-500 bg-gray-600 hover:brightness-75 transition-all duration-200 cursor-pointer bg-cover bg-center"
          style={{
            backgroundImage: `url(/img/profile/user/${account?.profilePic}.png)`,
          }}
          onClick={() =>
            setProfilePicModal(!profilePicModal)
          }
        />
        <div className="flex flex-col justify-end pb-3 text-center md:text-left">
          <div className="flex gap-2 items-center">
            <span className="text-3xl font-semibold text-black dark:text-white">
              {account?.web_username}
            </span>
            <UsernameModal modal={usernameModal} setModal={setUsernameModal} data={account}/>
            <NavLink className="!rounded-full" as="button" onClick={() => setUsernameModal(!usernameModal)}>
              <Edit />
            </NavLink>
          </div>
          <span className="text-sm">
            {account?.username}
          </span>
        </div>
      </div>

      <ProfilePicModal
        profilePicModal={profilePicModal}
        setProfilePicModal={setProfilePicModal}
        profilePic={profilePic}
        setProfilePic={setProfilePic}
        confirmButton={
          <div className="flex gap-6 items-center justify-end">
            <button className="hover:underline font-medium" onClick={() => setProfilePicModal(false)}>{t("Cancel")}</button>
            <PrimaryButton disabled={profilePic ? false : true} onClick={handleProfilePic}>
              {t("Confirm")}
            </PrimaryButton>
          </div>
        }
      />
      <Modal
        open={frontPic}
        setOpen={setFrontPic}
        title={t("Front pic")}
      >
        {t("Front pic")}
      </Modal>
      <Characters characters={characters}/>
    </div>
  );
};


export const ProfilePage = () => {

  const { id } = useParams()
  
  if(id) return <PublicProfile id={id}/>
    
  return <MyProfile />
}

