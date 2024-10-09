import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../ui/Loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCaretUp, faLink } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../contexts/TokenManager';

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/accordion"
import Modal from '../../ui/Modal/Modal';

const dummyToken = "asd";

const Feed = () => {
  const { submissionId } = useParams();
  const { getAccessTokenFromMemory, getAccessTokenFromMemoryCompany, getAccessTokenFromMemoryGoogle } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [mediaIndices, setMediaIndices] = useState({});
  const [expandedMessages, setExpandedMessages] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageRef = useRef(1);

  const [userCheck, setUserCheck] = useState("");
  const [googleUserCheck, setGoogleUserCheck] = useState("")

  const [modal, setModal] = useState(false)
  const toggleModal = () => {
    setModal(!modal)
  }

  useEffect(() => {
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUserCheck(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user data found");
    }
  }, []);

  useEffect(() => {
    const googleUserDataString = localStorage.getItem("googleUser");

    if (googleUserDataString) {
      try {
        const googleUserData = JSON.parse(googleUserDataString);
        setGoogleUserCheck(googleUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user data found");
    }
  }, []);

  const fetchSubmissions = async (page) => {
    setLoading(true);
    try {
      let response;
      if (submissionId) {
        response = await axios.get(
          `${import.meta.env.VITE_HOST}/contests/submission/${submissionId}`,
          { headers: { authorization: `Bearer ${dummyToken}` } }
        );
        const submission = response.data;
        console.log("Fetched submission:", submission);

        const fileResponse = await axios.post(
          `${import.meta.env.VITE_HOST}/contests/fileUrls`,
          { submissionId: submission._id },
          { headers: { authorization: `Bearer ${dummyToken}` } }
        );
        const filesWithUrls = fileResponse.data.fileUrls
          .filter(file => file.filename.match(/\.(jpg|jpeg|png|gif|mp4)$/i))
          .map(file => ({
            filename: file.filename,
            url: file.url
          }));
        setSubmissions([{ ...submission, files: filesWithUrls }]);
        setMediaIndices({ 0: 0 });

        fetchUserVotes([submission._id]);
      } else {
        console.log("Fetching feed data, page:", page);
        response = await axios.post(
          `${import.meta.env.VITE_HOST}/contests/feed`,
          { page, limit: 10 },
          { headers: { authorization: `Bearer ${dummyToken}` } }
        );
        const { submissions: fetchedSubmissions, totalPages: fetchedTotalPages } = response.data;
        console.log("Fetched feed data:", response.data);

        const submissionsWithFileUrls = await Promise.all(fetchedSubmissions.map(async (submission) => {
          const fileResponse = await axios.post(
            `${import.meta.env.VITE_HOST}/contests/fileUrls`,
            { submissionId: submission._id },
            { headers: { authorization: `Bearer ${dummyToken}` } }
          );
          const filesWithUrls = fileResponse.data.fileUrls
            .filter(file => file.filename.match(/\.(jpg|jpeg|png|gif|mp4)$/i))
            .map(file => ({
              filename: file.filename,
              url: file.url
            }));
          return { ...submission, files: filesWithUrls };
        }));

        console.log("Fetched submissions with file URLs:", submissionsWithFileUrls);

        setSubmissions(submissionsWithFileUrls);
        const indices = submissionsWithFileUrls.reduce((acc, _, index) => {
          acc[index] = 0;
          return acc;
        }, {});
        setMediaIndices(indices);

        setTotalPages(fetchedTotalPages);
        setCurrentPage(page);
        console.log("Total pages:", fetchedTotalPages);

        const itemIds = submissionsWithFileUrls.map(submission => submission._id);

        fetchUserVotes(itemIds);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };

  const fetchUserVotes = async (itemIds) => {
    const token = getAccessTokenFromMemory() || getAccessTokenFromMemoryCompany() || getAccessTokenFromMemoryGoogle();
    if (token) {
      try {
        const voteResponse = await axios.post(
          `${import.meta.env.VITE_HOST}/contests/vote`,
          { itemIds },
          { headers: { authorization: `Bearer ${token}` } }
        );
        console.log("Fetched user votes:", voteResponse.data);

        const userVotesMap = {};
        voteResponse.data.forEach(vote => {
          userVotesMap[vote.itemId] = true;
        });
        setUserVotes(prevUserVotes => ({ ...prevUserVotes, ...userVotesMap }));
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    }
  };

  useEffect(() => {
    fetchSubmissions(pageRef.current);
  }, [submissionId, getAccessTokenFromMemory, getAccessTokenFromMemoryCompany, getAccessTokenFromMemoryGoogle]);

  const handleNextMedia = (submissionIndex) => {
    setMediaIndices((prevIndices) => ({
      ...prevIndices,
      [submissionIndex]: (prevIndices[submissionIndex] + 1) % submissions[submissionIndex].files.length
    }));
  };

  const handlePreviousMedia = (submissionIndex) => {
    setMediaIndices((prevIndices) => ({
      ...prevIndices,
      [submissionIndex]: (prevIndices[submissionIndex] - 1 + submissions[submissionIndex].files.length) % submissions[submissionIndex].files.length
    }));
  };

  const toggleMessageExpansion = (index) => {
    setExpandedMessages((prevExpandedMessages) => ({
      ...prevExpandedMessages,
      [index]: !prevExpandedMessages[index]
    }));
  };

  /* const navigate = useNavigate(); */
  const handleVote = async (submissionId) => {


    const token = getAccessTokenFromMemory() || getAccessTokenFromMemoryCompany() || getAccessTokenFromMemoryGoogle();
    /* if (!token) {
      alert('Please log in to vote');
      navigate("/user-login")
    } */

    try {
      console.log(`Handling vote for submission ID: ${submissionId}`);
      let action = userVotes[submissionId] ? 'removeVote' : 'upvote';
      const response = await axios.post(`${import.meta.env.VITE_HOST}/contests/vote`, { itemId: submissionId, action }, {
        headers: { authorization: `Bearer ${token}` }
      });

      setUserVotes(prevVotes => ({
        ...prevVotes,
        [submissionId]: action === 'upvote'
      }));
      setSubmissions(prevSubmissions => prevSubmissions.map(submission =>
        submission._id === submissionId ? { ...submission, upvoteCount: response.data.upvoteCount } : submission
      ));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      pageRef.current = newPage;
      fetchSubmissions(newPage);
    }
  };

  const truncateMessage = (message, limit) => {
    let truncated = '';
    let count = 0;
    const paragraphs = message.split('\n').filter(paragraph => paragraph.trim() !== '');

    for (let paragraph of paragraphs) {
      if (count + paragraph.length > limit) {
        truncated += paragraph.slice(0, limit - count) + '...';
        break;
      } else {
        truncated += paragraph + '\n\n';
        count += paragraph.length;
      }
    }

    return truncated.trim();
  };

  const formatFullname = (fullname) => {
    return fullname
      .split(' ')
      .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
      .join(' ');
  };

  const renderMessageWithLinks = (message) => {
    if (typeof message !== 'string') return message;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500  ">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const copyLinkToClipboard = (submissionId) => {
    const link = `${window.location.origin.replace('localhost:5000', 'localhost:5173')}/${submissionId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  };

  //pagination
  const generatePageButtons = () => {
    const pageButtons = [];
    const maxPageButtons = 10;
    const halfMaxPageButtons = Math.floor(maxPageButtons / 2);

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`px-4 py-2 ${currentPage === i ? 'bg-yellow-500 text-white' : 'bg-yellow-300 text-black'}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      let startPage = currentPage - halfMaxPageButtons;
      let endPage = currentPage + halfMaxPageButtons;

      if (startPage < 1) {
        startPage = 1;
        endPage = maxPageButtons;
      } else if (endPage > totalPages) {
        startPage = totalPages - maxPageButtons + 1;
        endPage = totalPages;
      }

      if (startPage > 1) {
        pageButtons.push(
          <button
            key={1}
            className={`px-4 py-2 ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-yellow-300 text-black'}`}
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        );
        if (startPage > 2) {
          pageButtons.push(<span key="ellipsis-start" className="px-2">...</span>);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`px-4 py-2 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-yellow-300 text-black'}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageButtons.push(<span key="ellipsis-end" className="px-2">...</span>);
        }
        pageButtons.push(
          <button
            key={totalPages}
            className={`px-4 py-2 ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-yellow-300 text-black'}`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }
    return pageButtons;
  };

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:bg-zinc-900 duration-200">
        <main className="mx-[12px] h-full flex-none transition-all md:pr-2">
          <div className="h-full">
            <div className="min-h-screen w-full relative">
              {loading && (
                <div className='fixed inset-0 z-50'>
                  <Loading />
                </div>
              )}
              <div className='relative h-full w-full z-1 px-6'>
                {!loading && submissions.length > 0 && submissions.map((submission, submissionIndex) => {
                  const cleanJobName = submission.contestName?.replace(/[/\\]/g, '');

                  return (
                    <div
                      key={submissionIndex}
                      className="bg-white dark:bg-zinc-700 duration-200 shadow rounded-lg p-6 mb-4 ml-6">
                      <div className="flex items-center mb-2">
                        <h2 className="md:text-xl font-bold text-zinc-900 dark:text-white">{formatFullname(submission.fullname)}</h2>
                        {submission.userLinkedIn && (
                          <a href={submission.userLinkedIn} target="_blank" rel="noopener noreferrer" className="ml-2 text-base font-medium dark:text-zinc-300 text-zinc-600">
                            <svg className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.762 0-5 2.238-5 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.762-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.792-1.75-1.767s.784-1.767 1.75-1.767 1.75.792 1.75 1.767-.784 1.767-1.75 1.767zm13.5 12.268h-3v-5.5c0-1.379-1.121-2.5-2.5-2.5s-2.5 1.121-2.5 2.5v5.5h-3v-11h3v1.643c.825-.89 2.021-1.643 3.5-1.643 2.481 0 4.5 2.019 4.5 4.5v6.5z" />
                            </svg>
                          </a>
                        )}
                        <span className="mx-2 text-zinc-500 dark:text-zinc-300">|</span>
                        <span className="text-zinc-900 text-sm  dark:text-white">{submission.companyName}</span>
                        <span className="mx-1 text-zinc-500 dark:text-zinc-300">•</span>
                        <a href={`/contest/${cleanJobName}/${submission.jobId}`} className="text-blue-500 text-sm">{cleanJobName}</a>
                      </div>

                      <div className="flex flex-row justify-between mt-4">
                        <div>
                          {/* <div className="text-zinc-700 dark:text-zinc-300 duration-200">
                            {expandedMessages[submissionIndex] ? (
                              <>
                                {submission.message.split('\n').map((paragraph, index) => (
                                  <React.Fragment key={index}>
                                    {renderMessageWithLinks(paragraph)}
                                    <br />
                                  </React.Fragment>
                                ))}
                                <button
                                  className="text-blue-500 ml-2"
                                  onClick={() => toggleMessageExpansion(submissionIndex)}
                                >
                                  Show less
                                </button>
                              </>
                            ) : (
                              <>
                                {renderMessageWithLinks(truncateMessage(submission.message, 200))}
                                {submission.message.length > 200 && (
                                  <>
                                    <button
                                      className="text-blue-500 ml-2"
                                      onClick={() => toggleMessageExpansion(submissionIndex)}
                                    >
                                      Show more
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div> */}

                          <Accordion className='dark:text-white' allowToggle>
                            <AccordionItem>
                              <h2>
                                <AccordionButton>
                                  <div >
                                    About
                                  </div>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h2>
                              <AccordionPanel pb={4}>
                                {submission.message.split('\n').map((paragraph, index) => (
                                  <React.Fragment key={index}>
                                    <div className='md:w-full w-52'>

                                      {renderMessageWithLinks(paragraph)}
                                    </div>
                                    <br />
                                  </React.Fragment>
                                ))}
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>

                          {submission.files && submission.files.length > 0 && (
                            <div className="mt-4">
                              <div className="relative w-full max-w-lg h-96" >
                                {submission.files[mediaIndices[submissionIndex]] && (
                                  <>
                                    {submission.files[mediaIndices[submissionIndex]].filename.endsWith('.jpg') ||
                                      submission.files[mediaIndices[submissionIndex]].filename.endsWith('.jpeg') ||
                                      submission.files[mediaIndices[submissionIndex]].filename.endsWith('.png') ||
                                      submission.files[mediaIndices[submissionIndex]].filename.endsWith('.gif') ? (
                                      <img
                                        src={submission.files[mediaIndices[submissionIndex]].url}
                                        alt="Media file"
                                        className="rounded-lg object-contain w-full h-full" />
                                    ) : submission.files[mediaIndices[submissionIndex]].filename.endsWith('.mp4') ? (
                                      <video controls className="rounded-lg object-contain w-full h-full">
                                        <source src={submission.files[mediaIndices[submissionIndex]].url} type="video/mp4" />
                                      </video>
                                    ) : null}
                                    {submission.files.length > 1 && (
                                      <>
                                        <button onClick={() => handlePreviousMedia(submissionIndex)} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-zinc-800 text-white p-2 rounded-full">
                                          <FontAwesomeIcon icon={faArrowLeft} />
                                        </button>
                                        <button onClick={() => handleNextMedia(submissionIndex)} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-zinc-800 text-white p-2 rounded-full">
                                          <FontAwesomeIcon icon={faArrowRight} />
                                        </button>
                                      </>
                                    )}
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white p-1 rounded">
                                      {mediaIndices[submissionIndex] + 1} / {submission.files.length}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-center md:ml-4 mt-4 md:mt-0 ">

                          {userCheck || googleUserCheck ? (
                            <button
                              className={`rounded  py-2 px-4 transition duration-200 ease-in-out border ${userVotes[submission._id] ? 'bg-yellow-500 text-white' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-300 dark:border-zinc-600'} hover:bg-yellow-500 hover:text-white`}
                              onClick={() => handleVote(submission._id)}
                            >
                              <FontAwesomeIcon icon={faCaretUp} className="md:w-6 " />
                              <span className="block mt-1 text-sm">{submission.upvoteCount}</span>
                            </button>
                          ) : (
                            <>
                              <button
                                className={`rounded  py-2 px-4 transition duration-200 ease-in-out border ${userVotes[submission._id] ? 'bg-yellow-500 text-white' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-300 dark:border-zinc-600'} hover:bg-yellow-500 hover:text-white`}
                                onClick={toggleModal}
                              >
                                <FontAwesomeIcon icon={faCaretUp} className="md:w-6 " />
                                <span className="block mt-1 text-sm">{submission.upvoteCount}</span>
                              </button>
                              {modal &&
                                <div>
                                  <Modal toggleModal={toggleModal} />
                                </div>
                              }
                            </>
                          )}
                          <button
                            className="rounded py-2 px-4 mt-2 lg:h-[47px] transition duration-200 ease-in-out border bg-zinc-100 text-zinc-500 dark:bg-zinc-300 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                            onClick={() => copyLinkToClipboard(submission._id)}
                          >
                            <FontAwesomeIcon icon={faLink} className="md:w-6 " />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* pagination */}
              <div className="flex justify-center mt-4">
                {generatePageButtons()}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Feed;
