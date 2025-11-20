import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Title, Table, Button } from '../styles/StyledComponents';
import '../App.css';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`;

// --- Styled Components for Dashboard ---
const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
`;

const WelcomeSection = styled.div`
    text-align: center;
    margin-bottom: 20px;

    h2 {
        font-size: 2.5rem;
        color: #1e293b;
        margin-bottom: 10px;
    }

    p {
        font-size: 1.2rem;
        color: #64748b;
    }
`;

const QuickActionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
`;

const ActionCard = styled(Card)`
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 2px solid transparent;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border-color: #2563eb;
    }

    h3 {
        font-size: 1.5rem;
        margin-bottom: 15px;
        color: #1e293b;
    }

    p {
        font-size: 1.1rem;
        color: #64748b;
        margin-bottom: 20px;
    }
`;

const LargeIcon = styled.div`
    font-size: 3rem;
    margin-bottom: 20px;
    color: #2563eb;
`;

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
        <DashboardContainer>
            <WelcomeSection>
                <h2>Bienvenido al Despacho</h2>
                <p>¿Qué desea hacer hoy?</p>
            </WelcomeSection>

            <QuickActionsGrid>
                <ActionCard onClick={() => navigate('/clientes')}>
                    <LargeIcon>👥</LargeIcon>
                    <h3>Gestionar Clientes</h3>
                    <p>Ver lista de clientes, agregar nuevos o editar información.</p>
                    <Button>Ir a Clientes</Button>
                </ActionCard>

                <ActionCard onClick={() => navigate('/expedientes')}>
                    <LargeIcon>📁</LargeIcon>
                    <h3>Ver Expedientes</h3>
                    <p>Consultar el estado de los casos y documentos.</p>
                    <Button>Ir a Expedientes</Button>
                </ActionCard>

                <ActionCard onClick={() => navigate('/agenda')}>
                    <LargeIcon>📅</LargeIcon>
                    <h3>Revisar Agenda</h3>
                    <p>Ver citas, audiencias y vencimientos próximos.</p>
                    <Button>Ir a Agenda</Button>
                </ActionCard>
            </QuickActionsGrid>

            <Card>
                <Title>📅 Próximos Eventos (7 días)</Title>
                {proximosEventos.length > 0 ? (
                    <Table>
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
                                    <td style={{ fontSize: '1.1rem' }}>{new Date(evento.fecha).toLocaleDateString()}</td>
                                    <td style={{ fontSize: '1.1rem' }}>{evento.tipo}</td>
                                    <td style={{ fontSize: '1.1rem' }}>{evento.descripcion}</td>
                                    <td style={{ fontSize: '1.1rem' }}>{evento.expediente?.numeroExpediente || 'N/A'}</td>
                                    <td style={{ fontSize: '1.1rem' }}>{evento.expediente?.cliente?.nombreCompleto || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p style={{ fontSize: '1.2rem', textAlign: 'center', color: '#64748b', padding: '20px' }}>
                        No hay eventos programados para esta semana. ¡Todo tranquilo!
                    </p>
                )}
            </Card>
        </DashboardContainer>
    );
}

export default Dashboard;
