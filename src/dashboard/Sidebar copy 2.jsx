import { Link } from "react-router-dom";
import Hamburger from "../assets/icons/hamburger.svg";
import { useState, useContext } from "react";
import { theme } from "../theme/theme";
import AuthContext from "../signin/TokenManager";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Logo from "../assets/logo/OpportuLand-logo3-small.png";
import { useNavigate } from 'react-router-dom';


export default function Sidebar() {
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Get Started")
  const user = localStorage.getItem("user");
  const userData = JSON.parse(user);
  const { logOut } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleItemClick = (itemType) => {
    setSelectedItem(itemType); 
    const route = itemType === "User" ? '/signin' : '/company';
    navigate(route); 
  };


  return (
    <div
      className="w-full flex justify-between items-center px-5 sm:px-12 z-20  relative"
      style={{ background: theme.dark }}
    >
      <Link to="/" className="flex iw-48 h-24 items-center">
        <img className="w-full h-full" src={Logo} alt="logo" />
        <h2 className="font-semibold text-2xl text-yellow-500">OpportuLand</h2>
      </Link>
      <button
        onClick={() => {
          setHamburgerMenuOpen(!hamburgerMenuOpen);
        }}
        className="md:hidden"
      >
        <img className="w-16 h-16" src={Hamburger} alt="hamburger" />
      </button>
      <div
        className={`${
          hamburgerMenuOpen ? "flex" : "hidden md:flex"
        } text-zinc-700 md:text-white w-full md:w-fit absolute md:static left-0 top-24 md:top-0   flex-col md:flex-row md:items-center md:gap-14`}
      >
        <div className="flex flex-col items-center md:flex-row md:gap-8 md:text-white text-base">
          <Link
            to="/"
            className=" bg-white md:bg-transparent md:hover:bg-transparent hover:bg-white/80 duration-300   hover:cursor-pointer hover:$  py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start sm:hover:text-yellow-500"
          >
            Remote
          </Link>
          <Link
            to="/contest"
            className=" bg-white md:bg-transparent md:hover:bg-transparent hover:bg-white/80 duration-300   hover:cursor-pointer hover:$  py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start sm:hover:text-yellow-500"
          >
            Contests
          </Link>
          <Link
            to="/statistics"
            className=" bg-white md:bg-transparent md:hover:bg-transparent hover:bg-white/80 duration-300   hover:cursor-pointer hover:$  py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start sm:hover:text-yellow-500"
          >
            Statistics
          </Link>
          <Link
            to="/messages"
            className=" bg-white md:bg-transparent md:hover:bg-transparent hover:bg-white/80 duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start sm:hover:text-yellow-500"
          >
            Messages
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:gap-4 items-center">
          {user ? (
            <>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button
                    style={{ background: theme.dark, color: theme.white }}
                    className="inline-flex w-full border-none justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm "
                  >
                    {userData.username}

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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="py-1"
                      style={{ background: theme.dark, color: theme.white }}
                    >
                      <Menu.Item
                        style={{ background: theme.dark, color: theme.white }}
                      >
                        <Link
                          to="edit"
                          className="text-gray-700 block px-4 py-2 text-sm text-bold"
                        >
                          Edit Profile
                        </Link>
                      </Menu.Item>
                      <Menu.Item
                        style={{ background: theme.dark, color: theme.white }}
                      >
                        <Link
                          to="signin"
                          className="text-gray-700 block px-4 py-2 text-sm text-bold"
                          onClick={logOut}
                        >
                          Sign out
                        </Link>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="bg-white md:bg-transparent md:hover:bg-transparent hover:bg-white/80 duration-300 md:text-white py-4 md:py-0 w-full md:w-fit text-center md:text-start border-b md:border-none sm:hover:text-yellow-500"
              >
                Sign in
              </Link>
              
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
               onClick={() => handleItemClick("User")}
              >
                <h3 className="text-gray-700 block px-4 py-2 text-bae font-semibold cursor-pointer">
                Employer
                </h3>
              </Menu.Item>
              <hr />
              <Menu.Item
               onClick={() => handleItemClick("Company")}
              >
                <h3 className="text-gray-700 block px-4 py-2 text-base font-semibold cursor-pointer">
                Applicant
                </h3>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
