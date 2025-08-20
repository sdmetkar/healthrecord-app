import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from './api';
import QueryBuilder from './QueryBuilder';
import SaveCohortButton from './SaveCohortButton';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [queryCriteria, setQueryCriteria] = useState('');
  const [pendingQueryCriteria, setPendingQueryCriteria] = useState('');
  useEffect(() => {
    setLoading(true);
    let url = `${API_BASE}/api/patients`;
    let fetchOptions = {};
    if (search) {
      url = `${API_BASE}/api/patients/search?name=${encodeURIComponent(search)}`;
    } else if (queryCriteria) {
      url = `${API_BASE}/api/patients/search/criteria`;
      let parsedCriteria = {};
      try {
        parsedCriteria = JSON.parse(queryCriteria);
      } catch {}
      fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedCriteria),
      };
    }
    fetch(url, fetchOptions)
      .then(async res => {
        if (!res.ok) {
          let errMsg = 'Failed to load patients';
          try {
            const err = await res.json();
            if (err && err.message) errMsg = err.message;
          } catch {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(err => {
        let msg = err && err.message === 'Failed to fetch'
          ? 'Backend server is unreachable. Please try again later.'
          : (err.message || 'Failed to load patients');
        setError(msg);
        setLoading(false);
      });
  }, [search, queryCriteria]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-card">
      <h2 className="main-title">Patients</h2>
      <div style={{ marginBottom: 18 }}>
        <input
          placeholder="Search by name..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          style={{ marginRight: 10, width: 220, borderRadius: 6, border: '1px solid #ccc', padding: 8 }}
        />
        <button className="main-btn secondary" onClick={() => { setSearch(''); setSearchInput(''); setQueryCriteria(''); }}>Clear</button>
        <button className="main-btn" onClick={() => { setSearch(searchInput); setQueryCriteria(''); }}>Search</button>
        <Link to="/patients/new"><button className="main-btn" style={{ marginLeft: 10 }}>Add Patient</button></Link>
      </div>
      <div style={{ marginBottom: 18, maxWidth: 500 }}>
        <label style={{ fontWeight: 600, color: '#333' }}><b>Advanced Search (Query Criteria):</b></label>
        <QueryBuilder
          value={pendingQueryCriteria}
          onChange={qc => setPendingQueryCriteria(qc)}
        />
        <button
          className="main-btn"
          onClick={() => {
            setQueryCriteria(pendingQueryCriteria);
            setSearch('');
          }}
        >Search with Criteria</button>
        <button
          className="main-btn secondary"
          onClick={() => { setQueryCriteria(''); setPendingQueryCriteria(''); }}
        >Clear Query Criteria</button>
        <SaveCohortButton queryCriteria={pendingQueryCriteria} />
      </div>
  <table className="main-table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.dob}</td>
              <td>{p.gender}</td>
              <td>
                <Link to={`/patients/${p.id}`}><button className="main-btn">Edit</button></Link>
                <button className="main-btn secondary" style={{marginLeft: 8}} onClick={() => {
                  if(window.confirm('Delete this patient?')) {
                    fetch(`${API_BASE}/api/patients/${p.id}`, { method: 'DELETE' })
                      .then(res => {
                        if(res.ok) setPatients(patients.filter(x => x.id !== p.id));
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

export default PatientsList;
