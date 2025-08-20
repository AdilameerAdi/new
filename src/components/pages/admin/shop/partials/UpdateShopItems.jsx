import React, { useEffect, useState } from 'react'
import Modal from '../../../../elements/Modal'
import apiConfig from '../../../../../utils/apiConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { shopItemsThunk } from '../../../../../store/slices/shopItems.slice'
import Swal from 'sweetalert2'
import { SwitchCustom } from '../../../../elements/SwitchCustom'
import { Input } from '../../../../elements/Input'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { CustomSelect } from '../../../../elements/CustomSelect'
import { Coin, Package, Percent, Tag } from '../../../../../../public/icons/Svg'
import appError from '../../../../../utils/appError'


export const UpdateShopItems = ({ modal, setModal, item, shopCategories }) => {
  
  const { register, handleSubmit, watch, reset, setValue, formState: { errors }} = useForm();

  const dispatch = useDispatch()

  const [stackeable, setStackeable] = useState(item.stackeable)
  const [defaultCategories, setDefaultCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

  const selectCompatible = (obj) => {
    let array = []

    obj.map(item => (
      array.push({ label: item.name, value: item.id })
    ))

    return array
  }

  const getDefaultCategories = () => {

    const itemCategories = item.categories
    const convertedArray = selectCompatible(shopCategories)
    const selectedArray = convertedArray.filter(category => itemCategories?.includes(category.value))

    setDefaultCategories(selectedArray)    
  }

  const handleUpdate = async (data) => {

    const url = `${apiConfig().endpoint}/shop/${item.id}`

    const body = {
      categories: selectedCategories,
      stackeable,
      stack: data.stack || 1,
      price: data.price,
      discount: data.discount || 0
    }

    dispatch(setLoad(false));

    await axios.patch(url, body, apiConfig().axios)
      .then(() => {
        Swal.fire({
          toast: true,
          position: 'bottom-right',
          icon: 'success',
          text: 'The shop item was updated successfully!',
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
        setModal(false)
        dispatch(shopItemsThunk())
        dispatch(setLoad(true))
      })

  }
  
  const handleSelect = (selected) => {
    const outputArray = selected.map(item => item.value);

    setSelectedCategories(outputArray)
  }


  useEffect(() => {
    handleSelect(defaultCategories)
  }, [defaultCategories])

  useEffect(() => {
    setValue('price', item?.price); 
    setValue('discount', item?.discount); 
    setValue('stack', item?.stack);
    getDefaultCategories()
  }, [item]);

  return (
    <Modal
      open={modal}
      setOpen={setModal}
      title={'Update shop item'}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleUpdate)}>
        <CustomSelect
          icon={<Tag />}
          label="Categories"
          name="categories"
          id="categories"
          isMulti={true}
          defaultValue={defaultCategories}
          onChange={handleSelect}
          data={selectCompatible(shopCategories)}
          register={{
            function: register,
            errors: {
              function: errors,
            },
          }}
        /> 
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            icon={<Coin />}
            id="price"
            name="price"
            type="number"
            label="Price"
            min="1"
            placeholder="Insert price"
            defaultValue={item?.price}
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
            defaultValue={item?.discount}
            register={{
              function: register,
              errors: {
                function: errors,
                rules: { required: 'Discount is required' },
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
            defaultValue={item?.stack}
            disabled={!stackeable}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SecondaryButton type="button" onClick={() => setModal(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit">Accept</PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}
