import {useEffect, useState} from "react";
import {useParams, useLocation} from 'react-router-dom';
import axios from "axios";
import {Box, CircularProgress, Typography} from "@mui/material";
import {useSearchParams} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext.jsx';
import BookGrid from '../../components/books/BookGrid.jsx';

const BooksByGenre = () => {
    const {token} = useAuth();
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 30;

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    const {idGenero} = useParams();
    const {state} = useLocation();
    const nombreGenero = state?.genreName || 'Género';

    useEffect(() => {
        const fetchLibros = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/libros/buscar-genero`, {
                    params: {
                        page: page - 1,
                        size: itemsPerPage,
                        idGenre: idGenero
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
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
        setSearchParams({page: newPage});
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{color: '#8B0000'}}/>
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
        <BookGrid
            titulo={`Libros del género ${nombreGenero}`}
            libros={libros}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    );
};

export default BooksByGenre;
