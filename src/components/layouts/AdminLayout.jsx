import React, {
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { accountThunk } from '../../store/slices/account.slice';
import { Navbar } from '../shared/admin/Navbar';
import { Sidebar } from '../shared/admin/Sidebar';
import { publicThunk } from '../../store/slices/public.slice';

export const AdminLayout = ({
  children,
  className = '',
}) => {
  const [hideNav, setHideNav] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    window.innerWidth,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account } = useSelector(
    (state) => state,
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener(
      'resize',
      handleResize,
    );
    return () => {
      window.removeEventListener(
        'resize',
        handleResize,
      );
    };
  }, []);

  useEffect(() => {
    if (windowWidth <= 1000) setHideNav(true);
    else setHideNav(false);
  }, [windowWidth]);

  useEffect(() => {
    dispatch(accountThunk());
  }, []);

  useEffect(() => {
    dispatch(publicThunk());
  }, [])

  if (account?.authority < 30000) navigate('/');

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <Navbar
        hideNav={hideNav}
        setHideNav={setHideNav}
        account={account}
      />
      <div className="flex flex-grow bg-custom-light-600 dark:bg-admin-dark-600 relative overflow-hidden">
        <Sidebar hideNav={hideNav}/>
        <div
          className={`overflow-auto text-black dark:text-white bg-admin-light-500 p-4
          dark:bg-admin-dark-500 w-full h-full  animate__animated animate__fadeInRightBig ${className}`}
        >
          {children}
        </div>          
      </div>
    </div>
  );
};
