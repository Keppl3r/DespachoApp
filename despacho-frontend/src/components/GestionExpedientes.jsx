import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import authHeader from '../services/auth-header'; // 1. Importamos el authHeader
import {
    Card,
    Title,
    Input,
    Select,
    Button,
    Table,
    ActionsContainer,
    FilterContainer
} from '../styles/StyledComponents';

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
            // 2. Añadimos la cabecera de autorización
            const res = await axios.get(CLIENTES_API_URL, { headers: authHeader() });
            setClientes(res.data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            toast.error('Error al cargar los clientes.');
        }
    };

    const obtenerExpedientesPorCliente = async (clienteId, numero) => {
        try {
            const params = new URLSearchParams();
            if (numero) params.append('numero', numero);
            // 3. Añadimos la cabecera de autorización
            const res = await axios.get(`${EXPEDIENTES_API_URL}/por-cliente/${clienteId}?${params.toString()}`, { headers: authHeader() });
            setExpedientes(res.data);
        } catch (error) {
            console.error(`Error al obtener expedientes para el cliente ${clienteId}:`, error);
            toast.error('Error al cargar los expedientes.');
            setExpedientes([]);
        }
    };

    const crearExpediente = async (expediente) => {
        try {
            // 4. Añadimos la cabecera de autorización
            await axios.post(EXPEDIENTES_API_URL, expediente, { headers: authHeader() });
            toast.success('Expediente creado con éxito');
            setSearchTerm('');
            if (!searchTerm) obtenerExpedientesPorCliente(clienteFiltro.id);
        } catch (error) {
            console.error("Error al crear expediente:", error);
            toast.error('Error al crear el expediente.');
        }
    };

    const actualizarExpediente = async (id, expediente) => {
        try {
            // 5. Añadimos la cabecera de autorización
            await axios.put(`${EXPEDIENTES_API_URL}/${id}`, expediente, { headers: authHeader() });
            toast.success('Expediente actualizado con éxito');
            setSearchTerm('');
            if (!searchTerm) obtenerExpedientesPorCliente(clienteFiltro.id);
        } catch (error) {
            console.error("Error al actualizar expediente:", error);
            toast.error('Error al actualizar el expediente.');
        }
    };

    const handleEliminar = (id) => {
        toast((t) => (
            <span>
                ¿Estás seguro?
                <Button
                    onClick={() => {
                        toast.dismiss(t.id);
                        eliminarExpediente(id);
                    }}
                    danger
                    style={{ marginLeft: '10px' }}
                >
                    Eliminar
                </Button>
                <Button onClick={() => toast.dismiss(t.id)} secondary>
                    Cancelar
                </Button>
            </span>
        ), { icon: '🤔' });
    };

    const eliminarExpediente = async (id) => {
        try {
            // 6. Añadimos la cabecera de autorización
            await axios.delete(`${EXPEDIENTES_API_URL}/${id}`, { headers: authHeader() });
            toast.success('Expediente eliminado');
            obtenerExpedientesPorCliente(clienteFiltro.id, searchTerm);
        } catch (error) {
            console.error("Error al eliminar expediente:", error);
            toast.error('Error al eliminar el expediente.');
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
        <main>
            <FilterContainer>
                <Title>Seleccionar Cliente</Title>
                <Select onChange={handleFiltroClienteChange} defaultValue="">
                    <option value="" disabled>-- Elige un cliente para ver sus expedientes --</option>
                    {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>{cliente.nombreCompleto}</option>
                    ))}
                </Select>
            </FilterContainer>

            {clienteFiltro && (
                <>
                    <Card>
                        <Title>{modoEdicion ? 'Editar Expediente' : `Añadir Expediente a ${clienteFiltro.nombreCompleto}`}</Title>
                        <form onSubmit={handleSubmit}>
                            <Input type="text" name="numeroExpediente" placeholder="Número de Expediente" value={formData.numeroExpediente} onChange={handleInputChange} required />
                            <Input type="text" name="juzgado" placeholder="Juzgado" value={formData.juzgado} onChange={handleInputChange} />
                            <Input type="text" name="materia" placeholder="Materia" value={formData.materia} onChange={handleInputChange} />
                            <div>
                                <Button type="submit">{modoEdicion ? 'Actualizar' : 'Guardar'}</Button>
                                {modoEdicion && <Button type="button" onClick={resetForm} secondary>Cancelar</Button>}
                            </div>
                        </form>
                    </Card>

                    <Card>
                        <Title>Lista de Expedientes</Title>
                        <div>
                            <Input
                                type="text"
                                placeholder="Buscar por número de expediente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ marginBottom: '20px' }}
                            />
                        </div>
                        <Table>
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
                                        <ActionsContainer>
                                            <Button onClick={() => handleEditar(exp)} secondary>Editar</Button>
                                            <Button onClick={() => handleEliminar(exp.id)} danger>Eliminar</Button>
                                        </ActionsContainer>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </>
            )}
        </main>
    );
}

export default GestionExpedientes;
