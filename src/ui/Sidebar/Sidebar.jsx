import { useState, useContext, useEffect, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import AuthContext from "../../contexts/TokenManager";
import { Menu, Transition } from "@headlessui/react";
import { theme } from "../../theme/theme";
import { HiBars3 } from "react-icons/hi2";
import Theme from "../../theme/ThemeDL"
import { GoChevronDown } from "react-icons/go";

const Sidebar = ({ isOpen, setIsOpen }) => {
 /*  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false); */
  const [selectedItem, setSelectedItem] = useState("Get Started");
  const user = localStorage.getItem("user");
  const userData = JSON.parse(user);

  const googleUser = localStorage.getItem("googleUser");
  const googleUserData = JSON.parse(googleUser);

  const userCompany = localStorage.getItem("userCompany");
  const userDataCompany = JSON.parse(userCompany);

  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  /* const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [isOpenMenuUser, setIsOpenMenuUser] = useState(false) */

  const [open, setOpen] = useState(true);

  /* const handleItemClick = (itemType) => {
    setSelectedItem(itemType);
    const route = itemType === "User" ? "/signup" : "/company";
    navigate(route);
  }; */

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
    if (!user || googleUser && ["/", "/contest", "/statistics", "/messages", "/user-login"].includes(location.pathname)) {
      setSelectedItem("Get Started");
    }
  }, [location.pathname, user, googleUser]);


  const handleNavigateStart = () => {
    navigate("/login");
  };
  const handleNavigateStartRegister = () => {
    navigate("/register");
  }
  const handleNavigateStartUser = () => {
    navigate("/user-login");
  };
  const handleNavigateStartRegisterUser = () => {
    navigate("/user-register");
  }

  return (
    <div className="h-full w-full bg-lightPrimary dark:!bg-zinc-900 duration-200">
      <main className={`mx-[12px] h-full flex-none transition-all md:pr-2`}>
        <nav className="bg-lightPrimary dark:!bg-zinc-900 py-6 sticky top-4 z-40 rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
          {/* navbar div */}
          <div className="flex justify-between items-center ">
            {/* logo hissesi */}
            <div className="md:mx-[56px] mx-[20px] flex ">
              <div className="font-poppins md:text-[26px] text-[16px] font-bold uppercase text-zinc-700 dark:text-white">
                <Link to="/" className="flex h-2.5 font-poppins font-bold uppercase text-zinc-700 dark:text-white">
                  <span className="font-medium">Opportu</span> <p>Land</p> </Link>
              </div>
              {/* theme hissesi */}
              <div className="md:flex hidden">
                <Theme />
              </div>
            </div>

            <div>
              <div className="flex items-center ">
                {/* linkler */}
                <div className="flex items-center gap-10 ">
                  <ul className="flex items-center md:space-x-8 md:ml-10 ">
                    {/* <li className="lg:flex hidden">
                      <Link
                        to="/"
                        className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                          } hover:text-yellow-500 dark:hover:text-yellow-500`}
                      >
                        Home
                      </Link>
                    </li>
                    
                    <li className="lg:flex hidden">
                      <Link
                        to="/contest"
                        className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/contest") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                          } hover:text-yellow-500 dark:hover:text-yellow-500`}
                      >
                        Contests
                      </Link>
                    </li> */}
                    <li className="lg:flex hidden">
                      <Link
                        to="/local?page=1"
                        className={`text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/local") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                          } hover:text-yellow-500 dark:hover:text-yellow-500`}
                      >
                        Local
                      </Link>
                    </li>

                    <li className="lg:flex hidden">
                      <Link
                        to="/remote?page=1"
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
                        isActive("/statistics") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                      } hover:text-yellow-500 dark:hover:text-yellow-500`}
                    >
                      Statistics
                    </Link>
                  </li> */}
                    {user && (
                      <li>
                        <Link
                          to="/messages"
                          className={`font-bold lg:flex hidden text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/messages") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                            } hover:text-yellow-500 dark:hover:text-yellow-500`}
                        >
                          Messages
                        </Link>
                      </li>
                    )}

                    {/* admin hissesindeki dahsboard */}
                    {user || googleUser ? (
                      <>
                        <Menu as="div" className="lg:flex px-4 relative text-left ">
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
                                    to="/"
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
                          className={`ml-8 font-bold lg:flex hidden text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/admin/default") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                            } hover:text-yellow-500 dark:hover:text-yellow-500`}
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/admin/my-contests"
                          className={`ml-8 font-bold lg:flex hidden text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/admin/my-contests") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                            } hover:text-yellow-500 dark:hover:text-yellow-500`}
                        >
                          Dashboard
                        </Link>
                      )

                    ) : (
                      <>
                        {/* button hissesi */}
                        <div className="flex gap-3 px-2">
                          <div className="group relative cursor-pointer ">
                            <div className="flex items-center justify-between border-2 border-yellow-400 text-yellow-500 rounded-md hover:bg-yellow-400 hover:text-white duration-200">
                              <a className="menu-hover py-[6px] text-base text-black mx-4">
                                Log in
                              </a>
                            </div>
                            <div
                              className="invisible absolute z-50 flex w-full flex-col bg-white dark:bg-zinc-800  rounded-md text-gray-800 dark:text-gray-200 shadow-xl group-hover:visible">
                              <p
                                onClick={handleNavigateStartUser}
                                className="my-2 block border-b border-stone-100 md:px-0 px-2 py-1 hover:text-black md:mx-2 hover:text-yellow-500">
                                Log in
                              </p>

                              <p
                                onClick={handleNavigateStartRegisterUser}
                                className="my-2 block border-b border-gray-100 md:px-0 px-2 py-1 hover:text-black md:mx-2 hover:text-yellow-500">
                                Register
                              </p>
                            </div>
                          </div>

                          <div className="group relative cursor-pointer ">
                            <div className="flex items-center justify-between  bg-yellow-400 text-black rounded-md hover:bg-yellow-500 duration-200">
                              <a className="menu-hover py-2 text-base text-black lg:mx-2 px-1">
                                For Employer
                              </a>
                              <span className="transition duration-200 group-hover:rotate-180 px-2">
                                <GoChevronDown />
                              </span>
                            </div>
                            <div
                              className="invisible absolute z-50 flex w-full flex-col bg-white dark:bg-zinc-800 py-1 px-4 rounded-md text-gray-800 dark:text-gray-200  shadow-xl group-hover:visible">
                              <p
                                onClick={handleNavigateStart}
                                className="my-2 block border-b border-stone-100 py-1 hover:text-black md:mx-2 hover:text-yellow-500 ">
                                Log in
                              </p>

                              <p
                                onClick={handleNavigateStartRegister}
                                className="my-2 block border-b border-gray-100 py-1 hover:text-black md:mx-2 hover:text-yellow-500 ">
                                Register
                              </p>
                            </div>
                          </div>
                        </div>


                      </>
                    )}
                  </ul>
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
