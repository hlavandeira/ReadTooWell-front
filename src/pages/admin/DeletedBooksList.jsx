import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from "../../context/AuthContext.jsx";
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Pagination,
    Button
} from '@mui/material';
import BookCard from '../../components/books/BookCard.jsx';
import API_URL from '../../apiUrl';

const DeletedBooksList = () => {
    const {token} = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);

    const fetchDeletedBooks = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`${API_URL}/libros/desactivados`, {
                params: {
                    page,
                    size: 10
                },
                headers: {Authorization: `Bearer ${token}`}
            });

            setBooks(response.data.content);
            setTotalPages(response.data.totalPages);
            setError('');
        } catch (error) {
            console.error('Error fetching deleted books:', error);
            setError('Error al cargar los libros desactivados');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeletedBooks();
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    const handleRestoreBook = async (bookId) => {
        try {
            await axios.put(
                `${API_URL}/libros/reactivar/${bookId}`, {}, {
                    headers: {Authorization: `Bearer ${token}`}
                }
            );

            setSuccess(true);
            setError('');
            fetchDeletedBooks();

            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error restoring book:', error);
            setError(error.response?.data?.message || 'Error al reactivar el libro');
            setSuccess(false);
        }
    };

    useEffect(() => {
        if (!token) {
            return;
        }
        const verifyAdmin = async () => {
            try {
                const response = await axios.get(`${API_URL}/usuarios/verificar-admin`, {
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
        <Box sx={{maxWidth: 1200, mx: 'auto', p: 3}}>
            <Typography variant="h4" sx={{
                mb: 3,
                fontWeight: 'bold',
                color: '#432818',
                textAlign: 'center'
            }}>
                Libros desactivados
            </Typography>

            {/* Mensaje de éxito */}
            {success && (
                <Typography
                    align="center"
                    sx={{
                        mb: 2,
                        padding: '8px',
                        backgroundColor: '#e8f5e9',
                        borderRadius: '4px',
                        borderLeft: '4px solid #4caf50',
                        color: '#2e7d32'
                    }}
                >
                    Libro reactivado correctamente
                </Typography>
            )}

            {/* Mensaje de error */}
            {error && (
                <Typography
                    color="error"
                    align="center"
                    sx={{
                        mb: 2,
                        padding: '8px',
                        backgroundColor: '#ffeeee',
                        borderRadius: '4px',
                        borderLeft: '4px solid #f44336'
                    }}
                >
                    {error}
                </Typography>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" sx={{my: 4}}>
                    <CircularProgress sx={{color: '#8B0000'}}/>
                </Box>
            ) : books.length === 0 ? (
                <Typography variant="body1" sx={{textAlign: 'center', my: 4}}>
                    No hay libros desactivados
                </Typography>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {books.map((book) => (
                            <Grid key={book.id}>
                                <BookCard libro={book} isAdmin={isAdmin} showDeleteButton={false}/>
                                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleRestoreBook(book.id)}
                                        sx={{
                                            backgroundColor: '#008C2F',
                                            '&:hover': {backgroundColor: '#28A33D'},
                                            textTransform: 'none'
                                        }}
                                    >
                                        Reactivar libro
                                    </Button>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 1 && (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                            <Pagination
                                count={totalPages}
                                page={page + 1}
                                onChange={handlePageChange}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: '#432818',
                                    },
                                    '& .Mui-selected': {
                                        backgroundColor: '#432818 !important',
                                        color: '#fff !important'
                                    }
                                }}
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default DeletedBooksList;