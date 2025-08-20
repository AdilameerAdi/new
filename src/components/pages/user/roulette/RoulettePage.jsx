import React, { useEffect } from 'react';
import { Roulette } from './partials/Roulette';
import { Card } from '../../../elements/Card';
import { RouletteRoom } from './partials/RouletteRoom';
import { RouleteRules } from './partials/RouleteRules';
import { useSelector } from 'react-redux';
import { Maintenance } from '../../../shared/Maintenance';
import { useTranslation } from 'react-i18next';

export const RoulettePage = () => {

  const publicData = useSelector(state => state.publicData)
  const { t } = useTranslation();

  if(publicData.id) {

    if(publicData.web_wheel.status)
      return (
        <div className="p-4 overflow-auto h-full flex flex-col justify-center relative">
          <div className="flex justify-center min-w-[1380px]">
            <div className="w-[450px] aspect-square bg-cover bg-center absolute top-0 wheel__animate 
              rounded-full p-4 border border-black/20 dark:border-black m-4"
              style={{ backgroundImage: "url('/img/wheel.png')" }}
            />
          </div>
          <Card className="flex gap-4 h-[550px] w-[1380px] mx-auto">
            <RouleteRules data={publicData.web_wheel} />
            <Roulette data={publicData.web_wheel} />
            <RouletteRoom />
          </Card>
        </div>
      )

    return <Maintenance data={publicData} message={t("Lucky wheel is under maintenance")} />

  }
};
