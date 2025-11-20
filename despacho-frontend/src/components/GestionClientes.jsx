import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import authHeader from '../services/auth-header'; // 1. Importamos el authHeader
import {
    Card,
    Title,
    Input,
    Button,
    Table,
    ActionsContainer
} from '../styles/StyledComponents';

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
            // 2. Añadimos la cabecera de autorización a la petición GET
            const respuesta = await axios.get(`${API_URL}?${params.toString()}`, { headers: authHeader() });
            setClientes(respuesta.data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            toast.error('No se pudieron cargar los clientes. ¿Has iniciado sesión?');
        }
    };

    const crearCliente = async (cliente) => {
        try {
            // 3. Añadimos la cabecera a la petición POST
            await axios.post(API_URL, cliente, { headers: authHeader() });
            toast.success('Cliente creado con éxito');
            setSearchTerm('');
            if (!searchTerm) obtenerClientes();
        } catch (error) {
            console.error("Error al crear cliente:", error);
            toast.error('Error al crear el cliente.');
        }
    };

    const actualizarCliente = async (id, cliente) => {
        try {
            // 4. Añadimos la cabecera a la petición PUT
            await axios.put(`${API_URL}/${id}`, cliente, { headers: authHeader() });
            toast.success('Cliente actualizado con éxito');
            setSearchTerm('');
            if (!searchTerm) obtenerClientes();
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            toast.error('Error al actualizar el cliente.');
        }
    };

    const handleEliminar = (id) => {
        toast((t) => (
            <span>
                ¿Estás seguro?
                <Button
                    onClick={() => {
                        toast.dismiss(t.id);
                        eliminarCliente(id);
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

    const eliminarCliente = async (id) => {
        try {
            // 5. Añadimos la cabecera a la petición DELETE
            await axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
            toast.success('Cliente eliminado');
            obtenerClientes(searchTerm);
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
            toast.error('Error al eliminar el cliente.');
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
        <main>
            <Card>
                <Title>{modoEdicion ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}</Title>
                <form onSubmit={handleSubmit}>
                    <Input type="text" name="nombreCompleto" placeholder="Nombre Completo" value={formData.nombreCompleto} onChange={handleInputChange} required />
                    <Input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} />
                    <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                    <Input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleInputChange} />
                    <div>
                        <Button type="submit">{modoEdicion ? 'Actualizar' : 'Guardar'}</Button>
                        {modoEdicion && <Button type="button" onClick={resetForm} secondary>Cancelar</Button>}
                    </div>
                </form>
            </Card>

            <Card>
                <Title>Lista de Clientes</Title>
                <div>
                    <Input
                        type="text"
                        placeholder="Buscar cliente por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                </div>
                <Table>
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
                                <ActionsContainer>
                                    <Button onClick={() => handleEditar(cliente)} secondary>Editar</Button>
                                    <Button onClick={() => handleEliminar(cliente.id)} danger>Eliminar</Button>
                                </ActionsContainer>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </main>
    );
}

export default GestionClientes;
