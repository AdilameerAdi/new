import React from 'react';
import { LatestRanking } from './partials/LatestRanking';
import { useSelector } from 'react-redux';
import { DailyItems } from './partials/DailyItems';
import { WeeklyItem } from './partials/WeeklyItem';
import { LatestNews } from './partials/LatestNews';


export const HomePage = () => {

  const rank = useSelector(state => state.rank)
  const account = useSelector(state => state.account)

  return (
    <div className="p-4 h-full">
      <div className="flex flex-col h-full gap-4">
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-4">
          <WeeklyItem />
          <DailyItems items={account?.dailyShop} className="col-span-1 xl:col-span-5 2xl:col-span-3"/> 
          <LatestRanking rank={rank} className="col-span-1 xl:col-span-6 2xl:col-span-2"/>
        </div>
        <LatestNews />
      </div>
    </div>
  );
};
