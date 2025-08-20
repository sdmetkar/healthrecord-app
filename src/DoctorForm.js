import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from './api';

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: '', specialty: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetch(`${API_BASE}/api/doctors/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({ name: data.name, specialty: data.specialty });
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load doctor');
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
    const url = isEdit ? `${API_BASE}/api/doctors/${id}` : `${API_BASE}/api/doctors`;
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(async res => {
        if (!res.ok) {
          let errMsg = 'Failed to save doctor';
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
        navigate('/doctors');
      })
      .catch((e) => {
        setError(e.message || 'Failed to save doctor');
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{isEdit ? 'Edit' : 'Add'} Doctor</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div>
          <label>Name:</label><br />
          <input name="name" value={form.name} onChange={handleChange} required minLength={4} maxLength={50} />
        </div>
        <div>
          <label>Specialty:</label><br />
          <input name="specialty" value={form.specialty} onChange={handleChange} required minLength={4} maxLength={50} />
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => navigate('/doctors')} style={{ marginLeft: 10 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
