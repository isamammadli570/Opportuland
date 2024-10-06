import Form from "./Form";
import PdfUpload from "./PdfUpload";
import { useState } from "react";
import { yearsOptions, countryList } from "../data";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(null);
  const [resumeName, setResumeName] = useState();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState();

  //check Database
  const checkUserAPI = async (username, email, phone, linkedIn) => {
    //console.log('link', linkedIn)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/auth/checkUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            phone: phone,
            linkedIn: linkedIn,
          }),
        }
      );

      const result = await response.json();
      //console.log(result)

      if (response.ok) {
        //console.log('User can be created')
        return { success: true };
      } else {
        //console.log('Error registering user:', result.message)
        return { success: false, message: result.message };
      }
    } catch (error) {
      //console.log('Network or server error:', error)
      return { success: false, message: "Network or server error" };
    }
  };
  //create email
  const createEmailAPI = async (formData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/auth/create-email`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      // console.log('createdemail', data)
      // alert("That user already exists, please change your username")

      if (data.success && formData.username) {
        return `${formData.username}@remote-auto.com`;
      }

      if (!formData.username && !formData.password && !data.success) {
        alert("That user already exists, please change your username");
        return;
      }
    } catch (error) {
      alert("Error:", error);
      return null;
    }
  };
  //add pdf database
  const uploadResumeAPI = async (data, resumeName) => {

    try {
      const formData = new FormData();
      formData.append("file", data, resumeName);


      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        //console.log(result?.resume?.gridfs_id)
        return result?.resume?.gridfs_id;
      } else {
        alert("Non-OK response from server:", response);
        return null;
      }
    } catch (error) {
      alert("Error while sending PDF to backend upload:", error);
      return null;
    }
  };
  //pdf convert  to text
  const sendPdfToBackend = async (pdfFile, resumeName) => {
    //console.log('convert', pdfFile, resumeName);
    try {
      const formData = new FormData();
      formData.append("file", pdfFile, resumeName);
      formData.append("selectedModel", "gpt-3.5-turbo-0125");
      formData.append("prompt", "create");
      const response = await fetch(
        `${import.meta.env.VITE_HOST}/resume/convertPdfToText`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();

        console.log(result)
        const { text } = result
        const aiText = text?.aiText
        setResumeData(text);

        return JSON.parse(aiText?.content);
      } else {
        alert("Non-OK response from server:", response);
        return null;
      }
    } catch (error) {
      console.error("Error while sending PDF to backend:", error);
      alert("Please try again");
      return null;
    }
  };

  //create account
  const createAccountAPI = async (formData, resumeId) => {
    const apiUrl = `${import.meta.env.VITE_HOST}/auth/register`;

    //console.log('account create start')
    const requestData = {
      username: formData.username ? formData.username.toLowerCase() : "",
      fullname: formData.fullname ? formData.fullname.toLowerCase() : "",
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      token: formData.token,
      experience: formData.experience,
      yearsOfExperience: formData.yearsOfExperience,
      languages: formData.languages,
      skills: formData.skills,
      coverLetter: formData.coverLetter,
      createdEmail: formData.createdEmail
        ? formData.createdEmail.toLowerCase()
        : "" || `${formData.username}@remote-auto.com`,
      resumeId: resumeId,
      appliedJobs: [],
      appliedJobsCount: 0,
      country: formData.country,
      excludedCompanies: formData.excludedCompanies,
      planStatus: "free",
      applicationStatus: "ongoing",
      userScore: formData.userScore,
      dailyApplied: formData.dailyApplied,
      dailyGoal: formData.dailyGoal,
      resumeText: resumeData.text, //
      location: " ",
      messages: [],
      linkedIn: formData.linkedIn,
      notificationEnabled: true,
      termsAndConditions: {
        status: true,
        date: new Date(),
        version: 1,
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        alert(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.error) {
        const { user, accessToken } = data;
        const newUser = {
          username: user?.username,
          email: user?.createdEmail,
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        // console.log(data.accessToken);
        secureLocalStorage.setItem("accessToken", accessToken);
        navigate("/");

        return true;
      } else {
        //console.log('error var')
        return false;
      }
    } catch (error) {
      alert("Error:", error);
      return error;
    }
  };

  const ResumeConvertText = async () => {
    try {
      const res = await sendPdfToBackend(data, resumeName);
      if (res != null) {
        console.log('signup resume', res)
        setFormData(res);
        return res;
      }
    } catch (error) {
      console.log("error upload resume");
    }
  };

  const parseCompanyNames = (input) =>
    input.split(",").map((name) => name.trim());

  const handleCompanyNames = (newInputValue) => {
    const parsedCompanies = parseCompanyNames(newInputValue);
    onFormChange("excludedCompanies", parsedCompanies);
  };

  const onFormChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleSignUp = async () => {
    setLoading(true);
    const checkUserResult = await checkUserAPI(
      formData.username,
      formData.email,
      formData.phone,
      formData.linkedIn
    );

    if (checkUserResult.success) {
      const createdEmail = await createEmailAPI(formData);
      //console.log(createdEmail)
      if (createdEmail) {
        const resumeId = await uploadResumeAPI(data, resumeName);
        if (resumeId) {
          // console.log('form');
          setLoading(false);
          //console.log(formData)
          const account = await createAccountAPI(
            { ...formData, createdEmail },
            resumeId
          );
          // console.log(account)
          if (account) {
            alert("Sign Up Successful");
            // navigation.navigate('/')
            setLoading(false);
          } else {
            alert("Sign up failed");
            setLoading(false);
          }
        } else {
          alert("Error uploading resume");
          setLoading(false);
        }
      } else {
        alert("Username is already registered, please change another username");
        setLoading(false);
      }
    } else {
      alert(checkUserResult.message);
      setLoading(false);
    }
  };

  return (

    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
        >
          <div className="h-full">
            <div className="w-full min-h-screen flex items-center justify-center">
              <div className="w-full h-full relative flex justify-center items-center">
                <div className="relative mb-28 max-w-[600px] w-full h-[600px] flex flex-col items-center py-5 px-4 sm:p-16 shadow-md border bg-white sm:rounded-xl gap-x-12 lg:gap-x-32 gap-y-6 sm:gap-y-10">

                  {step === 1 && (
                    <PdfUpload
                      setStep={setStep}
                      data={data}
                      setData={setData}
                      resumeName={resumeName}
                      setResumeName={setResumeName}
                      ResumeConvertText={ResumeConvertText}
                    />
                  )}

                  {step === 2 && (
                    <Form
                      formData={formData}
                      onFormChange={onFormChange}
                      handleCompanyNames={handleCompanyNames}
                      handleSignUp={handleSignUp}
                      yearsOptions={yearsOptions}
                      countryList={countryList}
                      loading={loading}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
