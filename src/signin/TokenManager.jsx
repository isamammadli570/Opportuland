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

  const getAccessTokenFromMemoryGoogle = () => {
    const tokenGoogle = secureLocalStorage.getItem('accessTokenGoogleUser')
    return tokenGoogle
  }

  //logout
  async function logOut() {
    secureLocalStorage.clear()
    localStorage.removeItem('user')
    localStorage.removeItem('userCompany')
    localStorage.removeItem("googleUser")
    secureLocalStorage.removeItem('accessToken')
    secureLocalStorage.removeItem('accessTokenCompany')
    secureLocalStorage.removeItem('accessTokenGoogleUser')
    setUser(null)
    navigate('/')
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
        secureLocalStorage.setItem('accessToken', data.accessToken)
        navigate('/')
      } else {
        throw new Error('Network response failed')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Username or password is wrong')
    }
  }

  //Google User Login 
  async function GoogleUserLogin(credentialResponse) {
    const { credential } = credentialResponse;
    const apiUrl = `${import.meta.env.VITE_HOST}/auth/google-signin`; // Correct string interpolation
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();
      if (data.token) {
        setUser(user)
        localStorage.setItem('googleUser', JSON.stringify(data.user));
        secureLocalStorage.setItem('accessTokenGoogleUser', data.token);
        return true
      } else {
        console.log('Login Failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Login is failed');
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
        secureLocalStorage.setItem('accessTokenCompany', data.accessToken)
        { user.admin ? navigate('/admin/default') : navigate('admin/my-contests') }

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
    getAccessTokenFromMemoryGoogle: getAccessTokenFromMemoryGoogle,
    logIn: logIn,
    CompanylogIn: CompanylogIn,
    GoogleUserLogin: GoogleUserLogin,
    logOut: logOut,
    user: user,
  }

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  )
}
