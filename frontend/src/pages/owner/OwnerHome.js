// src/pages/owner/OwnerHome.js

import React, { useEffect, useState } from 'react';
import { propertyAPI, tenantAPI, paymentAPI, maintenanceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OwnerHome({ onNavigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ properties: 0, tenants: 0, revenue: 0, pendingMaint: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propsRes, tenantsRes, paymentsRes, maintRes] = await Promise.all([
          propertyAPI.getAll(),
          tenantAPI.getAll(),
          paymentAPI.getAll(),
          maintenanceAPI.getAll()
        ]);

        const properties  = propsRes.data.properties;
        const tenants     = tenantsRes.data.tenants;
        const payments    = paymentsRes.data.payments;
        const maintenance = maintRes.data.requests;

        const revenue = payments
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + p.amount, 0);

        const pendingMaint = maintenance.filter(m => m.status === 'pending').length;

        setStats({
          properties:  properties.length,
          occupied:    properties.filter(p => p.status === 'occupied').length,
          tenants:     tenants.length,
          revenue,
          pendingMaint
        });
      } catch (_) {}
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{color: 'var(--text3)', padding: 20}}>Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Here's what's happening with your properties today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Total Properties" value={stats.properties}        icon="🏢" color="var(--accent)" sub={`${stats.occupied || 0} occupied`} />
        <StatCard label="Active Tenants"   value={stats.tenants}           icon="👥" color="var(--green)"  sub="across all properties" />
        <StatCard label="Total Revenue"    value={`₹${(stats.revenue||0).toLocaleString()}`} icon="💰" color="var(--amber)" sub="from paid rents" />
        <StatCard label="Pending Requests" value={stats.pendingMaint}      icon="🔧" color="var(--red)"   sub="maintenance requests" />
      </div>

      {/* Quick actions */}
      <div className="card" style={{marginTop: 8}}>
        <h3 style={{fontFamily: 'var(--font2)', fontSize: 15, fontWeight: 600, marginBottom: 14, color: 'var(--text)'}}>Quick Actions</h3>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('properties')}>➕ Add Property</button>
          <button className="btn btn-ghost  btn-sm" onClick={() => onNavigate('payments')}>💳 Record Payment</button>
          <button className="btn btn-ghost  btn-sm" onClick={() => onNavigate('maintenance')}>🔧 View Requests</button>
          <button className="btn btn-ghost  btn-sm" onClick={() => onNavigate('messages')}>💬 Messages</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className="stat-card" style={{borderTop: `3px solid ${color}`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
          <div className="stat-sub">{sub}</div>
        </div>
        <span style={{fontSize: 28, opacity: 0.7}}>{icon}</span>
      </div>
    </div>
  );
}
