import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      // Guarda el token y redirige
      localStorage.setItem('msal_token', token);
      navigate('/dashboard');
    } else {
      // Manejo de error
      navigate('/login', { state: { error: 'Fallo en autenticación' } });
    }
  }, [navigate]);

  return (
    <div className="auth-handler">
      <h2>Procesando autenticación...</h2>
      <p>Por favor espera mientras te redirigimos.</p>
    </div>
  );
};

export default AuthHandler;