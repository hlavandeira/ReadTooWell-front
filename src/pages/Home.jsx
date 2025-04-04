import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Home = () => {
    const { role, token, name } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

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
                    backgroundImage: 'url(https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743594361/readtoowell/other/fondo4_farnjf.jpg)',
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
                <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '800px', px: 4 }}>
                    <img
                        src="https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743519261/readtoowell/iconos/LogoImagen_blanco_r72r75.png"
                        alt="ReadToWell Logo"
                        style={{ height: '120px', marginBottom: theme.spacing(4) }}
                    />
                    <Typography variant="h5" component="h2" sx={{ fontStyle: 'italic', mb: 5 }}>
                        Todo sobre tus libros, en un solo lugar
                    </Typography>
                    <Box sx={{ '& > *:not(:last-child)': { mr: 2 } }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/registro')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: '8px',
                                backgroundColor: '#432818',
                                '&:hover': { backgroundColor: '#BB9457' }
                            }}
                        >
                            Comenzar
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/inicio-sesion')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: '8px',
                                borderWidth: '2px',
                                color: 'white',
                                borderColor: '#432818',
                                '&:hover': { borderColor: '#BB9457' }
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
            p: 4,
            backgroundSize: 'cover',
            minHeight: '100vh',
            color: 'white'
        }}>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    fontWeight: 700
                }}
            >
                ¡Hola, {name}!
            </Typography>

            <Button
                variant="contained"
                onClick={() => navigate(role === 0 ? '/mis-libros' : role === 1 ? '/gestion' : '/admin')}
                sx={{
                    backgroundColor: '#8B0000',
                    '&:hover': { backgroundColor: '#A52A2A' }
                }}
            >
                Ir a {role === 0 ? 'mis libros' : role === 1 ? 'gestión' : 'panel admin'}
            </Button>
        </Box>
    );
};

export default Home;