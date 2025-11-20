import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/`;

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + 'signin', {
                username,
                password
            })
            .then(response => {
                if (response.data.token) {
                    // Guardamos el usuario y el token en el almacenamiento local
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    googleLogin(token) {
        return axios
            .post(API_URL + 'google', { token })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        // Eliminamos el usuario del almacenamiento local
        localStorage.removeItem('user');
    }

    register(username, email, password) {
        return axios.post(API_URL + 'signup', {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        // Obtenemos el usuario del almacenamiento local
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }
}

export default new AuthService();
