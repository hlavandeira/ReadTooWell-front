import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    Divider,
    Paper
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const AuthorRequest = () => {
    const {id, token} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        biography: '',
        books: [{title: '', publicationYear: ''}]
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBookChange = (index, e) => {
        const {name, value} = e.target;
        const updatedBooks = [...formData.books];
        updatedBooks[index][name] = value;
        setFormData(prev => ({
            ...prev,
            books: updatedBooks
        }));
    };

    const addBookField = () => {
        setFormData(prev => ({
            ...prev,
            books: [...prev.books, {title: '', publicationYear: ''}]
        }));
    };

    const removeBookField = (index) => {
        if (formData.books.length > 1) {
            const updatedBooks = formData.books.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                books: updatedBooks
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('http://localhost:8080/solicitud-autor', formData, {
                headers: {Authorization: `Bearer ${token}`}
            });

            navigate(`/perfil/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar la solicitud');
        }
    };

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', p: 3}}>
            <Typography variant="h4" sx={{
                mb: 3,
                fontWeight: 'bold',
                color: '#432818',
                textAlign: 'center'
            }}>
                Solicitud de verificación de autor
            </Typography>

            <Paper elevation={3} sx={{p: 3}}>
                <Typography variant="h6" sx={{mb: 2}}>
                    Tus datos de autor:
                </Typography>

                <form onSubmit={handleSubmit}>

                    {/* Nombre y biografía */}
                    <TextField
                        fullWidth
                        label="Nombre completo"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        sx={{mb: 2}}
                    />
                    <TextField
                        fullWidth
                        label="Biografía"
                        name="biography"
                        value={formData.biography}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        sx={{mb: 2}}
                    />

                    <Divider sx={{my: 2}}/>

                    {/* Libros escritos */}
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                        <Typography variant="h6">
                            Libros que has escrito:
                        </Typography>
                        <Button
                            startIcon={<AddCircleIcon/>}
                            onClick={addBookField}
                            variant="outlined"
                            sx={{
                                color: '#432818',
                                borderColor: '#432818',
                                textTransform: 'none',
                                borderRadius: 8
                            }}
                        >
                            Añadir otro libro
                        </Button>
                    </Box>

                    {formData.books.map((book, index) => (
                        <Box key={index} sx={{
                            mb: 3,
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            position: 'relative'
                        }}>
                            {formData.books.length > 1 && (
                                <IconButton
                                    onClick={() => removeBookField(index)}
                                    sx={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'error.main'
                                    }}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            )}

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                pr: 4
                            }}>
                                <TextField
                                    fullWidth
                                    label="Título del libro"
                                    name="title"
                                    value={book.title}
                                    onChange={(e) => handleBookChange(index, e)}
                                    required
                                    sx={{flex: 2}}
                                />
                                <TextField
                                    fullWidth
                                    label="Año de publicación"
                                    name="publicationYear"
                                    type="number"
                                    inputProps={{min: 1900, max: new Date().getFullYear()}}
                                    value={book.publicationYear}
                                    onChange={(e) => handleBookChange(index, e)}
                                    required
                                    sx={{flex: 1}}
                                />
                            </Box>
                        </Box>
                    ))}

                    {/* Mensaje de error */}
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

                    {/* Botón para enviar */}
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                py: 1.5,
                                textTransform: 'none',
                                backgroundColor: '#432818',
                                '&:hover': {backgroundColor: '#5a3a23'},
                                borderRadius: 2
                            }}
                        >
                            Enviar solicitud
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default AuthorRequest;