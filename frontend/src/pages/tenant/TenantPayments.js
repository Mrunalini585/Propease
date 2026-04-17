// src/pages/tenant/TenantPayments.js

import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../../services/api';

const STATUS_BADGE = { paid:'badge-green', pending:'badge-amber', overdue:'badge-red' };

export default function TenantPayments() {
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await paymentAPI.getAll();
        setPayments(res.data.payments);
      } catch (_) {}
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div style={{color:'var(--text3)',padding:20}}>Loading payments...</div>;

  const totalPaid    = payments.filter(p => p.status === 'paid').reduce((s,p) => s+p.amount, 0);
  const totalPending = payments.filter(p => p.status !== 'paid').reduce((s,p) => s+p.amount, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Payments</h1>
          <p className="page-subtitle">Your rent payment history</p>
        </div>
      </div>

      <div className="stats-grid" style={{marginBottom:20}}>
        <div className="stat-card"><div className="stat-label">Total Paid</div><div className="stat-value" style={{color:'var(--green)'}}>₹{totalPaid.toLocaleString()}</div></div>
        <div className="stat-card"><div className="stat-label">Pending / Overdue</div><div className="stat-value" style={{color:'var(--amber)'}}>₹{totalPending.toLocaleString()}</div></div>
        <div className="stat-card"><div className="stat-label">Total Records</div><div className="stat-value">{payments.length}</div></div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr><th>Month</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan="5"><div className="empty"><div className="empty-icon">💳</div><div className="empty-text">No payment records yet</div></div></td></tr>
            ) : payments.map(p => (
              <tr key={p._id}>
                <td style={{color:'var(--text)',fontWeight:500}}>{p.month || '—'}</td>
                <td style={{color:'var(--accent)',fontWeight:600}}>₹{p.amount?.toLocaleString()}</td>
                <td style={{fontSize:12,textTransform:'capitalize'}}>{p.method?.replace('_',' ')}</td>
                <td><span className={`badge ${STATUS_BADGE[p.status]||'badge-gray'}`}>{p.status}</span></td>
                <td style={{fontSize:12}}>{p.paidOn ? new Date(p.paidOn).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
