import React, { useState } from 'react'
import "./App.css"
import Home from "./pages/Home"
import Rooms from "./pages/Rooms"
import Roominfo from './pages/Roominfo'
import Auth from './pages/Auth'
import Stays from './pages/Stays'
import Confirmed from './pages/Confirmed'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

function App() {
  const { isLoggedIn, logout } = useAuth()
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
          </ul>

          <div className="nav-right">
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

        <ul className="mobile-navlinks">
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/rooms" onClick={closeMenu}>Rooms</Link></li>
          {isLoggedIn && <li><Link to="/stays" onClick={closeMenu}>Stays</Link></li>}
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