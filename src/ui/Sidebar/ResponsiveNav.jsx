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
      <div className="ml-8 mt-10 font-poppins text-[26px] font-bold uppercase text-zinc-700 dark:text-white">
        <Link to="/" className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-zinc-700 dark:text-white">
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
              className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                } hover:text-yellow-500 dark:hover:text-yellow-500`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              onClick={toggleNavbar}
              to="/contest"
              className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/contest") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
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
              className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/local") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                } hover:text-yellow-500 dark:hover:text-yellow-500`}
            >
              Local
            </Link>
          </li>

          <li>
            <Link
              onClick={toggleNavbar}
              to="/remote?page=1"
              className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/remote") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
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
                className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/messages") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                  } hover:text-yellow-500 dark:hover:text-yellow-500`}
              >
                Messages
              </Link>
            </li>
          )}

          {/* admin hissesindeki dahsboard */}
          {user || googleUser ? (
            <>  
            </>
          ) : userCompany ? (
            userDataCompany.admin ? (
              <Link
                to="/admin/default"
                className={`ml-8 text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/admin/default") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                  } hover:text-yellow-500 dark:hover:text-yellow-500`}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/my-contests"
                className={`ml-8 text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/admin/my-contests") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
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