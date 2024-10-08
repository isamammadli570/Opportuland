import SearchIcon from '../../assets/icons/search.svg'

export default function Search({
  onSearch,
  searchQuery,
  setSearchQuery,
  /* onPageChange, */
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
    </div>
  )
}
