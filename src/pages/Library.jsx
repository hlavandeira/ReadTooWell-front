import React from 'react';
import {useState, useEffect} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/AuthContext.jsx';
import {
    Box, Typography, CircularProgress, Paper, Card, CardMedia, CardContent, LinearProgress, Button,
    Grid, Divider, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewListDialog from '../components/dialogs/NewListDialog.jsx';
import UpdateProgressDialog from '../components/dialogs/UpdateProgressDialog.jsx';
import API_URL from '../apiUrl';

const Library = () => {
    const {token} = useAuth();
    const navigate = useNavigate();

    const [isInitialLoading, setIsInitialLoading] = useState(false);

    const [currentlyReading, setCurrentlyReading] = useState([]);

    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;
    const itemsPerPage = 100;

    const [selectedBook, setSelectedBook] = useState(null);
    const [progressDialogOpen, setProgressDialogOpen] = useState(false);

    const [progressType, setProgressType] = useState('paginas');
    const [progressValue, setProgressValue] = useState(0);

    const [lists, setLists] = useState([]);
    const [newListDialogOpen, setNewListDialogOpen] = useState(false);
    const [genres, setGenres] = useState([]);

    const handleListCreated = (newList) => {
        setLists(prev => [...prev, newList]);
    };

    const bookshelves = [
        {
            label: 'Pendientes',
            alt: 'Botón de libros pendientes',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206368/readtoowell/other/pendientes_gtdds6.jpg",
            path: '/biblioteca/pendientes',
            color: '#E3C9A8',
            readingStatus: 0,
            fontColor: 'black'
        },
        {
            label: 'Leídos',
            alt: 'Botón de libros leídos',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206369/readtoowell/other/leyendo_yuueyf.jpg",
            path: '/biblioteca/leidos',
            color: '#A8BBA2',
            readingStatus: 2,
            fontColor: 'black'
        },
        {
            label: 'Pausados',
            alt: 'Botón de libros pausados',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206368/readtoowell/other/pausados_j9dowa.jpg",
            path: '/biblioteca/pausados',
            color: '#FFF8F0',
            readingStatus: 3,
            fontColor: 'black'
        },
        {
            label: 'Abandonados',
            alt: 'Botón de libros abandonados',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206369/readtoowell/other/abandonados_yaixwe.jpg",
            path: '/biblioteca/abandonados',
            color: '#7E6651',
            readingStatus: 4,
            fontColor: 'white'
        }
    ];

    const handleUpdateProgress = (book) => {
        setSelectedBook(book);
        setProgressType(book.progressType);
        setProgressValue(book.progress);
        setProgressDialogOpen(true);
    };

    const handleProgressUpdated = (updatedBook) => {
        const isFinished = updatedBook.progressType === 'paginas'
            ? updatedBook.progress >= updatedBook.book.pageNumber
            : updatedBook.progress >= 100;

        if (isFinished) {
            setCurrentlyReading(prev =>
                prev.filter(book => book.id.bookId !== updatedBook.id.bookId)
            );
        } else {
            setCurrentlyReading(prev =>
                prev.map(book =>
                    book.id.bookId === updatedBook.id.bookId
                        ? updatedBook
                        : book
                )
            );
        }
    };

    if (isInitialLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{color: '#8B0000'}}/>
            </Box>
        );
    }

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [readingRes, listsRes, genresRes] = await Promise.all([
                    axios.get(`${API_URL}/biblioteca`, {
                        params: {page: page - 1, size: itemsPerPage, status: 1},
                        headers: {Authorization: `Bearer ${token}`}
                    }),
                    axios.get(`${API_URL}/listas`, {
                        params: {page: 0, size: 10},
                        headers: {Authorization: `Bearer ${token}`}
                    }),
                    axios.get(`${API_URL}/libros/generos`, {
                        headers: {Authorization: `Bearer ${token}`}
                    })
                ]);

                setCurrentlyReading(readingRes.data.content);
                setTotalPages(readingRes.data.totalPages);
                setLists(listsRes.data.content);
                setGenres(genresRes.data);

            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchInitialData();
    }, [page]);

    return (
        <Box sx={{p: 4, maxWidth: 1400, mx: 'auto'}}>
            {/* Título principal */}
            <Typography variant="h3" component="h1" sx={{
                textAlign: 'center',
                mb: 1,
                fontWeight: 'bold',
                color: '#432818'
            }}>
                Mi biblioteca
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{mb: 4}}>
                ¡Consulta nuestro catálogo o utiliza el buscador para encontrar libros y añadirlos a tu biblioteca!
            </Typography>

            {/* Panel de lecturas actuales */}
            <Paper elevation={3} sx={{
                mb: 6,
                p: 3,
                border: '2px solid #e0d6cc',
                borderRadius: 2,
                backgroundColor: '#f8f4f0'
            }}>
                <Typography variant="h5" component="h2" sx={{
                    mb: 1,
                    fontWeight: 'medium',
                    color: '#432818',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    Lecturas actuales
                </Typography>

                {currentlyReading.length > 0 ? (
                    <Box sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: 3,
                        py: 2,
                        px: 1,
                        '&::-webkit-scrollbar': {
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#8B0000',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: '#f5f5f5',
                        }
                    }}>
                        {currentlyReading.map((item) => (
                            <Card key={item.id.bookId} sx={{
                                minWidth: 320,
                                maxWidth: 320,
                                borderRadius: 2,
                                boxShadow: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                p: 1.5
                            }}>
                                <Grid container spacing={2}>
                                    {/* Portada */}
                                    <Grid>
                                        <CardMedia
                                            component="img"
                                            image={item.book.cover}
                                            alt={`Portada de ${item.book.title}`}
                                            onClick={() => navigate(`/detalles/${item.id.bookId}`)}
                                            sx={{
                                                height: 100,
                                                width: '100%',
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    opacity: 0.9
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            width: 200,
                                            position: 'relative'
                                        }}>
                                            {/* Título y autor */}
                                            <Box>
                                                <Typography variant="subtitle1" component="h3" noWrap>
                                                    {item.book.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.book.author}
                                                </Typography>
                                            </Box>

                                            {/* Progreso */}
                                            <Box sx={{mt: 2, mb: 1}}>
                                                <Typography variant="caption" display="block" gutterBottom>
                                                    {item.progress}{item.progressType === 'paginas' ? `/${item.book.pageNumber} páginas · 
                                                    ${Math.round(item.progress / item.book.pageNumber * 100)}%` : '% completado'}
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    role="progressbar"
                                                    id={`Progreso de ${item.book.title}`}
                                                    aria-label={item.book.title}
                                                    value={
                                                        item.progressType === 'paginas'
                                                            ? (item.progress / item.book.pageNumber) * 100
                                                            : item.progress
                                                    }
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: '#f0f0f0',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#8B0000'
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            {/* Botón de actualizar */}
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleUpdateProgress(item)}
                                                sx={{
                                                    mx: 2,
                                                    mb: 0.5,
                                                    mt: 1,
                                                    backgroundColor: '#432818',
                                                    '&:hover': {
                                                        backgroundColor: '#5a3a23'
                                                    },
                                                    textTransform: 'none'
                                                }}
                                            >
                                                Actualizar progreso
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body1" textAlign="center" sx={{mt: 3}}>
                        No tienes lecturas en curso actualmente
                    </Typography>
                )}
            </Paper>

            {/* Diálogo para actualizar progreso */}
            <UpdateProgressDialog
                open={progressDialogOpen}
                onClose={() => setProgressDialogOpen(false)}
                book={selectedBook}
                onProgressUpdated={handleProgressUpdated}
            />

            <Divider sx={{my: 4, borderColor: 'divider'}}/>

            {/* Botones */}
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'center'
            }}>
                {bookshelves.map((shelf) => (
                    <Box key={shelf.label} sx={{
                        width: {xs: '100%', sm: 'calc(50% - 12px)'},
                        maxWidth: '400px',
                        minWidth: '280px',
                        ml: 5,
                        mr: 5
                    }}>
                        <Button
                            fullWidth
                            onClick={() => navigate(`/biblioteca/${shelf.readingStatus}`)}
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'stretch',
                                borderRadius: '12px',
                                bgcolor: shelf.color,
                                color: shelf.fontColor,
                                fontSize: '1.3rem',
                                minHeight: '100px',
                                textTransform: 'none',
                                overflow: 'hidden',
                                p: 0,
                                boxShadow: 2,
                                '&:hover': {
                                    bgcolor: `${shelf.color}E6`,
                                },
                            }}
                        >
                            {/* Imagen lateral */}
                            <Box
                                component="img"
                                src={shelf.icon}
                                alt={shelf.alt}
                                sx={{
                                    width: '100px',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderTopLeftRadius: '12px',
                                    borderBottomLeftRadius: '12px',
                                }}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    px: 3,
                                    flexGrow: 1,
                                }}
                            >
                                {shelf.label}
                            </Box>
                        </Button>

                    </Box>
                ))}
            </Box>

            <Divider sx={{my: 4, borderColor: 'divider'}}/>

            {/* Listas */}
            <Box sx={{mt: 4, width: '100%'}}>
                {/* Título */}
                <Typography variant="h4" component="h2" sx={{
                    mb: 2,
                    fontWeight: 'medium',
                    color: '#432818',
                    textAlign: 'center'
                }}>
                    Mis listas de libros
                </Typography>

                {/* Botón para añadir lista */}
                <Box sx={{display: 'flex', justifyContent: 'center', mb: 3}}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={() => setNewListDialogOpen(true)}
                        sx={{
                            textTransform: 'none',
                            color: 'white',
                            backgroundColor: '#432818',
                            borderRadius: '20px',
                            px: 3,
                            py: 1,
                            '&:hover': {
                                backgroundColor: '#5a3a23'
                            }
                        }}
                    >
                        Añadir lista
                    </Button>
                </Box>

                {/* Listas */}
                {isInitialLoading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress size={24} sx={{color: '#8B0000'}}/>
                    </Box>
                ) : (
                    <Grid container spacing={3} sx={{mt: 1, justifyContent: 'center'}}>
                        {lists.map((list) => (
                            <Grid key={list.id}>
                                <Card
                                    onClick={() => navigate(`/listas/${list.id}`)}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '12px',
                                        boxShadow: 3,
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6,
                                            cursor: 'pointer'
                                        },
                                        backgroundColor: '#F7EFDD',
                                        maxWidth: 450
                                    }}
                                >
                                    <CardContent sx={{flexGrow: 1}}>
                                        {/* Nombre de la lista */}
                                        <Typography variant="h6" component="h3" sx={{
                                            fontWeight: 'bold',
                                            color: '#432818'
                                        }}>
                                            {list.name}
                                        </Typography>
                                        {/* Número de libros */}
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'block', mb: 1}}>
                                            {list.books?.length || 0} libros
                                        </Typography>

                                        {/* Descripción */}
                                        <Typography variant="body2" sx={{
                                            mb: 2,
                                            minHeight: 'auto',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {list.description || "Sin descripción"}
                                        </Typography>

                                        {/* Géneros */}
                                        <Box sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                            justifyContent: 'center'
                                        }}>
                                            {list.genres?.slice(0, 4).map((genre) => (
                                                <Chip
                                                    key={genre.id}
                                                    label={genre.name}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#7C4B3A',
                                                        color: 'white',
                                                        fontSize: '0.75rem',
                                                        height: '24px'
                                                    }}
                                                />
                                            ))}
                                            {list.genres?.length > 4 && (
                                                <Chip
                                                    label={`+${list.genres.length - 4}`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#f0e6dd',
                                                        color: '#432818',
                                                        fontSize: '0.75rem',
                                                        height: '24px'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Diálogo para crear nueva lista */}
                <NewListDialog
                    open={newListDialogOpen}
                    onClose={() => setNewListDialogOpen(false)}
                    onListCreated={handleListCreated}
                    genres={genres}
                />
            </Box>
        </Box>
    );
};

export default Library;