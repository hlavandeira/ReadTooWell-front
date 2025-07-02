import React from 'react';
import {useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';

const AddToListDialog = ({open, onClose, lists, onAddToList, bookId, onSuccess}) => {
    const [selectedListId, setSelectedListId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!selectedListId) return;

        setLoading(true);
        setError(null);

        try {
            await onAddToList(selectedListId, bookId);
            if (onSuccess) onSuccess();
            setSelectedListId(null);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al añadir a la lista');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                setSelectedListId(null);
                setError(null);
                onClose();
            }}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px',
                        minWidth: '350px'
                    }
                }
            }}
        >
            <DialogTitle sx={{
                backgroundColor: '#432818',
                color: 'white',
                fontWeight: 'bold',
                padding: '16px 24px'
            }}>
                Añadir a lista
            </DialogTitle>

            <DialogContent sx={{padding: '24px', mt: 3}}>
                {error && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {error}
                    </Alert>
                )}

                {lists.length === 0 ? (
                    <Typography variant="body1" textAlign="center" sx={{mt: 2}}>
                        No tienes ninguna lista creada
                    </Typography>
                ) : (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <Typography variant="body1" textAlign="center">
                            Selecciona una de tus listas:
                        </Typography>
                        {lists.map((list) => (
                            <Button
                                key={list.id}
                                variant={selectedListId === list.id ? 'contained' : 'outlined'}
                                onClick={() => setSelectedListId(list.id)}
                                disabled={loading}
                                sx={{
                                    textTransform: 'none',
                                    justifyContent: 'flex-start',
                                    backgroundColor: selectedListId === list.id ? '#43281820' : 'transparent',
                                    borderColor: '#432818',
                                    color: 'text.primary',
                                    '&:hover': {
                                        backgroundColor: '#43281810'
                                    }
                                }}
                            >
                                {list.name}
                                {list.genres?.length > 0 && (
                                    <Box sx={{ml: 'auto', display: 'flex', gap: 0.5}}>
                                        {list.genres.slice(0, 2).map(genre => (
                                            <Chip
                                                key={genre.id}
                                                label={genre.name}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.6rem',
                                                    height: '20px'
                                                }}
                                            />
                                        ))}
                                        {list.genres.length > 2 && (
                                            <Chip
                                                label={`+${list.genres.length - 2}`}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.6rem',
                                                    height: '20px'
                                                }}
                                            />
                                        )}
                                    </Box>
                                )}
                            </Button>
                        ))}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{padding: '16px 24px'}}>
                <Button
                    onClick={() => {
                        setSelectedListId(null);
                        setError(null);
                        onClose();
                    }}
                    disabled={loading}
                    sx={{
                        textTransform: 'none',
                        color: '#6c757d'
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    disabled={!selectedListId || lists.length === 0 || loading}
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#432818',
                        '&:hover': {backgroundColor: '#5a3a23'},
                        position: 'relative'
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{color: 'white'}}/>
                    ) : (
                        'Añadir'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddToListDialog;