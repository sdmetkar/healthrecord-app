import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from './api';
import { formatDateTime } from './utils';

const VisitForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ date: '', patientId: '', doctorId: '' });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/patients`)
      .then(res => res.json())
      .then(setPatients);
    fetch(`${API_BASE}/api/doctors`)
      .then(res => res.json())
      .then(setDoctors);
    if (isEdit) {
      setLoading(true);
      fetch(`${API_BASE}/api/visits/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            date: data.date,
            patientId: data.patient?.id || '',
            doctorId: data.doctor?.id || ''
          });
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load visit');
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${API_BASE}/api/visits/${id}` : `${API_BASE}/api/visits`;
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: formatDateTime(form.date),
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId)
      }),
    })
      .then(async res => {
        if (!res.ok) {
          let errMsg = 'Failed to save visit';
          try {
            const err = await res.json();
            if (err && err.message) {
              errMsg = err.message;
              if (err.errors && typeof err.errors === 'object') {
                errMsg += ': ' + Object.entries(err.errors).map(([k, v]) => `${k}: ${v}`).join('; ');
              }
            }
          } catch (e) {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(() => {
        setLoading(false);
        navigate('/visits');
      })
      .catch((e) => {
        setError(e.message || 'Failed to save visit');
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{isEdit ? 'Edit' : 'Add'} Visit</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div>
          <label>Date:</label><br />
          <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Patient:</label><br />
          <select name="patientId" value={form.patientId} onChange={handleChange} required>
            <option value="">Select Patient</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label>Doctor:</label><br />
          <select name="doctorId" value={form.doctorId} onChange={handleChange} required>
            <option value="">Select Doctor</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => navigate('/visits')} style={{ marginLeft: 10 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default VisitForm;
