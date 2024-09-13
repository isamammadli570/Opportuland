import { useState, useContext, useEffect, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import AuthContext from "../signin/TokenManager";
import { Menu, Transition } from "@headlessui/react";
import { theme } from "../theme/theme";
import { HiBars3 } from "react-icons/hi2";
import Theme from "./Theme";
import { AiOutlineCaretDown, AiOutlineCaretUp, AiOutlineCheckSquare } from "react-icons/ai";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Get Started");
  const user = localStorage.getItem("user");
  const userData = JSON.parse(user);
  const userCompany = localStorage.getItem("userCompany");
  const userDataCompany = JSON.parse(userCompany);
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpenMenu, setIsOpenMenu] = useState(false)

  const [open, setOpen] = useState(true);

  const handleItemClick = (itemType) => {
    setSelectedItem(itemType);
    const route = itemType === "User" ? "/signup" : "/company";
    navigate(route);
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!user && ["/", "/contest", "/statistics", "/messages", "/signin"].includes(location.pathname)) {
      setSelectedItem("Get Started");
    }
  }, [location.pathname, user]);


  const handleNavigateStart = () => {
    navigate("/signin");
  };
  const handleNavigateStartRegister=()=>{
    navigate("/register");
  }

  const handleNavigateLogIn = () => {
    navigate("/login")
  }

  return (
    <div className="h-full w-full bg-lightPrimary dark:!bg-zinc-900 duration-200">
      <main className={`mx-[12px] h-full flex-none transition-all md:pr-2`}>
        <nav className="bg-lightPrimary dark:!bg-zinc-900 py-6 sticky top-4 z-40 rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
          {/* navbar div */}
          <div className="flex justify-between items-center ">
            {/* <div className="ml-[6px]">
                  <p className="shrink text-[33px] capitalize text-zinc-700 dark:text-white">
                    <Link to="#" className="font-bold capitalize hover:text-zinc-700 dark:hover:text-white">
                    </Link>
                  </p>
                </div> */}

            {/* logo hissesi */}
            <div className="mx-[56px]">
              <div className="ml-1 font-poppins text-[26px] font-bold uppercase text-zinc-700 dark:text-white">
                <Link to="/" className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-zinc-700 dark:text-white">
                  <span className="font-medium">Opportu</span> Land </Link>
              </div>
            </div>

            <div>
              <div className="flex items-center ">
                {/* linkler */}
                <div className="flex items-center gap-10 ">

                  <ul className="lg:flex items-center space-x-8 ml-10 hidden">
                    <li>
                      <Link
                        to="/"
                        className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                          } hover:text-yellow-500 dark:hover:text-yellow-500`}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contest"
                        className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/contest") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                          } hover:text-yellow-500 dark:hover:text-yellow-500`}
                      >
                        Contests
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/remote"
                        className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/remote") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                          } hover:text-yellow-500 dark:hover:text-yellow-500`}
                      >
                        Remote
                      </Link>
                    </li>

                    {/* <li>
                    <Link
                      to="/statistics"
                      className={`font-bold text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${
                        isActive("/statistics") ? "text-orange-500" : "text-zinc-700 dark:text-white"
                      } hover:text-orange-500 dark:hover:text-orange-500`}
                    >
                      Statistics
                    </Link>
                  </li> */}
                    {user && (
                      <li>
                        <Link
                          to="/messages"
                          className={`font-bold text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/messages") ? "text-orange-500" : "text-zinc-700 dark:text-white"
                            } hover:text-orange-500 dark:hover:text-orange-500`}
                        >
                          Messages
                        </Link>
                      </li>
                    )}

                    {/* admin hissesindeki dahsboard */}
                    {user ? (
                      <>
                        <Menu as="div" className="relative inline-block text-left ">
                          <div>
                            <Menu.Button
                              style={{ background: theme.dark, color: theme.white }}
                              className="px-2 inline-flex w-full border-none justify-center gap-x-1.5 rounded-md py-2 text-sm font-semibold text-gray-900 shadow-sm"
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
                            <Menu.Items className="ml-10 absolute duration-200 right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div
                                className="py-1"
                                style={{ background: theme.dark, color: theme.white }}
                              >
                                <Menu.Item style={{ background: theme.dark, color: theme.white }}>
                                  <Link
                                    to="edit"
                                    className="text-gray-700 block px-4 py-2 text-sm text-bold"
                                  >
                                    Edit Profile
                                  </Link>
                                </Menu.Item>
                                <Menu.Item style={{ background: theme.dark, color: theme.white }}>
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
                    ) : userCompany ? (
                      userDataCompany.admin ? (
                        <Link
                          to="/admin/default"
                          className={`ml-8 font-bold text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/admin/default") ? "text-orange-500" : "text-zinc-700 dark:text-white"
                            } hover:text-orange-500 dark:hover:text-orange-500`}
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/admin/my-contests"
                          className={`ml-8 font-bold text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/admin/my-contests") ? "text-orange-500" : "text-zinc-700 dark:text-white"
                            } hover:text-orange-500 dark:hover:text-orange-500`}
                        >
                          Dashboard
                        </Link>
                      )
                    ) : (
                      <>


                      </>
                    )}
                  </ul>
                  {/* button hissesi */}
                  <div className="flex gap-3 px-2">
                    {/* theme hissesi */}
                    <div className="ml-8 lg:flex hidden">
                      <Theme />
                    </div>

                    <button
                      onClick={handleNavigateLogIn}
                      className=" flex justify-center items-center px-4 py-1.5 border-2 border-yellow-400 text-yellow-500  rounded-md hover:bg-yellow-400 duration-200 hover:text-white"
                    >
                      Log in
                    </button>

                    {/* evvelki button */}
                    {/* <button
                      onClick={handleNavigateStart}
                      className="flex justify-center items-center p-2 bg-yellow-400 text-black rounded-md text-zinc-700 hover:bg-yellow-500 hover:text-white duration-200 focus:outline-none"
                    >
                      For Employer
                    </button> */}

                    <button
                      onClick={() => setIsOpenMenu((prev) => !prev)}
                      className="flex justify-center items-center p-2 bg-yellow-400 text-black rounded-md text-zinc-700 hover:bg-yellow-500 hover:text-white duration-200 focus:outline-none">
                      For Employer
                      {!isOpenMenu ? (
                        <AiOutlineCaretDown className="h-6" />
                      ) : (
                        <AiOutlineCaretUp className="h-6" />
                      )}

                      {isOpenMenu && (
                        <div className="absolute top-[73px] flex flex-col px-2 
                        items-start bg-zinc-400 w-32 rounded-md text-white ">
                          <p
                            onClick={handleNavigateStart}
                            className="hover:text-yellow-300 duration-200 ">
                            Log in
                          </p>
                          <p
                            onClick={handleNavigateStartRegister}
                            className="hover:text-yellow-300 duration-200">
                            Register
                          </p>
                        </div>
                      )}
                    </button>

                  </div>
                </div >

                {/* responsive bar */}
                <div>
                  {!isOpen && (
                    <HiBars3
                      onClick={() => setIsOpen((open) => !open)}
                      className={`lg:hidden text-2xl cursor-pointer dark:text-white`}
                    />
                  )}
                </div>
                
              </div >
            </div>
          </div >
        </nav>
      </main>
    </div>
  );
};

export default Sidebar;
