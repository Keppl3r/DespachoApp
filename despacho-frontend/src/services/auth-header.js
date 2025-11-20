// Esta función lee el localStorage en busca del usuario.
// Si encuentra un usuario logueado con un token, devuelve la cabecera HTTP de autorización.
// De lo contrario, devuelve un objeto vacío.

export default function authHeader() {
    const userStr = localStorage.getItem("user");
    let user = null;
    if (userStr) {
        user = JSON.parse(userStr);
    }

    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
}
