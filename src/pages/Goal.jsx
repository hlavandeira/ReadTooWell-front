import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth} from '../context/AuthContext.jsx';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    CircularProgress,
    Paper,
    Button
} from '@mui/material';
import GoalCard from '../components/GoalCard';
import AddGoalDialog from '../components/dialogs/AddGoalDialog';
import AddIcon from "@mui/icons-material/Add";
import API_URL from '../apiUrl';

const Goal = () => {
    const {token} = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [inProgressGoals, setInProgressGoals] = useState([]);
    const [completedGoals, setCompletedGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [goalDialogOpen, setGoalDialogOpen] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleGoalCreated = (newGoal) => {
        if (newGoal.completed) {
            setCompletedGoals(prev => [...prev, newGoal]);
        } else {
            setInProgressGoals(prev => [...prev, newGoal]);
        }
    };

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const [inProgressRes, completedRes] = await Promise.all([
                    axios.get(`${API_URL}/objetivos/en-curso`, {
                        headers: {Authorization: `Bearer ${token}`}
                    }),
                    axios.get(`${API_URL}/objetivos/terminados`, {
                        headers: {Authorization: `Bearer ${token}`}
                    })
                ]);

                setInProgressGoals(inProgressRes.data);
                setCompletedGoals(completedRes.data);
            } catch (error) {
                console.error('Error fetching goals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', p: 3, minHeight: '80vh'}}>
            <Typography variant="h3" component="h1" sx={{
                mb: 2,
                fontWeight: 'bold',
                color: '#432818',
                textAlign: 'center'
            }}>
                Objetivos de lectura
            </Typography>

            {/* Botón para añadir objetivo */}
            <Box sx={{display: 'flex', justifyContent: 'center', mb: 3}}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={() => setGoalDialogOpen(true)}
                    sx={{
                        textTransform: 'none',
                        color: 'white',
                        backgroundColor: '#432818',
                        borderRadius: '20px',
                        px: 3,
                        py: 1,
                        '&:hover': {
                            backgroundColor: '#5a3a23'
                        }
                    }}
                >
                    Comenzar nuevo objetivo
                </Button>
            </Box>

            {/* Diálogo para crear objetivo */}
            <AddGoalDialog
                open={goalDialogOpen}
                onClose={() => setGoalDialogOpen(false)}
                onGoalCreated={handleGoalCreated}
            />

            {/* Panel con las pestañas para objetivos en curso/terminados */}
            <Paper elevation={3} sx={{borderRadius: 2, overflow: 'hidden'}}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        backgroundColor: '#f5f5f5',
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#432818',
                            height: 3
                        }
                    }}
                >
                    <Tab
                        label="En curso"
                        sx={{
                            fontWeight: 'medium',
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&.Mui-selected': {color: '#432818'}
                        }}
                    />
                    <Tab
                        label="Finalizados"
                        sx={{
                            fontWeight: 'medium',
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&.Mui-selected': {color: '#432818'}
                        }}
                    />
                </Tabs>

                <Box sx={{p: 3}}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress sx={{color: '#8B0000'}}/>
                        </Box>
                    ) : (
                        <>
                            {activeTab === 0 && (
                                <Box>
                                    {inProgressGoals.length === 0 ? (
                                        <Typography variant="body1" textAlign="center" sx={{py: 4}}>
                                            No tienes objetivos en curso actualmente
                                        </Typography>
                                    ) : (
                                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                            {inProgressGoals.map((goal) => (
                                                <GoalCard
                                                    key={goal.id}
                                                    goal={goal}
                                                    onDelete={(deletedGoalId) => {
                                                        setInProgressGoals(prev => prev.filter(g => g.id !== deletedGoalId));
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {activeTab === 1 && (
                                <Box>
                                    {completedGoals.length === 0 ? (
                                        <Typography variant="body1" textAlign="center" sx={{py: 4}}>
                                            No has completado ningún objetivo todavía
                                        </Typography>
                                    ) : (
                                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                            {completedGoals.map((goal) => (
                                                <GoalCard key={goal.id} goal={goal}/>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default Goal;