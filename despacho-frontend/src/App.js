import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GestionClientes from './components/GestionClientes';
import GestionExpedientes from './components/GestionExpedientes';
import GestionAgenda from './components/GestionAgenda';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>DespachoApp</h1>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/clientes">Clientes</Link>
            <Link to="/expedientes">Expedientes</Link>
            <Link to="/agenda">Agenda</Link>
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
    </Router>
  );
}

export default App;
