import React, { useState } from 'react'
import "../App.css"
import { Link, useNavigate } from "react-router-dom"
import { getTodayString, getNextDayString, calculateNights } from '../utils/dateUtils'

function Hero() {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")
  const [type, setType] = useState("")

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

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('guests', guests)
    if (type) params.set('type', type)
    navigate(`/rooms?${params.toString()}`)
  }

  const todayStr = getTodayString()
  const minCheckOut = checkIn ? getNextDayString(checkIn) : getNextDayString()
  const nights = calculateNights(checkIn, checkOut)

  return (
    <div className='hero'>
      <div className='hero-container'>
        <div className='hero-content'>
          <div className='line'></div>
          <p>SINCE 2026</p>
          <div className='line'></div>
        </div>
        <h1>A warm retreat in the heart of the city.</h1>
        <p className='p'>Cream-lit rooms, deep-green calm, and brass details. Stay a night — or a season.</p>
        <div className='hero-btns'>
          <Link to="/rooms">
            <button className='h-btn1'>Explore rooms</button>
          </Link>
        </div>
      </div>

      <div className='hero-form'>
        <div className='hero-form-header'>
          <h2>Find your room</h2>
          {nights > 0 && (
            <span className='nights-badge'>
              <i className="fa-regular fa-moon"></i> {nights} {nights === 1 ? 'night' : 'nights'}
            </span>
          )}
        </div>
        <form className='form-elements' onSubmit={handleSearch}>
          <div className='elements'>
            <div>
              <label>Check in</label>
              <input 
                type="date" 
                value={checkIn} 
                onChange={handleCheckInChange} 
                min={todayStr} 
                required
              />
            </div>
            <div>
              <label>Check out</label>
              <input 
                type="date" 
                value={checkOut} 
                onChange={handleCheckOutChange} 
                min={minCheckOut} 
                required
              />
            </div>
            <div>
              <label>Guests (max:5)</label>
              <input 
                type="number" 
                placeholder='Number of guests...' 
                min={1} max={5} 
                value={guests} 
                onChange={(e) => setGuests(e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="room-type">Room type</label>
              <div className="select-wrapper">
                <select
                  name="roomType"
                  id="room-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Family">Family</option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" className='s-btn'>Search availability</button>
        </form>
      </div>
    </div>
  )
}

export default Hero