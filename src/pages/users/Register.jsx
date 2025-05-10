import {useState} from "react";
import {useNavigate} from "react-router-dom";
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
import ErrorIcon from '@mui/icons-material/Error';
import {useAuth} from "../../context/AuthContext.jsx";

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
    const {updateAuth} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/auth/register", {
                username,
                email,
                password,
                confirmPassword
            });

            updateAuth(response.data.token, response.data.user.role, response.data.user.profileName, response.data.user.profilePic, response.data.user.id);

            navigate("/");
        } catch (err) {
            if (err.response && err.response.data) {
                if (err.response.status === 400) {
                    setFieldErrors({
                        email: '',
                        password: '',
                        username: ''
                    });
                    setGeneralError('');

                    if (typeof err.response.data === 'object' &&
                        (err.response.data.email || err.response.data.password || err.response.data.username)) {
                        setFieldErrors({
                            email: err.response.data.email || '',
                            password: err.response.data.password || '',
                            username: err.response.data.username || ''
                        });
                    } else if (err.response.data.error) {
                        setGeneralError(err.response.data.error);
                    } else if (typeof err.response.data === 'string') {
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
                mt: 4,
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
                                    color: '#432818',
                                    fontWeight: 500,
                                    '&:hover': {
                                        color: '#432818',
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
        </Box>
    );
};

export default Register;