import React, { useState } from 'react'
import "../App.css"

function Form({ onSearch }) {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")
  const [type, setType] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({ checkIn, checkOut, guests, type, maxPrice })
  }

  return (
    <div>
      <form className='form-rooms' onSubmit={handleSubmit}>
        <div>
          <label>Check in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <label>Check out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div>
          <label>Guests</label>
          <input
            type="number"
            placeholder='Number of guests...'
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
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
          <label>Max price</label>
          <input
            type="number"
            placeholder='Enter your budget...'
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <button type="submit" className='a-btn'>Apply</button>
      </form>
    </div>
  )
}

export default Form