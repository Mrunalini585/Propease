// src/pages/owner/OwnerProperties.js

import React, { useEffect, useState, useRef } from 'react';
import { propertyAPI } from '../../services/api';

const EMPTY_FORM = {
  title: '', description: '',
  'address.street': '', 'address.city': '', 'address.state': '',
  type: 'apartment', rent: '', deposit: '', bedrooms: 1, bathrooms: 1, area: '',
  status: 'available', amenities: ''
};

const TYPE_ICONS = { apartment: '🏢', house: '🏠', studio: '🛋️', villa: '🏰', commercial: '🏬' };

export default function OwnerProperties({ showToast }) {
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);      // add/edit modal
  const [editId,     setEditId]     = useState(null);       // null = add, string = edit
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const modalRef = useRef();

  const fetchProperties = async () => {
    try {
      const res = await propertyAPI.getAll();
      setProperties(res.data.properties);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModal(true); };

  const openEdit = (prop) => {
    setForm({
      title: prop.title, description: prop.description || '',
      'address.street': prop.address?.street || '',
      'address.city':   prop.address?.city   || '',
      'address.state':  prop.address?.state  || '',
      type: prop.type, rent: prop.rent, deposit: prop.deposit || '',
      bedrooms: prop.bedrooms, bathrooms: prop.bathrooms, area: prop.area || '',
      status: prop.status, amenities: (prop.amenities || []).join(', ')
    });
    setEditId(prop._id);
    setModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Build a clean object from form (handle nested address)
      const data = {
        title:       form.title,
        description: form.description,
        address: {
          street: form['address.street'],
          city:   form['address.city'],
          state:  form['address.state']
        },
        type: form.type, rent: Number(form.rent), deposit: Number(form.deposit || 0),
        bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms),
        area: Number(form.area || 0), status: form.status,
        amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : []
      };

      if (editId) {
        await propertyAPI.update(editId, data);
        showToast('Property updated!', '✏️');
      } else {
        await propertyAPI.create(data);
        showToast('Property added!', '🏢');
      }

      setModal(false);
      fetchProperties();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving property', '❌');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await propertyAPI.delete(id);
      showToast('Property deleted', '🗑️');
      fetchProperties();
    } catch (_) {
      showToast('Error deleting', '❌');
    }
  };

  if (loading) return <div style={{color:'var(--text3)',padding:20}}>Loading properties...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Properties</h1>
          <p className="page-subtitle">{properties.length} total properties</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add Property</button>
      </div>

      {properties.length === 0 ? (
        <div className="empty card">
          <div className="empty-icon">🏢</div>
          <div className="empty-text">No properties yet. Add your first one!</div>
        </div>
      ) : (
        <div className="prop-grid">
          {properties.map(prop => (
            <div key={prop._id} className="prop-card">
              <div className="prop-card-img">
                <span>{TYPE_ICONS[prop.type] || '🏠'}</span>
                <span style={{position:'absolute',top:10,right:10}}>
                  <span className={`badge badge-${prop.status==='available'?'green':prop.status==='occupied'?'accent':'amber'}`}>{prop.status}</span>
                </span>
              </div>
              <div className="prop-card-body">
                <div className="prop-card-title">{prop.title}</div>
                <div className="prop-card-addr">📍 {[prop.address?.street, prop.address?.city, prop.address?.state].filter(Boolean).join(', ') || 'No address'}</div>
                <div className="prop-card-rent">₹{prop.rent?.toLocaleString()}<span style={{fontSize:12,color:'var(--text3)',fontWeight:400}}>/month</span></div>
                <div className="prop-card-meta">
                  <span>🛏 {prop.bedrooms} bed</span>
                  <span>🚿 {prop.bathrooms} bath</span>
                  {prop.area > 0 && <span>📐 {prop.area} sqft</span>}
                </div>
                {prop.currentTenant && (
                  <div style={{marginTop:8,fontSize:12,color:'var(--green)'}}>
                    👤 {prop.currentTenant.name}
                  </div>
                )}
                <div className="prop-card-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(prop)}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prop._id)}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modal && (
        <div className="modal-overlay open" onClick={e => e.target===e.currentTarget && setModal(false)}>
          <div className="modal" ref={modalRef}>
            <div className="modal-header">
              <span className="modal-title">{editId ? '✏️ Edit Property' : '➕ Add Property'}</span>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Title *</label>
                <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. 2BHK in Banjara Hills" required />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div className="form-group">
                  <label>Type</label>
                  <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                    {['apartment','house','studio','villa','commercial'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                    {['available','occupied','maintenance'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input className="form-input" name="address.street" value={form['address.street']} onChange={handleChange} placeholder="123 MG Road" />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div className="form-group">
                  <label>City</label>
                  <input className="form-input" name="address.city" value={form['address.city']} onChange={handleChange} placeholder="Hyderabad" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input className="form-input" name="address.state" value={form['address.state']} onChange={handleChange} placeholder="Telangana" />
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div className="form-group">
                  <label>Monthly Rent (₹) *</label>
                  <input className="form-input" name="rent" type="number" value={form.rent} onChange={handleChange} placeholder="25000" required />
                </div>
                <div className="form-group">
                  <label>Security Deposit (₹)</label>
                  <input className="form-input" name="deposit" type="number" value={form.deposit} onChange={handleChange} placeholder="50000" />
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input className="form-input" name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input className="form-input" name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Area (sqft)</label>
                  <input className="form-input" name="area" type="number" value={form.area} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Amenities (comma separated)</label>
                <input className="form-input" name="amenities" value={form.amenities} onChange={handleChange} placeholder="WiFi, Parking, AC, Gym" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Describe the property..." />
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:8}}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Property'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
