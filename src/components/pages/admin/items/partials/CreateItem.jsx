import React, { useEffect, useState } from 'react'
import Modal from '../../../../elements/Modal'
import { useForm } from 'react-hook-form';
import { Card } from '../../../../elements/admin/Card';
import { CustomSelect } from '../../../../elements/CustomSelect';
import { useDispatch } from 'react-redux';
import languages from '../../../../../utils/languages';
import Swal from 'sweetalert2';
import { Add, Camera } from '../../../../../../public/icons/Svg';
import { Textarea } from '../../../../elements/Textarea';
import { Input } from '../../../../elements/Input';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import apiConfig from '../../../../../utils/apiConfig';
import axios from 'axios';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { itemsThunk } from '../../../../../store/slices/items.slice';
import appError from '../../../../../utils/appError';
import { IconFileInput } from './IconFileInput';

const names = {
    cz: "",
    de: "",
    es: "",
    fr: "",
    it: "",
    pl: "",
    ru: "",
    tr: "",
    uk: "",
}
const descs = {
    cz: "",
    de: "",
    es: "",
    fr: "",
    it: "",
    pl: "",
    ru: "",
    tr: "",
    uk: "",
}

export const CreateItem = ({ newItemModal, setNewItemModal }) => {
    
    const dispatch = useDispatch()

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const [langName, setLangName] = useState('uk')
    const [langDesc, setLangDesc] = useState('uk')

    const [nameState, setNameState] = useState(names)
    const [descState, setDescState] = useState(descs)

    const [previewSrc, setPreviewSrc] = useState('');
    const [error, setError] = useState('');

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
  
    const handleFileInputChange = (event) => {
      const file = event.target.files[0];
      if (!file) {
        setError('No file selected.');
        return;
      }
  
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    };

    const handleCreate = async (data) => {

        const formData = new FormData();

        formData.append('icon', data.icon[0]);
        formData.append('names', JSON.stringify(nameState));
        formData.append('descs', JSON.stringify(descState));
        formData.append('type', data.type);
        formData.append('vnum', data.vnum);

        const url = `${apiConfig().endpoint}/items/create/`

        dispatch(setLoad(false));

        await axios.post(url, formData, apiConfig().axios)
            .then(res => {
                reset()
                setNewItemModal(false)
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

    return (
        <Modal
            open={newItemModal}
            setOpen={setNewItemModal}
            title={'Create item'}
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleCreate)} encType="multipart/form-data">
                <Card className="flex gap-4 items-center z-20">
                    <CustomSelect
                        label="Name"
                        name="names"
                        id="names"
                        defaultValue={languages?.filter(item => item.value === langName)[0]}
                        onChange={(selected) => {
                            setLangName(selected.value)
                            reset({ name: "" })
                        }}
                        data={languages}
                        element={
                            <div className="flex gap-2">
                                <input
                                    className="bg-transparent w-full" 
                                    placeholder="Enter item name" 
                                    autoComplete="off"
                                    defaultValue={nameState[langName]}
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
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required: true
                                },
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
                                reset({ desc: "" })
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
                            defaultValue={descState[langDesc] && descState[langDesc]}
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
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required: 'VNum is required'
                                },
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
                    <SecondaryButton type="button" onClick={() => setNewItemModal(false)}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit">Accept</PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}
