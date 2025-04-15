import {
    Box, Typography, CircularProgress, Pagination, Dialog, DialogTitle, DialogContent,
    FormGroup, FormControlLabel, Checkbox, DialogActions, Button
} from '@mui/material';
import ShelvedBookCard from '../components/ShelvedBookCard';
import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from 'axios';

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

            const response = await axios.delete(`http://localhost:8080/biblioteca/${bookId}`, {
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
            setSelectedFormats(response.data.map(format => format.id));
        } catch (error) {
            console.error('Error al cargar formatos:', error);
        } finally {
            setLoadingFormats(false);
        }
    };

    const addFormatToBook = async (idFormat) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:8080/biblioteca/${currentBookId}/formatos/${idFormat}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSelectedFormats(response.data.map(format => format.id));
        } catch (error) {
            console.error('Error al añadir formato:', error);
        }
    };

    const removeFormatFromBook = async (idFormat) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `http://localhost:8080/biblioteca/${currentBookId}/formatos/${idFormat}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSelectedFormats(response.data.map(format => format.id));
        } catch (error) {
            console.error('Error al eliminar formato:', error);
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

                    {/* Diálogo para manejar los formatos de libros */}
                    <Dialog
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                minWidth: '350px',
                                background: '#f5f5f5'
                            }
                        }}
                    >
                        <DialogTitle
                            sx={{
                                backgroundColor: '#432818',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '16px 24px'
                            }}
                        >
                            Seleccionar formatos
                        </DialogTitle>

                        <DialogContent sx={{padding: '40px 24px 16px', pt: 10}}>
                            <FormGroup>
                                {[
                                    {value: 0, label: 'Tapa blanda', idFormat: 1},
                                    {value: 1, label: 'Tapa dura', idFormat: 2},
                                    {value: 2, label: 'Ebook', idFormat: 3},
                                    {value: 3, label: 'Audiolibro', idFormat: 4}
                                ].map((item) => (
                                    <FormControlLabel
                                        key={item.value}
                                        control={
                                            <Checkbox
                                                checked={selectedFormats.includes(item.idFormat)}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    if (isChecked) {
                                                        addFormatToBook(item.idFormat);
                                                    } else {
                                                        removeFormatFromBook(item.idFormat);
                                                    }
                                                }}
                                                sx={{
                                                    color: '#432818',
                                                    '&.Mui-checked': {color: '#432818'}
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    color: selectedFormats.includes(item.idFormat) ? '#432818' : 'inherit'
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        }
                                        sx={{
                                            margin: 0,
                                            padding: '8px 12px',
                                            pb: '3px',
                                            borderRadius: '8px',
                                            backgroundColor: selectedFormats.includes(item.idFormat) ? '#43281810' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: '#43281815'
                                            }
                                        }}
                                    />
                                ))}
                            </FormGroup>
                        </DialogContent>

                        <DialogActions sx={{padding: '16px 24px', pt: '2px'}}>
                            <Button
                                onClick={() => setModalOpen(false)}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: '500',
                                    color: '#6c757d',
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0'
                                    }
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSaveFormats}
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: '500',
                                    backgroundColor: '#432818',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    '&:hover': {
                                        backgroundColor: '#5a3a23'
                                    }
                                }}
                            >
                                Guardar
                            </Button>
                        </DialogActions>
                    </Dialog>

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
