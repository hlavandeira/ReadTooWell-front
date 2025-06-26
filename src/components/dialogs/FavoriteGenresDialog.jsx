import React from 'react';
import {useState, useEffect} from 'react';
import {
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Chip,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext.jsx';

const FavoriteGenresDialog = ({open, onClose, currentFavoriteGenres}) => {
    const {token} = useAuth();
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenreIds, setSelectedGenreIds] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:8080/libros/generos', {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setGenres(response.data);

                if (currentFavoriteGenres && currentFavoriteGenres.length > 0) {
                    const initialSelected = new Set(currentFavoriteGenres.map(genre => genre.id));
                    setSelectedGenreIds(initialSelected);
                }
            } catch (error) {
                console.error('Error fetching genres:', error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchGenres();
        }
    }, [open, currentFavoriteGenres]);

    const handleGenreToggle = (genreId) => {
        const newSelected = new Set(selectedGenreIds);
        if (newSelected.has(genreId)) {
            newSelected.delete(genreId);
        } else {
            if (newSelected.size < 5) {
                newSelected.add(genreId);
            }
        }
        setSelectedGenreIds(newSelected);
    };

    const handleSave = async () => {
        try {
            setIsSubmitting(true);

            await axios.put(
                'http://localhost:8080/usuarios/generos-favoritos',
                {},
                {
                    params: {genreIds: Array.from(selectedGenreIds).join(',')},
                    headers: {Authorization: `Bearer ${token}`}
                }
            );

            onClose(true);
        } catch (error) {
            console.error('Error updating favorite genres:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{backgroundColor: '#432818', color: 'white', fontWeight: 'bold'}}>
                Editar géneros favoritos
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{my: 1.5}}>
                    Selecciona hasta 5 géneros favoritos:
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress sx={{color: '#8B0000'}}/>
                    </Box>
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
                                        backgroundColor: selectedGenreIds.has(genre.id) ? '#E0DCD3' : '#f5f5f5'
                                    },
                                    color: selectedGenreIds.has(genre.id) ? 'black' : 'inherit'
                                }}
                            />
                        ))}
                    </Box>
                )}
                <Typography variant="body2" color="text.secondary">
                    Seleccionados: {selectedGenreIds.size}/5
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

export default FavoriteGenresDialog;