import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE } from './api';

const CohortPatients = () => {
  const { id } = useParams();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/cohorts/${id}/patients`)
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load patients for cohort');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="main-card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
        <h2 className="main-title" style={{ flex: 1, margin: 0 }}>Patients in Cohort {id}</h2>
        <Link to="/cohorts"><button className="main-btn secondary">&larr; Back to Cohorts</button></Link>
      </div>
      <table className="main-table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.dob || p.dateOfBirth || ''}</td>
              <td>{p.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CohortPatients;
