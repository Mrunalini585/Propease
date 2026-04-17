// src/pages/tenant/TenantProperties.js

import React, { useEffect, useState } from 'react';
import { propertyAPI } from '../../services/api';

const TYPE_ICONS = { apartment:'🏢', house:'🏠', studio:'🛋️', villa:'🏰', commercial:'🏬' };

export default function TenantProperties() {
  const [properties,   setProperties] = useState([]);
  const [loading,      setLoading]    = useState(true);
  const [search,       setSearch]     = useState('');
  const [filter,       setFilter]     = useState('all');
  const [bookingModal, setBookingModal] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [submitting,   setSubmitting]   = useState(false);

  const fetchProperties = async () => {
    try {
      const res = await propertyAPI.getAll();
      setProperties(res.data.properties);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await propertyAPI.bookProperty(bookingModal._id, { paymentMethod });
      setBookingModal(null);
      fetchProperties(); // refresh list
      // Option: show toast if it was passed via props
    } catch (error) {
      console.error(error);
      alert('Error booking property');
    }
    setSubmitting(false);
  };

  const filtered = properties.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.city?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={{color:'var(--text3)',padding:20}}>Loading properties...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Properties</h1>
          <p className="page-subtitle">Browse available rental listings</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <input
          className="form-input"
          style={{flex:1,minWidth:200}}
          placeholder="🔍 Search by name or city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="form-select" style={{width:160}} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty card"><div className="empty-icon">🔍</div><div className="empty-text">No properties found</div></div>
      ) : (
        <div className="prop-grid">
          {filtered.map(prop => (
            <div key={prop._id} className="prop-card">
              <div className="prop-card-img">
                <span>{TYPE_ICONS[prop.type] || '🏠'}</span>
                <span style={{position:'absolute',top:10,right:10}}>
                  <span className={`badge badge-${prop.status==='available'?'green':prop.status==='occupied'?'accent':'amber'}`}>{prop.status}</span>
                </span>
              </div>
              <div className="prop-card-body">
                <div className="prop-card-title">{prop.title}</div>
                <div className="prop-card-addr">📍 {[prop.address?.city, prop.address?.state].filter(Boolean).join(', ') || 'Location not set'}</div>
                <div className="prop-card-rent">₹{prop.rent?.toLocaleString()}<span style={{fontSize:12,color:'var(--text3)',fontWeight:400}}>/month</span></div>
                <div className="prop-card-meta">
                  <span>🛏 {prop.bedrooms} bed</span>
                  <span>🚿 {prop.bathrooms} bath</span>
                  {prop.area > 0 && <span>📐 {prop.area} sqft</span>}
                </div>
                {prop.amenities?.length > 0 && (
                  <div style={{marginTop:8,display:'flex',gap:4,flexWrap:'wrap'}}>
                    {prop.amenities.slice(0,3).map(a => (
                      <span key={a} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:5,padding:'2px 7px',fontSize:10.5,color:'var(--text3)'}}>✓ {a}</span>
                    ))}
                    {prop.amenities.length > 3 && <span style={{fontSize:10.5,color:'var(--text3)'}}>+{prop.amenities.length-3} more</span>}
                  </div>
                )}
                {prop.description && (
                  <p style={{fontSize:12,color:'var(--text3)',marginTop:8,lineHeight:1.5}}>{prop.description.slice(0,80)}{prop.description.length>80?'...':''}</p>
                )}
                {prop.owner && (
                  <div style={{marginTop:10,fontSize:12,color:'var(--text3)'}}>🏢 Owner: {prop.owner.name}</div>
                )}
                <div className="prop-card-actions" style={{marginTop: 12}}>
                  {prop.status === 'available' ? (
                    <button className="btn btn-primary btn-sm" style={{width:'100%'}} onClick={() => setBookingModal(prop)}>
                      Book Property
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking / Payment Modal */}
      {bookingModal && (
        <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && setBookingModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Book {bookingModal.title}</span>
              <button className="modal-close" onClick={() => setBookingModal(null)}>✕</button>
            </div>
            
            <div style={{marginBottom: 20}}>
              <p style={{fontSize:14, color:'var(--text2)', marginBottom:10}}>
                You are about to book this property. The initial amount required is rent + deposit.
              </p>
              <div style={{background:'var(--bg3)', padding:12, borderRadius:8, display:'flex', flexDirection:'column', gap:8}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>Monthly Rent:</span>
                  <strong>₹{bookingModal.rent?.toLocaleString()}</strong>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>Security Deposit:</span>
                  <strong>₹{(bookingModal.deposit || 0).toLocaleString()}</strong>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', borderTop:'1px solid var(--border)', paddingTop:8, marginTop:4}}>
                  <span>Total Payable:</span>
                  <strong style={{color:'var(--accent)', fontSize:16}}>₹{((bookingModal.rent || 0) + (bookingModal.deposit || 0)).toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleBook}>
              <div className="form-group">
                <label>Select Payment Method *</label>
                <select className="form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} required>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Netbanking</option>
                  <option value="online">Debit / Credit Card</option>
                </select>
              </div>

              {paymentMethod === 'upi' && (
                <div className="form-group">
                  <label>Enter UPI ID</label>
                  <input className="form-input" placeholder="e.g. username@bank" required />
                </div>
              )}
              {paymentMethod === 'netbanking' && (
                <div className="form-group">
                  <label>Select Bank</label>
                  <select className="form-select" required>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India</option>
                  </select>
                </div>
              )}

              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20}}>
                <button type="button" className="btn btn-ghost" onClick={() => setBookingModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Processing...' : 'Pay & Book Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
