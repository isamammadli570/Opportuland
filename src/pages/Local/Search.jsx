import { GoChevronDown } from 'react-icons/go'
import SearchIcon from '../../assets/icons/search.svg'

export default function Search({
  onSearch,
  searchQuery,
  setSearchQuery,
  handleGetPosition

}) {
  const handleSearchClick = () => {
    onSearch(searchQuery)
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick()
    }
  }
  return (
    <div className='mt-6 flex items-center justify-between sm:w-2/3 w-full m-auto '>
      <input
        type='text'
        className='rounded-md px-3 py-2 w-full bg-zinc-900 dark:bg-zinc-400 dark:placeholder:text-zinc-800 placeholder:text-zinc-300 text-white outline-none duration-200 '
        placeholder='Search job...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown} />
      <button
        className=' ml-2  bg-zinc-900 dark:bg-zinc-400 dark:placeholder:text-zinc-800 placeholder:text-zinc-300 text-white font-bold py-2 px-4 rounded-full duration-200 focus:outline-none '
        type='button'
        onClick={handleSearchClick}
      >
        <img src={SearchIcon} className='w-6 h-6' alt='search' />
      </button>
      <div className="group relative cursor-pointer px-1">
        <div className="text-white bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-400 dark:hover:bg-zinc-600 rounded-lg text-sm text-center inline-flex items-center">
          <a className="flex gap-1 menu-hover py-[6px] text-base text-black md:mx-4 mx-1">
            Filter
          </a>
          <span className="transition duration-200 group-hover:rotate-180 px-2">
            <GoChevronDown />
          </span>
        </div>
        <div
          className="invisible absolute z-10 flex w-full flex-col bg-white dark:bg-zinc-800 rounded-md text-gray-800 dark:text-gray-200 shadow-xl group-hover:visible">
          <p
            className="my-2 block border-b border-stone-100 md:px-0 px-2 py-1 hover:text-black md:mx-2 hover:text-yellow-500">
            All
          </p>
          <button
            onClick={handleGetPosition}
            className="my-2 block border-b border-gray-100 md:px-0 px-2 py-1 hover:text-black md:mx-2 hover:text-yellow-500">
            Current Location
          </button>
        </div>
      </div>
    </div>
  )
}
