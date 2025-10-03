import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../App.css';

const EVENTOS_API_URL = 'http://localhost:8080/api/eventos';
const EXPEDIENTES_API_URL = 'http://localhost:8080/api/expedientes';
const CLIENTES_API_URL = 'http://localhost:8080/api/clientes';

const initialState = {
    fecha: '',
    descripcion: '',
    tipo: '',
    expediente: null
};

function GestionAgenda() {
    const location = useLocation();
    const [eventos, setEventos] = useState([]);
    const [expedientes, setExpedientes] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [tiposDeEvento, setTiposDeEvento] = useState([]);
    const [clienteFiltro, setClienteFiltro] = useState(location.state?.selectedCliente || null);
    const [expedienteFiltro, setExpedienteFiltro] = useState(location.state?.selectedExpediente || null);
    const [fechaInicioFiltro, setFechaInicioFiltro] = useState('');
    const [fechaFinFiltro, setFechaFinFiltro] = useState('');
    const [formData, setFormData] = useState(initialState);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [eventoSeleccionadoId, setEventoSeleccionadoId] = useState(null);

    useEffect(() => {
        obtenerClientes();
        obtenerTiposDeEvento();
    }, []);

    useEffect(() => {
        if (clienteFiltro) {
            obtenerExpedientesPorCliente(clienteFiltro.id);
        } else {
            setExpedientes([]);
        }
        if (!location.state) {
            setExpedienteFiltro(null);
        }
    }, [clienteFiltro, location.state]);

    useEffect(() => {
        if (expedienteFiltro) {
            obtenerEventosPorExpediente(expedienteFiltro.id, fechaInicioFiltro, fechaFinFiltro);
            setFormData(prev => ({ ...initialState, expediente: expedienteFiltro }));
        } else {
            setEventos([]);
        }
    }, [expedienteFiltro, fechaInicioFiltro, fechaFinFiltro]);

    const obtenerClientes = async () => {
        try {
            const res = await axios.get(CLIENTES_API_URL);
            setClientes(res.data);
        } catch (error) { console.error("Error al obtener clientes:", error); alert('Error al cargar clientes'); }
    };

    const obtenerTiposDeEvento = async () => {
        try {
            const res = await axios.get(`${EVENTOS_API_URL}/tipos`);
            setTiposDeEvento(res.data);
        } catch (error) { console.error("Error al obtener tipos de evento:", error); }
    };

    const obtenerExpedientesPorCliente = async (clienteId) => {
        try {
            const res = await axios.get(`${EXPEDIENTES_API_URL}/por-cliente/${clienteId}`);
            setExpedientes(res.data);
        } catch (error) { console.error("Error al obtener expedientes:", error); }
    };

    const obtenerEventosPorExpediente = async (expedienteId, fechaInicio, fechaFin) => {
        try {
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            const res = await axios.get(`${EVENTOS_API_URL}/por-expediente/${expedienteId}?${params.toString()}`);
            setEventos(res.data);
        } catch (error) { console.error("Error al obtener eventos:", error); }
    };

    const refrescarEventos = () => {
        if (expedienteFiltro) {
            obtenerEventosPorExpediente(expedienteFiltro.id, fechaInicioFiltro, fechaFinFiltro);
        }
    };

    const crearEvento = async (evento) => {
        try {
            await axios.post(EVENTOS_API_URL, evento);
            alert('Evento creado con éxito');
            refrescarEventos();
        } catch (error) { console.error("Error al crear evento:", error); alert('Error al crear el evento.'); }
    };

    const actualizarEvento = async (id, evento) => {
        try {
            await axios.put(`${EVENTOS_API_URL}/${id}`, evento);
            alert('Evento actualizado con éxito');
            refrescarEventos();
        } catch (error) { console.error("Error al actualizar evento:", error); alert('Error al actualizar el evento.'); }
    };

    const eliminarEvento = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este evento?")) {
            try {
                await axios.delete(`${EVENTOS_API_URL}/${id}`);
                alert('Evento eliminado');
                refrescarEventos();
            } catch (error) { console.error("Error al eliminar evento:", error); alert('Error al eliminar el evento.'); }
        }
    };

    const handleClienteFiltroChange = (e) => {
        const selId = e.target.value;
        setClienteFiltro(clientes.find(c => c.id === parseInt(selId)) || null);
        setFechaInicioFiltro('');
        setFechaFinFiltro('');
    };

    const handleExpedienteFiltroChange = (e) => {
        const selId = e.target.value;
        setExpedienteFiltro(expedientes.find(exp => exp.id === parseInt(selId)) || null);
        setFechaInicioFiltro('');
        setFechaFinFiltro('');
    };

    const limpiarFiltrosFecha = () => {
        setFechaInicioFiltro('');
        setFechaFinFiltro('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modoEdicion) {
            actualizarEvento(eventoSeleccionadoId, formData);
        } else {
            crearEvento(formData);
        }
        resetForm();
    };

    const handleEditar = (evento) => {
        setModoEdicion(true);
        setEventoSeleccionadoId(evento.id);
        setFormData({
            fecha: new Date(evento.fecha).toISOString().split('T')[0],
            descripcion: evento.descripcion,
            tipo: evento.tipo,
            expediente: evento.expediente
        });
    };

    const resetForm = () => {
        setModoEdicion(false);
        setEventoSeleccionadoId(null);
        setFormData({ ...initialState, expediente: expedienteFiltro });
    };

    return (
        <>
            <div className="filter-container">
                <h2>Filtros de Agenda</h2>
                <select onChange={handleClienteFiltroChange} value={clienteFiltro?.id || ''}>
                    <option value="" disabled>1. Selecciona un Cliente</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombreCompleto}</option>)}
                </select>
                <select onChange={handleExpedienteFiltroChange} disabled={!clienteFiltro} value={expedienteFiltro?.id || ''}>
                    <option value="" disabled>2. Selecciona un Expediente</option>
                    {expedientes.map(exp => <option key={exp.id} value={exp.id}>{exp.numeroExpediente}</option>)}
                </select>
                {expedienteFiltro && (
                    <div>
                        <label>Desde:</label>
                        <input type="date" onChange={(e) => setFechaInicioFiltro(e.target.value)} value={fechaInicioFiltro} />
                        <label>Hasta:</label>
                        <input type="date" onChange={(e) => setFechaFinFiltro(e.target.value)} value={fechaFinFiltro} />
                        <button onClick={limpiarFiltrosFecha} className="secondary">Limpiar</button>
                    </div>
                )}
            </div>

            {expedienteFiltro && (
                <>
                    <div className="form-container">
                        <h2>{modoEdicion ? 'Editar Evento' : `Añadir Evento a Exp. ${expedienteFiltro.numeroExpediente}`}</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} required />
                            <input type="text" name="descripcion" placeholder="Descripción del evento" value={formData.descripcion} onChange={handleInputChange} required />
                            <select name="tipo" value={formData.tipo} onChange={handleInputChange} required>
                                <option value="" disabled>Selecciona un Tipo</option>
                                {tiposDeEvento.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                            </select>
                            <div>
                                <button type="submit">{modoEdicion ? 'Actualizar' : 'Guardar'}</button>
                                {modoEdicion && <button type="button" onClick={resetForm} className="secondary">Cancelar</button>}
                            </div>
                        </form>
                    </div>

                    <div className="list-container">
                        <h2>Agenda del Expediente</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                    <th>Tipo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventos.map(evento => (
                                    <tr key={evento.id}>
                                        <td>{new Date(evento.fecha).toLocaleDateString()}</td>
                                        <td>{evento.descripcion}</td>
                                        <td>{evento.tipo}</td>
                                        <td>
                                            <button onClick={() => handleEditar(evento)} className="secondary">Editar</button>
                                            <button onClick={() => eliminarEvento(evento.id)} className="danger">Eliminar</button>
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

export default GestionAgenda;
