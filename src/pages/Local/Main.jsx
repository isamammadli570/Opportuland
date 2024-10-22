import { useState, useEffect } from 'react'
import Table from './Table'
import Search from './Search'
import Loading from '../../ui/Loading/Loading'
import { useSearchParams } from 'react-router-dom'
import { useGeolocation } from "../../hooks/useGeoLocation"

export default function Main() {
  const [jobData, setJobData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [totalPages, setTotalPages] = useState()
  const [country, setCountry] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPageFromURL = Number(searchParams.get("page")) || 1;
  const currentKeywordFromURL = searchParams.get("keyword") || ''

  /* const {
    getPosition,
  } = useGeolocation(); */

  /* useEffect(
    function () {
      getPosition()
    }, []
  ) */

  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  const decodeLocation = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
      );
      if (!res.ok) throw new Error("Failed to fetch location data");

      const data = await res.json();
      console.log("Full :", data);

      if (data && data.address && data.address.country) {
        return data.address.country;
      } else {
        throw new Error("Country not found in the response");
      }
    } catch (error) {
      console.error("Error decoding location:", error);
      return null;
    }
  };

  const handleGetPosition = async () => {
    getPosition(); 
  };

  useEffect(() => {
    if (geoLocationPosition) {
      const { lat, lng } = geoLocationPosition;
      console.log("Geolocation position:", lat, lng);

      decodeLocation(lat, lng).then((decodedCountry) => {
        if (decodedCountry) {
          setCountry(decodedCountry);
          console.log("Your country:", decodedCountry);
        }
      });
    }
  }, [geoLocationPosition]);

  useEffect(() => {
    const page = searchParams.get('page') || 1
    const keyword = searchParams.get('keyword') || ''
    setCurrentPage(parseInt(page))
    setSearchQuery(keyword)
  }, [searchParams])

  const onPageChange = (selectedPage) => {
    const page = selectedPage.selected + 1;
    const params = { page };

    if (searchQuery) {
      params.keyword = searchQuery
    }

    setSearchParams(params);
    getJobsData(searchQuery, page);
  };

  const onSearch = () => {
    const page = 1
    const params = { page }

    if (searchQuery) {
      params.keyword = searchQuery
    } else {
      params.keyword = undefined
    }

    setSearchQuery(searchQuery)
    setSearchParams(params)
    getJobsData(searchQuery, page)
  }

  const getJobsData = async (searchText, page = 1) => {
    setLoading(true)

    try {
      let endpoint = `${import.meta.env.VITE_HOST}/jobsLocal/filter?page=${page}`

      if (searchText) {
        const encodedSearchText = encodeURIComponent(searchText).trim();
        endpoint += `&q=${encodedSearchText}`;
      }

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        throw new Error(`HTTP Error! Status: ${res.status}`)
      }

      const { data, totalPages } = await res.json()

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format: response is not an array')
      }

      setJobData(data)
      setTotalPages(totalPages || 0)
      setLoading(false)

    } catch (error) {
      console.error('Server Error:', error)
      alert(JSON.stringify(error))
      setLoading(false)
    }
  }

  useEffect(() => {
    getJobsData(currentKeywordFromURL, currentPageFromURL)
  }, [currentKeywordFromURL, currentPageFromURL])

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-zinc-900 duration-200">
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
                <div className='flex justify-center items-center'>
                  <Search
                    onSearch={onSearch}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleGetPosition={handleGetPosition}
                  />
                </div>
                {!loading && (
                  <Table
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
          </div>
        </main>
      </div>
    </div>
  )
}
