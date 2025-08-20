import React, { useState } from 'react'
import { Input } from '../../../../elements/Input'
import { SwitchCustom } from '../../../../elements/SwitchCustom'
import { RichTextArea } from '../../../../elements/RichTextArea'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import apiConfig from '../../../../../utils/apiConfig'
import { setLoad } from '../../../../../store/slices/loader.slice'
import Swal from 'sweetalert2'
import axios from 'axios'
import { blogThunk } from '../../../../../store/slices/blog.slice'
import convertDate from '../../../../../utils/convertDate'
import { CalendarMonthRounded, StarBorder } from '@mui/icons-material'
import appError from '../../../../../utils/appError'
import { Card } from '../../../../elements/admin/Card'

export const CreateArticle = ({ setNewArticle }) => {

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const account = useSelector(state => state.account)

    const dispatch = useDispatch()

    const [body, setBody] = useState('')
    const [showUsername, setShowUsername] = useState(false)

    const title = watch("title")
    const header = watch("header")
    const author = watch("author")

    const date = new Date();
    const formatDate = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }

    const submit = async (data) => {

        const url = `${apiConfig().endpoint}/blog/`

        let formData = data

        formData.author = showUsername ? null : data.author
        formData.body = body

        dispatch(setLoad(false));

        await axios.post(url, formData, apiConfig().axios)
            .then(res => {
                Swal.fire({
                    toast: true,
                    position: 'bottom-right',
                    icon: 'success',
                    text: res.data.message,
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                });
                setNewArticle(false)
                reset()
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
                dispatch(blogThunk())
                dispatch(setLoad(true))
            })
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="h-max">
                <form className="flex flex-col gap-4 font-normal text-left" onSubmit={handleSubmit(submit)}>
                    <h1 className="text-xl">Create article</h1>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        label="Title"
                        placeholder="Insert article title"
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required:
                                    'Title is required',
                                },
                            },
                        }}
                    />

                    <Input
                        id="header"
                        name="header"
                        type="url"
                        label="Header img URL"
                        placeholder="Insert header image URL"
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required:
                                    'URL is required',
                                },
                            },
                        }}
                    />

                    <Input
                        id="author"
                        name="author"
                        type="text"
                        label="Author"
                        placeholder="Insert author name"
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                            },
                        }}
                        element={
                            <div className="flex items-center gap-2">
                                <label className="text-xs">My username</label>
                                <SwitchCustom
                                    checked={showUsername}
                                    setChecked={setShowUsername}
                                />
                            </div>
                        }
                        disabled={showUsername}
                    />

                    <RichTextArea setValue={setBody}/>

                    <PrimaryButton type="submit">
                        Save
                    </PrimaryButton>

                </form>
            </Card>
            <Card className="flex flex-col gap-4">
                <h1 className="text-xl">Preview</h1>
                <div className="flex flex-col gap-4">
                    <header className="w-full h-48 bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden relative !text-white"
                        style={{ backgroundImage: `url(${header})` }}
                    >
                        <div className="absolute w-full h-full bg-black/70 flex flex-col gap-6 p-4 font-medium">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex gap-1 items-center">
                                    <CalendarMonthRounded className="text-blue-500" /> 
                                    <span>{convertDate(date, formatDate)}</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <StarBorder className="text-yellow-500" /> 
                                    <span>{showUsername ? account.web_username : author}</span>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl">{title}</h1>
                        </div>
                    </header>
                    <div id="raw_html" dangerouslySetInnerHTML={{ __html: body }}></div>
                </div>
            </Card>
        </div>
    )
}
