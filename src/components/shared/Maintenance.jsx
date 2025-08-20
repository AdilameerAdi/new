import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { Discord } from '../../../public/icons/Svg';
import { useSelector } from 'react-redux';

export const Maintenance = ({
  data,
  icon = true,
  message = 'This website is under maintance',
  className = ''
}) => {

  const darkMode = useSelector( (state) => state.darkMode);

  if(data.id)

    return (
      <div className={`flex flex-col justify-center items-center gap-4 h-full ${className}`}>
        { icon && <ExclamationTriangleIcon className="max-h-40 text-yellow-500" />}
        <span className="text-4xl text-black dark:text-white">{message}</span>
        <span className="text-2xl text-black/50 dark:text-white/50">
          Be right back soon!
        </span>
        <div className="flex gap-4">
          {
            data.web_general.social.discord &&
            <a
              target="_blank"
              href={data.web_general.social.discord}
              className="transition-all duration-300 hover:scale-150 hover:rotate-[360deg]"
            >
              <Discord
                color={
                  darkMode
                    ? '#FFFFFF'
                    : '#000000'
                }
                size={50}
              />
            </a>
          }
        </div>
      </div>
    );
};
