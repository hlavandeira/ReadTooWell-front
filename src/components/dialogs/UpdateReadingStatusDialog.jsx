import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    FormControl,
    CircularProgress
} from '@mui/material';

const statusOptions = [
    { value: 0, label: 'Pendiente', color: '#6c757d' },
    { value: 1, label: 'Leyendo', color: '#4C88A8' },
    { value: 2, label: 'Leído', color: '#1C945C' },
    { value: 3, label: 'Pausado', color: '#DEA807' },
    { value: 4, label: 'Abandonado', color: '#CC4D3D' }
];

const UpdateReadingStatusDialog = ({
                                       open,
                                       onClose,
                                       currentStatus,
                                       onSave,
                                       bookId
                                   }) => {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setSelectedStatus(currentStatus);
    }, [currentStatus]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            await onSave(selectedStatus, bookId);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar el estado');
            console.error("Error updating reading status:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    minWidth: '350px',
                    background: '#f5f5f5'
                }
            }}
        >
            <DialogTitle sx={{
                backgroundColor: '#432818',
                color: 'white',
                fontWeight: 'bold',
                padding: '16px 24px'
            }}>
                Cambiar estado de lectura
            </DialogTitle>

            {error && (
                <Alert severity="error" sx={{ m: 2 }}>
                    {error}
                </Alert>
            )}

            <DialogContent sx={{ padding: '40px 24px 16px', pt: 10 }}>
                <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                        sx={{ gap: '8px', pt: '10px' }}
                    >
                        {statusOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                    <Radio
                                        sx={{
                                            color: option.color,
                                            '&.Mui-checked': { color: option.color }
                                        }}
                                    />
                                }
                                label={
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 500,
                                            color: selectedStatus === option.value ? option.color : 'inherit'
                                        }}
                                    >
                                        {option.label}
                                    </Typography>
                                }
                                sx={{
                                    margin: 0,
                                    padding: '8px 12px',
                                    pb: '3px',
                                    borderRadius: '8px',
                                    backgroundColor: selectedStatus === option.value ? `${option.color}10` : 'transparent',
                                    '&:hover': {
                                        backgroundColor: `${option.color}15`
                                    }
                                }}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </DialogContent>

            <DialogActions sx={{ padding: '16px 24px', pt: '2px' }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
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
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        textTransform: 'none',
                        fontWeight: '500',
                        backgroundColor: '#432818',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        '&:hover': {
                            backgroundColor: '#5a3a23'
                        },
                        position: 'relative'
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                        'Guardar'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateReadingStatusDialog;