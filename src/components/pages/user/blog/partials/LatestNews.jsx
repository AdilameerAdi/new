import { CalendarMonthRounded, ChatBubbleOutlineOutlined, Newspaper, StarBorder } from '@mui/icons-material'
import { blogThunk } from '../../../../../store/slices/blog.slice'
import convertDate from '../../../../../utils/convertDate'
import cutString from '../../../../../utils/cutString'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '../../../../elements/Card'
import Pagination from '@mui/lab/Pagination';
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const formatDate = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
}

export const LatestNews = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const blog = useSelector(state => state.blog)
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState(""); 
    const [itemsPerPage, setItemsPerPage] = useState(9)
    
    const [totalItems, setTotalItems] = useState(blog?.length)
    const [totalPages, setTotalPages] = useState(Math.ceil(totalItems / itemsPerPage))

    const onPageChange = (e, page) => {
        e.preventDefault()
        setCurrentPage(page);
    };

    const filteredItems = blog?.filter(item => {
        return Object.values(item || {}).some(value => {
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some(subValue => {
                    if (typeof subValue === 'string' && subValue !== null) {
                        return subValue.toString().toLowerCase().includes(searchText.toLowerCase());
                    }
                    return false;
                });
            }
            if (value !== null) {
                return value.toString().toLowerCase().includes(searchText.toLowerCase());
            }
            return false;
        });
    });
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);


    useEffect(() => {
        setTotalPages(Math.ceil(totalItems / itemsPerPage))
    }, [totalItems, itemsPerPage])

    useEffect(() => {
        dispatch(blogThunk())
    }, [])

    if(blog.length > 0)
        return (
            <div className="h-full">
                <div className="flex flex-col justify-between h-full gap-4 p-4">
                    <div className="flex flex-col gap-4">
                        <div className="p-2 bg-gradient-to-r from-custom-light-700/80 via-custom-light-700/30 dark:from-custom-dark-600/80 dark:via-custom-dark-600/30 to-transparent rounded-lg">
                            <h1 className="text-3xl font-medium">{t("Latest news")}</h1>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {
                                currentItems.map(article => (
                                    <Card as={Link} key={article.id} to={`/blog/${article.id}`} className="!p-0 overflow-hidden flex flex-col">
                                        <div className="w-full h-36 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${article.header})` }} />
                                        <div className="flex flex-col gap-2 p-4">
                                            <h3 className="font-medium text-2xl">{cutString(article.title, 30)}</h3>
                                            <div className="flex flex-wrap gap-4 justify-between text-sm items-center font-medium">
                                                <div className="flex gap-1 items-center">
                                                    <StarBorder className="text-yellow-500 !h-5" /> 
                                                    <span>{article.author}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex gap-1 items-center">
                                                        <span>{convertDate(article.createdAt, formatDate)}</span>
                                                        <CalendarMonthRounded className="text-blue-500 !h-5" /> 
                                                    </div>           
                                                    <div className="flex gap-1 items-center">
                                                        <span>{article.blog_comments.length}</span>
                                                        <ChatBubbleOutlineOutlined className="text-green-500 !h-5" /> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            }
                        </div>
                    </div>
                    <div className="p-1 rounded-full bg-white dark:bg-white/80 border dark:border-admin-dark-600 w-max">
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={onPageChange}
                            showFirstButton
                            showLastButton
                        />
                    </div>
                </div>
            </div>
        )

    else return (
        <div className="h-full flex flex-col justify-center items-center gap-4">
            <Newspaper className="!w-24 !h-24" />
            <h1 className="text-3xl font-medium">
                No news yet
            </h1>
        </div>
    )
}
