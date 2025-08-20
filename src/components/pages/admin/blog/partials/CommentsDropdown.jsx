import { comment } from 'postcss'
import React, { useState } from 'react'
import { Delete } from '../../../../../../public/icons/Svg'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'
import apiConfig from '../../../../../utils/apiConfig'
import axios from 'axios'
import { setLoad } from '../../../../../store/slices/loader.slice'
import appError from '../../../../../utils/appError'
import convertDate from '../../../../../utils/convertDate'
import { NavLink } from '../../../../elements/admin/NavLink'
import { Card } from '../../../../elements/admin/Card'
import { blogThunk } from '../../../../../store/slices/blog.slice'
import cutString from '../../../../../utils/cutString'
import Modal from '../../../../elements/Modal'

export const CommentsDropdown = ({ data }) => {

    const [seeMore, setSeeMore] = useState({ body: null, author: null, createdAt: null })
    const [seeMoreModal, setSeeMoreModal] = useState(false)

    const dispatch = useDispatch()

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

    const deletePopup = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(id)
            }
        });
    }

    if(data.length > 0) 
        return (
            <div className="flex flex-col gap-4 p-4 max-h-96 overflow-auto">
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
                {
                    data.map(comment => (
                        <div key={comment.id} className="flex gap-2">
                            <img
                                src={`/img/profile/user/${comment.Account.AccountWeb.ProfilePic}.png`}
                                alt="profile_pic"
                                className="h-10 rounded-full border border-black/10 dark:border-black"
                            />
                            <div className="flex flex-col flex-grow gap-1 bg-admin-light-700/50 dark:bg-admin-dark-700/50 p-2">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <div className="flex gap-1 font-medium">
                                        <span>{comment.Account.AccountWeb.Name}</span>
                                        <span className="text-green-600">
                                            ({comment.Account.Name})
                                        </span>
                                    </div>
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
                                                    author:  comment.author === 'Anonymous' ? `Anonymous (${comment.Account.Name})` : `${comment.Account.AccountWeb.Name} (${comment.Account.Name})`,
                                                    createdAt: comment.createdAt
                                                })
                                                setSeeMoreModal(true)
                                            }}
                                        >
                                            See more
                                        </button>
                                    }
                                </p>
                            </div>
                            <div>
                                <NavLink as="button" onClick={() => deletePopup(comment.id)} className="!rounded-full">
                                    <Delete size="20" color="red" />
                                </NavLink>                                        
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    else return (
        <div className="flex justify-center p-4 text-lg font-medium">
            <span className="text-center">No comments</span>
        </div>
    )
}
