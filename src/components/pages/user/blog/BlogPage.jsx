import { PosAuthLayout } from '../../../layouts/PosAuthLayout';
import { PreAuthLayout } from '../../../layouts/PreAuthLayout';
import { PosAuthBlogPage } from './partials/PosAuthBlogPage';
import { PreAuthBlogPage } from './partials/PreAuthBlogPage';
import React from 'react'

export const BlogPage = () => {

  const sessionAuth = sessionStorage.getItem('authToken');

  if (sessionAuth)
    return (
      <PosAuthLayout>
        <PosAuthBlogPage />
      </PosAuthLayout>
    );

  return (
      <PreAuthLayout className="bg-gradient-to-t from-black/80 via-black/80 to-transparent">
        <PreAuthBlogPage />
      </PreAuthLayout>
  );
}
