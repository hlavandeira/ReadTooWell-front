import { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Pagination
} from "@mui/material";
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard.jsx'

const Catalogo = () => {
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 30;

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        const fetchLibros = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8080/libros", {
                    params: {
                        page: page - 1,
                        size: itemsPerPage
                    }
                });
                setLibros(response.data.content);
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                console.error("Error cargando los libros:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLibros();
    }, [page]);

    const handlePageChange = (event, newPage) => {
        setSearchParams({ page: newPage });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!libros.length) {
        return (
            <Typography variant="h6" align="center" mt={4}>
                No se encontraron libros
            </Typography>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                    fontFamily: '"Domine", serif',
                    fontOpticalSizing: 'auto',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    letterSpacing: '1px',
                    color: '#432818'
                }}
            >
                Catálogo de libros
            </Typography>

            <Box display="flex" justifyContent="center">
                <Grid
                    container
                    spacing={4}
                    sx={{
                        maxWidth: "100%",
                        justifyContent: "center"
                    }}
                >
                    {libros.map((libro) => (
                        <Grid key={libro.id}>
                            <BookCard libro={libro} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    sx={{ '& .MuiPaginationItem-root': { fontSize: '1rem' } }}
                />
            </Box>
        </Container>
    );
};

export default Catalogo;