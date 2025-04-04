import { Box, Typography, Button, CardMedia, CircularProgress, Rating, Paper, Chip,
    Grid} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No token found');
                }

                if (token.split('.').length !== 3) {
                    throw new Error('Invalid token format');
                }

                const response = await axios.get(`http://localhost:8080/libros/${id}/detalles`, {
                    headers: {
                        'Authorization': 'Bearer '+token
                    }
                });

                setDetails(response.data);
            } catch (error) {
                if (error.response?.status === 401 || error.message.includes('token')
                        || error.response?.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/inicio-sesion');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!details) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        Libro no encontrado
      </Typography>
    );
  }

    return (
        <Box sx={{
            maxWidth: '1200px',
            mx: 'auto',
            p: 3
        }}>
            <Grid container spacing={6}>
                {/* Columna izquierda (contenido existente sin cambios) */}
                <Grid>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        position: 'sticky',
                        top: 2
                    }}>
                        {/* Portada del libro */}
                        <Box
                            sx={{
                                width: 300,
                                height: 450,
                                mt: 3.5,
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
                                    e.target.src = "/placeholder-book-cover.jpg";
                                }}
                            />
                        </Box>

                        {/* Título y autor */}
                        <Typography variant="h5" component="h1" sx={{
                            mb: 0.5,
                        }} >
                            {details.book.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{
                            mt: 0,
                            mb: 0.5,
                        }} >
                            {details.book.author}
                        </Typography>

                        {/* Colección */}
                        {details.book.collectionId && (
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                #{details.book.numCollection} {details.collectionName}
                            </Typography>
                        )}

                        {/* Valoración */}
                        <Box sx={{
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Rating
                                name="book-rating"
                                value={details.rating || 0}
                                precision={0.5}
                                size="large"
                                sx={{
                                    '& .MuiRating-iconFilled': {
                                        color: '#FFD700',
                                    },
                                    '& .MuiRating-iconHover': {
                                        color: '#FFC107',
                                    }
                                }}
                                onChange={(event, newValue) => {
                                    handleSaveRating(newValue);
                                }}
                            />
                        </Box>

                        {/* Botón para guardar / cambiar estado */}
                        <Button
                            variant="contained"
                            sx={{
                                mt: 1,
                                px: 4,
                                py: 1,
                                borderRadius: 2,
                                backgroundColor: details.saved ? '#8B0000' : '#432818',
                                '&:hover': {
                                    backgroundColor: details.saved ? '#A52A2A' : '#BB9457'
                                },
                                textTransform: 'none'
                            }}
                        >
                            {details.saved ? (
                                {
                                    0: 'Pendiente',
                                    1: 'Leyendo',
                                    2: 'Leído',
                                    3: 'Pausado',
                                    4: 'Abandonado'
                                }[details.readingStatus] || 'Guardado'
                            ) : 'Guardar'}
                        </Button>
                    </Box>
                </Grid>

                {/* Columna derecha */}
                <Grid>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {/* Géneros */}
                        <Box sx={{
                            width: '100%',
                            maxWidth: '800px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 1,
                            mt: 3.5,
                            mb: 0.5
                        }}>
                            {details.book.genres?.length > 0 ? (
                                details.book.genres.map((genre) => (
                                    <Chip
                                        key={genre.id}
                                        label={genre.name}
                                        sx={{
                                            borderRadius: '16px',
                                            backgroundColor: '#f0f0f0',
                                            color: 'text.primary',
                                            border: '1px solid #ddd',
                                            '&:hover': {
                                                backgroundColor: '#e0e0e0'
                                            }
                                        }}
                                    />
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
                                mt: 0.5,
                                mb: 0.5,
                                p: 3,
                                backgroundColor: 'background.paper',
                                maxWidth: '800px',
                                mx: 'auto'
                            }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
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

                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BookDetails;