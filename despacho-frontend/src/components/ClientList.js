// src/components/ClientList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClientList() {
  // Inicializamos 'clientes' como un array vacío para evitar errores.
  const [clientes, setClientes] = useState();

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const respuesta = await axios.get('http://localhost:8080/api/clientes');
        setClientes(respuesta.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };
    obtenerClientes();
  },); // El array vacío es importante para que se ejecute solo una vez.

  // Si los clientes aún no han cargado, muestra un mensaje.
  if (!clientes) {
    return <h2>Cargando clientes...</h2>;
  }

  return (
    <div>
      <h2>Lista de Clientes</h2>
      <ul>
        {clientes.map(cliente => (
          <li key={cliente.id}>
            {cliente.nombreCompleto} - {cliente.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientList;