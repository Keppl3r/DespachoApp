import styled, { css } from 'styled-components';

// Paleta de colores y variables para mantener la consistencia
const theme = {
    primary: '#007bff',
    primaryHover: '#0056b3',
    secondary: '#6c757d',
    secondaryHover: '#5a6268',
    danger: '#dc3545',
    dangerHover: '#c82333',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    shadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
};

// --- Componentes Reutilizables ---

export const Button = styled.button`
    color: ${theme.white};
    background-color: ${props => props.danger ? theme.danger : (props.secondary ? theme.secondary : theme.primary)};
    border: none;
    border-radius: ${theme.borderRadius};
    padding: 10px 15px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    margin: 5px;

    &:hover {
        background-color: ${props => props.danger ? theme.dangerHover : (props.secondary ? theme.secondaryHover : theme.primaryHover)};
    }
`;

const sharedInputStyles = css`
    padding: 10px;
    margin-bottom: 10px;
    border-radius: ${theme.borderRadius};
    border: 1px solid #ccc;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
        outline: none;
        border-color: ${theme.primary};
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
`;

export const Input = styled.input`${sharedInputStyles}`;
export const Select = styled.select`${sharedInputStyles}`;

export const Card = styled.div`
    background: ${theme.white};
    border-radius: 8px;
    box-shadow: ${theme.shadow};
    padding: 25px;
    margin-bottom: 25px;
`;

export const Title = styled.h2`
    color: ${theme.dark};
    border-bottom: 2px solid ${theme.primary};
    padding-bottom: 10px;
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5rem;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
        border-bottom: 1px solid #ddd;
        padding: 12px 15px;
        text-align: left;
    }

    // --- ESTA ES LA CORRECCIÓN ---
    thead th {
        background-color: ${theme.light}; /* Fondo gris claro para la cabecera */
        border-bottom: 2px solid #dee2e6;
        font-weight: 600;
        color: ${theme.dark};
    }

    tbody tr:hover {
        background-color: #f1f3f5;
    }
`;

export const ActionsContainer = styled.td`
    text-align: center !important;
`;

export const FilterContainer = styled(Card)`
    background-color: ${theme.light};
`;

export const DateFilterWrapper = styled.div`
    margin-top: 15px;
    display: flex;
    align-items: center;
    gap: 10px;

    label {
        font-weight: 500;
    }
`;
