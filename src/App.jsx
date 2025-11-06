// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StudentProvider } from './context/StudentContext';
import InfoForm from './pages/InfoForm';
import AssistantDashboard from './pages/AssistantDashboard';

function App() {
  return (
    <BrowserRouter>
      <StudentProvider>
        <Routes>
          <Route path="/" element={<InfoForm />} />
          <Route path="/assistant" element={<AssistantDashboard />} />
        </Routes>
      </StudentProvider>
    </BrowserRouter>
  );
}

export default App;