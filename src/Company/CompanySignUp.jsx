import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import Close from "../assets/icons/close.svg";
import ViewEye from "../assets/icons/view.png";
import HideEye from "../assets/icons/hide.png";
import Loading from "../dashboard/Loading";

Modal.setAppElement("#root");

const CompanySignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [viewPass, setViewPass] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isOtp, setIsOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpExpires, setOtpExpires] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
  };

  const togglePasswordView = () => {
    setViewPass((prev) => !prev);
  };

  const postData = async (dataAfterAt) => {
    setLoading(true);
    const data = {
      email: formData.email,
      password: formData.password,
      domain: dataAfterAt,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/auth/signupCompany`,
        { data }
      );
      if (response.status === 200) {
        setIsOtp(true);
        const expiresAt = new Date().getTime() + 5 * 60 * 1000; // 5 dəqiqəlik vaxt
        setOtpExpires(expiresAt);
      }
    } catch (error) {
      setValidationError(
        error.response?.data?.message ||
          "Failed to submit data. Please use a business e-mail."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      setValidationError("Please fill in all fields.");
      return;
    }

    const dataAfterAt = formData.email.split("@")[1];
    if (!dataAfterAt) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    localStorage.setItem("formData", JSON.stringify(formData));
    await postData(dataAfterAt);
  };
  const verifyOtp = async () => {
    setLoading(true);
    const dataAfterAt = formData.email.split("@")[1];
    const otpAndEmail = { email: formData.email, otp, domain: dataAfterAt };
    localStorage.setItem("otpAndEmail", JSON.stringify(otpAndEmail));

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_HOST}/auth/verify-otp`,
            { otpAndEmail }
        );

        if (response.status === 200) {
            const data = response.data;
            console.log("Response data:", data);

            if (data?.company_info && data?.company_name && data?.products_services && data?.industry) {
                // If data contains company details
                localStorage.setItem("webData", JSON.stringify({ company_info: data.company_info, products_services: data.products_services,  industry: data.industry, company_name: data.company_name, company_website_text: data.combinedData }));
                setFormData((prevState) => ({
                    ...prevState,
                    companyInfo: data.company_info || "",
                    productsServices: data.products_services || "",
                    industry: data.industry || "",
                }));
            } else if (typeof data.text === "string") {
                // If data contains scraped text and links as strings
                try {
                    const parsedText = JSON.parse(data.text);
                    setFormData((prevState) => ({
                        ...prevState,
                        companyInfo: parsedText?.company_info?.text || parsedText?.company_info || "",
                        productsServices: parsedText?.products_services?.text || parsedText?.products_services || "",
                    }));
                    localStorage.setItem("webData", JSON.stringify({ text: data.text, links: data.links, company_website_text: data.combinedData}));
                } catch (parseError) {
                    console.error("Failed to parse text as JSON:", data.text);
                    setValidationError("Failed to parse company information.");
                }
            } else {
                console.error("Unexpected response structure:", data);
                setValidationError("Unexpected response structure.");
            }
            navigate("/company-step-2");
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        setValidationError("Failed to submit OTP code. Please try again.");
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    if (isOtp && otpExpires) {
      const timer = setInterval(() => {
        if (new Date().getTime() > otpExpires) {
          setIsOtp(false);
          setOtp("");
          setOtpExpires(null);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOtp, otpExpires]);

  return (
    <div className="flex h-full w-full">
    <div className="h-full w-full bg-lightPrimary dark:!bg-zinc-900 duration-200">
      <main
        className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
      >
        <div className="h-full">
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full h-full relative flex justify-center items-center">
      {loading ? <div className='fixed inset-0 z-50'> <Loading /> </div> : null}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative my-8 max-w-[600px] w-full h-full sm:h-fit flex flex-col items-center py-5 px-4 sm:p-12 shadow-md border bg-white sm:rounded-xl gap-x-12 lg:gap-x-32 gap-y-6 sm:gap-y-10"
        >
          <button
            onClick={() => navigate("/")}
            className="absolute right-4 top-4"
          >
            {/* <img className="w-10 h-10" src={Close} alt="Close" /> */}
          </button>
          <h3 className='text-center sm:text-start w-fit text-3xl lg:text-[40px] bg-[#a37bfd]font-medium pb-2 md:px-12 mb-4 font-bold text-black/70'>
            Employer Sign Up
          </h3>
          {validationError && <p className="text-red-500">{validationError}</p>}

          <form
            className="w-full flex flex-col items-center"
            onSubmit={handleFormSubmit}
          >
            <div className="grid w-full grid-cols-1">
              <div className="flex flex-col w-full">
                <label
                  className="text-lg text-black/70 font-bold mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  placeholder="professional-email@example.com"
                  className="focus:outline-0 p-4 rounded-lg border placeholder-orange-600/60 border-[#D9D9D9] bg-[#F9F9F9]"
                  type="email"
                  name="email"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col w-full mt-8">
                <label
                  className="text-lg text-black/70 font-bold mb-1"
                  htmlFor="password"
                >
                  Create password
                </label>
                <div className="w-full flex p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9]">
                  <input
                    className="w-full focus:outline-0 placeholder-gray-400 bg-[#F9F9F9]"
                    placeholder="********"
                    type={viewPass ? "text" : "password"}
                    name="password"
                    onChange={handleInputChange}
                  />
                  <img
                    src={viewPass ? ViewEye : HideEye}
                    className="w-7 h-7 cursor-pointer"
                    onClick={togglePasswordView}
                    alt="Toggle password visibility"
                  />
                </div>
              </div>
            </div>

            <input
              className="justify-self-center w-full flex items-center justify-center sm:block bg-orange-500 hover:bg-orange-600 py-3.5 px-32 text-white rounded-lg mt-8 sm:mt-10 hover:cursor-pointer"
              type="submit"
              value="Next"
            />

            <Modal
              isOpen={isOtp}
              onRequestClose={() => setIsOtp(false)}
              contentLabel="OTP Modal"
              className="Modal"
              overlayClassName="Overlay"
            >
              <div className="flex flex-col items-center">
                <h2 className="text-lg font-bold mb-4">OTP Verification</h2>
                <label
                  className="text-lg text-black/70 font-bold mb-1"
                  htmlFor="otp"
                >
                  We sent a verification email
                </label>
                <div className="w-full flex p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] mb-4">
                  <input
                    className="w-full focus:outline-0 placeholder-gray-400 bg-[#F9F9F9]"
                    placeholder="Enter OTP"
                    type="text"
                    name="otp"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    className="ml-2 font-semibold text-blue-500"
                    type="button"
                    onClick={verifyOtp}
                  >
                    Send
                  </button>
                </div>
                <button
                  className="font-semibold text-red-500"
                  onClick={() => setIsOtp(false)}
                >
                  Close
                </button>
              </div>
            </Modal>
          </form>
        </div>
      </div>
    </div>
    </div>
    </main>
    </div>
    </div>
  );
};

export default CompanySignUp;
