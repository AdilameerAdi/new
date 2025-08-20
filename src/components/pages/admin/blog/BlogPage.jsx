import React, { useState } from 'react'
import { NewsTable } from './partials/NewsTable'
import { UpdateArticle } from './partials/UpdateArticle'
import { CreateArticle } from './partials/CreateArticle'

export const BlogPage = () => {

    const [newArticle, setNewArticle] = useState(false)
    const [updateArticle, setUpdateArticle] = useState(false)

    return (
        <div className="grid grid-cols-1 gap-4">
            { newArticle && <CreateArticle setNewArticle={setNewArticle} /> }
            { updateArticle && <UpdateArticle setUpdateArticle={setUpdateArticle} article={updateArticle} /> }
            <NewsTable
                newArticle={newArticle} 
                setNewArticle={setNewArticle}
                setUpdateArticle={setUpdateArticle}
            />
        </div>
    )
}
