import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const name = localStorage.getItem('name');
        return { token, role: role ? parseInt(role) : null, name };
    });

    const updateAuth = (token, role, name) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        setAuthState({ token, role, name });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        setAuthState({ token: null, role: null, name: null });
    };

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