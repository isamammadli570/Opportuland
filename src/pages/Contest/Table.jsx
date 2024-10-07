import { useState, useEffect, useContext } from 'react'
import AuthContext from '../../contexts/TokenManager'
import { Link } from 'react-router-dom'
import Loading from '../../ui/Loading/Loading'
import axios from 'axios'
import Card from "../../components/card";

export default function Table({

  jobData,
  loading,
  onPageChange,
  currentPage,
  totalPages,
}) {
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [showMoreMap, setShowMoreMap] = useState(new Map())
  const { getAccessTokenFromMemory } = useContext(AuthContext)
  const [historyLog, setHistoryLog] = useState([])
  const maxSkillsToShow = 3

  useEffect(() => {
    const token = getAccessTokenFromMemory();
    if (token) {
      axios
        .get(`${import.meta.env.VITE_HOST}/swipedHistory/getHistoryLog`, {
          headers: {
            authorization: 'Bearer ' + token,
          },
        })
        .then((response) => {
          setHistoryLog(response?.data?.swipedItem);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      // Handle case when token is not available
      setHistoryLog([]); // Set an empty array or handle as needed
    }
  }, []);

  const visiblePageNumbers = () => {
    const totalVisiblePages = 10
    const pagesBeforeCurrent = Math.floor(totalVisiblePages / 2)
    let startPage = Math.max(currentPage - pagesBeforeCurrent, 1)
    let endPage = Math.min(startPage + totalVisiblePages - 1, totalPages)

    if (endPage - startPage + 1 < totalVisiblePages) {
      startPage = Math.max(endPage - totalVisiblePages + 1, 1)
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    )
  }

  return (

    <>
      {/* //large table */}

      <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto mt-5"}>
        {/* <div className='bg-white  rounded-sm border mb-4 border-gray-200 p-4 w-full my-5'> */}
        <div className='mt-7 w-full'>
          <div className='w-full grid gap-4 '>
            <div className='bg-[#bbc1c98a] py-3 px-2.5 text-sm '>
              <div className='grid grid-cols-8'>
                <h3
                  className='col-span-2 font-bold '

                >
                  Contest
                </h3>
                <h3
                  className='col-span-1 font-bold '

                >
                  Company
                </h3>
                {/* <h3
                    className='col-span-1 font-bold '
                    
                  >
                    Skills
                  </h3> */}
                <h3
                  className=' col-span-1 font-bold '

                >
                  Award
                </h3>
                <h3
                  className=' col-span-1 font-bold '

                >
                  Location
                </h3>
                {/* <h3
                    className=' col-span-1 font-bold '
                    
                  >
                    Sumbissions
                  </h3> */}
                <h3
                  className=' col-span-1 font-bold '

                >
                  Deadline
                </h3>
                <h3
                  className=' col-span-1 font-bold '

                >
                  Applied
                </h3>
                <h3
                  className=' col-span-1 font-bold '

                >
                  See More
                </h3>
              </div>
            </div>
            <div>
              {loading ? (
                <div className='w-full flex justify-center'>
                  {loading ? <div className='fixed inset-0 z-50'> <Loading /> </div> : null}
                </div>
              ) : (
                jobData?.map((job, index) => {
                  const showMore = showMoreMap.get(job?._id) || false
                  const { stack_list } = job

                  const visibleSkills = showMore
                    ? stack_list
                    : stack_list?.slice(0, maxSkillsToShow)
                  const remainingSkills = stack_list?.slice(maxSkillsToShow)

                  const cleanJobName = job?.contestName?.replace(/[/\\]/g, '');

                  return (
                    <div
                      key={index}
                      className=' py-3 px-2.5 text-sm grid grid-cols-8  items-center  hover:bg-slate-300/50 duration-300'
                    >
                      <h3 className='cursor-pointer col-span-2 text-black/70 font-medium'>
                        {job?.contestName}
                      </h3>
                      <h3 className='col-span-1 text-black/70 font-medium'>
                        {job?.name}
                      </h3>
                      <h3 className='col-span-1 text-black/70 font-medium'>
                        {job?.awards}
                      </h3>
                      <h3 className='col-span-1 text-black/70 font-medium whitespace-pre-line'>
                        {job?.locations}
                      </h3>
                      {/* <h3 className='col-span-1 text-black/70 font-medium whitespace-pre-line'>
                          {job?.submissions || 0}
                        </h3> */}
                      <h3 className='col-span-1 text-black/70 font-medium whitespace-pre-line'>
                        {job?.deadline.split('T')[0]}
                      </h3>

                      <h3 className='col-span-1 text-green-500 font-medium'>
                        {historyLog?.map((item) =>
                          item?.jobId === job._id ? (
                            <p key={item._id}>Applied</p>
                          ) : null
                        )}
                      </h3>

                      <h3 className='col-span-1'>

                        <Link
                          to={`/contest/${cleanJobName}/${job?._id}`}
                          target='_blank'
                        >
                          <button
                            className=' w-36 px-3 py-2 bg-yellow-500 text-white font-bold rounded-md duration-200 hover:bg-yellow-600 '
                          >
                            View
                          </button>
                        </Link>
                      </h3>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        {/* </div> */}
      </Card>

      {/* pagination */}
      <nav className='flex justify-center my-4'>
        <ul className='pagination flex flex-row '>
          <li
            className={`${currentPage === 1 ? 'disabled' : ''
              } mx-2 px-2 flex bg-slate-900 text-white rounded-md`}
          >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              className='pagination-link mx-2 p-2 text-gray-600'
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {visiblePageNumbers().map((page) => (
            <li
              key={page}
              className={`${currentPage === page ? 'bg-yellow-500' : ''
                } mx-2 px-2 flex bg-slate-900  text-white rounded-md`}
            >
              <button
                onClick={() => onPageChange(page)}
                className={`${currentPage === page ? 'text-white' : 'text-gray-600'
                  } pagination-link`}

              >
                {page}
              </button>
            </li>
          ))}

          <li
            className={`${currentPage === totalPages ? 'disabled' : ''
              } mx-2 px-2 flex bg-slate-900 text-white rounded-md`}
          >
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className='pagination-link text-gray-600'
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}
