import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LatestNews } from './LatestNews'
import { useDispatch } from 'react-redux'
import apiConfig from '../../../../../utils/apiConfig'
import { setLoad } from '../../../../../store/slices/loader.slice'
import axios from 'axios'
import appError from '../../../../../utils/appError'
import { CalendarMonthRounded, StarBorder } from '@mui/icons-material'
import convertDate from '../../../../../utils/convertDate'
import DOMPurify from 'dompurify'

export const PreAuthBlogPage = () => {

    const { id } = useParams()

    if(!id) return <LatestNews />

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [article, setArticle] = useState({})

    const formatDate = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }

    const getArticleInfo = async () => {
      
        const url = `${apiConfig().endpoint}/blog/${id}`
        dispatch(setLoad(false));
    
        await axios.get(url, apiConfig().axios)
            .then(res => {
                setArticle(res.data.blog)
            })
            .catch(err => {
                appError(err)
                if(err.response.status === 404)
                    navigate("/blog")
            })
            .finally(() => {
                dispatch(setLoad(true))
            })

    } 

    useEffect(() => {
        getArticleInfo()
    }, [])

    return (
        <div className="flex justify-center items-center p-4 text-white">
            <div className="flex flex-col gap-4 w-full lg:w-9/12 xl:py-16">
                <header className="w-full h-48 bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden relative"
                    style={{ backgroundImage: `url(${article.header})` }} 
                >
                    <div className="absolute w-full h-full bg-black/40 flex flex-col gap-6 p-4 font-medium">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex gap-1 items-center">
                                <CalendarMonthRounded className="text-blue-500" /> 
                                <span>{convertDate(article.createdAt, formatDate)}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <StarBorder className="text-yellow-500" /> 
                                <span>{article.author}</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl">{article.title}</h1>
                    </div>
                </header>
                <div id="raw_html" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.body) }} />
            </div>
        </div>
    )        
}
