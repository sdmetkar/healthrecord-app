import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from './api';

const VisitsList = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    setLoading(true);
    const url = search
      ? `${API_BASE}/api/visits/search?patientId=${encodeURIComponent(search)}`
      : `${API_BASE}/api/visits`;
    fetch(url)
      .then(async res => {
        if (!res.ok) {
          let errMsg = 'Failed to load visits';
          try {
            const err = await res.json();
            if (err && err.message) errMsg = err.message;
          } catch {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(data => {
        setVisits(data);
        setLoading(false);
      })
      .catch((err) => {
        let msg = err && err.message === 'Failed to fetch'
          ? 'Backend server is unreachable. Please try again later.'
          : (err.message || 'Failed to load visits');
        setError(msg);
        setLoading(false);
      });
  }, [search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-card">
      <h2 className="main-title">Visits</h2>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center' }}>
        <input
          placeholder="Search by patient name..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          style={{
            marginRight: 10,
            width: 240,
            borderRadius: 6,
            border: '1px solid #ccc',
            padding: 8,
            fontSize: 16
          }}
        />
        <button className="main-btn secondary" onClick={() => { setSearch(''); setSearchInput(''); }}>Clear</button>
        <button className="main-btn" onClick={() => setSearch(searchInput)} style={{ marginLeft: 4 }}>Search</button>
        <Link to="/visits/new"><button className="main-btn" style={{ marginLeft: 10 }}>Add Visit</button></Link>
      </div>
  <table className="main-table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visits.map(v => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.date}</td>
              <td>{v.patient?.name}</td>
              <td>{v.doctor?.name}</td>
              <td>
                <Link to={`/visits/${v.id}`}><button className="main-btn">Edit</button></Link>
                <button className="main-btn secondary" style={{marginLeft: 8}} onClick={() => {
                  if(window.confirm('Delete this visit?')) {
                    fetch(`${API_BASE}/api/visits/${v.id}`, { method: 'DELETE' })
                      .then(res => {
                        if(res.ok) setVisits(visits.filter(x => x.id !== v.id));
                        else alert('Delete failed');
                      });
                  }
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitsList;
