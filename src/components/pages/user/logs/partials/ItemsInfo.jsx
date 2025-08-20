import React, { useEffect, useState } from 'react'
import { Card } from '../../../../elements/Card'
import apiConfig from '../../../../../utils/apiConfig'
import { useDispatch } from 'react-redux'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import Modal from '../../../../elements/Modal'
import { Eye } from '../../../../../../public/icons/Svg'
import appError from '../../../../../utils/appError'

export const ItemsInfo = ({ data }) => {

    const [items, setItems] = useState([])
    const [modal, setModal] = useState(false)

    const dispatch = useDispatch();

    const getItemInfo = async () => {

        const array = []

        dispatch(setLoad(false));

        data.item.items.forEach(async (item) => {

            const url = `${apiConfig().endpoint}/items/${item.itemVnum}`

            await axios.get(url, apiConfig().axios)
                .then(res => array.push(res.data.item)
                )
                .catch(err => appError(err))
        
        });

        setItems(array)
        dispatch(setLoad(true));
    }

    useEffect(() => {
        getItemInfo()
    }, [])

    return (

        <div className="flex gap-4 justify-center">
            <Modal
                open={modal}
                setOpen={setModal}
                title={data.title}
                className="flex flex-col gap-4"
            >
                <Card className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <img src={`/img/class/${data.item.character.class}_${data.item.character.gender}.png`}
                                className="border border-zinc-600 rounded-full bg-black w-6 aspect-square"
                                alt={data.item.character.name} 
                            />
                            <span>{data.item.character.name}</span>
                        </div>
                        <span className="text-xs uppercase font-medium">Items</span>                     
                    </div>
                    <hr className="border-black/20 dark:border-black" />
                    {
                        items.map((item, index) => (
                            <div className="flex gap-2 text-sm" key={index}>
                                <img src={`${apiConfig().endpoint}/items/icon/${item.vnum}`} alt={item.vnum} className="w-6 rounded-full" />
                                <span className="text-green-500">[{item.vnum}]</span>
                                <span>{item.name.uk}</span>
                            </div>
                        ))
                    }
                </Card>
            </Modal>
            <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
                onClick={() => setModal(!modal)}
            >
                <Eye />
            </button>
        </div>


    )
}
