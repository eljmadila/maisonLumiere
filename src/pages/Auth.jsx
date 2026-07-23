import React, { useState } from 'react'
import Signup from '../components/Signup'
import Login from '../components/Login'
import "../App.css"

function Auth() {
  const [mode, setMode] = useState('login') 

  return (
    <div className='auth'>
      <div className='auth-header'>
        <h2>Welcome</h2>
        <p>Sign in or create your account.</p>
      </div>

      <div className='auth-btn' role="tablist" aria-label="Choose sign in or sign up">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signup'}
          className={mode === 'signup' ? 'active' : ''}
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
      </div>

      <div>
        {mode === 'signup'
          ? <Signup onSwitchToLogin={() => setMode('login')} />
          : <Login onSwitchToSignup={() => setMode('signup')} />}
      </div>
    </div>
  )
}

export default Auth