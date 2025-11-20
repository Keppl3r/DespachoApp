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
    padding: 40px; /* Much more padding */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    animation: ${fadeIn} 0.5s ease-out;
    border: 2px solid ${theme.border};
    max-width: 600px; /* Wider cards */
    margin: 0 auto 30px;
`;

export const Title = styled.h2`
    color: ${theme.text};
    margin-bottom: 30px; /* More space */
    font-size: 2.5rem; /* Much larger */
    font-weight: 700;
    text-align: center;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 25px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

    th, td {
        padding: 20px 16px; /* Much more padding */
        text-align: left;
        font-size: 1.3rem; /* Larger text */
        border-bottom: 2px solid ${theme.border}; /* Thicker borders */
    }

    th {
        background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%);
        color: white;
        font-weight: 700;
        font-size: 1.4rem; /* Even larger headers */
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    tr:hover {
        background: rgba(37, 99, 235, 0.05);
    }

    tr:last-child td {
        border-bottom: none;
    }
`;

export const PageContainer = styled.div`
    max-width: 1400px; /* Wider */
    margin: 0 auto;
    padding: 40px 30px; /* More padding */
`;

export const AuthContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 20px;
`;
