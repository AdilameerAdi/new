import React from 'react'
import { Coin, Trophy } from '../../../../../../../public/icons/Svg'
import apiConfig from '../../../../../../utils/apiConfig'
import { Card } from '../../../../../elements/admin/Card'
import { NavLink } from '../../../../../elements/admin/NavLink'

export const AOT = ({ data, setPrize, color, setModal, setCategory }) => {

  const __init__ = (item) => {
    setPrize(item)
    setModal(true)
    setCategory('aot')
  }

  return (
    <div className="flex flex-col gap-2">
      {
        data?.map((item, index) => (
          <>
            <hr className="border-black/20 dark:border-admin-dark-500"/>
            <NavLink
              as="button"
              key={index} 
              className="flex gap-4 items-center justify-between" 
              onClick={() => __init__(item) }>
              <div className="flex gap-4 items-center">
                <Trophy size={30} color={color(item.place)} />
                <h1 className="text-xl font-medium">{item.place} Place</h1>
              </div>
              {
                !item.type ?
                  <img src={`${apiConfig().endpoint}/items/icon/${item.prize}`} />
                : 
                  <Coin size={40} />
              }
            </NavLink>
          </>
        ))
      }
    </div>
  )
}
