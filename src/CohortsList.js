import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from './api';

const CohortsList = () => {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/cohorts`)
      .then(async res => {
        if (!res.ok) {
          let errMsg = 'Failed to load cohorts';
          try {
            const err = await res.json();
            if (err && err.message) errMsg = err.message;
          } catch {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(data => {
        setCohorts(
          search ? data.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : data
        );
        setLoading(false);
      })
      .catch((err) => {
        let msg = err && err.message === 'Failed to fetch'
          ? 'Backend server is unreachable. Please try again later.'
          : (err.message || 'Failed to load cohorts');
        setError(msg);
        setLoading(false);
      });
  }, [search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-card">
      <h2 className="main-title">Cohorts</h2>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center' }}>
        <input
          placeholder="Search by name..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          style={{ marginRight: 10, width: 220, borderRadius: 6, border: '1px solid #ccc', padding: 8 }}
        />
        <button className="main-btn secondary" onClick={() => { setSearch(''); setSearchInput(''); }}>Clear</button>
        <button className="main-btn" onClick={() => setSearch(searchInput)} style={{ marginLeft: 4 }}>Search</button>
        <Link to="/cohorts/new"><button className="main-btn" style={{ marginLeft: 10 }}>Add Cohort</button></Link>
      </div>
  <table className="main-table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            {/* Removed Created By and Created At */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cohorts.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.description}</td>
              {/* Removed Created By and Created At */}
              <td>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/cohorts/${c.id}`}><button className="main-btn">Edit</button></Link>
                  <Link to={`/cohorts/${c.id}/patients`}><button className="main-btn secondary">Show Patients</button></Link>
                  <button className="main-btn secondary" onClick={() => {
                    if(window.confirm('Delete this cohort?')) {
                      fetch(`${API_BASE}/api/cohorts/${c.id}`, { method: 'DELETE' })
                        .then(res => {
                          if(res.ok) setCohorts(cohorts.filter(x => x.id !== c.id));
                          else alert('Delete failed');
                        });
                    }
                  }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CohortsList;
