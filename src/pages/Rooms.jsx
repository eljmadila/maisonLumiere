import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import "../App.css"
import Form from "../components/Form"
import Roomscard from "../components/Roomscard"
import { supabase } from '../supabaseClient'

function Rooms() {
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    supabase.from('rooms').select('*').then(({ data, error }) => {
        if (error) console.error(error)
        setRooms(data ?? [])
        const guests = searchParams.get('guests')
        const type = searchParams.get('type')
        const initial = (data ?? []).filter((room) => {
        if (guests && room.capacity < parseInt(guests, 10)) return false
        if (type && room.type !== type) return false
        return true
        })
        setFilteredRooms(initial)
        setLoading(false)
    })
    }, [])

  const handleSearch = ({ guests, type, maxPrice }) => {
    const filtered = rooms.filter((room) => {
      if (guests && room.capacity < parseInt(guests, 10)) return false
      if (type && room.type !== type) return false
      if (maxPrice && room.price > parseFloat(maxPrice)) return false
      return true
    })
    setFilteredRooms(filtered)
  }

  return (
    <div className='room-container'>
      <div className='room-header'>
        <h1>Our rooms</h1>
        <p>Filter by your dates, party size, and budget.</p>
      </div>

      <Form onSearch={handleSearch} />

      {loading ? (
        <p>Loading rooms...</p>
      ) : filteredRooms.length === 0 ? (
        <p className="stays-empty">No rooms match your search.</p>
      ) : (
        <div className='room-all'>
          {filteredRooms.map((room) => (
            <Roomscard 
              key={room.id}
              id={room.id}
              image={room.image_url}
              number={room.number} 
              type={room.type} 
              description={room.description} 
              price={room.price}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default Rooms