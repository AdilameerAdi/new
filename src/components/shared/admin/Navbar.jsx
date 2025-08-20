import React, { Fragment } from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  Cog,
  Coin,
  DarkMode,
  LightMode,
  Logout,
  Logs,
  Payments,
  User,
  Website,
} from '../../../../public/icons/Svg';;
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { setDarkMode } from '../../../store/slices/darkMode.slice';
import { NavLink } from '../../elements/admin/NavLink';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { langThunk } from '../../../store/slices/lang.slice';
import i18n from '../../../utils/i18n';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation().pathname
  const { darkMode } = useSelector(
    (state) => state,
  );
  const lang = useSelector( (state) => state.lang ) || 'en'

  const logout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleDarkMode = (status) => {
    dispatch(setDarkMode(status));
    localStorage.setItem('darkMode', status);
  };

  const handleLang = async (item) => {
    dispatch(langThunk(item.value))
    i18n.changeLanguage(item.value);
  }

  const active = (path) => {
    if(path === location) return true
    return false
  }

  const navigation = [
    { name: "Coins", to: "/coins", current: active("/coins"), icon: 
      <div className="flex gap-2 items-center">
        <span className="text-md font-semibold pl-2">
          {account?.balance}
        </span>
        <Coin color="#FFD700" />
      </div>
    },
  ]

  return (
    <Disclosure as="nav" className="bg-admin-light-600 dark:bg-admin-dark-600">
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
                  <Link to="/admin" className="flex items-center gap-2">
                    <img
                      src="/img/logo.png"
                      alt="Main_Logo"
                      className="max-h-8"
                      style={{ filter: `drop-shadow(0px 1px 2px black)` }}
                    />
                    <span className="rounded-full bg-red-600 px-2 py-1 uppercase text-xs font-medium italic">
                      Admin
                    </span>
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right p-2 shadow-md dark:shadow-zinc-900 
                    bg-admin-light-600 dark:bg-admin-dark-600 border border-black/20 dark:border-black">
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
                            <span>Profile</span>
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
                            <span>Payments</span>
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
                            <span>Logs</span>
                          </NavLink>
                        )}
                      </Menu.Item>
                      {account?.authority >= 30000 && (
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink as={Link}
                              to="/"
                              className={`${active ? 'bg-custom-light-700 dark:bg-custom-dark-700' : null}
                              flex gap-2 items-center`}
                            >
                              <Website
                                color={
                                  darkMode
                                    ? '#FFFFFF'
                                    : '#000000'
                                }
                              />
                              <span>Website</span>
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
                            <span>Logout</span>
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



};
