import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import InvoiceModal from '../components/InvoiceModal'
import "../App.css"

function Stays() {
  const { isLoggedIn, user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [checkingOutId, setCheckingOutId] = useState(null)
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    supabase
      .from('bookings')
      .select('*, rooms(*)')
      .eq('user_id', user.id)
      .neq('status', 'cancelled')
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
                <img src={booking.rooms?.image_url} alt={`${booking.rooms?.type} Room ${booking.rooms?.number}`} />
                <div className="room-card-content">
                  <div className="room-card-header">
                    <h2>{booking.rooms?.type} · Room {booking.rooms?.number}</h2>
                    <p className="room-type">{booking.nights} night{booking.nights > 1 ? "s" : ""}</p>
                  </div>
                  <p className="room-description">
                    ${booking.rooms?.price} / night &times; {booking.nights} night{booking.nights > 1 ? "s" : ""}
                  </p>
                  <div className="room-card-footer">
                    {isPaid ? (
                      <p className="room-price paid-badge">
                        Checked Out <span>${booking.total ? booking.total.toFixed(2) : '0.00'}</span>
                      </p>
                    ) : (
                      <p className="room-price">${booking.total ? booking.total.toFixed(2) : '0.00'} <span>total</span></p>
                    )}
                  </div>
                  <div className="stay-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="a-btn"
                      onClick={() => handleCheckout(booking)}
                      disabled={isPaid || checkingOutId === booking.id}
                      style={{ flex: 1 }}
                    >
                      {isPaid ? "Checked Out" : checkingOutId === booking.id ? "Processing..." : "Check out"}
                    </button>
                    <button
                      type="button"
                      style={{ background: '#333', color: '#c5a059', border: '1px solid #c5a059', padding: '0.6rem', borderRadius: '4px', cursor: 'pointer', flex: 1 }}
                      onClick={() => setSelectedInvoiceBooking(booking)}
                    >
                      <i className="fa-solid fa-file-invoice"></i> Invoice
                    </button>
                    {!isPaid && (
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => handleCancel(booking)}
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id ? "..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}
    </div>
  )
}

export default Stays