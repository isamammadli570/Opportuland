import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../contexts/TokenManager";
import Loading from "../../ui/Loading/Loading";
import Card from "../../components/card";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel, faFileImage, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from "../../ui/Modal/Modal";

const SingleJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getAccessTokenFromMemory, getAccessTokenFromMemoryGoogle } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [user, setUser] = useState({});
  const [applyVisible, setApplyVisible] = useState(true);
  /* const [coverLetter, setCoverLetter] = useState(""); */
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLog, setHistoryLog] = useState(null);
  const [userCheck, setUserCheck] = useState("");
  const [googleUserCheck, setGoogleUserCheck] = useState("")
  const [files, setFiles] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [modal, setModal] = useState(false)
  const toggleModal = () => {
    setModal(!modal)
  }

  const loginToggleModal = () => {
    const googleUserDataString = localStorage.getItem("googleUser");
    const googleUserData = JSON.parse(googleUserDataString);
    toggleModal()
    setGoogleUserCheck(googleUserData.name);
  }

  useEffect(() => {
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUserCheck(userData.username);
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
        setGoogleUserCheck(googleUserData.name);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user data found");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const jobResponse = await axios.get(`${import.meta.env.VITE_HOST}/contests/${id}`);
        setJob(jobResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }

      try {
        const token = getAccessTokenFromMemory() /* || getAccessTokenFromMemoryGoogle() */;
        const userResponse = await fetch(`${import.meta.env.VITE_HOST}/users/find`, {
          method: "GET",
          headers: {
            authorization: "Bearer " + token,
          },
        });

        if (userResponse.ok) {
          const data = await userResponse.json();
          setUser(data.user);
        } else if (!token) {
          try {
            const token = getAccessTokenFromMemoryGoogle();
            const userResponse = await fetch(`${import.meta.env.VITE_HOST}/users/findGoogle`, {
              method: "GET",
              headers: {
                authorization: "Bearer " + token,
              },
            });
            if (userResponse.ok) {
              const data = await userResponse.json();
              setUser(data.user);
            } else {
              throw new Error("Server responded with an error");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
        else {
          throw new Error("Server responded with an error");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      try {
        const token = getAccessTokenFromMemory() || getAccessTokenFromMemoryGoogle();
        try {
          const historyResponse = await axios.get(
            `${import.meta.env.VITE_HOST}/swipedHistory/getHistoryLog/?jobId=${id}`,
            {
              headers: {
                authorization: "Bearer " + token,
              },
            }
          );
          setHistoryLog(historyResponse?.data?.swipeLog);

        } catch (error) {
          /* const token = getAccessTokenFromMemoryGoogle(); */
          const historyResponse = await axios.get(
            `${import.meta.env.VITE_HOST}/swipedHistory/getHistoryLogGoogle/?jobId=${id}`,
            {
              headers: {
                authorization: "Bearer " + token,
              },
            }
          );
          setHistoryLog(historyResponse?.data?.swipeLog);
        }

      } catch (error) {
        console.error("Error fetching history log:", error);
      }
    };

    fetchData();
  }, [id, getAccessTokenFromMemory, getAccessTokenFromMemoryGoogle]);

  const handleApplyClick = async () => {

    if (job.applyLink && isValidUrl(job.applyLink)) {
      window.open(job.applyLink, '_blank');
    }
    setLoading(true);
    setApplyVisible(false);
    setLoading(false);
  };

  const handleSend = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", data.message);
      formData.append("job", JSON.stringify(job)); // Include job data
      files.forEach(file => {
        formData.append("files", new Blob([Uint8Array.from(atob(file.file), c => c.charCodeAt(0))]), file.filename);
      });

      const token = getAccessTokenFromMemory() || getAccessTokenFromMemoryGoogle();
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/contests/apply`,
        formData,
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setHistoryLog(true);
        setApplyVisible(true);
        setLoading(false);
      } else {
        setSuccessMessage("There was an issue with your application. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error sending application:", error);
      setSuccessMessage("There was an error sending your application. Please try again.");
      setLoading(false);
    }
  };

  const getMessages = async (messageId) => {
    const token = getAccessTokenFromMemory();
    const userDataString = localStorage.getItem("user");
    const userData = JSON.parse(userDataString);

    const url = `${import.meta.env.VITE_HOST}/messages/getMessages`;

    if (!token) {
      console.error("Access token is missing or invalid");
      return;
    }

    const requestBody = { username: userData.username, messageId };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseBody = await response.json();

      if (response.ok) {
        return responseBody;
      } else {
        alert(JSON.stringify(responseBody.error));
      }
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  const handlePress = async (mess) => {
    setLoading(true);
    const filteredMessages = await getMessages(mess?.messageId);

    if (filteredMessages && Array.isArray(filteredMessages?.referencesMessage)) {
      navigate(`/messages/${mess?._id}`, {
        state: {
          customer: filteredMessages?.referencesMessage,
          company: mess?.companyId,
          hr: mess?.hrId,
          subject: mess?.subject,
          references: mess?.references,
          id: mess?._id,
          jobId: mess?.jobId,
        },
      });
      setLoading(false);
    } else {
      console.error("Not an array:", filteredMessages);
    }
  };

  const uploadBlobToServer = async () => {
    try {
      const formData = new FormData();
      formData.append("file", buffer, user?.fullname);

      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/uploadBuffer`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.resume._id;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileDownload = async (jobId, fileId, filename) => {
    const token = getAccessTokenFromMemory();
    if (!token) {
      alert("You need to sign in to see the files.");
      return;
    }

    try {
      console.log(`Downloading file with jobId: ${jobId} and fileId: ${fileId}`);
      const response = await axios.get(`${import.meta.env.VITE_HOST}/contests/fileDownload/${jobId}/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      console.log("File download response:", response);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log("Blob URL created:", url);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      console.log("File download initiated");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const getFileTypeIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FontAwesomeIcon icon={faFileExcel} className="text-green-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <FontAwesomeIcon icon={faFileImage} className="text-blue-500" />;
      default:
        return <FontAwesomeIcon icon={faFileAlt} className="text-gray-500" />;
    }
  };

  const onDrop = (acceptedFiles) => {
    const readFiles = acceptedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const binaryStr = reader.result;
          resolve({ filename: file.name, file: btoa(binaryStr) }); // Convert binary string to Base64
        };
        reader.onerror = () => {
          reject(reader.error);
        };
        reader.readAsBinaryString(file); // Read file as binary string
      });
    });

    Promise.all(readFiles)
      .then((filesWithContent) => {
        setFiles((prevFiles) => [...prevFiles, ...filesWithContent]);
      })
      .catch((error) => {
        console.error("Error reading file content:", error);
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const formatUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (isValidUrl(part)) {
        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500">{part}</a>;
      } else {
        return part;
      }
    });
  };

  const formatBoldText = (text) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    return text.split(boldRegex).map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      } else {
        return part;
      }
    });
  };

  const formatText = (text) => {

    // First format URLs and then format bold text in each part
    return formatUrls(text).map((part, index) => {
      if (typeof part === 'string') {
        return formatBoldText(part);
      }
      return part;
    });
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  if (!job) {
    return <div>Sorry, we can't find the job...</div>;
  }



  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-zinc-900 duration-200">
        <main className="mx-[12px] h-full flex-none transition-all md:pr-2">
          <div className="h-full">
            <Card extra="w-full h-full px-6 pb-6 sm:overflow-x-auto mt-5">
              <div className="w-[95%] m-auto min-h-[100vh] py-5 px-3 text-black">
                <div className="flex">
                  {loading && <div className="fixed inset-0 z-50"><Loading /></div>}
                  <div className={applyVisible ? "w-full h-auto" : "h-[950px] overflow-y-scroll w-[50%]"}>
                    <h2 className="font-semibold text-xl my-4">{job.contestName}</h2>
                    <p className="text-base my-3 whitespace-pre-line">{formatText(job.draftContest)}</p>
                    {job.files && job.files.length > 0 && (
                      <div className="my-4">
                        <h3 className="font-semibold text-lg">Files:</h3>
                        <ul className="flex flex-wrap gap-4">
                          {job.files.map((file) => (
                            <li key={file.fileId} className="flex items-center p-2 border rounded bg-white shadow-md hover:bg-gray-100 cursor-pointer">
                              {getFileTypeIcon(file.filename)}
                              <button
                                className="ml-2 text-gray-700"
                                onClick={() => handleFileDownload(job._id, file.fileId, file.filename)}
                              >
                                {file.filename}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className={applyVisible ? "hidden" : "w-[50%]"}>
                    <form onSubmit={handleSubmit(handleSend)} className="p-5">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white" htmlFor="message">Message</label>
                        <textarea
                          name="message"
                          id="message"
                          {...register("message", { required: "Message is required" })}
                          className="shadow appearance-none border rounded w-full py-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-900 dark:text-white"
                        ></textarea>
                        {errors.message && <p className="text-red-500 text-xs italic">{errors.message.message}</p>}
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-lg font-bold mb-2 dark:text-white mt-4" htmlFor="fileUpload">Upload Files</label>
                        <div {...getRootProps()} className={`border-dashed border-2 border-gray-400 p-6 text-center cursor-pointer transition bg-white dark:bg-zinc-800 ${isDragActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                          <input {...getInputProps()} />
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm3 2a2 2 0 10-4 0v12a2 2 002 2h10a2 2 002-2V7h-2v8H6V5zM7 9h6v2H7V9z" clipRule="evenodd" />
                            </svg>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Drag 'n' drop some files here, or click to select files</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Total file size limit is 50Mb</p>
                          </div>
                        </div>
                        {files.length > 0 && (
                          <ul className="mt-2 flex flex-wrap gap-4">
                            {files.map((file, index) => (
                              <li key={index} className="flex items-center p-2 border rounded bg-white shadow-md hover:bg-gray-100 cursor-pointer">
                                {getFileTypeIcon(file.filename)}
                                <span className="ml-2 text-gray-700">{file.filename}</span>
                                <button
                                  type="button"
                                  onClick={() => setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))}
                                  className="ml-2 text-red-600 dark:text-red-400"
                                >
                                  Delete
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="text-white w-36 px-3 py-2 rounded-sm bg-yellow-500 hover:bg-yellow-600">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>

                <div className="flex justify-center flex-col">
                  {applyVisible && !historyLog ? (
                    userCheck || googleUserCheck ? (
                      <button
                        onClick={() => handleApplyClick(user?.coverLetter)}
                        className="text-white w-36 px-3 py-2 rounded-sm bg-yellow-500 hover:bg-yellow-600"
                      >
                        Apply
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={loginToggleModal}
                          className="text-white w-36 px-3 py-2 rounded-sm bg-yellow-500 hover:bg-yellow-600">
                          Apply
                        </button>
                        {modal &&
                          <div>
                            <Modal toggleModal={toggleModal} />
                          </div>
                        }
                      </>
                    )
                  ) : null}
                  {historyLog && (
                    <div
                      className="w-full h-20 flex flex-col items-center justify-center bg-yellow-500"
                    >
                      <h2 className="text-lg font-semibold">You have submitted your solution.</h2>
                    </div>
                  )}
                  {successMessage && (
                    <div
                      className="w-full h-20 flex flex-col items-center justify-center my-5 bg-yellow-500"
                    >
                      {successMessage}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SingleJob;
