import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shopItemsThunk } from '../../../../store/slices/shopItems.slice';
import { shopCategoriesThunk } from '../../../../store/slices/shopCategories';
import { Filters } from './partials/Filters';
import { ShopItems } from './partials/ShopItems';
import { Maintenance } from '../../../shared/Maintenance';
import { WeeklyItems } from './partials/WeeklyItems';
import { DailyItems } from './partials/DailyItems';
import Pagination from '@mui/lab/Pagination';
import { useTranslation } from 'react-i18next';

export const ShopPage = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const publicData = useSelector( (state) => state.publicData);
  const shopItems = useSelector( (state) => state.shopItems);
  const shopCategories = useSelector( (state) => state.shopCategories);
  const account = useSelector(state => state.account);

  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchText, setSearchText] = useState(""); 
  const [totalItems, setTotalItems] = useState(shopItems.length);
  const [totalPages, setTotalPages] = useState(Math.ceil(totalItems / itemsPerPage));
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
/*
  const filteredItems = shopItems?.filter(item => {
    if (!item) return false;
  
    return Object.values(item).some(value => {
      if (value === null) return false;
  
      const subValues = typeof value === 'object' ? Object.values(value) : [value];
  
      return subValues.some(subValue => {

  
        if (categories.length > 0 && typeof subValue === 'number' && categories.includes(subValue)) {
          return subValue.toString().toLowerCase().includes(searchText.toLowerCase());
        }
        if (typeof subValue === 'string' && subValue.toLowerCase().includes(searchText.toLowerCase())) {
          return true;
        }  
        return false;
      });
    });
  });


  const filteredItems = shopItems?.filter(item => {
    return Object.values(item || {}).some(value => {
      if (value !== null) {
        return Object.values(value).some(subValue => {

          if(categories.length > 0) {
            if (typeof subValue === 'number') {
              if(categories.includes(subValue))
                return subValue.toString().toLowerCase().includes(searchText.toLowerCase());
            }
          }

          else if (typeof subValue === 'string' && subValue !== null) {
            return subValue.toString().toLowerCase().includes(searchText.toLowerCase());
          }
          return false;
        });
      }
      return false;
    });
  });
*/

const filteredItems = shopItems?.filter(item => {
  return Object.values(item || {}).some(value => {
    if (!value) return false

    return Object.values(value).some(subValue => {
      if (!subValue) return false
      if(categories.length > 0) {
       // if (typeof subValue === 'number' ||) {
          if(categories.includes(subValue))
            return subValue.toString().toLowerCase().includes(searchText.toLowerCase());
       // }
      }

      else if (typeof subValue === 'string' && subValue !== null) {
        return subValue.toString().toLowerCase().includes(searchText.toLowerCase());
      }
    });
  });
});

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const onPageChange = (e, page) => {
    e.preventDefault()
    setCurrentPage(page);
  };

  const onRowsChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1);
  }

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (selected) => {
    setCategories(selected.map(item => item.value))
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(shopItemsThunk());
    dispatch(shopCategoriesThunk());
  }, [])

  useEffect(() => {
    setTotalItems(filteredItems.length)
  }, [filteredItems])

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage))
  }, [totalItems, itemsPerPage])

  if(publicData.id) {

    if(publicData.web_shop.status)
  
      return (
        <div className="grid grid-cols-5 gap-4 flex-grow h-full p-4 overflow-auto">
          <WeeklyItems className="col-span-5 xl:col-span-1" />
          <DailyItems items={account?.dailyShop} className="col-span-5 xl:col-span-4" />
          <div className="col-span-5 xl:col-span-1">
            <Filters
              shopCategories={shopCategories}
              handleSearchChange={handleSearchChange}
              handleCategoryChange={handleCategoryChange}
            />
          </div>
          <div className="col-span-5 xl:col-span-4 flex flex-col justify-between gap-4">
            <ShopItems shopItems={currentItems} />
            <hr className="border-black/20 dark:border-black"/>
            <div className="flex flex-wrap justify-start gap-4">

              <label htmlFor="tableRows" className="flex gap-2 items-center rounded-full p-2 px-3 
                bg-white dark:bg-white/80 border dark:border-admin-dark-600 text-black font-normal"
              >
                {t("Show")}:
                <select
                  id="tableRows" 
                  className="bg-transparent border-0 focus-visible:outline-none" 
                  onChange={(e) => onRowsChange(e)}>
                  <option defaultValue={15} selected>15</option>
                  <option defaultValue={25}>25</option>
                  <option defaultValue={30}>30</option>
                  <option defaultValue={50}>50</option>
                </select>
              </label>
              <div className="p-1 rounded-full bg-white dark:bg-white/80 border dark:border-admin-dark-600">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={onPageChange}
                  showFirstButton
                  showLastButton
                />
              </div>
            </div>
          </div>
        </div>
      );

    return <Maintenance data={publicData} message="Web shop is under maintenance" />
  } 
};
