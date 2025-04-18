import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {
    Box, Typography, CircularProgress, Pagination,
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ListedBook from '../components/ListedBook';
import GenreButton from "../components/GenreButton.jsx";

const BookList = () => {
    const {idList} = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

    const [listDetails, setListDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [selectedGenreIds, setSelectedGenreIds] = useState(new Set());
    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(false);

    useEffect(() => {
        const fetchListDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/listas/${idList}`, {
                    params: {
                        page: page - 1,
                        size: itemsPerPage
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setListDetails(response.data);
                setTotalPages(response.data.books.totalPages || 1);
            } catch (error) {
                console.error('Error fetching list details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListDetails();
    }, [idList, page]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setLoadingGenres(true);
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/libros/generos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setGenres(response.data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            } finally {
                setLoadingGenres(false);
            }
        };

        fetchGenres();
    }, []);

    const handleEditClick = () => {
        setEditName(listDetails.name);
        setEditDescription(listDetails.description || '');
        setSelectedGenreIds(new Set(listDetails.genres.map(g => g.id)));
        setEditDialogOpen(true);
    };

    const handleUpdateList = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/listas/${idList}`,
                {
                    name: editName,
                    description: editDescription
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

            const response = await axios.get(`http://localhost:8080/listas/${idList}`, {
                params: {
                    page: page - 1,
                    size: itemsPerPage
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setListDetails(response.data);
            setEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating list:', error);
        }
    };

    const handleDeleteList = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/listas/${idList}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/biblioteca');
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({top: 0, behavior: 'smooth'});
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

    const handleDeleteBook = async (bookId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/listas/${idList}/eliminar-libro/${bookId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(`se eliminó el libro ${bookId} de la lista ${idList}`);

            const response = await axios.get(`http://localhost:8080/listas/${idList}`, {
                params: {
                    page: page - 1,
                    size: itemsPerPage
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setListDetails(response.data);
        } catch (error) {
            console.error('Error deleting book from list:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

    if (!listDetails) {
        return (
            <Typography variant="body1" textAlign="center" sx={{mt: 4}}>
                No se encontró la lista
            </Typography>
        );
    }

    return (
        <Box sx={{
            maxWidth: 800,
            mx: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
        }}>
            {/* Encabezado con detalles de la lista */}
            <Box sx={{
                backgroundColor: '#f8f4f0',
                borderRadius: 2,
                p: 3,
                border: '1px solid #e0d6cc'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h4" sx={{
                        fontWeight: 'bold',
                        color: '#432818'
                    }}>
                        {listDetails.name}
                    </Typography>

                    <Box sx={{display: 'flex', gap: 1}}>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon/>}
                            onClick={handleEditClick}
                            sx={{
                                textTransform: 'none',
                                color: '#432818',
                                borderColor: '#432818'
                            }}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon/>}
                            onClick={handleDeleteList}
                            sx={{
                                textTransform: 'none',
                                color: '#8B0000',
                                borderColor: '#8B0000'
                            }}
                        >
                            Eliminar
                        </Button>
                    </Box>
                </Box>

                {listDetails.description && (
                    <Typography variant="body1" sx={{mb: 2}}>
                        {listDetails.description}
                    </Typography>
                )}

                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                    {listDetails.genres.map((genre) => (
                        <GenreButton key={genre.id} genre={genre} />
                    ))}
                </Box>
            </Box>

            {/* Lista de libros */}
            <Typography variant="h5" sx={{
                fontWeight: 'medium',
                color: '#432818',
                mt: 2
            }}>
                Libros en esta lista ({listDetails.books.totalElements})
            </Typography>

            {listDetails.books.content.length === 0 ? (
                <Typography variant="body1" textAlign="center" sx={{mt: 2}}>
                    No hay libros en esta lista
                </Typography>
            ) : (
                <>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                        {listDetails.books.content.map(item => (
                            <ListedBook
                                key={item.id.bookId}
                                book={item}
                                onDelete={handleDeleteBook}
                            />
                        ))}
                    </Box>

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
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Diálogo para editar lista */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
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
                    Editar lista
                </DialogTitle>

                <DialogContent sx={{p: 3}}>
                    <Box component="form" sx={{mt: 1}}>
                        <TextField
                            autoFocus
                            margin="normal"
                            label="Nombre de la lista*"
                            fullWidth
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            sx={{mb: 2}}
                        />

                        <TextField
                            margin="normal"
                            label="Descripción"
                            fullWidth
                            multiline
                            rows={3}
                            value={editDescription}
                            onChange={(e) => {
                                if (e.target.value.length <= 2000) {
                                    setEditDescription(e.target.value);
                                }
                            }}
                            inputProps={{
                                maxLength: 2000
                            }}
                            helperText={`${editDescription.length}/2000 caracteres`}
                            sx={{mb: 3}}
                        />

                        <Typography variant="subtitle2" sx={{mb: 1, color: '#432818'}}>
                            Géneros:
                        </Typography>

                        {loadingGenres ? (
                            <CircularProgress size={24}/>
                        ) : (
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
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{p: 2}}>
                    <Button
                        onClick={() => setEditDialogOpen(false)}
                        sx={{
                            textTransform: 'none',
                            color: '#6c757d'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleUpdateList}
                        variant="contained"
                        disabled={!editName.trim()}
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#8B0000',
                            '&:hover': {backgroundColor: '#6d0000'},
                            borderRadius: '20px',
                            px: 3
                        }}
                    >
                        Guardar cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BookList;