import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { NavLink } from './user/NavLink';
import { Popover } from '@headlessui/react';
import { io } from 'socket.io-client';
import apiConfig from '../../utils/apiConfig';
import axios from 'axios';
import appError from '../../utils/appError';
import { useTranslation } from 'react-i18next';
import { PublicProfileModal } from '../pages/user/profile/partials/PublicProfileModal';

const Chat = () => {

    const { t } = useTranslation();

    const [id, setId] = useState(null)
    const [expand, setExpand] = useState(false)
    const [messages, setMessages] = useState([]);
    const [disabled, setDisabled] = useState(false)
    const [profileModal, setProfileModal] = useState(false)
    const account = useSelector(state => state.account)

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const sendMessage = async (data) => {

        setDisabled(true)

        const url = `${apiConfig().endpoint}/chat`

        await axios.post(url, data, apiConfig().axios)
            .then(() => reset())
            .catch(err => appError(err))
            .finally(() => setDisabled(false))
    };

    useEffect(() => {

        const socket = io(import.meta.env.VITE_API_URL);

        socket.emit('join_room', 'chat_room');

        socket.on('chat_room_msg', (data) => {
            
            console.log(data)

            setMessages(prevMessages => [...prevMessages, data])});

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            <Popover className="absolute right-0 bottom-16 w-max hidden md:block">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end pe-4 bottom-28">
                        <Popover.Panel className="z-20">
                            <Card className={`${ expand ? "w-[528px]" : "w-[428px]" } flex flex-col gap-4 transition-all ease-in-out`}>
                                <header className="font-medium flex gap-2 items-center justify-between">
                                    <div className="flex gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                        </svg>
                                        <span className="text-lg text-black dark:text-white">{t("Community chat")}</span>
                                    </div>
                                    <NavLink as="button" onClick={() => setExpand(!expand)} className="hidden md:block">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-w-5 ${expand && 'rotate-180'}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                    </NavLink>
                                </header>
                                <div className={`${ expand ? "h-[500px]" : "h-[400px]" } flex flex-col gap-4 overflow-x-hidden overflow-y-auto transition-all ease-in-out`}>
                                    <div className="p-4 rounded-md bg-yellow-200/80 border border-yellow-600 text-black text-sm text-center">
                                        {t("Please be respectful and avoid offending community members.")}
                                    </div>
                                    {messages.map((message, index) => (
                                        <div className={`flex gap-2 animate__animated animate__fadeInRight`} key={index}>
                                            <img
                                                src={`/img/profile/user/${message.profilePic}.png`}
                                                alt={message.userName}
                                                className="h-10 rounded-full border border-black/10 dark:border-black"
                                            />
                                            <div className={`${ expand ? "max-w-md" : "max-w-xs" } break-words flex flex-col text-sm`}>
                                                <div className="flex gap-2 items-center">
                                                    <button to={`/profile/${message.userId}`} onClick={() => { setId(message.userId); setProfileModal(true) }}
                                                        className={`font-medium hover:underline
                                                            ${account.id === message.userId ? 'text-green-700' : 'text-yellow-700'}`
                                                        }
                                                    >
                                                        {message.userName}
                                                    </button>
                                                    <span className="text-[10px] text-zinc-500">
                                                        {message.date}
                                                    </span>
                                                </div>
                                                <span className="text-black dark:text-white">{message.message}</span>
                                            </div>                        
                                        </div>
                                    ))}            
                                </div>
                                <form className="flex gap-4" onSubmit={handleSubmit(sendMessage)}>
                                    <div className="w-full">
                                        <Input
                                            autoComplete="off"
                                            id="message"
                                            name="message"
                                            placeholder={t("Type anything...")}
                                            disabled={disabled}
                                            register={{
                                                function: register,
                                                errors: {
                                                    function: errors,
                                                    rules: {
                                                        required: true,
                                                    },
                                                },
                                            }}
                                            element={
                                                <button type="submit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                                    </svg>
                                                </button>
                                            }
                                        />
                                    </div>
                                </form>
                            </Card>        
                        </Popover.Panel>
                    </div>
                    <Popover.Button className="p-3 rounded-l-full bg-custom-light-600 dark:bg-custom-dark-600 border border-black/20 dark:border-black hover:pr-10 transition-all ease-in-out" onClick={() => setExpand(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-h-8 h-8 text-green-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                    </Popover.Button>
                </div>
            </Popover>
            <PublicProfileModal modal={profileModal} setModal={setProfileModal} id={id}/>
        </>
    );
};

export default Chat;

