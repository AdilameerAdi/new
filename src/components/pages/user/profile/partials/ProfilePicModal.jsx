import React from 'react';
import Modal from '../../../../elements/Modal';
import { Card } from '../../../../elements/Card';
import { useSelector } from 'react-redux';
import profilePics from '../../../../../utils/profilePics';
import { CheckCircle, Coin } from '../../../../../../public/icons/Svg';
import { useTranslation } from 'react-i18next';

export const ProfilePicModal = ({
  profilePicModal,
  setProfilePicModal,
  profilePic,
  setProfilePic,
  confirmButton,
}) => {

  const { t } = useTranslation();
  const account = useSelector(state => state.account)
  const availables = account.storage.profile.pictures
  const shop = profilePics.filter(index => !availables.includes(index));

  return (
    <Modal
      open={profilePicModal}
      setOpen={setProfilePicModal}
      confirmButton={confirmButton}
      title={t('Change profile image')}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <div className="flex flex-col gap-4 aspect-[1/1.5] overflow-y-auto">
        <span className="uppercase font-medium text-gray-600 dark:text-gray-400">{t("Your pictures")}</span>
        <div className="grid grid-cols-3 gap-4 h-max">
          {availables.map((pic) => (
            <button key={pic} onClick={() => setProfilePic(pic)}
              className={`rounded-full bg-center bg-cover aspect-square w-full ${profilePic === pic ? "border-green-500 brightness-50" : "border-gray-400 hover:brightness-50"} transition-all ease-in-out border-4`}
              style={{  backgroundImage: `url(/img/profile/user/${pic}.png)` }}
            />
          ))}
        </div>
        <span className="uppercase font-medium text-gray-600 dark:text-gray-400">{t("Pictures shop")}</span>
        <div className="grid grid-cols-3 gap-4 h-max">
          {shop.map((pic) => (
            <button key={pic} onClick={() => setProfilePic(pic)}
              className={`rounded-full bg-center bg-cover aspect-square w-full ${profilePic === pic ? "border-green-500 brightness-50" : "border-gray-400 hover:brightness-50"} transition-all ease-in-out border-4`}
              style={{  backgroundImage: `url(/img/profile/user/${pic}.png)` }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Card className="aspect-square flex flex-col justify-center items-center">
          <div
            className="rounded-full bg-center bg-cover aspect-square w-36 border-2 border-black/10 dark:border-black"
            style={{  backgroundImage: `url(/img/profile/user/${profilePic}.png)` }}
          />
        </Card>
        {
          <Card className="text-center font-medium">
            { 
              availables.includes(profilePic) ? 
                <div className="flex items-center justify-center gap-1">
                  <span className="text-green-400">{t("You got this picture")}</span> 
                  <CheckCircle color="green" />
                </div> 
              : 
              <div className="flex items-center justify-center gap-1">
                <span>{t("Unlock for")} {50}</span>
                <Coin color="#FFD700" />
              </div> 
            }
          </Card>
        }
      </div>
    </Modal>
  );
};
