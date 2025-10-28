import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Patients.css';

const Patients = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama: '', nik: '', tanggal_lahir: '', jenis_kelamin: 'Laki-laki', alamat: '', telepon: '', golongan_darah: '', riwayat_penyakit: '' });

  useEffect(() => {
    fetchPatients();
  }, [page, search]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/patients?page=${page}&limit=10&search=${search}`);
      setPatients(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patients', formData);
      setShowModal(false);
      setFormData({ nama: '', nik: '', tanggal_lahir: '', jenis_kelamin: 'Laki-laki', alamat: '', telepon: '', golongan_darah: '', riwayat_penyakit: '' });
      fetchPatients();
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  const canCreate = ['admin', 'dokter'].includes(user?.role);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Patients</h1>
        {canCreate && <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Patient</button>}
      </div>

      <input
        type="text"
        className="input"
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: '400px', marginBottom: '20px' }}
      />

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.nama}</td>
                  <td>{new Date(patient.tanggal_lahir).toLocaleDateString()}</td>
                  <td>{patient.jenis_kelamin}</td>
                  <td><span style={{ color: patient.status === 'Aktif' ? '#059669' : '#6b7280' }}>{patient.status}</span></td>
                  <td>
                    <button className="btn btn-primary" onClick={() => navigate(`/patients/${patient.id}`)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {pagination.totalPages || 1}</span>
            <button
              className="btn btn-primary"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= (pagination.totalPages || 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Patient</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Name *</label>
                <input className="input" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>NIK *</label>
                <input className="input" value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" className="input" value={formData.tanggal_lahir} onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select className="input" value={formData.jenis_kelamin} onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea className="input" value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input className="input" value={formData.telepon} onChange={(e) => setFormData({...formData, telepon: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Blood Type</label>
                <select className="input" value={formData.golongan_darah} onChange={(e) => setFormData({...formData, golongan_darah: e.target.value})}>
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="form-group">
                <label>Medical History</label>
                <textarea className="input" value={formData.riwayat_penyakit} onChange={(e) => setFormData({...formData, riwayat_penyakit: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary">Create</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

