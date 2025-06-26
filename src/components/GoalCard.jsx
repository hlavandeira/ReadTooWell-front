import React from 'react';
import {Paper, Box, Typography, Chip, LinearProgress, IconButton, Stack} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import {useAuth} from '../context/AuthContext.jsx';

const GoalCard = ({goal, onDelete}) => {
    const {token} = useAuth();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const calculateProgress = (goal) => {
        return Math.min(100, (goal.currentAmount / goal.amount) * 100);
    };

    const createGoalTitle = (goal) => {
        if (!goal || !goal.type || !goal.duration || !goal.dateStart) return '';

        const startDate = new Date(goal.dateStart);
        const month = startDate.toLocaleString('es-ES', {month: 'long'});
        const year = startDate.getFullYear();
        const typeLower = goal.type.toLowerCase();
        const durationLower = goal.duration.toLowerCase();

        if (durationLower === 'mensual') {
            return `Objetivo mensual de ${month}: ${goal.currentAmount} ${typeLower} de ${goal.amount}`;
        } else if (durationLower === 'anual') {
            return `Objetivo anual de ${year}: ${goal.currentAmount} ${typeLower} de ${goal.amount}`;
        } else {
            return `Objetivo ${durationLower}`;
        }
    };

    const getGoalColor = (type) => {
        switch (type) {
            case 'Libros':
                return '#432818';
            case 'Páginas':
                return '#8B0000';
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/objetivos/${goal.id}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            onDelete(goal.id);
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const isCompleted = goal.completed || calculateProgress(goal) >= 100;
    const progress = calculateProgress(goal);

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 2,
                borderLeft: `4px solid ${getGoalColor(goal.type)}`,
                opacity: isCompleted ? 0.8 : 1,
                '&:hover': {opacity: 1}
            }}
        >
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                <Typography variant="h6" component="h2" sx={{fontWeight: 'bold'}}>
                    {createGoalTitle(goal)}
                </Typography>
                {isCompleted ? (
                    <Chip
                        label={progress >= 100 ? 'Completado' : 'No completado'}
                        size="small"
                        sx={{
                            backgroundColor: progress >= 100 ? '#1C945C' : '#CC4D3D',
                            color: 'white'
                        }}
                    />
                ) : (
                    <Chip
                        label={goal.duration}
                        size="small"
                        sx={{
                            backgroundColor: '#f0e6dd',
                            color: '#432818'
                        }}
                    />
                )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                {formatDate(goal.dateStart)} - {formatDate(goal.dateFinish)}
            </Typography>

            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 1}}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    aria-label="Objetivo de lectura"
                    sx={{
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: getGoalColor(goal.type),
                            borderRadius: 4
                        }
                    }}
                />
                <Typography variant="body2" sx={{fontWeight: 'medium'}}>
                    {progress.toFixed(1)}%
                </Typography>
            </Box>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <Typography variant="caption" color="text.secondary">
                    {isCompleted ? (
                        `Terminado el ${formatDate(goal.dateFinish)}`
                    ) : (
                        `Tiempo restante: ${goal.remainingDays} días`
                    )}
                </Typography>

                {!isCompleted && (
                    <IconButton
                        onClick={handleDelete}
                        size="small"
                        sx={{
                            color: '#CC4D3D',
                            '&:hover': {
                                backgroundColor: '#CC4D320'
                            },
                            ml: 1
                        }}
                        aria-label="Borrar objetivo"
                    >
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                )}
            </Stack>
        </Paper>
    );
};

export default GoalCard;