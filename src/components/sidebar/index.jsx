/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";

import SidebarCard from "../../components/sidebar/componentsrtl/SidebarCard";
import routes from "../../routes.jsx";
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../signin/TokenManager';


const Sidebar = ({ open, onClose, user }) => {
  const { logOut } = useContext(AuthContext);
  const filteredRoutes = user.admin ? routes : routes.filter(route => route.name !== 'Admin Dashboard');
  console.log(filteredRoutes)
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
        <Link to="/" className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
        <span class="font-medium">Opportu</span> Land</Link>
        </div>
      </div>
      <div class="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={filteredRoutes} />
      </ul>
{/* Nav logOut */}
      <div className="mt-4 px-4">
        <button
          onClick={logOut}
          className="w-full py-2 px-4 text-white font-semibold rounded-md transition duration-200 sm:mt-10 hover:cursor-pointer bg-orange-500 hover:bg-orange-600"
        >
          Sign Out
        </button>
      </div>

      {/* Free Horizon Card */}


      {/* Nav item end */}
    </div>
  );
};
/*
      <div className="flex justify-center">
        <SidebarCard />
      </div>
*/

export default Sidebar;
