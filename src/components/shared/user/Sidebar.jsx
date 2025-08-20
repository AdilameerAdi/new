import React from 'react';
import {
  Dice,
  Feed,
  Home,
  Shop,
  Ticket,
  Trophy,
} from '../../../../public/icons/Svg';
import { NavLink } from '../../elements/user/NavLink';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Sidebar = ({ hideNav }) => {

  const { t } = useTranslation();
  const location = useLocation().pathname
  const darkMode = useSelector((state) => state.darkMode);

  const active = (path) => {
    if(path === location) return 'bg-custom-light-700 dark:bg-custom-dark-700'
    return false
  }

  return (
    <aside className={`transition-all ease-in h-full flex flex-col 
      bg-custom-light-600 dark:bg-custom-dark-600 overflow-hidden left-0 z-10 
        ${ hideNav ? 'w-16 !relative' : 'w-64 absolute md:relative' }`}
    >
      <div className="flex flex-col flex-grow gap-4 px-2">
        <ul className="flex flex-col gap-1">
          <li>
            <NavLink to={'/home'} className={`flex gap-2 px-0 relative ${active("/home")} ${active("/")}`}>
              {active("/home") && <div className="w-1 absolute rounded-full h-6 bg-blue-500" />}
              {active("/") && <div className="w-1 absolute rounded-full h-6 bg-blue-500" />}
              <div className="w-12 flex justify-center">
                <Home
                  color={
                    darkMode
                      ? '#FFFFFF'
                      : '#000000'
                  }
                />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  {t("Home")}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to={'/shop'} className={`flex gap-2 px-0 relative ${active("/shop")}`}>
              {active("/shop") && <div className="w-1 absolute rounded-full h-6 bg-blue-500" />}
              <div className="w-12 flex justify-center">
                <Shop
                  color={
                    darkMode
                      ? '#FFFFFF'
                      : '#000000'
                  }
                />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  {t("Shop")}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to={'/roulette'} className={`flex gap-2 px-0 relative ${active("/roulette")}`}>
              {active("/roulette") && <div className="w-1 absolute rounded-full h-6 bg-blue-500" />}
              <div className="w-12 flex justify-center">
                <Dice
                  color={
                    darkMode
                      ? '#FFFFFF'
                      : '#000000'
                  }
                />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  {t("Wheel")}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to={'/lottery'} className={`flex gap-2 px-0 relative ${active("/lottery")}`}>
              {active("/lottery") && <div className="w-1 absolute rounded-full h-6 bg-blue-500" />}
              <div className="w-12 flex justify-center">
                <Ticket
                  color={
                    darkMode
                      ? '#FFFFFF'
                      : '#000000'
                  }
                />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  {t("Lottery")}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to={'/rank'} className={`flex gap-2 px-0 relative ${active("/rank")}`}>
              {active("/rank") && <div className="w-1 absolute rounded-full h-6 bg-blue-500" />}
              <div className="w-12 flex justify-center">
                <Trophy
                  color={
                    darkMode
                      ? '#FFFFFF'
                      : '#000000'
                  }
                />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  {t("Ranking")}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to={'/blog'} className={`flex gap-2 px-0 relative ${active("/blog")}`}>
              {active("/blog") && <div className="w-1 absolute rounded-full h-6 bg-blue-500" />}
              <div className="w-12 flex justify-center">
                <Feed
                  color={
                    darkMode
                      ? '#FFFFFF'
                      : '#000000'
                  }
                />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  {t("Blog")}
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};
