import React from 'react';
import {useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';

const EditReviewDialog = ({open, onClose, initialReview = '', onSave}) => {
    const [reviewText, setReviewText] = useState(initialReview);

    const handleSave = (e) => {
        if (e) e.preventDefault();

        onSave(reviewText);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSave}>
                <DialogTitle sx={{
                    backgroundColor: '#432818',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {initialReview.trim() === '' ? 'Añadir reseña' : 'Editar reseña'}
                </DialogTitle>
                <DialogContent sx={{p: 3, pb: 1}}>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Escribe tu reseña sobre este libro..."
                        variant="outlined"
                        sx={{mt: 2}}
                    />
                </DialogContent>
                <DialogActions sx={{p: 2, pt: 0.5}}>
                    <Button
                        onClick={onClose}
                        sx={{color: 'text.secondary', textTransform: 'none'}}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{
                            backgroundColor: '#432818',
                            '&:hover': {backgroundColor: '#5a3a23'},
                            textTransform: 'none'
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditReviewDialog;