/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineClose,
} from 'react-icons/ai'

type Props = {
  show: boolean
  type: string
  heading: string
  message: JSX.Element | string
  onClose: Function
}

export const Notification = ({
  show,
  type = 'success',
  heading,
  message,
  onClose,
}: Props) => {
  return (
    <>
      <div
        aria-live="assertive"
        className="fixed inset-0 z-10 flex items-end px-4 py-6 text-left pointer-events-none sm:p-6 sm:items-start">
        <div className="flex flex-col items-center w-full space-y-4 sm:items-end">
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {type === 'success' && (
                      <AiOutlineCheckCircle
                        className="w-6 h-6 text-green-400"
                        aria-hidden="true"
                      />
                    )}
                    {type === 'error' && (
                      <AiOutlineCloseCircle
                        className="w-6 h-6 text-red-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {heading}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{message}</p>
                  </div>
                  <div className="flex flex-shrink-0 ml-4">
                    <button
                      type="button"
                      className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => onClose()}>
                      <span className="sr-only">Close</span>
                      <AiOutlineClose className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}
