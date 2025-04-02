import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export default function ButtonAppBar() {
    const navigate = useNavigate();
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: '#8B0000' }}>
                <Toolbar>
                    <img
                        src="https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743519261/readtoowell/iconos/LogoImagen_blanco_r72r75.png"
                        alt="Logo"
                        style={{ height: 45 }}
                    />
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            onClick={() => navigate("/catalogo")}
                            sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}
                        >
                            Nuestro catálogo
                        </Button>
                    </Box>
                    <Button color="inherit">Iniciar sesión</Button>
                    <Button color="inherit">Registro</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
