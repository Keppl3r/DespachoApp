import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import GestionClientes from './components/GestionClientes';
import GestionExpedientes from './components/GestionExpedientes';
import GestionAgenda from './components/GestionAgenda';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent = () => {
  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: '#28a745', color: 'white' } },
          error: { style: { background: '#dc3545', color: 'white' } },
        }}
      />
      <header>
        <h1>DespachoApp</h1>
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/clientes">Clientes</Link></li>
            <li><Link to="/expedientes">Expedientes</Link></li>
            <li><Link to="/agenda">Agenda</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<GestionClientes />} />
          <Route path="/expedientes" element={<GestionExpedientes />} />
          <Route path="/agenda" element={<GestionAgenda />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
