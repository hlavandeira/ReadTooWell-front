import { Box, Typography, Button, CardMedia, CircularProgress, Rating, Paper, Chip,
    Grid, Divider, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const [userReview, setUserReview] = useState('');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleSaveReview = () => {
        if (!details.saved) return;
        console.log('Reseña guardada:', userReview); //TODO
    };

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`http://localhost:8080/libros/${id}/detalles`, {
                    headers: {
                        'Authorization': 'Bearer '+token
                    }
                });

                setUserReview(response.data.review);
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
                        top: 2,
                        width: { xs: '100%', sm: '300px' }
                    }}>
                        {/* Portada del libro */}
                        <Box
                            sx={{
                                width: { xs: '200px', sm: '300px' },
                                height: { xs: '300px', sm: '450px' },
                                mt: { xs: 2, sm: 3.5 },
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
                            width: { xs: '90%', sm: '300px' },
                            maxWidth: '300px',
                            textAlign: 'center',
                            wordWrap: 'break-word',
                            whiteSpace: 'normal',
                            fontSize: { xs: '1.25rem', sm: '1.5rem' }
                        }} >
                            {details.book.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{
                            mt: 0,
                            mb: 0.5,
                            width: { xs: '90%', sm: '300px' },
                            maxWidth: '300px',
                            textAlign: 'center',
                            whiteSpace: 'normal',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }} >
                            {details.book.author}
                        </Typography>

                        {/* Colección */}
                        {details.book.collectionId && (
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                                width: { xs: '90%', sm: '300px' },
                                maxWidth: '300px',
                                textAlign: 'center',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                                #{details.book.numCollection} {details.collectionName}
                            </Typography>
                        )}

                        {/* Valoración */}
                        <Box sx={{
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            width: { xs: '90%', sm: '300px' },
                            maxWidth: '300px'
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
                                px: { xs: 3, sm: 4 },
                                py: 1,
                                width: { xs: '90%', sm: 'auto' },
                                maxWidth: '300px',
                                borderRadius: 2,
                                backgroundColor: details.saved ? '#8B0000' : '#432818',
                                '&:hover': {
                                    backgroundColor: details.saved ? '#A52A2A' : '#BB9457'
                                },
                                textTransform: 'none',
                                fontSize: { xs: '0.875rem', sm: '1rem' }
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
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
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
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                Detalles del libro
                            </Typography>

                            {/* Nueva sección de puntuación media */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 3,
                                p: 1.5,
                                backgroundColor: 'action.hover',
                                borderRadius: 1
                            }}>
                                <Typography variant="subtitle1" component="span">
                                    Valoración media:
                                </Typography>
                                <Rating
                                    value={details.averageRating || 0}
                                    precision={0.1}
                                    readOnly
                                    size="medium"
                                    sx={{
                                        '& .MuiRating-iconFilled': {
                                            color: '#FFD700',
                                        }
                                    }}
                                />
                                <Typography variant="h6" component="span">
                                    {details.averageRating?.toFixed(2) || 'N/A'}
                                </Typography>
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

            {/* Sección de reseñas */}
            <Box sx={{ width: '100%', mt: 4 }}>
                <Divider sx={{ my: 4, borderColor: 'divider' }} />

                {/* Reseña y fechas del usuario */}
                <Box sx={{
                    maxWidth: '800px',
                    mx: 'auto',
                    p: 3,
                    boxShadow: 1,
                    borderRadius: 2,
                    backgroundColor: 'background.paper'
                }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Tu reseña
                    </Typography>

                    {/* Editor de reseña */}
                    <TextField
                        fullWidth
                        multiline
                        disabled={!details.saved}
                        rows={4}
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        placeholder="Escribe tu reseña sobre este libro..."
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />

                    {/* Botón para guardar */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={handleSaveReview}
                            disabled={!details.saved}
                            sx={{
                                backgroundColor: '#432818',
                                '&:hover': { backgroundColor: '#5a3a23'},
                                textTransform: 'none'
                            }}
                        >
                            Guardar reseña
                        </Button>
                    </Box>

                    {/* Fechas de lectura */}
                    {(details.dateStart || details.DateFinish) && (
                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Tu última lectura:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                {details.dateStart && (
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Fecha de inicio
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(details.dateStart)}
                                        </Typography>
                                    </Box>
                                )}
                                {details.dateFinish && (
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Fecha de fin
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(details.dateFinish)}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>

                {details.otherUsersReviews?.length > 0 && (
                    <Box sx={{
                        mt: 4,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        pt: 3,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Reseñas de la comunidad
                        </Typography>

                        <Box sx={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            pr: 1,
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'text.secondary',
                                borderRadius: '3px',
                            }
                        }}>
                            {details.otherUsersReviews.map((review, index) => (
                                <Box
                                    key={`${review.username}-${index}`}
                                    sx={{
                                        mb: 3,
                                        pb: 2,
                                        borderBottom: index !== details.otherUsersReviews.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider'
                                    }}
                                >
                                    {/* Cabecera con usuario y rating */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1
                                    }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {review.profileName} (@{review.username})
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Rating
                                                value={review.rating}
                                                size="small"
                                                readOnly
                                                precision={0.5}
                                                sx={{
                                                    mr: 1,
                                                    '& .MuiRating-iconFilled': {
                                                        color: '#FFD700',
                                                    }
                                                }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {review.rating.toFixed(1)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Texto de la reseña */}
                                    <Typography variant="body2" sx={{
                                        whiteSpace: 'pre-line',
                                        lineHeight: 1.6
                                    }}>
                                        {review.review}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

            </Box>

        </Box>
    );
};

export default BookDetails;