import React, { useState } from 'react';
import { API_BASE } from './api';

export default function SaveCohortButton({ queryCriteria }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    let queryCriteriaObj = {};
    try {
      queryCriteriaObj = JSON.parse(queryCriteria);
    } catch {
      setError('Invalid query criteria');
      setLoading(false);
      return;
    }
    const resp = await fetch(`${API_BASE}/api/cohorts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, queryCriteria: JSON.stringify(queryCriteriaObj) })
    });
    if (resp.ok) {
      setSuccess(true);
      setShow(false);
      setName('');
      setDescription('');
    } else {
      let msg = 'Failed to save cohort';
      try {
        const err = await resp.json();
        if (err && err.message) msg = err.message;
      } catch {}
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <span style={{ display: 'inline-block' }}>
      <button className="main-btn" style={{ marginTop: 4 }} onClick={() => setShow(true)}>Save as Cohort</button>
      {show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 1000 }}>
          <div className="main-card" style={{ maxWidth: 420, margin: '80px auto', boxShadow: '0 2px 12px #888' }}>
            <h3 className="main-title" style={{ fontSize: 22, marginBottom: 18 }}>Create Cohort</h3>
            {error && <div className="main-error">{error}</div>}
            <form className="main-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <div>
                <label>Name:</label>
                <input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label>Description:</label>
                <input value={description} onChange={e => setDescription(e.target.value)} required />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label>Query Criteria:</label>
                <pre style={{ background: '#f4f4f4', padding: 8, borderRadius: 4, maxHeight: 120, overflow: 'auto' }}>{queryCriteria}</pre>
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="main-btn" type="submit" disabled={loading || !name || !description}>{loading ? 'Saving...' : 'Save'}</button>
                <button className="main-btn secondary" type="button" onClick={() => setShow(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {success && <span className="main-success" style={{ marginLeft: 8 }}>Cohort saved!</span>}
    </span>
  );
}
