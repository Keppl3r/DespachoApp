import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const EXPEDIENTES_API_URL = 'http://localhost:8080/api/expedientes';
const CLIENTES_API_URL = 'http://localhost:8080/api/clientes';

const initialState = {
    numeroExpediente: '',
    juzgado: '',
    materia: '',
    cliente: null
};

function GestionExpedientes() {
    const [expedientes, setExpedientes] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clienteFiltro, setClienteFiltro] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(initialState);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [expedienteSeleccionadoId, setExpedienteSeleccionadoId] = useState(null);

    useEffect(() => {
        obtenerClientes();
    }, []);

    useEffect(() => {
        if (!clienteFiltro) {
            setExpedientes([]);
            return;
        }
        const timerId = setTimeout(() => {
            obtenerExpedientesPorCliente(clienteFiltro.id, searchTerm);
        }, 500);
        return () => clearTimeout(timerId);
    }, [clienteFiltro, searchTerm]);

    const obtenerClientes = async () => {
        try {
            const res = await axios.get(CLIENTES_API_URL);
            setClientes(res.data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            alert('Error al cargar los clientes.');
        }
    };

    const obtenerExpedientesPorCliente = async (clienteId, numero) => {
        try {
            const params = new URLSearchParams();
            if (numero) params.append('numero', numero);
            const res = await axios.get(`${EXPEDIENTES_API_URL}/por-cliente/${clienteId}?${params.toString()}`);
            setExpedientes(res.data);
        } catch (error) {
            console.error(`Error al obtener expedientes para el cliente ${clienteId}:`, error);
            setExpedientes([]);
            alert('Error al cargar los expedientes.');
        }
    };

    const crearExpediente = async (expediente) => {
        try {
            await axios.post(EXPEDIENTES_API_URL, expediente);
            alert('Expediente creado con éxito');
            setSearchTerm('');
            if (!searchTerm) obtenerExpedientesPorCliente(clienteFiltro.id);
        } catch (error) {
            console.error("Error al crear expediente:", error);
            alert('Error al crear el expediente.');
        }
    };

    const actualizarExpediente = async (id, expediente) => {
        try {
            await axios.put(`${EXPEDIENTES_API_URL}/${id}`, expediente);
            alert('Expediente actualizado con éxito');
            setSearchTerm('');
            if (!searchTerm) obtenerExpedientesPorCliente(clienteFiltro.id);
        } catch (error) {
            console.error("Error al actualizar expediente:", error);
            alert('Error al actualizar el expediente.');
        }
    };

    const eliminarExpediente = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este expediente?")) {
            try {
                await axios.delete(`${EXPEDIENTES_API_URL}/${id}`);
                alert('Expediente eliminado');
                obtenerExpedientesPorCliente(clienteFiltro.id, searchTerm);
            } catch (error) {
                console.error("Error al eliminar expediente:", error);
                alert('Error al eliminar el expediente.');
            }
        }
    };

    const handleFiltroClienteChange = (e) => {
        const selectedId = e.target.value;
        const clienteSel = clientes.find(c => c.id === parseInt(selectedId));
        setClienteFiltro(clienteSel || null);
        setSearchTerm('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modoEdicion) {
            actualizarExpediente(expedienteSeleccionadoId, formData);
        } else {
            crearExpediente(formData);
        }
        resetForm();
    };

    const handleEditar = (expediente) => {
        setModoEdicion(true);
        setExpedienteSeleccionadoId(expediente.id);
        setFormData(expediente);
    };

    const resetForm = () => {
        setModoEdicion(false);
        setExpedienteSeleccionadoId(null);
        setFormData({ ...initialState, cliente: clienteFiltro });
    };

    return (
        <>
            <div className="filter-container">
                <h2>Seleccionar Cliente</h2>
                <select onChange={handleFiltroClienteChange} defaultValue="">
                    <option value="" disabled>-- Elige un cliente para ver sus expedientes --</option>
                    {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>{cliente.nombreCompleto}</option>
                    ))}
                </select>
            </div>

            {clienteFiltro && (
                <>
                    <div className="form-container">
                        <h2>{modoEdicion ? 'Editar Expediente' : `Añadir Expediente a ${clienteFiltro.nombreCompleto}`}</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="numeroExpediente" placeholder="Número de Expediente" value={formData.numeroExpediente} onChange={handleInputChange} required />
                            <input type="text" name="juzgado" placeholder="Juzgado" value={formData.juzgado} onChange={handleInputChange} />
                            <input type="text" name="materia" placeholder="Materia" value={formData.materia} onChange={handleInputChange} />
                            <div>
                                <button type="submit">{modoEdicion ? 'Actualizar' : 'Guardar'}</button>
                                {modoEdicion && <button type="button" onClick={resetForm} className="secondary">Cancelar</button>}
                            </div>
                        </form>
                    </div>

                    <div className="list-container">
                        <h2>Lista de Expedientes</h2>
                        <div>
                            <input
                                type="text"
                                placeholder="Buscar por número de expediente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Número</th>
                                    <th>Juzgado</th>
                                    <th>Materia</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expedientes.map(exp => (
                                    <tr key={exp.id}>
                                        <td>{exp.numeroExpediente}</td>
                                        <td>{exp.juzgado}</td>
                                        <td>{exp.materia}</td>
                                        <td>
                                            <button onClick={() => handleEditar(exp)} className="secondary">Editar</button>
                                            <button onClick={() => eliminarExpediente(exp.id)} className="danger">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    );
}

export default GestionExpedientes;
