// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchWithToken } from '../../services/authServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Aquí podrías cargar los datos del usuario desde el localStorage o una API
        const token = localStorage.getItem('msal_token');
        if (token) {
            setUser({ token });
        }
    }, []);

    const fetchData = async (url) => {
        const data = await fetchWithToken(url);
        return data;
    };

   return (
    <AuthContext.Provider value={{ user, setUser, fetchData }}>
        {children}
    </AuthContext.Provider>
);
};

export const useAuth = () => React.useContext(AuthContext);
