import { Link } from 'react-router-dom'

export default function Error() {

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 duration-200">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
        >
          <div className="h-full">
            <>
              <div className=" min-h-screen flex flex-col items-center justify-center">
                <h1 className=" text-indigo-500 text-5xl sm:text-7xl font-extrabold  tracking-wider"> 404</h1>
                <p className="  text-indigo-500 text-center font-semibold text-lg  my-10">The page you are attempting to reach is currently not available. This may be because the <br /> page does not exist or has been moved.</p>
                <Link to="/" className="cursor-pointer text-white font-bold border-2 border-solid bg-indigo-500 rounded-md px-6 py-3">Back Home </Link>
              </div>
            </>
          </div>
        </main>
      </div>
    </div>

  )
}
