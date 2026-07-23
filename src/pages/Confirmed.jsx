import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Confirmed() {
  const { isLoggedIn, loading } = useAuth()

  if (loading) {
    return (
      <div className="room-container">
        <p>Confirming...</p>
      </div>
    )
  }

  return (
    <div className="room-container">
      <div className="room-header">
        <h1>{isLoggedIn ? "Email confirmed" : "Confirmation link expired or invalid"}</h1>
        <p>
          {isLoggedIn
            ? "You're all set — you're signed in."
            : "Try signing up again, or log in if you already confirmed."}
        </p>
      </div>
      <Link to={isLoggedIn ? "/" : "/auth"} className="view-link">
        <span>{isLoggedIn ? "Go to homepage" : "Back to sign in"}</span>
      </Link>
    </div>
  )
}

export default Confirmed