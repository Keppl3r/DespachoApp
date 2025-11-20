import styled, { css, keyframes } from 'styled-components';

// --- Modern Theme Palette ---
const theme = {
    primary: '#2563eb', // Vibrant Blue
    primaryHover: '#1d4ed8',
    secondary: '#64748b', // Slate
    secondaryHover: '#475569',
    danger: '#ef4444', // Red
    dangerHover: '#dc2626',
    success: '#22c55e', // Green
    background: '#f8fafc', // Very light blue-grey
    surface: '#ffffff',
    text: '#1e293b', // Slate 800
    textLight: '#64748b', // Slate 500
    border: '#e2e8f0',
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    shadowHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    borderRadius: '12px',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Reusable Components ---

export const Button = styled.button`
    background-color: ${props => props.danger ? theme.danger : (props.secondary ? theme.secondary : theme.primary)};
    color: ${theme.surface};
    border: none;
    border-radius: ${theme.borderRadius};
    padding: 12px 24px;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: ${theme.fontFamily};
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:hover {
        background-color: ${props => props.danger ? theme.dangerHover : (props.secondary ? theme.secondaryHover : theme.primaryHover)};
        transform: translateY(-1px);
        box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
`;

const sharedInputStyles = css`
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 16px;
    border-radius: ${theme.borderRadius};
    border: 2px solid ${theme.border};
    background-color: ${theme.surface};
    font-size: 1rem;
    font-family: ${theme.fontFamily};
    color: ${theme.text};
    transition: all 0.2s ease;
    box-sizing: border-box;

    &::placeholder {
        color: #94a3b8;
    }

    &:focus {
        outline: none;
        border-color: ${theme.primary};
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }
`;

export const Input = styled.input`${sharedInputStyles}`;
export const Select = styled.select`${sharedInputStyles}`;

export const Card = styled.div`
    background: ${theme.surface};
    border-radius: 16px;
    box-shadow: ${theme.shadow};
    padding: 40px;
    width: 100%;
    max-width: 450px; /* Slightly wider for better breathing room */
    margin: 0 auto;
    animation: ${fadeIn} 0.4s ease-out;
    border: 1px solid ${theme.border};
`;

export const Title = styled.h2`
    color: ${theme.text};
    font-family: ${theme.fontFamily};
    font-size: 1.8rem;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 24px;
    text-align: center;
    letter-spacing: -0.025em;
    
    /* Decorative underline */
    position: relative;
    padding-bottom: 16px;
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 4px;
        background: ${theme.primary};
        border-radius: 2px;
    }
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 24px;
    background: ${theme.surface};
    border-radius: ${theme.borderRadius};
    overflow: hidden;
    box-shadow: ${theme.shadow};

    th, td {
        padding: 16px 20px;
        text-align: left;
        border-bottom: 1px solid ${theme.border};
    }

    th {
        background-color: #f1f5f9;
        color: ${theme.text};
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
    }

    tr:last-child td {
        border-bottom: none;
    }

    tbody tr {
        transition: background-color 0.15s ease;
    }

    tbody tr:hover {
        background-color: #f8fafc;
    }
`;

export const ActionsContainer = styled.td`
    display: flex;
    gap: 8px;
`;

export const FilterContainer = styled.div`
    background-color: ${theme.surface};
    padding: 24px;
    border-radius: ${theme.borderRadius};
    margin-bottom: 24px;
    box-shadow: ${theme.shadow};
    border: 1px solid ${theme.border};
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-end;
`;

export const DateFilterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
        font-size: 0.875rem;
        font-weight: 600;
        color: ${theme.textLight};
    }
    
    input {
        margin-bottom: 0; /* Override default margin */
    }
`;

export const PageContainer = styled.div`
    padding: 40px 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

export const AuthContainer = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 85vh;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    padding: 20px;
`;

