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

const Catalogo = () => {
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 30;

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
        setPage(newPage);
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
            <Typography variant="h3" component="h1" gutterBottom align="center">
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
                        <Grid item key={libro.id} xs={12} sm={6} md={4} lg={3}>
                            <Card
                                sx={{
                                    width: 200,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "transform 0.3s",
                                    "&:hover": {
                                        transform: "scale(1.03)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <Box sx={{
                                    width: "100%",
                                    height: 300,
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <CardMedia
                                        component="img"
                                        image={libro.cover}
                                        alt={`Portada de ${libro.title}`}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                        onError={(e) => {
                                            e.target.src = "/placeholder-book-cover.jpg";
                                        }}
                                    />
                                </Box>
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        component="h2"
                                        noWrap
                                        sx={{ textAlign: "center" }}
                                    >
                                        {libro.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ textAlign: "center" }}
                                    >
                                        {libro.author}
                                    </Typography>
                                </CardContent>
                            </Card>
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