import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import "../App.css"

function Stays() {
  const { isLoggedIn, user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [checkingOutId, setCheckingOutId] = useState(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    supabase
      .from('bookings')
      .select('*, rooms(*)')
      .eq('user_id', user.id)
      .neq('status', 'cancelled') // les annulées ne remontent plus jamais, même après refresh
      .then(({ data }) => {
        setBookings(data ?? [])
        setLoading(false)
      })
  }, [user])

  const handleCheckout = async (booking) => {
    setCheckingOutId(booking.id)

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'checked-out' })
      .eq('id', booking.id)

    setCheckingOutId(null)

    if (error) {
      alert(`Couldn't check out: ${error.message}`)
      return
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: 'checked-out' } : b))
    )
  }

  const handleCancel = async (booking) => {
    const confirmCancel = window.confirm(
      `Cancel your reservation for Room ${booking.rooms.number}?`
    )
    if (!confirmCancel) return

    setCancellingId(booking.id)

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', booking.id)

    setCancellingId(null)

    if (error) {
      alert(`Couldn't cancel this reservation: ${error.message}`)
      return
    }

    // retiré définitivement — la requête au chargement l'exclut désormais aussi
    setBookings((prev) => prev.filter((b) => b.id !== booking.id))
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="room-container">
      <div className="room-header">
        <h1>Your stays</h1>
        <p>Everything you've booked, in one place.</p>
      </div>

      {loading ? (
        <p>Loading your stays...</p>
      ) : bookings.length === 0 ? (
        <div className="stays-empty">
          <p>You haven't booked a room yet.</p>
          <Link to="/rooms" className="view-link">
            <span>Browse rooms</span> <span><i className="fa-solid fa-arrow-right-long"></i></span>
          </Link>
        </div>
      ) : (
        <div className="room-all">
          {bookings.map((booking) => {
            const isPaid = booking.status === 'checked-out'
            return (
              <div className="room-card" key={booking.id}>
                <img src={booking.rooms.image_url} alt={`${booking.rooms.type} Room ${booking.rooms.number}`} />
                <div className="room-card-content">
                  <div className="room-card-header">
                    <h2>{booking.rooms.type} · Room {booking.rooms.number}</h2>
                    <p className="room-type">{booking.nights} night{booking.nights > 1 ? "s" : ""}</p>
                  </div>
                  <p className="room-description">
                    ${booking.rooms.price} / night &times; {booking.nights} night{booking.nights > 1 ? "s" : ""}
                  </p>
                  <div className="room-card-footer">
                    {isPaid ? (
                      <p className="room-price paid-badge">
                        Paid <span>${booking.total.toFixed(2)}</span>
                      </p>
                    ) : (
                      <p className="room-price">${booking.total.toFixed(2)} <span>total</span></p>
                    )}
                  </div>
                  <div className="stay-actions">
                    <button
                      type="button"
                      className="a-btn"
                      onClick={() => handleCheckout(booking)}
                      disabled={isPaid || checkingOutId === booking.id}
                    >
                      {isPaid ? "Paid" : checkingOutId === booking.id ? "Processing..." : "Check out"}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => handleCancel(booking)}
                      disabled={cancellingId === booking.id}
                    >
                      {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Stays