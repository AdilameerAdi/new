import rankPrizesClaimed from './slices/rankPrizesClaimed.slice';
import shopWeeklyItems from './slices/shopWeeklyItems.slice';
import shopDailyItems from './slices/shopDailyItems.slice';
import paymentPrizes from './slices/paymentsPrizes.slice';
import lotteryBuyers from './slices/lottery.buyers.slice';
import shopCategories from './slices/shopCategories';
import rankPrizes from './slices/rankPrizes.slice';
import wheelItems from './slices/wheelItems.slice';
import { configureStore } from '@reduxjs/toolkit';
import characters from './slices/character.slice';
import shopItems from './slices/shopItems.slice';
import darkMode from './slices/darkMode.slice';
import publicData from './slices/public.slice';
import channels from './slices/channel.slice';
import payments from './slices/payments';
import account from './slices/account.slice';
import lottery from './slices/lottery.slice';
import coupons from './slices/coupons.slice';
import loader from './slices/loader.slice';
import users from './slices/users.slice';
import shopCart from './slices/shopCart';
import items from './slices/items.slice';
import plans from './slices/plan.slice';
import blog from './slices/blog.slice';
import logs from './slices/logs.slice';
import rank from './slices/rank.slice';
import lang from './slices/lang.slice';

const store = configureStore({
  reducer: {
    rankPrizesClaimed,
    shopWeeklyItems,
    shopDailyItems,
    shopCategories,
    paymentPrizes,
    lotteryBuyers,
    rankPrizes,
    characters,
    publicData,
    wheelItems,
    shopItems,
    shopCart,
    darkMode,
    channels,
    payments,
    coupons,
    lottery,
    account,
    loader,
    plans,
    items,
    users,
    blog,
    logs,
    rank,
    lang,
  },
});

export default store;
