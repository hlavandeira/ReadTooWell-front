import {useState} from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Button,
    Box,
    Chip
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {useAuth} from '../../context/AuthContext.jsx';

const NewListDialog = ({open, onClose, onListCreated, genres = []}) => {
    const {token} = useAuth();
    const [newListName, setNewListName] = useState('');
    const [newListDescription, setNewListDescription] = useState('');
    const [selectedGenreIds, setSelectedGenreIds] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleCreateList = async (e) => {
        try {
            if (e) e.preventDefault();

            setIsSubmitting(true);

            const response = await axios.post('http://localhost:8080/listas',
                {
                    name: newListName,
                    description: newListDescription
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

            onListCreated(response.data);
            resetDialog();
        } catch (error) {
            console.error('Error creating list:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetDialog = () => {
        setNewListName('');
        setNewListDescription('');
        setSelectedGenreIds(new Set());
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={resetDialog}
            maxWidth="sm"
            fullWidth
        >
            <form onSubmit={handleCreateList}>
                <DialogTitle sx={{
                    backgroundColor: '#432818',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <LibraryBooksIcon/>
                    Nueva lista de libros
                </DialogTitle>

                <DialogContent sx={{p: 3}}>
                    <Box component="form" sx={{mt: 1}}>
                        {/* Nombre */}
                        <TextField
                            autoFocus
                            margin="normal"
                            label="Nombre de la lista*"
                            fullWidth
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            sx={{mb: 2}}
                        />

                        {/* Descripción */}
                        <TextField
                            margin="normal"
                            label="Descripción (opcional)"
                            fullWidth
                            multiline
                            rows={3}
                            value={newListDescription}
                            onChange={(e) => {
                                if (e.target.value.length <= 2000) {
                                    setNewListDescription(e.target.value);
                                }
                            }}
                            inputProps={{
                                maxLength: 2000
                            }}
                            helperText={`${newListDescription.length}/2000 caracteres`}
                            sx={{mb: 3}}
                        />

                        {/* Selección de géneros */}
                        <Typography variant="subtitle2" component="h3" sx={{mb: 1, color: '#432818'}}>
                            Selecciona géneros (opcional):
                        </Typography>

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
                    </Box>
                </DialogContent>

                <DialogActions sx={{p: 2}}>
                    <Button
                        onClick={resetDialog}
                        disabled={isSubmitting}
                        sx={{
                            textTransform: 'none',
                            color: '#6c757d'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCreateList}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#8B0000',
                            '&:hover': {backgroundColor: '#6d0000'},
                            borderRadius: '20px',
                            px: 3
                        }}
                    >
                        Crear lista
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default NewListDialog;