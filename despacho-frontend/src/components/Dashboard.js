import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const API_URL = 'http://localhost:8080/api';

function Dashboard() {
    const [proximosEventos, setProximosEventos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerProximosEventos();
    }, []);

    const obtenerProximosEventos = async () => {
        try {
            const res = await axios.get(`${API_URL}/eventos/proximos?dias=7`);
            setProximosEventos(res.data);
        } catch (error) {
            console.error("Error al obtener los próximos eventos:", error);
        }
    };

    const handleRowClick = (evento) => {
        if (evento.expediente && evento.expediente.cliente) {
            navigate('/agenda', {
                state: {
                    selectedCliente: evento.expediente.cliente,
                    selectedExpediente: evento.expediente
                }
            });
        }
    };

    return (
        <div className="list-container">
            <h2>Dashboard</h2>
            <h3>Próximos Eventos (7 días)</h3>
            {proximosEventos.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Expediente</th>
                            <th>Cliente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proximosEventos.map(evento => (
                            <tr key={evento.id} onClick={() => handleRowClick(evento)} style={{ cursor: 'pointer' }}>
                                <td>{new Date(evento.fecha).toLocaleDateString()}</td>
                                <td>{evento.tipo}</td>
                                <td>{evento.descripcion}</td>
                                <td>{evento.expediente?.numeroExpediente || 'N/A'}</td>
                                <td>{evento.expediente?.cliente?.nombreCompleto || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay eventos programados para los próximos 7 días.</p>
            )}
        </div>
    );
}

export default Dashboard;
