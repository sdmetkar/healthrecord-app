import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from './api';

const genders = ['Male', 'Female', 'Other'];

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: '', dob: '', gender: 'Male' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetch(`${API_BASE}/api/patients/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({ name: data.name, dob: data.dob, gender: data.gender });
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load patient');
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
    const url = isEdit ? `${API_BASE}/api/patients/${id}` : `${API_BASE}/api/patients`;
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(async res => {
        if (!res.ok) {
          let errMsg = 'Failed to save patient';
          try {
            const err = await res.json();
            if (err && err.message) {
              errMsg = err.message;
              if (err.errors && typeof err.errors === 'object') {
                errMsg += ': ' + Object.entries(err.errors).map(([k, v]) => `${k}: ${v}`).join('; ');
              }
            }
          } catch {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(() => {
        setLoading(false);
        navigate('/patients');
      })
      .catch((e) => {
        setError(e.message || 'Failed to save patient');
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{isEdit ? 'Edit' : 'Add'} Patient</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div>
          <label>Name:</label><br />
          <input name="name" value={form.name} onChange={handleChange} required minLength={4} maxLength={50} />
        </div>
        <div>
          <label>Date of Birth:</label><br />
          <input name="dob" type="date" value={form.dob} onChange={handleChange} required />
        </div>
        <div>
          <label>Gender:</label><br />
          <select name="gender" value={form.gender} onChange={handleChange} required>
            {genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => navigate('/patients')} style={{ marginLeft: 10 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
