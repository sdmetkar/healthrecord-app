
import React, { useState } from 'react';
import { API_BASE } from './api';
import QueryBuilder from './QueryBuilder';

export default function PatientsDashboard() {

  const [criteria, setCriteria] = useState('');
  const [pendingCriteria, setPendingCriteria] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [openDetailsId, setOpenDetailsId] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    let parsedCriteria = {};
    if (pendingCriteria && pendingCriteria.trim()) {
      try {
        parsedCriteria = JSON.parse(pendingCriteria);
      } catch {
        setError('Invalid query criteria');
        setLoading(false);
        return;
      }
    }
    try {
      const resp = await fetch(`${API_BASE}/api/patients/search/criteria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedCriteria)
      });
      if (!resp.ok) throw new Error('Failed to fetch dashboard');
      const data = await resp.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (e) {
      setError(e.message || 'Failed to fetch dashboard');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 32, background: '#f4f7fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ color: '#1976d2', marginBottom: 24, letterSpacing: 1 }}>Patients Dashboard</h2>
        <div style={{ marginBottom: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 24, display: 'flex', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600, color: '#333' }}>Query Criteria:</label>
            <QueryBuilder value={pendingCriteria} onChange={setPendingCriteria} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={handleSearch} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', marginBottom: 4 }}>Search</button>
            <button onClick={() => { setCriteria(''); setPendingCriteria(''); setResults([]); }} style={{ background: '#eee', color: '#1976d2', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
          </div>
        </div>
        {loading && <div style={{ color: '#1976d2', fontWeight: 500, marginBottom: 16 }}>Loading...</div>}
        {error && <div style={{ color: '#d32f2f', background: '#fff0f0', border: '1px solid #fbb', borderRadius: 8, padding: 12, marginBottom: 16 }}>{error}</div>}
        {results.length > 0 && (
          <div style={{ marginTop: 20, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 16 }}>
              <thead>
                <tr style={{ background: '#e3eaf2' }}>
                  <th style={{ padding: '10px 8px', borderTopLeftRadius: 8 }}>ID</th>
                  <th style={{ padding: '10px 8px' }}>Name</th>
                  <th style={{ padding: '10px 8px' }}>Gender</th>
                  <th style={{ padding: '10px 8px' }}>Date of Birth</th>
                  <th style={{ padding: '10px 8px' }}>Total Visits</th>
                  <th style={{ padding: '10px 8px' }}>Visits Last Year</th>
                  <th style={{ padding: '10px 8px', borderTopRightRadius: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map(p => (
                  <React.Fragment key={p.id}>
                    <tr style={{ background: openDetailsId === p.id ? '#f0f6ff' : '#fff', transition: 'background 0.2s' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 500 }}>{p.id}</td>
                      <td style={{ padding: '10px 8px' }}>{p.name}</td>
                      <td style={{ padding: '10px 8px' }}>{p.gender}</td>
                      <td style={{ padding: '10px 8px' }}>{p.dateOfBirth}</td>
                      <td style={{ padding: '10px 8px' }}>{p.totalVisits}</td>
                      <td style={{ padding: '10px 8px' }}>{p.visitsLastYear}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <button onClick={() => setOpenDetailsId(openDetailsId === p.id ? null : p.id)} style={{ background: openDetailsId === p.id ? '#d32f2f' : '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, cursor: 'pointer' }}>
                          {openDetailsId === p.id ? 'Hide Details' : 'Show Details'}
                        </button>
                      </td>
                    </tr>
                    {openDetailsId === p.id && p.visits && (
                      <tr>
                        <td colSpan={7} style={{ background: '#f8fbff', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                          <div style={{ marginTop: 10 }}>
                            <h4 style={{ color: '#1976d2', marginBottom: 10 }}>Visits for {p.name}</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, background: '#fff' }}>
                              <thead>
                                <tr style={{ background: '#e3eaf2' }}>
                                  <th style={{ padding: '8px 6px' }}>Visit ID</th>
                                  <th style={{ padding: '8px 6px' }}>Date</th>
                                  <th style={{ padding: '8px 6px' }}>Doctor</th>
                                  <th style={{ padding: '8px 6px' }}>Diagnoses</th>
                                </tr>
                              </thead>
                              <tbody>
                                {p.visits.map(v => (
                                  <tr key={v.visitId}>
                                    <td style={{ padding: '8px 6px' }}>{v.visitId}</td>
                                    <td style={{ padding: '8px 6px' }}>{v.date}</td>
                                    <td style={{ padding: '8px 6px' }}>{v.doctorName}</td>
                                    <td style={{ padding: '8px 6px' }}>{v.diagnoses && v.diagnoses.join(', ')}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
