import Loading from '../ui/Loading/Loading.jsx';
import { Fragment } from 'react';
import { theme } from '../theme/theme'
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
export default function RegenerateText({regenerateText, selectedItem, setSelectedItem, coverLetter, loading, setCoverLetter, handleSend, job}) {
  return (
    <div className='w-full relative'>
        {loading ?  <Loading /> : null}

    <textarea
      rows="12"
      placeholder="Write your cover letter..."
      value={coverLetter}
      onChange={(e) => setCoverLetter(e.target.value)}
      className="my-3 px-2 text-black py-1 w-full border border-gray-300 rounded"
      style={{ color: theme.dark }}
    />
    <div className="flex ">
      <Menu as="div" className="relative inline-block text-left mx-4">
        <div>
          <Menu.Button
            style={{ background: theme.dark, color: theme.white }}
            className="inline-flex w-full border-none justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm "
          >
            {selectedItem}

            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-yellow-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item
                onClick={() => setSelectedItem("Chat pgt 3.5")}
              >
                <h3 className="text-gray-700 block px-4 py-2 text-sm text-bold cursor-pointer">
                  Chat gpt 3.5
                </h3>
              </Menu.Item>
              <hr />
              <Menu.Item
                onClick={() => setSelectedItem("Chat gpt 4")}
              >
                <h3 className="text-gray-700 block px-4 py-2 text-sm text-bold cursor-pointer">
                  Chat gpt 4
                </h3>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <button
        onClick={() => regenerateText(job)}
        className=" text-white w-36 px-3 py-2 rounded-sm font-bold"
        style={{ background: theme.yellow }}
      >
        CoverLetter AI
      </button>
    </div>
    <div className="flex justify-end">
    <button
      onClick={handleSend}
      className=" text-white w-36 px-3 py-2 rounded-sm"
      style={{ background: theme.yellow }}
    >
      Send
    </button>
    </div>
   
  </div>
  )
}
