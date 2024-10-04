import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../signin/TokenManager";
import { theme } from "../theme/theme";
import { useNavigate } from "react-router-dom";
import RegenerateResume from "./RegenerateResume";
import RegenerateText from "./RegenerateText";
import Loading from "./Loading";
import Card from "../components/card"

const SingleJob = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [applyVisible, setApplyVisible] = useState(true);
  const { getAccessTokenFromMemory } = useContext(AuthContext);
  const [coverLetter, setCoverLetter] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [historyLog, setHistoryLog] = useState(null);
  const [userCheck, setUserCheck] = useState("");
  const [selectedItem, setSelectedItem] = useState("Chat gpt 3.5");
  const [oldResume, setOldResume] = useState();
  const [buffer, setBuffer] = useState();
  const [selectTemplate, setSelectTemplate] = useState("Template 1");

  //localstorage user
  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const { username } = userData;
        setUserCheck(username);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user data found");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_HOST}/jobs/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setJob(response.data);
          setLoading(false);
        } else {
          throw new Error("Server responded with an error");
        }
      })
      .catch((error) => {
        console.error("Error fetching job details:", error);
        setLoading(false);
      });

    const token = getAccessTokenFromMemory();

    fetch(`${import.meta.env.VITE_HOST}/users/find`, {
      method: "GET",
      headers: {
        authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Server responded with an error");
        }
      })
      .then((data) => {
        if (data && data.user) {
          setLoading(false);
          setUser(data.user);
        } else {
          throw new Error("Unexpected response format");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });

    axios
      .get(
        `${import.meta.env.VITE_HOST}/swipedHistory/getHistoryLog/?jobId=${id}`,
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        setHistoryLog(response?.data?.swipeLog);
      })
      .catch((error) => {
        console.error("Error fetching history log:", error);
      });
  }, [id, getAccessTokenFromMemory]);

  const handleApplyClick = async (coverLetterTemplate) => {
    setLoading(true);
    setApplyVisible(false);
    getPdfById(user?.resumeId);

    // Define the placeholders regex
    const jobPlaceholderRegex = /\[Job Applying\]/gi;
    const hrPlaceholderRegex = /Hiring Manager/gi;
    const companyPlaceholderRegex = /\[Company Applying\]/gi;

    // Extract job details
    const { hr_name, company, job_name } = job;

    let personalizedCoverLetter = coverLetterTemplate?.replace(
      companyPlaceholderRegex,
      company
    );

    personalizedCoverLetter = personalizedCoverLetter?.replace(
      hrPlaceholderRegex,
      hr_name
    );

    personalizedCoverLetter = personalizedCoverLetter?.replace(
      jobPlaceholderRegex,
      job_name
    );

    setCoverLetter(personalizedCoverLetter);
    setLoading(false);
  };

  if (!job) {
    return <div>Ups sorry we cant find job...</div>;
  }

  // send data
  const handleSend = async () => {
    setLoading(true);
    console.log("loading");
    setApplyVisible(true);
    const id = await uploadBlobToServer(buffer);
    console.log(id);

    const dataToSend = {
      coverLetter: coverLetter,
      userEmail: user?.username,
      jobId: job?._id,
      userPassword: user?.password,
      fullname: user?.fullname,
      newResumeId: id,
    };
    console.log(dataToSend);
    const token = getAccessTokenFromMemory();

    axios({
      method: "post",
      url: `${import.meta.env.VITE_HOST}/messages/regularApplication`,
      headers: {
        authorization: "Bearer " + token,
      },
      data: dataToSend,
    })
      .then(() => {
        setHistoryLog(true);
        setSuccessMessage("Your application has been successfully sent.");
        setApplyVisible(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error sending cover letter:", error);
        setLoading(false);
      });

    axios({
      method: "post",
      url: `${import.meta.env.VITE_HOST}/swipedHistory/log`,
      headers: {
        authorization: "Bearer " + token,
      },
      data: {
        jobId: dataToSend.jobId,
        swipedRight: true,
      },
    })
      .then(() => {
        //console.log('logged job successfully', response.data)
      })
      .catch((error) => {
        console.error("Error history swipe:", error);
        setLoading(false);
      });
  };

  //generate text
  const regenerateText = async (job) => {
    setLoadingText(true);
    const token = getAccessTokenFromMemory();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/editText`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            prompt: "regenerate",
            selectedItem,
            job,
            user,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      setCoverLetter(data?.response?.content);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoadingText(false);
  };

  const getMessageId = async () => {
    const { _id } = job;
    setLoading(true);
    const token = getAccessTokenFromMemory();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/messages/getAppliedMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
          body: JSON.stringify({ _id }),
        }
      );
      if (response) {
        const res = await response.json();

        const { data } = res;
        handlePress(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };
  const getMessages = async (messageId) => {
    const token = getAccessTokenFromMemory();
    const userDataString = localStorage.getItem("user");
    const userData = JSON.parse(userDataString);

    const url = `${import.meta.env.VITE_HOST}/messages/getMessages`;

    // console.log(url)
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
        // console.log(responseBody)
        return responseBody;
      } else {
        alert(JSON.stringify(responseBody.error));
        // console.log('getMessages',responseBody)
      }
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  const handlePress = async (mess) => {
    setLoading(true);
    const filteredMessages = await getMessages(mess?.messageId);

    if (
      filteredMessages &&
      Array.isArray(filteredMessages?.referencesMessage)
    ) {
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
      console.error("Not an arr:", filteredMessages);
    }
  };

  const selectPdf = async () => {
    setLoadingResume(true);
    const token = getAccessTokenFromMemory();

    let selectedTemplate;

    switch (selectTemplate) {
      case "Template 1":
        selectedTemplate = 1;
        break;
      case "Template 2":
        selectedTemplate = 2;
        break;
      case "Template 3":
        selectedTemplate = 3;
        break;
      default:
        selectedTemplate = 1;
    }

    try {
      const response = await fetch(
        `https://opportuland.com/gencv/fetch_job_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_id: job?._id,
            user_id: user?._id,
            token: token,
            chat_gpt_model: selectedItem,
            pixel_color: "(0, 0, 0)",
            template: selectedTemplate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        const blob = await response.blob();
        const typedBlob = new Blob([blob], { type: 'application/pdf' });

        setBuffer(typedBlob);
        const url = URL.createObjectURL(typedBlob);
        setOldResume(url);
        // setBuffer(blob);
        // const url = URL.createObjectURL(blob);
        // setOldResume(url);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoadingResume(false);
  };

  //old pdf
  async function getPdfById(id) {
    setLoadingResume(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/pdf/${id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const resume = await response.arrayBuffer();

        const headers = response.headers;
        const contentType = headers.get("Content-Type");
        if (contentType === "application/pdf") {
          const blob = new Blob([resume], { type: "application/pdf" });
          const pdfUrl = URL.createObjectURL(blob);

          setOldResume(pdfUrl);
          setLoadingResume(false);
        } else {
          console.error("Wrong Content-Type: " + contentType);
        }
      } else {
        console.error("Error.");
      }
    } catch (error) {
      console.error("Error", error);
    }
  }

  async function uploadBlobToServer() {
    try {
      //kohnesidi se  getmesin bu function
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
      const { resume } = data;
      return resume._id;
      // setNewResumeId(resume._id)
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 duration-200">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
        >
          <div className="h-full">
            <>
              <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto mt-5"}>
                <div className="w-[95%] m-auto min-h-[100vh] py-5 px-3 text-black">
                  <div className="flex ">
                    {loading ? <div className='fixed inset-0 z-50'> <Loading /> </div> : null}
                    {/* job data */}
                    <div
                      className={
                        applyVisible
                          ? "w-full h-auto"
                          : "h-[950px] overflow-y-scroll w-[50%] "
                      }
                    >
                      <h2 className="font-semibold text-xl my-4">{job.job_name}</h2>
                      <p className="text-base my-3 whitespace-pre-line">
                        {job.job_description}
                      </p>
                    </div>
                    {/* <div className="h-[850px] overflow-y-scroll w-[40%] "> */}
                    <div className={applyVisible ? "hidden" : " w-[50%]"}>
                      <RegenerateResume
                        loading={loadingResume}
                        setSelectedItem={setSelectedItem}
                        oldResume={oldResume}
                        selectPdf={selectPdf}
                        selectedItem={selectedItem}
                        setSelectTemplate={setSelectTemplate}
                        selectTemplate={selectTemplate}

                      />

                      <RegenerateText
                        loading={loadingText}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        coverLetter={coverLetter}
                        setCoverLetter={setCoverLetter}
                        handleSend={handleSend}
                        regenerateText={regenerateText}
                        job={job}
                      />
                    </div>
                    {/* </div> */}
                  </div>

                  <div className="flex justify-center flex-col">
                    {applyVisible && !historyLog ? (
                      userCheck ? (
                        <button
                          onClick={() => handleApplyClick(user?.coverLetter)}
                          style={{ background: theme.yellow }}
                          className=" text-white w-36 px-3 py-2 rounded-sm"
                        >
                          Apply
                        </button>
                      ) : (
                        <Link
                          to="/user-login"
                          style={{ background: theme.yellow }}
                          className=" text-white w-36 px-10 py-2 rounded-sm"
                        >
                          Apply
                        </Link>
                      )
                    ) : null}
                    {historyLog ? (
                      <div
                        className="w-full h-20 flex flex-col items-center justify-center "
                        style={{ background: theme.yellow }}
                      >
                        <h2 className="text-lg font-semibold">
                          You have applied for this position
                        </h2>
                        <h3
                          className="text-blue-500  text-xl font-bold underline cursor-pointer"
                          onClick={getMessageId}
                        >
                          Open the conversation with HR
                        </h3>
                      </div>
                    ) : null}
                    {successMessage && (
                      <div
                        className="w-full h-20 flex flex-col items-center justify-center my-5"
                        style={{ background: theme.yellow }}
                      >
                        {successMessage}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </>
          </div></main></div></div>

  );
};

export default SingleJob;
