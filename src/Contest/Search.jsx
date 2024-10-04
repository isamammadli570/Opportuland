import { theme } from '../theme/theme'
import SearchIcon from '../assets/icons/search.svg'

export default function Search({
  onSearch,
  searchQuery,
  setSearchQuery,
  onPageChange,
}) {
  const handleSearchClick = () => {
    onSearch(searchQuery)
    onPageChange(1)
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick()
    }
  }
  return (
    <div className='mt-6  flex items-center justify-between sm:w-2/3 w-full m-auto'>
      <input
        type='text'
        className='rounded-md px-3 py-2 w-full bg-navy-900 dark:bg-gray-400 dark:placeholder:text-zinc-800 duration-200 placeholder:text-zinc-300 text-white outline-none'
        placeholder='Search job...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className='ml-2 bg-navy-900 dark:bg-gray-400 dark:placeholder:text-zinc-800 placeholder:text-zinc-300 duration-200  text-white font-bold py-2 px-4 rounded-full focus:outline-none '
        type='button'
        onClick={handleSearchClick}
      >
        <img src={SearchIcon} className='w-6 h-6' alt='search' />
      </button>
    </div>
  )
}
