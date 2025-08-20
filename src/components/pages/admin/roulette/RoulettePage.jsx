import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { wheelItemsThunk } from '../../../../store/slices/wheelItems.slice';
import apiConfig from '../../../../utils/apiConfig';
import { Table } from '../../../elements/Table';
import { CreateWheelItem } from './partials/CreateWheelItem';
import { DeleteWheelItems } from './partials/DeleteWheelItems';
import { PrimaryButton } from '../../../elements/PrimaryButton';
import { SecondaryButton } from '../../../elements/SecondaryButton';
import axios from 'axios';
import { setLoad } from '../../../../store/slices/loader.slice';
import { Delete, Edit, ToggleOff, ToggleOn } from '../../../../../public/icons/Svg';
import { UpdateWheelItems } from './partials/UpdateWheelItems';
import { DeleteWheelItem } from './partials/DeleteWheelItem';
import { WheelSettings } from './partials/WheelSettings';
import { publicThunk } from '../../../../store/slices/public.slice';
import appError from '../../../../utils/appError';
import { RouletteRoom } from '../../user/roulette/partials/RouletteRoom';

const Element = ({ selectedElements = [], setSelectedElements }) => {

    const [newShopItemModal, setNewShopItemModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
  
    return (
      <div className="flex gap-4 border-b border-black/20 dark:border-admin-dark-500 pb-4">
        <CreateWheelItem
          modal={newShopItemModal}
          setModal={setNewShopItemModal}
        />

        <DeleteWheelItems
          modal={deleteModal}
          setModal={setDeleteModal}
          items={selectedElements}
          setItems={setSelectedElements}
        />

        <PrimaryButton
          className="font-normal"
          onClick={() => setNewShopItemModal(true)}
        >
          New item
        </PrimaryButton>
        {
          selectedElements.length > 0 &&
            <SecondaryButton
              className="font-normal"
              onClick={() => setDeleteModal(true)}
            >
              Delete {selectedElements.length} items
            </SecondaryButton>
        }
      </div>
    )
}

const Actions = ({ itemId }) => {

    const dispatch = useDispatch()
  
    const [updateModal, setUpdateModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [item, setItem] = useState({})
  
    const getItemInfo = async () => {
  
      const url = `${apiConfig().endpoint}/wheel/${itemId}`
      dispatch(setLoad(false));
  
      await axios.get(url, apiConfig().axios)
        .then(res => setItem(res.data))
        .catch(err => appError(err))
        .finally(() => dispatch(setLoad(true)))
    }
  
    return (
      <div className="flex gap-4 justify-center">
        <UpdateWheelItems
          modal={updateModal}
          setModal={setUpdateModal}
          item={item}
        />
        <DeleteWheelItem
          modal={deleteModal}
          setModal={setDeleteModal}
          item={item}
        />
        <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
          onClick={() => { getItemInfo(); setUpdateModal(true) }}
        >
          <Edit color="green" />
        </button>
        <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
          onClick={() => { getItemInfo(); setDeleteModal(true) }}
        >
          <Delete color="red" />
        </button>
      </div>
    )
}

export const RoulettePage = () => {

    const dispatch = useDispatch()

    const publicData = useSelector(state => state.publicData);
    const wheelItems = useSelector((state) => state.wheelItems);
  
    useEffect(() => {
      dispatch(wheelItemsThunk());
    }, [])

    useEffect(() => {
      dispatch(publicThunk())
    }, [])

    const header = [
      {
        field: 'icon',
        img: `${apiConfig().endpoint}/items/icon/%FIELD%`,
        name: 'Icon',
      },
      {
        field: 'id',
        name: 'ID',
      },
      {
        field: 'vnum',
        name: 'VNum',
      },
      {
        field: 'name',
        name: 'Name (EN)',
        wordWrap: 30,
      },
      {
        field: 'jackpot',
        name: 'Jackpot',
        function: {
          func: function (param) {
              return param ? <ToggleOn color="green"/> : <ToggleOff color="red"/> 
          },
        }
      },
      {
        field: 'desc.uk',
        name: 'Description (EN)',
        wordWrap: 30,
      },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="md:col-span-5">
          <Table
            admin
            header={header} 
            items={wheelItems.items}
            element={<Element />}
            title={"Wheel items"}
            check={"id"}
            actions={{
              header: 'Manage',
              component: <Actions />, 
              params: { itemId: '%id%' }
            }}
          />             
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          { publicData.id && <WheelSettings data={publicData?.web_wheel}/> }
          <RouletteRoom admin />
        </div>
      </div>
    )
}
