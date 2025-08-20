import { wheelItemsThunk } from '../../../../../store/slices/wheelItems.slice';
import { charactersThunk } from '../../../../../store/slices/character.slice';
import { accountThunk } from '../../../../../store/slices/account.slice';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import selectCompatible from '../../../../../utils/selectCompatible';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { CustomSelect } from '../../../../elements/CustomSelect';
import { useDispatch, useSelector } from 'react-redux';
import cutString from '../../../../../utils/cutString';
import apiConfig from '../../../../../utils/apiConfig';
import React, { useEffect, useState,} from 'react';
import Modal from '../../../../elements/Modal';
import Swal from 'sweetalert2';
import axios from 'axios';
import appError from '../../../../../utils/appError';
import { useTranslation } from 'react-i18next';

export const Roulette = ({ data, className = '' }) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const wheelItems = useSelector(state => state.wheelItems)
  const characters = useSelector( (state) => state.characters);

  const [wheelItemModal, setWheelItemModal] = useState(false);
  const [wheelItemInfo, setWheelItemInfo] = useState({});
  const [characterId, setCharacterId] = useState(null);
  const [jackpotItem, setJackpotItem] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [autoSpin, setAutoSpin] = useState(false);
  const [position, setPosition] = useState(0)
  const [wheel, setWheel] = useState([]);

  const handleAutospin = async () => {
    if(autoSpin) await spin();
  };

  const handleRoulette = (wheel, index) => {

    const item = wheel[index]

    setTimeout(() => {
      Swal.fire({
        imageUrl: `${apiConfig().endpoint}/items/icon/${item.vnum}`,
        imageAlt: item.vnum,
        title: item.name,
        timerProgressBar: autoSpin,
        timer: autoSpin ? 3000 : false,
        showConfirmButton: !autoSpin,
        backdrop: `
        rgba(0,0,123,0.4)
        url("https://i.pinimg.com/originals/94/82/5a/94825ad80fff30c13cccfaf3d2ce4ea8.gif")
        center
        repeat`
      }).then(() => {
        dispatch(wheelItemsThunk())
        setWheel([])
        setPosition(0)
        setSpinning(false)
        // handleAutospin()
      });
    }, data.time);

  };

  const spin = async () => {

    if(characterId) {
      if(jackpotItem) {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/wheel/spin`

        await axios.post(url, { characterId, jackpotItem }, apiConfig().axios)
          .then(res => {
            setSpinning(true)
            setWheel(res.data.wheel)
            handleRoulette(res.data.wheel, res.data.index)
            setPosition(res.data.index * 150 + (res.data.index * 8 - 12) - 255)
          })
          .catch(err => {
            appError(err)
            Swal.fire({
              toast: true,
              position: 'bottom-right',
              icon: 'error',
              text: err.response.data.message,
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
            })
          })
          .finally(() =>{
            dispatch(accountThunk())
            dispatch(setLoad(true))
          })

      } else {
        Swal.fire({
          title: 'Error',
          text: t(`You should select any jackpot`),
          icon: 'error',
        })
      }

    } else {
      Swal.fire({
        title: 'Error',
        text: t(`You should select any character`),
        icon: 'error',
      })
    }
  }

  useEffect(() => {
    dispatch(charactersThunk())
  }, []);

  useEffect(() => {
    dispatch(wheelItemsThunk())
  }, [])

  if(wheelItems.items)

    return (
      <div className={`flex flex-col gap-4 w-[690px] ${className}`}>
        { wheelItemInfo &&
          <Modal
            open={wheelItemModal}
            setOpen={setWheelItemModal}
            title={
              <div className="flex flex-wrap gap-2 items-center">
                <span>{ cutString(wheelItemInfo?.name, 30) }</span>
                {wheelItemInfo?.stackeable && <span className="px-2 rounded-md text-white bg-red-500">x{ wheelItemInfo?.stack }</span> }
              </div>
            }
            className="flex flex-col gap-4 !pt-0" 
          >
            <div className="flex gap-4 items-center border-t border-black/20 dark:border-black pt-4 w-full">
            <img src={`${apiConfig().endpoint}/items/icon/${wheelItemInfo?.vnum}`} className="max-w-[50px]" alt={wheelItemInfo?.vnum} /> 
              <p>{wheelItemInfo?.desc?.uk.replace('[n]', ' ')}</p>
            </div>
          </Modal>
        }
        <div className="w-full h-[400px] overflow-hidden relative rounded-lg border border-black/20 dark:border-black">
          <div className="absolute uppercase top-0 z-30 px-2 border-b border-r rounded-br-lg border-black/20 dark:border-black text-lg font-medium bg-custom-light-500 dark:bg-custom-dark-500">
            {t("Spins")}: {wheelItems.spins || 0}
          </div>
          <div className={`${spinning && 'hidden'} flex flex-col items-center absolute h-full 
            w-full z-20 bg-custom-light-600 dark:bg-custom-dark-600 font-medium rounded-lg`}
          >
            <div className="p-4 border-b border-black/20 dark:border-black w-full text-center">
              <h2 className="text-2xl">{t("Wheel prizes")}</h2>
            </div>
            <div className="overflow-y-auto flex flex-col gap-4 w-full">
              <div className="bg-gradient-to-b from-transparent via-yellow-500/20 to-orange-500/50 p-4">
                <h2 className="text-xl">{t("Jackpot items")}</h2>
              </div>
              <div className="grid grid-cols-5 gap-4 p-4 flex-grow w-full">
                {
                  wheelItems.items.map((item, index) => (
                    item.jackpot &&
                      <div key={index} title={item.name} onClick={() => { setWheelItemInfo(item); setWheelItemModal(true) }}
                        className={`bg-gradient-to-b from-transparent via-yellow-500/20 to-orange-500/50 p-2 relative
                        flex flex-col gap-3 items-center justify-evenly rounded-lg aspect-square cursor-pointer w-full h-full`}
                      >
                        <img src={`${apiConfig().endpoint}/items/icon/${item.vnum}`} alt={item.name} className="hover:scale-125 transition-all"/>
                          <span className="text-xs text-center">{cutString(item.name, 25)}</span>
                          {
                            item.stackeable && 
                              <span className="px-2 rounded-full text-white bg-red-500 absolute top-0 right-0 text-xs">
                                x{ item.stack }
                              </span> 
                          }
                      </div>
                  ))
                }
              </div>

              <div className="bg-gradient-to-b from-transparent via-green-300/20 to-green-500/50 p-4">
                <h2 className="text-xl">{t("Regular items")}</h2>
              </div>

              <div className="grid grid-cols-5 gap-4 p-4 flex-grow w-full">
                {
                  wheelItems.items.map((item, index) => (
                    !item.jackpot &&
                    <div key={index} title={item.name} onClick={() => { setWheelItemInfo(item); setWheelItemModal(true) }}
                      className={`bg-gradient-to-b from-transparent via-green-300/20 to-green-500/50 p-2 relative
                      flex flex-col gap-3 items-center justify-evenly rounded-lg aspect-square cursor-pointer w-full h-full`}
                    >
                      <img src={`${apiConfig().endpoint}/items/icon/${item.vnum}`} alt={item.name} className="hover:scale-125 transition-all"/>
                      <span className="text-xs text-center">{cutString(item.name, 25)}</span>
                      {
                        item.stackeable && 
                          <span className="px-2 rounded-full text-white bg-red-500 absolute top-0 right-0 text-xs">
                            x{ item.stack }
                          </span> 
                      }
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className="w-full h-full absolute flex justify-center items-center">
            <div className="bg-gradient-to-b from-transparent via-green-400 to-transparent w-[2px] h-1/2 z-10"></div>
          </div>
          <div
            className={`overflow-hidden relative w-max h-full flex items-center transition-all ease-in-out`}
            style={{ 
              right: position,
              transitionDuration: `${data.time}ms`
            }}
          >
            <ul className="flex items-center justify-center list">
              {
                wheel.map((item, index) => (
                  <li key={index} className="inline-block">
                    <div className={`bg-gradient-to-b from-transparent ${ item.jackpot ? 'via-yellow-500/20 to-orange-500/50' : 'via-green-300/20 to-green-500/50' } p-8 flex items-center justify-center`}>
                      <img src={`${apiConfig().endpoint}/items/icon/${item.vnum}`} alt={`item-${index}`} className="w-8 h-8"/>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        <SecondaryButton
          onClick={spin}
          variant="outline"
          className="dark:bg-[url(/img/overlay-pattern.png)] uppercase"
          disabled={spinning}
        >
          {spinning ? t("Spinning...") : `${t("Spin")} (${data.price} ${t("Coins")})`}
        </SecondaryButton>
        <div className="grid grid-cols-2 gap-4">
          <CustomSelect 
            placeholder={t("Select jackpot")}
            data={selectCompatible(wheelItems.items.filter(item => item.jackpot), 'id', 'name', `${apiConfig().endpoint}/items/icon/%vnum%`)}
            className="border-2 !border-blue-500"
            onChange={(selected) => {
              setJackpotItem(selected.value)
            }}
          />
          {/*
          <PrimaryButton
            onClick={() => setAutoSpin(!autoSpin)}
            variant="outline"
            className={`${autoSpin && '!bg-blue-500/50'} w-full col-span-1`}
          >
            AUTO SPIN
          </PrimaryButton>
          */}
          <CustomSelect 
            placeholder={t("Select character")}
            data={selectCompatible(characters, 'id', 'name', '/img/class/%class%_%gender%.png')}
            className="border-2 !border-blue-500"
            onChange={(selected) => {
              setCharacterId(selected.value)
            }}
          />
        </div>
      </div>
    );
};
