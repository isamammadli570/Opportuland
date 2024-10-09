import { useState, useEffect, useContext } from 'react'
import AuthContext from '../../contexts/TokenManager'
import { Link } from 'react-router-dom'
import Loading from '../../ui/Loading/Loading'
import axios from 'axios'
import Card from "../../components/card";
import ReactPaginate from "react-paginate"
import { MdNavigateNext } from 'react-icons/md'
import { GrFormPrevious } from "react-icons/gr";

export default function Table({
  jobData,
  loading,
  onPageChange,
  totalPages,
  currentPageFromURL
}) {
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
      setHistoryLog([]);
    }
  }, []);
  return (
    <>
      <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto mt-5  "}>
        <div className='mt-7 w-full '>
          <div className='w-full grid gap-4 '>
            <div className='bg-[#bbc1c98a] py-3 px-2.5 text-sm rounded-xl'>
              <div className='grid grid-cols-8'>
                <h3 className=' col-span-3 font-bold '>Vacancy</h3>
                <h3 className=' col-span-1 font-bold '>Company</h3>
                <h3 className=' col-span-1 font-bold '>Required Experience</h3>
                <h3 className=' col-span-1 font-bold '>Location</h3>
                <h3 className=' col-span-1 font-bold '>Applied</h3>
                <h3 className=' col-span-1 font-bold '>See More</h3>
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
                        /* target='_blank' */
                        >
                          <button
                            className='text-white lg:w-32 md:w-24 w-16 px-3 py-2 bg-yellow-500font-bold rounded-md
                            bg-yellow-500 duration-200 hover:bg-yellow-600'
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
      </Card>

      <div className='mt-4 flex justify-center'>
        <ReactPaginate
          activeClassName={'flex justify-center items-center w-[30px] h-[30px] text-zinc-700 border border-zinc-700 rounded-full'}
          previousClassName={"flex justify-center items-center w-[30px] h-[30px] text-zinc-700 border-r border-zinc-900 absolute left-0 px-10"}
          nextClassName={"flex justify-center items-center w-[30px] h-[30px] text-zinc-700 border-l border-zinc-900 absolute right-0 px-10"}
          pageClassName={'flex justify-center items-center w-[30px] h-[30px] text-zinc-700 '}
          containerClassName={'flex items-center bg-zinc-300 w-[700px] h-[40px] justify-center flex-row list-none relative rounded-md'}
          disabledClassName={'text-gray-300'}
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
