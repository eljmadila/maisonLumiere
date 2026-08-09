import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute component to enforce authentication and role-based access control.
 * @param {React.ReactNode} children - Component to render if access is granted.
 * @param {Array<string>} [allowedRoles] - Optional list of allowed roles (e.g. ['receptionist', 'manager']).
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#c5a059' }}>
        <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
      </div>
    )
  }

  // 1. Must be logged in
  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // 2. If specific roles are required, verify user's role
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // User is logged in but lacks required permission (e.g., guest trying to access receptionist/manager)
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
