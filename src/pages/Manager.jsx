import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import "../App.css"

function Manager() {
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // Room Form State (Add / Edit)
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [roomNumber, setRoomNumber] = useState('')
  const [roomType, setRoomType] = useState('Deluxe Suite')
  const [capacity, setCapacity] = useState(2)
  const [price, setPrice] = useState(150)
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80')
  const [status, setStatus] = useState('available')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const { data: roomData } = await supabase.from('rooms').select('*').order('number', { ascending: true })
    const { data: bookingData } = await supabase.from('bookings').select('*')
    setRooms(roomData ?? [])
    setBookings(bookingData ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Metrics Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.total) || 0), 0)
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0

  const handleOpenAdd = () => {
    setEditingRoom(null)
    setRoomNumber(Math.floor(100 + Math.random() * 900).toString())
    setRoomType('Executive Suite')
    setCapacity(2)
    setPrice(220)
    setDescription('A luxurious suite featuring breathtaking views, modern amenities, and supreme comfort.')
    setImageUrl('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80')
    setStatus('available')
    setShowRoomModal(true)
  }

  const handleOpenEdit = (room) => {
    setEditingRoom(room)
    setRoomNumber(room.number)
    setRoomType(room.type)
    setCapacity(room.capacity || 2)
    setPrice(room.price)
    setDescription(room.description || '')
    setImageUrl(room.image_url || '')
    setStatus(room.status || 'available')
    setShowRoomModal(true)
  }

  const handleDeleteRoom = async (roomId, number) => {
    if (!window.confirm(`Are you sure you want to remove Room ${number} from inventory?`)) return

    const { error } = await supabase.from('rooms').delete().eq('id', roomId)
    if (error) {
      alert(`Could not delete room: ${error.message}`)
    } else {
      setRooms((prev) => prev.filter((r) => r.id !== roomId))
    }
  }

  const handleSaveRoom = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      number: roomNumber,
      type: roomType,
      capacity: parseInt(capacity, 10),
      price: parseFloat(price),
      description,
      image_url: imageUrl,
      status,
    }

    if (editingRoom) {
      const { error } = await supabase.from('rooms').update(payload).eq('id', editingRoom.id)
      if (error) alert(`Error updating room: ${error.message}`)
    } else {
      const { error } = await supabase.from('rooms').insert(payload)
      if (error) alert(`Error creating room: ${error.message}`)
    }

    setIsSubmitting(false)
    setShowRoomModal(false)
    fetchData()
  }

  return (
    <div className="room-container">
      <div className="room-header">
        <h1>Hotel Management & Inventory Dashboard</h1>
        <p>Overview of revenue metrics, room inventory control, and operational analytics.</p>
      </div>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          {/* Executive Summary Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
            <div style={{ background: '#1c1b18', border: '1px solid #333', borderRadius: '10px', padding: '1.5rem', textAlign: 'center' }}>
              <i className="fa-solid fa-dollar-sign" style={{ fontSize: '1.8rem', color: '#c5a059', marginBottom: '0.5rem' }}></i>
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>${totalRevenue.toFixed(2)}</h3>
              <p style={{ margin: '0.4rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>Total Gross Revenue</p>
            </div>

            <div style={{ background: '#1c1b18', border: '1px solid #333', borderRadius: '10px', padding: '1.5rem', textAlign: 'center' }}>
              <i className="fa-solid fa-bed" style={{ fontSize: '1.8rem', color: '#51cf66', marginBottom: '0.5rem' }}></i>
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>{rooms.length}</h3>
              <p style={{ margin: '0.4rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>Total Rooms in Inventory</p>
            </div>

            <div style={{ background: '#1c1b18', border: '1px solid #333', borderRadius: '10px', padding: '1.5rem', textAlign: 'center' }}>
              <i className="fa-solid fa-chart-pie" style={{ fontSize: '1.8rem', color: '#339af0', marginBottom: '0.5rem' }}></i>
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>{occupancyRate}%</h3>
              <p style={{ margin: '0.4rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>Current Occupancy Rate</p>
            </div>

            <div style={{ background: '#1c1b18', border: '1px solid #333', borderRadius: '10px', padding: '1.5rem', textAlign: 'center' }}>
              <i className="fa-solid fa-bookmark" style={{ fontSize: '1.8rem', color: '#fcc419', marginBottom: '0.5rem' }}></i>
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>{bookings.length}</h3>
              <p style={{ margin: '0.4rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>Total Reservations</p>
            </div>
          </div>

          {/* Room Inventory Management Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#c5a059', margin: 0 }}>Room Inventory Management</h2>
            <button
              onClick={handleOpenAdd}
              style={{ background: '#c5a059', color: '#111', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-plus"></i> Add New Room
            </button>
          </div>

          {/* Inventory Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1c1b18', borderRadius: '8px' }}>
              <thead>
                <tr style={{ background: '#25231f', textAlign: 'left', color: '#c5a059', borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '1rem' }}>Room #</th>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>Capacity</th>
                  <th style={{ padding: '1rem' }}>Price / Night</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} style={{ borderBottom: '1px solid #2a2824' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>Room {room.number}</td>
                    <td style={{ padding: '1rem' }}>{room.type}</td>
                    <td style={{ padding: '1rem' }}>{room.capacity || 2} guests</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: '#c5a059' }}>${room.price}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'capitalize',
                        background: room.status === 'occupied' ? 'rgba(224, 49, 49, 0.2)' : room.status === 'under maintenance' ? 'rgba(252, 196, 25, 0.2)' : 'rgba(81, 207, 102, 0.2)',
                        color: room.status === 'occupied' ? '#ff6b6b' : room.status === 'under maintenance' ? '#fcc419' : '#51cf66'
                      }}>
                        {room.status || 'available'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEdit(room)}
                          style={{ background: '#333', color: '#fff', border: '1px solid #555', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id, room.number)}
                          style={{ background: 'rgba(224, 49, 49, 0.2)', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          <i className="fa-solid fa-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add / Edit Room Modal */}
      {showRoomModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: '#181715', border: '1px solid #333', borderRadius: '12px',
            padding: '2rem', width: '90%', maxWidth: '520px', color: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: '#c5a059', margin: 0 }}>
                {editingRoom ? `Edit Room ${editingRoom.number}` : 'Add New Room'}
              </h2>
              <button onClick={() => setShowRoomModal(false)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.2rem', cursor: 'pointer' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveRoom}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Room Number</label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Price ($ / night)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Room Type</label>
                  <input
                    type="text"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Capacity (Guests)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '6px' }}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="under maintenance">Under Maintenance</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '0.7rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  style={{ width: '100%', padding: '0.7rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '6px', resize: 'vertical' }}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%', padding: '0.9rem', background: '#c5a059', color: '#111',
                  border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Saving...' : editingRoom ? 'Update Room Details' : 'Add Room to Inventory'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Manager
