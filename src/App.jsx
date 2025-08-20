import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import { Maintenance } from "./components/shared/Maintenance";
import { Loader } from "./components/shared/Loader";
import { darkModeThunk } from "./store/slices/darkMode.slice";
import { publicThunk } from "./store/slices/public.slice";
import { langThunk } from "./store/slices/lang.slice";

{/* Auth Imports */}
import { LoginPage } from "./components/pages/auth/login/LoginPage";
import { RegisterPage } from "./components/pages/auth/register/RegisterPage";
{/* End Auth Imports */}

{/* User Imports */}
import { ProtectedRoutes as UserProtectedRoutes } from "./components/pages/session/user/ProtectedRoutes";
import { HomePage as UserHomePage } from "./components/pages/user/home/HomePage";
import { ShopPage as UserShopPage } from "./components/pages/user/shop/ShopPage";
import { ShopCartPage as UserShopCartPage } from "./components/pages/user/cart/ShopCartPage";
import { RoulettePage as UserRoulettePage } from "./components/pages/user/roulette/RoulettePage";
import { LotteryPage as UserLotteryPage } from "./components/pages/user/lottery/LotteryPage";
import { CoinsPage as UserCoinsPage} from "./components/pages/user/coins/CoinsPage";
import { ProfilePage } from "./components/pages/user/profile/ProfilePage";
import { SettingsPage } from "./components/pages/user/settings/SettingsPage";
import { RecoveryPage } from "./components/pages/auth/recovery/RecoveryPage";
import { PaymentsPage as UserPaymentsPage } from "./components/pages/user/payments/PaymentsPage";
import { BlogPage as UserBlogPage } from "./components/pages/user/blog/BlogPage";
import { RankPage as UserRankPage } from "./components/pages/user/rank/RankPage";
import { LogsPage as UserLogsPage } from "./components/pages/user/logs/LogsPage";
{/* End User Imports */}

{/* Admin Imports */}
import { ProtectedRoutes as AdminProtectedRoutes} from "./components/pages/session/admin/ProtectedRoutes";
import { HomePage as AdminHomePage } from "./components/pages/admin/home/HomePage";
import { ItemsPage } from "./components/pages/admin/items/ItemsPage";
import { ShopPage as AdminShopPage } from "./components/pages/admin/shop/ShopPage";
import { BlogPage as AdminBlogPage } from "./components/pages/admin/blog/BlogPage";
import { PaymentsPage as AdminPaymentsPage } from "./components/pages/admin/payments/PaymentsPage";
import { RoulettePage as AdminRoulettePage } from "./components/pages/admin/roulette/RoulettePage";
import { AccountsPage as AdminAccountsPage } from "./components/pages/admin/accounts/AccountsPage";
import { LotteryPage as AdminLotteryPage } from "./components/pages/admin/lottery/LotteryPage";
import { RankPage as AdminRankPage } from "./components/pages/admin/rank/RankPage";
import { CoinsPage as AdminCoinsPage } from "./components/pages/admin/coins/CoinsPage";
import { CouponsPage as AdminCouponsPage } from "./components/pages/admin/coupons/CouponsPage";
{/* End Admin Imports */}
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function App() {
  const dispatch = useDispatch();
  const darkMode = useSelector( (state) => state.darkMode );
  const lang = localStorage.getItem("lang")
Swal.fire({
  title: 'Dark Mode',
  text: 'This is a custom dark popup!',
  background: '#1e1e1e',
  color: '#fff',
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
});

  useEffect(() => {
    dispatch(langThunk(lang))
  }, [])

  useEffect(() => {
    dispatch(darkModeThunk());
  }, [darkMode]);

  return (
    <div className="select-none">
      <Loader />
      <Routes>
        <Route path="*" element={<Navigate to="/" />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/recovery" element={<RecoveryPage />}/>
        <Route path="/blog/:id?" element={<UserBlogPage />}/>
        <Route path="/" element={<UserProtectedRoutes />}>
          <Route path="/" element={<UserHomePage />}/>
          <Route path="/home" element={<UserHomePage />}/>
          <Route path="/shop" element={<UserShopPage />}/>
          <Route path="/cart" element={<UserShopCartPage />}/>
          <Route path="/roulette" element={<UserRoulettePage />}/>
          <Route path="/lottery" element={<UserLotteryPage />}/>
          <Route path="/rank" element={<UserRankPage />}/>
          <Route path="/coins/:env?" element={<UserCoinsPage />}/>
          <Route path="/profile/:id?" element={<ProfilePage />}/>
          <Route path="/settings" element={<SettingsPage />}/>
          <Route path="/payments" element={<UserPaymentsPage />}/>
          <Route path="/logs" element={<UserLogsPage />}/>
        </Route>
        <Route path="/admin" element={<AdminProtectedRoutes />}>
          <Route path="/admin" element={<AdminHomePage />}/>
          <Route path="/admin/items" element={<ItemsPage />}/>
          <Route path="/admin/shop" element={<AdminShopPage />}/>
          <Route path="/admin/roulette" element={<AdminRoulettePage />}/>
          <Route path="/admin/lottery" element={<AdminLotteryPage />}/>
          <Route path="/admin/coins" element={<AdminCoinsPage />}/>
          <Route path="/admin/payments" element={<AdminPaymentsPage />}/>
          <Route path="/admin/accounts" element={<AdminAccountsPage />}/>
          <Route path="/admin/blog" element={<AdminBlogPage />}/>
          <Route path="/admin/rank" element={<AdminRankPage />}/>
          <Route path="/admin/coupons" element={<AdminCouponsPage />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
