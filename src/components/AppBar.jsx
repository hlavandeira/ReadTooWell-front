import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';
import {
    AppBar,
    Box,
    Toolbar,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Avatar, Divider
} from '@mui/material';
import {
    Login as LoginIcon,
    HowToReg as HowToRegIcon,
    AccountCircle as AccountCircleIcon,
    ExpandMore as ExpandMoreIcon,
    AdminPanelSettings as AdminIcon,
    LibraryBooks as LibrarianIcon
} from '@mui/icons-material';
import axios from "axios";
import API_URL from '../apiUrl';

export default function DynamicAppBar() {
    const {role, logout, profilePic, id, name, token} = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!token) {
            return;
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

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        setAnchorEl(null);
        logout();
        navigate('/');
    };

    // AppBar para usuarios NO autenticados
    if (role === null) {
        return (
            <Box sx={{flexGrow: 1}}>
                <AppBar position="fixed" sx={{backgroundColor: '#8B0000'}}>
                    <Toolbar>
                        <img
                            src="https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743519261/readtoowell/iconos/LogoImagen_blanco_r72r75.png"
                            alt="ReadTooWell Logo"
                            style={{height: 45, cursor: 'pointer'}}
                            onClick={() => navigate('/')}
                        />
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            <Button
                                onClick={() => navigate('/catalogo')}
                                sx={{my: 2, color: 'white', textTransform: 'none'}}
                            >
                                Nuestro catálogo
                            </Button>
                        </Box>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/inicio-sesion')}
                            startIcon={<LoginIcon/>}
                            sx={{textTransform: 'none', mr: 1}}
                        >
                            Iniciar sesión
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/registro')}
                            startIcon={<HowToRegIcon/>}
                            sx={{textTransform: 'none'}}
                        >
                            Registro
                        </Button>
                    </Toolbar>
                </AppBar>
                <Toolbar/>
            </Box>
        );
    }

    // AppBar COMÚN para todos los roles autenticados
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="fixed" sx={{backgroundColor: '#8B0000'}}>
                <Toolbar>
                    <img
                        src="https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743519261/readtoowell/iconos/LogoImagen_blanco_r72r75.png"
                        alt="Logo"
                        style={{height: 45, cursor: 'pointer'}}
                        onClick={() => navigate('/')}
                    />

                    {/* Menú específico por rol */}
                    <Box sx={{flexGrow: 1, display: 'flex', ml: 3}}>
                        <Button
                            onClick={() => navigate('/')}
                            sx={{my: 2, color: 'white', textTransform: 'none'}}
                        >
                            Inicio
                        </Button>
                        <Button
                            onClick={() => navigate('/catalogo')}
                            sx={{my: 2, color: 'white', textTransform: 'none'}}
                        >
                            Catálogo
                        </Button>

                        {/* Opciones para usuarios (roles 0 y 1) */}
                        {(role === 0 || role === 1) && (
                            <>
                                <Button
                                    onClick={() => navigate('/biblioteca')}
                                    sx={{color: 'white', textTransform: 'none'}}
                                >
                                    Mi biblioteca
                                </Button>
                                <Button
                                    onClick={() => navigate('/objetivos-lectura')}
                                    sx={{color: 'white', textTransform: 'none'}}
                                >
                                    Objetivos
                                </Button>
                                <Button
                                    onClick={() => navigate('/recomendaciones')}
                                    sx={{color: 'white', textTransform: 'none'}}
                                >
                                    Recomendaciones
                                </Button>
                                <Button
                                    onClick={() => navigate('/resumen')}
                                    sx={{color: 'white', textTransform: 'none'}}
                                >
                                    Resumen anual
                                </Button>
                            </>
                        )}

                        {/* Opciones para autor (rol 1) */}
                        {role === 1 && (
                            <>
                                <Button
                                    onClick={() => navigate(`/autor`, {
                                        state: {
                                            authorName: name
                                        }
                                    })}
                                    sx={{color: 'white', textTransform: 'none', mr: 2}}
                                    startIcon={<LibrarianIcon/>}
                                >
                                    Mis libros
                                </Button>
                            </>
                        )}

                        {/* Opciones para admin (rol 2) */}
                        {isAdmin && (
                            <>
                                <Button
                                    onClick={() => navigate('/admin/sugerencias')}
                                    sx={{color: 'white', textTransform: 'none'}}
                                    startIcon={<AdminIcon/>}
                                >
                                    Sugerencias
                                </Button>
                                <Button
                                    onClick={() => navigate('/admin/verificaciones')}
                                    sx={{color: 'white', textTransform: 'none'}}
                                    startIcon={<AdminIcon/>}
                                >
                                    Solicitudes de autor
                                </Button>
                                <Button
                                    onClick={() => navigate('/admin/añadir-libro')}
                                    sx={{color: 'white', textTransform: 'none'}}
                                    startIcon={<AdminIcon/>}
                                >
                                    Añadir libro
                                </Button>
                            </>
                        )}
                    </Box>

                    {/* Menú de usuario (común a todos los roles autenticados) */}
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <IconButton onClick={handleMenu} sx={{color: 'white'}}>
                            <Avatar
                                src={profilePic ? profilePic : "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1741801696/readtoowell/profilepics/pfp.jpg"}
                                alt="Foto de perfil"
                                sx={{
                                    width: 32,
                                    height: 32,
                                    border: '2px solid white'
                                }}
                            />
                            <ExpandMoreIcon sx={{fontSize: 16}}/>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {!isAdmin && ([
                                <MenuItem key="perfil" onClick={() => {
                                    navigate(`/perfil/${id}`);
                                    handleClose();
                                }}>
                                    <AccountCircleIcon sx={{mr: 1}}/>
                                    Mi perfil
                                </MenuItem>,
                                <Divider key="divider" sx={{my: 2, mx: 'auto', borderColor: 'divider', width: '80%'}}/>
                            ])}
                            <MenuItem onClick={handleLogout}>
                                <LoginIcon sx={{
                                    mr: 1,
                                    transform: 'rotate(180deg)',
                                    color: '#432818'
                                }}/>
                                <Typography color="error">
                                    Cerrar sesión
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </Box>
    );
}