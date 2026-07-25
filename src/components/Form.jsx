import React, { useState } from 'react'
import "../App.css"
import { getTodayString, getNextDayString, calculateNights } from '../utils/dateUtils'

function Form({ onSearch, initialCheckIn = "", initialCheckOut = "" }) {
  const [checkIn, setCheckIn] = useState(initialCheckIn)
  const [checkOut, setCheckOut] = useState(initialCheckOut)
  const [guests, setGuests] = useState("")
  const [type, setType] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({ checkIn, checkOut, guests, type, maxPrice })
  }

  const todayStr = getTodayString()
  const minCheckOut = checkIn ? getNextDayString(checkIn) : getNextDayString()
  const nights = calculateNights(checkIn, checkOut)

  return (
    <div>
      <div className='form-header-bar'>
        {nights > 0 && (
          <span className='nights-badge'>
            <i className="fa-regular fa-moon"></i> {nights} {nights === 1 ? 'night' : 'nights'} stay
          </span>
        )}
      </div>
      <form className='form-rooms' onSubmit={handleSubmit}>
        <div>
          <label>Check in</label>
          <input
            type="date"
            min={todayStr}
            value={checkIn}
            onChange={handleCheckInChange}
            required
          />
        </div>
        <div>
          <label>Check out</label>
          <input
            type="date"
            value={checkOut}
            min={minCheckOut}
            onChange={handleCheckOutChange}
            required
          />
        </div>
        <div>
          <label>Guests (max:5)</label>
          <input
            type="number"
            placeholder='Number of guests...'
            min={1}
            max={5}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Type</label>
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
        <div>
          <label>Max price (100$-2000$)</label>
          <input
            type="number"
            placeholder='Enter your budget...'
            value={maxPrice}
            min={100}
            max={2000}
            onChange={(e) => setMaxPrice(e.target.value)}
            required
          />
        </div>

        <button type="submit" className='a-btn'>Apply</button>
      </form>
    </div>
  )
}

export default Form