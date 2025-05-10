import {useEffect, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.jsx";
import {Box, CircularProgress, Grid, InputAdornment, Pagination, TextField, Typography, Button} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import UserCard from '../../components/UserCard.jsx';
import AuthorCard from '../../components/AuthorCard.jsx';

const SearchUsers = () => {
    const {token} = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState(searchParams.get('searchString') || '');
    const [users, setUsers] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);
    const navigate = useNavigate();

    const itemsPerPage = 9;
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const searchUsers = async () => {
        setIsLoading(true);
        try {
            const params = {
                searchString: searchInput,
                page: currentPage - 1,
                size: itemsPerPage
            };

            setSearchParams({
                ...(searchInput && {searchString: searchInput}),
                page: currentPage
            });

            const response = await axios.get('http://localhost:8080/usuarios/buscar', {
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAuthors = async () => {
        setIsLoadingAuthors(true);
        try {
            const response = await axios.get('http://localhost:8080/usuarios/autores', {
                params: {
                    page: 0,
                    size: 4
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAuthors(response.data.content);
        } catch (error) {
            console.error('Error fetching authors:', error);
        } finally {
            setIsLoadingAuthors(false);
        }
    };

    useEffect(() => {
        if (searchParams.toString()) {
            searchUsers();
        }
        fetchAuthors();
    }, [searchParams]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams({
            ...(searchInput && {searchString: searchInput}),
            page: 1
        });
    };

    const handlePageChange = (event, newPage) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', newPage);
            return newParams;
        });
    };

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
                    placeholder="Buscar usuarios por nombre o email..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action"/>
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        maxWidth: '800px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                            backgroundColor: 'background.paper',
                            boxShadow: 1,
                            paddingRight: '14px'
                        }
                    }}
                />
            </Box>

            {/* Resultados */}
            {isLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', py: 10}}>
                    <CircularProgress size={60} sx={{color: '#8B0000'}}/>
                </Box>
            ) : users.length > 0 ? (
                <>
                    <Grid
                        container
                        spacing={4}
                        sx={{
                            maxWidth: "100%",
                            justifyContent: "center"
                        }}
                    >
                        {users.map((user) => (
                            <Grid item key={user.id}>
                                <UserCard user={user}/>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: '#432818',
                                        '&.Mui-selected': {
                                            backgroundColor: '#8B0000',
                                            color: 'white'
                                        }
                                    }
                                }}
                            />
                        </Box>
                    )}
                </>
            ) : (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '300px',
                    textAlign: 'center'
                }}>
                    <Typography variant="h5" sx={{color: '#432818'}}>
                        {searchInput ? 'No se encontraron usuarios' : 'Ingresa un término de búsqueda'}
                    </Typography>
                </Box>
            )}

            {/* Sección de autores */}
            {authors.length > 0 && (
                <Box sx={{mt: 6}}>
                    <Typography variant="h4" sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        color: '#432818',
                        textAlign: 'center'
                    }}>
                        Autores destacados
                    </Typography>

                    {isLoadingAuthors ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                            <CircularProgress size={40} sx={{color: '#8B0000'}}/>
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={3} justifyContent="center">
                                {authors.map((author) => (
                                    <Grid key={author.id}>
                                        <AuthorCard user={author}/>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/autores')}
                                    sx={{
                                        py: 1,
                                        px: 4,
                                        textTransform: 'none',
                                        backgroundColor: '#432818',
                                        '&:hover': {backgroundColor: '#5a3a23'},
                                        borderRadius: 2
                                    }}
                                >
                                    Ver todos los autores
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default SearchUsers;