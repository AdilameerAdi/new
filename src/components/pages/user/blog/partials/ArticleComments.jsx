import React, { Fragment, useState } from 'react'
import { Card } from '../../../../elements/Card'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { SwitchCustom } from '../../../../elements/SwitchCustom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Textarea } from '../../../../elements/Textarea'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import apiConfig from '../../../../../utils/apiConfig'
import Swal from 'sweetalert2'
import convertDate from '../../../../../utils/convertDate'
import { NavLink } from '../../../../elements/user/NavLink'
import { Admin, Delete, MoreVert } from '../../../../../../public/icons/Svg'
import appError from '../../../../../utils/appError'
import Modal from '../../../../elements/Modal'
import cutString from '../../../../../utils/cutString'
import { Menu, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PublicProfileModal } from '../../profile/partials/PublicProfileModal'

export const ArticleComments = ({ article, getArticleInfo }) => {

    const { register, handleSubmit, reset, formState: { errors }} = useForm();

    const account = useSelector(state => state.account)

    const [seeMore, setSeeMore] = useState({ body: null, author: null, createdAt: null })
    const [seeMoreModal, setSeeMoreModal] = useState(false)
    const [profileModal, setProfileModal] = useState(false)
    const [author, setAuthor] = useState(false)
    const [id, setId] = useState(null)

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleDelete = async (id) => {

        const url = `${apiConfig().endpoint}/blog/comment/${id}`

        dispatch(setLoad(false));
        
        await axios.delete(url, apiConfig().axios)
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
                getArticleInfo()
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
                dispatch(setLoad(true))
            })
    }

    const deletePopup = (id) => {
        Swal.fire({
            title: t("Are you sure?"),
            text: t("You won't be able to revert this!"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: t("Yes, delete it!")
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(id)
            }
        });
    }

    const submit = async (data) => {

        const url = `${apiConfig().endpoint}/blog/comment/${article.id}`

        let formData = data

        formData.author = !author

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
                reset()
                getArticleInfo()
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
                dispatch(setLoad(true))
            })

    }

    return (
        <Card className="flex flex-col gap-4">
            <PublicProfileModal modal={profileModal} setModal={setProfileModal} id={id}/>
            <Modal
                open={seeMoreModal}
                setOpen={setSeeMoreModal}
                title={
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex gap-1 font-medium">
                            <span>{seeMore.author}</span>
                        </div>
                        <span className="text-xs text-zinc-400">{convertDate(seeMore.createdAt)}</span>
                    </div>
                }
            >
                <p>{seeMore.body}</p>
            </Modal>
            <h1 className="text-lg font-medium">{article?.blog_comments?.length} {t("comments")}</h1>
            <form className="flex flex-col gap-4" 
                onSubmit={handleSubmit(submit)}
            >
                <div className="flex gap-4">
                    <Textarea
                        id="comment"
                        name="comment"
                        icon={
                            <img
                                src={`/img/profile/user/${account.profilePic}.png`}
                                alt="profile_pic"
                                className="h-10 rounded-full border border-black/10 dark:border-black"
                            />
                        }
                        placeholder={t("Leave a comment...")}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required: t('Field required'),
                                },
                            },
                        }}
                    />
                </div>
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center gap-2">
                        <SwitchCustom
                            checked={author}
                            setChecked={setAuthor}
                            label={t("Anonymous comment")}
                        />
                    </div>
                    <PrimaryButton type="submit">
                        {t("Comment")}
                    </PrimaryButton>                              
                </div>
            </form>
            { article?.blog_comments?.length > 0 &&
                <div className="flex flex-col gap-4 border-t border-black/20 dark:border-black pt-4">
                    {
                        article?.blog_comments?.map(comment => (
                            <div key={comment.id} className="flex gap-2">
                                <img
                                    src={`/img/profile/user/${comment.Account.AccountWeb.ProfilePic}.png`}
                                    alt="profile_pic"
                                    className="h-10 rounded-full border border-black/10 dark:border-black"
                                />
                                <div className="flex flex-col flex-grow gap-1 bg-custom-light-700 dark:bg-custom-dark-700 p-2 rounded-2xl">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {
                                            comment.author === 'Anonymous' ?
                                                <span className={`font-medium ${account.id === comment.Account.Id && 'text-green-600'}`}>
                                                    {t("Anonymous")}
                                                </span>
                                            :
                                                <div className="flex items-center">
                                                    <button className={`font-medium hover:underline ${account.id === comment.Account.Id && 'text-green-600'}`} 
                                                        onClick={() => { setId(comment.Account.Id); setProfileModal(true)  }}
                                                    >
                                                        {comment.Account.AccountWeb.Name}
                                                    </button>
                                                    {
                                                        comment.Account.Authority >= 30000 && 
                                                            <div title={t("Admin")} className="cursor-pointer">
                                                                <Admin size="20" color="#2196F3" />
                                                            </div>
                                                    }
                                                </div>
                                        }
                                        <span className="text-xs text-zinc-400">{convertDate(comment.createdAt)}</span>
                                    </div>
                                    <p className="text-sm">
                                        {cutString(comment.body, 600)}
                                        {comment.body.length > 600 && 
                                            <button 
                                                className="hover:underline font-medium text-blue-500 mx-1"
                                                onClick={() => {
                                                    setSeeMore({ 
                                                        body: comment.body, 
                                                        author: comment.author === 'Anonymous' ? t("Anonymous") : comment.Account.AccountWeb.Name,
                                                        createdAt: comment.createdAt
                                                    })
                                                    setSeeMoreModal(true)
                                                }}
                                            >
                                                {t("See more")}
                                            </button>
                                        }                                        
                                    </p>
                                </div>
                                { account.id === comment.Account.Id || account.authority >= 30000 ?
                                    <div>
                                        <Menu as="div" className="relative">
                                            <Menu.Button as={NavLink} className="relative flex !rounded-full">
                                                <MoreVert />
                                            </Menu.Button>                                                
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg p-2 shadow-md dark:shadow-zinc-900 
                                                bg-custom-light-600 dark:bg-custom-dark-600 border border-black/20 dark:border-black">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <NavLink as={Link}
                                                            onClick={() => deletePopup(comment.id)}
                                                            className={`${active ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null}
                                                                flex gap-2 items-center`}
                                                            >
                                                                <Delete size="20" color="red" />
                                                                <span>{t("Delete")}</span>
                                                            </NavLink>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>                                    
                                    </div> : null                                      
                                }
                            </div>
                        ))
                    }
                </div>
            }
        </Card>
    )
}
