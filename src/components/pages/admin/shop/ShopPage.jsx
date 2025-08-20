import { shopWeeklyItemsThunk } from '../../../../store/slices/shopWeeklyItems.slice';
import { shopDailyItemsThunk } from '../../../../store/slices/shopDailyItems.slice';
import { shopCategoriesThunk } from '../../../../store/slices/shopCategories';
import { AccountsWeeklyShopTable } from './partials/AccountsWeeklyShopTable';
import { AccountsDailyShopTable } from './partials/AccountsDailyShopTable';
import { shopItemsThunk } from '../../../../store/slices/shopItems.slice';
import { ShopWeeklyItemsTable } from './partials/ShopWeeklyItemsTable';
import { ShopCategoriesTable } from './partials/ShopCategoriesTable';
import { ShopDailyItemsTable } from './partials/ShopDailyItemsTable';
import { usersThunk } from '../../../../store/slices/users.slice';
import { ShopItemsTable } from './partials/ShopItemsTable';
import { useDispatch, useSelector } from 'react-redux';
import { ShopHeader } from './partials/ShopHeader';
import React, { useEffect, useState } from 'react'

export const ShopPage = () => {
  
  const dispatch = useDispatch()

  const publicData = useSelector(state => state.publicData)
  const shopItems = useSelector( (state) => state.shopItems);
  const shopCategories = useSelector( (state) => state.shopCategories);
  const shopDailyItems = useSelector( (state) => state.shopDailyItems);
  const shopWeeklyItems = useSelector( (state) => state.shopWeeklyItems);
  const users = useSelector((state) => state.users)

  const [option, setOption] = useState(1)

  useEffect(() => {
    dispatch(shopItemsThunk());
    dispatch(shopCategoriesThunk());
    dispatch(shopDailyItemsThunk());
    dispatch(shopWeeklyItemsThunk(true));
    dispatch(usersThunk())
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <ShopHeader option={option} setOption={setOption}/>
      { 
        option === 1 && 
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="col-span-1 xl:col-span-2 flex flex-col gap-4">
              <ShopItemsTable publicData={publicData} shopItems={shopItems} shopCategories={shopCategories}/>
            </div>
            <div className="col-span-1">
              <ShopCategoriesTable shopCategories={shopCategories}/>
            </div>
          </div>
      }
      { 
        option === 2 && 
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="col-span-1 xl:col-span-3 flex flex-col gap-4">
              <ShopDailyItemsTable shopDailyItems={shopDailyItems} />
            </div>
            <div className="col-span-2">
              <AccountsDailyShopTable users={users} />
            </div>
          </div>
      }
      { option === 3 && 
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="col-span-1 xl:col-span-2 flex flex-col gap-4">
            <ShopWeeklyItemsTable shopWeeklyItems={shopWeeklyItems.weeklyItems} />
          </div>
          <div className="col-span-1">
            <AccountsWeeklyShopTable users={shopWeeklyItems.weeklyUsers} />
          </div>
        </div>
      }
    </div>
  )
}
