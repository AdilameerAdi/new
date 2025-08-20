import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoad } from "../../../../../store/slices/loader.slice";
import apiConfig from "../../../../../utils/apiConfig";
import axios from "axios";
import { Characters } from "./Characters";
import convertDate from "../../../../../utils/convertDate";
import { Admin } from "../../../../../../public/icons/Svg";

export const PublicProfile = ({ id, modal = false }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({})
  
    const getProfile = async () => {
  
        dispatch(setLoad(false))
    
        const url = `${apiConfig().endpoint}/auth/${id}`
    
        await axios.get(url, apiConfig().axios)
            .then(res => setProfile(res.data))
            .catch(() => navigate("/profile"))
            .finally(() => dispatch(setLoad(true)))
    }
  
    useEffect(() => {
        getProfile()
    }, [])
  
    return (
        <div className={`flex flex-col flex-grow gap-4 ${modal ? 'p-0' : 'p-4'}`}>
            <div className={`rounded-b-xl w-full h-40 ${modal ? '' : 'md:h-80'} relative flex bg-center bg-no-repeat bg-cover`}
                style={{  backgroundImage: `url(/img/bg-light_mode_shop.jpg)` }}
            />
            <div className="flex flex-wrap justify-center md:justify-start gap-4 -mt-24 z-10 px-4">
                <div
                    className={`rounded-full flex gap-4 ${modal ? 'w-36 h-36' : 'w-40 h-40'} border-4 border-custom-light-500 dark:border-custom-dark-500 bg-gray-600 bg-cover bg-center`}
                    style={{
                        backgroundImage: `url(/img/profile/user/${profile?.AccountWeb?.ProfilePic}.png)`,
                    }}
                />
                <div className={`flex flex-col justify-end ${ modal ? 'pb-2' : 'pb-4'} text-center md:text-left`}>
                    <div className="flex gap-2 items-center">
                        <span className={`${modal ? 'text-2xl' : 'text-3xl'} font-semibold text-black dark:text-white`}>
                            {profile?.AccountWeb?.Name}
                        </span>
                        { profile?.Authority >= 30000 && <div title={t("Admin")} className="cursor-pointer"><Admin size="30" color="#2196F3" /></div> }
                    </div>
                    <span className="text-sm">
                        {t("Created At")}: {convertDate(profile?.AccountWeb?.createdAt, 
                            {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                            })
                        }
                    </span>
                </div>
            </div>
            <Characters characters={profile?.characters} className={modal && '!flex flex-col max-h-60 overflow-auto'}/>
        </div>
    )
  }
  