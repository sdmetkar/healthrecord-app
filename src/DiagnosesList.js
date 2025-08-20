
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from './api';

const DiagnosesList = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/diagnoses`)
      .then(async res => {
        if (!res.ok) {
          let errMsg = 'Failed to load diagnoses';
          try {
            const err = await res.json();
            if (err && err.message) errMsg = err.message;
          } catch {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(data => {
        setDiagnoses(
          search ? data.filter(d => d.code.toLowerCase().includes(search.toLowerCase())) : data
        );
        setLoading(false);
      })
      .catch((err) => {
        let msg = err && err.message === 'Failed to fetch'
          ? 'Backend server is unreachable. Please try again later.'
          : (err.message || 'Failed to load diagnoses');
        setError(msg);
        setLoading(false);
      });
  }, [search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-card">
      <h2 className="main-title">Diagnoses</h2>
      <div style={{ marginBottom: 18 }}>
        <input
          placeholder="Search by code..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          style={{ marginRight: 10, width: 220, borderRadius: 6, border: '1px solid #ccc', padding: 8 }}
        />
        <button className="main-btn secondary" onClick={() => { setSearch(''); setSearchInput(''); }}>Clear</button>
        <button className="main-btn" onClick={() => setSearch(searchInput)} style={{ marginLeft: 4 }}>Search</button>
        <Link to="/diagnoses/new"><button className="main-btn" style={{ marginLeft: 10 }}>Add Diagnosis</button></Link>
      </div>
  <table className="main-table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Description</th>
            <th>Visit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {diagnoses.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.code}</td>
              <td>{d.description}</td>
              <td>{d.visit?.id}</td>
              <td>
                <>
                  <Link to={`/diagnoses/${d.id}`}><button className="main-btn">Edit</button></Link>
                  <button className="main-btn secondary" style={{marginLeft: 8}} onClick={() => {
                    if(window.confirm('Delete this diagnosis?')) {
                      fetch(`${API_BASE}/api/diagnoses/${d.id}`, { method: 'DELETE' })
                        .then(res => {
                          if(res.ok) setDiagnoses(diagnoses.filter(x => x.id !== d.id));
                          else alert('Delete failed');
                        });
                    }
                  }}>Delete</button>
                </>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiagnosesList;
