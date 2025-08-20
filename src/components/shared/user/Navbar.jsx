import React, { Fragment } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  Admin,
  Cog,
  Coin,
  DarkMode,
  LightMode,
  Logout,
  Logs,
  Payments,
  Person,
  PersonPlus,
  ShopCart,
  User,
} from '../../../../public/icons/Svg';
import { NavLink } from '../../elements/user/NavLink';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { setDarkMode } from '../../../store/slices/darkMode.slice';
import { SendCoins } from '../../functions/sendCoins/SendCoins';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { RedeemCoupon } from '../../functions/redeemCoupon/RedeemCoupon';
import { langThunk } from '../../../store/slices/lang.slice';
import i18n from '../../../utils/i18n';
import { useTranslation } from 'react-i18next';
import languages from '../../../utils/languages';

export const Separator = () => {
  return (
    <div className="py-2">
      <hr className="border-black/20 dark:border-black" />
    </div>
  )
}

export const Navbar = ({
  hideNav,
  setHideNav,
  account = null,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const shopCart = useSelector( (state) => state.shopCart);
  const darkMode = useSelector( (state) => state.darkMode);
  const lang = useSelector( (state) => state.lang ) || 'en'
  const location = useLocation().pathname

  const sessionAuth = sessionStorage.getItem('authToken');

  let navigation = []

  const active = (path) => {
    if(path === location) return true
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleDarkMode = (status) => {
    dispatch(setDarkMode(status));
    localStorage.setItem('darkMode', status);
  };

  const handleLang = async (item) => {
    dispatch(langThunk(item.label.toLowerCase()))
    i18n.changeLanguage(item.label.toLowerCase());
  }

  if(sessionAuth) {

    navigation = [
      { name: t("Coins"), to: "/coins", current: active("/coins"), icon: 
        <div className="flex gap-2 items-center">
          <span className="text-md font-semibold pl-2">
            {account?.balance}
          </span>
          <Coin color="#FFD700" />
        </div>
      },
      { name: t("Cart"), to: "/cart", current: active("/cart"), icon:
        <div className="flex gap-1 items-center">
          <ShopCart color={ darkMode  ? '#FFFFFF' : '#000000' } /> 
          {shopCart.length > 0 && 
            <div className="text-sm font-semibold aspect-square p-3 flex justify-center items-center rounded-full relative bg-red-500">
              <span className="absolute">
                { shopCart.length < 10 ? shopCart.length : <>+9</> }
              </span>
            </div>
          }
        </div>
      },
    ]

    return (
      <Disclosure as="nav" className="bg-custom-light-600 dark:bg-custom-dark-600">
        {({ open }) => (
          <>
            <div className="mx-auto p-2">
              <div className="relative flex items-center sm:justify-between gap-2">
                <div className="inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <NavLink
                    as={"button"}
                    className="w-11 hidden sm:flex justify-center p-2"
                    onClick={() => setHideNav(!hideNav)}
                  >
                    {!hideNav ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </NavLink>
                  <Disclosure.Button as={NavLink}>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex gap-2 items-center justify-between flex-grow">
                  <div className="flex gap-2 items-center">
                    <NavLink
                      as={"button"}
                      className="w-11 hidden sm:flex justify-center p-2"
                      onClick={() => setHideNav(!hideNav)}
                    >
                      {!hideNav ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </NavLink>
                    <Link to="/">
                      <img
                        src="/img/logo.png"
                        alt="Main_Logo"
                        className="max-h-8"
                        style={{ filter: `drop-shadow(0px 1px 2px black)` }}
                      />
                    </Link>
                  </div>
                  <div className="hidden sm:flex gap-2">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className={`${item.current ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null}`}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.icon}
                      </NavLink>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto gap-2">
                  <RedeemCoupon darkMode={darkMode} />
                  <SendCoins darkMode={darkMode} />
                  <NavLink
                    className="!rounded-full"
                    onClick={() => handleDarkMode(!darkMode) }
                  >
                    {darkMode ? (
                      <LightMode
                        color={
                          darkMode
                            ? '#FFFFFF'
                            : '#000000'
                        }
                      />
                    ) : (
                      <DarkMode
                        color={
                          darkMode
                            ? '#FFFFFF'
                            : '#000000'
                        }
                      />
                    )}
                  </NavLink>
                  {/* Lang dropdown */}
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="relative flex rounded-full">
                        <div className="bg-center bg-cover w-8 h-8 rounded-full border border-black/10 dark:border-black" 
                          style={{ backgroundImage: `url(https://flagcdn.com/${lang == 'en' ? 'gb' : lang}.svg)` }}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-lg p-2 shadow-md dark:shadow-zinc-900 
                      bg-custom-light-600 dark:bg-custom-dark-600 border border-black/20 dark:border-black">
                        {
                          languages.map((item, index) => (
                            <Menu.Item key={index}>
                              {({ active }) => (
                                <NavLink as="button" onClick={() => handleLang(item)}
                                  className={`${active ? 'bg-custom-light-700 dark:bg-custom-dark-700 text-center' : null}
                                  flex gap-2 items-center w-full`}
                                >
                                  <div className="bg-center bg-cover w-6 h-6 rounded-full border border-black/10 dark:border-black" 
                                    style={{ backgroundImage: `url(${item.img})` }}
                                  />
                                  <span>{item.name}</span>
                                </NavLink>
                              )}
                            </Menu.Item>                            
                          ))
                        }
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm">
                        <img
                          src={`/img/profile/user/${account?.profilePic}.png`}
                          alt="profile_pic"
                          className="h-8 w-8 rounded-full border border-black/10 dark:border-black"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg p-2 shadow-md dark:shadow-zinc-900 
                      bg-custom-light-600 dark:bg-custom-dark-600 border border-black/20 dark:border-black">
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink as={Link}
                              to="/profile"
                              className={`${active ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null}
                              flex gap-2 items-center`}
                            >
                              <User
                                color={
                                  darkMode
                                    ? '#FFFFFF'
                                    : '#000000'
                                }
                              />
                              <span>{t("Profile")}</span>
                            </NavLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink as={Link}
                              to="/settings"
                              className={`${active ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null}
                              flex gap-2 items-center`}
                            >
                              <Cog
                                color={
                                  darkMode
                                    ? '#FFFFFF'
                                    : '#000000'
                                }
                              />
                              <span>Settings</span>
                            </NavLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink as={Link}
                              to="/payments"
                              className={`${active ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null}
                              flex gap-2 items-center`}
                            >
                              <Payments
                                color={
                                  darkMode
                                    ? '#FFFFFF'
                                    : '#000000'
                                }
                              />
                              <span>{t("Payments")}</span>
                            </NavLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink as={Link}
                              to="/logs"
                              className={`${active ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null}
                              flex gap-2 items-center`}
                            >
                              <Logs
                                color={
                                  darkMode
                                    ? '#FFFFFF'
                                    : '#000000'
                                }
                              />
                              <span>{t("Logs")}</span>
                            </NavLink>
                          )}
                        </Menu.Item>
                        {account?.authority >= 30000 && (
                          <Menu.Item>
                            {({ active }) => (
                              <NavLink as={Link}
                                to="/admin"
                                className={`${active ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null}
                                flex gap-2 items-center`}
                              >
                                <Admin
                                  color={
                                    darkMode
                                      ? '#FFFFFF'
                                      : '#000000'
                                  }
                                />
                                <span>{t("Admin")}</span>
                              </NavLink>
                            )}
                          </Menu.Item>
                        )}
                        <Separator />
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink as={"button"}
                              onClick={logout}
                              className={`${active ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null}
                                flex gap-2 items-center w-full`}
                            >
                              <Logout
                                color={
                                  darkMode
                                    ? '#FFFFFF'
                                    : '#000000'
                                }
                              />
                              <span>{t("Logout")}</span>
                            </NavLink>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={NavLink}
                    to={item.to}
                    className={`${item.current ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null} flex items-center justify-between`}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                    {item.icon}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }
  else {

    navigation = [
      { name: t("Login"), to: "/login", current: active("/login"), icon: <Person color={ darkMode  ? '#FFFFFF' : '#000000' } /> },
      { name: t("Register"), to: "/register", current: active("/register"), icon: <PersonPlus color={ darkMode  ? '#FFFFFF' : '#000000' } /> },
    ]

    return (
      <Disclosure as="nav" className="bg-gradient-to-b
        from-custom-light-700/70 via-custom-light-700/70 to-custom-light-700/70
        dark:from-custom-dark-700/60 dark:via-custom-dark-700/60 dark:to-custom-dark-700/40
        sm:!bg-gradient-to-tr sm:!from-transparent sm:!via-transparent 
        sm:!to-custom-light-700 
        sm:dark:!to-custom-dark-700"
      >
        {({ open }) => (
          <>
            <div className="mx-auto p-2">
              <div className="relative flex items-center sm:justify-between gap-2">
                <div className="inset-y-0 left-0 flex items-center sm:hidden bg-custom-light-700/60 
                  dark:bg-custom-dark-700/60 border border-black/20 dark:border-black rounded-lg"
                >
                  {/* Mobile menu button*/}
                  <Disclosure.Button as={NavLink}>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex gap-2 items-center justify-end flex-grow">
                  <div className="hidden sm:flex gap-2">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className={`${item.current ? 'bg-custom-light-700 dark:bg-custom-dark-700 gap-2' : null} 
                          flex gap-2 bg-custom-light-700/60 dark:bg-custom-dark-700/60 border border-black/20 dark:border-black`
                        }
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.icon}
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto gap-2">
                  <NavLink
                    className="!rounded-full bg-custom-light-700/60 dark:bg-custom-dark-700/60 border border-black/20 dark:border-black"
                    onClick={() => handleDarkMode(!darkMode) }
                  >
                    {darkMode ? (
                      <LightMode
                        color={
                          darkMode
                            ? '#FFFFFF'
                            : '#000000'
                        }
                      />
                    ) : (
                      <DarkMode
                        color={
                          darkMode
                            ? '#FFFFFF'
                            : '#000000'
                        }
                      />
                    )}
                  </NavLink>
                  {/* Lang dropdown */}
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="relative flex rounded-full">
                        <div className="bg-center bg-cover w-10 h-10 rounded-full border border-black/10 dark:border-black" 
                          style={{ backgroundImage: `url(https://flagcdn.com/${lang == 'en' ? 'gb' : lang}.svg)` }}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-lg p-2 shadow-md dark:shadow-zinc-900 
                      bg-custom-light-600 dark:bg-custom-dark-600 border border-black/20 dark:border-black">
                        {
                          languages.map((item, index) => (
                            <Menu.Item key={index}>
                              {({ active }) => (
                                <NavLink as="button" onClick={() => handleLang(item)}
                                  className={`${active ? 'bg-custom-light-700 dark:bg-custom-dark-700 text-center' : null}
                                  flex gap-2 items-center w-full`}
                                >
                                  <div className="bg-center bg-cover w-6 h-6 rounded-full border border-black/10 dark:border-black" 
                                    style={{ backgroundImage: `url(${item.img})` }}
                                  />
                                  <span>{item.name}</span>
                                </NavLink>
                              )}
                            </Menu.Item>                            
                          ))
                        }
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={NavLink}
                    to={item.to}
                    className={`${item.current ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null} flex items-center justify-between`}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                    {item.icon}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }

};
