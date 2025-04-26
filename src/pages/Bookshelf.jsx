import {
    Box, Typography, CircularProgress, Pagination
} from '@mui/material';
import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from 'axios';
import ShelvedBookCard from '../components/books/ShelvedBookCard.jsx';
import BookFormatsDialog from '../components/dialogs/BookFormatsDialog.jsx';

const Bookshelf = () => {
    const {status} = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [books, setBooks] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [loadingFormats, setLoadingFormats] = useState([]);
    const [currentBookId, setCurrentBookId] = useState(null);

    const statusTitles = {
        0: 'Libros pendientes',
        2: 'Libros leídos',
        3: 'Libros pausados',
        4: 'Libros abandonados'
    };
    const readingStatus = parseInt(status) || 0;

    const handleDeleteBook = async (bookId) => {
        try {
            const token = localStorage.getItem('token');

            await axios.delete(`http://localhost:8080/biblioteca/${bookId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBooks(prevBooks => prevBooks.filter(book => book.book.id !== bookId));
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
        }
    };

    const handleOpenFormatDialog = (bookId) => {
        setCurrentBookId(bookId);
        setModalOpen(true);

        fetchBookFormats(bookId);
    };

    const fetchBookFormats = async (bookId) => {
        try {
            const token = localStorage.getItem('token');
            setLoadingFormats(true);
            const response = await axios.get(`http://localhost:8080/biblioteca/${bookId}/formatos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && Array.isArray(response.data)) {
                setSelectedFormats(response.data.map(format => format.id));
            } else {
                console.error('Formato de respuesta inesperado:', response.data);
                setSelectedFormats([]);
            }
        } catch (error) {
            console.error('Error al cargar formatos:', error);
        } finally {
            setLoadingFormats(false);
        }
    };

    const handleSaveFormats = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('token');
                setLoading(true);

                const response = await axios.get('http://localhost:8080/biblioteca', {
                    params: {
                        status: readingStatus,
                        page: page - 1,
                        size: itemsPerPage
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setBooks(response.data.content || []);
                setTotalPages(response.data.totalPages || 1);
            } catch (err) {
                setError('Error al cargar los libros');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [readingStatus, page]);

    useEffect(() => {
        if (!modalOpen) {
            setSelectedFormats([]);
            setCurrentBookId(null);
        }
    }, [modalOpen]);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        <Box sx={{
            maxWidth: 800,
            mx: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
        }}>
            <Typography variant="h4" sx={{
                fontWeight: 'bold',
                color: '#432818',
                mb: 2,
                textAlign: 'center'
            }}>
                {statusTitles[readingStatus] || 'Mi estantería'}
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center">
                    <CircularProgress/>
                </Box>
            ) : books.length === 0 ? (
                <Typography variant="body1" textAlign="center" sx={{mt: 2}}>
                    Aún no tienes libros en esta categoría
                </Typography>
            ) : (
                <>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        width: '100%'
                    }}>
                        {books.map(item => (
                            <ShelvedBookCard
                                key={item.book.id}
                                book={item.book}
                                onDelete={() => handleDeleteBook(item.book.id)}
                                onFormatClick={handleOpenFormatDialog}
                            />
                        ))}
                    </Box>

                    <BookFormatsDialog
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        bookId={currentBookId}
                        selectedFormats={selectedFormats}
                        setSelectedFormats={setSelectedFormats}
                        onSave={handleSaveFormats}
                    />

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                                sx={{'& .MuiPaginationItem-root': {fontSize: '1rem'}}}
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default Bookshelf;