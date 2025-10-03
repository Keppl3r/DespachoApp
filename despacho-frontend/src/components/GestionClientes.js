import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const API_URL = 'http://localhost:8080/api/clientes';

function GestionClientes() {
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [formData, setFormData] = useState({ nombreCompleto: '', telefono: '', email: '', direccion: '' });
    const [modoEdicion, setModoEdicion] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            obtenerClientes(searchTerm);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const obtenerClientes = async (nombre) => {
        try {
            const params = new URLSearchParams();
            if (nombre) params.append('nombre', nombre);
            const respuesta = await axios.get(`${API_URL}?${params.toString()}`);
            setClientes(respuesta.data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            alert('Error al cargar los clientes.');
        }
    };

    const crearCliente = async (cliente) => {
        try {
            await axios.post(API_URL, cliente);
            alert('Cliente creado con éxito');
            setSearchTerm('');
            if (!searchTerm) obtenerClientes();
        } catch (error) {
            console.error("Error al crear cliente:", error);
            alert('Error al crear el cliente.');
        }
    };

    const actualizarCliente = async (id, cliente) => {
        try {
            await axios.put(`${API_URL}/${id}`, cliente);
            alert('Cliente actualizado con éxito');
            setSearchTerm('');
            if (!searchTerm) obtenerClientes();
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            alert('Error al actualizar el cliente.');
        }
    };

    const eliminarCliente = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                alert('Cliente eliminado');
                obtenerClientes(searchTerm);
            } catch (error) {
                console.error("Error al eliminar cliente:", error);
                alert('Error al eliminar el cliente.');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modoEdicion) {
            actualizarCliente(clienteSeleccionado.id, formData);
        } else {
            crearCliente(formData);
        }
        resetForm();
    };

    const handleEditar = (cliente) => {
        setModoEdicion(true);
        setClienteSeleccionado(cliente);
        setFormData(cliente);
    };

    const resetForm = () => {
        setModoEdicion(false);
        setClienteSeleccionado(null);
        setFormData({ nombreCompleto: '', telefono: '', email: '', direccion: '' });
    };

    return (
        <>
            <div className="form-container">
                <h2>{modoEdicion ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="nombreCompleto" placeholder="Nombre Completo" value={formData.nombreCompleto} onChange={handleInputChange} required />
                    <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                    <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleInputChange} />
                    <div>
                        <button type="submit">{modoEdicion ? 'Actualizar' : 'Guardar'}</button>
                        {modoEdicion && <button type="button" onClick={resetForm} className="secondary">Cancelar</button>}
                    </div>
                </form>
            </div>

            <div className="list-container">
                <h2>Lista de Clientes</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Buscar cliente por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.nombreCompleto}</td>
                                <td>{cliente.telefono}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.direccion}</td>
                                <td>
                                    <button onClick={() => handleEditar(cliente)} className="secondary">Editar</button>
                                    <button onClick={() => eliminarCliente(cliente.id)} className="danger">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default GestionClientes;
