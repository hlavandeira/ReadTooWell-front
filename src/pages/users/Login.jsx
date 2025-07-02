import React from 'react';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from '../../context/AuthContext.jsx';
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography
} from '@mui/material';
import {Link} from 'react-router-dom';
import API_URL from '../../apiUrl';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {updateAuth} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            updateAuth(response.data.token, response.data.user.role, response.data.user.profileName, response.data.user.profilePic, response.data.user.id);

            navigate('/');
        } catch (err) {
            let errorMessage = 'Error al conectar con el servidor';

            if (err.response) {
                errorMessage = err.response.data?.error || 'Credenciales incorrectas';
            } else if (err.code === 'ECONNABORTED') {
                errorMessage = 'El servidor tardó demasiado en responder';
            } else if (err.message.includes('Network Error')) {
                errorMessage = 'No se pudo conectar al servidor (revise la URL)';
            }

            setError(errorMessage);
        }
    };

    return (
        <>
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
                <Card sx={{
                    width: 400,
                    p: 3,
                    mt: 8,
                    borderRadius: 5,
                    backgroundColor: 'white',
                }}>
                    <CardContent>
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                mb: 4,
                                fontWeight: 600,
                                color: '#432818',
                                fontFamily: '"Domine", serif'
                            }}
                        >
                            Iniciar sesión
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{mb: 3}}
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
                                Iniciar sesión
                            </Button>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 1,
                                mb: 1
                            }}>
                                <Typography variant="body2" sx={{mr: 1}}>
                                    ¿No tienes cuenta?
                                </Typography>
                                <Link
                                    to="/registro"
                                    style={{
                                        textDecoration: 'underline',
                                        color: '#432818',
                                        fontWeight: 500,
                                        '&:hover': {
                                            color: '#5a3a23',
                                        }
                                    }}
                                >
                                    Regístrate
                                </Link>
                            </Box>

                            {error && (
                                <Typography
                                    color="error"
                                    align="center"
                                    sx={{
                                        mt: 2,
                                        mb: 2,
                                        padding: '8px',
                                        backgroundColor: '#ffeeee',
                                        borderRadius: '4px',
                                        borderLeft: '4px solid #f44336'
                                    }}
                                >
                                    {error}
                                </Typography>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default Login;