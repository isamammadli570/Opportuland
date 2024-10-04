import { useEffect, useState, useContext } from "react";
import AuthContext from "../signin/TokenManager";
import { yearsOptions, countryList } from "../data";
import Loading from "../dashboard/Loading";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { theme } from "../theme/theme";

export default function Edit() {
  const [editMode, setEditMode] = useState("userData");
  const { getAccessTokenFromMemory } = useContext(AuthContext);
  const [formData, setFormData] = useState();
  const [pdf, setPdf] = useState();
  const [pdfError, setPdfError] = useState(false);
  const [oldResume, setOldResume] = useState();
  const [coverLetter, setCoverLetter] = useState();
  const [resumeData, setResumeData] = useState();
  const [oldResumePdf, setOldResumePdf] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Chat gpt 4");
  const [showAlert, setShowAlert] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [updateClicked, setUpdateClicked] = useState(false);

  const handleUpdateClick = () => {
    if (fileUploaded && !updateClicked) {
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleButtonClick = (mode) => {
    setEditMode(mode === editMode ? null : mode);
  };
  //user data
  async function getUser() {
    const apiUrl = `${import.meta.env.VITE_HOST}/users/find`;
    const token = getAccessTokenFromMemory();
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(data?.user);
      } else {
        throw new Error("Network response failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("edit An error occurred while getting user data, please try again");
    }
  }

  //   //input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //   //new resume upload
  const handleResumeUpload = async () => {
    const formData = new FormData();
    formData.append("file", pdf);
    if (!pdfError) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_HOST}/resume/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (response.ok) {
          // New resume

          const responseData = await response.json();
          if (responseData.resume?.gridfs_id) {
            // Store newResumeId in localStorage
            localStorage.setItem("newResumeId", responseData.resume?.gridfs_id);
          } else {
            console.error("newResumeId is null or undefined.");
          }
          // setTimeout(handleResumeUpdate, 3000);

          setFormData((prevFormData) => ({
            ...prevFormData,
            resumeId: oldResume?._id,
          }));
        } else {
          console.error("Error uploading file.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  //   //change data resumes
  const handleResumeUpdate = async () => {
    const formData = new FormData();
    formData.append("file", pdf);
    const newResumeId = localStorage.getItem("newResumeId");
    if (!pdfError && newResumeId) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_HOST}/resume/updateResume`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              oldResumeId: oldResume?._id,
              newResumeId: newResumeId,
            }),
          }
        );

        if (response.ok) {
          const updateData = await response.json();
          return updateData;
        } else {
          console.error("Error ");
        }
      } catch (error) {
        console.error("Error updating file:", error);
      }
    }
  };
  useEffect(() => {
    if (updateClicked) {
      setFileUploaded(false);
    }
  }, [updateClicked]);

  async function editData() {
    const apiUrl = `${import.meta.env.VITE_HOST}/users/update`;
    const token = getAccessTokenFromMemory();
    let desiredKeys = [];
    setLoading(true);
    if (editMode === "userData") {
      desiredKeys = [
        "email",
        "phone",
        "linkedIn",
        "country",
        "excludedCompanies",
        "yearsOfExperience",
        "resumeText",
      ];
    } else if (editMode === "resume") {
      // const data = JSON.parse(resumeData);
     
      const {text, aiText} = resumeData
      desiredKeys.push("skills");
      formData.skills = aiText?.skills;
      desiredKeys.push("languages");
      formData.languages = aiText?.languages;
      desiredKeys.push("experience");
      formData.experience = aiText.experience;
      desiredKeys.push("resumeText");
      formData.resumeText =text ;
      handleResumeUpdate();
    } else if (editMode === "coverLetter") {
      desiredKeys = ["coverLetter"];

      formData.coverLetter = coverLetter;
    }

    formData.__v += 1;

    const requestData = {};
    desiredKeys.forEach((key) => {
      if (formData[key] !== undefined) {
        requestData[key] = formData[key];
      }
    });

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Your data updated!");
          setLoading(false);
          setUpdateClicked(true);

          return response.json();
        } else {
          throw new Error("Network response failed");
        }
      })
      .then((data) => {
        setFormData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        alert("An error occurred while updating user data, please try again");
      });
  }

  ///get old pdf
  async function getPdfById(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/pdf/${id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const resume = await response.arrayBuffer();

        getResumeById(id);
        const headers = response.headers;
        const contentType = headers.get("Content-Type");
        if (contentType === "application/pdf") {
          const blob = new Blob([resume], { type: "application/pdf" });
          const pdfUrl = URL.createObjectURL(blob);

          setOldResumePdf(pdfUrl);
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

  //get old resume
  async function getResumeById(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/resume/${id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const resume = await response.json();
        setOldResume(resume);
      } else {
        console.error("Hata oluştu.");
      }
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  }

  useEffect(() => {
    if (pdf && !pdfError) {
      handleResumeUpload();
    }
  }, [pdf, pdfError]);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (formData && formData?.resumeId) {
      //getResumeById(formData?.resumeId)
      getPdfById(formData?.resumeId);
    }
  }, [formData]);

  const regenerateText = async () => {
    setLoading(true);
    const token = getAccessTokenFromMemory();
    const resumeText = formData?.resumeText;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/regenerateText`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
          body: JSON.stringify({ selectedModel, resumeText }),
        }
      );

      const data = await response.json();
      const text = JSON.parse(data?.response);
      setCoverLetter(text?.coverLetter);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const convertNewFile = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file, file?.name);
  
      const response = await fetch(`${import.meta.env.VITE_HOST}/resume/convertPdfToText`, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          const { text } = result;
          setResumeData(text);
        } else {
          throw new Error("Received non-JSON response from server");
        }
      } else {
        // Handle non-OK response
        const errorText = await response.text();
        console.error("Non-OK response from server:", errorText);
        throw new Error("Server responded with non-OK status");
      }
    } catch (error) {
      console.error("Error while sending PDF to backend:", error);
    } finally {
      setLoading(false);
    }
  };
  
 
  return (
    <div className="flex h-full w-full">
    <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 duration-200">
      <main
        className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
      >
        <div className="h-full">
    <div className="w-full bg-slate-50">
      <div className="flex items-center justify-center">
        <div className="bg-white mx-12 my-16 py-10  rounded-xl shadow-lg px-10  w-[90%]">
          {/* title */}
          <h3 className="text-navy-900 text-center sm:text-start w-fit text-3xl lg:text-[40px] font-medium pb-2 md:px-12 mb-12  m-auto">
            Update Profile
          </h3>
          {showAlert && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        {/* Alert icon */}
                        <svg
                          className="h-6 w-6 text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.695-1.482 1.906-2.955l-6.928-15.005c-.79-1.448-2.772-1.448-3.563 0l-6.928 15.005c-.789 1.473.366 2.955 1.906 2.955z"
                          />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900"
                          id="modal-headline"
                        >
                          Alert
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            You have completed updating your resume.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      onClick={handleCloseAlert}
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>
            <button
              className="bg-yellow-500 text-white text-semibold px-5 py-2 rounded-md"
              onClick={() => {
                handleButtonClick("userData");
                handleUpdateClick();
              }}
            >
              User Data
            </button>
            {/* Resume */}
            <button
              className="bg-yellow-500 text-white text-semibold px-5 py-2 rounded-md mx-5"
              onClick={() => handleButtonClick("resume")}
            >
              Resume
            </button>
            <button
              className="bg-yellow-500 text-white text-semibold px-5 py-2 rounded-md "
              onClick={() => {
                handleButtonClick("coverLetter");
                handleUpdateClick();
              }}
            >
              Cover Letter
            </button>
          </div>
          {loading ? <div className='fixed inset-0 z-50'> <Loading /> </div> : null}
          {/* form */}
          {formData ? (
            <div className="my-5">
              {editMode === "resume" && (
                <div>
                  <form
                    className="w-full flex flex-col "
                    onSubmit={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <div className="flex flex-col">
                      <label
                        htmlFor="avatar"
                        className="text-lg font-medium text-navy-900 mb-1"
                      >
                        Update Resume
                      </label>
                      <div className="relative rounded-lg border border-[#D9D9D9] bg-[#F9F9F9]">
                        <div className="flex px-3 py-1">
                          <input
                            onChange={(event) => {
                              if (
                                event.target?.files[0]?.type ===
                                "application/pdf"
                              ) {
                                setPdf(event.target.files[0]);
                                convertNewFile(event.target.files[0]);
                                setPdfError(false);
                              } else {
                                setPdfError(true);
                              }
                            }}
                            type="file"
                            accept=".pdf"
                            className="opacity-0 w-full h-full p-3"
                          />
                        </div>
                        <p className="text-gray-400 absolute top-3 left-3 pointer-events-none">
                          {pdf ? pdf.name : "Click to choose new resume"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="avatar"
                        className="text-lg font-medium text-navy-900 my-3"
                      >
                        Current Resume
                      </label>
                      {oldResume && (
                        <div className="relative rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] ">
                          <div className="flex items-center  justify-between p-[19px]">
                            <p className="text-black/80 text-sm font-semibold">
                              {oldResume.filename}
                            </p>
                            <a
                              href={oldResumePdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="download" // added class name
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 transition-all justify-self-center w-full flex items-center justify-center sm:block py-3.5 px-32 text-white rounded-md mt-8 sm:mt-14 hover:cursor-pointer"
                      type="submit"
                      onClick={editData}
                    >
                      Update
                    </button>
                  </form>
                </div>
              )}

              {/* Coverletter */}

              {editMode === "coverLetter" && (
                <div>
                  <form
                    className="w-full flex flex-col  items-end"
                    onSubmit={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <div className="flex flex-col w-full sm:col-span-2">
                      <label
                        className="text-lg font-medium text-navy-900 mb-1"
                        htmlFor="coverLetter"
                      >
                        Cover letter
                      </label>
                      <p className="text-indigo-500 text-xs font-light mb-3">
                        - Please double check and fix where necessary
                      </p>
                      <textarea
                        required
                        //onChange={handleInputChange}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        value={
                          coverLetter ? coverLetter : formData?.coverLetter
                        }
                        placeholder="Cover letter"
                        className="focus:outline-0 py-4 px-2 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
                        type="text"
                        name="coverLetter"
                        rows={12}
                      />
                    </div>
                    <div className="flex items-center ">
                      {" "}
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button
                            style={{
                              background: theme.dark,
                              color: theme.white,
                            }}
                            className="inline-flex  w-full border-none justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm "
                          >
                            {selectedModel}

                            <ChevronDownIcon
                              className="-mr-1 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-yellow-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item
                                onClick={() => setSelectedModel("Chat gpt 3.5")}
                              >
                                <h3 className="text-gray-700 block px-4 py-2 text-sm text-bold cursor-pointer">
                                  Chat gpt 3.5
                                </h3>
                              </Menu.Item>
                              <hr />
                              <Menu.Item
                                onClick={() => setSelectedModel("Chat gpt 4")}
                              >
                                <h3 className="text-gray-700 block px-4 py-2 text-sm text-bold cursor-pointer">
                                  Chat gpt 4
                                </h3>
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      <button
                        onClick={() => regenerateText()}
                        className=" text-white w-36  mx-4 my-3 px-3 py-2 rounded-sm bg-yellow-500"
                      >
                        Regenerate
                      </button>
                    </div>

                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 transition-all justify-self-center w-full flex items-center justify-center sm:block py-3.5 px-32 text-white rounded-md mt-8 sm:mt-14 hover:cursor-pointer"
                      type="submit"
                      onClick={editData}
                    >
                      Update
                    </button>
                  </form>
                </div>
              )}

              {/* User Data */}

              {editMode === "userData" && (
                <div>
                  <form
                    className="w-full flex flex-col items-center relative"
                    onSubmit={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="flex flex-col w-full">
                        <label
                          className="text-lg font-medium text-navy-900 mb-1"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          onChange={handleInputChange}
                          value={formData?.email}
                          placeholder="example@gmail.com"
                          className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
                          type="email"
                          name="email"
                          required
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label
                          className="text-lg font-medium text-navy-900 mb-1"
                          htmlFor="phone"
                        >
                          Phone number
                        </label>
                        <input
                          onChange={handleInputChange}
                          value={formData?.phone}
                          placeholder="Phone number"
                          className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
                          type="text"
                          name="phone"
                          required
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label
                          className="text-lg font-medium text-navy-900 mb-1"
                          htmlFor="  LinkedIn"
                        >
                          LinkedIn
                        </label>
                        <input
                          onChange={handleInputChange}
                          value={formData?.linkedIn}
                          placeholder="  LinkedIn"
                          className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
                          type="text"
                          name="linkedIn"
                          required
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label
                          className="text-lg font-medium text-navy-900 mb-1"
                          htmlFor="country"
                        >
                          Country of residence
                        </label>
                        <select
                          onChange={handleInputChange}
                          required
                          name="country"
                          value={formData?.country}
                          className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400 appearance-none"
                        >
                          <option value="">Select</option>
                          {countryList.map((country, idx) => (
                            <option key={idx} value={country.label}>
                              {country.value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col w-full">
                        <label
                          className="text-lg font-medium text-navy-900 mb-1"
                          htmlFor="excludedCompanies"
                        >
                          Companies to exclude
                        </label>
                        <p className="text-yellow-500 text-xs font-light mb-3">
                          - Optional
                        </p>
                        <input
                          onChange={handleInputChange}
                          placeholder="Company 1, Company 2, etc."
                          className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
                          type="text"
                          name="excludedCompanies"
                          value={formData?.excludedCompanies}
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label
                          className="text-lg font-medium text-navy-900 mb-1"
                          htmlFor="yearsOfExperience"
                        >
                          Years of experience
                        </label>
                        <p className="text-yellow-500 text-xs font-light mb-3">
                          - Please double check and fix where necessary
                        </p>
                        <select
                          onChange={handleInputChange}
                          required
                          name="yearsOfExperience"
                          value={formData?.yearsOfExperience}
                          className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400 appearance-none"
                        >
                          {yearsOptions.map((year, idx) => (
                            <option key={idx} value={year.label}>
                              {year.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 transition-all justify-self-center w-full flex items-center justify-center sm:block py-3.5 px-32 text-white rounded-md mt-8 sm:mt-14 hover:cursor-pointer"
                      type="submit"
                      onClick={editData}
                    >
                      Update
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
    </div>
    </main>
    </div>
    </div>
  );
}
