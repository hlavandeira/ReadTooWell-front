import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.jsx";
import {
    Box,
    TextField,
    InputAdornment,
    Button,
    Typography,
    Slider,
    CircularProgress,
    Paper,
    Stack, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BookGrid from '../../components/books/BookGrid.jsx';
import GenreButton from '../../components/GenreButton.jsx';
import axios from "axios";

const SearchPage = () => {
    const {token} = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState(searchParams.get('searchString') || '');
    const [filters, setFilters] = useState({
        minYear: parseInt(searchParams.get('minYear')) || 1900,
        maxYear: parseInt(searchParams.get('maxYear')) || new Date().getFullYear(),
        minPages: parseInt(searchParams.get('minPages')) || 0,
        maxPages: parseInt(searchParams.get('maxPages')) || 1600
    });

    const [books, setBooks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    const [genres, setGenres] = useState([]);

    const itemsPerPage = 10;
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const [isAdmin, setIsAdmin] = useState(false);

    const searchBooks = async () => {
        setIsLoading(true);
        try {
            const params = {
                searchString: searchInput,
                minPages: filters.minPages,
                maxPages: filters.maxPages,
                minYear: filters.minYear,
                maxYear: filters.maxYear,
                page: currentPage - 1,
                size: itemsPerPage
            };

            setSearchParams({
                ...(searchInput && {searchString: searchInput}),
                ...(filters.minYear !== 1900 && {minYear: filters.minYear}),
                ...(filters.maxYear !== new Date().getFullYear() && {maxYear: filters.maxYear}),
                ...(filters.minPages !== 0 && {minPages: filters.minPages}),
                ...(filters.maxPages !== 1000 && {maxPages: filters.maxPages}),
                page: currentPage
            });

            const response = await axios.get(`http://localhost:8080/libros/buscar`, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBooks(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error searching books:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchParams.toString()) {
            searchBooks();
        }
    }, [searchParams]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams({
            ...(searchInput && {searchString: searchInput}),
            page: 1
        });
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePageChange = (event, newPage) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', newPage);
            return newParams;
        });
    };

    const resetFilters = () => {
        setFilters({
            minYear: 1900,
            maxYear: new Date().getFullYear(),
            minPages: 0,
            maxPages: 1600
        });
    };

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:8080/libros/generos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setGenres(response.data);
            } catch (err) {
                console.error('Error fetching genres:', err);
                setError('No se pudieron cargar los géneros');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        if (!token) {
            return;
        }
        const verifyAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:8080/usuarios/verificar-admin', {
                    headers: {Authorization: `Bearer ${token}`}
                });

                setIsAdmin(response.data);
            } catch (error) {
                console.error('Error verificando rol:', error);
                setIsAdmin(false);
            }
        };

        verifyAdmin();
    }, [token]);

    return (
        <Box sx={{p: {xs: 2, md: 3}, maxWidth: 1400, mx: 'auto'}}>
            {/* Barra de búsqueda */}
            <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                    mb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <TextField
                    fullWidth
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Buscar libros, autores, colecciones..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action"/>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    startIcon={<FilterAltIcon/>}
                                    sx={{
                                        display: {md: 'none'},
                                        color: '#432818',
                                        borderColor: '#432818',
                                        '&:hover': {
                                            borderColor: '#8B0000',
                                            backgroundColor: 'rgba(139, 0, 0, 0.04)'
                                        }
                                    }}
                                >
                                    {isFilterOpen ? 'Ocultar' : 'Mostrar'} filtros
                                </Button>
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        maxWidth: '800px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                            backgroundColor: 'background.paper',
                            boxShadow: 1,
                            paddingRight: {xs: '140px', md: '14px'}
                        }
                    }}
                />
            </Box>

            {/* Filtros */}
            {isFilterOpen && (
                <Paper elevation={2} sx={{
                    p: 3,
                    mb: 0.5,
                    borderRadius: 3,
                    backgroundColor: '#f8f4f0',
                    border: '1px solid #e0d6cc'
                }}>
                    <Stack direction={{xs: 'column', md: 'row'}} spacing={3} alignItems="center">
                        {/* Filtro por año */}
                        <Box sx={{width: {xs: '100%', md: '220px'}}}>
                            <Typography variant="subtitle1" gutterBottom sx={{color: '#432818', fontWeight: 500}}>
                                Año de publicación
                            </Typography>
                            <Box sx={{display: 'flex', gap: 2, mt: 2}}>
                                <TextField
                                    label="Desde"
                                    type="number"
                                    size="small"
                                    width="large"
                                    value={filters.minYear}
                                    onChange={(e) => handleFilterChange('minYear', parseInt(e.target.value) || 0)}
                                    sx={{width: '60%'}}
                                    inputProps={{min: 0}}
                                />
                                <TextField
                                    label="Hasta"
                                    type="number"
                                    size="small"
                                    width="large"
                                    value={filters.maxYear}
                                    onChange={(e) => handleFilterChange('maxYear', parseInt(e.target.value) || 0)}
                                    sx={{width: '60%'}}
                                    inputProps={{min: filters.minYear}}
                                />
                            </Box>
                        </Box>

                        {/* Filtro por páginas */}
                        <Box sx={{
                            flex: 1,
                            minWidth: 0,
                            px: 1,
                            maxWidth: '100%'
                        }}>
                            <Typography variant="subtitle1" gutterBottom sx={{color: '#432818', fontWeight: 500}}>
                                Número de páginas
                            </Typography>
                            <Box sx={{
                                width: '95%',
                                px: 2
                            }}>
                                <Slider
                                    value={[filters.minPages, filters.maxPages]}
                                    onChange={(_, newValue) => {
                                        handleFilterChange('minPages', newValue[0]);
                                        handleFilterChange('maxPages', newValue[1]);
                                    }}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={1600}
                                    step={100}
                                    marks={[
                                        {value: 0, label: '0'},
                                        {value: 400, label: '400'},
                                        {value: 800, label: '800'},
                                        {value: 1200, label: '1200'},
                                        {value: 1600, label: '1600'}
                                    ]}
                                    sx={{
                                        color: '#8B0000',
                                        height: 4,
                                        width: '100%',
                                        '& .MuiSlider-thumb': {
                                            width: 16,
                                            height: 16,
                                            '&:hover, &.Mui-focusVisible': {
                                                boxShadow: '0px 0px 0px 8px rgba(139, 0, 0, 0.16)'
                                            }
                                        },
                                        '& .MuiSlider-rail': {
                                            height: 4,
                                            opacity: 0.5
                                        },
                                        '& .MuiSlider-track': {
                                            height: 4
                                        }
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Botones de aplicar/limpiar filtros */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: {xs: 'row', md: 'column'},
                            gap: 2,
                            width: {xs: '100%', md: 'auto'},
                            justifyContent: 'flex-end'
                        }}>
                            <Button
                                size="small"
                                onClick={resetFilters}
                                sx={{
                                    textTransform: 'none',
                                    color: '#8B0000',
                                    minWidth: '120px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(139, 0, 0, 0.08)'
                                    }
                                }}
                            >
                                Limpiar
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => searchBooks()}
                                sx={{
                                    borderRadius: '50px',
                                    py: 1,
                                    px: 3,
                                    backgroundColor: '#8B0000',
                                    minWidth: '120px',
                                    '&:hover': {
                                        backgroundColor: '#6d0000'
                                    },
                                    textTransform: 'none'
                                }}
                            >
                                Aplicar
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            )}

            {/* Resultados de búsqueda */}
            {isLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', py: 10}}>
                    <CircularProgress size={60} sx={{color: '#8B0000'}}/>
                </Box>
            ) : books.length > 0 ? (
                <BookGrid
                    libros={books}
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isAdmin={isAdmin}
                    onBookDelete={(deletedBookId) => {
                        setBooks(books.filter(book => book.id !== deletedBookId));
                    }}
                />
            ) : (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '300px',
                    textAlign: 'center'
                }}>
                    <Typography variant="h5" sx={{color: '#432818'}}>
                        No se han encontrado libros
                    </Typography>
                </Box>
            )}

            <Divider sx={{my: 4, borderColor: 'divider'}}/>

            <Box sx={{my: 6}}>
                <Paper elevation={3} sx={{p: 4, borderRadius: 3}}>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            mb: 4,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: '#432818'
                        }}
                    >
                        ¿Quieres buscar algún género en concreto?
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 2,
                        mt: 3
                    }}>
                        {genres.length > 0 ? (
                            genres.map((genre) => (
                                <GenreButton key={genre.id} genre={genre}/>
                            ))
                        ) : (
                            <Typography variant="body1" color="text.secondary">
                                No hay géneros disponibles
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default SearchPage;