import React, { useState } from 'react'

const SimpleLogin = () => {
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', { state, name, email, password })
    alert('Form submitted successfully!')
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='flex flex-col gap-4 items-start p-8 border rounded-xl text-[#5E5E5E] text-sm shadow-xl bg-white'>
          <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
          <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
          
          <form onSubmit={handleSubmit} className='w-full'>
            {state === 'Sign Up' && (
              <div className='w-full mb-4'>
                <p>Full Name</p>
                <input 
                  onChange={(e) => setName(e.target.value)} 
                  value={name} 
                  className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                  type="text" 
                  required 
                />
              </div>
            )}
            
            <div className='w-full mb-4'>
              <p>Email</p>
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                type="email" 
                required 
              />
            </div>
            
            <div className='w-full mb-4'>
              <p>Password</p>
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                type="password" 
                required 
              />
            </div>
            
            <button className='bg-primary text-white w-full py-2 rounded-md text-base'>
              {state === 'Sign Up' ? 'Create account' : 'Login'}
            </button>
          </form>
          
          {state === 'Sign Up'
            ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
            : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
          }
        </div>
      </div>
    </div>
  )
}

export default SimpleLogin 