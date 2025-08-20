import React, { useState } from 'react'
import apiConfig from '../../../../../utils/apiConfig'
import { Coin } from '../../../../../../public/icons/Svg'
import Countdown, { zeroPad } from 'react-countdown'
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../../elements/Modal';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import cutString from '../../../../../utils/cutString';
import { useForm } from 'react-hook-form';
import { CustomSelect } from '../../../../elements/CustomSelect';
import selectCompatible from '../../../../../utils/selectCompatible';
import { CheckCircle } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import appError from '../../../../../utils/appError';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { accountThunk } from '../../../../../store/slices/account.slice';
import getNextMidnight from '../../../../../utils/getNextMidnight';
import { useTranslation } from 'react-i18next';

export const DailyItems = ({ items = [], className = "" }) => {

  const { handleSubmit, reset, formState: { errors } } = useForm();
  const darkMode = useSelector(state => state.darkMode)
  const characters = useSelector(state => state.characters)
  const [characterId, setCharacterId] = useState(null)
  const [targetDate, setTargetDate] = useState(getNextMidnight())
  const [itemModal, setItemModal] = useState(false)
  const [item, setItem] = useState({})

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const countdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <h3 className="text-lg">00:00:00</h3>
    } else {
      return <h3 className="text-lg">{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</h3>;
    }
  };

  const itemDetails = (item) => {
    reset()
    setItem(item)
    setItemModal(true)
  }

  const submit = async () => {

    if(characterId) {
        dispatch(setLoad(false));

        console.log(item.id)

        const url = `${apiConfig().endpoint}/shop/daily/buy/${item.id}`

        await axios.post(url, { characterId }, apiConfig().axios)
          .then(res => {
            Swal.fire({
              toast: true,
              position: 'bottom-right',
              icon: 'success',
              text: res.data.message,
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
            });
          })
          .catch(err => {
            appError(err);
            Swal.fire({
              toast: true,
              position: 'bottom-right',
              icon: 'error',
              text: err.response.data.message,
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
            });
          })
          .finally(() => {
            setCharacterId(null)
            dispatch(accountThunk())
            dispatch(setLoad(true))
            setItemModal(false)
          })
    }
    else {
        Swal.fire({
            toast: true,
            position: 'bottom-right',
            icon: 'error',
            text: 'Select character',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
        });
    }
  }

  return (
    <div className={`rounded-lg bg-[url(/img/bg-light_mode_shop.jpg)] dark:bg-[url(/img/bg-dark_mode_shop.jpg)] bg-center bg-cover h-max xl:h-full relative overflow-hidden ${className}`}>
      {
        items.length > 0 &&
          <Modal
            open={itemModal}
            setOpen={setItemModal}
            title={
              <div className="flex flex-wrap gap-4 items-center justify-between relative">

                <div className="flex gap-1 items-center">
                  <span>{cutString(item.shop_daily?.item?.name?.uk, 30)}</span>
                  {item.shop_daily?.stackeable && <span className="px-2 rounded-md text-white bg-red-500">x{ item.shop_daily?.stack }</span> }
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    {item.shop_daily?.price}
                  </span>
                  <Coin color="#FFD700" size={20} />
                </div>
              </div>
            }
            className="flex flex-col gap-4 !pt-0" 
          >
            <div className="flex gap-4 items-center w-full">
              <img src={`${apiConfig().endpoint}/items/icon/${item.shop_daily?.item?.vnum}`} className="max-w-[50px]" alt={item.shop_daily?.item?.vnum} />
              <p>{item.shop_daily?.item?.desc?.uk.replace('[n]', ' ')}</p>
            </div>
            {
              item.status &&      
              <form className="flex flex-wrap gap-4" onSubmit={handleSubmit(submit)}>
                <CustomSelect
                  data={selectCompatible(characters, 'id', 'name', '/img/class/%class%_%gender%.png')}
                  id="characterId"
                  name="characterId"
                  placeholder={t("Select character")}
                  onChange={(selected) => setCharacterId(selected.value)}
                />
                {errors.quantity ?
                  <div className="border border-red-400 rounded-lg p-2 w-full">
                    { errors.quantity && <span className="text-red-400 text-sm">• {errors.quantity.message}</span> }
                  </div>
                  : null
                }              
                <PrimaryButton type="submit" className="flex gap-4 justify-center items-center w-full">
                  {t("Buy Now")}
                </PrimaryButton>
              </form>
            }
          </Modal>
      }
      {
        items.length == 0 &&
          <div className="flex items-center justify-center p-4 absolute z-20 backdrop-blur-md h-full w-full rounded-lg overflow-hidden">
            <span className="font-medium text-center text-lg">
              {t("Daily items not available")}
            </span>
          </div>
      }

      <div className="flex flex-col h-full bg-white/25 dark:bg-transparent">
        <div className="flex gap-4 justify-between font-medium p-4 bg-gradient-to-b from-white/80 dark:from-black/80 via-white/50 dark:via-black/50 to-transparent">
          <h3 className="text-lg">{t("Daily Items")}</h3>
          <Countdown
            key={targetDate}
            date={targetDate}
            renderer={countdown}
            onComplete={() => {
              setTargetDate(getNextMidnight())
              dispatch(accountThunk())
            }}
          />
        </div>
        <div className="flex flex-wrap gap-4 h-full justify-evenly items-center px-4 pb-4">
        {
          items?.map((item, index) => (
            <button 
              className={`flex flex-col gap-2 items-center p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/50 hover:scale-105 transition-all ease-in-out relative
                ${!item.status && 'bg-gradient-to-t from-transparent via-blue-500/30 to-transparent'}
              `}
              onClick={() => itemDetails(item)} key={index}  
            >
              { !item.status && 
                <div className="absolute -top-2 -left-2 to-transparent z-10">
                  <CheckCircle className="!h-6 !w-6 text-green-500 bg-white rounded-full"/>
                </div> 
              }
              <div className="flex gap-1 items-center rounded-full px-2 bg-blue-500 absolute -top-2 -right-2 z-10">
                <span className="font-medium text-white">
                  {item.shop_daily?.price}
                </span>
                <Coin color="#FFD700" size={20} />
              </div>
              <div className="bg-[url(/img/deste_4.png)] dark:bg-[url(/img/deste.png)] bg-center bg-cover h-28 w-28 flex flex-col justify-center items-center breath__animate">
                <img src={`${apiConfig().endpoint}/items/icon/${item.shop_daily?.item?.vnum}`} className="max-w-[30px]" />
              </div>
              <span className="font-medium"
                style={{ 
                  textShadow: `2px 2px 5px ${ darkMode ? 'black' : 'white'}`
                 }}
              >
                {item.shop_daily?.item?.name?.uk}
              </span>
            </button>
          ))
        }
        </div>
      </div>
    </div>

  )
}
