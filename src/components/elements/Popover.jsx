import { Popover as HeadlessPopover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

export const Popover = ({ button, title = null, text }) => {
    return (
        <HeadlessPopover className="relative">
            <HeadlessPopover.Button className="flex gap-1 items-center">
                {button}
            </HeadlessPopover.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <HeadlessPopover.Panel className="absolute left-1/2 z-10 mt-3 -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl text-black dark:text-white">
                    <div className="overflow-hidden rounded-lg shadow-lg p-2 w-[200px] dark:shadow-zinc-900 bg-custom-light-600 dark:bg-custom-dark-600 border border-black/20 dark:border-black flex flex-col gap-2">
                        { title &&
                            <span className="text-sm font-medium">
                                {title}
                            </span>
                        }
                        <p className="block text-sm font-light">
                            {text}
                        </p>
                    </div>
                </HeadlessPopover.Panel>
            </Transition>
        </HeadlessPopover> 
    )
}
