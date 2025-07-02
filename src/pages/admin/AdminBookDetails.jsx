import {useParams, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {
    Box, Typography, Button, CardMedia, CircularProgress, Paper, Divider, Grid, Rating, Chip
} from '@mui/material';
import GenreButton from '../../components/GenreButton.jsx';
import API_URL from '../../apiUrl';

const AdminBookDetails = () => {
    const {token} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [collectionBooks, setCollectionBooks] = useState([]);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/libros/${id}/detalles`, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                setDetails(response.data);

                if (response.data.book.collectionId) {
                    const collectionResponse = await axios.get(
                        `${API_URL}/libros/coleccion/${response.data.book.id}`, {
                            headers: {Authorization: `Bearer ${token}`}
                        }
                    );
                    setCollectionBooks(collectionResponse.data);
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id, token, navigate]);

    const handleDeleteBook = async () => {
        try {
            await axios.delete(`${API_URL}/libros/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            setDetails(prev => ({
                ...prev,
                book: {
                    ...prev.book,
                    active: false
                }
            }));
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const handleRestoreBook = async () => {
        try {
            await axios.put(`${API_URL}/libros/reactivar/${id}`, {}, {
                headers: {Authorization: `Bearer ${token}`}
            });

            setDetails(prev => ({
                ...prev,
                book: {
                    ...prev.book,
                    active: true
                }
            }));
        } catch (error) {
            console.error('Error restoring book:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{color: '#8B0000'}}/>
            </Box>
        );
    }

    if (!details) {
        return null;
    }

    return (
        <Box sx={{
            maxWidth: '1200px',
            mx: 'auto',
            p: 3
        }}>
            <Grid container spacing={6}>
                <Grid item xs={12} md={4}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        position: 'sticky',
                        top: 2,
                        mt: {xs: 1, sm: 2.5},
                        width: {xs: '100%', sm: '300px'}
                    }}>
                        {/* Portada del libro */}
                        <Box
                            sx={{
                                width: {xs: '200px', sm: '300px'},
                                height: {xs: '300px', sm: '450px'},
                                mb: 0.5,
                                boxShadow: 3,
                                borderRadius: 1,
                                overflow: 'hidden'
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={details.book.cover}
                                alt={`Portada de ${details.book.title}`}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                onError={(e) => {
                                    e.target.src = "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1743761214/readtoowell/covers/error_s7dry1.jpg";
                                }}
                            />
                        </Box>

                        {/* Título y autor */}
                        <Typography variant="h5" component="h1" sx={{
                            mb: 0.5,
                            width: {xs: '90%', sm: '300px'},
                            maxWidth: '300px',
                            textAlign: 'center',
                            wordWrap: 'break-word',
                            whiteSpace: 'normal',
                            fontSize: {xs: '1.25rem', sm: '1.5rem'}
                        }}>
                            {details.book.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{
                            mt: 0,
                            mb: 0.5,
                            width: {xs: '90%', sm: '300px'},
                            maxWidth: '300px',
                            textAlign: 'center',
                            whiteSpace: 'normal',
                            fontSize: {xs: '0.875rem', sm: '1rem'}
                        }}>
                            {details.book.author}
                        </Typography>

                        {/* Colección */}
                        {details.book.collectionId && (
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                                width: {xs: '90%', sm: '300px'},
                                maxWidth: '300px',
                                textAlign: 'center',
                                fontSize: {xs: '0.75rem', sm: '0.875rem'}
                            }}>
                                #{details.book.numCollection} {details.collectionName}
                            </Typography>
                        )}

                        {/* Libro activado/desactivado */}
                        <Chip
                            label={details.book.active ? 'Activado' : 'Desactivado'}
                            sx={{
                                backgroundColor: details.book.active ? '#4caf50' : '#f44336',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                mb: 1
                            }}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>

                        {/* Géneros */}
                        <Box sx={{
                            width: '100%',
                            maxWidth: '800px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 1,
                            mt: 3.5,
                            mb: 0
                        }}>
                            {details.book.genres?.length > 0 ? (
                                details.book.genres.map((genre) => (
                                    <GenreButton key={genre.id} genre={genre}/>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No se especificaron géneros
                                </Typography>
                            )}
                        </Box>

                        {/* Sinopsis */}
                        <Paper
                            elevation={3}
                            sx={{
                                my: 0,
                                p: 3,
                                backgroundColor: 'background.paper',
                                maxWidth: '800px'
                            }}
                        >
                            <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold'}}>
                                Sinopsis
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    textAlign: 'justify',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-line'
                                }}
                            >
                                {details.book.synopsis?.replace(/\\n/g, '\n') || 'Este libro no tiene sinopsis disponible.'}
                            </Typography>
                        </Paper>

                        {/* Otros datos del libro */}
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: 'background.paper'
                            }}
                        >
                            <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', mb: 0.5}}>
                                Detalles del libro
                            </Typography>

                            {/* Valoración media */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 1,
                                p: 1.5,
                                backgroundColor: 'action.hover',
                                borderRadius: 1,
                                flexWrap: 'wrap'
                            }}>
                                <Typography variant="subtitle1" component="span">
                                    Valoración media:
                                </Typography>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <Rating
                                        value={details.averageRating || 0}
                                        precision={0.1}
                                        readOnly
                                        size="medium"
                                        sx={{
                                            '& .MuiRating-iconFilled': {color: '#FFD700'}
                                        }}
                                    />
                                    <Typography variant="h6" component="span">
                                        {details.averageRating ? details.averageRating.toFixed(2) : 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={6}>
                                {/* Editorial */}
                                <Grid>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Editorial
                                    </Typography>
                                    <Typography variant="body2">
                                        {details.book.publisher || 'No especificado'}
                                    </Typography>
                                </Grid>

                                {/* ISBN */}
                                <Grid>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        ISBN
                                    </Typography>
                                    <Typography variant="body2">
                                        {details.book.isbn || '--'}
                                    </Typography>
                                </Grid>

                                {/* Páginas */}
                                <Grid>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Páginas
                                    </Typography>
                                    <Typography variant="body2">
                                        {details.book.pageNumber || '--'}
                                    </Typography>
                                </Grid>

                                {/* Año */}
                                <Grid>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Año
                                    </Typography>
                                    <Typography variant="body2">
                                        {details.book.publicationYear || '--'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{my: 4, borderColor: 'divider'}}/>

            {/* Botones */}
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, mt: 3, justifyContent: 'center'}}>
                <Button
                    variant="contained"
                    onClick={() => navigate(`/admin/${id}/editar`)}
                    sx={{
                        backgroundColor: '#432818',
                        '&:hover': {backgroundColor: '#5a3a23'},
                        py: 1.5,
                        textTransform: 'none',
                        width: '25%'
                    }}
                >
                    Editar libro
                </Button>

                {!details.book.active && (
                    <Button
                        variant="contained"
                        onClick={handleRestoreBook}
                        sx={{
                            backgroundColor: '#008C2F',
                            '&:hover': {backgroundColor: '#28A33D'},
                            py: 1.5,
                            textTransform: 'none',
                            width: '25%'
                        }}
                    >
                        Reactivar libro
                    </Button>
                )}

                {details.book.active && (
                    <Button
                        variant="contained"
                        onClick={handleDeleteBook}
                        sx={{
                            backgroundColor: '#8B0000',
                            '&:hover': {backgroundColor: '#A52A2A'},
                            py: 1.5,
                            textTransform: 'none',
                            width: '25%'
                        }}
                    >
                        Desactivar libro
                    </Button>
                )}

                <Button
                    variant="contained"
                    onClick={() => navigate(`/autor`, {
                        state: {
                            authorName: details.book.author
                        }
                    })}
                    sx={{
                        py: 1.5,
                        backgroundColor: '#2E5266',
                        '&:hover': {backgroundColor: '#3A6B8A'},
                        textTransform: 'none',
                        width: '25%'
                    }}
                >
                    Otros libros del autor
                </Button>
            </Box>
        </Box>
    );
};

export default AdminBookDetails;