import {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext.jsx';
import axios from 'axios';
import AddCollectionDialog from '../../components/dialogs/AddCollectionDialog';
import {
    Box,
    Typography,
    Button,
    TextField,
    CircularProgress,
    Paper,
    Chip,
    IconButton,
    Alert,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import API_URL from '../../apiUrl';

const EditBook = () => {
    const {token} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [genres, setGenres] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [coverPreview, setCoverPreview] = useState('');
    const [error, setError] = useState(null);
    const [addCollectionDialogOpen, setAddCollectionDialogOpen] = useState(false);
    const [collectionError, setCollectionError] = useState('');
    const fileInputRef = useRef(null);

    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        publicationYear: '',
        pageNumber: '',
        publisher: '',
        synopsis: '',
        cover: '',
        isbn: '',
        collectionId: '',
        numCollection: null
    });

    const [fieldErrors, setFieldErrors] = useState({
        title: '',
        author: '',
        publicationYear: '',
        pageNumber: '',
        numCollection: '',
        isbn: '',
        cover: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookResponse = await axios.get(`${API_URL}/libros/${id}/detalles`, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                const bookDetails = bookResponse.data;
                setBookData({
                    title: bookDetails.book.title,
                    author: bookDetails.book.author,
                    publicationYear: bookDetails.book.publicationYear || '',
                    pageNumber: bookDetails.book.pageNumber || '',
                    publisher: bookDetails.book.publisher || '',
                    synopsis: bookDetails.book.synopsis || '',
                    cover: bookDetails.book.cover,
                    isbn: bookDetails.book.isbn || '',
                    collectionId: bookDetails.book.collectionId ? bookDetails.book.collectionId.toString() : '',
                    numCollection: bookDetails.book.numCollection || null
                });

                setCoverPreview(bookDetails.book.cover);
                setSelectedGenres(bookDetails.book.genres?.map(g => g.id) || []);

                const genresResponse = await axios.get(`${API_URL}/libros/generos`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setGenres(genresResponse.data);

                const collectionsResponse = await axios.get(`${API_URL}/libros/colecciones`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setCollections(collectionsResponse.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, token, navigate]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setBookData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleNumericInput = (e) => {
        const {name, value} = e.target;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            handleInputChange(e);
        }
    };

    const handleGenreChange = (genreId) => {
        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        );
    };

    const handleCoverClick = () => {
        fileInputRef.current.click();
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            setFieldErrors(prev => ({
                ...prev,
                cover: 'Solo se permiten imágenes JPEG, PNG o GIF'
            }));
            return;
        }

        if (file.size > maxSize) {
            setFieldErrors(prev => ({
                ...prev,
                cover: 'La imagen no puede ser mayor a 5MB'
            }));
            return;
        }

        setUploadingCover(true);
        setFieldErrors(prev => ({...prev, cover: ''}));
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'readtoowell_preset');

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dfrgrfw4c/image/upload',
                formData
            );

            setCoverPreview(response.data.secure_url);
            setBookData(prev => ({
                ...prev,
                cover: response.data.secure_url
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            setFieldErrors(prev => ({
                ...prev,
                cover: 'Error al subir la imagen. Inténtalo de nuevo.'
            }));
        } finally {
            setUploadingCover(false);
        }
    };

    const handleRemoveCover = () => {
        setCoverPreview('');
        setBookData(prev => ({
            ...prev,
            cover: ''
        }));
    };

    const handleAddCollection = async (name) => {
        try {
            setCollectionError('');
            const response = await axios.post(
                `${API_URL}/libros/colecciones`,
                {name},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            setCollections(prev => [...prev, response.data]);
            setBookData(prev => ({
                ...prev,
                collectionId: response.data.id.toString()
            }));
            setAddCollectionDialogOpen(false);
        } catch (error) {
            if (error.response && error.response.data.error) {
                setCollectionError(error.response.data.error);
            } else {
                setCollectionError('Error al crear la colección');
            }
        }
    };

    const handleCloseDialog = () => {
        setAddCollectionDialogOpen(false);
        setCollectionError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const updatedBook = {
                ...bookData,
                collectionId: bookData.collectionId || null,
                numCollection: bookData.numCollection || null
            };

            const response = await axios.put(
                `${API_URL}/libros/${id}`,
                updatedBook,
                {
                    headers: {Authorization: `Bearer ${token}`},
                    params: {genreIds: selectedGenres.join(',')}
                }
            );

            if (response.status === 200) {
                navigate(`/admin/detalles/${id}`);
            }
        } catch (error) {
            console.error("Error updating book:", error);
            if (error.response) {
                const backendError = error.response.data;

                if (error.response.status === 400) {
                    if (typeof backendError === 'object') {
                        const backendFieldErrors = {
                            title: '',
                            author: '',
                            publicationYear: '',
                            pageNumber: '',
                            numCollection: '',
                            isbn: '',
                            cover: ''
                        };

                        if (backendError.isbn) {
                            backendFieldErrors.isbn = backendError.isbn === 'debe coincidir con "^(\\d{10}|\\d{13})$"'
                                ? 'El ISBN debe tener 10 o 13 dígitos'
                                : backendError.isbn;
                        }

                        setFieldErrors(prev => ({
                            ...prev,
                            ...backendFieldErrors
                        }));

                        setError('Por favor, corrige los errores en el formulario');
                    } else if (backendError.error) {
                        setError(backendError.error);
                    }
                } else {
                    setError("Error en el servidor");
                }
            } else {
                setError("Error de conexión. Por favor, verifica tu conexión e inténtalo de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{color: '#8B0000'}}/>
            </Box>
        );
    }

    return (
        <Box sx={{maxWidth: '1200px', mx: 'auto', p: 3}}>
            <Box justifyContent='center' sx={{display: 'flex', gap: 3}}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: '#432818',
                        fontSize: {xs: '2rem', sm: '2.5rem'}
                    }}
                >
                    Editar libro: "{bookData.title}"
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{mb: 3}}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Box sx={{display: 'flex', gap: 3, mb: 3}}>
                    {/* Portada */}
                    <Paper elevation={3} sx={{width: '300px', flexShrink: 0, p: 2}}>
                        <Typography variant="h6" gutterBottom sx={{mb: 2}}>
                            Portada del libro
                        </Typography>

                        {coverPreview ? (
                            <Box sx={{position: 'relative', mb: 2}}>
                                <img
                                    src={coverPreview}
                                    alt="Portada del libro"
                                    style={{
                                        width: '100%',
                                        height: '300px',
                                        objectFit: 'contain',
                                        borderRadius: '4px'
                                    }}
                                    onClick={handleCoverClick}
                                />
                                <IconButton
                                    onClick={handleRemoveCover}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.7)'
                                        }
                                    }}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    border: '2px dashed #ccc',
                                    borderRadius: '4px',
                                    p: 4,
                                    textAlign: 'center',
                                    mb: 2,
                                    height: '300px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                                onClick={handleCoverClick}
                            >
                                {uploadingCover ? (
                                    <CircularProgress sx={{color: '#432818'}}/>
                                ) : (
                                    <>
                                        <CloudUploadIcon sx={{fontSize: 48, color: '#888', mb: 1}}/>
                                        <Typography variant="body2" color="textSecondary">
                                            Arrastra una imagen o haz clic para seleccionar
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleCoverChange}
                            accept="image/*"
                            style={{display: 'none'}}
                        />
                        {fieldErrors.cover && (
                            <Typography color="error" variant="body2" sx={{mt: 1}}>
                                {fieldErrors.cover}
                            </Typography>
                        )}
                    </Paper>

                    {/* Información básica */}
                    <Paper elevation={3} sx={{flexGrow: 1, p: 3}}>
                        <Typography variant="h6" gutterBottom sx={{mb: 4}}>
                            Información básica
                        </Typography>

                        {/* Título, Autor, Año */}
                        <Box sx={{display: 'flex', gap: 2, mb: 4}}>
                            <TextField
                                fullWidth
                                label="Título*"
                                name="title"
                                value={bookData.title}
                                onChange={handleInputChange}
                                required
                                sx={{flex: 2}}
                                error={!!fieldErrors.title}
                                helperText={fieldErrors.title}
                            />
                            <TextField
                                fullWidth
                                label="Autor*"
                                name="author"
                                value={bookData.author}
                                onChange={handleInputChange}
                                required
                                sx={{flex: 2}}
                                error={!!fieldErrors.author}
                                helperText={fieldErrors.author}
                            />
                            <TextField
                                fullWidth
                                label="Año"
                                name="publicationYear"
                                value={bookData.publicationYear}
                                onChange={handleNumericInput}
                                sx={{flex: 1}}
                                error={!!fieldErrors.publicationYear}
                                helperText={fieldErrors.publicationYear}
                                inputProps={{
                                    maxLength: 4,
                                    min: 1000,
                                    max: new Date().getFullYear()
                                }}
                            />
                        </Box>

                        {/* Editorial, ISBN, Páginas */}
                        <Box sx={{display: 'flex', gap: 2, mb: 4}}>
                            <TextField
                                fullWidth
                                label="Editorial"
                                name="publisher"
                                value={bookData.publisher}
                                onChange={handleInputChange}
                                sx={{flex: 1}}
                            />
                            <TextField
                                fullWidth
                                label="ISBN"
                                name="isbn"
                                value={bookData.isbn}
                                onChange={handleInputChange}
                                sx={{flex: 1}}
                                error={!!fieldErrors.isbn}
                                helperText={fieldErrors.isbn}
                            />
                            <TextField
                                fullWidth
                                label="Páginas*"
                                name="pageNumber"
                                value={bookData.pageNumber}
                                onChange={handleNumericInput}
                                sx={{flex: 1}}
                                error={!!fieldErrors.pageNumber}
                                helperText={fieldErrors.pageNumber}
                                inputProps={{min: 1}}
                            />
                        </Box>

                        <Typography variant="h6" gutterBottom sx={{mb: 4}}>
                            Colección
                        </Typography>

                        <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                            <Box sx={{flex: 2, display: 'flex', gap: 1}}>
                                <InputLabel id="collection-label" sx={{display: 'none'}}>Colección</InputLabel>
                                <Select
                                    labelId="collection-label"
                                    fullWidth
                                    displayEmpty
                                    name="collectionId"
                                    value={bookData.collectionId || ''}
                                    onChange={handleInputChange}
                                    sx={{flex: 1}}
                                >
                                    <MenuItem value="">Ninguna colección</MenuItem>
                                    {collections.map((collection) => (
                                        <MenuItem key={collection.id} value={collection.id.toString()}>
                                            {collection.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon/>}
                                    onClick={() => setAddCollectionDialogOpen(true)}
                                    sx={{color: '#432818', borderColor: '#432818', textTransform: 'none'}}
                                >
                                    Nueva
                                </Button>
                            </Box>
                            <TextField
                                fullWidth
                                label="Número"
                                name="numCollection"
                                value={bookData.numCollection || ''}
                                onChange={handleNumericInput}
                                sx={{flex: 1}}
                                error={!!fieldErrors.numCollection}
                                helperText={fieldErrors.numCollection}
                                inputProps={{min: 1}}
                                disabled={!bookData.collectionId}
                            />
                        </Box>
                    </Paper>
                </Box>

                {/* Sinopsis y géneros */}
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                    <Paper elevation={3} sx={{p: 3}}>
                        <Typography variant="h6" gutterBottom>
                            Sinopsis
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="Sinopsis del libro"
                            name="synopsis"
                            value={bookData.synopsis}
                            onChange={handleInputChange}
                        />
                    </Paper>

                    <Paper elevation={3} sx={{p: 3}}>
                        <Typography variant="h6" gutterBottom sx={{color: '#432818'}}>
                            Géneros
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            p: 1
                        }}>
                            {genres.map((genre) => (
                                <Chip
                                    key={genre.id}
                                    label={genre.name}
                                    clickable
                                    variant={selectedGenres.includes(genre.id) ? 'filled' : 'outlined'}
                                    color={selectedGenres.includes(genre.id) ? 'primary' : 'default'}
                                    onClick={() => handleGenreChange(genre.id)}
                                    sx={{
                                        borderRadius: '4px',
                                        borderColor: selectedGenres.includes(genre.id) ? '#432818' : '#ddd',
                                        backgroundColor: selectedGenres.includes(genre.id) ? '#CCC4B7' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: selectedGenres.includes(genre.id) ? '#E0DCD3' : '#f5f5f5'
                                        },
                                        color: selectedGenres.includes(genre.id) ? 'black' : 'inherit'
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4}}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/admin/detalles/${id}`)}
                        sx={{
                            px: 2,
                            py: 1,
                            color: '#432818',
                            borderColor: '#432818',
                            '&:hover': {borderColor: '#5a3a23'},
                            textTransform: 'none'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            px: 2,
                            py: 1,
                            backgroundColor: '#432818',
                            '&:hover': {backgroundColor: '#5a3a23'},
                            textTransform: 'none',
                            position: 'relative'
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{color: 'white'}}/>
                        ) : (
                            'Guardar cambios'
                        )}
                    </Button>
                </Box>
            </form>

            <AddCollectionDialog
                open={addCollectionDialogOpen}
                onClose={handleCloseDialog}
                onSave={handleAddCollection}
                error={collectionError}
            />
        </Box>
    );
};

export default EditBook;