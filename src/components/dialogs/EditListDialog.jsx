import {useState, useEffect} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Chip,
    CircularProgress,
    Typography,
    Box
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const EditListDialog = ({open, onClose, listDetails, genres, loadingGenres, onSave}) => {
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [selectedGenreIds, setSelectedGenreIds] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open && listDetails) {
            setEditName(listDetails.name);
            setEditDescription(listDetails.description || '');
            setSelectedGenreIds(new Set(listDetails.genres?.map(g => g.id) || []));
        }
    }, [open, listDetails]);

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

    const handleSubmit = async (e) => {
        try {
            if (e) e.preventDefault();

            setIsSubmitting(true);

            await onSave({
                name: editName,
                description: editDescription,
                genreIds: Array.from(selectedGenreIds)
            });
            onClose();
        } catch (error) {
            console.error('Error saving list:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <form onSubmit={handleSubmit}>
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
                            <CircularProgress size={24} sx={{color: '#8B0000'}}/>
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
                        onClick={onClose}
                        disabled={isSubmitting}
                        sx={{
                            textTransform: 'none',
                            color: '#6c757d'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!editName.trim() || isSubmitting}
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#8B0000',
                            '&:hover': {backgroundColor: '#6d0000'},
                            borderRadius: '20px',
                            px: 3,
                            position: 'relative'
                        }}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={24} sx={{color: 'white'}}/>
                        ) : (
                            'Guardar cambios'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditListDialog;