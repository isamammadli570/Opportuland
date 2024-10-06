import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import logo from "../../favicon/android-chrome-512x512.png";
import { useContext } from 'react';
import AuthContext from '../signin/TokenManager';
import { IoMdClose } from 'react-icons/io';

function Modal({ toggleModal }) {
    const { GoogleUserLogin } = useContext(AuthContext);

    const onFailure = (error) => {
        console.log('Google Sign-In failed:', error);
    };

    const handleGoogleLoginSuccess = (res) => {
        const GoogleLoginRes = GoogleUserLogin(res);
        if (GoogleLoginRes) {
            toggleModal()

        }
    };

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log(GOOGLE_CLIENT_ID);

    return (
        <div className="fixed inset-0 bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <div className="w-[600px]">
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className='dark:bg-navy-800 relative bg-white dark:text-white
                            my-8 max-w-[600px] sm:h-fit flex flex-col items-center py-5 px-4 sm:p-12 shadow-md border dark:border-none
                            sm:rounded-xl gap-x-12 lg:gap-x-32 gap-y-6 sm:gap-y-10 mt-28'
                    >
                        <img className='w-36' src={logo} alt="logo.png" />
                        <h3 className='flex gap-2 justify-center items-center w-fit text-3xl font-medium text-black/70'>
                            Log in on <p className='font-poppins uppercase'>Opportu <span className="font-bold">Land</span></p>
                        </h3>
                        <form
                            className='flex flex-col items-center'
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={onFailure}
                            />
                            <div className='py-10 text-zinc-500 dark:text-zinc-400 text-center'>
                                <p>Gmail ilə qeydiyatdan keçin. </p>
                            </div>
                        </form>
                        <button onClick={toggleModal} className='absolute right-10'>
                            <IoMdClose size={25} />
                        </button>
                    </div>
                </GoogleOAuthProvider>
            </div>
        </div>
    );
}

export default Modal;
