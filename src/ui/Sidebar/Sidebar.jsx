import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../contexts/TokenManager";
import { HiBars3 } from "react-icons/hi2";
import Theme from "../../theme/ThemeDL"
import { GoChevronDown } from "react-icons/go";
import UserImg from "../../assets/user.png"

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
            <div className="md:mx-[56px] mx-[12px] flex gap-1">
              <div className="font-poppins md:text-[26px] text-[16px] font-bold uppercase text-zinc-700 dark:text-white">
                <Link to="/" className="flex h-2.5 font-poppins font-bold uppercase text-zinc-700 dark:text-white">
                  <span className="font-medium">Opportu</span> <p>Land</p> </Link>
              </div>
              {/* theme hissesi */}
              <div className="lg:flex hidden">
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
                          className={`lg:flex hidden text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/messages") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                            } hover:text-yellow-500 dark:hover:text-yellow-500`}
                        >
                          Messages
                        </Link>
                      </li>
                    )}

                    {/* admin hissesindeki dahsboard */}
                    {user || googleUser ? (
                      <>
                        <div className="group relative cursor-pointer ">
                          <button className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" type="button">
                            <span className="sr-only">Open user menu</span>
                            {user ?
                              <img className="w-8 h-8 rounded-full" src={UserImg} alt="user" />
                              :
                              <img className="w-8 h-8 rounded-full" src={googleUserData.avatar} alt="user" />
                            }
                          </button>
                          <div
                            className="invisible absolute right-0 z-50 flex w-20  flex-col bg-white dark:bg-zinc-800 rounded-md text-gray-800 dark:text-gray-200 shadow-xl group-hover:visible">
                            <div className="py-3 px-2 text-sm text-zinc-900 dark:text-white cursor-default">
                              <div className="truncate">{user ? userData.username : googleUserData.name}</div>
                            </div>
                            {user &&
                              <Link
                                to="edit"
                                className="my-2 block border-b border-stone-100 md:px-0 px-2 py-1 hover:text-black md:mx-2 hover:text-yellow-500">
                                Edit
                              </Link>
                            }
                            <Link
                              to="/"
                              onClick={logOut}
                              className="my-2 block border-b border-gray-100 md:px-0 px-2 py-1 hover:text-black md:mx-2 hover:text-yellow-500">
                              Log out
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : userCompany ? (
                      userDataCompany.admin ? (
                        <Link
                          to="/admin/default"
                          className={`ml-8 lg:flex hidden text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/admin/default") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                            } hover:text-yellow-500 dark:hover:text-yellow-500`}
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/admin/my-contests"
                          className={`ml-8 lg:flex hidden text-[16px] md:bg-transparent md:hover:bg-transparent duration-300 hover:cursor-pointer py-4 md:py-0 border-b md:border-none w-full md:w-fit text-center md:text-start ${isActive("/admin/my-contests") ? "text-yellow-500" : "text-zinc-700 dark:text-white"
                            } hover:text-yellow-500 dark:hover:text-yellow-500`}
                        >
                          Dashboard
                        </Link>
                      )

                    ) : (
                      <>
                        {/* button hissesi */}
                        <div className="flex items-center gap-3 px-2">
                          <div className="group relative cursor-pointer ">
                            <div className="flex items-center justify-between border-2 border-yellow-400 text-yellow-500 rounded-md hover:bg-yellow-400 hover:text-white duration-200">
                              <a className="flex gap-1 menu-hover py-[6px] text-base text-black md:mx-4 mx-1">
                                {/* Log in */}
                                <p>Log</p>
                                <p>in</p>
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
                              <a className="flex gap-1 menu-hover py-2 text-base text-black md:mx-2 px-1">
                                {/* For Employer */}
                                <p>For</p>
                                <p>Employer</p>
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
                <div>
                  {!isOpen && (
                    <HiBars3
                      onClick={() => setIsOpen((open) => !open)}
                      className={`lg:hidden text-2xl cursor-pointer dark:text-white ml-3`}
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
