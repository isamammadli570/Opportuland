import { useState, useEffect } from 'react'
import Table from './Table'
import Search from './Search'
import Loading from './Loading'  // Import the Loading component
import { useSearchParams } from 'react-router-dom'

export default function Main() {
  const [isOpen, setIsOpen] = useState(false)
  const [jobData, setJobData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  /* const [currentPage, setCurrentPage] = useState() */
  const [totalPages, setTotalPages] = useState()
  
  const [currentPage, setCurrentPage] = useState(1) 
  const [searchParams, setSearchParams] = useSearchParams(); 

  const currentPageFromURL = Number(searchParams.get("page")) || 1;
  
  useEffect(() => {
    const page = searchParams.get('page') || 1; 
    setCurrentPage(parseInt(page)); 
  }, [searchParams]);

  
  const onPageChange = (selectedPage) => {

    const page = selectedPage.selected + 1; // Selected page number
    setSearchParams({ page }); // Update URL with new page
    getJobsData(searchQuery, page); 
  };

  const openPopup = () => {
    setIsOpen(true)
  }
  const closePopup = () => {
    setIsOpen(false)
  }
  const getJobsData = async (searchText, page = currentPageFromURL ) => {
    setLoading(true);
    const abortController = new AbortController();
    const { signal } = abortController.signal;
  
    try {

      let endpoint = `${import.meta.env.VITE_HOST}/jobs/filter?page=${page}`;

      if (searchText) {
        const encodedSearchText = encodeURIComponent(searchText).trim();
        endpoint += `&q=${encodedSearchText}`;

      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const { data, totalPages } = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: response is not an array');
      }

      setJobData(data);
      setTotalPages(totalPages);
      setLoading(false);
      setSearchQuery(searchText);
      /* setCurrentPage(page); */
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Server Error:', error);
        alert(JSON.stringify(error));
        setLoading(false);
      }
    } finally {
      abortController.abort();
    }
  };
  // Jobs Data
  useEffect(() => {
    getJobsData('')
  }, [currentPageFromURL])

  /* const onPageChange = async (page) => {
    setCurrentPage(page)
    getJobsData(searchQuery, page)
    
  } */

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 duration-200">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
        >
          <div className="h-full">
            <div className='min-h-screen w-full relative'>
              {loading && (
                <div className='fixed inset-0 z-50'>
                  {loading ? <div className='fixed inset-0 z-50'> <Loading /> </div> : null}
                </div>
              )}
              <div className='relative h-full w-full z-1 px-6'>
                {isOpen && (
                  <div className='absolute top-0 left-0 w-full h-full bg-black/20'></div>
                )}
                <Search
                  onSearch={getJobsData}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onPageChange={onPageChange}
                />
                {!loading && (
                  <Table
                    isOpenPopup={isOpen}
                    closePopup={closePopup}
                    openPopup={openPopup}
                    jobData={jobData}
                    loading={loading}
                    onPageChange={onPageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    currentPageFromURL={currentPageFromURL}
                  />
                )}
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        </main>
      </div>
    </div>
  )
}
