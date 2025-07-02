import {
    Container,
    Grid,
    Typography,
    Box,
    Pagination
} from "@mui/material";
import BookCard from "./BookCard.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAuth} from "../../context/AuthContext.jsx";
import API_URL from '../../apiUrl';

const BookGrid = ({titulo, libros = [], page, totalPages, onPageChange, onBookDelete}) => {
    const {token} = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!token) {
            return;
        }
        const verifyAdmin = async () => {
            try {
                const response = await axios.get(`${API_URL}/usuarios/verificar-admin`, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                setIsAdmin(response.data);
            } catch (error) {
                console.error('Error verificando rol:', error);
                setIsAdmin(false);
            }
        };

        verifyAdmin();
    }, [token]);

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                    fontWeight: 600,
                    fontStyle: 'normal',
                    color: '#432818',
                    mb: 4
                }}
            >
                {titulo}
            </Typography>

            <Box display="flex" justifyContent="center" sx={{minHeight: '65vh'}}>
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
                            <BookCard
                                libro={libro}
                                isAdmin={isAdmin}
                                onDelete={onBookDelete}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {totalPages > 1 && onPageChange && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={onPageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                        sx={{'& .MuiPaginationItem-root': {fontSize: '1rem'}}}
                    />
                </Box>
            )}
        </Container>
    );
};

export default BookGrid;