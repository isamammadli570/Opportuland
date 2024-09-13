import Close from "../assets/icons/close.svg";
import { useState } from "react";
import Loading from "../dashboard/Loading";
import { PrivacyTitle, PrivacyText, PrivacyDate } from "../PrivacyText";
import { text, title, date } from "../Terms";

export default function Form({
  formData,
  onFormChange,
  handleCompanyNames,
  handleSignUp,
  yearsOptions,
  countryList,
  loading,
}) {
  // Form validation function

  const isFormValid = () => {
    const requiredFields = [
      "username",
      "email",
      "password",
      "phone",
      "yearsOfExperience",
      "country",
      "fullname",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || !formData[field].trim()) {
        alert(`Please fill in your ${field}`);
        return false;
      }
    }

    // Check for email validity (optional)
    if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      alert("Please enter a valid email address");
      return false;
    }
    // Check username for only letters or alphanumeric characters
    if (!/^[a-zA-Z0-9]+$/.test(formData.username.trim())) {
      alert("Username must contain only letters or alphanumeric characters");
      return false;
    }

    // Check password length (optional)
    if (formData.password.trim().length < 4) {
      alert("Password must be at least 4 characters long");
      return false;
    }

    if (formData.linkedIn) {
      formData.linkedIn = formData.linkedIn.trim();
    }

    return true;
  };

  const [showModal, setShowModal] = useState(false);

  // Hangi modalın açık olduğunu belirlemek için state
  const [modalType, setModalType] = useState("");

  // Modalı açma fonksiyonu
  const handleModalToggle = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // Modalı kapatma fonksiyonu
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    // <div className="flex h-full w-full">
    // <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
    //   <main
    //     className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
    //   >
    //     <div className="h-full">
    <div className="">
    {loading ? <div className='fixed inset-0 z-50'> <Loading /> </div> : null}
      <button className="absolute right-4 top-4">
        <img className="w-10 h-10" src={Close} alt="closeIcon.svg" />
      </button>
      <h3 className="text-zinc-900 text-center sm:text-start w-fit text-3xl lg:text-[40px] font-medium pb-2 md:px-12 mb-4">
        Register
      </h3>
      <form
        className="w-full flex flex-col items-center"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex flex-col w-full">
            <label
              className="text-md font-medium text-zinc-900 mb-1 "
              htmlFor="username"
            >
              Username
            </label>
            <input
              placeholder="Username"
              className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
              value={formData ? formData.username : ""}
              onChange={(event) => onFormChange("username", event.target.value)}
              required
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              className="text-md font-medium text-zinc-900 mb-1 "
              htmlFor="password"
            >
              Password
            </label>
            <div className="w-full flex  items-center rounded-lg border border-[#D9D9D9] bg-[#F9F9F9]">
              <input
                className="w-full focus:outline-0 p-4  placeholder-gray-400 bg-[#F9F9F9]"
                placeholder="********"
                name="password"
                // checked={showPassword}
                value={formData ? formData?.password : " "}
                onChange={(event) => [
                  onFormChange("password", event.target.value),
                  // setPassword(text),
                ]}
              />
              <img className="w-7 h-7 mx-3 cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label
              className="text-md font-medium text-zinc-900 mb-1 "
              htmlFor="name"
            >
              Full name
            </label>
            <input
              className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
              value={formData ? formData?.fullname : ""}
              placeholder="Fullname"
              onChange={(event) => onFormChange("fullname", event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col w-full">
            <label
              className="text-md font-medium text-zinc-900 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
              value={formData ? formData?.email : ""}
              placeholder="User Email"
              onChange={(event) => onFormChange("email", event.target.value)}
              required
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              className="text-md font-medium text-zinc-900 mb-1"
              htmlFor="phone"
            >
              Phone number
            </label>

            <input
              value={formData ? formData?.phone : ""}
              placeholder="Phone Number"
              onChange={(event) => onFormChange("phone", event.target.value)}
              className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
              type="text"
              name="phone"
              required
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              className="text-md font-medium text-zinc-900 mb-1 "
              htmlFor="name"
            >
              LinkedIn
            </label>
            <input
              className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
              type="text"
              name="LinkedIn"
              value={formData ? formData?.linkedIn : ""}
              placeholder="https://linkedin.com/in/XXXXXX"
              onChange={(event) => onFormChange("linkedIn", event.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              className="text-md  text-zinc-900 mb-1 font-medium"
              htmlFor="excludedCompanies "
            >
              Companies to exclude
            </label>
            <p className="text-black/80  text-xs font-bold mb-3">
              - Write your employer name, and we will not send any applications
              to them
            </p>
            <input
              placeholder="Company 1, Company 2, etc."
              className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
              type="text"
              onChange={handleCompanyNames}
              name="excludedCompanies"
            />
          </div>
          <div className="flex flex-col w-full my-4">
            <label
              className="text-md font-medium text-zinc-900 mb-1 "
              htmlFor="yearsOfExperience"
            >
              Years of experience
            </label>
            <p className="text-black/80   text-xs font-bold mb-3">
              - Round up your experience
            </p>
            <select
              required
              name="yearsOfExperience"
              className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400 appearance-none"
              value={formData ? formData?.yearsOfExperience : ""}
              onChange={(e) =>
                onFormChange("yearsOfExperience", e.target.value)
              }
            >
              <option value="" label="Select years of experience" />
              {yearsOptions?.map((year, index) => (
                <option key={index} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label
              className="text-md font-medium text-zinc-900 mb-1 "
              htmlFor="country"
            >
              Country of residence
            </label>
            <select
              required
              name="country"
              className="focus:outline-0 p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400 appearance-none"
              value={formData ? formData?.country : ""}
              onChange={(e) => onFormChange("country", e.target.value)}
            >
              {countryList?.map((country, index) => (
                <option key={index} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full sm:col-span-2">
            <label
              className="text-md text-zinc-900 mb-1 font-medium "
              htmlFor="coverLetter"
            >
              Cover letter
            </label>
            <p className="text-black/80  text-xs font-bold  mb-3">
              - Please double check and fix where necessary
            </p>
            <textarea
              required
              placeholder="Cover letter"
              className="focus:outline-0 p-4 pb-20 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] placeholder-gray-400"
              type="text"
              name="coverLetter"
              onChange={() => onFormChange("coverLetter", event.target.value)}
              value={formData.coverLetter}
              rows={6}
            />
          </div>
        </div>

        <div>
          <h3 className="text-center text-sm my-3">
            By clicking "Sign Up", you agree with our
            <span> </span>
            <span
              className="text-blue-500 underline font-semibold terms-link cursor-pointer"
              onClick={() => handleModalToggle("terms")}
            >
               Terms
            </span>
            . Learn how we process your data in
            <span> </span>
            <span
              className="text-blue-500 underline font-semibold privacy-policy-link cursor-pointer"
              onClick={() => handleModalToggle("privacy-policy")}
            >
              Privacy Policy and Cookies Policy.
            </span>
          </h3>

          {showModal && (
            <div className="modal">
              <div className="modal-content">
               
                {modalType === "terms" ? (
               
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                      <div className="flex items-center justify-center min-h-screen">
                        <div
                          className="fixed inset-0 transition-opacity"
                          aria-hidden="true"
                        >
                          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>

                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-[62rem]">
                          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                           
                              <button
                  onClick={handleCloseModal}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  X
                </button>
                              </div>
                              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3
                                  className="text-lg leading-6 font-medium text-gray-900"
                                  id="modal-headline"
                                >
                                     {title}
                                </h3>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                  {text}
                                  </p>
                                  <span>{date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"></div>
                        </div>
                      </div>
                    </div>
                
                   
           
                ) : (
                  <div className="fixed z-10 inset-0 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-screen">
                    <div
                      className="fixed inset-0 transition-opacity"
                      aria-hidden="true"
                    >
                      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>

                    </div>
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-[62rem]">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                       
                          <button
              onClick={handleCloseModal}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              X
            </button>
                          </div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3
                              className="text-lg leading-6 font-medium text-gray-900"
                              id="modal-headline"
                            >
                                 {PrivacyTitle}
                            </h3>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                              {PrivacyText}
                              </p>
                              <span>{PrivacyDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"></div>
                    </div>
                  </div>
                </div>
             
                )}
              </div>
            </div>
          )}
        </div>

        {/* <div className="text-stone-500  w-full ">
          <h3 className="text-center text-sm my-3">
            By clicking Sign up, you agree with our
           <span className="text-blue-500 underline font-semibold"> Terms</span>.Learn  how we process your data in <span className="text-blue-500 underline font-semibold">Privacy Policy and Cookies Policy. </span> 
          </h3>
        
        
        </div> */}
        <input
          className="bg-yellow-500 hover:bg-yellow-600 transition-all justify-self-center w-full flex items-center justify-center sm:block  py-3.5 px-32 text-white rounded-md   hover:cursor-pointer"
          type="submit"
          value={loading ? "Loading...." : "  Sign Up"}
          onClick={() => {
            if (isFormValid()) {
              handleSignUp();
            }
          }}
        />
      </form>
    </div>
    // </div></main></div></div>
  );
}
