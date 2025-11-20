import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthService from './services/auth.service';

import GestionClientes from './components/GestionClientes';
import GestionExpedientes from './components/GestionExpedientes';
import GestionAgenda from './components/GestionAgenda';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import './App.css';

const AppContent = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser()); // Inicializamos el estado desde el localStorage

  // Este efecto se ejecuta solo cuando el estado de currentUser cambia
  // Este efecto causaba un bucle de redirección. Lo eliminamos para permitir la navegación.
  // useEffect(() => {
  //   if (currentUser) {
  //     navigate('/');
  //   }
  // }, [currentUser, navigate]);

  const handleLoginSuccess = () => {
    // La única responsabilidad de esta función es actualizar el estado.
    // El useEffect de arriba se encargará de la navegación.
    setCurrentUser(AuthService.getCurrentUser());
  };

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate("/login");
  };

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
            {currentUser ? (
              <>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/clientes">Clientes</Link></li>
                <li><Link to="/expedientes">Expedientes</Link></li>
                <li><Link to="/agenda">Agenda</Link></li>
                <li style={{ marginLeft: 'auto' }}><a href="/login" onClick={logOut} className="logout-link">Cerrar Sesión</a></li>
              </>
            ) : (
              <>
                <li style={{ marginLeft: 'auto' }}><Link to="/login">Login</Link></li>
                <li><Link to="/register">Registro</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          {/* Si no hay usuario, la ruta raíz también lleva al Login */}
          <Route path="/" element={currentUser ? <Dashboard /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas */}
          <Route path="/clientes" element={currentUser ? <GestionClientes /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/expedientes" element={currentUser ? <GestionExpedientes /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/agenda" element={currentUser ? <GestionAgenda /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
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
