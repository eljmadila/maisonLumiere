import React, { useState } from 'react'
import "../App.css"
import { Link, useNavigate } from "react-router-dom"

function Hero() {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")
  const [type, setType] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('guests', guests)
    if (type) params.set('type', type)
    navigate(`/rooms?${params.toString()}`)
  }

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
        <h2>Find your room</h2>
        <form className='form-elements' onSubmit={handleSearch}>
          <div className='elements'>
            <div>
              <label>Check in</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div>
              <label>Check out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
            <div>
              <label>Guests</label>
              <input type="number" placeholder='Number of guests...' value={guests} onChange={(e) => setGuests(e.target.value)} />
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