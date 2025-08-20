import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import Swal from 'sweetalert2'
import Modal from '../../../../elements/Modal'
import { useForm } from 'react-hook-form'
import { Input } from '../../../../elements/Input'
import { CustomSelect } from '../../../../elements/CustomSelect'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import apiConfig from '../../../../../utils/apiConfig'
import { itemsThunk } from '../../../../../store/slices/items.slice'
import { Add } from '../../../../../../public/icons/Svg'
import { Textarea } from '../../../../elements/Textarea'
import { Card } from '../../../../elements/admin/Card'
import languages from '../../../../../utils/languages'
import appError from '../../../../../utils/appError'
import { IconFileInput } from './IconFileInput'

export const UpdateItems = ({ updateModal, setUpdateModal, item }) => {

    const dispatch = useDispatch()

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const [langName, setLangName] = useState('uk')
    const [langDesc, setLangDesc] = useState('uk')

    const [nameState, setNameState] = useState(item.name)
    const [descState, setDescState] = useState(item.desc)

    const name = watch('name')
    const desc = watch('desc')

    const handleLangNameText = () => {

        const namesNew = { ...nameState }
        namesNew[langName] = name;

        setNameState(namesNew);

        Swal.fire({
            toast: true,
            position: 'bottom-right',
            icon: 'success',
            text: `The name was added! (${langName})`,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
        });
    }

    const handleLangDescText = () => {

        const descsNew = { ...descState }
        descsNew[langDesc] = desc;

        setDescState(descsNew);

        Swal.fire({
            toast: true,
            position: 'bottom-right',
            icon: 'success',
            text: `The description was added! (${langDesc})`,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
        });
    }

    const handleUpdate = async (data) => {


        const formData = new FormData();

        formData.append('icon', data.icon[0]);
        formData.append('names', JSON.stringify(nameState));
        formData.append('descs', JSON.stringify(descState));
        formData.append('type', data.type);
        formData.append('vnum', data.vnum);

        const body = {
            names: nameState,
            descs: descState,
            type: data.type,
            vnum: data.vnum,
            icon: data.vnum,
        }

        const url = `${apiConfig().endpoint}/items/update/${item.vnum}`
    
        dispatch(setLoad(false));
        await axios.patch(url, formData, apiConfig().axios)
        .then(res => {
            setUpdateModal(false)
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
            dispatch(itemsThunk())
            dispatch(setLoad(true))
        })
    }

    useEffect(() => {
        reset()
    }, [updateModal])

    useEffect(() => {
        setNameState(item.name)
        setDescState(item.desc)
    }, [name, item])

    return (
        <Modal
            open={updateModal}
            setOpen={setUpdateModal}
            title={'Update item'}
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleUpdate)} encType="multipart/form-data">
                <Card className="flex gap-4 z-20">
                    <CustomSelect
                        label="Name"
                        name="names"
                        id="names"
                        defaultValue={languages?.filter(item => item.value === langName)[0]}
                        onChange={(selected) => {
                            setLangName(selected.value)
                            reset()
                        }}
                        data={languages}
                        element={
                            <div className="flex gap-2">
                                <input
                                    className="bg-transparent w-full" 
                                    placeholder="Enter item name" 
                                    autoComplete="off"
                                    defaultValue={nameState && nameState[langName]}
                                    {...register('name', { required: true })}
                                />
                                <button type="button" onClick={handleLangNameText}>
                                    <Add />
                                </button>
                            </div>
                        }
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                            },
                        }}
                    />
                    <IconFileInput
                        label="Icon"
                        id="icon"
                        name="icon"
                        accept="image/png"
                        preview={`${apiConfig().endpoint}/items/icon/${item.vnum}`}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                            },
                        }}
                    />

                </Card>
                <Card className="flex flex-col gap-2 z-10">
                    <div className="flex flex-col gap-4">
                        <CustomSelect
                            label="Description"
                            name="descs"
                            id="descs"
                            defaultValue={languages?.filter(item => item.value === langDesc)[0]}
                            onChange={(selected) => {
                                setLangDesc(selected.value)
                                reset()
                            }}
                            data={languages}
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                },
                            }}
                        /> 
                        <Textarea 
                            id="desc"
                            rows="6"
                            name="desc"
                            placeholder="Insert description"
                            defaultValue={descState && descState[langDesc]}
                            register={{
                                function: register,
                                errors: {
                                    function: errors,
                                },
                            }}
                            element={
                                <button type="button" onClick={handleLangDescText}>
                                    <Add />
                                </button>                                
                            }
                        />                        
                    </div>
                </Card>

                <Card className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        id="vnum"
                        name="vnum"
                        type="number"
                        label="VNum"
                        min="1"
                        max="999999"
                        placeholder="Insert VNum"
                        defaultValue={item.vnum}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: { required: 'VNum is required' },
                            },
                        }}
                    />
                    <Input
                        id="type"
                        name="type"
                        type="number"
                        label="Type"
                        min="0"
                        max="99"
                        placeholder="Insert type"
                        defaultValue={item.type}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: { required: 'Type is required' },
                            },
                        }}
                    />
                </Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SecondaryButton type="button" onClick={() => setUpdateModal(false)}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit">Accept</PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}
