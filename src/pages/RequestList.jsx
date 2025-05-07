import {useEffect, useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {Box, CircularProgress, List, Pagination, Paper, Tab, Tabs, Typography} from '@mui/material';
import axios from 'axios';
import RequestCard from '../components/RequestCard';

const RequestList = () => {
    const {token} = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [activeTab, setActiveTab] = useState(0);

    const fetchRequests = async () => {
        try {
            setLoading(true);

            const response = await axios.get('http://localhost:8080/solicitud-autor/estado', {
                params: {
                    page,
                    size: 10,
                    status: activeTab
                },
                headers: {Authorization: `Bearer ${token}`}
            });

            setRequests(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [page, activeTab]);

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:8080/solicitud-autor/${requestId}`, {},
                {
                    params: {
                        newStatus: newStatus
                    },
                    headers: {Authorization: `Bearer ${token}`}
                }
            );

            setPage(0);

            fetchRequests();
        } catch (error) {
            console.error('Error updating request status:', error);
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
                Solicitudes de verificación de autores
            </Typography>

            {/* Pestañas según el estado de las solicitudes */}
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
                            <CircularProgress size={60} sx={{color: '#8B0000'}}/>
                        </Box>
                    ) : requests.length === 0 ? (
                        <Typography variant="body1" sx={{textAlign: 'center', my: 4}}>
                            No hay solicitudes {getStatusLabel()}
                        </Typography>
                    ) : (
                        <>
                            <List sx={{width: '100%'}}>
                                {requests.map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        request={request}
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
                                        color="primary"
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

export default RequestList;