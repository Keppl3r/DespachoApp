// src/components/ClientForm.js
import React, { useState } from 'react';
import axios from 'axios';

function ClientForm() {
  // 1. Creamos un estado para cada campo del formulario.
  const [nombreCompleto, setNombreCompleto] = useState('');
  const = useState(''); // <-- CORREGIDO
  const [email, setEmail] = useState('');
  const = useState(''); // <-- CORREGIDO

  // 2. Esta función se ejecutará cuando el usuario envíe el formulario.
  const handleSubmit = async (evento) => {
    evento.preventDefault(); // Previene que la página se recargue.

    // 3. Creamos un objeto con los datos del nuevo cliente.
    const nuevoCliente = {
      nombreCompleto: nombreCompleto,
      telefono: telefono,
      email: email,
      direccion: direccion
    };

    try {
      // 4. Hacemos una petición POST a nuestra API para crear el cliente.
      const respuesta = await axios.post('http://localhost:8080/api/clientes', nuevoCliente);

      // 5. Si todo sale bien, mostramos una alerta y limpiamos el formulario.
      alert('Cliente guardado con éxito: ' + respuesta.data.nombreCompleto);
      setNombreCompleto('');
      setTelefono('');
      setEmail('');
      setDireccion('');
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
      alert('Hubo un error al guardar el cliente.');
    }
  };

  // 6. Este es el HTML (JSX) que se mostrará en la pantalla.
  return (
    <div>
      <h2>Añadir Nuevo Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre Completo:</label>
          <input
            type="text"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <button type="submit">Guardar Cliente</button>
      </form>
    </div>
  );
}

export default ClientForm;