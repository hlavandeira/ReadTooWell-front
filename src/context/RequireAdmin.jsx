import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import axios from "axios";
import {Box, CircularProgress} from "@mui/material";
import API_URL from '../apiUrl';

const RequireAdmin = ({children}) => {
    const token = localStorage.getItem("token");
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        if (!token) {
            setIsAdmin(false);
            return <Navigate to="/inicio-sesion" replace/>;
        }

        const verifyAdmin = async () => {
            try {
                const response = await axios.get(`${API_URL}/usuarios/verificar-admin`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setIsAdmin(response.data);
            } catch (error) {
                console.error('Error verificando rol:', error);
                setIsAdmin(false);
            }
        };

        verifyAdmin();
    }, [token]);

    if (isAdmin === null) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{color: '#8B0000'}}/>
            </Box>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace/>;
    }

    return children;
};

export default RequireAdmin;