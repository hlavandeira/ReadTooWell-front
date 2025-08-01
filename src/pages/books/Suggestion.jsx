import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import API_URL from '../../apiUrl';

const Suggestion = () => {
    const {token} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        publicationYear: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
    };

    const handleNumericInput = (e) => {
        const {name, value} = e.target;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            handleInputChange(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post(`${API_URL}/sugerencias/enviar-sugerencia`, formData, {
                headers: {Authorization: `Bearer ${token}`}
            });
            navigate('/catalogo');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar la sugerencia');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{maxWidth: 600, mx: 'auto', p: 3}}>
            <Typography variant="h4" sx={{
                mb: 3,
                fontWeight: 'bold',
                color: '#432818',
                textAlign: 'center'
            }}>
                Sugerir un libro
            </Typography>

            <Paper elevation={3} sx={{p: 3}}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Título del libro"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        sx={{mb: 2}}
                    />
                    <TextField
                        fullWidth
                        label="Autor"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                        sx={{mb: 2}}
                    />
                    <TextField
                        fullWidth
                        label="Año de publicación"
                        name="publicationYear"
                        value={formData.publicationYear}
                        onChange={handleNumericInput}
                        required
                        sx={{mb: 3}}
                    />

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

                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                px: 4,
                                textTransform: 'none',
                                backgroundColor: '#432818',
                                '&:hover': {backgroundColor: '#5a3a23'},
                                borderRadius: 2
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{color: 'white'}}/>
                            ) : (
                                'Enviar sugerencia'
                            )}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Suggestion;