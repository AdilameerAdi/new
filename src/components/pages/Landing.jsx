import React, { useEffect, useState } from 'react';
import { PreAuthLayout } from '../layouts/PreAuthLayout';
import { SecondaryButton } from '../elements/SecondaryButton';
import { Download, Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { channelsThunk } from '../../store/slices/channel.slice';
import cutString from '../../utils/cutString';
import { useTranslation } from 'react-i18next';
import { Discord, Feed } from '../../../public/icons/Svg';
import { NavLink } from '../elements/user/NavLink';
import Countdown, { zeroPad } from 'react-countdown';
import { Link } from 'react-router-dom';
import apiConfig from '../../utils/apiConfig';

const Channels = () => {

  const dispatch = useDispatch()
  const channels = useSelector(state => state.channels)

  useEffect(() => {
    dispatch(channelsThunk())
  }, [])

  if(channels.length > 0)
    return (
      <div className="flex flex-col gap-2">
        {
          channels?.map((channel, index) => (
            <div className={`flex gap-6 items-center bg-gradient-to-t from-transparent sm:hover:scale-125 duration-300 text-white
              ${channel.status ? 'via-green-500/70' : 'via-red-500/70'} to-transparent px-6 w-full sm:w-52`}
              title={channel.status ? 'Online' : 'Offline'} key={index}
              style={{ 
                clipPath: `polygon(0 0, 95% 0%, 100% 100%, 5% 100%)`
              }}
            >
              <div className={`w-4 h-4 aspect-square ${channel.status ? 'bg-green-400' : 'bg-red-400' } 
                shadow-sm shadow-black rounded-full breath__animate`}
              />
              <span className="text-lg font-medium">{cutString(channel.name, 10)}</span>
            </div>
          ))
        }
      </div>
    )
}

export const Landing = () => {

  const { t } = useTranslation();

  const darkMode = useSelector( (state) => state.darkMode);
  const social = useSelector( (state) => state.publicData?.web_general?.social);

  const [count] = useState("07/15/2024")

  const countdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return           (
        <SecondaryButton size="xl" variant="outline" as={Link} to={`${apiConfig().endpoint}/services/download/launcher`}
          className="!p-3 sm:!px-6 rounded-xl sm:rounded-3xl bg-gradient-to-br from-cyan-600 
          via-green-500 to-cyan-400 dark:from-purple-600 dark:via-red-500 dark:to-purple-400 
          font-semibold !text-white sm:!text-3xl !border-0 flex gap-6 items-center w-max"
        >
          <div className="bg-black rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
            <Download className="sm:!h-8 sm:!w-8"/>
          </div>
          {t("Download")}
        </SecondaryButton>
      )
    } else {
      return (
        <div className="flex justify-center font-medium">
          <div className="px-16 flex flex-col gap-3 justify-center items-center bg-gradient-to-t from-transparent via-white dark:via-black to-transparent rounded-full">
            <h3 className="text-xl md:text-4xl">{t("Open time")}</h3>
            <h1 className="text-2xl md:text-6xl">
              {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
            </h1>
            <h5 className="text-lg">{count}</h5>            
          </div>
        </div>
      );
    }
  };

  return (
    <PreAuthLayout>
      <div className="h-full flex flex-col gap-6 sm:gap-10 p-6 sm:p-10 bg-gradient-to-b
        from-transparent via-black/20 to-black overflow-auto"
      >
        <div className="flex flex-col flex-grow gap-6 sm:gap-10">
          <div>
            <img  src="/img/logo.png" alt="Main_Logo" className="max-h-28"
              style={{ filter: `drop-shadow(0px 1px 2px black)` }}
            />
          </div>
          <Countdown
            date={count}
            renderer={countdown}
          />
        </div>
        <div className="flex flex-wrap justify-between gap-4 items-end">
          <Channels />
          <div className="flex flex-col items-center gap-4">
            {
              social?.discord_id &&
              <iframe src={`https://discord.com/widget?id=${social?.discord_id}&theme=${darkMode ? 'dark' : 'light'}`}  
                className="rounded-lg min-w-[300] max-w-[400] border border-black/20 dark:border-black"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                allowtransparency="true" 
                frameborder="0"
                width="100%"
                height="400"
              />
            }
            <div className="flex flex-wrap gap-4">
              { 
                social?.discord &&
                  <NavLink
                    as="a"
                    href={social?.discord}
                    className={`bg-custom-light-700 dark:bg-custom-dark-700 bg-custom-light-700/60 dark:bg-custom-dark-700/60
                      flex gap-2 border border-black/20 dark:border-black`
                    }
                  >
                    <Discord 
                      color={
                        darkMode
                          ? '#FFFFFF'
                          : '#000000'
                      }
                    />
                  </NavLink>
              }
              {
                social?.facebook &&
                  <NavLink
                    as="a"
                    href={social?.facebook}
                    className={`bg-custom-light-700 dark:bg-custom-dark-700 bg-custom-light-700/60 dark:bg-custom-dark-700/60
                      flex gap-2 border border-black/20 dark:border-black`
                    }
                  >
                    <Facebook 
                      color={
                        darkMode
                          ? '#FFFFFF'
                          : '#000000'
                      }
                    />
                  </NavLink>
              }
              {
                social?.instagram &&
                  <NavLink
                    as="a"
                    href={social?.instagram}
                    className={`bg-custom-light-700 dark:bg-custom-dark-700 bg-custom-light-700/60 dark:bg-custom-dark-700/60
                      flex gap-2 border border-black/20 dark:border-black`
                    }
                  >
                    <Instagram 
                      color={
                        darkMode
                          ? '#FFFFFF'
                          : '#000000'
                      }
                    />
                  </NavLink>
              }
              {
                social?.twitter &&
                  <NavLink
                    as="a"
                    href={social?.twitter}
                    className={`bg-custom-light-700 dark:bg-custom-dark-700 bg-custom-light-700/60 dark:bg-custom-dark-700/60
                      flex gap-2 border border-black/20 dark:border-black`
                    }
                  >
                    <Twitter 
                      color={
                        darkMode
                          ? '#FFFFFF'
                          : '#000000'
                      }
                    />
                  </NavLink>
              }
              {
                social?.youtube &&
                  <NavLink
                    as="a"
                    href={social?.youtube}
                    className={`bg-custom-light-700 dark:bg-custom-dark-700 bg-custom-light-700/60 dark:bg-custom-dark-700/60
                      flex gap-2 border border-black/20 dark:border-black`
                    }
                  >
                    <YouTube 
                      color={
                        darkMode
                          ? '#FFFFFF'
                          : '#000000'
                      }
                    />
                  </NavLink>
              }
              <NavLink
                to={"blog"}
                className={`bg-custom-light-700 dark:bg-custom-dark-700 bg-custom-light-700/60 dark:bg-custom-dark-700/60
                  flex gap-2 border border-black/20 dark:border-black`
                }
              >
                <Feed 
                  color={
                    darkMode
                      ? '#FFFFFF'
                      : '#000000'
                  }
                />
              </NavLink>
              <NavLink
                to={"https://www.elitepvpers.com/forum/nostale/"}
                className={`bg-custom-light-700 dark:bg-custom-dark-700 bg-custom-light-700/60 dark:bg-custom-dark-700/60
                  flex gap-2 border border-black/20 dark:border-black`
                }
              >
                <img src={`/img/elitepvp_${darkMode ? 'dark' : 'light'}.png`} className="w-6 aspect-square" alt="elitepvpers" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </PreAuthLayout>
  );
};
