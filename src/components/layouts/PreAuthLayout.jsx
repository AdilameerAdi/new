import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Navbar } from '../shared/user/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { publicThunk } from '../../store/slices/public.slice';

export const PreAuthLayout = ({ children, className = "" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionAuth = sessionStorage.getItem('authToken');
  const darkMode = useSelector( (state) => state.darkMode);

  useEffect(() => {
    dispatch(publicThunk());
  }, [])

  useEffect(() => {
    if (sessionAuth) navigate('/dashboard');
  }, [sessionAuth]);

  return (
    <div className={`w-full h-screen flex flex-col`}
      style={{ 
        backgroundImage: darkMode ? 'url(/img/bg-dark_pre-auth.png)' : 'url(/img/bg-light_pre-auth.png)',
        backgroundSize: `cover`,
        backgroundRepeat: `repeat`
       }}
    >
      <Navbar />
      <div className={`h-full overflow-auto text-black dark:text-white ${className}`}>
        {children}
      </div>
    </div>
  );
};
