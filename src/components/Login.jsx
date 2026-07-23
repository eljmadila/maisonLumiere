import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import "../App.css"

function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password) {
      setError("Please enter your email and password.")
      return
    }

    setIsSubmitting(true)
    const { error: loginError } = await login(email, password)
    setIsSubmitting(false)

    if (loginError) {
      if (loginError.message.toLowerCase().includes('email not confirmed')) {
        setError("Please confirm your email first — check your inbox for the link.")
      } else {
        setError(loginError.message)
      }
      return
    }

    navigate(location.state?.from?.pathname || "/", { replace: true })
  }

  return (
    <form className='auth-form' onSubmit={handleSubmit} noValidate>
      {error && <p className="auth-error" role="alert">{error}</p>}

      <div>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          placeholder='Enter your email...'
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="login-password">Password</label>
        <div className="password-field">
          <input
            id="login-password"
            type="password"
            value={password}
            placeholder='Enter your password...'
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  )
}

export default Login