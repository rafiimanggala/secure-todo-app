import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PatientDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordData, setRecordData] = useState({ diagnosis: '', resep: '', catatan: '', tanggal_kunjungan: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    fetchPatient();
    fetchRecords();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/patients/${id}`);
      setPatient(response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await api.get(`/records/patient/${id}`);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/records/patient/${id}`, recordData);
      setShowRecordModal(false);
      setRecordData({ diagnosis: '', resep: '', catatan: '', tanggal_kunjungan: new Date().toISOString().split('T')[0] });
      fetchRecords();
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  const canCreateRecord = ['admin', 'dokter'].includes(user?.role);
  const canEditRecord = ['admin', 'dokter', 'perawat'].includes(user?.role);

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!patient) return <div className="container">Patient not found</div>;

  return (
    <div className="container">
      <button className="btn btn-primary" onClick={() => navigate('/patients')} style={{ marginBottom: '20px' }}>
        ← Back to Patients
      </button>

      <div className="card">
        <h1>{patient.nama}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <div>
            <strong>Date of Birth:</strong> {new Date(patient.tanggal_lahir).toLocaleDateString()}
          </div>
          <div>
            <strong>Gender:</strong> {patient.jenis_kelamin}
          </div>
          <div>
            <strong>Blood Type:</strong> {patient.golongan_darah || 'Not specified'}
          </div>
          <div>
            <strong>Status:</strong> <span style={{ color: patient.status === 'Aktif' ? '#059669' : '#6b7280' }}>{patient.status}</span>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <strong>Address:</strong> {patient.alamat}
          </div>
          {patient.riwayat_penyakit && (
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Medical History:</strong> {patient.riwayat_penyakit}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Medical Records</h2>
          {canCreateRecord && <button className="btn btn-primary" onClick={() => setShowRecordModal(true)}>Add Record</button>}
        </div>

        {records.length === 0 ? (
          <p>No medical records found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {records.map(record => (
              <div key={record.id} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <strong>Visit Date: {new Date(record.tanggal_kunjungan).toLocaleDateString()}</strong>
                  <span style={{ color: record.status === 'Aktif' ? '#059669' : '#6b7280' }}>{record.status}</span>
                </div>
                {record.diagnosis && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Diagnosis:</strong> {record.diagnosis}
                  </div>
                )}
                {record.resep && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Prescription:</strong> {record.resep}
                  </div>
                )}
                {record.catatan && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Notes:</strong> {record.catatan}
                  </div>
                )}
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  By: {record.username} ({record.email})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showRecordModal && (
        <div className="modal-overlay" onClick={() => setShowRecordModal(false)}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h2>Add Medical Record</h2>
            <form onSubmit={handleCreateRecord}>
              <div className="form-group">
                <label>Visit Date *</label>
                <input type="date" className="input" value={recordData.tanggal_kunjungan} onChange={(e) => setRecordData({...recordData, tanggal_kunjungan: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Diagnosis</label>
                <textarea className="input" value={recordData.diagnosis} onChange={(e) => setRecordData({...recordData, diagnosis: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Prescription</label>
                <textarea className="input" value={recordData.resep} onChange={(e) => setRecordData({...recordData, resep: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea className="input" value={recordData.catatan} onChange={(e) => setRecordData({...recordData, catatan: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary">Create</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowRecordModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;

