import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from './api';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    setLoading(true);
    const url = search
      ? `${API_BASE}/api/doctors/search?name=${encodeURIComponent(search)}`
      : `${API_BASE}/api/doctors`;
    fetch(url)
      .then(async res => {
        if (!res.ok) {
          let errMsg = 'Failed to load doctors';
          try {
            const err = await res.json();
            if (err && err.message) errMsg = err.message;
          } catch {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        let msg = err && err.message === 'Failed to fetch'
          ? 'Backend server is unreachable. Please try again later.'
          : (err.message || 'Failed to load doctors');
        setError(msg);
        setLoading(false);
      });
  }, [search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-card">
      <h2 className="main-title">Doctors</h2>
      <div style={{ marginBottom: 18 }}>
        <input
          placeholder="Search by name..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          style={{ marginRight: 10, width: 220, borderRadius: 6, border: '1px solid #ccc', padding: 8 }}
        />
        <button className="main-btn secondary" onClick={() => { setSearch(''); setSearchInput(''); }}>Clear</button>
        <button className="main-btn" onClick={() => setSearch(searchInput)} style={{ marginLeft: 4 }}>Search</button>
        <Link to="/doctors/new"><button className="main-btn" style={{ marginLeft: 10 }}>Add Doctor</button></Link>
      </div>
  <table className="main-table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.specialty}</td>
              <td>
                  <Link to={`/doctors/${d.id}`}><button className="main-btn">Edit</button></Link>
                  <button className="main-btn secondary" style={{marginLeft: 8}} onClick={() => {
                  if(window.confirm('Delete this doctor?')) {
                    fetch(`${API_BASE}/api/doctors/${d.id}`, { method: 'DELETE' })
                      .then(res => {
                        if(res.ok) setDoctors(doctors.filter(x => x.id !== d.id));
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

export default DoctorsList;
