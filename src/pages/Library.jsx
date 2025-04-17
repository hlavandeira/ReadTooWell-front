import {useState, useEffect} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {
    Box, Typography, CircularProgress, Paper, Card, CardMedia, CardContent, LinearProgress, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, TextField,
    Grid, Divider, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const Library = () => {
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
    const [newListName, setNewListName] = useState('');

    const [newListDescription, setNewListDescription] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenreIds, setSelectedGenreIds] = useState(new Set());

    const bookshelves = [
        {
            label: 'Pendientes',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206368/readtoowell/other/pendientes_gtdds6.jpg",
            path: '/biblioteca/pendientes',
            color: '#E3C9A8',
            readingStatus: 0,
            fontColor: 'black'
        },
        {
            label: 'Leídos',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206369/readtoowell/other/leyendo_yuueyf.jpg",
            path: '/biblioteca/leidos',
            color: '#A8BBA2',
            readingStatus: 2,
            fontColor: 'black'
        },
        {
            label: 'Pausados',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206368/readtoowell/other/pausados_j9dowa.jpg",
            path: '/biblioteca/pausados',
            color: '#FFF8F0',
            readingStatus: 3,
            fontColor: 'black'
        },
        {
            label: 'Abandonados',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206369/readtoowell/other/abandonados_yaixwe.jpg",
            path: '/biblioteca/abandonados',
            color: '#7E6651',
            readingStatus: 4,
            fontColor: 'white'
        }
    ];

    const handlePageChange = (event, newPage) => {
        setSearchParams({page: newPage});
    };

    const handleUpdateProgress = (book) => {
        setSelectedBook(book);
        setProgressType(book.progressType);
        setProgressValue(book.progress);
        setProgressDialogOpen(true);
    };

    const handleSaveProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/biblioteca/${selectedBook.id.bookId}/progreso`, null, {
                params: {
                    tipoProgreso: progressType,
                    progreso: progressValue
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const isFinished = progressType === 'paginas'
                ? progressValue >= selectedBook.book.pageNumber
                : progressValue >= 100;

            if (isFinished) {
                setCurrentlyReading(currentlyReading.filter(
                    book => book.id.bookId !== selectedBook.id.bookId
                ));
            } else {
                setCurrentlyReading(currentlyReading.map(book =>
                    book.id.bookId === selectedBook.id.bookId
                        ? {...book, progress: progressValue, progressType}
                        : book
                ));
            }

            setProgressDialogOpen(false);
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleGenreToggle = (genreId) => {
        setSelectedGenreIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(genreId)) {
                newSet.delete(genreId);
            } else {
                newSet.add(genreId);
            }
            return newSet;
        });
    };

    const handleCreateList = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/listas',
                {
                    name: newListName,
                    description: newListDescription
                },
                {
                    params: {
                        genreIds: Array.from(selectedGenreIds).join(',')
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const listsResponse = await axios.get('http://localhost:8080/listas', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLists(listsResponse.data.content);

            setNewListDialogOpen(false);
            setNewListName('');
            setNewListDescription('');
            setSelectedGenreIds(new Set());
        } catch (error) {
            console.error('Error creating list:', error);
        }
    };

    if (isInitialLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('token');

                const [readingRes, listsRes, genresRes] = await Promise.all([
                    axios.get('http://localhost:8080/biblioteca', {
                        params: {page: page - 1, size: itemsPerPage, status: 1},
                        headers: {Authorization: `Bearer ${token}`}
                    }),
                    axios.get('http://localhost:8080/listas', {
                        params: {page: 0, size: 10},
                        headers: {Authorization: `Bearer ${token}`}
                    }),
                    axios.get('http://localhost:8080/libros/generos', {
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
                mb: 4,
                fontWeight: 'bold',
                color: '#432818'
            }}>
                Mi biblioteca
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
                                            alt={item.book.title}
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
                                                <Typography variant="subtitle1" noWrap>
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
            <Dialog open={progressDialogOpen} onClose={() => setProgressDialogOpen(false)}>
                <DialogTitle sx={{backgroundColor: '#432818', color: 'white'}}>
                    Actualizar progreso
                </DialogTitle>
                <DialogContent sx={{p: 3}}>
                    <Typography variant="h6" gutterBottom>
                        {selectedBook?.book.title}
                    </Typography>

                    <RadioGroup
                        value={progressType}
                        onChange={(e) => setProgressType(e.target.value)}
                        sx={{mb: 3}}
                    >
                        <FormControlLabel
                            value="paginas"
                            control={<Radio/>}
                            label="Páginas leídas"
                        />
                        <FormControlLabel
                            value="porcentaje"
                            control={<Radio/>}
                            label="Porcentaje completado"
                        />
                    </RadioGroup>

                    <TextField
                        fullWidth
                        type="number"
                        label={progressType === 'paginas' ? 'Páginas leídas' : 'Porcentaje completado'}
                        value={progressValue === 0 ? '' : progressValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            setProgressValue(value === '' ? 0 : parseInt(value) || 0);
                        }}
                        inputProps={{
                            min: 0,
                            max: progressType === 'paginas' ? selectedBook?.book.pageNumber : 100
                        }}
                    />

                    {progressType === 'paginas' && selectedBook?.book.pageNumber && (
                        <Typography variant="caption" display="block" sx={{mt: 1}}>
                            Total de páginas: {selectedBook.book.pageNumber}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setProgressDialogOpen(false)}
                            sx={{textTransform: 'none'}}
                            color='#432818'>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSaveProgress}
                        variant="contained"
                        sx={{
                            backgroundColor: '#8B0000',
                            '&:hover': {backgroundColor: '#6d0000'},
                            textTransform: 'none'
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

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
                        <CircularProgress size={24}/>
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
                <Dialog
                    open={newListDialogOpen}
                    onClose={() => setNewListDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{
                        backgroundColor: '#432818',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <LibraryBooksIcon/>
                        Nueva lista de libros
                    </DialogTitle>

                    <DialogContent sx={{p: 3}}>
                        <Box component="form" sx={{mt: 1}}>
                            {/* Nombre */}
                            <TextField
                                autoFocus
                                margin="normal"
                                label="Nombre de la lista*"
                                fullWidth
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            {/* Descripción */}
                            <TextField
                                margin="normal"
                                label="Descripción (opcional)"
                                fullWidth
                                multiline
                                rows={3}
                                value={newListDescription}
                                onChange={(e) => {
                                    if (e.target.value.length <= 2000) {
                                        setNewListDescription(e.target.value);
                                    }
                                }}
                                inputProps={{
                                    maxLength: 2000
                                }}
                                helperText={`${newListDescription.length}/2000 caracteres`}
                                sx={{ mb: 3 }}
                            />

                            {/* Selección de géneros */}
                            <Typography variant="subtitle2" sx={{mb: 1, color: '#432818'}}>
                                Selecciona géneros (opcional):
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                mb: 2,
                                maxHeight: '200px',
                                overflowY: 'auto',
                                p: 1
                            }}>
                                {genres.map((genre) => (
                                    <Chip
                                        key={genre.id}
                                        label={genre.name}
                                        clickable
                                        variant={selectedGenreIds.has(genre.id) ? 'filled' : 'outlined'}
                                        color={selectedGenreIds.has(genre.id) ? 'primary' : 'default'}
                                        onClick={() => handleGenreToggle(genre.id)}
                                        sx={{
                                            borderRadius: '4px',
                                            borderColor: selectedGenreIds.has(genre.id) ? '#432818' : '#ddd',
                                            backgroundColor: selectedGenreIds.has(genre.id) ? '#CCC4B7' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: selectedGenreIds.has(genre.id) ? '#E0DCD3' : 'black'
                                            },
                                            color: selectedGenreIds.has(genre.id) ? 'black' : 'inherit'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{p: 2}}>
                        <Button
                            onClick={() => {
                                setNewListDialogOpen(false);
                                setSelectedGenreIds(new Set());
                            }}
                            sx={{
                                textTransform: 'none',
                                color: '#6c757d'
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateList}
                            variant="contained"
                            disabled={!newListName.trim()}
                            sx={{
                                textTransform: 'none',
                                backgroundColor: '#8B0000',
                                '&:hover': {backgroundColor: '#6d0000'},
                                borderRadius: '20px',
                                px: 3
                            }}
                        >
                            Crear lista
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Library;