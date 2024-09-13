/* eslint-disable react/prop-types */
import { useState, useContext } from 'react'
import AuthContext from './TokenManager'
import { useNavigate } from 'react-router-dom'
import Close from '../assets/icons/close.svg'
import ViewEye from '../assets/icons/view.png'
import HideEye from '../assets/icons/hide.png'

const SignIn = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [viewPass, setViewPass] = useState(false)
  const { logIn } = useContext(AuthContext)

  const handleInputChange = (event) => {
    const target = event.target
    let value
    value = target.value
    const name = target.name
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function PasswordType() {
    setViewPass(!viewPass)
  }

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2`}
        >
          <div className="h-full">
            <div className='w-full min-h-screen'>
              <div className='w-full h-full relative flex justify-center items-center'>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className='relative my-8 max-w-[600px] w-full h-full sm:h-fit flex flex-col items-center py-5 px-4 sm:p-12 shadow-md border bg-white sm:rounded-xl gap-x-12 lg:gap-x-32 gap-y-6 sm:gap-y-10'
                >
                  <button
                    onClick={() => {
                      navigate('/')
                    }}
                    className='absolute right-4 top-4'
                  >
                    {/* <imgx
              className='w-10 h-10 text-orange-500'
              src={Close}
              alt='closeIcon.svg'
            /> */}
                  </button>
                  <h3 className='text-center sm:text-start w-fit text-3xl lg:text-[40px] bg-[#a37bfd]font-medium pb-2 md:px-12 mb-4 font-bold text-black/70'>
                    Applicant Sign In
                  </h3>

                  <form
                    className='w-full flex flex-col items-center'
                    onSubmit={(event) => {
                      event.preventDefault()
                    }}
                  >
                    <div className='grid w-full grid-cols-1'>
                      <div className='flex flex-col w-full'>
                        <label
                          className='text-lg text-black/70 font-bold mb-1'
                          htmlFor='email'
                        >
                          Username
                        </label>

                        <input
                          placeholder='username'
                          className='focus:outline-0 p-4 rounded-lg border placeholder-orange-600/60 border-[#D9D9D9] bg-[#F9F9F9] '
                          type='email'
                          name='email'
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                            }
                          }}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className='flex flex-col w-full mt-8'>
                        <label
                          className='text-lg text-black/70 font-bold mb-1'
                          htmlFor='password'
                        >
                          Password
                        </label>
                        <div className='w-full flex  p-4 rounded-lg border border-[#D9D9D9] bg-[#F9F9F9]'>
                          <input
                            className='w-full focus:outline-0  placeholder-gray-400 bg-[#F9F9F9]'
                            placeholder='********'
                            type={viewPass ? 'text' : 'password'}
                            name='password'
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                logIn({
                                  email: formData.email.toLowerCase(),
                                  password: formData.password,
                                })
                              }
                            }}
                            onChange={handleInputChange}
                          />
                          <img
                            src={viewPass ? ViewEye : HideEye}
                            className='w-7 h-7 cursor-pointer'
                            onClick={PasswordType}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/signup')
                        }}
                        className='text-orange-500 mt-4 text-start w-fit'
                      >
                        Don&apos;t have an account?
                      </button>
                    </div>



                    <input
                      className='justify-self-center w-full flex items-center justify-center sm:block  bg-orange-500 hover:bg-orange-600 py-3.5 px-32 text-white rounded-lg mt-8 sm:mt-10 hover:cursor-pointer'
                      type='submit'
                      value='Sign In'
                      onClick={(e) => {
                        e.preventDefault()
                        logIn({
                          email: formData.email.toLowerCase(),
                          password: formData.password,
                        })
                      }}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div></main></div></div>
  )
}

export default SignIn
