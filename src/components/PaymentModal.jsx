import React, { useState } from 'react'

function PaymentModal({ room, checkIn, checkOut, nights, total, onPaymentSuccess, onClose }) {
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892')
  const [expiry, setExpiry] = useState('12/28')
  const [cvv, setCvv] = useState('321')
  const [paymentType, setPaymentType] = useState('deposit') // 'deposit' (50%) or 'full' (100%)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const depositAmount = (parseFloat(total) * 0.5).toFixed(2)
  const amountToPay = paymentType === 'deposit' ? depositAmount : total

  const handlePay = (e) => {
    e.preventDefault()
    if (!cardNumber || !expiry || !cvv) {
      setError('Please provide valid card details.')
      return
    }

    setProcessing(true)
    setError('')

    // Simulate Payment Gateway processing delay
    setTimeout(() => {
      setProcessing(false)
      onPaymentSuccess({
        paymentType,
        amountPaid: amountToPay,
        depositPaid: depositAmount,
        totalAmount: total,
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
      })
    }, 1500)
  }

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        background: '#181715', border: '1px solid #333', borderRadius: '12px',
        padding: '2rem', width: '90%', maxWidth: '480px', color: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#c5a059', margin: 0 }}>Payment Gateway</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.2rem', cursor: 'pointer' }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={{ background: '#222', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Room {room.number} — {room.type}</p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>
            {checkIn} to {checkOut} ({nights} night{nights > 1 ? 's' : ''})
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px dashed #444' }}>
            <span>Total Booking Cost:</span>
            <span style={{ fontWeight: 'bold', color: '#c5a059' }}>${total}</span>
          </div>
        </div>

        <form onSubmit={handlePay}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Payment Option</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: paymentType === 'deposit' ? '#2c271e' : '#1c1b18', border: '1px solid #444', padding: '0.6rem 1rem', borderRadius: '6px', flex: 1 }}>
                <input type="radio" name="payType" value="deposit" checked={paymentType === 'deposit'} onChange={() => setPaymentType('deposit')} />
                <span>50% Deposit (${depositAmount})</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: paymentType === 'full' ? '#2c271e' : '#1c1b18', border: '1px solid #444', padding: '0.6rem 1rem', borderRadius: '6px', flex: 1 }}>
                <input type="radio" name="payType" value="full" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} />
                <span>Full Amount (${total})</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Card Number"
              required
              style={{ width: '100%', padding: '0.75rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                required
                style={{ width: '100%', padding: '0.75rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '6px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                required
                style={{ width: '100%', padding: '0.75rem', background: '#1c1b18', border: '1px solid #444', color: '#fff', borderRadius: '6px' }}
              />
            </div>
          </div>

          {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

          <button
            type="submit"
            disabled={processing}
            style={{
              width: '100%', padding: '0.9rem', background: '#c5a059', color: '#111',
              border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem',
              cursor: processing ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease'
            }}
          >
            {processing ? 'Processing Payment...' : `Pay $${amountToPay} Now`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PaymentModal
