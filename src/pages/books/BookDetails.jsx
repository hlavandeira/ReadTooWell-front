import React from 'react';
import {Navigate, useParams} from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {
    Box, Typography, Button, CardMedia, CircularProgress, Rating, Paper, Divider, Grid
} from '@mui/material';
import SmallBookCard from '../../components/books/SmallBookCard.jsx';
import GenreButton from '../../components/GenreButton.jsx';
import EditReviewDialog from '../../components/dialogs/EditReviewDialog.jsx';
import UpdateReadingStatusDialog from '../../components/dialogs/UpdateReadingStatusDialog.jsx';
import AddToListDialog from '../../components/dialogs/AddToListDialog.jsx';

const BookDetails = () => {
    const {token} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(0);

    const [userReview, setUserReview] = useState('');
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewText, setReviewText] = useState(userReview || '');

    const [collectionBooks, setCollectionBooks] = useState([]);

    const [lists, setLists] = useState([]);
    const [addToListDialogOpen, setAddToListDialogOpen] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleSaveToLibrary = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/biblioteca/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDetails(prev => ({
                ...prev,
                saved: true,
                readingStatus: response.data.readingStatus,
                dateStart: response.data.dateStart,
                dateFinish: response.data.dateFinish
            }));
        } catch (error) {
            console.error("Error al guardar el libro: ", error);
        }
    };

    const handleSaveStatus = async (newStatus, bookId) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/biblioteca/${bookId}/estado?estado=${newStatus}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDetails(prev => ({
                ...prev,
                readingStatus: newStatus,
                dateStart: response.data.dateStart,
                dateFinish: response.data.dateFinish
            }));

            return response.data;
        } catch (error) {
            console.error("Error al actualizar el estado de lectura:", error);
            throw error;
        }
    };

    const handleSaveReview = async (reviewText) => {
        try {
            await axios.put(
                `http://localhost:8080/biblioteca/${id}/escribir-reseña`,
                null,
                {
                    params: {review: reviewText},
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            setUserReview(reviewText);
            setReviewText(reviewText);
            setDetails((prevDetails) => ({
                ...prevDetails,
                review: reviewText,
            }));
        } catch (error) {
            console.error("Error al guardar la reseña:", error);
        }
    };

    const handleSaveRating = async (newValue) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/biblioteca/${details.book.id}/calificar`,
                null,
                {
                    params: {calificacion: newValue},
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            setDetails(prev => ({
                ...prev,
                saved: true,
                readingStatus: 2,
                rating: response.data.libraryBook.rating,
                averageRating: response.data.averageRating,
                dateStart: response.data.dateStart,
                dateFinish: response.data.dateFinish
            }));
        } catch (error) {
            console.error("Error al guardar la valoración:", error);
        }
    };

    const handleAddToList = async (listId, bookId) => {
        try {
            await axios.post(
                `http://localhost:8080/listas/${listId}/añadir-libro/${bookId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const updatedListsResponse = await axios.get(
                `http://localhost:8080/listas/${bookId}/otras-listas`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setLists(updatedListsResponse.data.content);
        } catch (error) {
            console.error('Error adding book to list:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/libros/${id}/detalles`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUserReview(response.data.review === null ? '' : response.data.review);
                setDetails(response.data);
                setSelectedStatus(response.data.readingStatus);

                if (response.data.book.collectionId) {
                    const collectionResponse = await axios.get(
                        `http://localhost:8080/libros/coleccion/${response.data.book.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    setCollectionBooks(collectionResponse.data);
                }
            } catch (error) {
                return <Navigate to="/inicio-sesion" replace/>;
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id, navigate]);

    useEffect(() => {
        const fetchUserLists = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/listas/${id}/otras-listas`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLists(response.data.content);
            } catch (error) {
                console.error('Error fetching user lists:', error);
            }
        };

        if (details?.saved) {
            fetchUserLists();
        }
    }, [details?.saved]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

    if (!details) {
        return <Navigate to="/catalogo" replace/>;
    }

    return (
        <Box sx={{
            maxWidth: '1200px',
            mx: 'auto',
            p: 3
        }}>
            <Grid container spacing={6}>
                {/* Columna izquierda */}
                <Grid>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        position: 'sticky',
                        top: 2,
                        width: {xs: '100%', sm: '300px'}
                    }}>
                        {/* Portada del libro */}
                        <Box
                            sx={{
                                width: {xs: '200px', sm: '300px'},
                                height: {xs: '300px', sm: '450px'},
                                mt: {xs: 2, sm: 3.5},
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

                        {/* Valoración */}
                        <Box sx={{
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            width: {xs: '90%', sm: '300px'},
                            maxWidth: '300px'
                        }}>
                            <Rating
                                name="book-rating"
                                value={details.rating || 0}
                                precision={0.5}
                                size="large"
                                sx={{
                                    '& .MuiRating-iconFilled': {color: '#FFD700'},
                                    '& .MuiRating-iconHover': {color: '#FFC107'},
                                    '&:hover': {transform: 'scale(1.05)', transition: 'transform 0.2s'}
                                }}
                                onChange={(event, newValue) => handleSaveRating(newValue)}
                            />
                        </Box>

                        <Divider sx={{
                            width: '80%',
                            height: 1,
                            backgroundColor: 'divider',
                            my: 2
                        }}/>

                        {/* Botón para guardar / cambiar estado */}
                        {details.saved && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    textAlign: 'center',
                                    fontSize: {xs: '0.75rem', sm: '0.875rem'}
                                }}
                            >
                                Tu libro está en estado:
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            onClick={() => {
                                if (details.saved) {
                                    setSelectedStatus(details.readingStatus ?? 0);
                                    setModalOpen(true);
                                } else {
                                    handleSaveToLibrary();
                                }
                            }}
                            sx={{
                                mt: 1,
                                px: {xs: 3, sm: 4},
                                py: 1,
                                width: {xs: '90%', sm: 'auto'},
                                maxWidth: '300px',
                                borderRadius: 2,
                                backgroundColor: details.saved ? '#8B0000' : '#432818',
                                '&:hover': {
                                    backgroundColor: details.saved ? '#A52A2A' : '#BB9457'
                                },
                                textTransform: 'none',
                                fontSize: {xs: '0.875rem', sm: '1rem'}
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
                            ) : 'Guardar libro'}
                        </Button>

                        {/* Diálogo para el cambio de estado de lectura */}
                        <UpdateReadingStatusDialog
                            open={modalOpen}
                            onClose={() => setModalOpen(false)}
                            currentStatus={details.readingStatus}
                            onSave={handleSaveStatus}
                            bookId={id}
                        />
                    </Box>
                </Grid>

                {/* Columna derecha */}
                <Grid>
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
                            mb: 0.5
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
                                mt: 0.5,
                                mb: 0.5,
                                p: 3,
                                backgroundColor: 'background.paper',
                                maxWidth: '800px',
                                mx: 'auto'
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
                            <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', mb: 2}}>
                                Detalles del libro
                            </Typography>

                            {/* Valoración media */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 3,
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

                        <Box justifyContent='center' sx={{display: 'flex', gap: 3}}>
                            {/* Botón para otros libros del autor */}
                            <Button
                                variant="contained"
                                onClick={() => navigate(`/autor`, {
                                    state: {
                                        authorName: details.book.author
                                    }
                                })}
                                sx={{
                                    mt: 1,
                                    px: {xs: 3, sm: 4},
                                    py: 1,
                                    width: {xs: '90%', sm: 'auto'},
                                    maxWidth: '300px',
                                    borderRadius: 2,
                                    backgroundColor: '#2E5266',
                                    '&:hover': {
                                        backgroundColor: '#3A6B8A'
                                    },
                                    textTransform: 'none',
                                    fontSize: {xs: '0.875rem', sm: '1rem'},
                                    justifyContent: 'center'
                                }}
                            >
                                Otros libros del autor
                            </Button>

                            {/* Botón añadir a lista */}
                            {details.saved && (
                                <Button
                                    variant="contained"
                                    onClick={() => setAddToListDialogOpen(true)}
                                    sx={{
                                        mt: 1,
                                        px: {xs: 3, sm: 4},
                                        py: 1,
                                        width: {xs: '90%', sm: 'auto'},
                                        maxWidth: '300px',
                                        borderRadius: 2,
                                        backgroundColor: '#E3D5C8',
                                        color: 'black',
                                        '&:hover': {
                                            backgroundColor: '#D5C7BA'
                                        },
                                        textTransform: 'none',
                                        fontSize: {xs: '0.875rem', sm: '1rem'}
                                    }}
                                >
                                    Añadir a lista
                                </Button>
                            )}
                        </Box>

                        {/* Diálogo para añadir a lista */}
                        <AddToListDialog
                            open={addToListDialogOpen}
                            onClose={() => setAddToListDialogOpen(false)}
                            lists={lists}
                            bookId={id}
                            onAddToList={handleAddToList}
                            onSuccess={() => {
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Sección de reseñas */}
            <Box sx={{width: '100%', mt: 4}}>
                <Divider sx={{my: 4, borderColor: 'divider'}}/>

                {/* Reseña y fechas del usuario */}
                <Box sx={{
                    maxWidth: '800px',
                    mx: 'auto',
                    p: 3,
                    boxShadow: 1,
                    borderRadius: 2,
                    backgroundColor: 'background.paper'
                }}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                        <Typography variant="h5" sx={{fontWeight: 'bold'}}>
                            Tu reseña
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => setReviewDialogOpen(true)}
                            disabled={!details.saved}
                            sx={{
                                backgroundColor: '#432818',
                                '&:hover': {backgroundColor: '#5a3a23'},
                                textTransform: 'none'
                            }}
                        >
                            {!userReview || userReview.trim() === "" ? 'Añadir reseña' : 'Editar reseña'}
                        </Button>
                    </Box>

                    {/* Visualización de la reseña existente */}
                    {!userReview || userReview.trim() === "" ? (
                        <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                            No has escrito ninguna reseña todavía.
                        </Typography>
                    ) : (
                        <Typography variant="body1" sx={{
                            whiteSpace: 'pre-line',
                            lineHeight: 1.6,
                            p: 2,
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                            mb: 3
                        }}>
                            {userReview}
                        </Typography>
                    )}

                    {/* Fechas de lectura */}
                    {(details.dateStart || details.dateFinish) && (
                        <Box sx={{mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider'}}>
                            <Typography variant="subtitle1" sx={{mb: 1}}>
                                Tu última lectura:
                            </Typography>
                            <Box sx={{display: 'flex', gap: 3}}>
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

                    {/* Diálogo para editar reseña */}
                    <EditReviewDialog
                        open={reviewDialogOpen}
                        onClose={() => setReviewDialogOpen(false)}
                        initialReview={userReview}
                        onSave={(review) => {
                            handleSaveReview(review);
                            setUserReview(review);
                        }}
                    />
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
                        <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', mb: 2}}>
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
                                        <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                                            {review.profileName} (@{review.username})
                                        </Typography>

                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
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

                <Divider sx={{my: 4, borderColor: 'divider'}}/>

                {/* Otros libros de la colección */}
                {details.book.collectionId && (
                    <Box sx={{
                        mt: 4,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', mb: 3}}>
                            Otros libros de la colección "{details.collectionName}"
                        </Typography>

                        {loading ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress/>
                            </Box>
                        ) : collectionBooks.length > 0 ? (
                            <Grid container spacing={2} justifyContent="center">
                                {collectionBooks.map(book => (
                                    <Grid key={book.id}>
                                        <SmallBookCard
                                            libro={book}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No se encontraron otros libros en esta colección
                            </Typography>
                        )}
                    </Box>
                )}

            </Box>
        </Box>
    );
};

export default BookDetails;