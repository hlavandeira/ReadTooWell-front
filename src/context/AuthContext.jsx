import {createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const name = localStorage.getItem('name');

        if (!token) { // Si no hay token, se considera la sesión inválida
            return {token: null, role: null, name: null};
        }

        return {token, role: role ? parseInt(role) : null, name};
    });

    const updateAuth = (token, role, name) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        setAuthState({token, role, name});
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        setAuthState({token: null, role: null, name: null});
    };

    useEffect(() => {
        const validateToken = async () => {
            if (!authState.token) return;

            try {
                await axios.get("http://localhost:8080/auth/validar", {
                    headers: {
                        Authorization: 'Bearer ' + authState.token,
                    },
                });
            } catch (error) {
                console.log(error);
                console.warn("Token inválido, cerrando sesión");
                logout();
            }
        };

        validateToken();
    }, [authState.token]);

    return (
        <AuthContext.Provider value={{
            token: authState.token,
            role: authState.role,
            name: authState.name,
            updateAuth,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);