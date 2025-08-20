import React, { useEffect, useState } from 'react'
import { Table } from '../../../../elements/Table'
import { CancelCircle, CheckCircle, Delete, Edit } from '../../../../../../public/icons/Svg'
import { useDispatch } from 'react-redux'
import apiConfig from '../../../../../utils/apiConfig'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import appError from '../../../../../utils/appError'
import { UpdateChannel } from './UpdateChannel'
import { DeleteChannel } from './DeleteChannel'
import { CreateChannel } from './CreateChannel'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { DeleteChannels } from './DeleteChannels'
import { PrimaryButton } from '../../../../elements/PrimaryButton'

const Element = ({ selectedElements = [], setSelectedElements }) => {

    const [newModal, setNewModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
  
    return (
        <div className="flex justify-start gap-4 border-b border-black/20 dark:border-admin-dark-500 pb-4">
    
            <CreateChannel
                modal={newModal}
                setModal={setNewModal}
            />
    
            <DeleteChannels
                modal={deleteModal}
                setModal={setDeleteModal}
                channels={selectedElements}
                setChannels={setSelectedElements}
            />
    
            <PrimaryButton
                className="font-normal"
                onClick={() => setNewModal(true)}
            >
                New channel
            </PrimaryButton>
            {selectedElements.length > 0 ?
                <SecondaryButton
                    className="font-normal"
                    onClick={() => setDeleteModal(true)}
                >
                    Delete {selectedElements.length} items
                </SecondaryButton>
                : null
            }
        </div>
    )
}

const Actions = ({ id }) => {

    const dispatch = useDispatch()
  
    const [updateModal, setUpdateModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
  
    const [channel, setChannel] = useState({})
  
    const getChannelInfo = async () => {
  
        const url = `${apiConfig().endpoint}/channels/${id}`
        dispatch(setLoad(false));
    
        await axios.get(url, apiConfig().axios)
            .then(res => setChannel(res.data))
            .catch(err => appError(err))
            .finally(() => dispatch(setLoad(true)))
    }
  
    return (
        <div className="flex gap-4 justify-center">
            <UpdateChannel
                modal={updateModal}
                setModal={setUpdateModal}
                channel={channel}
            />
            <DeleteChannel
                modal={deleteModal}
                setModal={setDeleteModal}
                channel={channel}
            />
            <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
                onClick={() => { getChannelInfo(); setUpdateModal(true) }}
            >
                <Edit color="green" />
            </button>
            <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
                onClick={() => { getChannelInfo(); setDeleteModal(true) }}
            >
                <Delete color="red" />
            </button>
        </div>
    )
}

export const ChannelsTable = ({ data = [] }) => {

    const header = [
        {
            field: 'id',
            name: 'ID',
        },
        {
            field: 'name',
            name: 'Name',
        },
        {
            field: 'port',
            name: 'Port',
        },
        {
            field: 'status',
            name: 'Status',
            function: {
                func: function (param) {
                    return param ? <CheckCircle color="green" /> : <CancelCircle color="red" />
                },
            }
        },
    ]

    return (
        <Table
            admin
            header={header} 
            items={data.length > 0 ? data : []} 
            title={"Server Channels"}
            check={"id"}
            element={ <Element />}
            actions={{
                header: 'Manage',
                component: <Actions />, 
                params: { id: '%id%' }
            }}
        />  
    )
}
