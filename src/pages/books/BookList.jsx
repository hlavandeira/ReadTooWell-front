import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {
    Box, Typography, CircularProgress, Pagination, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListedBook from '../../components/books/ListedBook.jsx';
import GenreButton from "../../components/GenreButton.jsx";
import EditListDialog from '../../components/dialogs/EditListDialog.jsx';

const BookList = () => {
    const {token} = useAuth();
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

    const handleUpdateList = async (updatedData) => {
        try {
            await axios.put(`http://localhost:8080/listas/${idList}`, {
                    name: updatedData.name,
                    description: updatedData.description
                },
                {
                    params: {
                        genreIds: updatedData.genreIds.join(',')
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
        } catch (error) {
            console.error('Error updating list:', error);
            throw error;
        }
    };

    const handleDeleteList = async () => {
        try {
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

    const handleDeleteBook = async (bookId) => {
        try {
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
                <CircularProgress sx={{color: '#8B0000'}}/>
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
                        <GenreButton key={genre.id} genre={genre}/>
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
            <EditListDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                listDetails={listDetails}
                genres={genres}
                loadingGenres={loadingGenres}
                onSave={handleUpdateList}
            />
        </Box>
    );
};

export default BookList;