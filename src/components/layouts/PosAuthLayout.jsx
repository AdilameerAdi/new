import React, {
  useEffect,
  useState,
} from 'react';
import { Navbar } from '../shared/user/Navbar';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../shared/user/Sidebar';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { accountThunk } from '../../store/slices/account.slice';
import { shopCartThunk } from '../../store/slices/shopCart';
import { Footer } from '../shared/user/Footer';
import Chat from '../elements/Chat';
import { publicThunk } from '../../store/slices/public.slice';
import { Maintenance } from '../shared/Maintenance';
import { DevPopUp } from '../shared/DevPopUp';

export const PosAuthLayout = ({ children, className = '' }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const account = useSelector((state) => state.account);
  const publicData = useSelector((state) => state.publicData);

  const [hideNav, setHideNav] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [status, setStatus] = useState(publicData.web_general?.status)
  
  const sessionAuth = sessionStorage.getItem('authToken');

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
    if (!sessionAuth) navigate('/dashboard');
  }, [sessionAuth]);

  useEffect(() => {
    setStatus(publicData.web_general?.status)
  }, [publicData]);

  useEffect(() => {
    dispatch(accountThunk());
  }, []);

  useEffect(() => {
    dispatch(shopCartThunk());
  }, [])

  useEffect(() => {
    dispatch(publicThunk());
  }, [])

  if(status || account.authority >= 30000)
    return (
      <div className="w-full h-screen flex flex-col overflow-hidden">
        <Navbar hideNav={hideNav} setHideNav={setHideNav} account={account} />
        <div className="flex flex-grow bg-custom-light-600 dark:bg-custom-dark-600 relative h-full overflow-hidden">
          <Sidebar hideNav={hideNav} />
          <div className={`overflow-auto rounded-l-lg border-t border-l border-b border-black/10 bg-[url(/img/)] bg-repeat
            dark:border-black text-black dark:text-white bg-custom-light-500
            dark:bg-custom-dark-500 w-full animate__animated animate__fadeInRightBig ${className}`}
          >
            { !status &&  <DevPopUp />}
            {children}
          </div>
        </div>
        <Footer />
        <Chat />
      </div>
    );

  else return <Maintenance data={publicData} className="h-screen"/>
};
