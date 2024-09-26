import logo from "../../favicon/android-chrome-512x512.png"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useContext, useState } from "react";
import AuthContext from "./TokenManager";
import ButtonRadio from "./ButtonRadio";
import CompanySignUp from "../Company/CompanySignUp";
import Signup from "../signup/Signup";
import SignIn from "./SignIn";

const ApplicantSignin = () => {
  /* const { GoogleUserLogin } = useContext(AuthContext)

  const onFailure = (error) => {
    console.log('Google Sign-In failed:', error);
  }; */

  /* const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log(GOOGLE_CLIENT_ID); */

  /* return (
     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className='flex h-full w-full'>
        <div className="h-full w-full bg-lightPrimary dark:!bg-zinc-900 duration-200">
          <main className={`mx-[12px] h-full flex-none transition-all md:pr-2`}>
            <div className="h-screen">
              <div className="flex justify-center items-center ">
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className='dark:bg-zinc-800 bg-white dark:text-white relative 
                my-8 max-w-[600px] w-full h-full sm:h-fit flex flex-col items-center py-5 px-4 sm:p-12 shadow-md border dark:border-none
                 sm:rounded-xl gap-x-12 lg:gap-x-32 gap-y-6 sm:gap-y-10 mt-28 '
                >
                  <img className='w-36' src={logo} alt="logo.png" />
                  <h3 className='flex gap-2 justify-center items-center w-fit text-3xl font-medium  text-black/70'>
                    Log in on <p className='font-poppins uppercase'>Opportu <span className="font-bold">Land</span></p>
                  </h3>
                  <form
                    className='w-full flex flex-col items-center'
                    onSubmit={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <GoogleLogin
                      onSuccess={GoogleUserLogin}
                      onError={onFailure}
                    />
                    <div className='py-10 text-zinc-500 dark:text-zinc-400 text-center'>
                      <p>Gmail ilə qeydiyatdan keçin. </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </GoogleOAuthProvider>
  ); */

  const [selectedOption, setSelectedOption] = useState('Employer');

  const handleRadioChange = (value) => {
    setSelectedOption(value);
  };
  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] flex-grow transition-all md:pr-2`}
        >
          <div className="h-full">
            <div className="flex-grow justify-center items-center ">
              <div>
                <ButtonRadio selectedOption={selectedOption} onOptionChange={handleRadioChange} />
              </div>
            </div>

            <div className="flex-grow">
              {selectedOption === "Employer" ?
                <SignIn /> : <Signup />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicantSignin;