import React, { useEffect, useState } from 'react'
import { Card } from '../../../../elements/Card'
import { Add, Coin, Remove, SearchOff, ShopCartPlus } from '../../../../../../public/icons/Svg'
import Pagination from '@mui/lab/Pagination';
import { Input } from '../../../../elements/Input';
import { CustomSelect } from '../../../../elements/CustomSelect';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import apiConfig from '../../../../../utils/apiConfig';
import { shopCartThunk } from '../../../../../store/slices/shopCart';
import axios from 'axios';
import Swal from 'sweetalert2';
import { setLoad } from '../../../../../store/slices/loader.slice';
import Modal from '../../../../elements/Modal';
import { useForm } from 'react-hook-form';
import cutString from '../../../../../utils/cutString';
import { charactersThunk } from '../../../../../store/slices/character.slice';
import selectCompatible from '../../../../../utils/selectCompatible';
import appError from '../../../../../utils/appError';
import { discount } from '../../../../../utils/percent.util';
import { useTranslation } from 'react-i18next';

export const ShopItems = ({ shopItems }) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [shopItemModal, setShopItemModal] = useState(false)
  const [characterId, setCharacterId] = useState(null)
  const [shopItem, setShopItem] = useState({})
  const [itemQty, setItemQty] = useState(1)

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const characters = useSelector(state => state.characters)
  
  const addToCart = async (data) => {
   
    if(characterId) {

      dispatch(setLoad(false));

      const url = `${apiConfig().endpoint}/cart/add/${shopItem?.id}`

      data.quantity = itemQty
      data.characterId = characterId

      await axios.post(url, data, apiConfig().axios)
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
          dispatch(shopCartThunk())
          dispatch(setLoad(true))
          setShopItemModal(false)
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

  const shopItemDetails = (item) => {
    reset()
    setItemQty(1)
    setShopItem(item)
    setShopItemModal(true)
  }

  const itemQuantity = (action) => {

    if(action){
      itemQty < 99 ? setItemQty(itemQty + 1) : setItemQty(99)
    }
    else {
      itemQty > 1  ? setItemQty(itemQty - 1) : setItemQty(1)
    }
  }

  useEffect(() => {
    dispatch(charactersThunk())
  }, [])

  return (
    <div className="flex flex-col justify-between gap-4 h-full">
      <Modal
        open={shopItemModal}
        setOpen={setShopItemModal}
        title={
          <div className="flex flex-wrap gap-4 items-center justify-between relative">
            {
              shopItem.discount > 0 &&
                <div className="absolute rounded-full text-white bg-green-800 px-2 py-1 font-medium text-xs -mt-14 -ml-6 border border-black/20 dark:border-black">
                  {shopItem.discount}% OFF 
                </div>
            }
            <div className="flex gap-1 items-center">
              <span>{cutString(shopItem.name?.uk, 30)}</span>
              {shopItem.stackeable && <span className="px-2 rounded-md text-white bg-red-500">x{ shopItem.stack }</span> }
            </div>
            <div className="flex items-center gap-1">
              <span className={`font-medium ${shopItem?.discount > 0 && "line-through text-gray-500"}`}>
                {shopItem?.price}
              </span>
              {
                shopItem?.discount > 0 &&
                  <span className={`font-medium`}>
                    / { discount(shopItem?.price, shopItem?.discount) }
                  </span>
              }
              <Coin color="#FFD700" size={20} />
            </div>
          </div>
        }
        className="flex flex-col gap-4 !pt-0" 
      >
        <div className="flex gap-4 items-center border-y border-black/20 dark:border-black py-3 w-full">
          <img src={`${apiConfig().endpoint}/items/icon/${shopItem?.vnum}`} className="max-w-[50px]" alt={shopItem?.vnum} />
          <p>{shopItem.desc?.uk.replace('[n]', ' ')}</p>
        </div>
        <form className="flex flex-wrap gap-4" onSubmit={handleSubmit(addToCart)}>
          <div className={`flex gap-3 rounded-lg border text-md p-2 h-min
            ${errors.quantity
              ? 'border-red-400'
              : 'border-black/20 dark:border-gray-500'
            }
          `}>
            <div className="flex">
              <button 
                className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700" 
                onClick={() => itemQuantity(false)}
                type="button" 
              >
                <Remove size={20} />
              </button>
              <input 
                type="text"
                name="quantity"
                maxLength="2"
                className="bg-transparent text-center max-w-[40px]"
                {...register("quantity", {
                  required: "Quantity field is required",
                  pattern: {
                    value: /^[1-9][0-9]?$/,
                    message: "Quantity must be between 1 and 99",
                  },
                })}
                onChange={(e) => setItemQty(Number(e.target.value))}
                defaultValue={itemQty}
                value={itemQty}
              />
              <button type="button" className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700" onClick={() => itemQuantity(true)}>
                <Add size={20} />
              </button>                        
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-medium">
                { discount(shopItem?.price, shopItem?.discount) * itemQty }
              </span>
              <div>
                <Coin color="#FFD700" size={20} />
              </div>
            </div>
          </div>
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
            <ShopCartPlus color="white"/> {t("Add to cart")}
          </PrimaryButton>
        </form>
      </Modal>
      {
        shopItems.length === 0 ? 
          <Card className="flex flex-col flex-grow gap-4 justify-center items-center">
            <SearchOff size="60" />           
            <h1 className="text-3xl font-medium">{t("No results found")}</h1>
          </Card>
        :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {
              shopItems.map(item => (
                <Card as="button" key={item.id} className="flex flex-col gap-4 items-center hover:z-10 hover:scale-105 transition-all duration-200 relative" 
                  onClick={() => shopItemDetails(item)}
                >
                  {
                    item.discount > 0 &&
                      <div className="absolute rounded-full text-white bg-green-800 px-2 py-1 font-medium text-xs top-0 right-0 -mt-2 -mr-2 border border-black/20 dark:border-black">
                        {item.discount}% OFF 
                      </div>
                  }
                  <img src={`${apiConfig().endpoint}/items/icon/${item.vnum}`} className="max-w-[30px]" alt={item.vnum} />
                  <div className="flex items-center justify-center gap-1 border-b border-black/20 dark:border-black pb-3 w-full">
                    <span className={`font-medium ${item.discount > 0 && "line-through text-gray-500"}`}>
                      {item.price}
                    </span>
                    {
                      item.discount > 0 &&
                        <span className={`font-medium`}>
                          / { discount(item.price, item.discount) }
                        </span>
                    }
                    <Coin color="#FFD700" size={20} />
                  </div>
                  <div className="flex gap-1 items-center font-medium">
                    <span>{item.name['uk']}</span>
                    {item.stackeable && <span className="px-2 rounded-md text-white bg-red-500">x{ item.stack }</span> }
                  </div>
                </Card>
              ))
            }
          </div>
      }
    </div>
  )
}
