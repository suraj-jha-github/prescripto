import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  // Clear any existing tokens when component mounts
  useEffect(() => {
    // Clear any invalid tokens
    const existingToken = localStorage.getItem('token')
    if (existingToken && existingToken === 'false') {
      localStorage.removeItem('token')
      setToken('')
    }
  }, [setToken])



  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true)

    try {
      if (state === 'Sign Up') {

        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
        } else {
          toast.error(data.message)
        }

      } else {

        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Login successful!')
        } else {
          toast.error(data.message)
        }

      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    // Only redirect if token exists and is not empty
    if (token && token !== '') {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-md'>
        <div className='flex flex-col gap-4 items-start p-8 border rounded-xl text-[#5E5E5E] text-sm shadow-xl bg-white'>
          <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
          <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
          {state === 'Sign Up'
            ? <div className='w-full '>
              <p>Full Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
            </div>
            : null
          }
          <div className='w-full '>
            <p>Email</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
          </div>
          <div className='w-full '>
            <p>Password</p>
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
          </div>
          <button disabled={loading} className='bg-primary text-white w-full py-2 my-2 rounded-md text-base disabled:opacity-50'>{loading ? 'Loading...' : (state === 'Sign Up' ? 'Create account' : 'Login')}</button>
          {/* <button type="button" onClick={() => { localStorage.removeItem('token'); setToken(''); }} className='bg-red-500 text-white w-full py-2 rounded-md text-base'>Clear Token (Debug)</button> */}
          {state === 'Sign Up'
            ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
            : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
          }
        </div>
      </form>
    </div>
  )
}

export default Login