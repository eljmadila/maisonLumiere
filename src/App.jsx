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
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

function App() {
  const { isLoggedIn, logout, role, setRole } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setMenuOpen(false)

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
            {(role === 'receptionist' || role === 'manager') && (
              <li><Link to="/receptionist" style={{ color: '#c5a059' }}><i className="fa-solid fa-bell-concierge"></i> Reception</Link></li>
            )}
            {role === 'manager' && (
              <li><Link to="/manager" style={{ color: '#c5a059' }}><i className="fa-solid fa-chart-line"></i> Management</Link></li>
            )}
          </ul>

          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {/* Quick Role Switcher for Testing/Demo */}
            <div className="role-switcher nav-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#25231f', padding: '0.3rem 0.6rem', borderRadius: '20px', border: '1px solid #444' }}>
              <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#c5a059', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
              >
                <option value="guest" style={{ background: '#1c1b18', color: '#fff' }}>Guest</option>
                <option value="receptionist" style={{ background: '#1c1b18', color: '#fff' }}>Receptionist</option>
                <option value="manager" style={{ background: '#1c1b18', color: '#fff' }}>Hotel Manager</option>
              </select>
            </div>

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

        {/* Role switcher inside mobile drawer */}
        <div style={{ padding: '0.8rem 1rem', background: '#25231f', margin: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Switch Demo Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#c5a059', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', outline: 'none' }}
          >
            <option value="guest" style={{ background: '#1c1b18', color: '#fff' }}>Guest</option>
            <option value="receptionist" style={{ background: '#1c1b18', color: '#fff' }}>Receptionist</option>
            <option value="manager" style={{ background: '#1c1b18', color: '#fff' }}>Manager</option>
          </select>
        </div>

        <ul className="mobile-navlinks">
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/rooms" onClick={closeMenu}>Rooms</Link></li>
          {isLoggedIn && <li><Link to="/stays" onClick={closeMenu}>Stays</Link></li>}
          {(role === 'receptionist' || role === 'manager') && (
            <li><Link to="/receptionist" onClick={closeMenu} style={{ color: '#c5a059' }}>Reception Desk</Link></li>
          )}
          {role === 'manager' && (
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
          <Route path='/stays' element={<Stays />}/>
          <Route path='/receptionist' element={<Receptionist />}/>
          <Route path='/manager' element={<Manager />}/>
          <Route path='/confirmed' element={<Confirmed />}/>
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