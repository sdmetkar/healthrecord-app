import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav style={{ padding: '1rem', background: '#1976d2', color: 'white', display: 'flex', gap: 16 }}>
    <Link to="/patients" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, padding: '6px 16px', borderRadius: 6, transition: 'background 0.2s' }}>Patients</Link>
    <Link to="/patients-dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, padding: '6px 16px', borderRadius: 6, transition: 'background 0.2s' }}>Patients Dashboard</Link>
    <Link to="/visits" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, padding: '6px 16px', borderRadius: 6, transition: 'background 0.2s' }}>Visits</Link>
    <Link to="/doctors" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, padding: '6px 16px', borderRadius: 6, transition: 'background 0.2s' }}>Doctors</Link>
    <Link to="/diagnoses" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, padding: '6px 16px', borderRadius: 6, transition: 'background 0.2s' }}>Diagnoses</Link>
    <Link to="/cohorts" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, padding: '6px 16px', borderRadius: 6, transition: 'background 0.2s' }}>Cohorts</Link>
  </nav>
);

export default NavBar;
