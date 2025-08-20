import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import NavBar from './NavBar';
import PatientsList from './PatientsList';
import PatientForm from './PatientForm';
import VisitsList from './VisitsList';
import VisitForm from './VisitForm';
import DoctorsList from './DoctorsList';
import DoctorForm from './DoctorForm';
import DiagnosesList from './DiagnosesList';
import DiagnosisForm from './DiagnosisForm';
import CohortsList from './CohortsList';
import CohortForm from './CohortForm';
import CohortPatients from './CohortPatients';
import PatientsDashboard from './PatientsDashboard';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/patients" />} />
        {/* Patients */}
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/patients/new" element={<PatientForm />} />
        <Route path="/patients/:id" element={<PatientForm />} />
        {/* Visits */}
        <Route path="/visits" element={<VisitsList />} />
        <Route path="/visits/new" element={<VisitForm />} />
        <Route path="/visits/:id" element={<VisitForm />} />
        {/* Doctors */}
        <Route path="/doctors" element={<DoctorsList />} />
        <Route path="/doctors/new" element={<DoctorForm />} />
        <Route path="/doctors/:id" element={<DoctorForm />} />
        {/* Diagnoses */}
        <Route path="/diagnoses" element={<DiagnosesList />} />
        <Route path="/diagnoses/new" element={<DiagnosisForm />} />
        <Route path="/diagnoses/:id" element={<DiagnosisForm />} />
  {/* Cohorts */}
  <Route path="/cohorts" element={<CohortsList />} />
  <Route path="/cohorts/new" element={<CohortForm />} />
  <Route path="/cohorts/:id" element={<CohortForm />} />
  <Route path="/cohorts/:id/patients" element={<CohortPatients />} />
        <Route path="/patients-dashboard" element={<PatientsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
