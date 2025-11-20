import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { PageContainer, Title } from '../styles/StyledComponents';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const WelcomeSection = styled.div`
    text-align: center;
    margin-bottom: 60px; /* More space */
    
    h2 {
        font-size: 3rem; /* Larger welcome */
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 20px;
    }
    
    p {
        font-size: 1.5rem; /* Larger subtitle */
        color: #64748b;
        font-weight: 500;
    }
`;

const QuickActionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); /* Larger cards */
    gap: 40px; /* More spacing */
    margin-bottom: 60px;
`;

const ActionCard = styled.div`
    background: white;
    border-radius: 20px;
    padding: 50px; /* Much more padding */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 3px solid transparent;
    text-align: center;
    min-height: 300px; /* Taller cards */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        border-color: #2563eb;
    }
    
    .icon {
        font-size: 6rem; /* Much larger icons */
        margin-bottom: 25px;
    }
    
    h3 {
        font-size: 2rem; /* Larger titles */
        color: #1e293b;
        margin-bottom: 15px;
        font-weight: 700;
    }
    
    p {
        font-size: 1.3rem; /* Larger descriptions */
        color: #64748b;
        line-height: 1.6;
    }
`;

const EventsSection = styled.div`
    background: white;
    border-radius: 20px;
    padding: 50px; /* More padding */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    
    h3 {
        font-size: 2.2rem; /* Larger section title */
        color: #1e293b;
        margin-bottom: 30px;
        font-weight: 700;
    }
`;

const EventTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    
    th, td {
        padding: 24px 20px; /* Much more padding */
        text-align: left;
        font-size: 1.4rem; /* Larger text */
        border-bottom: 2px solid #e2e8f0;
    }
    
    th {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        font-weight: 700;
        font-size: 1.5rem;
        text-transform: uppercase;
    }
    
    tr:hover {
        background: rgba(37, 99, 235, 0.05);
    }
`;

const NoEventsMessage = styled.p`
    text-align: center;
    color: #64748b;
    font-size: 1.4rem; /* Larger message */
    padding: 40px;
    font-style: italic;
`;

function Dashboard() {
    const [proximosEventos, setProximosEventos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/eventos/proximos?dias=7`);
                setProximosEventos(response.data);
            } catch (error) {
                console.error('Error al cargar eventos:', error);
            }
        };

        fetchEventos();
    }, []);

    return (
        <PageContainer>
            <WelcomeSection>
                <h2>Bienvenido a DespachoApp</h2>
                <p>¿Qué desea hacer hoy?</p>
            </WelcomeSection>

            <QuickActionsGrid>
                <ActionCard onClick={() => navigate('/clientes')}>
                    <div className="icon">👥</div>
                    <h3>Gestionar Clientes</h3>
                    <p>Ver, agregar y editar información de clientes</p>
                </ActionCard>

                <ActionCard onClick={() => navigate('/expedientes')}>
                    <div className="icon">📁</div>
                    <h3>Ver Expedientes</h3>
                    <p>Consultar y administrar expedientes legales</p>
                </ActionCard>

                <ActionCard onClick={() => navigate('/agenda')}>
                    <div className="icon">📅</div>
                    <h3>Revisar Agenda</h3>
                    <p>Ver audiencias, diligencias y vencimientos</p>
                </ActionCard>
            </QuickActionsGrid>

            <EventsSection>
                <h3>Próximos Eventos (Esta Semana)</h3>
                {proximosEventos.length > 0 ? (
                    <EventTable>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Expediente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proximosEventos.map((evento) => (
                                <tr key={evento.id}>
                                    <td>{new Date(evento.fecha).toLocaleDateString('es-MX')}</td>
                                    <td>{evento.tipo}</td>
                                    <td>{evento.descripcion}</td>
                                    <td>#{evento.expediente?.numeroExpediente || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </EventTable>
                ) : (
                    <NoEventsMessage>
                        No hay eventos programados para esta semana. ¡Todo tranquilo!
                    </NoEventsMessage>
                )}
            </EventsSection>
        </PageContainer>
    );
}

export default Dashboard;
