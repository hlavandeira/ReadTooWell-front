import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    CssBaseline,
    Paper
} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Link} from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';

const theme = createTheme({
    palette: {
        primary: {
            main: '#432818',
        },
        secondary: {
            main: '#99582A',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: '"Domine", serif',
        h4: {
            fontWeight: 600,
            color: '#432818',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#bdbdbd',
                        },
                        '&:hover fieldset': {
                            borderColor: '#432818',
                        },
                    },
                },
            },
        },
    },
});

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        email: '',
        password: '',
        username: ''
    });
    const [generalError, setGeneralError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/auth/register", {
                username,
                email,
                password,
                confirmPassword
            });

            const token = response.data.token;
            localStorage.setItem("token", token);

            localStorage.setItem("role", response.data.user.role);

            navigate("/catalogo");
        } catch (err) {
            if (err.response && err.response.data) {
                if (err.response.status === 400) {
                    // Limpiamos errores anteriores
                    setFieldErrors({
                        email: '',
                        password: '',
                        username: ''
                    });
                    setGeneralError('');

                    // Si es un objeto con errores de campo
                    if (typeof err.response.data === 'object' &&
                        (err.response.data.email || err.response.data.password || err.response.data.username)) {
                        setFieldErrors({
                            email: err.response.data.email || '',
                            password: err.response.data.password || '',
                            username: err.response.data.username || ''
                        });
                    }
                    // Si es un error general (como contraseñas no coinciden)
                    else if (err.response.data.error) {
                        setGeneralError(err.response.data.error);
                    }
                    // Si el backend devuelve el mensaje directamente como string
                    else if (typeof err.response.data === 'string') {
                        setGeneralError(err.response.data);
                    }
                } else {
                    setGeneralError("Error en el servidor");
                }
            } else {
                setGeneralError("Error de conexión con el servidor");
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    backgroundImage: 'url(https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743798070/readtoowell/other/background_lrqby8.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    pt: 2,
                }}
            >
                <Paper elevation={6} sx={{mt: 8}}>
                    <Card sx={{
                        width: 400,
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}>
                        <CardContent>
                            <Typography
                                variant="h4"
                                align="center"
                                gutterBottom
                                sx={{mb: 4}}
                            >
                                Únete a ReadTooWell
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Nombre de usuario"
                                    variant="outlined"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    sx={{mb: 3}}
                                    InputProps={{
                                        style: {
                                            borderRadius: 8,
                                            backgroundColor: '#ffffff'
                                        }
                                    }}
                                    error={!!fieldErrors.username}
                                    helperText={fieldErrors.username}
                                />

                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    sx={{mb: 3}}
                                    InputProps={{
                                        style: {
                                            borderRadius: 8,
                                            backgroundColor: '#ffffff'
                                        }
                                    }}
                                    error={!!fieldErrors.email}
                                    helperText={fieldErrors.email}
                                />

                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    variant="outlined"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    sx={{mb: 3}}
                                    InputProps={{
                                        style: {
                                            borderRadius: 8,
                                            backgroundColor: '#ffffff'
                                        }
                                    }}
                                    error={!!fieldErrors.password}
                                    helperText={fieldErrors.password}
                                />

                                <TextField
                                    fullWidth
                                    label="Confirmar contraseña"
                                    variant="outlined"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    sx={{mb: 3}}
                                    InputProps={{
                                        style: {
                                            borderRadius: 8,
                                            backgroundColor: '#ffffff'
                                        }
                                    }}
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        mb: 2,
                                        backgroundColor: '#432818',
                                        '&:hover': {
                                            backgroundColor: '#BB9457',
                                        },
                                    }}
                                >
                                    Crear cuenta
                                </Button>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: 1,
                                    mb: 2
                                }}>
                                    <Typography variant="body2" sx={{mr: 1}}>
                                        ¿Tienes una cuenta?
                                    </Typography>
                                    <Link
                                        to="/inicio-sesion"
                                        style={{
                                            textDecoration: 'underline',
                                            color: theme.palette.primary.main,
                                            fontWeight: 500,
                                            '&:hover': {
                                                color: theme.palette.primary.dark,
                                            }
                                        }}
                                    >
                                        Inicia sesión
                                    </Link>
                                </Box>

                                {generalError && (
                                    <Typography
                                        color="error"
                                        sx={{
                                            mt: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <ErrorIcon fontSize="small" sx={{mr: 1}}/>
                                        {generalError}
                                    </Typography>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

export default Register;