import {createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const name = localStorage.getItem('name');
        const profilePic = localStorage.getItem('profilePic');
        const id = localStorage.getItem('id');

        if (!token) { // Si no hay token, se considera la sesión inválida
            return {token: null, role: null, name: null, profilePic: null, id: null};
        }

        return {
            token,
            role: role ? parseInt(role) : null,
            name,
            profilePic,
            id
        };
    });

    const updateAuth = (token, role, name, profilePic, id) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        localStorage.setItem('profilePic', profilePic || '');
        localStorage.setItem('id', id);
        setAuthState({token, role, name, profilePic, id});
    };

    const updateProfileImage = (profilePicUrl) => {
        localStorage.setItem('profilePic', profilePicUrl);
        setAuthState(prev => ({
            ...prev,
            profilePic: profilePicUrl
        }));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('profilePic');
        localStorage.removeItem('id');
        setAuthState({token: null, role: null, name: null, profileImage: null, id: null});
    };

    useEffect(() => {
        const validateToken = async () => {
            if (!authState.token) return;

            try {
                const response = await axios.get("http://localhost:8080/auth/validar", {
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

        const interval = setInterval(validateToken, 10 * 60 * 1000); // Cada 10 minutos valida el token
        return () => clearInterval(interval);
    }, [authState.token]);

    return (
        <AuthContext.Provider value={{
            token: authState.token,
            role: authState.role,
            name: authState.name,
            profilePic: authState.profilePic,
            id: authState.id,
            updateAuth,
            updateProfileImage,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);