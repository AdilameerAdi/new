import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

export const ServerTime = () => {

  const [currentTime, setCurrentTime] = useState(new Date());

  const { t } = useTranslation();

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date());
    };

    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []); 

  return (
    <div className="flex items-center gap-1 text-black dark:text-white font-medium uppercase" title={t("Server time")}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span>
        {`${hours}:${minutes}:${seconds}`}
      </span>      
    </div>
  );

}
