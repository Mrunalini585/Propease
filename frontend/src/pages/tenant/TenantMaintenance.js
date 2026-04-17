// src/pages/tenant/TenantMaintenance.js

import React, { useEffect, useState } from 'react';
import { maintenanceAPI, tenantAPI } from '../../services/api';

const STATUS_BADGE  = { pending:'badge-amber', 'in-progress':'badge-accent', completed:'badge-green', rejected:'badge-red' };
const PRIORITY_ICON = { low:'🟢', medium:'🟡', high:'🔴' };

export default function TenantMaintenance({ showToast }) {
  const [requests, setRequests] = useState([]);
  const [home,     setHome]     = useState(null);
  const [modal,    setModal]    = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({ title:'', description:'', category:'other', priority:'medium' });

  const fetchAll = async () => {
    try {
      const [rRes, hRes] = await Promise.all([
        maintenanceAPI.getAll(),
        tenantAPI.getMyHome()
      ]);
      setRequests(rRes.data.requests);
      setHome(hRes.data.property);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!home) { showToast('You need to be assigned to a property first', '⚠️'); return; }
    setSaving(true);
    try {
      await maintenanceAPI.create({ ...form, property: home._id });
      showToast('Request submitted!', '🔧');
      setModal(false);
      setForm({ title:'', description:'', category:'other', priority:'medium' });
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting', '❌');
    }
    setSaving(false);
  };

  if (loading) return <div style={{color:'var(--text3)',padding:20}}>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance</h1>
          <p className="page-subtitle">{requests.length} requests total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)} disabled={!home}>
          ➕ New Request
        </button>
      </div>

      {!home && (
        <div className="card" style={{marginBottom:16,borderLeft:'3px solid var(--amber)'}}>
          <p style={{fontSize:13,color:'var(--amber)'}}>⚠️ You must be assigned to a property before submitting maintenance requests.</p>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="empty card"><div className="empty-icon">🔧</div><div className="empty-text">No maintenance requests yet</div></div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {requests.map(r => (
            <div key={r._id} className="card" style={{display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{fontSize:22,marginTop:2}}>{PRIORITY_ICON[r.priority]||'⚪'}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                  <span style={{fontWeight:600,color:'var(--text)',fontSize:14}}>{r.title}</span>
                  <span className={`badge ${STATUS_BADGE[r.status]||'badge-gray'}`}>{r.status}</span>
                  <span className="badge badge-gray">{r.priority}</span>
                  <span className="badge badge-gray">{r.category}</span>
                </div>
                <div style={{fontSize:13,color:'var(--text2)',marginBottom:r.ownerNote?8:0}}>{r.description}</div>
                {r.ownerNote && (
                  <div style={{fontSize:12,color:'var(--accent)',background:'rgba(108,143,255,.07)',padding:'6px 10px',borderRadius:7,borderLeft:'3px solid var(--accent)'}}>
                    💬 Owner: {r.ownerNote}
                  </div>
                )}
                <div style={{fontSize:11,color:'var(--text3)',marginTop:6}}>
                  {new Date(r.createdAt).toLocaleDateString([], {day:'numeric',month:'short',year:'numeric'})}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW REQUEST MODAL */}
      {modal && (
        <div className="modal-overlay open" onClick={e => e.target===e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">🔧 New Maintenance Request</span>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Issue Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="e.g. Leaking tap in kitchen" required />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                    {['plumbing','electrical','appliance','structural','pest','other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-select" value={form.priority} onChange={e => setForm({...form,priority:e.target.value})}>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Describe the issue in detail..." required />
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Submitting...':'Submit Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
