import React, { useEffect, useState } from 'react'
import { Card } from '../../../elements/Card'
import { useDispatch, useSelector } from 'react-redux';
import { Add, Coin, Remove, ShopCart, ShopCartRemove } from '../../../../../public/icons/Svg';
import { SecondaryButton } from '../../../elements/SecondaryButton';
import { CustomSelect } from '../../../elements/CustomSelect';
import { Input } from '../../../elements/Input';
import axios from 'axios';
import Swal from 'sweetalert2';
import { shopCartThunk } from '../../../../store/slices/shopCart';
import { setLoad } from '../../../../store/slices/loader.slice';
import apiConfig from '../../../../utils/apiConfig';
import { PrimaryButton } from '../../../elements/PrimaryButton';
import { useForm } from 'react-hook-form';
import cutString from '../../../../utils/cutString';
import Modal from '../../../elements/Modal';
import { NavLink } from '../../../elements/user/NavLink';
import { Link } from 'react-router-dom';
import { Select } from '../../../elements/Select';
import selectCompatible from '../../../../utils/selectCompatible';
import { charactersThunk } from '../../../../store/slices/character.slice';
import { accountThunk } from '../../../../store/slices/account.slice';
import appError from '../../../../utils/appError';
import { discount } from '../../../../utils/percent.util';
import { useTranslation } from 'react-i18next';

export const ShopCartPage = () => {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const shopCart = useSelector( (state) => state.shopCart);
  const account = useSelector( (state) => state.account);
  const characters = useSelector( (state) => state.characters);

  const [shopCartItemModal, setShopCartItemModal] = useState(false)
  const [shopCartItem, setShopCartItem] = useState({})
  const [characterId, setCharacterId] = useState(null)
  const [cartItemQty, setCartItemQty] = useState(1)
  const [totalAmount, setTotalAmount] = useState(0)
  const [defaultCharacter, setDefaultCharacter] = useState(characters?.filter(item => Number(item.id) === Number(characterId))[0])

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const updateCart = async (data) => {

    dispatch(setLoad(false));

    const url = `${apiConfig().endpoint}/cart/update/${shopCartItem.id}`

    data.quantity = cartItemQty
    data.characterId = characterId

    await axios.patch(url, data, apiConfig().axios)
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
        setShopCartItemModal(false)
      })
  }

  const RemoveFromCart = async (id) => {
    
    dispatch(setLoad(false));

    const url = `${apiConfig().endpoint}/cart/remove/${id}`

    await axios.delete(url, apiConfig().axios)
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
      })
  }

  const shopCartItemDetails = (item) => {
    reset()
    setCharacterId(item?.characterId)
    setCartItemQty(item?.quantity)
    setShopCartItem(item)
    setShopCartItemModal(true)
  }

  const itemQuantity = (action) => {

    if(action){
      cartItemQty < 99 ? setCartItemQty(cartItemQty + 1) : setCartItemQty(99)
    }
    else {
      cartItemQty > 1  ? setCartItemQty(cartItemQty - 1) : setCartItemQty(1)
    }
  }

  const getTotalAmount = () => {
    const amount = shopCart.reduce((total, item) => total + item.quantity * discount(item?.shop.price, item?.shop.discount), 0);
    setTotalAmount(amount);
  };

  const buyItems = async () => {

    dispatch(setLoad(false));

    const url = `${apiConfig().endpoint}/cart/checkout`

    await axios.post(url, { shopCart }, apiConfig().axios)
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
        dispatch(accountThunk())
        dispatch(shopCartThunk())
        dispatch(setLoad(true))
      })

  }

  useEffect(() => {
    getTotalAmount()
  }, [shopCart])

  useEffect(() => {
    dispatch(charactersThunk())
  }, [])

  useEffect(() => {
    setDefaultCharacter(characters?.filter(item => Number(item.id) === Number(characterId))[0])
  }, [characters, characterId])

  if(shopCart.length > 0)
    return (
      <div className="grid grid-cols-4 gap-4 flex-grow h-full overflow-hidden p-4">
        <Modal
          open={shopCartItemModal}
          setOpen={setShopCartItemModal}
          title={
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {
                shopCartItem.shop?.discount > 0 &&
                  <div className="absolute rounded-full text-white bg-green-800 px-2 py-1 font-medium text-xs -mt-14 -ml-6 border border-black/20 dark:border-black">
                    {shopCartItem.shop?.discount}% OFF 
                  </div>
              }
              <div className="flex gap-1 items-center">
                <span>{cutString(shopCartItem.shop?.item.name.uk, 30)}</span>
                {shopCartItem.shop?.stackeable && <span className="px-2 rounded-md text-white bg-red-500">x{ shopCartItem.shop?.stack }</span> }
              </div>
              <div className="flex items-center gap-1">
                <span className={`font-medium ${shopCartItem.shop?.discount > 0 && "line-through text-gray-500"}`}>
                  {shopCartItem.shop?.price}
                </span>
                {
                  shopCartItem.shop?.discount > 0 &&
                    <span className={`font-medium`}>
                      / { discount(shopCartItem.shop?.price, shopCartItem.shop?.discount) }
                    </span>
                }
                <Coin color="#FFD700" size={20} />
              </div>
            </div>
          }
          className="flex flex-col gap-4">
          <div className="flex gap-4 items-center border-y border-black/20 dark:border-black py-3 w-full">
            <img src={`${apiConfig().endpoint}/items/icon/${shopCartItem.shop?.item.vnum}`} className="max-w-[50px]" alt={shopCartItem.shop?.item.vnum} />
            <p>{shopCartItem.shop?.item.desc.uk.replace('[n]', ' ')}</p>
          </div>
          <form className="flex flex-wrap gap-4" onSubmit={handleSubmit(updateCart)}>
            <div className={`flex gap-3 rounded-lg border text-md p-1
              ${errors.quantity
                ? 'border-red-400'
                : 'border-black/20 dark:border-gray-500'
              }
            `}>
              <div className="flex">
                <button type="button" className="p-1 rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700" onClick={() => itemQuantity(false)}>
                  <Remove size={20} />
                </button>
                <input 
                  type="text"
                  name="quantity"
                  maxLength="2"
                  className="bg-transparent text-center max-w-[40px]"
                  {...register("quantity", {
                    required: t("Quantity field is required"),
                    pattern: {
                      value: /^[1-9][0-9]?$/,
                      message: t("Quantity must be between 1 and 99"),
                    },
                  })}
                  onChange={(e) => setCartItemQty(Number(e.target.value))}
                  defaultValue={cartItemQty}
                  value={cartItemQty}
                />
                <button type="button" className="p-1 rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700" onClick={() => itemQuantity(true)}>
                  <Add size={20} />
                </button>                        
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="font-medium">{ discount(shopCartItem.shop?.price, shopCartItem.shop?.discount) * cartItemQty }</span>
                <div className="p-1">
                  <Coin color="#FFD700" size={20} />
                </div>
              </div>
            </div>
            {errors.quantity ?
              <div className="border border-red-400 rounded-lg p-2 w-full">
                { errors.quantity && <span className="text-red-400 text-sm">• {errors.quantity.message}</span> }
              </div>
              : null
            }
            <input type="text" className="w-0 absolute" value={shopCartItem.characterId} {...register("actualCharacter")}/>

            <CustomSelect 
              data={selectCompatible(characters, 'id', 'name', '/img/class/%class%_%gender%.png')}
              //defaultValue={characters?.filter(item => Number(item.id) === Number(characterId))[0]}
              onChange={(selected) => setCharacterId(selected.value)}
              placeholder={t('Select character')}
            />
            <PrimaryButton type="submit" className="flex gap-4 justify-center items-center w-full">
              {t("Update item")}
            </PrimaryButton>
          </form>
        </Modal>
        <div className="col-span-4 xl:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
          <div className="grid grid-cols-4 gap-4 h-min overflow-auto">
          {
            shopCart?.map(item => (
              <Card key={item.id} className="col-span-4 md:col-span-2 xl:col-span-1 flex flex-col justify-between gap-3 !p-3">
                <NavLink as="button" className="w-full flex gap-1 justify-center items-center font-medium" onClick={() => shopCartItemDetails(item)}>
                  <span>{cutString(item?.shop.item.name['uk'], 30)}</span>
                  {item?.shop.stackeable && <span className="px-2 rounded-md text-white bg-red-500">x{ item?.shop.stack }</span> }
                </NavLink>
                <div className="flex items-center">
                  <hr className="border-black/20 dark:border-black flex-grow"/>
                  <span className="rounded-lg px-2 py-1 border border-black/20 dark:border-black text-xs">{item.character.name}</span>
                  <hr className="border-black/20 dark:border-black flex-grow"/>
                </div>
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap flex-grow gap-4 items-center">
                    <div className="flex flex-grow justify-center relative">
                      {
                        item?.shop.discount > 0 &&
                          <div className="absolute rounded-full text-white bg-green-800 px-2 font-medium text-xs top-0 -mt-2 border border-black/20 dark:border-black">
                            {item?.shop.discount}% OFF 
                          </div>
                      }
                      <button className="p-5 rounded-full bg-custom-light-700 dark:bg-custom-dark-700 border border-black/20 dark:border-gray-500"
                        onClick={() => shopCartItemDetails(item)}
                      >
                        <img src={`${apiConfig().endpoint}/items/icon/${item?.shop.item.vnum}`} 
                        className="max-w-[30px] hover:scale-125 transition-transform duration-200" 
                        alt={item?.shop.item.vnum}/>
                      </button>                    
                    </div>
                    <Card className="flex flex-col flex-grow gap-1 !p-2 text-sm">
                      <div className="flex gap-4 justify-between">
                        <span className="font-bold">
                          {t("Quantity")}:
                        </span>
                        <span className="font-light">
                          {item?.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 justify-between">
                        <span className="font-bold">
                          {t("Price")}:
                        </span>
                        <span className="font-light">
                          <span className="flex items-center gap-1">{ discount(item?.shop.price, item?.shop.discount) } <Coin color="#FFD700" size={20} /></span>
                        </span>
                      </div>
                      <div className="flex gap-4 justify-between border-t border-black dark:border-white pt-2">
                        <span className="font-bold">
                          {t("Total")}:
                        </span>
                        <span className="font-light">
                          <span className="flex items-center gap-1">{ discount(item?.shop.price, item?.shop.discount) * item?.quantity } <Coin color="#FFD700" size={20} /></span>
                        </span>
                      </div>
                    </Card>
                  </div>
                </div>
                <hr className="border-black/20 dark:border-black" />
                <NavLink as="button" className="w-full flex gap-4 justify-center !text-[red] font-semibold" onClick={() => RemoveFromCart(item.id)}>
                  {t("Remove item")}
                  <ShopCartRemove color="red"/>     
                </NavLink>
              </Card>
            ))
          }
          </div>
        </div>
        <Card className="col-span-4 xl:col-span-1 flex flex-col gap-4 justify-between h-full overflow-hidden">
          <div className="flex flex-col gap-4 items-center  h-full overflow-hidden">
            <div className="hidden lg:block">
              <ShopCart size={200} />
            </div>
            <Card className="flex flex-col w-full gap-2 h-min overflow-hidden">
              <div className="flex flex-col w-full gap-2 max-h-40 lg:max-h-max overflow-auto">
                { shopCart?.map(item => (
                    <div className="flex gap-4 justify-between text-sm">
                      <span className="font-light flex gap-2 items-center">
                        <img src={`${apiConfig().endpoint}/items/icon/${item?.shop.item.vnum}`} className="max-w-[15px]" alt={item?.shop.item.vnum}/>
                        {`${cutString(item?.shop.item.name.uk, 10)} X${item.quantity}`}
                      </span>
                      <span className="font-light flex">
                        { discount(item?.shop.price, item?.shop.discount) * item?.quantity }
                      </span>
                    </div>
                  ))
                }              
              </div>
              <div className="flex gap-4 justify-between border-t border-black dark:border-white pt-2">
                <span className="font-bold">
                  {t("Total")}:
                </span>
                <span className="font-light flex gap-2 items-center">
                  {totalAmount}
                  <Coin color="#FFD700" size={20} />
                </span>
              </div>
            </Card>
          </div>
          {
            account?.balance >= totalAmount ?
              <PrimaryButton className="w-full" onClick={buyItems}>
                {t("Buy items")}
              </PrimaryButton>
            :
              <SecondaryButton as={Link} to={'/coins'} className="w-full text-center">
                {t("Insufficient balance")}
              </SecondaryButton>
          }
        </Card>
      </div>
    )
  else
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
        <ShopCart size={200} />
        <h1 className="text-3xl text-center">{t("The shop cart is empty")}</h1>
        <PrimaryButton as={Link} to={'/shop'} size="xl">
          {t("Go to Shop")}
        </PrimaryButton>
      </div>
    )
}
