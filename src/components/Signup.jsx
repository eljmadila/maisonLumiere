import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import "../App.css"

function Signup({ onSwitchToLogin }) {
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { signup } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!fullname.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsSubmitting(true)
    const { error: signupError } = await signup(email, password, fullname)
    setIsSubmitting(false)

    if (signupError) {
      setError(signupError.message)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="auth-notice">
        <i className="fa-solid fa-envelope"></i>
        <span>We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and log in.</span>
      </div>
    )
  }

  return (
    <form className='auth-form' onSubmit={handleSubmit} noValidate>
      {error && <p className="auth-error" role="alert">{error}</p>}

      <div>
        <label htmlFor="signup-fullname">Full name</label>
        <input
          id="signup-fullname"
          type="text"
          value={fullname}
          placeholder='Enter your full name...'
          autoComplete="name"
          onChange={(e) => setFullname(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          placeholder='Enter your email...'
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="signup-password">Password</label>
        <div className="password-field">
          <input
            id="signup-password"
            type="password"
            value={password}
            placeholder='Create a password...'
            autoComplete="new-password"
            minLength={6}
            maxLength={32}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create"}
      </button>
    </form>
  )
}

export default Signup