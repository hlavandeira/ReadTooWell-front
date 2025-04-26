import {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Typography,
    Button
} from '@mui/material';

const UpdateProgressDialog = ({open, onClose, book, onProgressUpdated}) => {
    const [progressType, setProgressType] = useState(book?.progressType || 'paginas');
    const [progressValue, setProgressValue] = useState(book?.progress || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (book) {
            setProgressType(book.progressType);
            setProgressValue(book.progress);
        }
    }, [book]);

    const handleSaveProgress = async () => {
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('token');

            await axios.put(`http://localhost:8080/biblioteca/${book.id.bookId}/progreso`, null, {
                params: {
                    tipoProgreso: progressType,
                    progreso: progressValue
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedBook = {
                ...book,
                progress: progressValue,
                progressType
            };

            onProgressUpdated(updatedBook);
            onClose();
        } catch (error) {
            console.error('Error updating progress:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{
                backgroundColor: '#432818',
                color: 'white',
                fontWeight: 'bold'
            }}>
                Actualizar progreso
            </DialogTitle>

            <DialogContent sx={{p: 5, pb: 2, mt: 2}}>
                {book && (
                    <>
                        <RadioGroup
                            value={progressType}
                            onChange={(e) => setProgressType(e.target.value)}
                            sx={{mb: 3}}
                        >
                            <FormControlLabel
                                value="paginas"
                                control={<Radio/>}
                                label="Páginas leídas"
                            />
                            <FormControlLabel
                                value="porcentaje"
                                control={<Radio/>}
                                label="Porcentaje completado"
                            />
                        </RadioGroup>

                        <TextField
                            fullWidth
                            type="number"
                            label={progressType === 'paginas' ? 'Páginas leídas' : 'Porcentaje completado'}
                            value={progressValue}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || !isNaN(value)) {
                                    setProgressValue(value === '' ? '' : Number(value));
                                }
                            }}
                            inputProps={{
                                min: 0,
                                max: progressType === 'paginas' ? book.book.pageNumber : 100
                            }}
                        />

                        {progressType === 'paginas' && book.book.pageNumber && (
                            <Typography variant="caption" display="block" sx={{mt: 1}}>
                                Total de páginas: {book.book.pageNumber}
                            </Typography>
                        )}
                    </>
                )}
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
                    onClick={handleSaveProgress}
                    variant="contained"
                    disabled={isSubmitting || progressValue === ''}
                    sx={{
                        backgroundColor: '#8B0000',
                        '&:hover': {backgroundColor: '#6d0000'},
                        textTransform: 'none'
                    }}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateProgressDialog;