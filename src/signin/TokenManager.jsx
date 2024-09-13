/* eslint-disable react/prop-types */
import secureLocalStorage from 'react-secure-storage'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext

export const TokenManager = ({ children }) => {
  const [user, setUser] = useState()
  const navigate = useNavigate()

  // token hissesi
  const getAccessTokenFromMemory = () => {
    const token = secureLocalStorage.getItem('accessToken')
    return token
  }

  const getAccessTokenFromMemoryCompany = () => {
    const tokenCompany = secureLocalStorage.getItem('accessTokenCompany')
    return tokenCompany
  }

  //logout
  async function logOut() {
    secureLocalStorage.clear()
    localStorage.removeItem('user')
    localStorage.removeItem('userCompany')
    secureLocalStorage.removeItem('accessToken')
    secureLocalStorage.removeItem('accessTokenCompany')
    setUser(null)
    navigate('/signin')
  }

  // User Login
  async function logIn(user) {
    const apiUrl = `${import.meta.env.VITE_HOST}/auth/login`

    // Make the API request using the fetch API
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (response.ok) {
        const data = await response.json()
        const user = {
          username: data.username,
          email: data.createdEmail,
        }
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        // console.log(data.accessToken);
        secureLocalStorage.setItem('accessToken', data.accessToken)
        navigate('/')
        // window.history.back()
      } else {
        throw new Error('Network response failed')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Username or password is wrong')
    }
  }
  
  // Company Login
  async function CompanylogIn(user) {
    const apiUrl = `${import.meta.env.VITE_HOST}/auth/companyLogin`

    // Make the API request using the fetch API
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (response.ok) {
        const data = await response.json()
        const user = {
          username: data.name,
          email: data.email,
          company_name: data.company_name,
          admin: data.admin
        }
        setUser(user)
        localStorage.setItem('userCompany', JSON.stringify(user))
        // console.log(data.accessToken);
        secureLocalStorage.setItem('accessTokenCompany', data.accessToken)
        { user.admin ? navigate('/admin/default') : navigate('admin/my-contests') }

        // window.history.back()
      } else {
        throw new Error('Network response failed')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Email or password is wrong')
    }
  }

  let contextData = {
    getAccessTokenFromMemory: getAccessTokenFromMemory,
    getAccessTokenFromMemoryCompany: getAccessTokenFromMemoryCompany,
    logIn: logIn,
    CompanylogIn: CompanylogIn,
    logOut: logOut,
    user: user,
  }

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  )
}
