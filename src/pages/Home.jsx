import {Box, Typography, Button, useTheme, TextField, InputAdornment, CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';
import {useState, useEffect} from 'react';
import axios from "axios";

const Home = () => {
    const {token, name} = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState('');

    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            return;
        }

        const verifyAdmin = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/usuarios/verificar-admin', {
                    headers: {Authorization: `Bearer ${token}`}
                });

                setIsAdmin(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error verificando rol:', error);
                setIsAdmin(false);
                setLoading(false);
            }
        };

        verifyAdmin();
    }, [token]);

    const actionsUser = [
        {
            label: 'Mi biblioteca',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743863885/readtoowell/iconos/Biblioteca_sinfondo_blanco_dw69k5.png",
            path: '/biblioteca',
            color: '#432818'
        },
        {
            label: 'Objetivos',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743864520/readtoowell/iconos/v1olxvdjhbpfagohyv7c.png",
            path: '/objetivos-lectura',
            color: '#8B0000'
        },
        {
            label: 'Recomendaciones',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743863885/readtoowell/iconos/Recom_sinfondo_blanco_avcur7.png",
            path: '/recomendaciones',
            color: '#876C40'
        },
        {
            label: 'Conectar',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1745747085/readtoowell/iconos/Social_sinfondo_blanco_piz4io.png",
            path: '/buscar/usuarios',
            color: '#2E5266'
        }
    ];

    const actionsAdmin = [
        {
            label: 'Gestionar libros',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743863885/readtoowell/iconos/Biblioteca_sinfondo_blanco_dw69k5.png",
            path: '/catalogo',
            color: '#432818'
        },
        {
            label: 'Gestionar sugerencias',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743863885/readtoowell/iconos/Recom_sinfondo_blanco_avcur7.png",
            path: '/admin/sugerencias',
            color: '#876C40'
        },
        {
            label: 'Gestionar verificaciones',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1746030780/readtoowell/iconos/Verif_sinfondo_blanco_ulrhkk.png",
            path: '/admin/verificaciones',
            color: '#2E5266'
        }
    ];

    const actionsToShow = isAdmin ? actionsAdmin : actionsUser;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{color: '#8B0000'}}/>
            </Box>
        );
    }

    // Página para usuarios NO autenticados
    if (!token) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: 'url(https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743798070/readtoowell/other/background_lrqby8.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    textAlign: 'center',
                    color: 'white',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
                    },
                }}
            >
                <Box sx={{position: 'relative', zIndex: 2, maxWidth: '800px', px: 4}}>
                    <img
                        src="https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743519261/readtoowell/iconos/LogoImagen_blanco_r72r75.png"
                        alt="ReadTooWell Logo"
                        style={{height: '120px', marginBottom: theme.spacing(4)}}
                    />
                    <Typography variant="h5" component="h2" sx={{fontStyle: 'italic', mb: 5}}>
                        Todo sobre tus libros, en un solo lugar
                    </Typography>
                    <Box sx={{'& > *:not(:last-child)': {mr: 2}}}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/registro')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                backgroundColor: '#432818',
                                '&:hover': {backgroundColor: '#AC8446'}
                            }}
                        >
                            Comenzar
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/inicio-sesion')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                color: 'white',
                                backgroundColor: '#432818',
                                '&:hover': {backgroundColor: '#AC8446'}
                            }}
                        >
                            Iniciar sesión
                        </Button>
                    </Box>
                </Box>
            </Box>
        );
    }

    // Página para usuarios autenticados
    return (
        <Box sx={{
            p: {xs: 2, sm: 4},
            maxWidth: '1200px',
            mx: 'auto'
        }}>
            <Box sx={{
                mb: 4,
                textAlign: 'center'
            }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: '#432818',
                        fontSize: {xs: '2rem', sm: '2.5rem'}
                    }}
                >
                    {isAdmin ? 'Bienvenido a la página de administrador' : `¡Hola, ${name}!`}
                </Typography>

                {/* Barra de búsqueda */}
                <TextField
                    fullWidth
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && searchInput.trim()) {
                            navigate(`/buscar?searchString=${encodeURIComponent(searchInput.trim())}`);
                        }
                    }}
                    placeholder="Buscar libros, autores, colecciones..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action"/>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        maxWidth: '600px',
                        mx: 'auto',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                            backgroundColor: 'background.paper',
                            boxShadow: 1
                        }
                    }}
                />
            </Box>

            {/* Botones */}
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'center'
            }}>
                {actionsToShow.map((action) => (
                    <Box key={action.label} sx={{
                        width: {xs: '100%', sm: 'calc(50% - 12px)'},
                        maxWidth: '400px',
                        minWidth: '280px'
                    }}>
                        <Button
                            fullWidth
                            onClick={() => navigate(action.path)}
                            sx={{
                                justifyContent: 'flex-start',
                                pl: 2,
                                py: 1.5,
                                borderRadius: '12px',
                                bgcolor: action.color,
                                color: 'white',
                                fontSize: '1.1rem',
                                '&:hover': {bgcolor: `${action.color}E6`},
                                minHeight: '100px',
                                boxShadow: 2,
                                textTransform: 'none'
                            }}
                        >
                            {action.icon && (
                                <Box
                                    component="img"
                                    src={action.icon}
                                    sx={{width: 90, height: 90}}
                                />
                            )}
                            {action.label}
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Home;