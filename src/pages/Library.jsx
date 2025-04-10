import {useState, useEffect} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {
    Box, Typography, CircularProgress, Paper, Card, CardMedia, CardContent, LinearProgress, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, TextField,
    Grid, Divider
} from '@mui/material';

const Library = () => {
    const navigate = useNavigate();

    const [currentlyReading, setCurrentlyReading] = useState([]);

    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;
    const itemsPerPage = 100;

    const [selectedBook, setSelectedBook] = useState(null);

    const [progressDialogOpen, setProgressDialogOpen] = useState(false);

    const [progressType, setProgressType] = useState('paginas');
    const [progressValue, setProgressValue] = useState(0);

    const bookshelves = [
        {
            label: 'Pendientes',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206368/readtoowell/other/pendientes_gtdds6.jpg",
            path: '/biblioteca/pendientes',
            color: '#E3C9A8',
            readingStatus: 0
        },
        {
            label: 'Leídos',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206369/readtoowell/other/leyendo_yuueyf.jpg",
            path: '/biblioteca/leidos',
            color: '#A8BBA2',
            readingStatus: 2
        },
        {
            label: 'Pausados',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206368/readtoowell/other/pausados_j9dowa.jpg",
            path: '/biblioteca/pausados',
            color: '#FFF8F0',
            readingStatus: 3
        },
        {
            label: 'Abandonados',
            icon: "https://res.cloudinary.com/dfrgrfw4c/image/upload/v1744206369/readtoowell/other/abandonados_yaixwe.jpg",
            path: '/biblioteca/abandonados',
            color: '#7E6651',
            readingStatus: 4
        }
    ];

    useEffect(() => {
        const fetchCurrentlyReading = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/biblioteca', {
                    params: {
                        page: page - 1,
                        size: itemsPerPage,
                        status: 1
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCurrentlyReading(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching currently reading books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentlyReading();
    }, [page]);

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

            setCurrentlyReading(currentlyReading.map(book =>
                book.id.bookId === selectedBook.id.bookId
                    ? {...book, progress: progressValue, progressType}
                    : book
            ));

            setProgressDialogOpen(false);
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

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
                                            sx={{
                                                height: 100,
                                                width: '100%',
                                                objectFit: 'cover',
                                                borderRadius: 1
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
                        value={progressValue}
                        onChange={(e) => setProgressValue(parseInt(e.target.value) || 0)}
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
                                color: 'black',
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


        </Box>
    );
};

export default Library;