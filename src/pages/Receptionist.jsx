import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import InvoiceModal from '../components/InvoiceModal'
import { getTodayString } from '../utils/dateUtils'
import "../App.css"

function Receptionist() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('today') // 'today' or 'all'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const todayStr = getTodayString()

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*, rooms(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading receptionist bookings:', error)
    } else {
      setBookings(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleStatusChange = async (bookingId, newStatus) => {
    setActionLoadingId(bookingId)
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)

    setActionLoadingId(null)

    if (error) {
      alert(`Error updating status: ${error.message}`)
      return
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    )
  }

  const todayArrivals = bookings.filter((b) => b.check_in === todayStr)
  const todayDepartures = bookings.filter((b) => b.check_out === todayStr)

  const filteredBookings = bookings.filter((b) => {
    const searchLower = searchTerm.toLowerCase()
    const roomNum = b.rooms?.number?.toString() || ''
    const roomType = b.rooms?.type?.toLowerCase() || ''
    const bookingId = b.id?.toLowerCase() || ''
    const status = b.status?.toLowerCase() || ''
    return roomNum.includes(searchLower) || roomType.includes(searchLower) || bookingId.includes(searchLower) || status.includes(searchLower)
  })

  return (
    <div className="room-container">
      <div className="room-header">
        <h1>Front Desk & Reception Dashboard</h1>
        <p>Manage guest arrivals, check-ins, check-outs, and billing in real-time.</p>
      </div>

      {/* Reception Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #333', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('today')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'today' ? '#c5a059' : '#aaa',
            borderBottom: activeTab === 'today' ? '2px solid #c5a059' : '2px solid transparent',
            padding: '0.8rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem'
          }}
        >
          <i className="fa-solid fa-calendar-day"></i> Today's Activity ({todayArrivals.length + todayDepartures.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'all' ? '#c5a059' : '#aaa',
            borderBottom: activeTab === 'all' ? '2px solid #c5a059' : '2px solid transparent',
            padding: '0.8rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem'
          }}
        >
          <i className="fa-solid fa-list-check"></i> All Reservations ({bookings.length})
        </button>
      </div>

      {loading ? (
        <p>Loading reception data...</p>
      ) : activeTab === 'today' ? (
        <div>
          {/* Today's Arrivals */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#c5a059', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
              <i className="fa-solid fa-door-open"></i> Today's Check-ins ({todayArrivals.length})
            </h2>
            {todayArrivals.length === 0 ? (
              <p style={{ color: '#888' }}>No check-ins scheduled for today ({todayStr}).</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {todayArrivals.map((b) => (
                  <div key={b.id} style={{ background: '#1c1b18', border: '1px solid #333', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Room {b.rooms?.number} ({b.rooms?.type})</h3>
                      <p style={{ margin: '0.2rem 0', color: '#aaa', fontSize: '0.9rem' }}>
                        Booking ID: <code>{b.id}</code> · {b.nights} night(s)
                      </p>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>
                        Status: <span style={{ color: b.status === 'checked-in' ? '#51cf66' : '#fcc419', fontWeight: 'bold', textTransform: 'capitalize' }}>{b.status || 'Booked'}</span>
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {b.status !== 'checked-in' && b.status !== 'checked-out' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'checked-in')}
                          disabled={actionLoadingId === b.id}
                          style={{ background: '#2b8a3e', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          {actionLoadingId === b.id ? 'Updating...' : 'Check In Guest'}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoice(b)}
                        style={{ background: '#333', color: '#c5a059', border: '1px solid #c5a059', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <i className="fa-solid fa-file-invoice"></i> Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Departures */}
          <div>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#c5a059', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
              <i className="fa-solid fa-person-walking-luggage"></i> Today's Check-outs ({todayDepartures.length})
            </h2>
            {todayDepartures.length === 0 ? (
              <p style={{ color: '#888' }}>No check-outs scheduled for today ({todayStr}).</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {todayDepartures.map((b) => (
                  <div key={b.id} style={{ background: '#1c1b18', border: '1px solid #333', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Room {b.rooms?.number} ({b.rooms?.type})</h3>
                      <p style={{ margin: '0.2rem 0', color: '#aaa', fontSize: '0.9rem' }}>
                        Booking ID: <code>{b.id}</code>
                      </p>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>
                        Status: <span style={{ color: b.status === 'checked-out' ? '#888' : '#3b5bdb', fontWeight: 'bold', textTransform: 'capitalize' }}>{b.status}</span>
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {b.status !== 'checked-out' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'checked-out')}
                          disabled={actionLoadingId === b.id}
                          style={{ background: '#e03131', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          {actionLoadingId === b.id ? 'Updating...' : 'Complete Check-out'}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoice(b)}
                        style={{ background: '#333', color: '#c5a059', border: '1px solid #c5a059', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <i className="fa-solid fa-file-invoice"></i> Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Search Box */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Room Number, Type, Status, or Booking ID..."
              style={{ width: '100%', padding: '0.8rem 1rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '8px', fontSize: '1rem' }}
            />
          </div>

          {/* All Bookings Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1c1b18', borderRadius: '8px' }}>
              <thead>
                <tr style={{ background: '#25231f', textAlign: 'left', color: '#c5a059', borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '1rem' }}>Room</th>
                  <th style={{ padding: '1rem' }}>Dates</th>
                  <th style={{ padding: '1rem' }}>Nights</th>
                  <th style={{ padding: '1rem' }}>Total</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No reservations found.</td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #2a2824' }}>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                        Room {b.rooms?.number} <br />
                        <span style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 'normal' }}>{b.rooms?.type}</span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                        {b.check_in} → {b.check_out}
                      </td>
                      <td style={{ padding: '1rem' }}>{b.nights}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold', color: '#c5a059' }}>${b.total ? b.total.toFixed(2) : '0.00'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'capitalize',
                          background: b.status === 'checked-in' ? 'rgba(81, 207, 102, 0.2)' : b.status === 'checked-out' ? 'rgba(136, 136, 136, 0.2)' : 'rgba(252, 196, 25, 0.2)',
                          color: b.status === 'checked-in' ? '#51cf66' : b.status === 'checked-out' ? '#aaa' : '#fcc419'
                        }}>
                          {b.status || 'Booked'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          {b.status !== 'checked-in' && b.status !== 'checked-out' && b.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'checked-in')}
                              disabled={actionLoadingId === b.id}
                              style={{ background: '#2b8a3e', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              Check In
                            </button>
                          )}
                          {b.status === 'checked-in' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'checked-out')}
                              disabled={actionLoadingId === b.id}
                              style={{ background: '#e03131', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              Check Out
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoice(b)}
                            style={{ background: '#333', color: '#c5a059', border: '1px solid #c5a059', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <InvoiceModal
          booking={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  )
}

export default Receptionist
