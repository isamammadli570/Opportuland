import { useState } from 'react'
import { RiMoonFill, RiSunFill } from 'react-icons/ri';

function Theme() {
  const [darkmode, setDarkmode] = useState(false);
  return (
    <div onClick={() => {
      if (darkmode) {
        document.body.classList.remove("dark");
        setDarkmode(false);
      } else {
        document.body.classList.add("dark");
        setDarkmode(true);
      }
    }} className=" relative mt-[3px] h-[30px] w-[30px] md:w-[30px] xl:w-[30px] flex-grow items-center 
          justify-around gap-2 rounded-full px-2 py-2 shadow-xl shadow-shadow-500
        dark:!bg-zinc-800 dark:shadow-none md:flex-grow-0 md:gap-1 cursor-pointer xl:gap-2">
      <div
        className="text-gray-600"
        onClick={() => {
          setDarkmode(!darkmode);
          document.body.classList.toggle("dark");
        }}
      >
        {darkmode ? (
          <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white " />
        ) : (
          <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white " />
        )}
      </div>
    </div>
  )
}

export default Theme