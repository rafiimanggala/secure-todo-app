import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPatients: 0, todayVisits: 0, activeCases: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/patients?page=1&limit=1000');
      const today = new Date().toISOString().split('T')[0];
      const patients = response.data;
      
      setStats({
        totalPatients: response.pagination.total,
        todayVisits: 0,
        activeCases: patients.filter(p => p.status === 'Aktif').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.username}!</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '24px' }}>
        <div className="card">
          <h3>Total Patients</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>
            {stats.totalPatients}
          </div>
        </div>

        <div className="card">
          <h3>Active Cases</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#059669' }}>
            {stats.activeCases}
          </div>
        </div>

        <div className="card">
          <h3>Today's Visits</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#dc2626' }}>
            {stats.todayVisits}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

