import React from "react";
import Dropdown from "../../components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import navbarimage from "../../assets/img/layout/Navbar.png";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "../../assets/img/avatars/avatar4.png";
import Theme from "../../theme/ThemeDL";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center  rounded-xl bg-white/10 p-2 backdrop-blur-xl ">
      <div className="ml-[6px]">
        {/* <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-zinc-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-zinc-700 hover:text-zinc-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-zinc-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div> */}
        <p className="shrink text-[33px] capitalize text-zinc-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-zinc-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div>
        <Theme />
      </div>
    </nav>
  );
};

export default Navbar;
