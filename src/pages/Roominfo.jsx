import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { getTodayString, getNextDayString, calculateNights } from '../utils/dateUtils'
import "../App.css"

function Roominfo() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [room, setRoom] = useState(null)
  const [loadingRoom, setLoadingRoom] = useState(true)

  const urlCheckIn = searchParams.get('checkIn')
  const urlCheckOut = searchParams.get('checkOut')

  const todayStr = getTodayString()
  const initialIn = urlCheckIn || todayStr
  const initialOut = urlCheckOut || getNextDayString(initialIn)

  const [checkIn, setCheckIn] = useState(initialIn)
  const [checkOut, setCheckOut] = useState(initialOut)
  const [error, setError] = useState("")
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setRoom(null)
        } else {
          setRoom(data)
        }
        setLoadingRoom(false)
      })
  }, [id])

  if (loadingRoom) {
    return <div className="room-container"><p>Loading room...</p></div>
  }

  if (!room) {
    return (
      <div className="room-container">
        <div className="room-header">
          <h1>Room not found</h1>
          <p>This room may have been removed or the link is incorrect.</p>
        </div>
        <Link to="/rooms" className="view-link">
          <span>Back to all rooms</span>
        </Link>
      </div>
    )
  }

  const { image_url, number, type, description, price, capacity, amenities } = room

  const handleCheckInChange = (e) => {
    const val = e.target.value
    setCheckIn(val)
    if (!val) return
    const minOut = getNextDayString(val)
    if (!checkOut || checkOut <= val) {
      setCheckOut(minOut)
    }
  }

  const handleCheckOutChange = (e) => {
    setCheckOut(e.target.value)
  }

  const minCheckOut = checkIn ? getNextDayString(checkIn) : getNextDayString()
  const nights = calculateNights(checkIn, checkOut)
  const validNights = nights > 0

  const total = validNights ? (nights * price).toFixed(2) : "0.00"

  const handleBooking = async (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      navigate('/auth', { state: { from: location } })
      return
    }

    if (!validNights) {
      setError("Please select valid check-in and check-out dates (at least 1 night).")
      return
    }

    setError("")
    setIsBooking(true)

    if (user) {
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || ''
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: fullName,
          email: user.email,
        }, { onConflict: 'id' })
      } catch (err) {
        console.warn('Could not sync profile before booking:', err)
      }
    }

    const { error: bookingError } = await supabase.from('bookings').insert({
      user_id: user.id,
      room_id: room.id,
      nights,
      total: parseFloat(total),
    })

    setIsBooking(false)

    if (bookingError) {
      setError(bookingError.message)
      return
    }

    navigate('/stays')
  }

  return (
    <div className="room-container">
      <Link to="/rooms" className="view-link back-link">
        <span><i className="fa-solid fa-arrow-left-long"></i></span> <span>Back to rooms</span>
      </Link>

      <div className="roominfo">
        <img className="roominfo-image" src={image_url} alt={`${type} Room ${number}`} />

        <div className="roominfo-content">
          <div className="roominfo-header">
            <h1>{type} · Room {number}</h1>
            <p className="room-type">{type}</p>
          </div>

          <p className="room-description">{description}</p>

          {capacity && (
            <p className="roominfo-meta">
              <i className="fa-solid fa-user"></i> Sleeps {capacity}
            </p>
          )}

          {amenities && amenities.length > 0 && (
            <ul className="roominfo-amenities">
              {amenities.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          )}

          {!isLoggedIn && (
            <p className="auth-notice">
              <i className="fa-solid fa-lock"></i> Sign in to book this room.
            </p>
          )}

          <form className="booking-form" onSubmit={handleBooking} noValidate>
            <div className="booking-dates-grid">
              <div className="booking-form-row">
                <label htmlFor="check-in">Check in</label>
                <input
                  id="check-in"
                  type="date"
                  min={todayStr}
                  value={checkIn}
                  onChange={handleCheckInChange}
                  required
                />
              </div>

              <div className="booking-form-row">
                <label htmlFor="check-out">Check out</label>
                <input
                  id="check-out"
                  type="date"
                  min={minCheckOut}
                  value={checkOut}
                  onChange={handleCheckOutChange}
                  required
                />
              </div>
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <div className="booking-summary">
              <div className="booking-summary-line">
                <span>Stay duration</span>
                <span className="nights-badge">
                  <i className="fa-regular fa-moon"></i> {nights} {nights === 1 ? "night" : "nights"}
                </span>
              </div>
              <div className="booking-summary-line">
                <span>${price} × {validNights ? nights : 0} night{nights === 1 ? "" : "s"}</span>
                <span>${total}</span>
              </div>
              <div className="booking-summary-line total">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <div className="roominfo-footer">
              <p className="room-price">${price} <span>/ night</span></p>
              <button
                type="submit"
                className="a-btn"
                disabled={isBooking || (isLoggedIn && !validNights)}
              >
                {!isLoggedIn ? "Sign in to book" : isBooking ? "Booking..." : "Book this room"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Roominfo