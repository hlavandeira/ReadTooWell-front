import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    FormGroup,
    FormControlLabel,
    Checkbox,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import {useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext.jsx';

const BookFormatsDialog = ({open, onClose, bookId, selectedFormats, setSelectedFormats, onSave}) => {
    const {token} = useAuth();
    const [loadingFormats, setLoadingFormats] = useState(false);
    const [error, setError] = useState(null);

    const handleFormatChange = async (idFormat, isChecked) => {
        try {
            setLoadingFormats(true);

            if (isChecked) {
                const response = await axios.post(
                    `http://localhost:8080/biblioteca/${bookId}/formatos/${idFormat}`,
                    {},
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                if (response.data && Array.isArray(response.data)) {
                    setSelectedFormats(response.data.map(format => format.id));
                }
            } else {
                const response = await axios.delete(
                    `http://localhost:8080/biblioteca/${bookId}/formatos/${idFormat}`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                if (response.data && Array.isArray(response.data)) {
                    setSelectedFormats(response.data.map(format => format.id));
                }
            }
        } catch (error) {
            console.error('Error al actualizar formatos:', error);
            setError('Error al actualizar los formatos');
        } finally {
            setLoadingFormats(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px',
                        minWidth: '350px',
                        background: '#f5f5f5'
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
                Seleccionar formatos
            </DialogTitle>

            <DialogContent sx={{padding: '40px 24px 16px', pt: 10}}>
                {error && (
                    <Typography color="error" sx={{mb: 2}}>
                        {error}
                    </Typography>
                )}
                <Typography variant="body1" textAlign="center" sx={{mt: 2}}>
                    Selecciona los formatos que desees:
                </Typography>
                <FormGroup>
                    {[
                        {value: 0, label: 'Tapa blanda', idFormat: 1},
                        {value: 1, label: 'Tapa dura', idFormat: 2},
                        {value: 2, label: 'Ebook', idFormat: 3},
                        {value: 3, label: 'Audiolibro', idFormat: 4}
                    ].map((item) => (
                        <FormControlLabel
                            key={item.value}
                            control={
                                <Checkbox
                                    checked={selectedFormats.includes(item.idFormat)}
                                    onChange={(e) => handleFormatChange(item.idFormat, e.target.checked)}
                                    disabled={loadingFormats}
                                    sx={{
                                        color: '#432818',
                                        '&.Mui-checked': {color: '#432818'}
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 500,
                                        color: selectedFormats.includes(item.idFormat) ? '#432818' : 'inherit'
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            }
                            sx={{
                                margin: 0,
                                padding: '8px 12px',
                                pb: '3px',
                                mt: 1,
                                borderRadius: '8px',
                                backgroundColor: selectedFormats.includes(item.idFormat) ? '#43281810' : 'transparent',
                                '&:hover': {
                                    backgroundColor: '#43281815'
                                }
                            }}
                        />
                    ))}
                </FormGroup>
            </DialogContent>

            <DialogActions sx={{padding: '16px 24px', pt: '2px'}}>
                <Button
                    onClick={onClose}
                    disabled={loadingFormats}
                    sx={{
                        textTransform: 'none',
                        fontWeight: '500',
                        color: '#6c757d',
                        '&:hover': {
                            backgroundColor: '#f0f0f0'
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={onSave}
                    disabled={loadingFormats}
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        fontWeight: '500',
                        backgroundColor: '#432818',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        '&:hover': {
                            backgroundColor: '#5a3a23'
                        }
                    }}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookFormatsDialog;