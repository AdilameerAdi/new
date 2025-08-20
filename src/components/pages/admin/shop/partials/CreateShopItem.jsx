import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Modal from '../../../../elements/Modal';
import { SwitchCustom } from '../../../../elements/SwitchCustom';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { BarcodeScanner, Coin, Package, Percent, Tag } from '../../../../../../public/icons/Svg';
import { CustomSelect } from '../../../../elements/CustomSelect';
import { Input } from '../../../../elements/Input';
import axios from 'axios';
import apiConfig from '../../../../../utils/apiConfig';
import Swal from 'sweetalert2';
import { shopItemsThunk } from '../../../../../store/slices/shopItems.slice';
import { setLoad } from '../../../../../store/slices/loader.slice';
import appError from '../../../../../utils/appError';
import { Discount } from '@mui/icons-material';

export const CreateShopItem = ({ newShopItemModal, setNewShopItemModal, shopCategories }) => {
  
  const dispatch = useDispatch()

  const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();
  const [selectedCategories, setSelectedCategories] = useState([])

  const [stackeable, setStackeable] = useState(false)

  const selectCompatible = (obj) => {
    let array = []

    obj.map(item => (
      array.push({ label: item.name, value: item.id })
    ))

    return array
  }
  
  const handleSelect = (selected) => {
    const outputArray = selected.map(item => item.value);

    setSelectedCategories(outputArray)
  }
  
  const handleCreate = async (data) => {

    const url = `${apiConfig().endpoint}/shop/`

    const body = {
      vnum: data.vnum,
      categories: selectedCategories,
      stackeable,
      stack: data.stack || 1,
      price: data.price,
      discount: data.discount
    }

    dispatch(setLoad(false));

    await axios.post(url, body, apiConfig().axios)
    .then(() => {
      Swal.fire({
        toast: true,
        position: 'bottom-right',
        icon: 'success',
        text: 'The shop item was created successfully!',
        showConfirmButton: false,
        timer: 5000,
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
        timer: 5000,
        timerProgressBar: true,
      });
    })
    .finally(() => {
      reset()
      setNewShopItemModal(false)
      dispatch(shopItemsThunk())
      dispatch(setLoad(true))
    })
  }

  return (
    <Modal
      open={newShopItemModal}
      setOpen={setNewShopItemModal}
      title={'Create shop item'}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleCreate)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            icon={<BarcodeScanner />}
            id="vnum"
            name="vnum"
            type="number"
            label="VNum"
            min="1"
            placeholder="Insert vnum"
            register={{
              function: register,
              errors: {
                function: errors,
                rules: { required: 'VNum is required' },
              },
            }}
          />
          <Input
            icon={<Package />}
            id="stack"
            name="stack"
            type="number"
            label="Stackeable"
            min="1"
            max="999"
            placeholder="Insert stack"
            disabled={!stackeable}
            defaultValue="1"
            element={
              <SwitchCustom
                checked={stackeable}
                setChecked={setStackeable}
              />
            }
            register={{
              function: register,
              errors: {
                function: errors,
              },
            }}
          />
        </div>
        <CustomSelect
          icon={<Tag />}
          label="Categories"
          name="categories"
          id="categories"
          isMulti={true}
          onChange={handleSelect}
          data={selectCompatible(shopCategories)}
          register={{
            function: register,
            errors: {
              function: errors,
            },
          }}
        /> 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            icon={<Coin />}
            id="price"
            name="price"
            type="number"
            label="Price"
            min="1"
            placeholder="Insert price"
            register={{
              function: register,
              errors: {
                function: errors,
                rules: { required: 'Price is required' },
              },
            }}
          />
          <Input
            icon={<Percent />}
            id="discount"
            name="discount"
            type="number"
            label="Discount"
            min="0"
            max="100"
            placeholder="Percent"
            defaultValue="0"
            register={{
              function: register,
              errors: {
                function: errors,
                rules: { required: 'Discount is required' },
              },
            }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SecondaryButton type="button" onClick={() => setNewShopItemModal(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit">Accept</PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}
