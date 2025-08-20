import { CalendarMonthRounded, Newspaper, StarBorder } from '@mui/icons-material'
import { blogThunk } from '../../../../../store/slices/blog.slice'
import convertDate from '../../../../../utils/convertDate'
import { useDispatch, useSelector } from 'react-redux'
import cutString from '../../../../../utils/cutString'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const formatDate = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
}

export const LatestNews = () => {

    const dispatch = useDispatch()

    const blog = useSelector(state => state.blog).slice(0, 3)

    useEffect(() => {
        dispatch(blogThunk())
    }, [])

    if(blog.length > 0)
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 flex-grow">
                <Link to={`/blog/${blog[0]?.id}`} className="overflow-hidden min-h-[200px] bg-cover bg-center h-full rounded-md xl:col-span-2 relative" style={{ backgroundImage: `url(${blog[0]?.header})` }}>
                    <div className="absolute w-full h-full bg-white/30 dark:bg-black/30 hover:bg-white/50 dark:hover:bg-black/50 duration-300 flex flex-col gap-6 p-4 font-medium">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex gap-1 items-center">
                                <CalendarMonthRounded className="text-blue-500" /> 
                                <span>{convertDate(blog[0]?.createdAt, formatDate)}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <StarBorder className="text-yellow-500" /> 
                                <span>{blog[0]?.author}</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{cutString(blog[0]?.title, 15)}</h1>
                    </div>
                </Link>
                { blog.length > 1 &&
                    <div className="grid grid-cols-1 gap-4">
                        <Link to={`/blog/${blog[1]?.id}`} className="overflow-hidden min-h-[200px] bg-center bg-no-repeat bg-cover rounded-md relative" style={{ backgroundImage: `url(${blog[1]?.header})` }}>
                            <div className="absolute w-full h-full bg-white/30 dark:bg-black/30 hover:bg-white/50 dark:hover:bg-black/50 duration-300 flex flex-col gap-6 p-4 font-medium">
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex gap-1 items-center">
                                        <CalendarMonthRounded className="text-blue-500" /> 
                                        <span>{convertDate(blog[1]?.createdAt, formatDate)}</span>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <StarBorder className="text-yellow-500" /> 
                                        <span>{blog[1]?.author}</span>
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-4xl">{cutString(blog[1]?.title, 15)}</h1>
                            </div>
                        </Link>
                        { blog.length > 2 &&
                            <Link to={`/blog/${blog[2]?.id}`} className="overflow-hidden min-h-[200px] bg-center bg-no-repeat bg-cover rounded-md relative" style={{ backgroundImage: `url(${blog[2]?.header})` }}>
                                <div className="absolute w-full h-full bg-white/30 dark:bg-black/30 hover:bg-white/50 dark:hover:bg-black/50 duration-300 flex flex-col gap-6 p-4 font-medium">
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex gap-1 items-center">
                                            <CalendarMonthRounded className="text-blue-500" /> 
                                            <span>{convertDate(blog[2]?.createdAt, formatDate)}</span>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <StarBorder className="text-yellow-500" /> 
                                            <span>{blog[2]?.author}</span>
                                        </div>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl">{cutString(blog[2]?.title, 15)}</h1>
                                </div>
                            </Link>
                        }
                    </div>
                }
            </div>
        )

    else return (
        <div className="h-full flex flex-col justify-center items-center gap-4">
            <Newspaper className="!w-24 !h-24" />
            <span className="text-3xl font-medium">
                No news yet
            </span>
        </div>
    )
}
