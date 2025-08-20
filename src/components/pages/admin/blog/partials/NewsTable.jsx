import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { blogThunk } from '../../../../../store/slices/blog.slice'
import { Table } from '../../../../elements/Table'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import axios from 'axios'
import { setLoad } from '../../../../../store/slices/loader.slice'
import { Edit, Delete } from '../../../../../../public/icons/Svg'
import apiConfig from '../../../../../utils/apiConfig'
import { DeleteArticles } from './DeleteArticles'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import appError from '../../../../../utils/appError'
import { DeleteArticle } from './DeleteArticle'
import { CommentsDropdown } from './CommentsDropdown'

const Element = ({ 
  selectedElements = [],
  setSelectedElements, 
  newArticle, 
  setNewArticle, 
  setUpdateArticle 
}) => {

  const [deleteArticleModal, setDeleteArticleModal] = useState(false)

  const handleNewArticle = () => {
    setUpdateArticle(false)
    setNewArticle(true)
  }

  return (
    <div className="flex justify-start gap-4 border-b border-black/20 dark:border-admin-dark-500 pb-4">

      { !newArticle &&
        <PrimaryButton
          className="font-normal"
          onClick={() => handleNewArticle()}
        >
          New Article
        </PrimaryButton>
      }

      <DeleteArticles
        modal={deleteArticleModal}
        setModal={setDeleteArticleModal}
        items={selectedElements}
        setItems={setSelectedElements}
        setNewArticle={setNewArticle}
        setUpdateArticle={setUpdateArticle}
      />

      {selectedElements.length > 0 ?
        <SecondaryButton
          className="font-normal"
          onClick={() => setDeleteArticleModal(true)}
        >
          Delete {selectedElements.length} items
        </SecondaryButton>
        : null
      }

    </div>
  )
}

const Actions = ({ id, setNewArticle, setUpdateArticle }) => {

  const [deleteArticle, setDeleteArticle] = useState(false)

  const dispatch = useDispatch()

  const getArticleInfo = async () => {

    const url = `${apiConfig().endpoint}/blog/${id}`
    dispatch(setLoad(false));

    await axios.get(url, apiConfig().axios)
      .then(res => {
        setUpdateArticle(res.data.blog)
        setNewArticle(false)
      })
      .catch(err => appError(err))
      .finally(() => {
        dispatch(setLoad(true))
      })
  }

  return (
    <div className="flex gap-4 justify-center">
      <DeleteArticle
        modal={deleteArticle}
        setModal={setDeleteArticle}
        id={id}
      />
      <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
        onClick={() => getArticleInfo()}
      >
        <Edit color="green" />
      </button>
      <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1"
        onClick={() => setDeleteArticle(true) }
      >
        <Delete color="red" />
      </button>
    </div>
  )
}

export const NewsTable = ({ newArticle, setNewArticle, setUpdateArticle }) => {

  const dispatch = useDispatch()

  const blog = useSelector(state => state.blog)

  useEffect(() => {
    dispatch(blogThunk())
  }, [])

  const header = [
    {
      field: 'id',
      name: 'ID',
    },
    {
      field: 'author',
      name: 'Author',
    },        
    {
      field: 'title',
      name: 'Title',
      wordWrap: 20,
    },
    {
      field: 'Account.Name',
      name: 'Account',
    },
    {
      field: 'createdAt',
      name: 'Date',
      date: true
    },
  ]

  return (
    <Table
      admin
      header={header} 
      items={blog}
      title={"All articles"}
      element={
        <Element 
          newArticle={newArticle} 
          setNewArticle={setNewArticle} 
          setUpdateArticle={setUpdateArticle}  
        />
      }
      check={"id"}
      actions={{
        header: 'Actions',
        component: 
        <Actions
          setNewArticle={setNewArticle}
          setUpdateArticle={setUpdateArticle}
        />,
        params: { id: '%id%', }
      }}
      dropdown={{
        header: "Comments",
        component: <CommentsDropdown />,
        params: { data: '%blog_comments%', }
      }}
    />
  )
}
