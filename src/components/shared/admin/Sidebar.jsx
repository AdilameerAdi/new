import { useSelector } from 'react-redux';
import { Coin, Dice, Feed, Home, Items, Payments, Shop, Ticket, Ticket2, Trophy, UserGroup } from '../../../../public/icons/Svg';
import { NavLink } from '../../elements/admin/NavLink';
import { useLocation } from 'react-router-dom';

export const Sidebar = ({ hideNav }) => {

  const darkMode = useSelector((state) => state.darkMode);

  const location = useLocation().pathname

  const active = (path) => {
    if(path === location) return 'bg-admin-light-700 dark:bg-admin-dark-700'
  }

  return (
    <aside
      className={`transition-all ease-in h-full flex flex-col bg-admin-light-600 dark:bg-admin-dark-600 
        overflow-hidden left-0 z-10 ${ hideNav ? 'w-16 !relative' : 'w-64 absolute md:relative' }`}
    >
      <div className="flex flex-col flex-grow gap-4 px-2">
        <ul className="flex flex-col gap-1">
          <li>
            <NavLink
              to={'/admin'}
              className={`flex gap-2 px-0 ${active("/admin")}`}
            >
              <div className="w-12 flex justify-center">
                <Home color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Dashboard
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/items'}
              className={`flex gap-2 px-0 ${active("/admin/items")}`}
            >
              <div className="w-12 flex justify-center">
                <Items color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Items
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/shop'}
              className={`flex gap-2 px-0 ${active("/admin/shop")}`}
            >
              <div className="w-12 flex justify-center">
                <Shop color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Shop
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/roulette'}
              className={`flex gap-2 px-0 ${active("/admin/roulette")}`}
            >
              <div className="w-12 flex justify-center">
                <Dice color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Roulette
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/lottery'}
              className={`flex gap-2 px-0 ${active("/admin/lottery")}`}
            >
              <div className="w-12 flex justify-center">
                <Ticket color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Lottery
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/payments'}
              className={`flex gap-2 px-0 ${active("/admin/payments")}`}
            >
              <div className="w-12 flex justify-center">
                <Payments color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Payments
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/coins'}
              className={`flex gap-2 px-0 ${active("/admin/coins")}`}
            >
              <div className="w-12 flex justify-center">
                <Coin color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Coins
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/accounts'}
              className={`flex gap-2 px-0 ${active("/admin/accounts")}`}
            >
              <div className="w-12 flex justify-center">
                <UserGroup color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Accounts
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/blog'}
              className={`flex gap-2 px-0 ${active("/admin/blog")}`}
            >
              <div className="w-12 flex justify-center">
                <Feed color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Blog
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/rank'}
              className={`flex gap-2 px-0 ${active("/admin/rank")}`}
            >
              <div className="w-12 flex justify-center">
                <Trophy color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Ranking
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/admin/coupons'}
              className={`flex gap-2 px-0 ${active("/admin/coupons")}`}
            >
              <div className="w-12 flex justify-center">
                <Ticket2 color={ darkMode ? '#FFFFFF' : '#000000' } />
              </div>
              {!hideNav && (
                <span className="font-semibold">
                  Coupons
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};
