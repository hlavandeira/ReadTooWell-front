import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Typography, Button, CircularProgress, Grid, MenuItem, Select, FormControl, InputLabel, Paper} from '@mui/material';
import axios from 'axios';
import {useAuth} from "../context/AuthContext.jsx";
import SmallBookCardRating from '../components/books/SmallBookCardRating';
import API_URL from '../apiUrl';

const Recommendations = () => {
    const {token} = useAuth();
    const navigate = useNavigate();

    const [booksByFavoriteBooks, setBooksByFavoriteBooks] = useState([]);
    const [booksByFavoriteGenres, setBooksByFavoriteGenres] = useState([]);
    const [booksByReadBooks, setBooksByReadBooks] = useState([]);
    const [generalRecommendations, setGeneralRecommendations] = useState([]);
    const [listRecommendations, setListRecommendations] = useState([]);

    const [userLists, setUserLists] = useState([]);
    const [selectedList, setSelectedList] = useState('');

    const [loading, setLoading] = useState(true);
    const [loadingLists, setLoadingLists] = useState(false);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const [favoritesRes, genresRes, booksByReadBooksRes, generalRecommendationsRes, listsRes] = await Promise.all([
                    axios.get(`${API_URL}/recomendaciones/libros-favoritos`, {
                        headers: {Authorization: `Bearer ${token}`}
                    }),
                    axios.get(`${API_URL}/recomendaciones/generos-favoritos`, {
                        headers: {Authorization: `Bearer ${token}`}
                    }),
                    axios.get(`${API_URL}/recomendaciones/libros-leidos`, {
                        headers: {Authorization: `Bearer ${token}`}
                    }),
                    axios.get(`${API_URL}/recomendaciones/catalogo`, {
                        headers: {Authorization: `Bearer ${token}`}
                    }),
                    axios.get(`${API_URL}/listas/todas-no-vacias`, {
                        headers: {Authorization: `Bearer ${token}`}
                    })
                ]);

                setBooksByFavoriteBooks(favoritesRes.data);
                setBooksByFavoriteGenres(genresRes.data);
                setBooksByReadBooks(booksByReadBooksRes.data);
                setGeneralRecommendations(generalRecommendationsRes.data);
                setUserLists(listsRes.data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [token]);

    const handleSeeMore = (type, title) => {
        navigate('/recomendaciones/libros', {
            state: {
                books: type,
                title: title
            }
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleListChange = async (event) => {
        const listId = event.target.value;
        setSelectedList(listId);
        setLoadingLists(true);

        try {
            const response = await axios.get(`${API_URL}/recomendaciones/lista/${listId}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setListRecommendations(response.data);
        } catch (error) {
            console.error('Error fetching list recommendations:', error);
        } finally {
            setLoadingLists(false);
        }
    };

    const handleSeeMoreFromList = () => {
        if (selectedList && listRecommendations.length > 0) {
            const selectedListName = userLists.find(list => list.id === selectedList)?.name || 'tu lista';
            handleSeeMore(listRecommendations, `Recomendaciones basadas en ${selectedListName}`);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{color: '#8B0000'}} aria-label="Cargando"/>
            </Box>
        );
    }

    return (
        <Box sx={{maxWidth: 1200, mx: 'auto', p: 3}}>
            <Typography variant="h3" component="h1" sx={{mb: 4, fontWeight: 'bold', textAlign: 'center', color: '#432818'}}>
                Recomendaciones para ti
            </Typography>

            {/* Recomendaciones según libros favoritos */}
            <Paper elevation={3} sx={{mb: 6, p: 3, backgroundColor: '#f8f4f0'}}>
                <Typography variant="h5" component="h2" sx={{mb: 3, fontWeight: 'bold', color: '#432818'}}>
                    Según tus libros favoritos...
                </Typography>

                {booksByFavoriteBooks.length > 0 ? (
                    <>
                        <Grid container spacing={3} justifyContent="center">
                            {booksByFavoriteBooks.slice(0, 4).map((book) => (
                                <Grid key={book.book.id}>
                                    <SmallBookCardRating libro={book}/>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                            <Button
                                variant="outlined"
                                onClick={() => handleSeeMore(booksByFavoriteBooks, 'Recomendaciones basadas en tus libros favoritos')}
                                sx={{
                                    textTransform: 'none',
                                    color: '#432818',
                                    borderColor: '#432818',
                                    '&:hover': {
                                        backgroundColor: 'rgba(67, 40, 24, 0.04)',
                                        borderColor: '#5a3a23'
                                    }
                                }}
                            >
                                Ver más recomendaciones
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        ¡Añade libros favoritos en tu perfil para recibir recomendaciones!
                    </Typography>
                )}
            </Paper>

            {/* Recomendaciones según géneros favoritos */}
            <Paper elevation={3} sx={{mb: 6, p: 3, backgroundColor: '#f8f4f0'}}>
                <Typography variant="h5" component="h2" sx={{mb: 3, fontWeight: 'bold', color: '#432818'}}>
                    Según tus géneros favoritos...
                </Typography>

                {booksByFavoriteGenres.length > 0 ? (
                    <>
                        <Grid container spacing={3} justifyContent="center">
                            {booksByFavoriteGenres.slice(0, 4).map((book) => (
                                <Grid key={book.book.id}>
                                    <SmallBookCardRating libro={book}/>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                            <Button
                                variant="outlined"
                                onClick={() => handleSeeMore(booksByFavoriteGenres, 'Recomendaciones basadas en tus géneros favoritos')}
                                sx={{
                                    textTransform: 'none',
                                    color: '#432818',
                                    borderColor: '#432818',
                                    '&:hover': {
                                        backgroundColor: 'rgba(67, 40, 24, 0.04)',
                                        borderColor: '#5a3a23'
                                    }
                                }}
                            >
                                Ver más recomendaciones
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        ¡Añade géneros favoritos en tu perfil para recibir recomendaciones!
                    </Typography>
                )}
            </Paper>

            {/* Recomendaciones según libros leídos */}
            <Paper elevation={3} sx={{mb: 6, p: 3, backgroundColor: '#f8f4f0'}}>
                <Typography variant="h5" component="h2" sx={{mb: 3, fontWeight: 'bold', color: '#432818'}}>
                    Según los libros que has leído...
                </Typography>

                {booksByReadBooks.length > 0 ? (
                    <>
                        <Grid container spacing={3} justifyContent="center">
                            {booksByReadBooks.slice(0, 4).map((book) => (
                                <Grid key={book.book.id}>
                                    <SmallBookCardRating libro={book}/>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                            <Button
                                variant="outlined"
                                onClick={() => handleSeeMore(booksByReadBooks, 'Recomendaciones basadas en tus lecturas')}
                                sx={{
                                    textTransform: 'none',
                                    color: '#432818',
                                    borderColor: '#432818',
                                    '&:hover': {
                                        backgroundColor: 'rgba(67, 40, 24, 0.04)',
                                        borderColor: '#5a3a23'
                                    }
                                }}
                            >
                                Ver más recomendaciones
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        ¡Necesitamos más datos para poder recomendarte más libros!
                    </Typography>
                )}
            </Paper>

            {/* Recomendaciones según listas */}
            <Paper elevation={3} sx={{mb: 6, p: 3, backgroundColor: '#f8f4f0'}}>
                <Typography variant="h5" component="h2" sx={{mb: 1, fontWeight: 'bold', color: '#432818'}}>
                    Según tus listas...
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>
                    Selecciona una de tus listas para recibir recomendaciones.
                </Typography>

                {userLists.length > 0 ? (
                    <>
                        <Box sx={{mb: 3, display: 'flex', alignItems: 'center', gap: 2}}>
                            <FormControl sx={{minWidth: 200}}>
                                <InputLabel id="list-select-label">Selecciona una lista</InputLabel>
                                <Select
                                    labelId="list-select-label"
                                    id="list-select"
                                    value={selectedList}
                                    label="Selecciona una lista"
                                    onChange={handleListChange}
                                    sx={{
                                        '& .MuiSelect-select': {
                                            textOverflow: 'ellipsis'
                                        }
                                    }}
                                >
                                    {userLists.map((list) => (
                                        <MenuItem key={list.id} value={list.id}>
                                            {list.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {loadingLists ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress sx={{color: '#8B0000'}}/>
                            </Box>
                        ) : listRecommendations.length > 0 ? (
                            <>
                                <Grid container spacing={3} justifyContent="center">
                                    {listRecommendations.slice(0, 4).map((book) => (
                                        <Grid key={book.book.id}>
                                            <SmallBookCardRating libro={book}/>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleSeeMoreFromList}
                                        sx={{
                                            textTransform: 'none',
                                            color: '#432818',
                                            borderColor: '#432818',
                                            '&:hover': {
                                                backgroundColor: 'rgba(67, 40, 24, 0.04)',
                                                borderColor: '#5a3a23'
                                            }
                                        }}
                                    >
                                        Ver más recomendaciones
                                    </Button>
                                </Box>
                            </>
                        ) : selectedList && (
                            <Typography variant="body1" color="text.secondary">
                                No hay recomendaciones disponibles para esta lista
                            </Typography>
                        )}
                    </>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        ¡Crea listas con tus libros favoritos para recibir recomendaciones!
                    </Typography>
                )}
            </Paper>

            {/* Recomendaciones generales */}
            <Paper elevation={3} sx={{mb: 6, p: 3, backgroundColor: '#f8f4f0'}}>
                <Typography variant="h5" component="h2" sx={{mb: 3, fontWeight: 'bold', color: '#432818'}}>
                    Lo que más le gusta a la comunidad...
                </Typography>

                {generalRecommendations.length > 0 ? (
                    <>
                        <Grid container spacing={3} justifyContent="center">
                            {generalRecommendations.slice(0, 4).map((book) => (
                                <Grid key={book.book.id}>
                                    <SmallBookCardRating libro={book}/>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                            <Button
                                variant="outlined"
                                onClick={() => handleSeeMore(generalRecommendations, 'Lo que más le gusta a nuestra comunidad')}
                                sx={{
                                    textTransform: 'none',
                                    color: '#432818',
                                    borderColor: '#432818',
                                    '&:hover': {
                                        backgroundColor: 'rgba(67, 40, 24, 0.04)',
                                        borderColor: '#5a3a23'
                                    }
                                }}
                            >
                                Ver más recomendaciones
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        No tenemos recomendaciones para ti en este momento.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Recommendations;