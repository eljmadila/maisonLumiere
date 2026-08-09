import React, { useState } from 'react'
import "./App.css"
import Home from "./pages/Home"
import Rooms from "./pages/Rooms"
import Roominfo from './pages/Roominfo'
import Auth from './pages/Auth'
import Stays from './pages/Stays'
import Receptionist from './pages/Receptionist'
import Manager from './pages/Manager'
import Confirmed from './pages/Confirmed'
import ProtectedRoute from './components/ProtectedRoute'
import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

function App() {
  const { isLoggedIn, logout, role, user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const getRoleLabel = (r) => {
    if (r === 'manager') return 'Hotel Manager'
    if (r === 'receptionist') return 'Receptionist'
    return 'Guest'
  }

  const NotFound = () => {
    return (
      <div className="notFound">
        <div className="notFound-content">
          <h1>
            404 ·<span className="pp"> Page Not Found</span>
          </h1>

          <div className="notFound-icon">
            <i className="fa-regular fa-face-frown" aria-hidden="true" />
          </div>

          <p className="po">Oops! Something went wrong.</p>

          <Link to="/" className="notFound-link">
            <button className="not-btn" type="button">
              Back Home <i className="fa-solid fa-house" aria-hidden="true" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <header>
        <nav>
          <div className='navlogo'>
            <Link to="/">
              <h2>Maison Lumière</h2>
              <p className='est'>EST . 2026</p>
            </Link>
          </div>

          <ul className='navlinks navlinks-desktop'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
            {isLoggedIn && <li><Link to="/stays">Stays</Link></li>}
            {isLoggedIn && (role === 'receptionist' || role === 'manager') && (
              <li><Link to="/receptionist" style={{ color: '#c5a059' }}><i className="fa-solid fa-bell-concierge"></i> Reception</Link></li>
            )}
            {isLoggedIn && role === 'manager' && (
              <li><Link to="/manager" style={{ color: '#c5a059' }}><i className="fa-solid fa-chart-line"></i> Management</Link></li>
            )}
          </ul>

          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {isLoggedIn && (
              <div className="role-badge nav-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#25231f', padding: '0.35rem 0.8rem', borderRadius: '20px', border: '1px solid #444', fontSize: '0.82rem', color: '#c5a059' }}>
                <i className="fa-solid fa-user-shield" style={{ fontSize: '0.8rem' }}></i>
                <span style={{ fontWeight: '600' }}>{getRoleLabel(role)}</span>
              </div>
            )}

            {isLoggedIn ? (
              <button className='signin nav-desktop-only' onClick={logout}>Log out</button>
            ) : (
              <Link to="/auth" className="nav-desktop-only">
                <button className='signin'>Sign in</button>
              </Link>
            )}

            <button
              className={`nav-toggle ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>

      {/* overlay derrière la sidebar mobile, ferme au clic à l'extérieur */}
      <div
        className={`nav-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      ></div>

      <aside className={`mobile-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-header">
          <h2>Maison Lumière</h2>
          <button className="nav-close" onClick={closeMenu} aria-label="Close menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {isLoggedIn && (
          <div style={{ padding: '0.6rem 1rem', background: '#25231f', margin: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#c5a059' }}>
            <i className="fa-solid fa-user-shield"></i>
            <span>Account Role: <strong>{getRoleLabel(role)}</strong></span>
          </div>
        )}

        <ul className="mobile-navlinks">
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/rooms" onClick={closeMenu}>Rooms</Link></li>
          {isLoggedIn && <li><Link to="/stays" onClick={closeMenu}>Stays</Link></li>}
          {isLoggedIn && (role === 'receptionist' || role === 'manager') && (
            <li><Link to="/receptionist" onClick={closeMenu} style={{ color: '#c5a059' }}>Reception Desk</Link></li>
          )}
          {isLoggedIn && role === 'manager' && (
            <li><Link to="/manager" onClick={closeMenu} style={{ color: '#c5a059' }}>Hotel Management</Link></li>
          )}
        </ul>

        <div className="mobile-sidebar-footer">
          {isLoggedIn ? (
            <button className='signin' onClick={() => { logout(); closeMenu(); }}>Log out</button>
          ) : (
            <Link to="/auth" onClick={closeMenu}>
              <button className='signin'>Sign in</button>
            </Link>
          )}
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/rooms' element={<Rooms/>}/>
          <Route path='/roominfo/:id' element={<Roominfo />}/>
          <Route path='/auth' element={<Auth />}/>
          <Route path='/confirmed' element={<Confirmed />}/>
          
          {/* Protected Routes */}
          <Route path='/stays' element={
            <ProtectedRoute>
              <Stays />
            </ProtectedRoute>
          }/>
          <Route path='/receptionist' element={
            <ProtectedRoute allowedRoles={['receptionist', 'manager']}>
              <Receptionist />
            </ProtectedRoute>
          }/>
          <Route path='/manager' element={
            <ProtectedRoute allowedRoles={['manager']}>
              <Manager />
            </ProtectedRoute>
          }/>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        <p>Maison Lumière · A place to rest well</p>
      </footer>
    </div>
  )
}

export default App