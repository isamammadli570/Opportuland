import { useState } from 'react';
import ButtonRadio from './ButtonRadio';
import SignIn from './SignIn';
import CompanySignIn from "./SignInCompany"

import { GoogleLogin } from '@react-oauth/google'
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import logo from "../../favicon/android-chrome-512x512.png"

const LogInCombined = () => {
  //!evvelki kodlar
  /* const [selectedOption, setSelectedOption] = useState('Employer');

  const handleRadioChange = (value) => {
    setSelectedOption(value);
  }; */

  // return (
  //   <div className="flex h-full w-full">
  //     <div className="h-full w-full bg-lightPrimary dark:!bg-zinc-900">
  //       <main
  //         className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
  //       >
  //         <div className="h-full">
  //           <div className="flex justify-center items-center ">
  //             <div>
  //               {/* <h1 className="text-2xl font-bold mb-4 text-center">Modern Radio Button Options</h1> */}
  //               <ButtonRadio selectedOption={selectedOption} onOptionChange={handleRadioChange} />

  //               {/* <p className="mt-4 text-center">Selected Option: {selectedOption}</p> */}
  //             </div>

  //           </div>
  //           {selectedOption === "Employer" ?
  //             <CompanySignIn /> : <SignIn />}
  //         </div>
  //       </main>
  //     </div>
  //   </div>
  // );


  /*  const login = useGoogleLogin({
     onSuccess: tokenResponse => console.log(tokenResponse),
   }); */

  return (
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
                  onSubmit={(event) => {
                    event.preventDefault()
                  }}
                >
                  <GoogleLogin
                    onSuccess={credentialResponse => {
                      const decoded = jwtDecode(credentialResponse?.credential);
                      console.log(decoded);
                    }}
                    onError={() => {
                      console.log('Login Failed')
                    }}
                  />
                  <div className='py-10 text-zinc-500 text-center'>
                    <p>Gmail ilə qeydiyatdan keçin. </p>
                  </div>

                  {/* <button onClick={() => login()}>Sign in with Google 🚀</button>; */}

                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
};

export default LogInCombined;
