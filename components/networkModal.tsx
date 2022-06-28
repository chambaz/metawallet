/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { BiErrorCircle } from 'react-icons/bi'

type Props = {
  show: boolean
}

export const NetworkModal = ({ show }: Props) => {
  const [open, setOpen] = useState(show)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-xl sm:w-full sm:p-6">
                <div className="flex flex-col items-center justify-center px-8 py-4 space-y-6 text-center md:px-12">
                  <BiErrorCircle className="p-2 text-6xl text-red-400 bg-red-100 rounded-full" />
                  <p>
                    Our smart contracts run on{' '}
                    <a
                      className="text-red-600 border-b border-red-600"
                      href="https://www.optimism.io/"
                      target="_blank"
                      rel="noreferrer">
                      Optimism
                    </a>
                    , an Ethereum L2 scaling solution, so that we can provide a
                    fast and affordable experience to our users.
                  </p>
                  <button className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add Optimism to MetaMask
                  </button>
                  <p>
                    <a
                      className="text-sm text-red-600 border-b border-red-600"
                      href="https://gateway.optimism.io/"
                      target="_blank"
                      rel="noreferrer">
                      Bridge funds to Optimism
                    </a>
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
