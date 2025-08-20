import React, { useEffect } from 'react';
import { GeneralConfig } from './partials/GeneralConfig';
import { useDispatch, useSelector } from 'react-redux';
import { SocialConfig } from './partials/SocialConfig';
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { Card } from '../../../elements/admin/Card';
import { ChannelsTable } from './partials/ChannelsTable';
import { channelsThunk } from '../../../../store/slices/channel.slice';
import { LauncherConfig } from './partials/LauncherConfig';

export const HomePage = () => {

  const dispatch = useDispatch()

  const channels = useSelector(state => state.channels)

  const publicData = useSelector(state => state.publicData)

  useEffect(() => {
    dispatch(channelsThunk())
  }, [])

  if(publicData.id)

    return (
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-7 gap-4">
        <div className="md:col-span-3 lg:col-span-5 flex flex-col gap-4">
          <ChannelsTable data={channels}/>
        </div>
        <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-4">
          <Disclosure as={Card} defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between font-medium">
                  <span>General</span>
                  <ChevronUpIcon
                    className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pt-4">
                  <GeneralConfig data={publicData.web_general} />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure as={Card}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between font-medium">
                  <span>Launcher</span>
                  <ChevronUpIcon
                    className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pt-4">
                  <LauncherConfig data={publicData.web_general.launcher} />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure as={Card}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between font-medium">
                  <span>Social</span>
                  <ChevronUpIcon
                    className={`${ open ? 'rotate-180 transform' : '' } h-5 w-5`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pt-4">
                  <SocialConfig data={publicData.web_general.social} />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    )
};
