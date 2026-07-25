import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Confirmed() {
  const { isLoggedIn, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && isLoggedIn) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true })
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn, loading, navigate])

  if (loading) {
    return (
      <div className="room-container">
        <p>Confirming your email...</p>
      </div>
    )
  }

  return (
    <div className="room-container">
      <div className="room-header">
        <h1>{isLoggedIn ? "Email confirmed!" : "Confirmation link expired or invalid"}</h1>
        <p>
          {isLoggedIn
            ? "Your email is verified and you are now signed in. Redirecting you to Home..."
            : "Try signing up again, or log in if you already confirmed."}
        </p>
      </div>
      <Link to={isLoggedIn ? "/" : "/auth"} className="view-link">
        <span>{isLoggedIn ? "Go to Home now" : "Back to sign in"}</span>
      </Link>
    </div>
  )
}

export default Confirmed