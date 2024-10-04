import { useState, useEffect, useContext } from 'react'
import AuthContext from '../signin/TokenManager'
import { Link} from 'react-router-dom'
import Loading from './Loading'
import axios from 'axios'
import Card from "../components/card";

import ReactPaginate from "react-paginate"
import { MdNavigateNext } from 'react-icons/md'
import { GrFormPrevious } from "react-icons/gr";

export default function Table({
  jobData,
  loading,
  onPageChange,
  /* currentPage, */
  totalPages,
  currentPageFromURL
}) {
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [showMoreMap, setShowMoreMap] = useState(new Map())
  const { getAccessTokenFromMemory } = useContext(AuthContext)
  const [historyLog, setHistoryLog] = useState([])
  const maxSkillsToShow = 3

  //description show more
  const toggleDescription = (jobId) => {
    setShowMoreMap(new Map(showMoreMap.set(jobId, !showMoreMap.get(jobId))))
  }
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

  //size
  // useEffect(() => {
  //   function handleResize() {
  //     setWindowWidth(window.innerWidth)
  //   }
  //   window.addEventListener('resize', handleResize)
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  /* const visiblePageNumbers = () => {
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
  } */

  return (

    <>
      <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto mt-5  "}>
        {/* <div className='bg-white  rounded-sm border mb-4 border-gray-200 p-4 w-full my-5'> */}
        <div className='mt-7 w-full '>
          <div className='w-full grid gap-4 '>
            <div className='bg-[#bbc1c98a] py-3 px-2.5 text-sm '>
              <div className='grid grid-cols-8'>
                <h3
                  className='col-span-3 font-bold '
                >
                  Vacancy
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
                  className=' col-span-1 font-bold '>Required Experience</h3>
                <h3
                  className=' col-span-1 font-bold '
                >
                  Location
                </h3>
                {/* <h3
                    className=' col-span-1 font-bold '

                  >
                    Salary
                  </h3> */}
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
                  const { skills } = job

                  const visibleSkills = showMore
                    ? skills
                    : skills?.slice(0, maxSkillsToShow)
                  const remainingSkills = skills?.slice(maxSkillsToShow)

                  const cleanJobName = job?.job_name?.replace(/[/\\]/g, '');

                  return (
                    <div
                      key={index}
                      className=' py-3 px-2.5 text-sm grid grid-cols-8  items-center  hover:bg-slate-300/50 duration-300'
                    >
                      <h3 className='cursor-pointer col-span-3 text-black/70 font-medium'>
                        {job?.job_name}
                      </h3>
                      <h3 className='col-span-1 text-black/70 font-medium'>
                        {job?.company}
                      </h3>

                      {/* <h3 className='col-span-1 text-black/70 font-medium'>
                          <ul>
                            {visibleSkills?.map((skill, index) => (
                              <li key={index}>{skill}</li>
                            ))}
                          </ul>

                          {!showMore && remainingSkills?.length > 0 && (
                            <span
                              className='cursor-pointer text-yellow-500 hover:underline'
                              onClick={() => toggleDescription(job?._id)}
                            >
                              ... Read More
                            </span>
                          )}

                          {showMore && (
                            <span
                              className='cursor-pointer text-yellow-500 hover:underline'
                              onClick={() => toggleDescription(job?._id)}
                            >
                              ...Read Less
                            </span>
                          )}
                        </h3> */}
                      <h3 className='col-span-1 text-black/70 font-medium'>
                        {(() => {
                          if (job?.required_experience_years === null) {
                            return 'Not Available';
                          } else if (job?.required_experience_years === 0 || job?.required_experience_years === 1) {
                            return `${job.required_experience_years} year`;
                          } else if (job?.required_experience_years > 1) {
                            return `${job.required_experience_years} years`;
                          } else {
                            return 'Not Available'; // For any other unexpected case
                          }
                        })()}
                      </h3>
                      <h3 className='col-span-1 text-black/70 font-medium whitespace-pre-line'>
                        {job?.location}
                      </h3>
                      {/* <h3 className='col-span-1 text-black/70 font-medium whitespace-pre-line'>
                          {job?.salary_range}
                        </h3> */}

                      <h3 className='col-span-1 text-green-500 font-medium'>
                        {historyLog?.map((item) =>
                          item?.jobId === job._id ? (
                            <p key={item._id}>Applied</p>
                          ) : null
                        )}
                      </h3>

                      <h3 className='col-span-1'>

                        <Link
                          to={`/job/${cleanJobName}/${job?._id}`}
                          target='_blank'
                        >
                          <button
                            className='text-white w-36 px-3 py-2 bg-yellow-500font-bold rounded-md bg-yellow-500 duration-200 hover:bg-yellow-600'
                          // style={{ background: theme.yellow }}
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
      {/* <div className='bg-white rounded-sm border border-gray-200 p-4 w-full my-5'>
          <div className='mt-3 w-full'>
            {loading ? (
              {loading ? <div className='fixed inset-0 z-50'> <Loading /> </div> : null}
            ) : (
              jobData?.map((job, index) => {
                const showMore = showMoreMap.get(job._id) || false
                const { skills } = job
                const visibleSkills = showMore
                  ? skills
                  : skills?.slice(0, maxSkillsToShow)
                const remainingSkills = skills?.slice(maxSkillsToShow)
                return (
                  <div
                    key={index}
                    className='w-full flex  justify-around py-6 border-t-2 border-gray-400/50 border-solid'
                  >
                    <div className='w-1/2 bg-white'>
                      <div className='flex flex-col gap-5 '>
                        <h3 className='font-semibold'>Vacancy :</h3>
                        <h3 className='font-semibold'>Company :</h3>
                        <h3 className='font-semibold'>Skills :</h3>
                        <h3 className='font-semibold'>See more :</h3>
                      </div>
                    </div>
                    <div className='w-full flex '>
                      <div className='flex flex-col gap-5'>
                        <h3 className='cursor-pointer text-sm mt-[5px]  text-black/70 font-medium'>
                          {job?.job_name}
                        </h3>
                        <h3 className='text-sm mt-[5px]  text-black/70 font-medium'>
                          {job?.company}
                        </h3>
                        <h3 className='text-sm mt-[5px]  text-black/70 font-medium'>
                          <ul>
                            {visibleSkills?.map((skill, index) => (
                              <li key={index}>{skill}</li>
                            ))}
                          </ul>

                          {!showMore && remainingSkills?.length > 0 && (
                            <span
                              className='cursor-pointer text-yellow-500 hover:underline'
                              onClick={() => toggleDescription(job?._id)}
                            >
                              ... Read More
                            </span>
                          )}

                          {showMore && (
                            <span
                              className='cursor-pointer text-yellow-500 hover:underline'
                              onClick={() => toggleDescription(job?._id)}
                            >
                              ...Read Less
                            </span>
                          )}
                        </h3>
                        <h3 className='text-sm mt-[5px]  text-black/70 font-medium'>
                          <button
                            className=' text-white w-36 px-3 py-2 rounded-sm'
                            style={{ background: theme.yellow }}
                          >
                            <Link to={`/job/${job?.job_name}/${job?._id}`}>
                              {' '}
                              View
                            </Link>
                          </button>
                        </h3>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div> */}


      {/* pagination */}
      {/* <nav className='flex justify-center my-4'>
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

              // 'pagination-link text-gray-600'
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
      </nav> */}

      <div className='mt-4 flex justify-center'>
        <ReactPaginate
          activeClassName={'item active '}
          previousClassName={"item previous"}
          nextClassName={"item next "}
          pageClassName={'item pagination-page '}
          containerClassName={'pagination'}
          disabledClassName={'disabled-page'}
          previousLabel={<GrFormPrevious style={{ fontSize: 18, width: 150 }} />}
          nextLabel={<MdNavigateNext style={{ fontSize: 18, width: 150 }} />}
          breakLabel={'. . .'}
          pageCount={totalPages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={7}
          onPageChange={onPageChange}
          forcePage={currentPageFromURL - 1}
        />
      </div>
    </>
  )
}
