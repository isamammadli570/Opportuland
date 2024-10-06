import Loading from '../ui/Loading/Loading.jsx';
import { Fragment} from "react";
import { theme } from "../theme/theme";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import templateOne from '../assets/logo/template1.png'
import templateTwo from '../assets/logo/template2.png'
import templateThree from '../assets/logo/template3.png'



export default function RegenerateResume({
  loading,
  setSelectedItem,
  oldResume,
  selectPdf,
  selectedItem,
  selectTemplate,
  setSelectTemplate,
}) 
{

  return (

    <>
       <div className="w-full relative">
       {loading ?  <Loading /> : null}

      {oldResume ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <object
            data={oldResume}
            type="application/pdf"
            width="700px"
            height="500px"
          >
            <p>
              Alternative text - include a link{" "}
              <a href={oldResume}>to the PDF!</a>
            </p>
          </object>
        </div>
      ) : null}
      <div className="flex my-6">
        {" "}
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
                <Menu.Item onClick={() => setSelectedItem("Chat gpt 3.5")}>
                  <h3 className="text-gray-700 block px-4 py-2 text-sm text-bold cursor-pointer">
                    Chat gpt 3.5
                  </h3>
                </Menu.Item>
                <hr />
                <Menu.Item onClick={() => setSelectedItem("Chat gpt 4")}>
                  <h3 className="text-gray-700 block px-4 py-2 text-sm text-bold cursor-pointer">
                    Chat gpt 4
                  </h3>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <Menu as="div" className="relative  text-left mx-4 ">
          <div>
            <Menu.Button
              style={{ background: theme.dark, color: theme.white }}
              className="inline-flex w-full border-none justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm "
            >
              {selectTemplate}

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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-[800px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 flex">
                <Menu.Item onClick={() => setSelectTemplate("Template 1")}>
                  <h3 className="text-gray-700 block px-4 py-2 text-sm text-bold cursor-pointe bg-yellow-500 text-center font-semibold">
                    Template 1
                    <img src={templateOne}/>
                  </h3>
               
                  
                </Menu.Item>
                <hr />
                <Menu.Item onClick={() => setSelectTemplate("Template 2")}>
                  <h3 className="text-gray-700 block px-4 py-2 text-sm text-bold cursor-pointer mx-[1px] bg-yellow-500 text-center font-semibold" >
                    Template 2
                    <img src={templateTwo}/>
                  </h3>
                </Menu.Item>
                <hr />
                <Menu.Item onClick={() => setSelectTemplate("Template 3")}>
                  <h3 className="text-gray-700 block px-4 py-2 text-sm text-bold cursor-pointer bg-yellow-500 text-center font-semibold">
                    Template 3
                    <img src={templateThree}/>
                  </h3>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <button
          onClick={selectPdf}
          disabled={loading}
          className=" text-white w-36 px-3 py-2 rounded-sm bg-yellow-500 font-bold"
        >
          {loading ? "Loading..." : "Resume AI"}
        </button>
      </div>
    </div>
    </>
   
  );
}
