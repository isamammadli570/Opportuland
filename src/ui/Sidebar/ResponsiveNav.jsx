/* eslint-disable react/prop-types */
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import Theme from "../../theme/ThemeDL";
import Footer from "../Footer/Footer";
import { Fragment, useContext } from "react";
import AuthContext from "../../contexts/TokenManager";
import { Menu, Transition } from "@headlessui/react";
import { theme } from "../../theme/theme";
import { ChevronDownIcon } from "@heroicons/react/20/solid";


function ResponsiveNav({ setIsOpen }) {
  const toggleNavbar = () => {
    setIsOpen((open) => !open);
  };

  const isActive = (path) => location.pathname === path;
  const user = localStorage.getItem("user");
  const userData = JSON.parse(user);

  const userCompany = localStorage.getItem("userCompany");
  const userDataCompany = JSON.parse(userCompany);

  const googleUser = localStorage.getItem("googleUser");
  const googleUserData = JSON.parse(googleUser);

  const { logOut } = useContext(AuthContext);

  return (
    <div>
      <div className="ml-8 mt-10 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
        <Link to="/" className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          <span className="font-medium ">Opportu</span> Land </Link>
      </div>

      <div className="flex gap-20 justify-center py-3 relative ">
        <AiOutlineClose
          className="text-2xl dark:text-white left-0 ml-10 absolute cursor-pointer mt-6 font-semibold  "
          onClick={() => setIsOpen((open) => !open)}
        />
      </div>

      <div className="flex justify-center py-20">
        <ul className="flex items-center flex-col gap-12 ml-5 mt-12">
          {/* <li>
            <Link
              onClick={toggleNavbar}
              to="/"
              className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/") ? "text-yellow-500" : "text-navy-700 dark:text-white"
                } hover:text-yellow-500 dark:hover:text-yellow-500`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              onClick={toggleNavbar}
              to="/contest"
              className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/contest") ? "text-yellow-500" : "text-navy-700 dark:text-white"
                } hover:text-yellow-500 dark:hover:text-yellow-500`}
            >
              Contests
            </Link>
          </li>
 */}
          <li>
            <Link
              onClick={toggleNavbar}
              to="/local?page=1"
              className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/local") ? "text-yellow-500" : "text-navy-700 dark:text-white"
                } hover:text-yellow-500 dark:hover:text-yellow-500`}
            >
              Local
            </Link>
          </li>

          <li>
            <Link
              onClick={toggleNavbar}
              to="/remote?page=1"
              className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/remote") ? "text-yellow-500" : "text-navy-700 dark:text-white"
                } hover:text-yellow-500 dark:hover:text-yellow-500`}
            >
              Remote
            </Link>
          </li>

          {user && (
            <li>
              <Link
                onClick={toggleNavbar}
                to="/messages"
                className={`font-bold text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/messages") ? "text-yellow-500" : "text-navy-700 dark:text-white"
                  } hover:text-yellow-500 dark:hover:text-yellow-500`}
              >
                Messages
              </Link>
            </li>
          )}

          {/* admin hissesindeki dahsboard */}
          {user || googleUser ? (
            <>
              <Menu as="div" className="lg:flex hidden relative text-left ">
                <div>
                  <Menu.Button
                    style={{ background: theme.dark, color: theme.white }}
                    className="px-2 inline-flex w-full border-none justify-center gap-x-1.5 rounded-md py-2 text-sm font-semibold text-gray-900 shadow-sm"
                  >
                    {user ? userData.username : googleUserData.name}
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
                  <Menu.Items className="ml-10 absolute duration-200 right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="py-1"
                      style={{ background: theme.dark, color: theme.white }}
                    >
                      {user && <Menu.Item style={{ background: theme.dark, color: theme.white }}>
                        <Link
                          to="edit"
                          className="text-gray-700 block px-4 py-2 text-sm text-bold"
                        >
                          Edit Profile
                        </Link>
                      </Menu.Item>}
                      <Menu.Item style={{ background: theme.dark, color: theme.white }}>
                        <Link
                          to="applicant-signin"
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
          ) : userCompany ? (
            userDataCompany.admin ? (
              <Link
                to="/admin/default"
                className={`ml-8 font-bold text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/admin/default") ? "text-yellow-500" : "text-navy-700 dark:text-white"
                  } hover:text-yellow-500 dark:hover:text-yellow-500`}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/my-contests"
                className={`ml-8 font-bold text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/admin/my-contests") ? "text-yellow-500" : "text-navy-700 dark:text-white"
                  } hover:text-yellow-500 dark:hover:text-yellow-500`}
              >
                Dashboard
              </Link>
            )
          ) : (
            <>


            </>
          )}
        </ul>
      </div>
      <div className="absolute top-[6.7rem] right-16">
        <Theme />
      </div>
      <div className="mt-40">
        <Footer />
      </div>
    </div>
  );
}

export default ResponsiveNav;