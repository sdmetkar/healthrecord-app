import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from './api';
import QueryBuilder from './QueryBuilder';

const CohortForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: '', description: '', queryCriteria: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetch(`${API_BASE}/api/cohorts/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            name: data.name,
            description: data.description,
            queryCriteria: data.queryCriteria
          });
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load cohort');
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
    const url = isEdit ? `${API_BASE}/api/cohorts/${id}` : `${API_BASE}/api/cohorts`;
    // Parse queryCriteria and re-stringify to avoid empty logic/conditions if not present
    let queryCriteriaObj;
    try {
      queryCriteriaObj = JSON.parse(form.queryCriteria);
    } catch (err) {
      setError('Invalid query criteria JSON');
      setLoading(false);
      return;
    }
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(async res => {
        if (!res.ok) {
          let errMsg = 'Failed to save cohort';
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
        navigate('/cohorts');
      })
      .catch((e) => {
        setError(e.message || 'Failed to save cohort');
        setLoading(false);
      });
  };

  return (
    <div className="main-card">
      <h2 className="main-title">{isEdit ? 'Edit' : 'Add'} Cohort</h2>
      {error && <div className="main-error">{error}</div>}
      <form className="main-form" onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div>
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <input name="description" value={form.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Query Criteria:</label>
          <QueryBuilder
            value={form.queryCriteria}
            onChange={qc => setForm(f => ({ ...f, queryCriteria: qc }))}
          />
        </div>
        <div style={{ marginTop: 18 }}>
          <button className="main-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button className="main-btn secondary" type="button" onClick={() => navigate('/cohorts')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default CohortForm;
