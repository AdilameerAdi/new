import apiConfig from '../../../../../utils/apiConfig'
import React from 'react'

export const DailyItemsDropdown = ({ data = [] }) => {

    if(data.length > 0) return <div className="p-4 flex justify-center font-medium">No data available</div>

    return (
        <div className="p-4">
            <table className="w-full border dark:border-admin-dark-700">
                <thead className="bg-admin-light-700 dark:bg-admin-dark-500/50">
                    <tr>
                        <th className="p-2">Icon</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                {
                    data?.map((item, index) => (
                        <tr key={index}
                            className="hover:bg-admin-light-700/50 dark:hover:bg-admin-dark-700/50 
                            border-b dark:border-admin-dark-700"
                        >
                            <td className="p-2 flex justify-center">
                                <img src={`${apiConfig().endpoint}/items/icon/${item.shopDaily?.item?.vnum}`} className="max-w-[30px]" />
                            </td>
                            <td className="p-2 text-center">
                                <span className="font-medium">
                                    {item.shopDaily?.item?.name?.uk}
                                </span>
                            </td>
                            <td className="p-2">
                                <div className="flex justify-center items-center">
                                    { !item.status ? "BUYED" : "NOT BUYED" }                                    
                                </div>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table> 
        </div>
    )
}
