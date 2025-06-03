// src/services/authService.js

 const fetchWithToken = async (url) => {
    let token = localStorage.getItem('msal_token');
    if (!token) {
        console.error("No hay token disponible.");
        return;
    }

    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Si la respuesta es 401, intenta refrescar el token
        if (res.status === 401) {
            console.log('Token expirado, intentaremos refrescarlo');
            token = await refreshAccessToken();
            
            // Intenta nuevamente con el token renovado
            const retryRes = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return await retryRes.json();
        }

        return await res.json();
    } catch (err) {
        console.error("Error al hacer la solicitud", err);
    }
};

// Función para refrescar el token
 const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        console.error("No hay refresh_token disponible.");
        return null;
    }

    try {
        const response = await fetch('https://backend-itsa-avisos-production.up.railway.app/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        const data = await response.json();
        if (data.token) {
            // Guarda el nuevo token y el refresh_token (si es renovado)
            localStorage.setItem('msal_token', data.token);
            localStorage.setItem('refresh_token', data.refresh_token || refreshToken); // Si el refresh_token es renovado, guárdalo
            return data.token;
        } else {
            console.error("Error al refrescar el token", data);
            return null;
        }
    } catch (err) {
        console.error("Error al refrescar el token", err);
    }
};

export { fetchWithToken, refreshAccessToken };
