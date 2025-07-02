import {useEffect, useState} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import {Box, CircularProgress, List, Pagination, Paper, Tab, Tabs, Typography} from '@mui/material';
import axios from 'axios';
import SuggestionCard from '../../components/SuggestionCard.jsx';
import API_URL from '../../apiUrl';

const SuggestionList = () => {
    const {token} = useAuth();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [activeTab, setActiveTab] = useState(0);

    const fetchSuggestions = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`${API_URL}/sugerencias/estado`, {
                params: {
                    page,
                    size: 10,
                    status: activeTab
                },
                headers: {Authorization: `Bearer ${token}`}
            });

            setSuggestions(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, [page, activeTab]);

    const handleStatusChange = async (suggestionId, newStatus) => {
        try {
            const token = localStorage.getItem('token');

            await axios.put(
                `${API_URL}/sugerencias/${suggestionId}`, {},
                {
                    params: {
                        newStatus: newStatus
                    },
                    headers: {Authorization: `Bearer ${token}`}
                }
            );

            setPage(0);
            fetchSuggestions();
        } catch (error) {
            console.error('Error updating suggestion status:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setPage(0);
    };

    const getStatusLabel = () => {
        switch (activeTab) {
            case 0:
                return 'pendientes';
            case 1:
                return 'aceptadas';
            case 2:
                return 'añadidas';
            case 3:
                return 'rechazadas';
            default:
                return '';
        }
    };

    return (
        <Box sx={{maxWidth: 900, mx: 'auto', p: 3}}>
            <Typography variant="h4" sx={{
                mb: 3,
                fontWeight: 'bold',
                color: '#432818',
                textAlign: 'center'
            }}>
                Sugerencias de libros
            </Typography>

            <Paper elevation={4} sx={{borderRadius: 2, overflow: 'hidden'}}>
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
                        label="Pendientes"
                        sx={{
                            fontWeight: 'medium',
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&.Mui-selected': {color: '#432818'}
                        }}
                    />
                    <Tab
                        label="Aceptadas"
                        sx={{
                            fontWeight: 'medium',
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&.Mui-selected': {color: '#432818'}
                        }}
                    />
                    <Tab
                        label="Añadidas"
                        sx={{
                            fontWeight: 'medium',
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&.Mui-selected': {color: '#432818'}
                        }}
                    />
                    <Tab
                        label="Rechazadas"
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
                        <Box display="flex" justifyContent="center" sx={{my: 4}}>
                            <CircularProgress size={60} sx={{color: '#432818'}}/>
                        </Box>
                    ) : suggestions.length === 0 ? (
                        <Typography variant="body1" sx={{textAlign: 'center', my: 4}}>
                            No hay sugerencias {getStatusLabel()}
                        </Typography>
                    ) : (
                        <>
                            <List sx={{width: '100%'}}>
                                {suggestions.map((suggestion) => (
                                    <SuggestionCard
                                        key={suggestion.id}
                                        suggestion={suggestion}
                                        activeTab={activeTab}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </List>

                            {totalPages > 1 && (
                                <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                                    <Pagination
                                        count={totalPages}
                                        page={page + 1}
                                        onChange={(event, value) => setPage(value - 1)}
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                color: '#432818',
                                            },
                                            '& .Mui-selected': {
                                                backgroundColor: '#432818 !important',
                                                color: '#fff !important'
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default SuggestionList;