import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import AuthService from '../services/auth.service';
import {
    Card,
    Title,
    Input,
    Button,
    AuthContainer
} from '../styles/StyledComponents';

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        AuthService.login(username, password).then(
            () => {
                toast.success('¡Bienvenido!');
                // Simplemente notificamos al padre del éxito.
                // El padre se encargará de la navegación.
                onLoginSuccess();
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                toast.error(`Login fallido: ${resMessage}`);
                setLoading(false);
            }
        );
    };

    return (
        <AuthContainer>
            <Card>
                <Title>Bienvenido</Title>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px' }}>
                    Ingresa tus credenciales para continuar
                </p>
                <form onSubmit={handleLogin}>
                    <Input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </Button>
                    </div>
                </form>

                <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                    <p style={{ textAlign: 'center', marginBottom: '10px', color: '#64748b' }}>O continúa con</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                AuthService.googleLogin(credentialResponse.credential).then(
                                    () => {
                                        toast.success('¡Bienvenido con Google!');
                                        onLoginSuccess();
                                    },
                                    (error) => {
                                        toast.error('Error al iniciar sesión con Google');
                                    }
                                );
                            }}
                            onError={() => {
                                toast.error('Login Fallido');
                            }}
                        />
                    </div>
                </div>
            </Card>
        </AuthContainer>
    );
}

export default LoginPage;
