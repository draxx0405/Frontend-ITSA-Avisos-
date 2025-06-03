import React, { useEffect } from 'react';
import { useAuth } from '../components/UserContext/UserContext';
import { Box, Button, Heading, Card, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        // ✅ Si venimos del logout (redirect desde Azure)
        if (window.location.href.includes("https://frontend-itsa-avisos-production.up.railway.app/")) {
            console.log("Volviendo del logout. Limpiando datos...");
            localStorage.clear();
            return; // Evita seguir con la lógica del token
        }

        const token = localStorage.getItem('msal_token');
        if (!token) return;

        fetch('http://backend-itsa-avisos-production-ecc1.up.railway.app/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Token inválido o expirado");
            return res.json();
        })
        .then(data => {
            setUser({
                name: data.name,
                email: data.email,
                token
            });
        })
        .catch(err => {
            console.error("Error al obtener info de usuario", err);
            localStorage.removeItem('msal_token');
        });
    }, []);


    const handleLogin = () => {
    // Abre la ventana emergente para iniciar sesión
    const authWindow = window.open(
        'http://backend-itsa-avisos-production-ecc1.up.railway.app/auth/login',
        'msauth',
        'width=500,height=600,left=200,top=200'
    );

    const handleMessage = (event) => {
        // Asegúrate de que el mensaje provenga de un origen permitido
        const allowedOrigins = ['http://backend-itsa-avisos-production-ecc1.up.railway.app', 'https://frontend-itsa-avisos-production.up.railway.app/'];
        if (!allowedOrigins.includes(event.origin)) return;

        if (event.data.type === 'MSAL_AUTH' && event.data.token) {
            // Guarda los tokens
            localStorage.setItem('msal_token', event.data.token);
            localStorage.setItem('refresh_token', event.data.refresh_token); // Guarda el refresh_token

            // Guarda información del usuario
            setUser({
                name: event.data.user.name,
                email: event.data.user.email,
                token: event.data.token,
                refreshToken: event.data.refresh_token // También guarda el refresh_token
            });

            // Navega al inicio de la aplicación
            navigate('/Inicio');
            
            toast({
                title: 'Sesión iniciada',
                status: 'success',
                duration: 3000,
            });

            window.removeEventListener('message', handleMessage);
        }
    };

    window.addEventListener('message', handleMessage);
};


    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100vw"
            height="100vh"
            backgroundColor=" #0093E9"
            backgroundImage="linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"
        >
            <Card margin={10} p={8} boxShadow="xl" borderRadius="xl">
                {user ? (
                    <Box textAlign="center" p={5}>
                        <Heading mb={6}>¡Bienvenido de nuevo, {user.name}!</Heading>
                        <Button 
                            onClick={() => navigate('/Inicio')}
                            colorScheme="teal"
                            size="lg"
                            width="60%"
                        >
                            Continuar
                        </Button>
                    </Box>
                ) : (
                    <Box textAlign="center" p={5}>
                        <Heading mb={6}>Bienvenido a ITSA Avisos</Heading>
                        <Button 
                            onClick={handleLogin}
                            colorScheme="blue"
                            size="lg"
                            width="60%"
                        >
                            Iniciar Sesión
                        </Button>
                    </Box>
                )}
            </Card>
        </Box>
    );
}