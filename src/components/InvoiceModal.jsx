import React from 'react'

function InvoiceModal({ booking, onClose }) {
  if (!booking) return null

  const room = booking.rooms || {}
  const nights = booking.check_in && booking.check_out ? 
    Math.max(1, Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24))) : 1
  
  const roomPrice = parseFloat(room.price || booking.total_price || 0)
  const roomTotal = roomPrice * nights
  const serviceCharge = roomTotal * 0.10 // 10%
  const vatTax = roomTotal * 0.16 // 16% VAT
  const grandTotal = roomTotal + serviceCharge + vatTax

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content printable-invoice" style={{
        background: '#ffffff', color: '#111111', borderRadius: '12px',
        padding: '2.5rem', width: '90%', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #c5a059', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: '#111', fontSize: '1.8rem' }}>Maison Lumière</h1>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>EST. 2026 · Luxury Hotel & Suites</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ margin: 0, color: '#c5a059' }}>OFFICIAL INVOICE</h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>#INV-{booking.id?.substring(0, 8) || '2026-001'}</p>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Guest & Stay Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', fontWeight: 'bold' }}>Guest Reference</p>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Booking ID: {booking.id}</p>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#444' }}>Status: <strong style={{ color: '#2b8a3e', textTransform: 'capitalize' }}>{booking.status}</strong></p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', fontWeight: 'bold' }}>Reservation Details</p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Room {room.number} ({room.type})</p>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#555' }}>
              {booking.check_in} → {booking.check_out} ({nights} Night{nights > 1 ? 's' : ''})
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.5rem 0' }}>Description</th>
              <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>Rate</th>
              <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.8rem 0' }}>Room Accommodation ({room.type})</td>
              <td style={{ padding: '0.8rem 0', textAlign: 'center' }}>${roomPrice.toFixed(2)}</td>
              <td style={{ padding: '0.8rem 0', textAlign: 'center' }}>{nights} night(s)</td>
              <td style={{ padding: '0.8rem 0', textAlign: 'right', fontWeight: 'bold' }}>${roomTotal.toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.8rem 0' }}>Service Charge (10%)</td>
              <td style={{ padding: '0.8rem 0', textAlign: 'center' }}>-</td>
              <td style={{ padding: '0.8rem 0', textAlign: 'center' }}>1</td>
              <td style={{ padding: '0.8rem 0', textAlign: 'right' }}>${serviceCharge.toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.8rem 0' }}>VAT Tax (16%)</td>
              <td style={{ padding: '0.8rem 0', textAlign: 'center' }}>-</td>
              <td style={{ padding: '0.8rem 0', textAlign: 'center' }}>1</td>
              <td style={{ padding: '0.8rem 0', textAlign: 'right' }}>${vatTax.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Summary Totals */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', borderTop: '2px solid #111', paddingTop: '0.8rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontSize: '0.9rem' }}>
            <span>Subtotal:</span>
            <span>${roomTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontSize: '0.9rem' }}>
            <span>Taxes & Fees:</span>
            <span>${(serviceCharge + vatTax).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontSize: '1.2rem', fontWeight: 'bold', color: '#111', marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid #ddd' }}>
            <span>Total Amount:</span>
            <span style={{ color: '#c5a059' }}>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} style={{ padding: '0.6rem 1.2rem', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Close
          </button>
          <button onClick={handlePrint} style={{ padding: '0.6rem 1.2rem', background: '#c5a059', color: '#111', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            <i className="fa-solid fa-print"></i> Print Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceModal
