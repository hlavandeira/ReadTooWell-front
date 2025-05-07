import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Box, CircularProgress, Grid, Typography, Pagination} from '@mui/material';
import axios from 'axios';
import AuthorCard from '../components/AuthorCard';
import {useAuth} from "../context/AuthContext.jsx";

const Authors = () => {
    const {token} = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [authors, setAuthors] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const itemsPerPage = 12;
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const fetchAuthors = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/usuarios/autores', {
                params: {
                    page: currentPage - 1,
                    size: itemsPerPage
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAuthors(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching authors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, [currentPage]);

    const handlePageChange = (event, newPage) => {
        setSearchParams({page: newPage});
    };

    return (
        <Box sx={{p: {xs: 2, md: 3}, maxWidth: 1400, mx: 'auto'}}>
            <Typography variant="h4" sx={{
                mb: 4,
                fontWeight: 'bold',
                color: '#432818',
                textAlign: 'center'
            }}>
                Autores en ReadTooWell
            </Typography>

            {isLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', py: 10}}>
                    <CircularProgress size={60} sx={{color: '#8B0000'}}/>
                </Box>
            ) : authors.length > 0 ? (
                <>
                    <Grid container spacing={4} justifyContent="center">
                        {authors.map((author) => (
                            <Grid key={author.id}>
                                <AuthorCard user={author}/>
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 1 && (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: '#432818',
                                        '&.Mui-selected': {
                                            backgroundColor: '#8B0000',
                                            color: 'white'
                                        }
                                    }
                                }}
                            />
                        </Box>
                    )}
                </>
            ) : (
                <Typography variant="h6" align="center" sx={{mt: 4, color: '#432818'}}>
                    No se encontraron autores
                </Typography>
            )}
        </Box>
    );
};

export default Authors;