import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from './api';

const DiagnosisForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ code: '', description: '', visitId: '' });
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/visits`)
      .then(res => res.json())
      .then(setVisits);
    if (isEdit) {
      setLoading(true);
      fetch(`${API_BASE}/api/diagnoses/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            code: data.code,
            description: data.description,
            visitId: data.visit?.id || ''
          });
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load diagnosis');
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
    const url = isEdit ? `${API_BASE}/api/diagnoses/${id}` : `${API_BASE}/api/diagnoses`;
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: form.code,
        description: form.description,
        visit: { id: Number(form.visitId) }
      }),
    })
      .then(async res => {
        if (!res.ok) {
          let errMsg = 'Failed to save diagnosis';
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
        navigate('/diagnoses');
      })
      .catch((e) => {
        setError(e.message || 'Failed to save diagnosis');
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{isEdit ? 'Edit' : 'Add'} Diagnosis</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div>
          <label>Code:</label><br />
          <input name="code" value={form.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label><br />
          <input name="description" value={form.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Visit:</label><br />
          <select name="visitId" value={form.visitId} onChange={handleChange} required>
            <option value="">Select Visit</option>
            {visits.map(v => <option key={v.id} value={v.id}>{v.id}</option>)}
          </select>
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => navigate('/diagnoses')} style={{ marginLeft: 10 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default DiagnosisForm;
