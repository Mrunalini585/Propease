// src/pages/tenant/TenantHome.js

import React, { useEffect, useState } from 'react';
import { tenantAPI, paymentAPI, maintenanceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function TenantHome({ onNavigate }) {
  const { user }   = useAuth();
  const [home,     setHome]     = useState(null);
  const [payments, setPayments] = useState([]);
  const [maint,    setMaint]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [hRes, pRes, mRes] = await Promise.all([
          tenantAPI.getMyHome(),
          paymentAPI.getAll(),
          maintenanceAPI.getAll()
        ]);
        setHome(hRes.data.property);
        setPayments(pRes.data.payments);
        setMaint(mRes.data.requests);
      } catch (_) {}
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <div style={{color:'var(--text3)',padding:20}}>Loading your home...</div>;

  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue');
  const pendingMaint    = maint.filter(m => m.status === 'pending');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Here's everything about your rental.</p>
        </div>
      </div>

      {!home ? (
        <div className="card" style={{textAlign:'center',padding:40}}>
          <div style={{fontSize:48,marginBottom:14}}>🏚️</div>
          <h3 style={{fontFamily:'var(--font2)',color:'var(--text)',marginBottom:8}}>No Property Assigned Yet</h3>
          <p style={{color:'var(--text3)',fontSize:13,marginBottom:18}}>Your owner hasn't assigned you to a property yet. Browse available listings below!</p>
          <button className="btn btn-primary" onClick={() => onNavigate('properties')}>🔍 Browse Properties</button>
        </div>
      ) : (
        <>
          {/* Property card */}
          <div className="card" style={{marginBottom:20,borderTop:'3px solid var(--accent)'}}>
            <div style={{display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap'}}>
              <div style={{fontSize:52}}>🏢</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                  <h2 style={{fontFamily:'var(--font2)',fontSize:18,fontWeight:700,color:'var(--text)'}}>{home.title}</h2>
                  <span className="badge badge-green">Your Home</span>
                </div>
                <p style={{fontSize:13,color:'var(--text3)',marginBottom:10}}>
                  📍 {[home.address?.street, home.address?.city, home.address?.state].filter(Boolean).join(', ') || 'Address not set'}
                </p>
                <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
                  <div><div style={{fontSize:11,color:'var(--text3)'}}>MONTHLY RENT</div><div style={{fontSize:20,fontWeight:700,color:'var(--accent)',fontFamily:'var(--font2)'}}>₹{home.rent?.toLocaleString()}</div></div>
                  <div><div style={{fontSize:11,color:'var(--text3)'}}>DEPOSIT</div><div style={{fontSize:20,fontWeight:700,color:'var(--text)',fontFamily:'var(--font2)'}}>₹{home.deposit?.toLocaleString() || 0}</div></div>
                  <div><div style={{fontSize:11,color:'var(--text3)'}}>BEDROOMS</div><div style={{fontSize:20,fontWeight:700,color:'var(--text)',fontFamily:'var(--font2)'}}>{home.bedrooms}</div></div>
                  <div><div style={{fontSize:11,color:'var(--text3)'}}>AREA</div><div style={{fontSize:20,fontWeight:700,color:'var(--text)',fontFamily:'var(--font2)'}}>{home.area || '—'} sqft</div></div>
                </div>
                {home.amenities?.length > 0 && (
                  <div style={{marginTop:12,display:'flex',gap:6,flexWrap:'wrap'}}>
                    {home.amenities.map(a => (
                      <span key={a} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:6,padding:'3px 9px',fontSize:11.5,color:'var(--text2)'}}>✓ {a}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Owner contact */}
            {home.owner && (
              <div style={{marginTop:18,paddingTop:16,borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),var(--purple))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff'}}>
                    {home.owner.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{home.owner.name}</div>
                    <div style={{fontSize:11.5,color:'var(--text3)'}}>{home.owner.email} · {home.owner.phone}</div>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => onNavigate('messages')}>💬 Message Owner</button>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="stats-grid">
            <div className="stat-card" style={{cursor:'pointer'}} onClick={() => onNavigate('payments')}>
              <div className="stat-label">Pending Payments</div>
              <div className="stat-value" style={{color: pendingPayments.length > 0 ? 'var(--amber)' : 'var(--green)'}}>{pendingPayments.length}</div>
              <div className="stat-sub">Click to view</div>
            </div>
            <div className="stat-card" style={{cursor:'pointer'}} onClick={() => onNavigate('maintenance')}>
              <div className="stat-label">Open Requests</div>
              <div className="stat-value" style={{color:'var(--accent)'}}>{pendingMaint.length}</div>
              <div className="stat-sub">maintenance requests</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
