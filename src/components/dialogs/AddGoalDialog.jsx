import {useState} from 'react';
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
    Alert,
    Button,
    Typography
} from '@mui/material';
import {useAuth} from '../../context/AuthContext.jsx';

const AddGoalDialog = ({open, onClose, onGoalCreated}) => {
    const {token} = useAuth();
    const [goalType, setGoalType] = useState('Libros');
    const [goalDuration, setGoalDuration] = useState('Mensual');
    const [newAmount, setNewAmount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateGoal = async (e) => {
        try {
            if (e) e.preventDefault();

            setError('');
            setLoading(true);

            const amount = parseInt(newAmount);
            if (isNaN(amount) || amount <= 0) {
                setError('Por favor ingresa un número válido mayor que 0');
                return;
            }

            const goalData = {
                type: goalType,
                duration: goalDuration,
                amount: amount
            };

            const response = await axios.post('http://localhost:8080/objetivos', goalData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            onGoalCreated(response.data);
            resetDialog();
        } catch (error) {
            console.error('Error creating goal:', error);
            if (error.response && error.response.status === 400) {
                setError(error.response.data.error || 'Ya existe un objetivo en curso con ese tipo y duración.');
            } else {
                setError('Error al crear el objetivo. Por favor, inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const resetDialog = () => {
        setGoalType('Libros');
        setGoalDuration('Mensual');
        setNewAmount('');
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={resetDialog} fullWidth maxWidth="sm">
            <form onSubmit={handleCreateGoal}>
                <DialogTitle sx={{
                    backgroundColor: '#432818',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    Nuevo objetivo de lectura
                </DialogTitle>

                <DialogContent sx={{p: 3, mt: 1.5}}>
                    {error && (
                        <Alert severity="error" sx={{mb: 2, mt: 1}}>
                            {error}
                        </Alert>
                    )}

                    <Typography variant="subtitle1" gutterBottom>
                        Período del objetivo:
                    </Typography>
                    <RadioGroup
                        value={goalDuration}
                        onChange={(e) => {
                            setGoalDuration(e.target.value);
                            setError('');
                        }}
                        sx={{mb: 3}}
                    >
                        <FormControlLabel
                            value="Mensual"
                            control={<Radio/>}
                            label="Objetivo mensual"
                        />
                        <FormControlLabel
                            value="Anual"
                            control={<Radio/>}
                            label="Objetivo anual"
                        />
                    </RadioGroup>

                    <Typography variant="subtitle1" gutterBottom>
                        Tipo de objetivo:
                    </Typography>
                    <RadioGroup
                        value={goalType}
                        onChange={(e) => {
                            setGoalType(e.target.value);
                            setError('');
                        }}
                        sx={{mb: 3}}
                    >
                        <FormControlLabel
                            value="Libros"
                            control={<Radio/>}
                            label="Número de libros"
                        />
                        <FormControlLabel
                            value="Páginas"
                            control={<Radio/>}
                            label="Número de páginas"
                        />
                    </RadioGroup>

                    <TextField
                        fullWidth
                        label={`${goalType === 'Libros' ? 'Libros' : 'Páginas'} a leer`}
                        value={newAmount}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^[1-9]\d*$/.test(value)) {
                                setNewAmount(value);
                                setError('');
                            }
                        }}
                        error={!!error && !error.includes('exist')}
                    />
                </DialogContent>

                <DialogActions sx={{p: 2}}>
                    <Button
                        type="button"
                        onClick={resetDialog}
                        disabled={loading}
                        sx={{
                            textTransform: 'none',
                            color: '#6c757d'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCreateGoal}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#432818',
                            '&:hover': {backgroundColor: '#5a3a23'}
                        }}
                    >
                        Crear objetivo
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddGoalDialog;