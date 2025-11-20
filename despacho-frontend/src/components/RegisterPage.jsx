import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthService from '../services/auth.service'; // 1. Importamos el servicio
import {
    Card,
    Title,
    Input,
    Button,
    AuthContainer
} from '../styles/StyledComponents';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        // 2. Usamos el servicio para registrar al usuario
        AuthService.register(username, email, password).then(
            (response) => {
                toast.success(response.data.message);
                navigate('/login'); // 3. Redirigimos a la página de Login
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                toast.error(`Error: ${resMessage}`);
            }
        );
    };

    return (
        <AuthContainer>
            <Card>
                <Title>Crear Cuenta</Title>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px' }}>
                    Únete a nosotros para gestionar tus expedientes
                </p>
                <form onSubmit={handleRegister}>
                    <Input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div style={{ marginTop: '24px' }}>
                        <Button type="submit" style={{ width: '100%' }}>
                            Registrarse
                        </Button>
                    </div>
                </form>
            </Card>
        </AuthContainer>
    );
}

export default RegisterPage;
