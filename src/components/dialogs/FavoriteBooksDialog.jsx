import React from 'react';
import {useState, useEffect} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Checkbox,
    FormControlLabel,
    Typography,
    CircularProgress,
    Pagination
} from '@mui/material';
import axios from 'axios';
import SmallShelvedBookCard from '../books/SmallShelvedBookCard';
import {useAuth} from '../../context/AuthContext.jsx';
import API_URL from '../../apiUrl';

const FavoriteBooksDialog = ({open, onClose, currentFavoriteBooks}) => {
    const {token} = useAuth();
    const [libraryBooks, setLibraryBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookIds, setSelectedBookIds] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (open && currentFavoriteBooks) {
            const favoriteIds = currentFavoriteBooks.map(favBook => favBook.id);
            setSelectedBookIds(new Set(favoriteIds));
        }
    }, [open, currentFavoriteBooks]);

    useEffect(() => {
        const fetchLibraryBooks = async () => {
            try {
                setLoading(true);

                const response = await axios.get(`${API_URL}/biblioteca/todos`, {
                    params: {page, size: 10},
                    headers: {Authorization: `Bearer ${token}`}
                });

                setLibraryBooks(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching library books:', error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchLibraryBooks();
        }
    }, [open, page]);

    const handleBookToggle = (bookId) => {
        const newSelected = new Set(selectedBookIds);
        if (newSelected.has(bookId)) {
            newSelected.delete(bookId);
        } else {
            if (newSelected.size < 4) {
                newSelected.add(bookId);
            }
        }
        setSelectedBookIds(newSelected);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage - 1);
    };

    const handleSave = async () => {
        try {
            setIsSubmitting(true);

            await axios.put(
                `${API_URL}/usuarios/libros-favoritos`,
                {},
                {
                    params: {bookIds: Array.from(selectedBookIds).join(',')},
                    headers: {Authorization: `Bearer ${token}`}
                }
            );

            onClose(true);
        } catch (error) {
            console.error('Error updating favorite books:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{backgroundColor: '#432818', color: 'white', fontWeight: 'bold'}}>
                Editar libros favoritos
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{my: 2}}>
                    Selecciona hasta 4 libros favoritos
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" sx={{my: 4}}>
                        <CircularProgress sx={{color: '#8B0000'}}/>
                    </Box>
                ) : libraryBooks.length > 0 ? (
                    <>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mb: 2,
                            maxHeight: '400px',
                            overflowY: 'auto',
                            p: 1
                        }}>
                            {libraryBooks.map((book) => (
                                <Box key={book.id.bookId} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    p: 1,
                                    borderRadius: '4px',
                                    backgroundColor: selectedBookIds.has(book.id.bookId) ? '#f5f5f5' : 'transparent'
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedBookIds.has(book.id.bookId)}
                                                onChange={() => handleBookToggle(book.id.bookId)}
                                                disabled={!selectedBookIds.has(book.id.bookId) && selectedBookIds.size >= 4}
                                                color="primary"
                                            />
                                        }
                                        label=""
                                        sx={{mr: 0}}
                                    />
                                    <SmallShelvedBookCard book={book}/>
                                </Box>
                            ))}
                        </Box>

                        {totalPages > 1 && (
                            <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                                <Pagination
                                    count={totalPages}
                                    page={page + 1}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Typography variant="body1" color="text.secondary" textAlign="center" sx={{my: 4}}>
                        No hay libros en tu biblioteca
                    </Typography>
                )}

                <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                    Seleccionados: {selectedBookIds.size}/4
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => onClose(false)}
                    disabled={isSubmitting}
                    sx={{textTransform: 'none', color: '#6c757d'}}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#432818',
                        '&:hover': {backgroundColor: '#5a3a23'}
                    }}
                >
                    {isSubmitting ? <CircularProgress size={24}/> : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FavoriteBooksDialog;