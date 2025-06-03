import { useUser } from '../components/UserContext/UserContext';

export const useAuth = () => {
    const { setUser } = useUser();

    const handleLogin = () => {
        const authWindow = window.open(
            'http://localhost:8000/auth/login',
            'msauth',
            'width=500,height=600,left=200,top=200'
        );

        // Verificar si el popup fue bloqueado
        if (!authWindow || authWindow.closed || typeof authWindow.closed === 'undefined') {
            throw new Error('El popup de autenticación fue bloqueado. Por favor permite popups para este sitio.');
        }
    };

    const handleLogout = () => {
        // Limpiar el usuario del estado y localStorage
        setUser(null);
        
        // Opcional: llamar al endpoint de logout del backend
        window.open('http://localhost:8000/auth/logout', '_blank');
    };

    return { handleLogin, handleLogout };
};